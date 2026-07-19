export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

export function getCountdownParts(targetIsoWithOffset: string, now = new Date()): CountdownParts {
  const target = new Date(targetIsoWithOffset).getTime();
  const diff = target - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

export function isAfterDeadline(deadlineIsoWithOffset: string, now = new Date()): boolean {
  return now.getTime() > new Date(deadlineIsoWithOffset).getTime();
}
