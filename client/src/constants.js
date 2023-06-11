import CryptoJS from "crypto-js";

const prices = [
  {
    _id: 0,
    name: "Any",
    array: [],
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
  console.log("ENCRYPTED DATA", encryptedData);
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
    console.log("DECRYPTED DATA", decryptedData);
    return decryptedData;
  }
  console.log("DECRYPTED DATA L", encryptedDataLs);
  return null;
};

export { prices, colors, sizes, encryptData, decryptData };
