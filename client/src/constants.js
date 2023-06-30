import CryptoJS from "crypto-js";

const currencies = [
  {
    _id: 1,
    name: "EUR",
    value: "€"
  },
  {
    _id: 2,
    name: "USD",
    value: "$"
  },
];

const provincesInItaly = [
  'Agrigento',
  'Alessandria',
  'Ancona',
  'Aosta',
  'Arezzo',
  'Ascoli Piceno',
  'Asti',
  'Avellino',
  'Bari',
  'Barletta-Andria-Trani',
  'Belluno',
  'Benevento',
  'Bergamo',
  'Biella',
  'Bologna',
  'Bolzano',
  'Brescia',
  'Brindisi',
  'Cagliari',
  'Caltanissetta',
  'Campobasso',
  'Carbonia-Iglesias',
  'Caserta',
  'Catania',
  'Catanzaro',
  'Chieti',
  'Como',
  'Cosenza',
  'Cremona',
  'Crotone',
  'Cuneo',
  'Enna',
  'Fermo',
  'Ferrara',
  'Firenze',
  'Foggia',
  'Forlì-Cesena',
  'Frosinone',
  'Genova',
  'Gorizia',
  'Grosseto',
  'Imperia',
  'Isernia',
  'La Spezia',
  'L\'Aquila',
  'Latina',
  'Lecce',
  'Lecco',
  'Livorno',
  'Lodi',
  'Lucca',
  'Macerata',
  'Mantova',
  'Massa-Carrara',
  'Matera',
  'Messina',
  'Milano',
  'Modena',
  'Monza e Brianza',
  'Napoli',
  'Novara',
  'Nuoro',
  'Ogliastra',
  'Olbia-Tempio',
  'Oristano',
  'Padova',
  'Palermo',
  'Parma',
  'Pavia',
  'Perugia',
  'Pesaro e Urbino',
  'Pescara',
  'Piacenza',
  'Pisa',
  'Pistoia',
  'Pordenone',
  'Potenza',
  'Prato',
  'Ragusa',
  'Ravenna',
  'Reggio Calabria',
  'Reggio Emilia',
  'Rieti',
  'Rimini',
  'Roma',
  'Rovigo',
  'Salerno',
  'Medio Campidano',
  'Sassari',
  'Savona',
  'Siena',
  'Siracusa',
  'Sondrio',
  'Taranto',
  'Teramo',
  'Terni',
  'Torino',
  'Ogliastra',
  'Trapani',
  'Trento',
  'Treviso',
  'Trieste',
  'Udine',
  'Varese',
  'Venezia',
  'Verbano-Cusio-Ossola',
  'Vercelli',
  'Verona',
  'Vibo Valentia',
  'Vicenza',
  'Viterbo'
];

const prices = [
  {
    _id: 0,
    name: "Any",
    array: [0, 999],
  },
  {
    _id: 1,
    name: "$0 to $19",
    array: [0, 19],
  },
  {
    _id: 2,
    name: "$20 to $39",
    array: [20, 39],
  },
  {
    _id: 3,
    name: "$40 to $59",
    array: [40, 59],
  },
  {
    _id: 4,
    name: "$60 to $79",
    array: [60, 79],
  },
  {
    _id: 5,
    name: "More than $80",
    array: [80, 999],
  },
];

const colors = [
  {
    _id: 1,
    name: "black",
    color: "#000000",
  },
  {
    _id: 2,
    name: "white",
    color: "#ffffff",
  },
  {
    _id: 3,
    name: "red",
    color: "#ff0000",
  },
  {
    _id: 4,
    name: "green",
    color: "#008000",
  },
  {
    _id: 5,
    name: "beige",
    color: "#f5f5dc",
  },
];

const sizes = [
  {
    _id: 1,
    name: "XS",
  },
  {
    _id: 2,
    name: "S",
  },
  {
    _id: 3,
    name: "M",
  },
  {
    _id: 4,
    name: "L",
  },
];

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

const encryptData = (data, localStorageKey) => {
  // ********** ENCRYPTION **********
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    encryptionKey
  ).toString();
  localStorage.setItem(`${localStorageKey}`, encryptedData);
};

const decryptData = (localStorageKey) => {
  // ********** DECRYPTION **********
  const encryptedDataLs = localStorage.getItem(`${localStorageKey}`);
  if (encryptedDataLs) {
    const decryptedData = JSON.parse(
      CryptoJS.AES.decrypt(encryptedDataLs, encryptionKey).toString(
        CryptoJS.enc.Utf8
      )
    );
    // console.log("DECRYPTED DATA", decryptedData);
    return decryptedData;
  }
  return null;
};

export { prices, colors, sizes, encryptData, decryptData, provincesInItaly, currencies };
