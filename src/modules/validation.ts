import { isAfterDeadline } from '../shared/time';

export type Attendance = 'attending' | 'declined';
export type ArrivalTime = 'registration_1245' | 'banquet_1545';

export type RsvpFormData = {
  guestName: string;
  attendance: Attendance | '';
  arrivalTime: ArrivalTime | '';
  drinks: string[];
  comment: string;
  honeypot: string;
};

export type RsvpPayload = {
  guestName: string;
  attendance: Attendance;
  arrivalTime: ArrivalTime | null;
  drinks: string[];
  comment: string;
  submittedAt: string;
  isLate: boolean;
  honeypot: string;
};

export type ValidationResult =
  | { ok: true; payload: RsvpPayload }
  | { ok: false; errors: Partial<Record<keyof RsvpFormData, string>> };

export function validateRsvp(
  data: RsvpFormData,
  deadlineIsoWithOffset: string,
  now = new Date(),
): ValidationResult {
  const errors: Partial<Record<keyof RsvpFormData, string>> = {};
  const guestName = data.guestName.trim();
  const comment = data.comment.trim();

  if (!guestName) errors.guestName = 'Пожалуйста, укажите имя гостя.';
  if (guestName.length > 80) errors.guestName = 'Имя должно быть короче 80 символов.';
  if (!data.attendance) errors.attendance = 'Пожалуйста, выберите статус участия.';
  if (comment.length > 500) errors.comment = 'Комментарий должен быть короче 500 символов.';

  if (data.attendance === 'attending') {
    if (!data.arrivalTime) {
      errors.arrivalTime = 'Пожалуйста, выберите время прибытия.';
    }
    if (data.drinks.length === 0) {
      errors.drinks = 'Пожалуйста, выберите хотя бы один вариант напитка.';
    }
  }

  if (Object.keys(errors).length > 0 || !data.attendance) {
    return { ok: false, errors };
  }

  const arrivalTime = data.attendance === 'attending' ? (data.arrivalTime as ArrivalTime) : null;

  return {
    ok: true,
    payload: {
      guestName,
      attendance: data.attendance,
      arrivalTime,
      drinks: data.attendance === 'attending' ? data.drinks : [],
      comment,
      submittedAt: now.toISOString(),
      isLate: isAfterDeadline(deadlineIsoWithOffset, now),
      honeypot: data.honeypot,
    },
  };
}
