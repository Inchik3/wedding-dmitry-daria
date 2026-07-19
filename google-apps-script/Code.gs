const SPREADSHEET_ID = '139kFSSnOlDV725enWmBKCJz2zTI83uPR7b3SQDvTIRU';
const SHEET_NAME = 'RSVP';
const HEADERS = [
  'Дата отправки',
  'Имя гостя',
  'Статус участия',
  'Время прибытия',
  'Напитки',
  'Комментарий',
  'Просроченный ответ',
];

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const validation = validatePayload_(payload);

    if (!validation.ok) {
      return json_({ ok: false, message: validation.message });
    }

    if (String(payload.honeypot || '').trim()) {
      return json_({ ok: true, message: 'Спасибо! Ваш ответ сохранен.' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);

    try {
      const sheet = getSheet_();
      sheet.appendRow([
        formatDate_(payload.submittedAt),
        payload.guestName,
        formatAttendance_(payload.attendance),
        formatArrivalTime_(payload.arrivalTime),
        (payload.drinks || []).join(', '),
        payload.comment || '',
        payload.isLate ? 'Да' : 'Нет',
      ]);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true, message: 'Спасибо! Ваш ответ сохранен.' });
  } catch (error) {
    return json_({ ok: false, message: 'Не удалось сохранить ответ. Попробуйте еще раз.' });
  }
}

function validatePayload_(payload) {
  const name = String(payload.guestName || '').trim();
  const attendance = String(payload.attendance || '');
  const arrivalTime = payload.arrivalTime === null ? '' : String(payload.arrivalTime || '');
  const drinks = Array.isArray(payload.drinks) ? payload.drinks : [];
  const comment = String(payload.comment || '');

  if (!name || name.length > 80) {
    return { ok: false, message: 'Проверьте имя гостя.' };
  }
  if (attendance !== 'attending' && attendance !== 'declined') {
    return { ok: false, message: 'Проверьте статус участия.' };
  }
  if (attendance === 'attending' && arrivalTime !== 'registration_1245' && arrivalTime !== 'banquet_1545') {
    return { ok: false, message: 'Выберите время прибытия.' };
  }
  if (attendance === 'attending' && drinks.length === 0) {
    return { ok: false, message: 'Выберите напитки.' };
  }
  if (comment.length > 500) {
    return { ok: false, message: 'Комментарий слишком длинный.' };
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
  if (attendance === 'attending') return 'Будет присутствовать';
  if (attendance === 'declined') return 'Не сможет присутствовать';
  return String(attendance || '');
}

function formatArrivalTime_(arrivalTime) {
  if (arrivalTime === 'registration_1245') return 'Приду на регистрацию к 12:45';
  if (arrivalTime === 'banquet_1545') return 'Подойду к банкету к 15:45';
  return '';
}

function formatDate_(value) {
  const date = value ? new Date(value) : new Date();
  return Utilities.formatDate(date, 'Europe/Moscow', 'dd.MM.yyyy HH:mm:ss');
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
