/**
 * @fileoverview User login and encryption helper module.
 * @module src/views/authentication/auth/encryption
 * @author Rakshana
 * @date 16/07/2025
 * @since 1.0.0
 */

import CryptoJS from 'crypto-js';
import { HostName } from "src/assets/host/Host";

/**
 * Saves information in the browser (cookies).
 * @param {string} name - Name of the cookie
 * @param {string} value - Value to save
 * @param {number} [days=7] - How many days it stays saved
 */
function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * Reads information from cookies.
 * @param {string} name - Name of the cookie
 * @returns {string|null} Value of the cookie, or null if not found
 */
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

/**
 * Deletes a cookie (removes saved info).
 * @param {string} name - Name of the cookie
 */
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Creates a new 256-bit secret key (used for encryption).
 * @returns {string} Randomly generated 32-character key
 */
function generate256BitKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
  const specialChars = '!@#$%&*';
  const numbers = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  let key = '';
  const keyLength = 32; 
  const randomArray = new Uint8Array(keyLength);
  window.crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < keyLength; i++) {
    if (i % 8 === 0 && i > 0) {
      const specialIndex = randomArray[i] % specialChars.length;
      key += specialChars[specialIndex];
    } else if (i % 5 === 0 && i > 0) {
      const numberIndex = randomArray[i] % numbers.length;
      key += numbers[numberIndex];
    } else {
      const letterIndex = randomArray[i] % letters.length;
      key += letters[letterIndex];
    }
  }
  
  return key;
}

/**
 * Prepares login headers for API requests.
 * @returns {Promise<Object>} Headers with token
 */
const getAuthHeaders = async () => {
  const encryptedToken = getCookie("HRToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${encryptedToken}`,
  };
};

/**
 * Saves session details to the server.
 * @param {string} sessionId - Session identifier
 * @param {string} decryptKey - Secret key for decrypting
 * @returns {Promise<Object>} Server response
 */
async function insertSessionData(sessionId, decryptKey) {
  const INSERT_API_URL = `${HostName}/Datadecrypt`;
  const TOKEN = 'HRFGVJISOVp1fncC';

  try {
    const headers = await getAuthHeaders();
    const requestBody = {
      session_id: sessionId,
      token: TOKEN,
      decryptkey: decryptKey
    };

    const response = await fetch(INSERT_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Session insert failed with status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Failed to insert session data: ${error.message}`);
  }
}

/**
 * Encrypts text using AES in ECB mode.
 * @param {string} plaintext - Normal text
 * @param {string} key - Secret key
 * @returns {string} Encrypted text (hex format)
 */
export function encryptECB(plaintext, key) {
  try {
    const keyWordArray = CryptoJS.enc.Utf8.parse(key);
    const plaintextWordArray = CryptoJS.enc.Utf8.parse(plaintext);
    const encrypted = CryptoJS.AES.encrypt(plaintextWordArray, keyWordArray, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  } catch {
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts text locked with AES-GCM.
 * @param {string} encryptedBase64 - Encrypted data (Base64 format)
 * @param {string} key - Secret key
 * @returns {Promise<string>} Decrypted text
 */
export async function decryptGCM(encryptedBase64, key) {
  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const nonce = encryptedBytes.slice(0, 12);
  const ciphertext = encryptedBytes.slice(12);
  const keyBuffer = new TextEncoder().encode(key);
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce },
      cryptoKey,
      ciphertext
    );
    return new TextDecoder().decode(decryptedBuffer);
  } catch {
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Saves user details in cookies.
 * @param {Object} userData - User information
 */
function saveUserToCookies(userData) {
  setCookie('userId', userData.userId, 7);
  setCookie('username', userData.username, 7);
  setCookie('userRole', userData.role, 7);
  setCookie('EmpId', userData.EmployeeId, 7);
  if (userData.mobileNo) {
    setCookie('mobileNo', userData.mobileNo, 7);
  }
}

/**
 * Reads user details from cookies.
 * @returns {Object|null} User information, or null if not found
 */
export function getUserFromCookies() {
  const userData = getCookie('userData');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Checks if the user is logged in.
 * @returns {boolean} True if logged in
 */
export function isUserAuthenticated() {
  return getCookie('isAuthenticated') === 'true' && getUserFromCookies() !== null;
}

/**
 * Logs out the user by removing cookies.
 */
export function logoutUser() {
  deleteCookie('userId');
  deleteCookie('username');
  deleteCookie('userRole');
  deleteCookie('EmpId');
  deleteCookie('mobileNo');
  deleteCookie('isAuthenticated');
  deleteCookie('userData');
  deleteCookie('HRToken');
  deleteCookie('session_id');
}

/**
 * Logs in the user with username and password.
 * Encrypts credentials, sends them to the server, 
 * and saves session + user info in cookies.
 * @param {string} username - User’s name
 * @param {string} password - User’s password
 * @returns {Promise<Object>} Login result with user, token, and session details
 */
export async function authenticateUser(username, password) {
  const API_URL = `${HostName}/HRldapfailure`;
  const TOKEN = 'HRFGVJISOVp1fncC';
  const ENCRYPTION_KEY = '7xPz!qL3vNc#eRb9Wm@f2Zh8Kd$gYp1B';

  try {
    const encryptedUsername = encryptECB(username, ENCRYPTION_KEY);
    const encryptedPassword = encryptECB(password, ENCRYPTION_KEY);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ token: TOKEN, username: encryptedUsername, password: encryptedPassword })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data.Data) {
      const decryptedData = await decryptGCM(data.Data, ENCRYPTION_KEY);
      const parsedData = JSON.parse(decryptedData);

      if (parsedData.valid === true) {
        const userData = {
          userId: parsedData.userId,
          username: parsedData.username,
          role: parsedData.role || '',
          EmployeeId: parsedData.EmployeeId || '',
          mobileNo: parsedData.MobileNumber || null
        };

        const sessionId = parsedData.sessionId || parsedData.session_id || parsedData.SessionId || parsedData.userId;
        const decryptKey = generate256BitKey();

        saveUserToCookies(userData);
        setCookie('isAuthenticated', 'true', 7);
        setCookie('userData', JSON.stringify(userData), 7);
        if (parsedData.token) setCookie('HRToken', parsedData.token, 7);
        if (sessionId) setCookie('session_id', sessionId, 7);

        try {
          await insertSessionData(sessionId || parsedData.userId, decryptKey);
        } catch (insertError) {
          console.error('Failed to insert session data:', insertError);
        }

        return { success: true, user: userData, token: parsedData.token || null, sessionId, decryptKey };
      } else {
        throw new Error('Invalid credentials');
      }
    } else {
      throw new Error('No data received from server');
    }
  } catch (error) {
    throw new Error(error.message || 'Login failed. Please check your credentials.');
  }
}

/**
 * Gets the session ID saved in cookies.
 * @returns {string|null} Session ID
 */
export function getSessionIdFromCookies() {
  return getCookie('session_id');
}

/**
 * Gets the decrypt key saved in cookies.
 * @returns {string|null} Decrypt key
 */
export function getDecryptKeyFromCookies() {
  return getCookie('decryptKey');
}
