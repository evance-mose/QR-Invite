/**
 * Paste this file into Extensions → Apps Script on a new Google Sheet.
 * Add a script property named SECRET with the same value as SIGNUP_SECRET.
 * Deploy as a web app: Execute as Me, Who has access: Anyone.
 */

var HEADERS = ["Created at", "Title", "Name", "Email", "Institution", "Province"];
var EMAIL_COLUMN = 4;

function doPost(e) {
  return handlePost_(e);
}

function handlePost_(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (!authorised_(body.secret)) {
      return json_({ ok: false, error: "Unauthorized" });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = sheet_();
      var lastRow = sheet.getLastRow();
      var email = String(body.email || "").toLowerCase();

      if (lastRow > 1) {
        var emails = sheet.getRange(2, EMAIL_COLUMN, lastRow - 1, 1).getValues();
        for (var i = 0; i < emails.length; i++) {
          if (String(emails[i][0]).toLowerCase() === email) {
            return json_({ ok: true, duplicate: true });
          }
        }
      }

      var createdAt = body.createdAt ? new Date(body.createdAt) : new Date();
      if (isNaN(createdAt.getTime())) createdAt = new Date();

      sheet.appendRow([
        createdAt,
        body.title,
        body.name,
        email,
        body.institution,
        body.province,
      ]);
      return json_({ ok: true, duplicate: false });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function sheet_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("yyyy-mm-dd hh:mm");
    return sheet;
  }

  var header = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var missing = false;
  for (var i = 0; i < HEADERS.length; i++) {
    if (header[i] !== HEADERS[i]) missing = true;
  }

  if (missing) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }

  sheet.getRange("A:A").setNumberFormat("yyyy-mm-dd hh:mm");
  return sheet;
}

function authorised_(secret) {
  var expected = PropertiesService.getScriptProperties().getProperty("SECRET");
  return Boolean(expected) && String(secret || "") === expected;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
