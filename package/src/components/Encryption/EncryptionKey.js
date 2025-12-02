/**
 * @file EncryptionKey.js
 * @description
 * Unified Encryption/Decryption module for frontend API requests.
 * - AES-GCM 256-bit encryption (Go-compatible)
 * - Enhanced dynamic decryption with retry, key cache, and validation helpers
 * - Includes session-aware error utilities
 *
 * @version 1.1.0 
 * @date 2025-11-10
 * @author Elakiya
 */

import Cookies from "js-cookie";
import { HostName } from "src/assets/host/Host";

// ===== Constants =====
const STATIC_ENCRYPTION_KEY = "7xPz!qL3vNc#eRb9Wm@f2Zh8Kd$gYp1B";
let dynamicDecryptionKey = null;
let keyFetchTime = null;
const KEY_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const MAX_RETRY_ATTEMPTS = 2;

// ===== Browser Support =====
export const isWebCryptoSupported = () => {
  return !!(window.crypto && window.crypto.subtle);
};

// ===== Validation Helpers (Updated) =====
export const validateJsonData = (data) => {
  // If decrypted result is a string → valid for OTP APIs
  if (typeof data === "string") return true;

  // If it's an object → valid
  if (data && typeof data === "object") return true;

  return false;
};

// ===== Error Utilities =====
export const isSessionRelatedError = (error) => {
  if (!error) return false;
  return (
    error.isSessionRelated === true ||
    /token|session|expired|unauthorized/i.test(error.message || "")
  );
};

// ===== Utility Functions =====
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++)
    bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}

const getAuthHeaders = async () => {
  const token = Cookies.get("HRToken");
  if (!token) {
    const error = new Error("No authentication token found");
    error.isSessionRelated = true;
    error.userMessage = "Your session has expired. Please log in again.";
    throw error;
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ===== Cache Handling =====
export const clearKeyCache = () => {
  dynamicDecryptionKey = null;
  keyFetchTime = null;
  console.info("🔐 Decryption key cache cleared");
};

// ===== Decryption Core =====
export const decryptDataWithKey = async (encryptedData, keyString) => {
  try {
    if (!isWebCryptoSupported()) {
      throw new Error("Web Crypto API is not supported in this browser");
    }

    if (!encryptedData || typeof encryptedData !== "string") {
      const e = new Error("Invalid encrypted data format");
      e.userMessage = "Invalid or missing encrypted data.";
      e.isSessionRelated = false;
      throw e;
    }

    const normalizedKey =
      keyString.length === 32
        ? keyString
        : (keyString + "00000000000000000000000000000000").substring(0, 32);

    const key = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(normalizedKey),
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const combined = new Uint8Array(base64ToArrayBuffer(encryptedData));
    if (combined.length < 12) throw new Error("Ciphertext too short");

    const nonce = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    const wrapped = new Error(`Decryption failed: ${error.message}`);
    wrapped.isSessionRelated = true;
    wrapped.userMessage =
      "Unable to decrypt response. Your session might have expired.";
    wrapped.originalError = error;
    throw wrapped;
  }
};

// ===== Dynamic Key Fetch =====
export const fetchDecryptionKey = async (forceRefresh = false) => {
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
    const sessionId = Cookies.get("session_id");
    const API_TOKEN = "HRFGVJISOVp1fncC";

    if (!sessionId) {
      const e = new Error("No session ID found");
      e.isSessionRelated = true;
      e.userMessage = "Session not found. Please log in again.";
      throw e;
    }

    const response = await fetch(`${HostName}/DatadecryptKey`, {
      method: "POST",
      headers,
      body: JSON.stringify({ token: API_TOKEN, session_id: sessionId }),
    });

    if (!response.ok) {
      const e = new Error(`Server error: ${response.status}`);
      e.isSessionRelated = [401, 403].includes(response.status);
      e.userMessage = e.isSessionRelated
        ? "Your session has expired. Please log in again."
        : "Unable to reach the server. Please try again.";
      throw e;
    }

    const encryptedResponse = await response.json();
    if (!encryptedResponse.Data) {
      const e = new Error("No key returned from server");
      e.userMessage = "Server did not return a valid key.";
      throw e;
    }

    const decrypted = await decryptDataWithKey(
      encryptedResponse.Data,
      STATIC_ENCRYPTION_KEY
    );

    const parsed = JSON.parse(decrypted);
    if (parsed.Status !== 200 || !parsed.Data?.Records?.[0]?.decryptkey) {
      const e = new Error("Invalid key structure received");
      e.userMessage = "Invalid key structure. Please retry.";
      throw e;
    }

    dynamicDecryptionKey = parsed.Data.Records[0].decryptkey;
    keyFetchTime = Date.now();
    return dynamicDecryptionKey;
  } catch (error) {
    clearKeyCache();
    if (!error.userMessage)
      error.userMessage = "Unable to fetch decryption key.";
    if (!("isSessionRelated" in error)) error.isSessionRelated = true;
    throw error;
  }
};

// ===== Enhanced Decrypt with Retry (Patched) =====
export const decryptData = async (encryptedPayload, attempt = 1) => {
  try {
    if (!encryptedPayload || typeof encryptedPayload !== "string") {
      throw new Error("Invalid encrypted payload format");
    }

    const parts = encryptedPayload.split("||");
    if (parts.length !== 2) {
      const e = new Error("Malformed encrypted payload");
      e.userMessage = "Data format mismatch. Please retry.";
      throw e;
    }

    const [sessionId, encryptedPart] = parts;
    const key = await fetchDecryptionKey(attempt > 1);

    // Raw decrypted text
    const decryptedJSON = await decryptDataWithKey(encryptedPart, key);

    // Clean: Remove padding / null bytes
    let cleaned = decryptedJSON.trim().replace(/[\x00-\x1F\x7F]+$/g, "");

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      // Not JSON → allow string responses (OTP APIs)
      return cleaned;
    }

    if (!validateJsonData(parsed)) {
      const e = new Error("Decrypted response is not valid JSON structure");
      e.userMessage = "Received unexpected data format from server.";
      throw e;
    }

    parsed.session_id = sessionId;
    return parsed;
  } catch (error) {
    if (error.isSessionRelated !== false && attempt < MAX_RETRY_ATTEMPTS) {
      console.warn(
        `🔁 Decryption retry (${attempt}) due to key/session issue...`
      );
      clearKeyCache();
      return await decryptData(encryptedPayload, attempt + 1);
    }
    throw error;
  }
};

