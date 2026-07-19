export const wedding = {
  names: 'Дмитрий и Дарья',
  dateText: '28 августа 2026',
  dateIsoMoscow: '2026-08-28T13:00:00+03:00',
  rsvpDeadlineIsoMoscow: '2026-08-01T23:59:59+03:00',
  heroLine: 'Приглашаем вас разделить с нами этот особенный день',
  audioPath: `${import.meta.env.BASE_URL}audio/wedding-theme.mp3`,
  photos: {
    first: `${import.meta.env.BASE_URL}images/couple-01.webp`,
    second: `${import.meta.env.BASE_URL}images/couple-02.webp`,
    groom: `${import.meta.env.BASE_URL}images/groom.webp`,
    bride: `${import.meta.env.BASE_URL}images/bride.webp`,
  },
  program: [
    { time: '13:00', title: 'Регистрация' },
    { time: '16:00', title: 'Банкет' },
  ],
  places: [
    {
      key: 'registration',
      title: 'Регистрация',
      address: 'г. Саранск, ул. Коммунистическая, 61',
      mapTitle: 'Карта места регистрации',
      routeUrl:
        'https://yandex.ru/maps/42/saransk/house/kommunisticheskaya_ulitsa_61/YEwYdwBpQUYEQFtufX15dH1qbQ==/?ll=45.179833%2C54.185199&utm_source=share&z=17',
      embedUrl:
        'https://yandex.ru/map-widget/v1/?ll=45.179833%2C54.185199&z=17&mode=search&text=%D0%A1%D0%B0%D1%80%D0%B0%D0%BD%D1%81%D0%BA%2C%20%D0%9A%D0%BE%D0%BC%D0%BC%D1%83%D0%BD%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%2061',
    },
    {
      key: 'banquet',
      title: 'Банкет',
      address: 'Rose park, г. Саранск, ул. Строительная, 15',
      mapTitle: 'Карта места банкета',
      routeUrl: 'https://yandex.ru/maps/org/rose_park/119299981084/?ll=45.153979%2C54.205732&z=17',
      embedUrl:
        'https://yandex.ru/map-widget/v1/?ll=45.153979%2C54.205732&z=17&mode=search&oid=119299981084',
    },
  ],
  arrivalOptions: [
    { value: 'registration_1245', label: 'Приду на регистрацию к 12:45' },
    { value: 'banquet_1545', label: 'Подойду к банкету к 15:45' },
  ],
  drinks: [
    'Шампанское',
    'Вино белое',
    'Вино красное',
    'Водка',
    'Горячительный напиток ручной работы',
    'Без алкоголя',
  ],
  dressPalette: [
    { name: 'Нежный персиково-бежевый', hex: '#F2DDC6' },
    { name: 'Пудрово-розовый', hex: '#FDDDE6' },
    { name: 'Светлый лавандовый', hex: '#E6E6FA' },
    { name: 'Нежно-голубой', hex: '#DDEEFF' },
    { name: 'Светлый шалфейный', hex: '#DFEED4' },
    { name: 'Кремово-молочный', hex: '#FEFCDD' },
  ],
} as const;

export const appsScriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
