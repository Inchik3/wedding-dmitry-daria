# Дмитрий & Дарья — свадебное приглашение

Одностраничный сайт на Vite + TypeScript без UI-фреймворков.

## Локальный запуск

```bash
pnpm install
pnpm dev
```

## Проверки

```bash
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Переменные окружения

Скопируйте `.env.example` в `.env` при локальной настройке:

```text
VITE_BASE_PATH=/
VITE_GOOGLE_APPS_SCRIPT_URL=
```

Для GitHub Pages project page укажите:

```text
VITE_BASE_PATH=/repository-name/
```

## Ассеты

Фотографии:

- `public/images/hero.webp`
- `public/images/couple-01.webp`
- `public/images/couple-02.webp`

Если файлов нет, сайт показывает светлые заглушки. Hero-фото желательно не меньше 1600px по большей стороне, дополнительные фото не меньше 1200px.

Музыка:

- `public/audio/wedding-theme.mp3`

Файл запускается только после нажатия «Открыть приглашение».

Палитра дресс-кода:

- `public/images/dress-code-palette.png`

После добавления изображения нужно извлечь реальные HEX и обновить CSS-переменные в `src/styles/base.css` и `specs/design.md`.

## Apps Script

1. Создайте Google Sheet.
2. Откройте Extensions -> Apps Script.
3. Вставьте код из `google-apps-script/Code.gs`.
4. Deploy -> New deployment -> Web app.
5. Execute as: Me.
6. Who has access: Anyone with the link.
7. Скопируйте Web App URL в `VITE_GOOGLE_APPS_SCRIPT_URL`.

Таблица будет использовать лист `RSVP`. User-Agent не сохраняется.

## GitHub Pages

1. В настройках репозитория включите Pages через GitHub Actions.
2. При необходимости добавьте repository variable `VITE_BASE_PATH` со значением `/repository-name/`.
3. При подключенной RSVP-форме добавьте repository variable `VITE_GOOGLE_APPS_SCRIPT_URL`.
4. Сделайте push в `main` или запустите workflow вручную.

Если после публикации не грузятся стили или ассеты, почти всегда неверно указан `VITE_BASE_PATH`.
