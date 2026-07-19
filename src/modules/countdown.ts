import { setText } from '../shared/dom';
import { getCountdownParts } from '../shared/time';

export function initCountdown(targetIsoWithOffset: string): () => void {
  const root = document.querySelector<HTMLElement>('[data-countdown]');
  if (!root) return () => undefined;

  const render = () => {
    const parts = getCountdownParts(targetIsoWithOffset);

    if (parts.isPast) {
      root.innerHTML = '<p class="countdown-finished">Сегодня наш особенный день!</p>';
      return;
    }

    setText('[data-days]', String(parts.days));
    setText('[data-hours]', String(parts.hours).padStart(2, '0'));
    setText('[data-minutes]', String(parts.minutes).padStart(2, '0'));
    setText('[data-seconds]', String(parts.seconds).padStart(2, '0'));
  };

  render();
  const timer = window.setInterval(render, 1000);

  return () => window.clearInterval(timer);
}
