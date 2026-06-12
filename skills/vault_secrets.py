"""
Shared secret detection for vault-lint, vault-report, vault-compile.
Only category names are ever returned — no secret content leaves this module.
"""
import re
from typing import List, Tuple

_CHECKS: List[Tuple["re.Pattern[str]", str]] = [
    (re.compile(r"(?i)api[_-]?key\s*[:=]\s*\S+", re.MULTILINE), "api_key"),
    (re.compile(r"(?i)token\s*[:=]\s*[A-Za-z0-9+/]{20,}", re.MULTILINE), "token"),
    (re.compile(r"(?i)password\s*[:=]\s*\S+", re.MULTILINE), "password"),
    (re.compile(r"(?i)bearer\s+[A-Za-z0-9\-._~+/]+=*", re.MULTILINE), "bearer_token"),
    (re.compile(r"sk-[A-Za-z0-9]{20,}"), "openai_secret_key"),
    (re.compile(r"eyJ[A-Za-z0-9_-]+\.eyJ"), "jwt"),
    (re.compile(r"xox[bpas]-[A-Za-z0-9\-]+"), "slack_token"),
    (re.compile(r"xapp-[0-9]+-[A-Za-z0-9]+"), "slack_app_token"),
    (re.compile(r"ghp_[A-Za-z0-9]{36}"), "github_pat"),
    (re.compile(r"github_pat_[A-Za-z0-9_]+"), "github_pat_fine_grained"),
    (re.compile(r"AKIA[0-9A-Z]{16}"), "aws_access_key"),
    (re.compile(r"ASIA[0-9A-Z]{16}"), "aws_temp_key"),
    (re.compile(r"AIza[0-9A-Za-z\-_]{35}"), "google_api_key"),
    (re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY"), "pem_private_key"),
    (re.compile(r"(?i)^Set-Cookie\s*:\s*\S+=\S+", re.MULTILINE), "set_cookie_header"),
    (re.compile(r"(?i)^Cookie\s*:\s*\S+=\S+", re.MULTILINE), "cookie_header"),
    (re.compile(r"(?i)sessionid\s*[=:]\s*\S+", re.MULTILINE), "sessionid"),
]


def detect_secrets(text: str) -> List[str]:
    """Return list of detected category names. Never returns secret content."""
    return [category for pattern, category in _CHECKS if pattern.search(text)]


def has_secrets(text: str) -> bool:
    return any(p.search(text) for p, _ in _CHECKS)
