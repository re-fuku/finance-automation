
/**
 * メールから必要な情報を取得
 */
function getGmails() {
    const targetSubject = PropertiesService
        .getScriptProperties()
        .getProperty("TARGET_SUBJECT")
    const threads = GmailApp.search(`in:inbox subject:${targetSubject}`, 0, 1)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("実績管理")

    for (const thread of threads) {
        for (const message of thread.getMessages()) {
            const body = message.getPlainBody()

            const date = body.match(/利用日：\s*([^\r\n]+)/)[1].split(" ")[0]
            const place = body.match(/利用先：\s*([^\r\n]+)/)[1]
            const amount = body.match(/利用金額：\s*([^\r\n]+)/)[1].replace('円', '')
            
            sheet.appendRow([place, "支出", date, amount, "未分類"])
        }

        // thread.moveToArchive()
    }
}

/**
 * 未分類の項目があれば通知する
 */
function searchUncategorizedItems() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("実績管理")

    const unclassified_count = sheet.getRange("E:E").getValues().flat().filter((value) => value === '未分類').length
    if (unclassified_count !== 0) {
      MailApp.sendEmail({
        to: "freoct20@gmail.com",
        subject: "家計簿未分類データあり",
        body: `未分類データが${unclassified_count}件あるためデータの確認をしてください。\n https://docs.google.com/spreadsheets/d/19WYp4hUHc2vPJrB-Cu0yYX4B7LeQBnGDfM0w0HN8Gls/edit?gid=1810338536#gid=1810338536`
      })
    }
}
