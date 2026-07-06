import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { en } from "~/locales/en";
import { zh } from "~/locales/zh";
import { logFailedPromise } from "~/lib/errors";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: en,
      },
      zh: {
        translation: zh,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })
  .catch(logFailedPromise);

export { i18n };
