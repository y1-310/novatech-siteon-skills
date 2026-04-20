# Notion クエリ最適化ルール

> Phase 1.5 成果物（2026-04-20）
> **このファイルはまだ CLAUDE.md に組み込まない。**
> 秘書室導入後に CLAUDE.md の Notion 操作セクションとして統合する。

---

## 基本原則

- **フルスキャン禁止**: `page_size` 未指定 / 100 でのタスク全件取得は原則禁止
- **filter_properties 必須**: 必要なカラムのみ取得する（property ID 指定）
- **段階的取得**: まず高優先度→次に中優先度の順で小口クエリを重ねる
- **パターン選択基準**: 作業目的に合ったパターンを選ぶ（下表参照）

---

## Property ID 一覧（NovaTech タスク一覧 DB）

| カラム名 | Property ID（URL エンコード済み） | 型 |
|---------|----------------------------------|-----|
| タスク（タイトル） | `title` | title |
| ステータス | `%3AQnP` | select |
| 優先度 | `OmNv` | select |
| カテゴリ | `r%7Bog` | select |
| 備考 | `cY%3BY` | rich_text |
| 完了日 | `ff%5EB` | date |

> ⚠️ 「期限」カラムは存在しない（2026-04-20 スキーマ確認済み）

---

## クエリパターン一覧

### Pattern A — 高優先度フォーカス（推奨デフォルト）

**用途**: 今日やること確認、朝の8時自動取得（秘書室）、緊急タスク確認

| 項目 | 値 |
|------|-----|
| page_size | 10 |
| filter_properties | `title`, `%3AQnP`, `OmNv` |
| 推定出力 | ~8,710 chars / **~2,177 tokens** |
| ベースライン比 | **▲95% 削減** |

```json
{
  "database_id": "33afbbb9-a761-8113-9273-d71ec47f0c6c",
  "page_size": 10,
  "filter_properties": ["title", "%3AQnP", "OmNv"],
  "filter": {
    "and": [
      {
        "or": [
          {"property": "ステータス", "select": {"equals": "未着手"}},
          {"property": "ステータス", "select": {"equals": "進行中"}}
        ]
      },
      {"property": "優先度", "select": {"equals": "🔴高"}}
    ]
  }
}
```

---

### Pattern B — 高+中優先度（週次計画用）

**用途**: 週次振り返り、スプリント計画、全体進捗確認

| 項目 | 値 |
|------|-----|
| page_size | 20 |
| filter_properties | `title`, `%3AQnP`, `OmNv`, `r%7Bog` |
| 推定出力 | ~17,420 chars / **~4,355 tokens** |
| ベースライン比 | **▲89% 削減** |

```json
{
  "database_id": "33afbbb9-a761-8113-9273-d71ec47f0c6c",
  "page_size": 20,
  "filter_properties": ["title", "%3AQnP", "OmNv", "r%7Bog"],
  "filter": {
    "and": [
      {
        "or": [
          {"property": "ステータス", "select": {"equals": "未着手"}},
          {"property": "ステータス", "select": {"equals": "進行中"}}
        ]
      },
      {
        "or": [
          {"property": "優先度", "select": {"equals": "🔴高"}},
          {"property": "優先度", "select": {"equals": "🟡中"}}
        ]
      }
    ]
  }
}
```

---

### Pattern C — 全件取得（棚卸し専用）

**用途**: 月次棚卸し、マイグレーション、全タスク一覧が必要な場合のみ

| 項目 | 値 |
|------|-----|
| page_size | 100 |
| filter_properties | なし（全カラム） |
| 推定出力 | ~160,776 chars / **~40,194 tokens** |
| ベースライン比 | ベースライン（非推奨） |

> ⚠️ 原則禁止。明示的な理由がある場合のみ使用する。
> 出力が上限超過→ファイル保存→Read が必要（追加コスト発生）。

```json
{
  "database_id": "33afbbb9-a761-8113-9273-d71ec47f0c6c",
  "page_size": 100,
  "filter": {
    "or": [
      {"property": "ステータス", "select": {"equals": "未着手"}},
      {"property": "ステータス", "select": {"equals": "進行中"}}
    ]
  }
}
```

---

## パターン選択フローチャート

```
タスク確認の目的は？
  ├─ 今日やること / 緊急確認 → Pattern A（高優先度のみ）
  ├─ 週次計画 / 全体把握    → Pattern B（高+中）
  └─ 棚卸し / 全件必要      → Pattern C（月次のみ）
```

---

## ページネーション（has_more: true の場合）

Pattern A/B で `has_more: true` が返ったとき:

```json
{
  "start_cursor": "<returned_next_cursor>",
  "page_size": 10,
  "filter_properties": ["title", "%3AQnP", "OmNv"]
}
```

- 追加ページ取得は **本当に必要な場合のみ**。
- 高優先度が10件超ある状況はまれ → 大抵 has_more を無視してよい。

---

## 秘書室（将来）の使い方想定

秘書室が毎朝8時に自動実行するクエリ = **Pattern A**

```
朝8時 自動実行:
1. Pattern A でタスク取得（~2,177 tokens）
2. Yuichi 向けに「今日のハイライト」テキスト生成
3. Slack / LINE に送信
→ 1日あたり約 2,177 tokens（月: ~65,310 tokens）
  vs 従来全件: 40,194 tokens/日（月: ~1,205,820 tokens）
  → 月間 1,140,510 tokens 節約（95%削減）
```

---

## 更新ルール

- DB スキーマ変更時（カラム追加/削除/リネーム）はこのファイルの Property ID 一覧を更新する
- 新パターンが必要になったら D, E … と追加していく
- CLAUDE.md 統合のタイミング: cc-company 秘書室アーキテクチャ確定後
