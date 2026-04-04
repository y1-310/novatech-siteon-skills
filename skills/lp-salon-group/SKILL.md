# lp-salon-group — 多店舗・グループサロン

## 対象
4店舗以上を運営するサロングループ・法人。

## 起動条件
salon-interview で「複数店舗あり」と判明した場合に呼び出される。
ヒアリング結果（JSON）を受け取り、サイト生成。

## 構造

```
index.html       ← グループトップ
├── yamato.html  ← 各店舗ページ（lp-salonの構造を流用）
├── turuma.html
└── sakuragaoka.html
```

最初からマルチページ前提。グループトップ＋各店舗ページの構成。

## プラン判定→参照ファイル分岐

```
グループサロン → SKILL.md + design-system.md + sections.md
（multipage.md / premium.md は不要。最初からマルチページ構造）
```

※プレミアム相当の機能が必要な場合は、lp-salon の premium.md を参考にする。

## 追加セクション（グループ固有）

lp-salon のセクションに加え、以下のグループ固有セクションを含む：

| セクション | 概要 |
|-----------|------|
| Salon List | 各店舗一覧（写真＋住所＋「詳しく見る」リンク） |
| Company / About | 会社概要・代表メッセージ・沿革 |
| Topics / News | お知らせ・新着情報 |
| Recruit | 採用情報（グループ全体） |

## Codexへの指示テンプレート

```
【セクション名】{セクション}
【プリセット】コーポレート × クリーン
【グループ情報】
- グループ名：{グループ名}
- 店舗数：{数}
- 各店舗：{店舗名リスト}
【ヒアリング情報】
{該当するヒアリング回答}

以下のルールに従ってHTMLを生成してください：
- コーポレートサイトとしてのトーン
- CSS変数を使用。ハードコードしない
- 全imgにalt（日本語）、width、height、loading="lazy"（ヒーロー除く）
- Inter/Arial/Roboto/Helvetica禁止
- 各店舗ページはlp-salonの構造を流用
```
