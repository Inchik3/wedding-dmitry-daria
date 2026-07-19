import { describe, expect, it } from 'vitest';
import { validateRsvp, type RsvpFormData } from '../../src/modules/validation';

const baseData: RsvpFormData = {
  guestName: 'Анна Иванова',
  attendance: 'attending',
  drinks: ['Шампанское'],
  comment: '',
  honeypot: '',
};

describe('RSVP validation', () => {
  it('requires guest name and attendance', () => {
    const result = validateRsvp(
      { ...baseData, guestName: '', attendance: '' },
      '2026-08-01T23:59:59+03:00',
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.guestName).toBeTruthy();
      expect(result.errors.attendance).toBeTruthy();
    }
  });

  it('requires drinks for attending guests', () => {
    const result = validateRsvp({ ...baseData, drinks: [] }, '2026-08-01T23:59:59+03:00');

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.drinks).toBeTruthy();
  });

  it('does not require drinks for declined guests and removes drinks from payload', () => {
    const result = validateRsvp(
      { ...baseData, attendance: 'declined', drinks: ['Вино красное'] },
      '2026-08-01T23:59:59+03:00',
    );

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.payload.drinks).toEqual([]);
  });

  it('marks late responses', () => {
    const result = validateRsvp(baseData, '2026-08-01T23:59:59+03:00', new Date('2026-08-02T00:00:00+03:00'));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.payload.isLate).toBe(true);
  });
});
