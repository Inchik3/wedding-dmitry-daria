import { appsScriptUrl, wedding } from '../config/content';
import { qs } from '../shared/dom';
import { isAfterDeadline } from '../shared/time';
import { validateRsvp, type ArrivalTime, type Attendance, type RsvpFormData, type RsvpPayload } from './validation';

type ApiResponse = { ok: boolean; message?: string };

async function submitRsvp(payload: RsvpPayload): Promise<ApiResponse> {
  const response = await fetch(appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Network error');
  return (await response.json()) as ApiResponse;
}

function collect(form: HTMLFormElement): RsvpFormData {
  const formData = new FormData(form);
  return {
    guestName: String(formData.get('guestName') || ''),
    attendance: String(formData.get('attendance') || '') as Attendance | '',
    arrivalTime: String(formData.get('arrivalTime') || '') as ArrivalTime | '',
    drinks: formData.getAll('drinks').map(String),
    comment: String(formData.get('comment') || ''),
    honeypot: String(formData.get('website') || ''),
  };
}

function showErrors(errors: Partial<Record<keyof RsvpFormData, string>>): void {
  document.querySelectorAll<HTMLElement>('[data-error-for]').forEach((error) => {
    const field = error.dataset.errorFor as keyof RsvpFormData;
    error.textContent = errors[field] || '';
  });
}

export function initRsvp(): void {
  const form = qs<HTMLFormElement>('[data-rsvp-form]');
  const status = qs<HTMLElement>('[data-rsvp-status]');
  const submit = qs<HTMLButtonElement>('[data-rsvp-submit]');
  const arrivalGroup = qs<HTMLElement>('[data-arrival-group]');
  const drinksGroup = qs<HTMLElement>('[data-drinks-group]');
  const attendanceInputs = [...form.querySelectorAll<HTMLInputElement>('input[name="attendance"]')];

  if (isAfterDeadline(wedding.rsvpDeadlineIsoMoscow)) {
    qs<HTMLElement>('[data-deadline-note]').hidden = false;
  }

  const syncConditionalGroups = () => {
    const attendance = form.querySelector<HTMLInputElement>('input[name="attendance"]:checked')?.value;
    const attending = attendance === 'attending';

    arrivalGroup.hidden = !attending;
    drinksGroup.hidden = !attending;

    if (!attending) {
      arrivalGroup.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        input.checked = false;
      });
      drinksGroup.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        input.checked = false;
      });
    }
  };

  attendanceInputs.forEach((input) => input.addEventListener('change', syncConditionalGroups));
  syncConditionalGroups();

  if (!appsScriptUrl) {
    status.textContent = '';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    delete status.dataset.state;
    showErrors({});

    const result = validateRsvp(collect(form), wedding.rsvpDeadlineIsoMoscow);
    if (!result.ok) {
      showErrors(result.errors);
      return;
    }

    if (!appsScriptUrl) {
      status.textContent = '';
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Отправляем...';

    try {
      const response = await submitRsvp(result.payload);
      if (!response.ok) throw new Error(response.message || 'Server error');
      status.textContent = response.message || 'Спасибо! Ваш ответ сохранен.';
      status.dataset.state = 'success';
      form.reset();
      syncConditionalGroups();
    } catch {
      status.textContent = 'Не удалось отправить ответ. Проверьте соединение и попробуйте еще раз.';
      status.dataset.state = 'error';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Отправить ответ';
    }
  });
}
