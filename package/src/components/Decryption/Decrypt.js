/**
 * @fileoverview Decrypts incoming data using a predefined encryption key.
 * @module src/components/Decryption/Decrypt
 * @author Rakshana
 * @date 16/07/2025
 * @since 1.0.0
 */
const ENCRYPTION_KEY = "7xPz!qL3vNc#eRb9Wm@f2Zh8Kd$gYp1B";

function base64ToArrayBuffer(base64) {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    throw new Error(`Invalid base64 string: ${error.message}`);
  }
}

export const decryptData = async (encryptedData) => {
  if (!window?.crypto?.subtle) {
    throw new Error(
      "Web Crypto API not available. Cannot decrypt in this browser."
    );
  }
  if (!encryptedData || typeof encryptedData !== "string") {
    throw new Error("Invalid encrypted data: must be a non-empty string");
  }

  try {
    const keyData = new TextEncoder().encode(ENCRYPTION_KEY);
    const key = await window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const iv = encryptedArray.slice(0, 12);
    const ciphertext = encryptedArray.slice(12);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
    const result = new TextDecoder().decode(decrypted);
    return result;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

export const validateJsonData = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Decrypted data is not valid JSON");
  }
};

export const decryptAndParseJson = async (encryptedData) => {
  const decryptedData = await decryptData(encryptedData);
  return validateJsonData(decryptedData);
};

export const isWebCryptoSupported = () => {
  return !!window?.crypto?.subtle;
};

export default {
  decryptData,
  validateJsonData,
  decryptAndParseJson,
  isWebCryptoSupported,
};
