# lp-barber — メンズ・バーバー

## 対象
メンズカット・バーバーショップ。フェードカット、シェービングが主力。

## 参考サイト
OTOKO DESIGN, Scissors & Scotch, Birds Barbershop, Blind Barber

## 起動条件
salon-interview から業態判定「バーバー」で呼び出される。
ヒアリング結果（JSON）を受け取り、プラン判定→参照ファイル分岐→サイト生成。

## プラン判定→参照ファイル分岐

```
スタンダード → SKILL.md + design-system.md + sections.md
プロ         → 上記 + multipage.md
プレミアム   → 上記 + multipage.md + premium.md
```

## デザイン原則（lp-salonとの違い）

| 項目 | lp-salon | lp-barber |
|------|----------|-----------|
| 背景基調 | ライト | **ダーク** |
| フォント感 | 繊細・エレガント | **力強い・ソリッド** |
| コピーのトーン | 詩的・優しい | **断言的・力強い** |
| border-radius | 0〜12px | **0px** |
| 写真のトーン | 柔らかい自然光 | **ハイコントラスト** |

## セクション構成

lp-salon と同じ構成（Hero〜Footer）。
違いはデザイントーンとコピーの書き方。

### 必須セクション

| 順序 | セクション | ナンバリング |
|------|-----------|-------------|
| 1 | Hero | — |
| 2 | Concept | 01 |
| 3 | Features | 02 |
| 4 | Menu | 03 |
| 5 | Style Gallery | 04 |
| 6 | Staff | 05 |
| 7 | Photo Gallery | 06 |
| 8 | Access | 07 |
| 9 | Reservation | 08 |
| 10 | CTA | — |
| 11 | Footer | — |

### barber固有のデザインルール

- ダーク背景がデフォルト（ライト × カジュアルも選択可）
- border-radius: 0px（角張ったデザイン）
- コピーは短く力強い。「〜いたします」より「〜する」
- 写真はハイコントラスト（暗めの背景＋スポットライト風）
- セクション区切り線も暗めの色（var(--line)が暗色系）

### プラン別の制約

lp-salon と同一。SKILL.md のプラン別制約表を参照。

## Codexへの指示テンプレート

```
【セクション名】{セクション}
【プリセット】{カラープリセット名}
【パターン】{選択されたパターン}
【業態】バーバー
【トーン】力強い・断言的。「〜いたします」ではなく「〜する」
【ヒアリング情報】
{該当するヒアリング回答}

以下のルールに従ってHTMLを生成してください：
- ダーク背景前提（ライト×カジュアル選択時を除く）
- CSS変数を使用。ハードコードしない
- border-radius: 0px（var(--r): 0px）
- 全imgにalt（日本語）、width、height、loading="lazy"（ヒ���ロー除く）
- Inter/Arial/Roboto/Helvetica禁止
```
