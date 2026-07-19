import { describe, expect, it } from 'vitest';
import { validateRsvp, type RsvpFormData } from '../../src/modules/validation';

const baseData: RsvpFormData = {
  guestName: 'Анна Иванова',
  attendance: 'attending',
  arrivalTime: 'registration_1245',
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

  it('requires arrival time and drinks for attending guests', () => {
    const result = validateRsvp(
      { ...baseData, arrivalTime: '', drinks: [] },
      '2026-08-01T23:59:59+03:00',
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.arrivalTime).toBeTruthy();
      expect(result.errors.drinks).toBeTruthy();
    }
  });

  it('removes arrival time and drinks for declined guests', () => {
    const result = validateRsvp(
      {
        ...baseData,
        attendance: 'declined',
        arrivalTime: 'banquet_1545',
        drinks: ['Вино красное'],
      },
      '2026-08-01T23:59:59+03:00',
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload.arrivalTime).toBeNull();
      expect(result.payload.drinks).toEqual([]);
    }
  });

  it('marks late responses', () => {
    const result = validateRsvp(baseData, '2026-08-01T23:59:59+03:00', new Date('2026-08-02T00:00:00+03:00'));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.payload.isLate).toBe(true);
  });
});
