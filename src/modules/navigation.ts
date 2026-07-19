export function initNavigation(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.querySelector<HTMLElement>('#main-nav');
  if (!button || !nav) return;

  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    nav.dataset.open = 'false';
  };

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    nav.dataset.open = String(!isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
}
