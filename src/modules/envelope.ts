import { qs } from '../shared/dom';

export function initEnvelope(onOpen: () => void): void {
  const envelope = qs<HTMLElement>('[data-envelope]');
  const button = qs<HTMLButtonElement>('[data-open-invite]');
  const main = qs<HTMLElement>('#main-content');

  main.setAttribute('aria-hidden', 'true');

  button.addEventListener('click', () => {
    envelope.classList.add('is-open');
    main.removeAttribute('aria-hidden');
    onOpen();

    window.setTimeout(() => {
      envelope.hidden = true;
      main.focus();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 780);
  });
}
