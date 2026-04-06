# カラー×トーンのCSSプリセット集

## lp-corporate（企業LP）

### クリーン × 信頼
```css
:root {
  --bg: #FAFAFA; --bg-alt: #F0F0EE; --bg-dark: #1C1C20;
  --text: #1C1C20; --text-mid: #4A4A50; --text-light: #6E6E74;
  --accent: #2E5E8C; --line: #E0E0DC;
  --r: 4px; --mw: 1080px;
}
```
英字: DM Sans / 和文見出し: Noto Sans JP（weight: 500）

### ミニマル × 洗練
```css
:root {
  --bg: #F8F8F6; --bg-alt: #EEEEEC; --bg-dark: #18181A;
  --text: #18181A; --text-mid: #444448; --text-light: #6A6A6E;
  --accent: #333333; --line: #D8D8D4;
  --r: 2px; --mw: 1080px;
}
```
英字: DM Sans / 和文見出し: Noto Sans JP（weight: 400）

### アーティスティック × 世界観
```css
:root {
  --bg: #F5F3F0; --bg-alt: #EBE8E3; --bg-dark: #1A1816;
  --text: #1A1816; --text-mid: #4A4640; --text-light: #7A756E;
  --accent: #8B6B4A; --line: #DDD8D0;
  --r: 0px; --mw: 1080px;
}
```
英字: Playfair Display / 和文見出し: Shippori Mincho

### ウォーム × 親しみ
```css
:root {
  --bg: #FAF8F4; --bg-alt: #F2EDE5; --bg-dark: #2C2825;
  --text: #2C2825; --text-mid: #5C5650; --text-light: #7A746C;
  --accent: #3A6B5C; --line: #E0D8CC;
  --r: 8px; --mw: 1080px;
}
```
英字: Cormorant Garamond / 和文見出し: Noto Serif JP

---

## マッピング表

### Q13×Q14 → lp-corporate プリセット

| Q13 | Q14 | プリセット |
|-----|-----|-----------|
| クリーン×信頼 | 信頼・端正 | クリーン × 信頼 |
| クリーン×信頼 | ミニマル・洗練 | クリーン × 信頼 |
| ミニマル×洗練 | ミニマル・洗練 | ミニマル × 洗練 |
| ミニマル×洗練 | 信頼・端正 | ミニマル × 洗練 |
| アーティスティック×世界観 | 世界観・表現性 | アーティスティック × 世界観 |
| ウォーム×親しみ | 親しみ・安心感 | ウォーム × 親しみ |
| おまかせ | おまかせ | クリーン × 信頼（デフォルト） |

### Q1 → デフォルトプリセット

| Q1 | デフォルトプリセット |
|----|-------------------|
| 弁護士 | クリーン × 信頼 |
| 税理士 | クリーン × 信頼 |
| 社労士 | クリーン × 信頼 |
| 行政書士 | クリーン × 信頼 |
| コンサル | クリーン × 信頼 |
| IT | ミニマル × 洗練 |
| 映像・デザイン | アーティスティック × 世界観 |
| その他 | ウォーム × 親しみ |
