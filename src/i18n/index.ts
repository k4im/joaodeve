import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt',
    debug: false, // Desabilite o debug em produção
    lng: 'pt',
    supportedLngs: ['pt', 'en'],
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: './locales/{{lng}}/translation.json' // Use caminho relativo
    }
  });

export default i18n;
