#!/usr/bin/env python3
"""
Automated tests for vault-lint, vault-report, vault-compile.
All tests run scripts as subprocesses against isolated tmp Vaults.
"""
import os
import subprocess
import sys
import tempfile
import time
import unittest
from datetime import date, timedelta
from pathlib import Path

SKILLS_DIR = Path(__file__).resolve().parent.parent
LINT = SKILLS_DIR / "vault-lint" / "scripts" / "lint.py"
REPORT = SKILLS_DIR / "vault-report" / "scripts" / "report.py"
COMPILE = SKILLS_DIR / "vault-compile" / "scripts" / "compile.py"


def run(script: Path, args: list) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, str(script)] + args,
        capture_output=True, text=True,
    )


class TmpVault:
    """Context manager: minimal Vault skeleton in a temp directory."""

    def __enter__(self) -> "TmpVault":
        self._tmp = tempfile.TemporaryDirectory()
        self.path = Path(self._tmp.name)
        for d in ("Raw", "Reports", "Projects", "Decisions", "SOP", "Lessons"):
            (self.path / d).mkdir()
        (self.path / "AI_INDEX.md").write_text(
            "# AI INDEX\n\n[[Projects/test]]\n[[Decisions/test]]\n",
            encoding="utf-8",
        )
        return self

    def __exit__(self, *_) -> None:
        self._tmp.cleanup()

    def note(self, rel_path: str, content: str) -> Path:
        p = self.path / rel_path
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")
        return p

    def raw(self, name: str, content: str) -> Path:
        return self.note(f"Raw/{name}", content)


# ---------------------------------------------------------------------------
# 1. vault-report does not copy secret content into Reports/
# ---------------------------------------------------------------------------
class TestReportSecretFiltering(unittest.TestCase):
    def test_api_key_not_in_report_output(self):
        """report must not copy api_key value into stdout or Reports/."""
        with TmpVault() as v:
            secret = "supersecretkey_abcdefgh1234"
            v.note("AI_INDEX.md",
                   "# AI INDEX\n[[Projects/secret]]\n[[Projects/clean1]]\n[[Projects/clean2]]\n")
            v.note("Projects/secret.md", f"# Secret\napi_key = {secret}\n")
            v.note("Projects/clean1.md", "# Clean one\nsome normal content here\n")
            v.note("Projects/clean2.md", "# Clean two\nother normal content here\n")
            r = run(REPORT, ["--vault", str(v.path), "--topic", "projects clean", "--dry-run"])
            self.assertNotIn(secret, r.stdout, "secret value must not appear in stdout")
            self.assertNotIn(secret, r.stderr, "secret value must not appear in stderr")

    def test_exits_nonzero_when_no_clean_notes_remain(self):
        """When all notes have secrets, report exits 1 and generates nothing."""
        with TmpVault() as v:
            v.note("AI_INDEX.md", "# AI INDEX\n[[Projects/poisoned]]\n")
            v.note("Projects/poisoned.md",
                   "# Poisoned\napi_key = my_secret_api_key_12345678\n")
            r = run(REPORT, ["--vault", str(v.path), "--topic", "poisoned", "--dry-run"])
            self.assertNotEqual(r.returncode, 0)
            self.assertNotIn("my_secret_api_key", r.stdout)
            self.assertNotIn("my_secret_api_key", r.stderr)


# ---------------------------------------------------------------------------
# 2. lint/compile do not leak secret fragments in stdout/stderr
# ---------------------------------------------------------------------------
class TestNoSecretLeakage(unittest.TestCase):
    def test_lint_no_api_key_in_output(self):
        """lint must not output api_key value; must report L8 with category only."""
        with TmpVault() as v:
            secret_val = "mysecretapikey12345678"
            v.note("Projects/secret.md", f"# Note\napi_key = {secret_val}\n")
            r = run(LINT, ["--vault", str(v.path), "--dry-run"])
            self.assertNotIn(secret_val, r.stdout)
            self.assertNotIn(secret_val, r.stderr)
            self.assertIn("L8", r.stdout)
            self.assertIn("カテゴリ=", r.stdout)

    def test_compile_no_secret_in_output(self):
        """compile must not output secret content in stdout or stderr."""
        with TmpVault() as v:
            secret_val = "sk-" + "A" * 25
            v.raw("test-note.md", f"# Raw Note\nThis has a key sk-{secret_val}\n")
            r = run(COMPILE, ["--vault", str(v.path), "--dry-run"])
            self.assertNotIn(secret_val, r.stdout)
            self.assertNotIn(secret_val, r.stderr)


