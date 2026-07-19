import './styles/base.css';
import './styles/components.css';
import './styles/responsive.css';
import { wedding } from './config/content';
import { initCountdown } from './modules/countdown';
import { initEnvelope } from './modules/envelope';
import { initLazyMaps } from './modules/maps';
import { initMusic } from './modules/music';
import { initNavigation } from './modules/navigation';
import { initRsvp } from './modules/rsvp';
import { initScrollReveal } from './modules/scrollReveal';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = `
  <div class="envelope-screen" data-envelope>
    <div class="envelope-card" aria-label="Свадебное приглашение Дмитрия и Дарьи">
      <div class="envelope-flap"></div>
      <div class="envelope-lines" aria-hidden="true"></div>
      <p class="envelope-date">${wedding.dateText}</p>
      <p class="monogram">Д и Д</p>
      <button class="button button-primary envelope-button" type="button" data-open-invite>
        Открыть приглашение
      </button>
    </div>
  </div>

  <button class="music-toggle" type="button" data-music-toggle aria-pressed="false" aria-label="Включить музыку" title="Включить музыку">
    <svg class="icon-volume icon-volume-on" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <svg class="icon-volume icon-volume-off" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M18 9l4 4M22 9l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>

  <main id="main-content" tabindex="-1">
    <section class="hero" id="invite" aria-labelledby="hero-title">
      <button class="menu-toggle" type="button" data-menu-toggle aria-controls="main-nav" aria-expanded="false">
        <span></span><span></span><span></span>
        <span class="sr-only">Открыть меню</span>
      </button>
      <nav class="top-nav" id="main-nav" aria-label="Основная навигация" data-open="false">
        <a href="#program">Программа</a>
        <a href="#places">Места</a>
        <a href="#dress-code">Дресс-код</a>
        <a href="#rsvp">Анкета</a>
      </nav>
      <div class="hero-content" data-reveal>
        <p class="eyebrow">Свадебное приглашение</p>
        <h1 id="hero-title">${wedding.names}</h1>
        <p class="hero-date">${wedding.dateText}</p>
        <p class="hero-line">${wedding.heroLine}</p>
      </div>
      <a class="scroll-hint" href="#greeting">Листайте вниз</a>
    </section>

    <section class="section greeting" id="greeting" data-reveal>
      <div class="narrow">
        <p class="ornament" aria-hidden="true">Д и Д</p>
        <h2>Дорогие гости!</h2>
        <p>Мы будем рады разделить с вами этот особенный день. Ваша поддержка и любовь значат для нас очень много.</p>
        <p>Приглашаем вас присоединиться к нашему празднику любви, радости и счастья.</p>
      </div>
    </section>

    <section class="countdown-band" aria-labelledby="countdown-title" data-reveal>
      <div class="countdown-inner" data-countdown>
        <p class="eyebrow">До свадьбы осталось</p>
        <h2 id="countdown-title">28 августа 2026</h2>
        <div class="countdown-grid" aria-live="polite">
          <div><strong data-days>0</strong><span>дней</span></div>
          <div><strong data-hours>00</strong><span>часов</span></div>
          <div><strong data-minutes>00</strong><span>минут</span></div>
          <div><strong data-seconds>00</strong><span>секунд</span></div>
        </div>
      </div>
    </section>

    <section class="section program" id="program" aria-labelledby="program-title" data-reveal>
      <div class="section-heading">
        <p class="eyebrow">В этот день</p>
        <h2 id="program-title">Программа дня</h2>
      </div>
      <ol class="timeline">
        ${wedding.program
          .map((item) => `<li><time>${item.time}</time><span>${item.title}</span></li>`)
          .join('')}
      </ol>
    </section>

    <section class="photo-pause" aria-label="Фотография Дмитрия и Дарьи" data-reveal>
      <img src="${wedding.photos.first}" alt="Дмитрий и Дарья" loading="lazy" decoding="async" data-photo />
      <div class="photo-placeholder"><span>Здесь будет наша фотография</span></div>
    </section>

    <section class="section places" id="places" aria-labelledby="places-title" data-reveal>
      <div class="section-heading">
        <p class="eyebrow">Когда и где</p>
        <h2 id="places-title">Места проведения</h2>
      </div>
      <div class="place-grid">
        ${wedding.places
          .map(
            (place) => `
          <article class="place-card">
            <h3>${place.title}</h3>
            <p>${place.address}</p>
            <div class="map-shell" data-map-src="${place.embedUrl}" data-map-title="${place.mapTitle}">
              <span>Карта откроется в Яндекс Картах</span>
            </div>
            <p class="map-fallback">${place.title} пройдет по адресу: ${place.address}. Если карта не загрузилась, используйте кнопку маршрута.</p>
            <a class="button button-secondary" href="${place.routeUrl}" target="_blank" rel="noreferrer">Построить маршрут</a>
          </article>
        `,
          )
          .join('')}
      </div>
    </section>

    <section class="section dress-code" id="dress-code" aria-labelledby="dress-title" data-reveal>
      <div class="dress-layout">
        <div>
          <p class="eyebrow">Дресс-код</p>
          <h2 id="dress-title">Нежная цветовая гамма</h2>
          <p>Для девушек: нам будет особенно приятно видеть вас в нарядах нежной цветовой гаммы. Будем признательны, если белый цвет в этот день останется для невесты.</p>
          <p>Для мужчин: классический образ.</p>
        </div>
        <div class="palette-box">
          <div class="swatches" aria-label="Ориентиры пастельной палитры">
            ${wedding.dressPalette
              .map(
                (color) =>
                  `<span class="swatch" style="background-color: ${color.hex}" title="${color.name} - ${color.hex}" aria-label="${color.name} - ${color.hex}"></span>`,
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="section rsvp" id="rsvp" aria-labelledby="rsvp-title" data-reveal>
      <div class="narrow">
        <p class="eyebrow">RSVP</p>
        <h2 id="rsvp-title">Анкета гостя</h2>
        <p>Пожалуйста, сообщите нам до 1 августа 2026 года включительно, сможете ли вы быть с нами в этот день.</p>
        <p class="deadline-note" data-deadline-note hidden>Срок подтверждения уже прошел, но вы все еще можете отправить ответ.</p>
        <form class="rsvp-form" data-rsvp-form novalidate>
          <label>
            <span>Имя гостя</span>
            <input name="guestName" type="text" maxlength="80" autocomplete="name" placeholder="Например, Анна Иванова" />
            <small class="field-error" data-error-for="guestName"></small>
          </label>

          <fieldset>
            <legend>Статус участия</legend>
            <label class="choice"><input type="radio" name="attendance" value="attending" /> Буду присутствовать</label>
            <label class="choice"><input type="radio" name="attendance" value="declined" /> Не смогу присутствовать</label>
            <small class="field-error" data-error-for="attendance"></small>
          </fieldset>

          <fieldset data-arrival-group hidden>
            <legend>Ко скольки мы будем вас ждать?</legend>
            <div class="arrival-grid">
              ${wedding.arrivalOptions
                .map((option) => `<label class="choice"><input type="radio" name="arrivalTime" value="${option.value}" /> ${option.label}</label>`)
                .join('')}
            </div>
            <small class="field-error" data-error-for="arrivalTime"></small>
          </fieldset>

          <fieldset data-drinks-group hidden>
            <legend>Напитки</legend>
            <p class="hint">Можно выбрать несколько вариантов</p>
            <div class="drink-grid">
              ${wedding.drinks
                .map((drink) => `<label class="choice"><input type="checkbox" name="drinks" value="${drink}" /> ${drink}</label>`)
                .join('')}
            </div>
            <small class="field-error" data-error-for="drinks"></small>
          </fieldset>

          <label>
            <span>Комментарий</span>
            <textarea name="comment" maxlength="500" rows="4" placeholder="Напишите пожелания или важные детали, если нужно"></textarea>
            <small class="field-error" data-error-for="comment"></small>
          </label>

          <label class="hp" aria-hidden="true">
            <span>Website</span>
            <input name="website" tabindex="-1" autocomplete="off" />
          </label>

          <button class="button button-primary" type="submit" data-rsvp-submit>Отправить ответ</button>
          <p class="privacy-note">Отправляя форму, вы соглашаетесь на обработку указанных данных исключительно для организации свадьбы</p>
          <p class="form-status" data-rsvp-status role="status"></p>
        </form>
      </div>
    </section>

    <footer class="footer final-section">
      <div class="final-portraits" aria-label="Дмитрий и Дарья">
        <article class="portrait-card">
          <img src="${wedding.photos.groom}" alt="Дмитрий" loading="lazy" decoding="async" data-person-photo />
          <div class="photo-placeholder"><span>Дмитрий</span></div>
          <p>Дмитрий</p>
        </article>
        <article class="portrait-card">
          <img src="${wedding.photos.bride}" alt="Дарья" loading="lazy" decoding="async" data-person-photo />
          <div class="photo-placeholder"><span>Дарья</span></div>
          <p>Дарья</p>
        </article>
      </div>
      <p>Наше счастье станет полным только в окружении самых близких людей.</p>
      <p>До встречи на свадьбе!</p>
      <strong>${wedding.names}</strong>
      <span>28.08.2026</span>
    </footer>
  </main>
`;

document.querySelectorAll<HTMLImageElement>('[data-photo], [data-person-photo]').forEach((image) => {
  image.addEventListener('error', () => image.classList.add('is-missing'), { once: true });
  image.addEventListener(
    'load',
    () => {
      image.classList.add('is-loaded');
      image.closest('.photo-pause, .portrait-card')?.classList.add('has-photo');
    },
    { once: true },
  );
});

const startMusic = initMusic(wedding.audioPath);
initEnvelope(startMusic);
initCountdown(wedding.dateIsoMoscow);
initLazyMaps();
initNavigation();
initRsvp();
initScrollReveal();
