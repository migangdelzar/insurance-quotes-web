import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getResources } from '@clara/app-i18n';
import { detectLocale } from './locale';

void i18n.use(initReactI18next).init({
  resources: getResources(),
  lng: detectLocale(),
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
});

export default i18n;
