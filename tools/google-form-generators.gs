/**
 * SITEON 新業態 ヒアリング用 Google Form 生成スクリプト
 *
 * 使い方:
 * 1. https://script.google.com/ で新規プロジェクト作成
 * 2. このファイル全体をコピペ
 * 3. 関数選択 → createAllForms を実行（初回は権限承認）
 * 4. 実行ログにフォームURLが3つ出力される
 *
 * 個別実行:
 *   createArchitectInterviewForm()
 *   createRestaurantInterviewForm()
 *   createCorporateInterviewForm()
 */

function createArchitectInterviewForm() {
  var form = FormApp.create('建築事務所・工務店・リノベ ヒアリング');

  form.setDescription('建築事務所・工務店・リノベーション事業向けのヒアリングフォームです。');

  form.addMultipleChoiceItem().setTitle('契約形態は？').setChoiceValues(['SITEON サブスク', 'NovaTech 受託（買い切り）']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('プランは？').setChoiceValues(['スタンダード', 'プロフェッショナル', 'プレミアム']);

  form.addPageBreakItem().setTitle('Round 1: 基本情報');
  form.addMultipleChoiceItem().setTitle('Q1 業態は？').setChoiceValues(['設計事務所', '工務店', 'リノベーション会社', 'その他']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('Q1.5 主な対象は？').setChoiceValues(['住宅（新築）', '住宅（リフォーム）', '店舗・商業', 'マンションリノベ', '複合']);
  form.addTextItem().setTitle('Q2 事務所名（英語）');
  form.addTextItem().setTitle('Q3 事務所名（日本語・サブ）');
  form.addTextItem().setTitle('Q4 エリア・最寄り駅');
  form.addParagraphTextItem().setTitle('Q5 住所');

  form.addPageBreakItem().setTitle('Round 2: 営業情報');
  form.addTextItem().setTitle('Q6 営業時間');
  form.addTextItem().setTitle('Q7 定休日');
  form.addTextItem().setTitle('Q8 電話番号');
  form.addCheckboxItem().setTitle('Q8.5 お支払い方法').setChoiceValues(['現金', 'クレジットカード', 'PayPay', '交通系IC', 'その他']);
  form.addCheckboxItem().setTitle('Q9 問い合わせ方法').setChoiceValues(['フォーム', '電話', 'メール', 'LINE', 'その他']);

  form.addPageBreakItem().setTitle('Round 3: サービス情報');
  form.addParagraphTextItem().setTitle('Q10 主要サービス＋価格目安').setHelpText('例: 設計監理料 工事金額の10%');
  form.addMultipleChoiceItem().setTitle('Q10.5 施工事例の数').setChoiceValues(['3件以下', '4〜10件', '11件以上']);
  form.addParagraphTextItem().setTitle('Q11 資格・受賞歴');
  form.addParagraphTextItem().setTitle('Q11.5 スタッフ人数・名前');

  form.addPageBreakItem().setTitle('Round 4: デザイン方針');
  form.addMultipleChoiceItem().setTitle('Q13 カラー方向性').setChoiceValues(['ホワイト×ナチュラル', 'ウォーム×木目', 'ミニマル×モノトーン', 'おまかせ']);
  form.addMultipleChoiceItem().setTitle('Q14 全体のトーン').setChoiceValues(['静謐・上品', '温もり・親しみ', 'モード・洗練', 'おまかせ']);
  form.addMultipleChoiceItem().setTitle('Q15 コンセプトの語り方').setChoiceValues(['3段構造', 'ストーリー型', '一言コピー型', 'おまかせ']);
  form.addMultipleChoiceItem().setTitle('Q16 Worksの表示形式').setChoiceValues(['グリッド一覧', '大写真+テキスト', 'カテゴリタブ', 'おまかせ']);

  form.addPageBreakItem().setTitle('Round 5: 追加要件');
  form.addCheckboxItem().setTitle('Q18 追加セクション').setChoiceValues(['設計料目安', 'ブログ・コラム', '受賞歴', '商品ライン', '性能数値', 'イベント', 'モデルルーム', 'ビフォーアフター', '費用ガイド', '採用', '特になし']);
  form.addMultipleChoiceItem().setTitle('Q19 写真素材').setChoiceValues(['手元にある', 'まだない（プレースホルダー）']);
  form.addTextItem().setTitle('Q20 参考サイトURL');

  Logger.log(form.getPublishedUrl());
}

function createRestaurantInterviewForm() {
  var form = FormApp.create('飲食店 ヒアリング');

  form.setDescription('飲食店向けのヒアリングフォームです。');

  form.addMultipleChoiceItem().setTitle('契約形態は？').setChoiceValues(['SITEON サブスク', 'NovaTech 受託（買い切り）']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('プランは？').setChoiceValues(['スタンダード', 'プロフェッショナル', 'プレミアム']);

  form.addPageBreakItem().setTitle('Round 1: 基本情報');
  form.addMultipleChoiceItem().setTitle('Q1 業態は？').setChoiceValues(['カフェ', 'レストラン', 'バー', '居酒屋', 'ラーメン屋', '定食屋・食堂', 'その他']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('Q1.5 客単価帯は？').setChoiceValues(['〜1,000円', '1,000〜3,000円', '3,000〜5,000円', '5,000円〜']);
  form.addTextItem().setTitle('Q2 店舗名（英語）');
  form.addTextItem().setTitle('Q3 店舗名（日本語・サブ）');
  form.addTextItem().setTitle('Q4 エリア・最寄り駅');
  form.addParagraphTextItem().setTitle('Q5 住所');

  form.addPageBreakItem().setTitle('Round 2: 営業情報');
  form.addTextItem().setTitle('Q6 営業時間');
  form.addTextItem().setTitle('Q7 定休日');
  form.addTextItem().setTitle('Q8 電話番号');
  form.addCheckboxItem().setTitle('Q8.5 お支払い方法').setChoiceValues(['現金', 'クレジットカード', 'PayPay', '交通系IC', 'その他']);
  form.addCheckboxItem().setTitle('Q9 予約方法').setChoiceValues(['食べログ', 'ぐるなび', 'ホットペッパー', 'TableCheck', 'LINE', '電話', 'Instagram DM', '予約不要', 'その他']);
  form.addMultipleChoiceItem().setTitle('Q9.5 テイクアウト対応').setChoiceValues(['あり', 'なし']);
  form.addMultipleChoiceItem().setTitle('Q9.7 通販（EC）対応').setChoiceValues(['あり', 'なし', '検討中']);

  form.addPageBreakItem().setTitle('Round 3: メニュー情報');
  form.addParagraphTextItem().setTitle('Q10 メニュー構成').setHelpText('主要メニュー3〜5つ＋価格');
  form.addMultipleChoiceItem().setTitle('Q10.5 コース料理はありますか？').setChoiceValues(['あり', 'なし']);
  form.addParagraphTextItem().setTitle('Q11 スタッフ・シェフ名');
  form.addMultipleChoiceItem().setTitle('Q12 メニュー表示形式').setChoiceValues(['カテゴリ別リスト', '写真付きカード', 'シーン別タブ', 'コース表示', 'シンプルリスト', 'おまかせ']);

  form.addPageBreakItem().setTitle('Round 4: デザイン方針');
  form.addMultipleChoiceItem().setTitle('Q13 カラー方向性').setChoiceValues(['ナチュラル×温もり', 'ホワイト×モダン', 'ダーク×ムード', 'ポップ×カジュアル', 'ダーク×レトロ', 'おまかせ']);
  form.addMultipleChoiceItem().setTitle('Q14 全体のトーン').setChoiceValues(['静謐・上品', '温もり・親しみ', 'モード・洗練', '賑やか・レトロ', 'おまかせ']);
  form.addMultipleChoiceItem().setTitle('Q15 コンセプトの語り方').setChoiceValues(['3段構造', 'ストーリー型', '一言コピー型', 'おまかせ']);

  form.addPageBreakItem().setTitle('Round 5: 追加要件');
  form.addCheckboxItem().setTitle('Q18 追加セクション').setChoiceValues(['シェフ紹介', 'シーン提案', '通販', 'イベント', 'パーティー・貸切', 'キッズ対応', '体験コンテンツ', 'Instagram連携', 'ブログ', 'テイクアウト', '特になし']);
  form.addMultipleChoiceItem().setTitle('Q19 写真素材').setChoiceValues(['手元にある', 'まだない']);
  form.addTextItem().setTitle('Q20 参考サイトURL');

  Logger.log(form.getPublishedUrl());
}

function createCorporateInterviewForm() {
  var form = FormApp.create('企業LP（士業・コンサル・IT・クリエイティブ）ヒアリング');

  form.setDescription('企業LP向けのヒアリングフォームです。');

  form.addMultipleChoiceItem().setTitle('契約形態は？').setChoiceValues(['SITEON サブスク', 'NovaTech 受託（買い切り）']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('プランは？').setChoiceValues(['スタンダード', 'プロフェッショナル', 'プレミアム']);

  form.addPageBreakItem().setTitle('Round 1: 基本情報');
  form.addMultipleChoiceItem().setTitle('Q1 業種は？').setChoiceValues(['弁護士', '税理士', '社労士', '行政書士', 'コンサル', 'IT', '映像・デザイン', 'その他']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('Q1.5 従業員数は？').setChoiceValues(['1名（個人）', '2〜5名', '6〜15名', '16〜30名']);
  form.addTextItem().setTitle('Q2 会社名（英語）');
  form.addTextItem().setTitle('Q3 会社名（日本語・サブ）');
  form.addTextItem().setTitle('Q4 エリア・最寄り駅');
  form.addParagraphTextItem().setTitle('Q5 住所');

  form.addPageBreakItem().setTitle('Round 2: 営業情報');
  form.addTextItem().setTitle('Q6 営業時間');
  form.addTextItem().setTitle('Q7 定休日');
  form.addTextItem().setTitle('Q8 電話番号');
  form.addCheckboxItem().setTitle('Q8.5 お支払い方法').setChoiceValues(['銀行振込', 'クレジットカード', 'その他']);
  form.addCheckboxItem().setTitle('Q9 問い合わせ方法').setChoiceValues(['フォーム', '電話', 'メール', 'LINE', 'その他']);

  form.addPageBreakItem().setTitle('Round 3: サービス情報');
  form.addParagraphTextItem().setTitle('Q10 主要サービス（3〜5つ）');
  form.addMultipleChoiceItem().setTitle('Q10.5 料金表を掲載しますか？').setChoiceValues(['あり', 'なし', '応相談のみ表示']);
  form.addParagraphTextItem().setTitle('Q11 代表者プロフィール').setHelpText('名前・経歴・資格・写真');

  form.addPageBreakItem().setTitle('Round 4: デザイン方針');
  form.addMultipleChoiceItem().setTitle('Q13 カラー方向性').setChoiceValues(['クリーン×信頼', 'ミニマル×洗練', 'アーティスティック×世界観', 'ウォーム×親しみ', 'おまかせ']);
  form.addMultipleChoiceItem().setTitle('Q14 全体のトーン').setChoiceValues(['静謐・上品', '温もり・親しみ', 'モード・洗練', 'おまかせ']);
  form.addMultipleChoiceItem().setTitle('Q15 コンセプトの語り方').setChoiceValues(['3段構造', 'ストーリー型', '一言コピー型', 'おまかせ']);

  form.addPageBreakItem().setTitle('Round 5: 追加要件');
  form.addCheckboxItem().setTitle('Q18 追加セクション').setChoiceValues(['料金表', '実績・事例', 'ブログ・コラム', 'FAQ', 'サービスの流れ', 'お客様の声', '提携先', 'お知らせ', '採用', 'メディア掲載', '特になし']);
  form.addMultipleChoiceItem().setTitle('Q19 写真素材').setChoiceValues(['手元にある', 'まだない']);
  form.addTextItem().setTitle('Q20 参考サイトURL');

  Logger.log(form.getPublishedUrl());
}

function createAllForms() {
  createArchitectInterviewForm();
  createRestaurantInterviewForm();
  createCorporateInterviewForm();
}
