/**
 * Converts Base64 string to ArrayBuffer
 * @param {string} base64
 * @returns {ArrayBuffer}
 */
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Decrypts data encrypted with AES-GCM
 * @param {string} encryptedData - Base64 encoded string with IV prepended
 * @returns {Promise<string>} - Decrypted plain text
 */
export const decrypt = async (encryptedData) => {
  try {
    const ENCRYPTION_KEY = '7xPz!qL3vNc#eRb9Wm@f2Zh8Kd$gYp1B'; // Ensure at least 32 chars for AES-256
    
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
    const data = encryptedArray.slice(12);
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};