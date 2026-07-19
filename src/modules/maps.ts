export function initLazyMaps(): void {
  const placeholders = [...document.querySelectorAll<HTMLElement>('[data-map-src]')];

  const load = (target: HTMLElement) => {
    if (target.dataset.loaded === 'true') return;
    const src = target.dataset.mapSrc;
    const title = target.dataset.mapTitle || 'Карта';
    if (!src) return;

    if (src.includes('yandex.ru/maps/-/')) {
      target.replaceChildren();
      const text = document.createElement('span');
      text.textContent = 'Карта откроется в Яндекс Картах';
      target.append(text);
      target.dataset.loaded = 'true';
      target.dataset.externalMap = 'true';
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = title;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.setAttribute('allowfullscreen', 'true');
    target.replaceChildren(iframe);
    target.dataset.loaded = 'true';
  };

  if (!('IntersectionObserver' in window)) {
    placeholders.forEach(load);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          load(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '300px' },
  );

  placeholders.forEach((placeholder) => observer.observe(placeholder));
}
