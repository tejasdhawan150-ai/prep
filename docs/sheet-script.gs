/**
 * PrepEve Leads — Google Apps Script (Sheet → Extensions → Apps Script).
 * Sheet1 columns:
 *   A Time | B Name | C Phone | D Email | E Target Band | F Exam Date | G (your notes) | H Source | I Call Time
 * After pasting: Deploy → Manage deployments → pencil (Edit) → Version: New version → Deploy.
 * Do NOT click "New deployment": that changes the URL and the website stops saving leads.
 */
var SOURCES = {
  'ielts-coaching-lp': 'Google Ads page',
  'webinar': 'Webinar',
  'book-demo': 'Book demo',
  'ielts-band-7': 'Band 7 page',
  'ielts-canada-pr': 'Canada PR page',
  'ielts-retake': 'Retake page',
  'band-calculator': 'Band calculator'
};

function doGet(e) { return save_(e); }
function doPost(e) { return save_(e); }

function save_(e) {
  var p = (e && e.parameter) || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    if (sh.getRange('H1').getValue() === '') sh.getRange('H1:I1').setValues([['Source', 'Call Time']]);

    var phone = String(p.phone || '').replace(/\D/g, '');
    var band = String(p.band || '');
    var source = SOURCES[p.source] || p.source || (band.indexOf('Webinar') === 0 ? 'Webinar' : 'Website');
    var time = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, H:mm');

    // Skip a double tap: same phone and band as the last row
    var last = sh.getLastRow();
    if (phone && last > 1) {
      var prev = sh.getRange(last, 3, 1, 3).getValues()[0];
      if (String(prev[0]).replace(/\D/g, '') === phone && String(prev[2]) === band) {
        return ContentService.createTextOutput('dup');
      }
    }

    // The apostrophe keeps the phone as text, so a "+" can never turn into #ERROR!
    sh.appendRow([time, p.name || '', "'" + phone, p.email || '', band, p.when || '', '', source, p.slot || '']);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
