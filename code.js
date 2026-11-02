/**
 * フィールド
 */
const mail_address = PropertiesService.getScriptProperties().getProperty("MAIL")

/**
 * メールから必要な情報を取得
 */
function getGmails() {
    const targetSubject = PropertiesService
        .getScriptProperties()
        .getProperty("TARGET_SUBJECT")
    const threads = GmailApp.search(`in:inbox subject:${targetSubject}`)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("実績管理")

    if (threads.length === 0) return

    for (const thread of threads) {
        for (const message of thread.getMessages()) {

          try {
            const body = message.getPlainBody()
            const date = body.match(/利用日\s*：\s*([^\r\n]+)/)[1].split(" ")[0]
            const place = body.match(/利用先\s*：\s*([^\r\n]+)/)[1]
            const amount = body.match(/利用金額\s*：\s*([^\r\n]+)/)[1].replace('円', '')

            sheet.appendRow([place, "支出", date, amount, "未分類"])

          } catch (e) {
            MailApp.sendEmail({
              to: mail_address,
              subject: "家計簿登録エラー",
              body: `以下のエラーが発生したため確認 \n ${e}`
            })
          }
        }

        thread.moveToArchive()
    }
}

/**
 * 未分類の項目があれば通知する
 */
function searchUncategorizedItems() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("実績管理")
    const finance_url = PropertiesService.getScriptProperties().getProperty("FINANCE_URL")

    const unclassified_count = sheet.getRange("E:E").getValues().flat().filter((value) => value === '未分類').length
    if (unclassified_count !== 0) {
      MailApp.sendEmail({
        to: mail_address,
        subject: "家計簿未分類データあり",
        body: `未分類データが${unclassified_count}件あるためデータの確認をしてください。\n ${finance_url}`
      })
    }
}
