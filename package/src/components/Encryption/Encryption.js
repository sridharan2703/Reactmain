/**
 * @fileoverview User authentication and encryption utility module.
 * @module src/views/authentication/auth/encryption
 * @author Rakshana
 * @date 16/07/2025
 * @since 1.0.0
 */

import CryptoJS from 'crypto-js';
import { HostName } from "src/assets/host/Host";

function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

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

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function encryptECB(plaintext, key) {
  try {
    const keyWordArray = CryptoJS.enc.Utf8.parse(key);
    const plaintextWordArray = CryptoJS.enc.Utf8.parse(plaintext);
    const encrypted = CryptoJS.AES.encrypt(plaintextWordArray, keyWordArray, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  } catch (error) {
    throw new Error('Failed to encrypt data');
  }
}

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
      {
        name: 'AES-GCM',
        iv: nonce
      },
      cryptoKey,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    throw new Error('Failed to decrypt data');
  }
}

function saveUserToCookies(userData) {
  setCookie('userId', userData.userId, 7);
  setCookie('username', userData.username, 7);
  setCookie('userRole', userData.role, 7);
  setCookie('EmpId', userData.EmployeeId, 7);
  if (userData.mobileNo) {
    setCookie('mobileNo', userData.mobileNo, 7); // Save mobile number to cookies
  }
}

export function getUserFromCookies() {
  const userData = getCookie('userData');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data from cookies:', error);
      return null;
    }
  }
  return null;
}

export function isUserAuthenticated() {
  return getCookie('isAuthenticated') === 'true' && getUserFromCookies() !== null;
}

export function logoutUser() {
  deleteCookie('userId');
  deleteCookie('username');
  deleteCookie('userRole');
  deleteCookie('EmpId');
  deleteCookie('mobileNo'); // Clear mobile number cookie
  deleteCookie('isAuthenticated');
  deleteCookie('userData');
  deleteCookie('HRToken');
}

export async function authenticateUser(username, password) {
  const API_URL = `${HostName}/HRldap`;
  const TOKEN = 'HRFGVJISOVp1fncC';
  const ENCRYPTION_KEY = '7xPz!qL3vNc#eRb9Wm@f2Zh8Kd$gYp1B';

  try {
    const encryptedUsername = encryptECB(username, ENCRYPTION_KEY);
    const encryptedPassword = encryptECB(password, ENCRYPTION_KEY);
    const requestBody = {
      token: TOKEN,
      username: encryptedUsername,
      password: encryptedPassword
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.Data) {
      const decryptedData = await decryptGCM(data.Data, ENCRYPTION_KEY);
      const parsedData = JSON.parse(decryptedData);
      console.log('HRldap response:', parsedData);

      if (parsedData.valid === true) {
        const mobileNo = parsedData.MobileNumber; // Support multiple possible field names
        if (!mobileNo) {
          console.warn('Mobile number not found in HRldap response');
        }

        const userData = {
          userId: parsedData.userId,
          username: parsedData.username,
          role: parsedData.role || '',
          EmployeeId: parsedData.EmployeeId || '',
          mobileNo: mobileNo
        };

        saveUserToCookies(userData);
        setCookie('isAuthenticated', 'true', 7);
        setCookie('userData', JSON.stringify(userData), 7);
        if (parsedData.token) {
          setCookie('HRToken', parsedData.token, 7);
        }
        const sessionId = parsedData.sessionId || parsedData.session_id || parsedData.SessionId || parsedData.userId;
        if (sessionId) {
          setCookie('session_id', sessionId, 7);
        } else {
          console.warn('Session ID not found in HRldap response, using userId as fallback');
        }

        return {
          success: true,
          user: userData,
          token: parsedData.token || null,
          sessionId: sessionId || parsedData.userId || null // Fallback to userId if sessionId is missing
        };
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