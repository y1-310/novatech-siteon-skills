# カラー×トーンのCSSプリセット集

> このファイルは全 lp-* スキルのカラープリセットの **Single Source of Truth**。
> 各 `lp-*/references/design-system.md` はこのファイルを参照すること。
> プリセットの色コード・フォント名を変更する場合は必ずここで更新する。

## lp-salon（女性向け美容室）

### グレージュ × モード
```css
:root {
  --bg: #F7F5F2; --bg-alt: #EFECE7; --bg-dark: #1C1B19;
  --text: #1A1918; --text-mid: #44403B; --text-light: #6E6860;
  --accent: #7A6A58; --line: #D4CDC3;
  --r: 3px; --mw: 1080px;
}
```
英字: Playfair Display / 和文見出し: Shippori Mincho

### ナチュラル × 上品
```css
:root {
  --bg: #FAF8F4; --bg-alt: #F2EDE5; --bg-dark: #2C2825;
  --text: #2C2825; --text-mid: #5C5650; --text-light: #7A746C;
  --accent: #6B8A5E; --line: #E0D8CC;
  --r: 8px; --mw: 1080px;
}
```
英字: Cormorant Garamond / 和文見出し: Zen Old Mincho

### モノトーン × モード
```css
:root {
  --bg: #F5F5F3; --bg-alt: #EAEAE7; --bg-dark: #111110;
  --text: #111110; --text-mid: #3D3D3A; --text-light: #5E5E58;
  --accent: #B09B72; --line: #D5D5D0;
  --r: 0px; --mw: 1080px;
}
```
英字: DM Serif Display / 和文見出し: Shippori Mincho

### くすみカラー × 温もり
```css
:root {
  --bg: #F8F4F2; --bg-alt: #F0EAE6; --bg-dark: #2A2425;
  --text: #2A2425; --text-mid: #524A4C; --text-light: #7A7072;
  --accent: #B5868A; --line: #E0D6D4;
  --r: 12px; --mw: 1080px;
}
```
英字: Cormorant Garamond / 和文見出し: Noto Serif JP

---

## lp-barber（メンズ・バーバー）

### ダーク × ソリッド（デフォルト）
```css
:root {
  --bg: #141312; --bg-alt: #1E1D1B; --bg-dark: #0A0A09;
  --text: #E8E4DF; --text-mid: #A8A29B; --text-light: #6E6A64;
  --accent: #C4A265; --line: #2E2D2A;
  --r: 0px; --mw: 1080px;
}
```
英字: DM Serif Display / 和文見出し: Shippori Mincho

### ダーク × ヴィンテージ
```css
:root {
  --bg: #1A1714; --bg-alt: #231F1B; --bg-dark: #0D0B09;
  --text: #E0D5C8; --text-mid: #9E9285; --text-light: #6B6158;
  --accent: #B87333; --line: #332E28;
  --r: 0px; --mw: 1080px;
}
```
英字: Playfair Display / 和文見出し: Noto Serif JP

### ライト × カジュアル（Birds型）
```css
:root {
  --bg: #F5F0E8; --bg-alt: #EBE5DA; --bg-dark: #1A1918;
  --text: #1A1918; --text-mid: #4A4540; --text-light: #7A756E;
  --accent: #C05835; --line: #D8D0C4;
  --r: 4px; --mw: 1080px;
}
```
英字: DM Sans / 和文見出し: Noto Sans JP（weight: 500）

---

## lp-nail-esthe（ネイル・エステ・まつエク）

### フェミニン × 上品
```css
:root {
  --bg: #FAF6F5; --bg-alt: #F2ECEB; --bg-dark: #2A2325;
  --text: #2A2325; --text-mid: #524A4C; --text-light: #7A7072;
  --accent: #C4919A; --line: #E0D6D4;
  --r: 12px; --mw: 1080px;
}
```
英字: Cormorant Garamond / 和文見出し: Noto Serif JP

### ラベンダー × 洗練
```css
:root {
  --bg: #F7F5F9; --bg-alt: #EEEAF2; --bg-dark: #22202A;
  --text: #22202A; --text-mid: #4A4558; --text-light: #6E6880;
  --accent: #8E7BA8; --line: #D8D4E0;
  --r: 8px; --mw: 1080px;
}
```
英字: Playfair Display / 和文見出し: Shippori Mincho

