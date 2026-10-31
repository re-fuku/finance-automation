function extractionBody(body) {
    const date = body.match(/利用日：\s*([^\r\n]+)/)[1].split(" ")[0]
    const place = body.match(/利用先：\s*([^\r\n]+)/)[1]
    const amount = body.match(/利用金額：\s*([^\r\n]+)/)[1]

    return { date, place, amount}
}


function getGmails() {
    const targetSubject = PropertiesService
        .getScriptProperties()
        .getProperty("TARGET_SUBJECT")
    
    const threads = GmailApp.search(`in:inbox subject:${targetSubject}`, 0, 1)
    const label = GmailApp.getUserLabelByName("記録済み")

    let data
    for (const thread of threads) {
        // thread.addLabel(label)
        for (const message of thread.getMessages()) {
            console.log("plainBody: ", message.getPlainBody())
            data = extractionBody(message.getPlainBody())
            console.log("data: ", data)
        }
    }
}
