import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          "Bring fashion to your furry friend!":
            "Bring fashion to your furry friend!",
          "Beautiful dog accessories that encourage you to live with fashion.":
            "Beautiful dog accessories that encourage you to live with fashion.",
          "Shop now": "Shop now",
        },
      },
      it: {
        translations: {
          "Bring fashion to your furry friend!":
            "Porta la moda al tuo amico peloso!",
          "Beautiful dog accessories that encourage you to live with fashion.":
            "Bellissimi accessori per cani che ti incoraggiano a vivere con la moda.",
            "Shop now": "Compra ora",
        },
      },
    },
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
