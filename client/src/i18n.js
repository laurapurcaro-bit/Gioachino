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
          // Navbar
          Catalogue: "Catalogue",
          Search: "Search",
          Account: "Account",
          // User Dashboard
          Hello: "Hello",
          "Your account": "Your account",
          "In your account, Gioachino, you can manage your orders, returns, and contact information.":
            "In your account, Gioachino, you can manage your orders, returns, and contact information.",
          "Here you can find information about your updates, returns, or refunds.":
            "Here you can find information about your updates, returns, or refunds.",
          "Continue shopping.": "Continue shopping.",
          // User Menu
          Overview: "Overview",
          "Personal details": "Personal details",
          "Saved items": "Saved items",
          "My orders": "My orders",
          Returns: "Returns",
          Addresses: "Addresses",
          "Payment methods": "Payment methods",
          // Shop
          "Filter by Categories": "Filter by Categories",
          "Filter by Prices": "Filter by Prices",
          // prices names
          "Any": "Any price",
          "$0 to $19": "0$ to 19$",
          "$20 to $39": "20$ to 39$",
          "$40 to $59": "40$ to 59$",
          "$60 to $79": "60$ to 79$",
          "More than $80": "More than 80$",
          Reset: "Reset",
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
          // Navbar
          Catalogue: "Catalogo",
          Search: "Cerca",
          Account: "Profilo",
          // User Dashboard
          Hello: "Ciao",
          "Your account": "Il tuo account",
          "In your account, Gioachino, you can manage your orders, returns, and contact information.":
            "Dal tuo account Gioachino puoi gestire i tuoi ordini, resi e dati di contatto.",
          "Here you can find information about your updates, returns, or refunds.":
            "Qui puoi trovare informazioni sui tuoi aggiornamenti, resi o rimborsi.",
          "Continue shopping.": "Continua lo shopping.",
          // User Menu
          Overview: "Panoramica",
          "Personal details": "Dati personali",
          "Saved items": "Liste salvati",
          "My orders": "I miei ordini",
          Returns: "Resi",
          Addresses: "Indirizzi",
          "Payment methods": "Metodi di pagamento",
          // Shop
          "Filter by Categories": "Filtra per Categorie",
          "Filter by Prices": "Filtra per Prezzi",
          // prices names
          "Any": "Tutti i prezzi",
          "$0 to $19": "0$ a 19$",
          "$20 to $39": "20$ a 39$",
          "$40 to $59": "40$ a 59$",
          "$60 to $79": "60$ a 79$",
          "More than $80": "Più di 80$",
          Reset: "Azzera",
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
