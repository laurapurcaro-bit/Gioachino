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
          "All categories": "All categories",
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
          Any: "Any price",
          "$0 to $19": "0$ to 19$",
          "$20 to $39": "20$ to 39$",
          "$40 to $59": "40$ to 59$",
          "$60 to $79": "60$ to 79$",
          "More than $80": "More than 80$",
          Reset: "Reset",
          // Profile
          Profile: "Profile",
          "First name": "First name",
          "Last name": "Last name",
          firstNamePlaceholder: "Enter your first name",
          lastNamePlaceholder: "Enter your last name",
          Address: "Address",
          streetPlaceholder: "Enter your address: e.g. Via Rossi 3",
          emailPlaceholder: "Enter your email",
          passwordPlaceholder: "Enter your password",
          ZIP: "ZIP",
          City: "City",
          Country: "Country",
          Update: "Update",
          "+ Add Address": "+ Add Address",
          "Save Address": "Save Address",
          // Cart
          Cart: "Cart",
          "My cart": "My cart",
          "Continue Shopping": "Continue Shopping",
          "Your cart is empty.": "Your cart is empty.",
          Total: "Total",
          Remove: "Remove",
          Checkout: "Checkout",
          Color: "Color",
          Size: "Size",
          Subtotal: "Subtotal",
          languagePlaceholder: "en-US",
          "Total (IVA inlcuded)": "Total (IVA inlcuded)",
          "Expected delivery": "Expected delivery",
          // Product
          ADD: "ADD",
          VIEW: "VIEW",
          // Footer
          Connect: "Connect",
          Resources: "Resources",
          About: "About",
          Language: "Language",
          English: "English",
          Italian: "Italian",
          // Single Product Page
          Product: "Product",
          Description: "Description",
          Reviews: "Reviews",
          "Related Products": "Related Products",
          "OUT OF STOCK": "OUT OF STOCK",
          "ADD TO CART": "ADD TO CART",
          Quantity: "Quantity",
          red: "red",
          blue: "blue",
          green: "green",
          yellow: "yellow",
          black: "black",
          white: "white",
          pink: "pink",
          purple: "purple",
          orange: "orange",
          brown: "brown",
          grey: "grey",
          "cherry red": "cherry red",
          beige: "beige",
          "Additional information": "Additional information",
          // Checkout
          // AddressStep
          "Step 1: Add your address": "Step 1: Add your address",
          Street: "Street",
          Zip: "Zip",
          Next: "Next",
          cityPlaceholder: "Enter your city",
          zipPlaceholder: "Enter your zip code",
          countryPlaceholder: "Enter your country",
          // ShippingMethodStep
          "Step 2: Select shipping method": "Step 2: Select shipping method",
          "Standard Shipping": "Standard Shipping",
          "Express Shipping": "Express Shipping",
          Previous: "Previous",
          // PaymentMethodStep
          "Step 3: Select payment method": "Step 3: Select payment method",
          "Order summary": "Order summary",
          Shipping: "Shipping",
          Loading: "Loading",
          Pay: "Pay",
          paymentLanguagePlaceholder: "en_US",
          // Saved Items
          "My Wishlist": "My Wishlist",
          "Here you can find all the products you have saved for later.":
            "Here you can find all the products you have saved for later.",
          // Register
          "Register Here": "Register Here",
          confirmPasswordPlaceholder: "Confirm your password",
          REGISTER: "REGISTER",
          "Already registered? Login here.": "Already registered? Login here.",
          // Login
          "Welcome Back": "Welcome Back",
          "Login Here": "Login Here",
          "Not registered? Register here.": "Not registered? Register here.",
          "Forgot your password?": "Forgot your password?",
          "or login with": "or login with",
          // Orders
          Orders: "Orders",
          Status: "Status",
          Buyer: "Buyer",
          Ordered: "Ordered",
          Payment: "Payment",
          "Not Processed": "Not Processed",
          Processing: "Processing",
          Shipped: "Shipped",
          Delivered: "Delivered",
          Cancelled: "Cancelled",
          Completed: "Completed",
          Success: "Success",
          Failed: "Failed",
          // wishlist
          "Add a new wishlist": "Add a new wishlist",
          product: "product",
          products: "products",
          Add: "Add",
          enterWishlistName: "Enter wishlist name",
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
          "All categories": "Tutte le categorie",
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
          Any: "Tutti i prezzi",
          "$0 to $19": "0$ a 19$",
          "$20 to $39": "20$ a 39$",
          "$40 to $59": "40$ a 59$",
          "$60 to $79": "60$ a 79$",
          "More than $80": "Più di 80$",
          Reset: "Azzera",
          // Profile
          Profile: "Profilo",
          "First name": "Nome",
          "Last name": "Cognome",
          firstNamePlaceholder: "Inserisci il tuo nome",
          lastNamePlaceholder: "Inserisci il tuo cognome",
          Address: "Indirizzo",
          "+ Add Address": "+ Aggiungi indirizzo",
          streetPlaceholder: "Indirizzo: es. Via Rossi 3",
          emailPlaceholder: "Inserisci la tua email",
          passwordPlaceholder: "Inserisci la tua password",
          ZIP: "CAP",
          City: "Città",
          Country: "Stato",
          Update: "Salva",
          "Save Address": "Salva indirizzo",
          // Cart
          Cart: "Carrello",
          "Continue Shopping": "Continua lo shopping",
          "Your cart is empty.": "Il tuo carrello è vuoto.",
          Total: "Totale",
          Remove: "Rimuovi",
          Checkout: "Concludi l'ordine",
          Color: "Colore",
          Size: "Taglia",
          Subtotal: "Subtotale",
          "Total (IVA inlcuded)": "Totale (IVA inclusa)",
          "Expected delivery": "Consegna prevista",
          languagePlaceholder: "it-IT",
          // Product
          ADD: "AGGIUNGI",
          VIEW: "VEDI",
          // Footer
          Connect: "Collegati",
          Resources: "Risorse",
          About: "Informazioni",
          Language: "Lingua",
          English: "Inglese",
          Italian: "Italiano",
          // Single Product Page
          Product: "Prodotto",
          Description: "Descrizione",
          Reviews: "Recensioni",
          "Related Products": "Prodotti correlati",
          "OUT OF STOCK": "ESAURITO",
          "ADD TO CART": "AGGIUNGI AL CARRELLO",
          Quantity: "Quantità",
          red: "rosso",
          blue: "blu",
          green: "verde",
          yellow: "giallo",
          black: "nero",
          white: "bianco",
          pink: "rosa",
          purple: "viola",
          orange: "arancione",
          brown: "marrone",
          grey: "grigio",
          "cherry red": "rosso ciliegia",
          beige: "beige",
          "Additional information": "Informazioni aggiuntive",
          // Checkout
          // AddressStep
          "Step 1: Add your address": "Passo 1: Aggiungi il tuo indirizzo",
          Street: "Via",
          Zip: "CAP",
          Next: "Avanti",
          cityPlaceholder: "Inserisci la tua città",
          zipPlaceholder: "Inserisci il tuo CAP",
          countryPlaceholder: "Inserisci lo stato",
          // ShippingMethodStep
          "Step 2: Select shipping method":
            "Passo 2: Seleziona il metodo di spedizione",
          "Standard Shipping": "Spedizione standard",
          "Express Shipping": "Spedizione express",
          Previous: "Indietro",
          // PaymentMethodStep
          "Step 3: Select payment method":
            "Passo 3: Seleziona il metodo di pagamento",
          "Order summary": "Riepilogo ordine",
          Shipping: "Spedizione",
          Loading: "Caricamento",
          Pay: "Paga",
          paymentLanguagePlaceholder: "it_IT",
          // Saved Items
          "My Wishlist": "I miei preferiti",
          "Here you can find all the products you have saved for later.":
            "Qui puoi trovare tutti i prodotti che hai salvato per dopo.",
          // Register
          "Register Here": "Registrati qui",
          confirmPasswordPlaceholder: "Conferma la tua password",
          REGISTER: "REGISTRATI",
          "Already registered? Login here.": "Già registrato? Accedi qui.",
          // Login
          "Welcome Back": "Bentornato",
          "Login Here": "Accedi qui",
          "Not registered? Register here.": "Non registrato? Registrati qui.",
          "Forgot your password?": "Hai dimenticato la password?",
          "or login with": "o accedi con",
          // Orders
          Orders: "Ordini",
          Status: "Stato",
          Buyer: "Acquirente",
          Ordered: "Ordinato",
          Payment: "Pagamento",
          "Not Processed": "Non Processato",
          Processing: "In lavorazione",
          Shipped: "Spedito",
          Delivered: "Consegnato",
          Cancelled: "Cancellato",
          Completed: "Completato",
          Success: "Successo",
          Failed: "Fallito",
          // wishlist
          "Add a new wishlist": "Aggiungi una nuova lista",
          product: "articolo",
          products: "articoli",
          Add: "Aggiungi",
          enterWishlistName: "Inserisci il nome della lista",

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
