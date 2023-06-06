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
          // Homepage
          "Bring fashion to your furry friend!":
            "Bring fashion to your furry friend!",
          "Beautiful dog accessories that encourage you to live with fashion.":
            "Beautiful dog accessories that encourage you to live with fashion.",
          "Shop now": "Shop now",
          Categories: "Categories",
          "Love and work are to people what water and sunshine are to plants":
            "Love and work are to people what water and sunshine are to plants",
          Accessories: "Accessories",
          Collars: "Collars",
          Leashes: "Leashes",
          Harnesses: "Harnesses",
          Beds: "Beds",
          Bowls: "Bowls",
        },
      },
      it: {
        translations: {
          // Homepage
          "Bring fashion to your furry friend!":
            "Porta la moda al tuo amico peloso!",
          "Beautiful dog accessories that encourage you to live with fashion.":
            "Bellissimi accessori per cani che ti incoraggiano a vivere con la moda.",
          "Shop now": "Compra ora",
          Categories: "Categorie",
          "Love and work are to people what water and sunshine are to plants":
            "Amore e lavoro sono per le persone ciò che l'acqua e il sole sono per le piante",
          Accessories: "Accessori",
          Collars: "Collari",
          Leashes: "Guinzagli",
          Harnesses: "Pettorine",
          Beds: "Divani",
          Bowls: "Ciotole",
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
