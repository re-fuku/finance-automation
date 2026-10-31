
/**
 * メールから必要な情報を取得
 */
function getGmails() {
    const targetSubject = PropertiesService
        .getScriptProperties()
        .getProperty("TARGET_SUBJECT")
    const threads = GmailApp.search(`in:inbox subject:${targetSubject}`, 0, 1)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("実績管理")

    let data
    for (const thread of threads) {
        for (const message of thread.getMessages()) {
            const body = message.getPlainBody()

            const date = body.match(/利用日：\s*([^\r\n]+)/)[1].split(" ")[0]
            const place = body.match(/利用先：\s*([^\r\n]+)/)[1]
            const amount = body.match(/利用金額：\s*([^\r\n]+)/)[1].replace('円', '')
            
            sheet.appendRow([place, "", date, amount])
        }

        // thread.moveToArchive()
    }
}
