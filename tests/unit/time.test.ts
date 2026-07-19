import { describe, expect, it } from 'vitest';
import { getCountdownParts, isAfterDeadline } from '../../src/shared/time';

describe('time helpers', () => {
  it('calculates countdown from an absolute Moscow timestamp', () => {
    const result = getCountdownParts('2026-08-28T13:00:00+03:00', new Date('2026-08-27T10:00:00Z'));

    expect(result).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: false,
    });
  });

  it('switches to past state after wedding starts', () => {
    const result = getCountdownParts('2026-08-28T13:00:00+03:00', new Date('2026-08-28T10:00:01Z'));

    expect(result.isPast).toBe(true);
  });

  it('detects late RSVP after the deadline', () => {
    expect(isAfterDeadline('2026-08-01T23:59:59+03:00', new Date('2026-08-01T20:59:59Z'))).toBe(false);
    expect(isAfterDeadline('2026-08-01T23:59:59+03:00', new Date('2026-08-01T21:00:00Z'))).toBe(true);
  });
});
