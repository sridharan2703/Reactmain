/**
 * @fileoverview Enhanced Dynamic Decryption Service with Auto-Retry and User-Friendly Errors
 * @module src/services/EnhancedDynamicDecryption
 * @author Rakshana
 * @date 06/11/2025
 * @since 2.2.0
 *
 * UPDATES:
 * - Added automatic retry mechanism on decryption failures
 * - User-friendly error messages
 * - Auto key cache clearing on errors
 * - Better session handling
 */

import Cookies from "js-cookie";
import { HostName } from "src/assets/host/Host";

const STATIC_ENCRYPTION_KEY = "7xPz!qL3vNc#eRb9Wm@f2Zh8Kd$gYp1B";
let dynamicDecryptionKey = null;
let keyFetchTime = null;
const KEY_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_RETRY_ATTEMPTS = 2;

/**
 * Turns a Base64 text into computer-readable format.
 * @param {string} base64 - Text in Base64 format
 * @returns {ArrayBuffer} Data in binary format
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
 * Decrypts locked data using a secret key.
 * @param {string} encryptedData - The locked (encrypted) text
 * @param {string} encryptionKey - The secret key (32 characters)
 * @returns {Promise<string>} The unlocked (plain) text
 */
export const decryptDataWithKey = async (encryptedData, encryptionKey) => {
  if (!window?.crypto?.subtle) {
    const error = new Error("Your browser does not support secure decryption.");
    error.isSessionRelated = false;
    error.userMessage =
      "Your browser doesn't support secure encryption. Please use a modern browser.";
    throw error;
  }

  if (!encryptedData || typeof encryptedData !== "string") {
    const error = new Error("Encrypted data must be a non-empty text.");
    error.isSessionRelated = false;
    error.userMessage = "No data received to decrypt.";
    throw error;
  }

  if (!encryptionKey || typeof encryptionKey !== "string") {
    const error = new Error("Encryption key must be a non-empty text.");
    error.isSessionRelated = true;
    error.userMessage = "Security key is missing. Please try again.";
    throw error;
  }

  try {
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    const encryptedArray = new Uint8Array(encryptedBuffer);

    // Make sure the key is always 32 characters
    const keyString =
      encryptionKey.length === 32
        ? encryptionKey
        : (encryptionKey + "00000000000000000000000000000000").substring(0, 32);

    const keyBytes = new TextEncoder().encode(keyString);
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    // First 12 characters are "IV" (needed for decryption)
    const iv = encryptedArray.slice(0, 12);
    const ciphertext = encryptedArray.slice(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    // Decryption failures often indicate invalid keys (session issue)
    const wrappedError = new Error(`Decryption failed: ${error.message}`);
    wrappedError.isSessionRelated = true;
    wrappedError.userMessage =
      "Unable to decrypt data. Your session may have expired.";
    wrappedError.originalError = error;
    throw wrappedError;
  }
};

/**
 * Prepares headers for API requests (with user token).
 * @returns {Promise<Object>} Headers with login info
 */
const getAuthHeaders = async () => {
  const encryptedToken = Cookies.get("HRToken");

  if (!encryptedToken) {
    const error = new Error("No authentication token found");
    error.isSessionRelated = true;
    error.userMessage = "Your session has expired. Please log in again.";
    throw error;
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${encryptedToken}`,
  };
};

/**
 * Gets a fresh secret key from the server.
 * (Reuses old one if it's still valid for 30 minutes.)
 * @param {boolean} forceRefresh - Force fetch new key even if cached
 * @returns {Promise<string>} The secret key
 */
export const fetchDecryptionKey = async (forceRefresh = false) => {
  // Return cached key if still valid and not forcing refresh
  if (
    !forceRefresh &&
    dynamicDecryptionKey &&
    keyFetchTime &&
    Date.now() - keyFetchTime < KEY_CACHE_DURATION
  ) {
    return dynamicDecryptionKey;
  }

  try {
    const headers = await getAuthHeaders();
    const API_TOKEN = "HRFGVJISOVp1fncC";
    const sessionId = Cookies.get("session_id");

    if (!sessionId) {
      const error = new Error("No session ID found");
      error.isSessionRelated = true;
      error.userMessage = "Session not found. Please log in again.";
      throw error;
    }

    const response = await fetch(`${HostName}/DatadecryptKey`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        token: API_TOKEN,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const error = new Error(`Server error: ${response.status}`);
      error.isSessionRelated =
        response.status === 401 || response.status === 403;
      error.userMessage = error.isSessionRelated
        ? "Your session has expired. Please log in again."
        : "Unable to connect to server. Please try again.";
      throw error;
    }

    const encryptedResponse = await response.json();
    if (!encryptedResponse.Data) {
      const error = new Error("No secret key received from server");
      error.isSessionRelated = true;
      error.userMessage =
        "Server didn't provide security key. Please try again.";
      throw error;
    }

    // Unlock the server response using the static key
    let decryptedData;
    try {
      decryptedData = await decryptDataWithKey(
        encryptedResponse.Data,
        STATIC_ENCRYPTION_KEY
      );
    } catch (decryptError) {
      console.error("Failed to decrypt key response:", decryptError);
      const error = new Error(
        `Failed to decrypt server key: ${decryptError.message}`
      );
      error.isSessionRelated = true;
      error.userMessage = "Unable to process security key. Please try again.";
      error.originalError = decryptError;
      throw error;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(decryptedData);
    } catch (parseError) {
      const error = new Error("Invalid JSON in decrypted key response");
      error.isSessionRelated = true;
      error.userMessage =
        "Received invalid data from server. Please try again.";
      error.originalError = parseError;
      throw error;
    }

    if (
      parsedData.Status !== 200 ||
      !parsedData.Data?.Records?.[0]?.decryptkey
    ) {
      const error = new Error("Server returned invalid secret key structure");
      error.isSessionRelated = true;
      error.userMessage = "Server returned invalid data. Please try again.";
      throw error;
    }

    dynamicDecryptionKey = parsedData.Data.Records[0].decryptkey;
    keyFetchTime = Date.now();

    return dynamicDecryptionKey;
  } catch (error) {
    // Clear cache on any error to force fresh fetch next time
    clearKeyCache();

    // Preserve userMessage if it exists
    if (!error.userMessage) {
      error.userMessage = "Unable to get security key. Please try again.";
    }

    // Preserve isSessionRelated flag
    if (!error.hasOwnProperty("isSessionRelated")) {
      error.isSessionRelated = true;
    }

    throw error;
  }
};

/**
 * Decrypts locked text using the latest server key with auto-retry.
 * @param {string} encryptedData - The locked (encrypted) text
 * @param {number} attemptNumber - Current attempt number (for internal use)
 * @returns {Promise<string>} The unlocked (plain) text
 */
export const decryptData = async (encryptedData, attemptNumber = 1) => {
  try {
    const decryptionKey = await fetchDecryptionKey(attemptNumber > 1);
    return await decryptDataWithKey(encryptedData, decryptionKey);
  } catch (error) {
    // If decryption failed and we haven't exceeded max retries, try again with fresh key
    if (
      error.isSessionRelated !== false &&
      attemptNumber < MAX_RETRY_ATTEMPTS
    ) {
      console.log(
        `Decryption attempt ${attemptNumber} failed, retrying with fresh key...`
      );
      clearKeyCache();
      return await decryptData(encryptedData, attemptNumber + 1);
    }

    // Preserve error properties
    if (!error.userMessage) {
      error.userMessage = "Unable to load data. Please try again.";
    }
    if (!error.hasOwnProperty("isSessionRelated")) {
      error.isSessionRelated = true;
    }

    throw error;
  }
};

/**
 * Makes sure the unlocked data is proper JSON.
 * @param {string} data - Text to check
 * @returns {Object} Parsed JSON object
 */
export const validateJsonData = (data) => {
  try {
    // Check if data looks like an error message before parsing
    if (
      typeof data === "string" &&
      (data.toLowerCase().includes("failed") ||
        data.toLowerCase().includes("error") ||
        data.toLowerCase().includes("invalid"))
    ) {
      const error = new Error("Decryption returned an error message");
      error.isSessionRelated = true;
      error.userMessage = "Unable to process data. Please refresh the page.";
      throw error;
    }

    return JSON.parse(data);
  } catch (error) {
    // If it's already wrapped, throw it
    if (error.userMessage) {
      throw error;
    }

    const wrappedError = new Error("Unlocked data is not valid JSON.");
    wrappedError.isSessionRelated = false;
    wrappedError.userMessage =
      "Received invalid data format. Please try again.";
    wrappedError.originalError = error;
    throw wrappedError;
  }
};

/**
 * Unlocks data and turns it into JSON in one step with auto-retry.
 * @param {string} encryptedData - Locked JSON text
 * @returns {Promise<Object>} Unlocked and parsed JSON
 */
export const decryptAndParseJson = async (encryptedData) => {
  try {
    const decryptedData = await decryptData(encryptedData);
    return validateJsonData(decryptedData);
  } catch (error) {
    // Preserve all error properties from nested calls
    throw error;
  }
};

/**
 * Checks if your browser supports secure decryption.
 * @returns {boolean} True if supported
 */
export const isWebCryptoSupported = () => {
  return !!window?.crypto?.subtle;
};

/**
 * Clears the saved secret key (forces new fetch).
 */
export const clearKeyCache = () => {
  dynamicDecryptionKey = null;
  keyFetchTime = null;
  console.log("Decryption key cache cleared");
};

/**
 * Shows info about the saved key (for debugging).
 * @returns {Object} Info about key status and time left
 */
export const getKeyCacheInfo = () => {
  return {
    hasKey: !!dynamicDecryptionKey,
    fetchTime: keyFetchTime,
    isExpired: keyFetchTime
      ? Date.now() - keyFetchTime >= KEY_CACHE_DURATION
      : true,
    cacheValidFor: keyFetchTime
      ? Math.max(0, KEY_CACHE_DURATION - (Date.now() - keyFetchTime))
      : 0,
  };
};

/**
 * Checks if an error is session-related
 * @param {Error} error - The error to check
 * @returns {boolean} True if error indicates session issues
 */
export const isSessionRelatedError = (error) => {
  if (!error) return false;

  // Check explicit flag
  if (error.hasOwnProperty("isSessionRelated")) {
    return error.isSessionRelated;
  }

  // Check error message patterns
  const errorMessage = error.message?.toLowerCase() || "";
  const sessionErrorPatterns = [
    "session",
    "unauthorized",
    "authentication",
    "token",
    "invalid key",
    "decryption failed",
    "failed to get secret key",
    "no secret key received",
    "server returned invalid secret key",
    "no session id",
    "no authentication token",
  ];

  return sessionErrorPatterns.some((pattern) => errorMessage.includes(pattern));
};

/**
 * Gets user-friendly error message from error object
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (!error) return "An unknown error occurred. Please try again.";

  // Use custom userMessage if available
  if (error.userMessage) {
    return error.userMessage;
  }

  // Check if session-related
  if (isSessionRelatedError(error)) {
    return "Your session has expired. Please refresh the page or log in again.";
  }

  // Default message
  return "Unable to load data. Please try again.";
};

export default {
  decryptData,
  decryptDataWithKey,
  validateJsonData,
  decryptAndParseJson,
  isWebCryptoSupported,
  fetchDecryptionKey,
  clearKeyCache,
  getKeyCacheInfo,
  isSessionRelatedError,
  getUserFriendlyErrorMessage,
};
