import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getResources, type Locale } from '@clara/app-i18n';
import { getInitialLocale, persistLocale } from './locale';

void i18n.use(initReactI18next).init({
  resources: getResources(),
  lng: getInitialLocale(),
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
});

export async function setApplicationLocale(locale: Locale): Promise<void> {
  persistLocale(locale);
  await i18n.changeLanguage(locale);
}

export default i18n;