# ---------------------------------------------------------------------------
# 3. Secret pattern coverage
# ---------------------------------------------------------------------------
class TestSecretPatternCoverage(unittest.TestCase):
    def setUp(self):
        sys.path.insert(0, str(SKILLS_DIR))
        from vault_secrets import detect_secrets  # noqa: PLC0415
        self.detect = detect_secrets

    def test_slack_xoxb(self):
        self.assertIn("slack_token", self.detect("xoxb-123456789-abcdef"))

    def test_slack_xoxp(self):
        self.assertIn("slack_token", self.detect("xoxp-111-222-333"))

    def test_github_pat(self):
        self.assertIn("github_pat", self.detect("ghp_" + "A" * 36))

    def test_github_pat_fine_grained(self):
        self.assertIn("github_pat_fine_grained", self.detect("github_pat_abc123def456"))

    def test_aws_access_key(self):
        self.assertIn("aws_access_key", self.detect("AKIA" + "A" * 16))

    def test_aws_temp_key(self):
        self.assertIn("aws_temp_key", self.detect("ASIA" + "B" * 16))

    def test_cookie_header(self):
        self.assertIn("cookie_header", self.detect("Cookie: sessionid=abc123\n"))

    def test_set_cookie_header(self):
        self.assertIn("set_cookie_header", self.detect("Set-Cookie: token=xyz\n"))

    def test_pem_private_key(self):
        self.assertIn("pem_private_key", self.detect("-----BEGIN PRIVATE KEY\nabc"))

    def test_rsa_private_key(self):
        self.assertIn("pem_private_key", self.detect("-----BEGIN RSA PRIVATE KEY\nabc"))

    def test_sessionid(self):
        self.assertIn("sessionid", self.detect("sessionid=abc123def456"))

    def test_google_api_key(self):
        self.assertIn("google_api_key", self.detect("AIza" + "A" * 35))

    def test_openai_sk(self):
        self.assertIn("openai_secret_key", self.detect("sk-" + "z" * 25))

    def test_jwt(self):
        self.assertIn("jwt", self.detect("eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0"))


# ---------------------------------------------------------------------------
# 4. compile: protected dir and path traversal rejection
# ---------------------------------------------------------------------------
class TestCompilePathValidation(unittest.TestCase):
    def test_decisions_via_traversal_exits_nonzero(self):
        """compile --file ../../Decisions/foo.md must exit non-zero."""
        with TmpVault() as v:
            v.note("Decisions/foo.md", "# Decision\nsome content\n")
            r = run(COMPILE, ["--vault", str(v.path), "--file", "../../Decisions/foo.md"])
            self.assertNotEqual(r.returncode, 0)

    def test_absolute_path_outside_raw_rejected(self):
        """compile --file /etc/hosts (absolute, outside vault) must exit non-zero."""
        with TmpVault() as v:
            r = run(COMPILE, ["--vault", str(v.path), "--file", "/etc/hosts"])
            self.assertNotEqual(r.returncode, 0)

    def test_symlink_escape_rejected(self):
        """compile --file symlink resolving outside Raw/ must exit non-zero."""
        with TmpVault() as v:
            outside = v.path / "outside.md"
            outside.write_text("# Outside\ncontent\n", encoding="utf-8")
            link = v.path / "Raw" / "link.md"
            link.symlink_to(outside)
            r = run(COMPILE, ["--vault", str(v.path), "--file", "link.md"])
            self.assertNotEqual(r.returncode, 0)

    def test_valid_raw_file_succeeds(self):
        """compile --file with a valid Raw/ file must exit 0."""
        with TmpVault() as v:
            v.raw("clean.md", "# Clean Note\n判断: 採用した\n")
            r = run(COMPILE, ["--vault", str(v.path), "--file", "clean.md", "--dry-run"])
            self.assertEqual(r.returncode, 0)


