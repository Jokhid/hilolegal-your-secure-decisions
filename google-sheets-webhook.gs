const SHEET_ID = '1Klnh7mZ1NiWs6vNx0omeKrJWbiUaROj2tEYm5KN9HTU';
const SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Fecha', 'Nombre', 'Teléfono', 'Email', 'Interés', 'Mensaje']);
    }

    sheet.appendRow([
      new Date(payload.timestamp || Date.now()),
      payload.name || '',
      payload.phone || '',
      payload.email || '',
      payload.interest || payload.topic || '',
      payload.message || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
