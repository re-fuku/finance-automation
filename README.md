# Finance Automation

## 1. 目的
家計簿管理をスプレッドシートで管理を行う。 
クレジットカードの利用履歴メールから内容を読み取りスプレッドシートへの自動登録を行い、特定の時間までに分類分けが出来ていなければ通知を行い、家計管理簿を付ける作業を簡略化する

## 2. 開発環境
- 開発言語：JavaScript（Google Apps Script）
- 実行環境：Google Apps Script
- 使用ツール：clasp、Google スプレッドシート


## 3. 実装機能
- Gmailに届くクレジットカード利用履歴から[利用日, 利用場所, 利用金額]を取得し、スプレッドシートに追加する
- スプレッドシートした情報で項目が未分類の項目があった場合は、メールにて未分類がある旨を通知する

## 4. トリガー
- 毎日、午後20時から午後21時にスプレッドシートに追加した記録に未分類が存在するかチェックし通知する
- 1時間おきにGmailからクレジットカードの利用履歴を取得し、未追加のものをスプレッドシートへ追加する

## 5. 構成図

```mermaid

flowchart LR
    subgraph Google Workspace
        Gmail["Gmail<br/>カード利用履歴メール"]
        Sheet["Google スプレッドシート<br/>実績管理"]
        Mail["メール通知"]
    end

    subgraph GAS["Google Apps Script"]
        TriggerFetch["時間主導型トリガー<br/>1時間おき"]
        GetGmails["getGmails()<br/>本文を解析・行を追加"]
        TriggerCheck["時間主導型トリガー<br/>毎日 20〜21時"]
        CheckItems["searchUncategorizedItems()<br/>未分類を件数確認"]
        Props["スクリプトプロパティ<br/>TARGET_SUBJECT<br/>FINANCE_URL"]
    end

    TriggerFetch --> GetGmails
    Gmail -->|件名で検索・本文取得| GetGmails
    GetGmails -->|利用先・日付・金額を追加<br/>処理後スレッドをアーカイブ| Sheet
    Props -.->|TARGET_SUBJECT| GetGmails

    TriggerCheck --> CheckItems
    Sheet -->|E列の未分類を確認| CheckItems
    Props -.->|FINANCE_URL| CheckItems
    CheckItems -->|未分類が1件以上| Mail
    Mail -->|件数と家計簿URLを送信| User["利用者"]
```

## . 学習内容
- GASからGmailのスレッドを取得方法
- GASを使用してのスプレッドシードの操作
- GASプロジェクトに環境変数を登録して利用
