# 予約UI 4パターン

## パターンA：外部リンク型（デフォルト）

CTAセクション内にHPB/LINE/電話ボタン。最もシンプル。
スタンダードプランはこのパターンのみ。

```html
<section id="reservation" class="section cta-section">
  <div class="container">
    <h2 lang="en">Reservation</h2>
    <p>ご予約はこちらから</p>
    <div class="cta-buttons">
      <!-- Hot Pepper Beauty -->
      <a href="{HPB_URL}" class="btn btn-primary" target="_blank" rel="noopener">
        Hot Pepper Beauty で���約
      </a>
      <!-- LINE -->
      <a href="{LINE_URL}" class="btn btn-secondary" target="_blank" rel="noopener">
        LINE で予約
      </a>
      <!-- 電話 -->
      <a href="tel:{TEL}" class="btn btn-outline">
        お電話で予約
      </a>
    </div>
  </div>
</section>
```

## パターンB：営業カレンダー型（GROEN型）

3ヶ月分月間カレンダー＋定休日マーク＋予約案内ボタン。
プロ・プレミアムプランで選択可。

```html
<section id="reservation" class="section">
  <div class="container">
    <span class="section-number">08</span>
    <h2 lang="en">Calendar</h2>
    <p class="section-subtitle">営業カレンダー</p>

    <div class="calendar-grid">
      <!-- 3ヶ月分のカレンダーを表示 -->
      <!-- 定休日は .holiday クラスでマーク -->
      <!-- JS で月の切り替えを実装 -->
    </div>

    <div class="calendar-legend">
      <span class="legend-open">○ 営業日</span>
      <span class="legend-closed">✕ 定休日</span>
    </div>

    <div class="cta-buttons">
      <a href="{RESERVATION_URL}" class="btn btn-primary" target="_blank" rel="noopener">
        ご予約はこちら
      </a>
      <a href="tel:{TEL}" class="btn btn-outline">
        お電話で予約
      </a>
    </div>
  </div>
</section>
```

### カレンダーの仕様
- 3ヶ月分を横並び（デスクトップ）/ 縦並び（モバイル）
- 定休日を視覚的にマーク
- 当日をハイライト
- JS で月の切り替え

### noscript対応
タブ → 全展開（3ヶ月全て表示）

## パターンC：予約フォーム型

Formspree / Web3Forms 送信。日付/時間/メニュー/名前/電話/備考。
仮予約の旨を明記。プライバシーポリシーページ必須。

```html
<section id="reservation" class="section">
  <div class="container">
    <span class="section-number">08</span>
    <h2 lang="en">Reservation</h2>
    <p class="section-subtitle">ご予約</p>

    <p class="notice">※こちらは仮予約フォームです。確定はサロンからのご連絡をもってとさせていただきます。</p>

    <form action="https://formspree.io/f/{FORM_ID}" method="POST" class="reservation-form">
      <div class="form-group">
        <label for="date">ご希望日</label>
        <input type="date" id="date" name="date" required>
      </div>
      <div class="form-group">
        <label for="time">ご希望時間</label>
        <select id="time" name="time" required>
          <option value="">選択してください</option>
          <!-- 営業時間に合わせた選択肢 -->
        </select>
      </div>
      <div class="form-group">
        <label for="menu">メニュ���</label>
        <select id="menu" name="menu" required>
          <option value="">選択してください</option>
          <!-- メニュー選択肢 -->
        </select>
      </div>
      <div class="form-group">
        <label for="name">お��前</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="tel">お電話番号</label>
        <input type="tel" id="tel" name="tel" required>
      </div>
      <div class="form-group">
        <label for="note">備考</label>
        <textarea id="note" name="note" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" name="privacy" required>
          <a href="privacy.html" target="_blank">プライバシーポリシー</a>に同意する
        </label>
      </div>
      <button type="submit" class="btn btn-primary">仮予約を送信</button>
    </form>
  </div>
</section>
```

### Formspreeからの通知の流れ
```
お客様がフォームに入力
  ↓
Formspreeが処理
  ↓
2箇所に通知：
  ① novatech.siteon@gmail.com → Agent が検知・対応
  ② クライアントのメール → クライアントが直接対応
```

## パターンD：予約ウィジェット埋め込み型

STORES予約・Airリザーブ等のiframe埋め込み。
プロ・プレミアムプランで選択可。

```html
<section id="reservation" class="section">
  <div class="container">
    <span class="section-number">08</span>
    <h2 lang="en">Reservation</h2>
    <p class="section-subtitle">ご予約</p>

    <div class="widget-container">
      <iframe
        src="{WIDGET_URL}"
        width="100%"
        height="600"
        frameborder="0"
        loading="lazy"
        title="予約ウィジェット"
      ></iframe>
    </div>

    <!-- iframe失敗時のフォールバック -->
    <noscript>
      <p>予約ウィジェットの表示にはJavaScriptが必要です。</p>
      <p>お電話でのご予約：<a href="tel:{TEL}">{TEL_DISPLAY}</a></p>
    </noscript>
  </div>
</section>
```

### iframe失敗時のフォールバック
電話番号を表示して予約手段を確保する。

## 予約システム推奨

STORES予約を標準採用。
- 複数メニュー対応
- 月100件まで無料
- 小規模サロン（月60〜80件）で十分
- 超える場合はSTORES有料プラン（月9,790円〜）をクライアント自身が契約
