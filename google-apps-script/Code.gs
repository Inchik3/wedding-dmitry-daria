const SPREADSHEET_ID = '139kFSSnOlDV725enWmBKCJz2zTI83uPR7b3SQDvTIRU';
const SHEET_NAME = 'RSVP';
const HEADERS = [
  '\u0414\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043c\u044f \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438',
  '\u0418\u043c\u044f \u0433\u043e\u0441\u0442\u044f',
  '\u0421\u0442\u0430\u0442\u0443\u0441 \u0443\u0447\u0430\u0441\u0442\u0438\u044f',
  '\u041d\u0430\u043f\u0438\u0442\u043a\u0438',
  '\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439',
];

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const validation = validatePayload_(payload);

    if (!validation.ok) {
      return json_({ ok: false, message: validation.message });
    }

    if (String(payload.honeypot || '').trim()) {
      return json_({ ok: true, message: '\u0421\u043f\u0430\u0441\u0438\u0431\u043e! \u0412\u0430\u0448 \u043e\u0442\u0432\u0435\u0442 \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d.' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);

    try {
      const sheet = getSheet_();
      sheet.appendRow([
        formatDate_(payload.submittedAt),
        payload.guestName,
        formatAttendance_(payload.attendance),
        (payload.drinks || []).join(', '),
        payload.comment || '',
      ]);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true, message: '\u0421\u043f\u0430\u0441\u0438\u0431\u043e! \u0412\u0430\u0448 \u043e\u0442\u0432\u0435\u0442 \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d.' });
  } catch (error) {
    return json_({ ok: false, message: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043e\u0442\u0432\u0435\u0442. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.' });
  }
}

function validatePayload_(payload) {
  const name = String(payload.guestName || '').trim();
  const attendance = String(payload.attendance || '');
  const drinks = Array.isArray(payload.drinks) ? payload.drinks : [];
  const comment = String(payload.comment || '');

  if (!name || name.length > 80) {
    return { ok: false, message: '\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0438\u043c\u044f \u0433\u043e\u0441\u0442\u044f.' };
  }
  if (attendance !== 'attending' && attendance !== 'declined') {
    return { ok: false, message: '\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441 \u0443\u0447\u0430\u0441\u0442\u0438\u044f.' };
  }
  if (attendance === 'attending' && drinks.length === 0) {
    return { ok: false, message: '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0430\u043f\u0438\u0442\u043a\u0438.' };
  }
  if (comment.length > 500) {
    return { ok: false, message: '\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u0441\u043b\u0438\u0448\u043a\u043e\u043c \u0434\u043b\u0438\u043d\u043d\u044b\u0439.' };
  }

  return { ok: true };
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function updateHeaders() {
  const sheet = getSheet_();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  const extraColumns = sheet.getLastColumn() - HEADERS.length;
  if (extraColumns > 0) {
    sheet.deleteColumns(HEADERS.length + 1, extraColumns);
  }
}

function formatAttendance_(attendance) {
  if (attendance === 'attending') return '\u0411\u0443\u0434\u0435\u0442 \u043f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u043e\u0432\u0430\u0442\u044c';
  if (attendance === 'declined') return '\u041d\u0435 \u0441\u043c\u043e\u0436\u0435\u0442 \u043f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u043e\u0432\u0430\u0442\u044c';
  return String(attendance || '');
}

function formatDate_(value) {
  const date = value ? new Date(value) : new Date();
  return Utilities.formatDate(date, 'Europe/Moscow', 'dd.MM.yyyy HH:mm:ss');
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
