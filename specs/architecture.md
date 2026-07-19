# Architecture

## Стек после утверждения

После точной команды «Спеки утверждены, приступай к реализации» использовать:

- Vite;
- TypeScript;
- обычный HTML;
- обычный CSS;
- небольшой модульный TypeScript;
- Vitest;
- Playwright;
- Google Apps Script для RSVP;
- GitHub Pages.

React, Vue, Angular, jQuery, тяжелые UI-библиотеки и CSS-фреймворки не использовать.

## Структура проекта после утверждения

```text
.
├── public/
│   ├── audio/
│   │   └── wedding-theme.mp3
│   └── images/
│       ├── hero.webp
│       ├── couple-01.webp
│       ├── couple-02.webp
│       └── dress-code-palette.png
├── src/
│   ├── main.ts
│   ├── styles/
│   │   ├── base.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── config/
│   │   └── content.ts
│   ├── modules/
│   │   ├── envelope.ts
│   │   ├── countdown.ts
│   │   ├── music.ts
│   │   ├── maps.ts
│   │   ├── navigation.ts
│   │   ├── rsvp.ts
│   │   ├── validation.ts
│   │   └── scrollReveal.ts
│   └── shared/
│       ├── dom.ts
│       └── time.ts
├── tests/
│   ├── unit/
│   └── e2e/
├── google-apps-script/
│   └── Code.gs
├── .github/workflows/
│   └── pages.yml
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

Эта структура является планом для этапа реализации, не создается на spec-first этапе.

## Модули

- `envelope`: состояние открытия, фокус, reduced-motion, запуск первого пользовательского действия.
- `navigation`: mobile menu, плавные переходы к секциям, активные состояния.
- `countdown`: расчет времени до 2026-08-28 13:00 Europe/Moscow.
- `scrollReveal`: IntersectionObserver с отключением при reduced-motion.
- `music`: lazy creation audio, play/pause, missing file state.
- `maps`: отложенная загрузка iframe, fallback-ссылки.
- `rsvp`: состояние формы, submit, retry, success/error.
- `validation`: чистые функции проверки имени, статуса, напитков, комментария.
- `api client`: POST в Google Apps Script.
- `content/config`: тексты, даты, адреса, пути ассетов.
- `shared DOM utilities`: короткие безопасные helpers без переусложнения.

## Поток данных

`content/config` хранит дату, адреса, тексты, список напитков, путь к ассетам и env-dependent настройки. DOM-модули получают конфигурацию, рендерят состояния и подписываются на события. RSVP собирает данные формы, валидирует, отправляет API-клиенту и отображает результат.

## Работа таймера

Целевый момент: `2026-08-28T13:00:00+03:00`. Для Москвы на эту дату смещение +03:00, поэтому расчет можно выполнять относительно абсолютного timestamp, созданного из ISO-строки со смещением. Это не зависит от локального часового пояса устройства.

Тесты должны покрыть:
- время до события;
- момент события;
- время после события;
- пользователей в разных локальных часовых поясах.

## Работа музыки

- Audio element создается или активируется только после клика по конверту.
- `loop = true`.
- Ошибки `play()` и загрузки файла перехватываются.
- При недоступном файле кнопка показывает нейтральное состояние и не ломает интерфейс.

## Обработка отсутствующих файлов

- Для фото использовать проверку загрузки `img.onerror` и CSS placeholder.
- Для hero placeholder не должен ломать композицию.
- Для музыки ошибки не логировать как необработанные.
- Для палитры показывать текстовые swatches из подтвержденных CSS-переменных или нейтральное состояние до анализа.

## Lazy loading

- Hero-фото загружается сразу.
- `couple-01`, `couple-02`, карты и iframe загружаются лениво.
- IntersectionObserver используется с rootMargin примерно `300px`.
- При отсутствии IntersectionObserver fallback должен сразу показывать доступные ссылки и не блокировать контент.

## Карты

- Без API-ключа.
- Основной вариант: безопасный iframe Яндекс Карт с адресным поиском или публичной ссылкой.
- Если координаты не подтверждены, URL строится от адреса, а не от выдуманных координат.
- Маршрут открывается в новой вкладке.

## RSVP state machine

Состояния:

- `idle`: форма доступна.
- `invalid`: показаны ошибки валидации.
- `submitting`: кнопка disabled, показывается loading text.
- `success`: показано подтверждение.
- `error`: показана ошибка, значения сохранены, доступна повторная попытка.
- `disabled-config`: Apps Script URL отсутствует, отправка недоступна, просмотр страницы работает.

## Клиентская валидация

- Имя: required, trim, длина 2-80.
- Статус: required.
- Напитки: required только для «Буду присутствовать».
- Комментарий: max 500.
- Honeypot: скрытое поле; если заполнено, клиент может не отправлять или сервер мягко отклоняет.
- Пользовательский ввод не вставлять через `innerHTML`.

## API-контракт

POST JSON:

```json
{
  "guestName": "string",
  "attendance": "attending | declined",
  "drinks": ["string"],
  "comment": "string",
  "submittedAt": "ISO string",
  "isLate": false,
  "honeypot": ""
}
```

Ответ success:

```json
{ "ok": true, "message": "Ответ сохранён. Спасибо!" }
```

Ответ error:

```json
{ "ok": false, "message": "Не удалось сохранить ответ. Попробуйте ещё раз." }
```

## Google Apps Script

Создается только после утверждения спецификаций. Должен:

- принимать POST;
- валидировать поля на сервере;
- не записывать User-Agent;
- не требовать секретов в клиентском коде;
- писать в Google Sheets;
- возвращать JSON;
- обрабатывать CORS для web app сценария;
- ограничивать частоту примитивно, насколько возможно в Apps Script.

## Структура Google Sheets

Лист `RSVP`:

- `submittedAt`;
- `guestName`;
- `attendance`;
- `drinks`;
- `comment`;
- `isLate`;
- `source`;
- `requestId`.

User-Agent не сохраняется.

## Rate limiting

Apps Script не дает полноценной защиты от спама без backend-инфраструктуры. Минимальный подход:

- honeypot;
- длины полей;
- server-side validation;
- lock service при записи;
- простая дедупликация по `requestId` или близким повторным отправкам.

## CORS

Apps Script Web App обычно принимает form-like или JSON POST, но preflight может быть ограничением. Реализация должна выбрать контракт, который стабильно работает с deployed Web App, и описать это в README. Ошибки CORS должны отображаться как обычная ошибка отправки.

## Переменные окружения

`.env.example` после утверждения:

```text
VITE_BASE_PATH=/
VITE_GOOGLE_APPS_SCRIPT_URL=
```

Реальный `.env` не коммитить.

## GitHub Pages base path

Vite `base` настраивается через `VITE_BASE_PATH`. Для repository page использовать `/repository-name/`. Все ассеты должны строиться через корректный base-aware путь.

## GitHub Actions

Создается после утверждения. Workflow:

- push в основную ветку;
- `workflow_dispatch`;
- install через lockfile;
- typecheck;
- Vitest;
- Playwright или сокращенный E2E-набор с обоснованием;
- build;
- публикация `dist`;
- минимальные permissions.

## Безопасность

- Нет секретов в клиентском коде.
- Нет аналитики.
- Нет User-Agent в таблице.
- Нет `innerHTML` для пользовательского ввода.
- Server-side validation обязательна.

## Доступность

- Семантические секции.
- Видимые focus states.
- `aria-live` для таймера и RSVP-состояний только там, где это не создает шум.
- `prefers-reduced-motion`.
- Карты с title и текстовым fallback.

## Тестовая стратегия

Vitest:
- countdown и timezone;
- RSVP validation;
- deadline;
- API response handling.

Playwright:
- envelope;
- audio missing;
- navigation;
- RSVP states;
- maps fallback;
- reduced-motion;
- mobile menu;
- console errors.

## Наблюдаемые ограничения

- Точные координаты мест не подтверждены на этапе спецификаций.
- Точные HEX дресс-кода требуют реального файла палитры.
- Фотографии и музыка будут добавлены заказчиком.
- Успешность Apps Script публикации проверяется только после создания и деплоя скрипта.
