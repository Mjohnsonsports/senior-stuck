/**
 * Google Apps Script Code for Google Sheets Webhook
 *
 * Instructions:
 * 1. Open Google Sheets
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code
 * 4. Save the project
 * 5. Deploy > New deployment > Web app
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Click Deploy
 * 9. Copy the web app URL and use it as GOOGLE_SHEETS_WEBHOOK_URL
 */

function doGet(e) {
  return ContentService
    .createTextOutput("Script working")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .openById("1eoIU5xBTBjLFMR02orbbWvYYyUv9tkJjbZVhvgauJ6Y")
      .getSheetByName("Sheet1");

    const data = JSON.parse(e.postData.contents);

    const name           = data.name           || '';
    const email          = data.email          || '';
    const payment_method = data.payment_method || '';
    const country        = data.country        || '';
    const created        = data.created        || '';
    const total_spend    = data.total_spend    || '';
    const currency       = data.currency       || '';
    const payment_status = data.payment_status || '';
    const date           = data.date           || new Date().toLocaleString();

    sheet.appendRow([
      name,
      email,
      payment_method,
      country,
      created,
      total_spend,
      currency,
      payment_status,
      date
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Run this ONCE manually from the Apps Script editor to create column headers.
 */
function setupSheet() {
  const sheet = SpreadsheetApp
    .openById("1eoIU5xBTBjLFMR02orbbWvYYyUv9tkJjbZVhvgauJ6Y")
    .getSheetByName("Sheet1");

  if (sheet.getLastRow() === 0) {
    const headers = ['Name', 'Email', 'Payment Method', 'Country', 'Created', 'Total Spend', 'Currency', 'Payment Status', 'Date'];
    sheet.appendRow(headers);

    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
  }
}