# ---------------------------------------------------------------------------
# 5. report: note selection and --notes validation
# ---------------------------------------------------------------------------
class TestReportNoteSelection(unittest.TestCase):
    def test_score0_notes_not_selected(self):
        """Links with 0 topic relevance are excluded; exits 1 if < MIN_NOTES remain."""
        with TmpVault() as v:
            v.note("AI_INDEX.md",
                   "# AI INDEX\n[[Projects/unrelated]]\n[[Decisions/another]]\n")
            v.note("Projects/unrelated.md", "# Unrelated\ncontent\n")
            v.note("Decisions/another.md", "# Another\ncontent\n")
            r = run(REPORT, ["--vault", str(v.path),
                              "--topic", "xyzmatchnothing", "--dry-run"])
            self.assertNotEqual(r.returncode, 0)

    def test_vault_external_notes_rejected(self):
        """--notes with path outside vault must exit non-zero."""
        with TmpVault() as v:
            r = run(REPORT, ["--vault", str(v.path),
                              "--topic", "test", "--notes", "/etc/passwd"])
            self.assertNotEqual(r.returncode, 0)

    def test_duplicate_notes_deduped(self):
        """Specifying the same note twice via --notes selects it only once."""
        with TmpVault() as v:
            v.note("Projects/a.md", "# A\ncontent alpha\n")
            v.note("Projects/b.md", "# B\ncontent beta\n")
            r = run(REPORT, [
                "--vault", str(v.path),
                "--topic", "test",
                "--notes", "Projects/a.md,Projects/b.md,Projects/a.md",
                "--dry-run",
            ])
            # Deduplicated: a.md appears exactly 3 times (frontmatter, body, reference)
            count = r.stdout.count("Projects/a.md")
            self.assertEqual(count, 3)

    def test_dry_run_no_reports_write(self):
        """--dry-run must not create any files in Reports/."""
        with TmpVault() as v:
            v.note("AI_INDEX.md",
                   "# AI INDEX\n[[Projects/topicA]]\n[[Projects/topicB]]\n")
            v.note("Projects/topicA.md", "# Topic A note\nnormal content\n")
            v.note("Projects/topicB.md", "# Topic B note\nnormal content\n")
            reports_before = sorted(str(p) for p in (v.path / "Reports").rglob("*"))
            run(REPORT, ["--vault", str(v.path), "--topic", "topic", "--dry-run"])
            reports_after = sorted(str(p) for p in (v.path / "Reports").rglob("*"))
            self.assertEqual(reports_before, reports_after)


# ---------------------------------------------------------------------------
# 6. current.md date logic
# ---------------------------------------------------------------------------
class TestCurrentMdDateLogic(unittest.TestCase):
    def test_last_updated_label_prevents_false_l4(self):
        """最終更新ラベルが今日→L4を出さない（決定日が古くても）。"""
        with TmpVault() as v:
            today_str = date.today().isoformat()
            v.note("Projects/alpha/current.md", (
                "# Current\n"
                "決定日: 2020-01-01\n"
                f"最終更新: {today_str}\n"
                "根拠: https://github.com/example\n"
            ))
            r = run(LINT, ["--vault", str(v.path), "--dry-run"])
            self.assertNotIn("L4", r.stdout)

    def test_mtime_used_when_no_label(self):
        """最終更新ラベルがない場合はmtimeを使い、古いmtime→L4。"""
        with TmpVault() as v:
            note_path = v.note("Projects/beta/current.md", (
                "# Current\n"
                "決定日: 2099-12-31\n"
                "根拠: https://github.com/example\n"
            ))
            old_time = time.mktime(
                (date.today() - timedelta(days=30)).timetuple()
            )
            os.utime(str(note_path), (old_time, old_time))
            r = run(LINT, ["--vault", str(v.path), "--dry-run"])
            self.assertIn("L4", r.stdout)

    def test_saigo_kakunin_label_also_works(self):
        """最終確認ラベルも今日→L4なし。"""
        with TmpVault() as v:
            today_str = date.today().isoformat()
            v.note("Projects/gamma/current.md", (
                "# Current\n"
                f"最終確認: {today_str}\n"
                "根拠: https://github.com/example\n"
            ))
            r = run(LINT, ["--vault", str(v.path), "--dry-run"])
            self.assertNotIn("L4", r.stdout)