### ベージュ × ナチュラル（エステ向き）
```css
:root {
  --bg: #F9F6F1; --bg-alt: #F0EBE3; --bg-dark: #28251F;
  --text: #28251F; --text-mid: #4A4540; --text-light: #7A756E;
  --accent: #A6896E; --line: #E0D8CC;
  --r: 8px; --mw: 1080px;
}
```
英字: Cormorant Garamond / 和文見出し: Zen Old Mincho

---

## lp-salon-group（多店舗・グループサロン）

### コーポレート × クリーン
```css
:root {
  --bg: #F5F5F3; --bg-alt: #EDEDEA; --bg-dark: #18181A;
  --text: #18181A; --text-mid: #3D3D3A; --text-light: #5E5E58;
  --accent: #3A6B5C; --line: #D5D5D0;
  --r: 4px; --mw: 1200px;
}
```
英字: DM Sans / 和文見出し: Noto Sans JP（weight: 500）

---

## マッピング表

### Q13×Q14 → lp-salon プリセット

| Q13 | Q14 | プリセット |
|-----|-----|-----------|
| グレージュ | モード・洗練 | グレージュ × モード |
| グレージュ | 静謐・上品 | グレージュ × モード |
| ナチュラル | 温もり・親しみ | ナチュラル × 上品 |
| ナチュラル | 静謐・上品 | ナチュラル × 上品 |
| モノトーン×ゴールド | モード・洗練 | モノトーン × モード |
| モノトーン×ゴールド | 静謐・上品 | モノトーン × モード |
| くすみカラー | 温もり・親しみ | くすみカラー × 温もり |
| くすみカラー | 静謐・上品 | くすみカラー × 温もり |
| おまかせ | おまかせ | グレージュ × モード（デフォルト） |

### Q13×Q14 → lp-barber プリセット（全12組み合わせカバー）

| Q13 | Q14 | プリセット |
|-----|-----|-----------|
| モノトーン×ゴールド | モード・洗練 | ダーク × ソリッド |
| モノトーン×ゴールド | 静謐・上品 | ダーク × ソリッド |
| モノトーン×ゴールド | 温もり・親しみ | ダーク × ヴィンテージ |
| グレージュ | モード・洗練 | ダーク × ヴィンテージ |
| グレージュ | 静謐・上品 | ダーク × ヴィンテージ |
| グレージュ | 温もり・親しみ | ダーク × ヴィンテージ |
| ナチュラル | 温もり・親しみ | ライト × カジュアル |
| ナチュラル | 静謐・上品 | ライト × カジュアル |
| ナチュラル | モード・洗練 | ダーク × ヴィンテージ |
| くすみカラー | 温もり・親しみ | ダーク × ヴィンテージ |
| くすみカラー | 静謐・上品 | ダーク × ヴィンテージ |
| くすみカラー | モード・洗練 | ダーク × ソリッド |
| おまかせ | おまかせ | ダーク × ソリッド（デフォルト） |
| 上記以外の任意の組み合わせ | — | ダーク × ソリッド（フォールバック） |

### Q13×Q14 → lp-nail-esthe プリセット（全12組み合わせカバー）

| Q13 | Q14 | プリセット |
|-----|-----|-----------|
| くすみカラー | 静謐・上品 | フェミニン × 上品 |
| くすみカラー | 温もり・親しみ | フェミニン × 上品 |
| くすみカラー | モード・洗練 | ラベンダー × 洗練 |
| モノトーン×ゴールド | モード・洗練 | ラベンダー × 洗練 |
| モノトーン×ゴールド | 静謐・上品 | ラベンダー × 洗練 |
| モノトーン×ゴールド | 温もり・親しみ | フェミニン × 上品 |
| ナチュラル | 温もり・親しみ | ベージュ × ナチュラル |
| ナチュラル | 静謐・上品 | ベージュ × ナチュラル |
| ナチュラル | モード・洗練 | ベージュ × ナチュラル |
| グレージュ | 静謐・上品 | ベージュ × ナチュラル |
| グレージュ | 温もり・親しみ | ベージュ × ナチュラル |
| グレージュ | モード・洗練 | ラベンダー × 洗練 |
| おまかせ | おまかせ | フェミニン × 上品（デフォルト） |
| 上記以外の任意の組み合わせ | — | フェミニン × 上品（フォールバック） |
