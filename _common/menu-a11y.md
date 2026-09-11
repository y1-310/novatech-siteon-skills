# モバイルメニューのアクセシビリティ共通スクリプト

2026-09-11、`check-menu.js` を新設して「メニューを開いた状態」を初めて検査したところ、
8サイト中6サイトで **Tab がメニューの外へ抜けて背面のリンクに触れられる**状態だった。
`rules.md` アクセシビリティ 33「フォーカストラップを実装する（モーダル・メニュー）」は
書かれていたが、どの検査器も見ていなかった（Codex 監査 2026-09-11 指摘）。

サイトごとに開閉ボタンのクラス名も実装も違うため、**サイト側のコードを書き換えるのではなく、
`aria-expanded` の変化を見て後から被せる共通スクリプト**にした。既に自前で実装している
サイト（bloom）に入れても二重には効かない。

## 貼り付け位置

`</body>` の直前、サイト固有のスクリプトより **後**。サイト側が `aria-expanded` を
書き換えたあとに反応する必要がある。

## 本文

```html
<!-- モバイルメニューのフォーカストラップと背面スクロール固定（共通 / rules.md 33） -->
<script>
  (function () {
    var FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';
    var toggle = null;
    var cands = document.querySelectorAll('button[aria-expanded],[role=button][aria-expanded],a[aria-expanded]');
    for (var i = 0; i < cands.length; i++) {
      var c = cands[i];
      if (c.closest('header,nav') && c.getBoundingClientRect().top < 200) { toggle = c; break; }
    }
    if (!toggle) return;

    var panel = null;
    var id = toggle.getAttribute('aria-controls');
    if (id) panel = document.getElementById(id);

    var findPanel = function () {
      if (panel) return panel;
      // aria-controls を持たないサイト用。開いたときに一番大きく見えているナビを使う
      var best = null, area = 0;
      var list = document.querySelectorAll('nav,[role=dialog],.mobile-menu,.nav-panel,.menu-panel');
      for (var i = 0; i < list.length; i++) {
        var e = list[i];
        if (e === toggle || e.contains(toggle)) continue;
        if (e.checkVisibility && !e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
        var r = e.getBoundingClientRect();
        if (r.width * r.height > area) { area = r.width * r.height; best = e; }
      }
      return best;
    };

    var lastFocused = null;
    var scrollY = 0;
    var locked = false;

    var lock = function () {
      if (locked) return;
      locked = true;
      scrollY = window.scrollY || window.pageYOffset;
      var b = document.body;
      b.style.position = 'fixed';
      b.style.top = -scrollY + 'px';
      b.style.left = '0';
      b.style.right = '0';
      b.style.width = '100%';
    };
    var unlock = function () {
      if (!locked) return;
      locked = false;
      var b = document.body;
      b.style.position = '';
      b.style.top = '';
      b.style.left = '';
      b.style.right = '';
      b.style.width = '';
      window.scrollTo(0, scrollY);
    };

    var isOpen = function () { return toggle.getAttribute('aria-expanded') === 'true'; };

    var onOpen = function () {
      var p = findPanel();
      if (!p) return;
      // サイト側が先にパネル内へフォーカスを移していることがある。
      // その要素を「戻り先」に覚えると、閉じたあと消えた要素へ戻そうとして
      // フォーカスが body に落ちる。パネルの外にある要素だけを覚える。
      var prev = document.activeElement;
      lastFocused = (prev && !p.contains(prev) && prev !== document.body) ? prev : toggle;
      lock();
      if (!p.contains(document.activeElement)) {
        var f = p.querySelector(FOCUSABLE);
        if (f) f.focus();
      }
    };
    var onClose = function () {
      unlock();
      var back = (lastFocused && document.body.contains(lastFocused)) ? lastFocused : toggle;
      var r = back.getBoundingClientRect();
      if (!r.width || !r.height) back = toggle;
      back.focus();
      lastFocused = null;
    };

    new MutationObserver(function () {
      if (isOpen()) onOpen(); else if (locked || lastFocused) onClose();
    }).observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });

    document.addEventListener('keydown', function (ev) {
      if (!isOpen()) return;
      var p = findPanel();
      if (!p) return;

      if (ev.key === 'Escape') {
        // サイト側が自分で閉じることがある。閉じていなければこちらで閉じる
        setTimeout(function () { if (isOpen()) toggle.click(); }, 0);
        return;
      }
      if (ev.key !== 'Tab') return;

      var items = [];
      var all = p.querySelectorAll(FOCUSABLE);
      for (var i = 0; i < all.length; i++) {
        var r = all[i].getBoundingClientRect();
        if (r.width > 0 && r.height > 0) items.push(all[i]);
      }
      if (!items.length) return;
      items.push(toggle);           // 閉じるボタンも輪の中に入れる
      // Tab の順番は DOM 順で決まる。開閉ボタンがパネルより前にあるサイトでは
      // 配列の末尾＝Tab の最後、にならないため、必ず DOM 順に並べ直す。
      items.sort(function (x, y) {
        var pos = x.compareDocumentPosition(y);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });
      var first = items[0], last = items[items.length - 1];
      var a = document.activeElement;
      var inside = p.contains(a) || a === toggle;

      if (!inside) { ev.preventDefault(); first.focus(); }
      else if (ev.shiftKey && a === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && a === last) { ev.preventDefault(); first.focus(); }
    }, true);
  })();
</script>
```

## 検査

```bash
node novatech-siteon-skills/tools/check-menu.js <site-dir>
```