# ---------------------------------------------------------------------------
# 7. Duplicate detection: Projects/current.md are not flagged
# ---------------------------------------------------------------------------
class TestDuplicateDetection(unittest.TestCase):
    def test_projects_current_md_not_duplicate(self):
        """current.md in multiple Projects dirs must NOT trigger L3."""
        with TmpVault() as v:
            v.note("Projects/alpha/current.md",
                   "# Alpha Current\nsome content\nroot: https://example.com\n")
            v.note("Projects/beta/current.md",
                   "# Beta Current\nother content\nroot: https://other.com\n")
            r = run(LINT, ["--vault", str(v.path), "--dry-run"])
            self.assertNotIn("L3", r.stdout)

    def test_same_stem_same_title_is_flagged(self):
        """Two non-structural notes with same stem AND same H1 title trigger L3."""
        with TmpVault() as v:
            v.note("SOP/workflow.md", "# Workflow Guide\nstep 1\nstep 2\n")
            v.note("Lessons/workflow.md", "# Workflow Guide\nstep 1\nstep 2\n")
            r = run(LINT, ["--vault", str(v.path), "--dry-run"])
            self.assertIn("L3", r.stdout)

    def test_same_stem_different_title_not_flagged(self):
        """Same stem but different H1 titles must NOT trigger L3."""
        with TmpVault() as v:
            v.note("SOP/setup.md", "# Setup Guide\nstep A\n")
            v.note("Lessons/setup.md", "# Setup Lessons\nlesson B\n")
            r = run(LINT, ["--vault", str(v.path), "--dry-run"])
            self.assertNotIn("L3", r.stdout)


# ---------------------------------------------------------------------------
# 8. compile --dry-run does not write to Reports/
# ---------------------------------------------------------------------------
class TestCompileDryRun(unittest.TestCase):
    def test_dry_run_no_reports_write(self):
        """compile --dry-run must not create any files in Reports/."""
        with TmpVault() as v:
            v.raw("notes.md", "# Raw Note\n判断: 採用した\n")
            reports_before = sorted(str(p) for p in (v.path / "Reports").rglob("*"))
            r = run(COMPILE, ["--vault", str(v.path), "--dry-run"])
            reports_after = sorted(str(p) for p in (v.path / "Reports").rglob("*"))
            self.assertEqual(reports_before, reports_after)
            self.assertEqual(r.returncode, 0)


# ---------------------------------------------------------------------------
# 9. Real Vault smoke tests (dry-run / read-only)
# ---------------------------------------------------------------------------
class TestRealVaultDryRun(unittest.TestCase):
    VAULT = Path("/Users/satouyuuichi/Developer/Knowledge")

    def setUp(self) -> None:
        if not self.VAULT.exists():
            self.skipTest(f"Real vault not found: {self.VAULT}")

    def _protected_mtimes(self) -> dict:
        mtimes = {}
        for d in ("Projects", "Decisions", "SOP", "Lessons"):
            dd = self.VAULT / d
            if dd.exists():
                for p in dd.rglob("*"):
                    if p.is_file():
                        mtimes[str(p)] = p.stat().st_mtime
        return mtimes

    def test_lint_dry_run_no_mtime_change(self):
        """lint --dry-run must not modify Projects/Decisions/SOP/Lessons mtimes."""
        before = self._protected_mtimes()
        run(LINT, ["--vault", str(self.VAULT), "--dry-run"])
        after = self._protected_mtimes()
        self.assertEqual(before, after)

    def test_lint_no_secret_content_in_output(self):
        """lint L8 output must contain category name but not raw secret value."""
        r = run(LINT, ["--vault", str(self.VAULT), "--dry-run"])
        for line in r.stdout.splitlines():
            if "L8" in line and "detail" not in line:
                self.assertIn("カテゴリ=", line,
                              "L8 output must use category= not raw secret")

    def test_reports_no_secret_content(self):
        """Reports/ must not contain any detectable secret values after lint run."""
        reports_dir = self.VAULT / "Reports"
        if not reports_dir.exists():
            self.skipTest("No Reports/ directory")
        sys.path.insert(0, str(SKILLS_DIR))
        from vault_secrets import has_secrets  # noqa: PLC0415
        for p in reports_dir.glob("vault-lint-*.md"):
            content = p.read_text(encoding="utf-8", errors="ignore")
            self.assertFalse(
                has_secrets(content),
                f"Secret content found in report file: {p.name}",
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
