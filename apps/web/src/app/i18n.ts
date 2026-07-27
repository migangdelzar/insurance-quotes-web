import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getResources, type Locale } from '@clara/app-i18n';
import { getInitialLocale, persistLocale } from './locale';

function synchronizeDocumentLanguage(locale: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale.toLowerCase().startsWith('es')
    ? 'es-MX'
    : 'en';
}

const initialLocale = getInitialLocale();
synchronizeDocumentLanguage(initialLocale);
i18n.on('languageChanged', synchronizeDocumentLanguage);

void i18n.use(initReactI18next).init({
  resources: getResources(),
  lng: initialLocale,
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
});

export async function setApplicationLocale(locale: Locale): Promise<void> {
  persistLocale(locale);
  await i18n.changeLanguage(locale);
}

export default i18n;
