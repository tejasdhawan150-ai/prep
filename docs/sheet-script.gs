/**
 * PrepEve Leads — Google Apps Script (Sheet → Extensions → Apps Script).
 * Sheet1 columns:
 *   A Time | B Name | C Phone | D Email | E Target Band | F Exam Date | G (your notes) | H Source | I Call Time
 * After pasting: Deploy → Manage deployments → pencil (Edit) → Version: New version → Deploy.
 * Do NOT click "New deployment": that changes the URL and the website stops saving leads.
 *
 * Built so a lead is never lost:
 *  - If another lead is being saved at the same moment, it waits up to 20 seconds, then saves anyway.
 *  - If Google Sheets has a hiccup, it tries 3 times. If it still fails, the lead is kept by the
 *    script and added to the sheet with the next lead.
 *  - The same phone and target sent again within 10 minutes counts as one lead (a double tap).
 *    Later repeats are saved, because a returning lead is worth seeing.
 *  - If the "Sheet1" tab is renamed or deleted, a new "Sheet1" tab is created for new leads.
 *  - Every problem is written to the log: Apps Script editor → Executions.
 */
var SOURCES = {
  'ielts-coaching-lp': 'Google Ads page',
  'webinar': 'Webinar',
  'book-demo': 'Book demo',
  'ielts-band-7': 'Band 7 page',
  'ielts-canada-pr': 'Canada PR page',
  'ielts-retake': 'Retake page',
  'band-calculator': 'Band calculator',
  'french-demo': 'French demo',
  'pte-coaching': 'PTE page'
};
var DOUBLE_TAP_MS = 10 * 60 * 1000;

function doGet(e) { return save_(e); }
function doPost(e) { return save_(e); }

function save_(e) {
  var p = (e && e.parameter) || {};
  var phone = String(p.phone || '').replace(/\D/g, '');
  // Every website form sends a phone number. Skip empty hits (bots calling this URL directly).
  if (phone.length < 8) return text_('skip');

  var band = String(p.band || '');
  var source = SOURCES[p.source] || p.source || (band.indexOf('Webinar') === 0 ? 'Webinar' : 'Website');
  var time = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, H:mm');
  // The apostrophe keeps the phone as text, so a "+" can never turn into #ERROR!
  var row = [time, p.name || '', "'" + phone, p.email || '', band, p.when || '', '', source, p.slot || ''];

  var lock = LockService.getScriptLock();
  var locked = lock.tryLock(20000);
  if (!locked) console.warn('Busy for 20 seconds: saving without the double-tap check');
  try {
    var props = PropertiesService.getScriptProperties();
    if (locked && isDoubleTap_(props, phone, band)) return text_('dup');
    if (append_(row)) {
      props.setProperties({ lastKey: phone + '|' + band, lastAt: String(Date.now()) });
      addKeptLeads_(props);
      return text_('ok');
    }
    keepLead_(props, row);
    return text_('kept');
  } catch (err) {
    // Last resort: the full lead is in the log (Executions), so it can be copied into the sheet by hand.
    console.error('LEAD NOT SAVED: ' + row.join(' | ') + ' | ' + err);
    return text_('error');
  } finally {
    if (locked) lock.releaseLock();
  }
}

function isDoubleTap_(props, phone, band) {
  return props.getProperty('lastKey') === phone + '|' + band &&
    Date.now() - Number(props.getProperty('lastAt') || 0) < DOUBLE_TAP_MS;
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Sheet1');
  if (!sh) {
    sh = ss.insertSheet('Sheet1');
    console.warn('The "Sheet1" tab was missing, so a new one was created');
  }
  if (sh.getRange('H1').getValue() === '') sh.getRange('H1:I1').setValues([['Source', 'Call Time']]);
  return sh;
}

function append_(row) {
  for (var i = 1; i <= 3; i++) {
    try {
      sheet_().appendRow(row);
      return true;
    } catch (err) {
      console.warn('Sheet write failed (try ' + i + ' of 3): ' + err);
      if (i < 3) Utilities.sleep(1000 * i);
    }
  }
  return false;
}

// A lead that could not be written is kept in the script's own storage and added with the next lead.
function keepLead_(props, row) {
  var kept = JSON.parse(props.getProperty('kept') || '[]');
  kept.push(row);
  props.setProperty('kept', JSON.stringify(kept.slice(-30)));
  console.error('Sheet unavailable, lead kept for later: ' + row.join(' | '));
}

function addKeptLeads_(props) {
  var kept = JSON.parse(props.getProperty('kept') || '[]');
  if (!kept.length) return;
  props.setProperty('kept', JSON.stringify(kept.filter(function (row) { return !append_(row); })));
}

function text_(t) { return ContentService.createTextOutput(t); }

// Run this from the editor to see leads waiting to be added (normally none).
function showKeptLeads() {
  console.log(PropertiesService.getScriptProperties().getProperty('kept') || 'No kept leads');
}