// ===== Encryption Logic =====
export const encryptDataWithKey = async (plainData, encryptionKey) => {
  try {
    const plainText =
      typeof plainData === "string" ? plainData : JSON.stringify(plainData);

    const keyString =
      encryptionKey.length === 32
        ? encryptionKey
        : (encryptionKey + "00000000000000000000000000000000").substring(0, 32);

    const key = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(keyString),
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    const nonce = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedText = new TextEncoder().encode(plainText);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      encodedText
    );

    const combined = new Uint8Array(nonce.length + encryptedBuffer.byteLength);
    combined.set(nonce);
    combined.set(new Uint8Array(encryptedBuffer), nonce.length);

    return arrayBufferToBase64(combined.buffer);
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

export const encryptPayloadForGo = async (payload) => {
  try {
    const sessionId = payload.session_id || Cookies.get("session_id");
    if (!sessionId) throw new Error("session_id is required for encryption");

    const encryptionKey = await fetchDecryptionKey();
    const { session_id, ...cleanPayload } = payload;

    const encryptedData = await encryptDataWithKey(cleanPayload, encryptionKey);
    return `${sessionId}||${encryptedData}`;
  } catch (error) {
    throw new Error(`Failed to encrypt payload: ${error.message}`);
  }
};

// ===== Send Encrypted API Request =====
export const sendEncryptedData = async (
  endpoint,
  rawData,
  extraHeaders = {}
) => {
  try {
    const encryptedPayload = await encryptPayloadForGo(rawData);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("HRToken")}`,
      ...extraHeaders,
    };

    const response = await fetch(`${HostName}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ Data: encryptedPayload }),
    });

    if (!response.ok)
      throw new Error(`API request failed: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to send encrypted data: ${error.message}`);
  }
};

// ===== Exports =====
export default {
  decryptData,
  validateJsonData,
  isWebCryptoSupported,
  isSessionRelatedError,
  clearKeyCache,
  fetchDecryptionKey,
  sendEncryptedData,
  encryptPayloadForGo,
  encryptDataWithKey,
};
