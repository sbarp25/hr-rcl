import CryptoJS from "crypto-js";

const desKey = "fc695f05c828e5331f406e9ee9fc2c6f3790bc93893470dc";

// Encryption function
const encryptData = (data, key) => {
  const encrypted = CryptoJS.TripleDES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

// Decryption function
const decryptData = (data, key) => {
  try {
    const decrypted = CryptoJS.TripleDES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

const LocalStorageUtil = {
  setItem: (key, value) => {
    if (key === "authToken") {
      localStorage.setItem(key, value); // Don't encrypt authToken
    } else {
      const encryptedValue = encryptData(value, desKey);
      localStorage.setItem(key, encryptedValue);
    }
  },
  getItem: (key) => {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;

    if (key === "authToken") {
      return storedValue; // Don't decrypt authToken
    } else {
      return decryptData(storedValue, desKey);
    }
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

export default LocalStorageUtil;