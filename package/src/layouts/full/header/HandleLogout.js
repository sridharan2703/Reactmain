/**
 * @fileoverview Combined custom hook for handling user inactivity and session status monitoring with auto-logout.
 * @module src/hooks/useUserMonitor
 * @author Rakshana
 * @date 16/07/2025
 * @since 1.0.0
 * 
 * COMBINED FROM:
 * - useInactivityMonitor: Idle timeout detection, user activity event listeners, last activity timestamp management
 * - useSessionMonitor: Session status checking, session monitoring intervals, retry mechanism, session-related error detection
 * 
 * USAGE: Pass a logout callback that accepts (isAutoLogout: boolean).
 * The hook initializes on mount and cleans up on unmount.
 * Returns: checkSessionStatus (for manual checks), stopSessionMonitoring (for explicit stop), isSessionRelatedError (helper).
 * Optionally configure intervals, retries, timeouts, etc.
 */

import { useCallback, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { HostName } from "src/assets/host/Host";
import {
  decryptData,
  validateJsonData,
  isWebCryptoSupported,
} from 'src/components/Decryption/Decrypt';

const getAuthHeaders = async () => {
  const encryptedToken = Cookies.get('HRToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${encryptedToken}`,
  };
};

const useUserMonitor = (
  logoutCallback,
  {
    sessionCheckInterval = 60 * 1000,
    inactivityTimeout = 30 * 60 * 1000,
    inactivityCheckInterval = 10 * 1000,
    minCheckInterval = 30 * 1000,
    retryAttempts = 2,
    retryDelay = 2000
  } = {}
) => {
  // Session monitoring refs
  const sessionCheckRef = useRef(null);
  const retryCountRef = useRef(0);
  const isCheckingSessionRef = useRef(false);
  const isMountedRef = useRef(true);
  const lastSuccessfulCheckRef = useRef(null);

  // Inactivity monitoring refs
  const inactivityCheckRef = useRef(null);

  const API_TOKEN = 'HRFGVJISOVp1fncC';

  // Session-related helper
  const isSessionRelatedError = useCallback((error) => {
    if (!error) return false;
    
    const errorMessage = error.message?.toLowerCase() || '';
    const sessionErrorPatterns = [
      'session',
      'unauthorized',
      'authentication',
      'token',
      'invalid key',
      'decryption failed',
      'failed to get secret key',
      'no secret key received',
      'server returned invalid secret key'
    ];
    
    return sessionErrorPatterns.some(pattern => errorMessage.includes(pattern));
  }, []);

  // Session status check
  const checkSessionStatus = useCallback(async (isRetry = false, isUserInteraction = false) => {
    if (isCheckingSessionRef.current) {
      return true;
    }

    if (
      !isUserInteraction &&
      lastSuccessfulCheckRef.current &&
      Date.now() - lastSuccessfulCheckRef.current < minCheckInterval
    ) {
      return true;
    }

    if (!isWebCryptoSupported()) {
      console.error('Web Crypto API not supported');
      isCheckingSessionRef.current = false;
      await logoutCallback(true);
      return false;
    }
    
    if (!isMountedRef.current) {
      return false;
    }

    isCheckingSessionRef.current = true;

    try {
      const sessionId = Cookies.get('session_id');
      
      if (!sessionId) {
        console.warn('No session ID found');
        isCheckingSessionRef.current = false;
        await logoutCallback(true);
        return false;
      }

      const headers = await getAuthHeaders();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${HostName}/Sessiondata`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          token: API_TOKEN,
          Session_id: sessionId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Session check failed with status: ${response.status}`);
      }

      const encryptedData = await response.json();
      
      if (!encryptedData.Data) {
        throw new Error('No encrypted session data received');
      }
      
      let decryptedData;
      let parsedData;
      
      try {
        decryptedData = await decryptData(encryptedData.Data);
        parsedData = validateJsonData(decryptedData);
      } catch (decryptError) {
        console.error('Decryption error during session check:', decryptError);
        
        if (isSessionRelatedError(decryptError)) {
          console.warn('Session-related decryption failure detected, logging out');
          isCheckingSessionRef.current = false;
          await logoutCallback(true);
          return false;
        }
        
        throw decryptError;
      }
      
      if (parsedData.Status === 200 && parsedData.Data) {
        const sessionData = parsedData.Data;
        
        if (!sessionData.Records || !Array.isArray(sessionData.Records) || sessionData.Records.length === 0) {
          console.warn('No session records found');
          isCheckingSessionRef.current = false;
          await logoutCallback(true);
          return false;
        }
        
        const sessionRecord = sessionData.Records[0];
        
        if (!sessionRecord.hasOwnProperty('is_active')) {
          console.warn('Session record missing is_active field');
          isCheckingSessionRef.current = false;
          await logoutCallback(true);
          return false;
        }
        
        const isActive = sessionRecord.is_active;
        
        if (sessionRecord.created_at) {
          const sessionCreated = new Date(sessionRecord.created_at).getTime();
          const currentTime = Date.now();
          const SESSION_MAX_AGE = 24 * 60 * 60 * 1000;
          
          if (currentTime - sessionCreated > SESSION_MAX_AGE) {
            console.warn('Session expired due to age');
            isCheckingSessionRef.current = false;
            await logoutCallback(true);
            return false;
          }
        }

        if (isActive === 0 || isActive === "0" || isActive === false || isActive === "false") {
          console.warn('Session is marked as inactive by server');
          isCheckingSessionRef.current = false;
          await logoutCallback(true);
          return false;
        } else if (isActive === 1 || isActive === "1" || isActive === true || isActive === "true") {
          lastSuccessfulCheckRef.current = Date.now();
          retryCountRef.current = 0;
          isCheckingSessionRef.current = false;
          return true;
        } else if (isActive === null || isActive === undefined) {
          console.warn('Session status is null/undefined');
          isCheckingSessionRef.current = false;
          await logoutCallback(true);
          return false;
        } else {
          console.error(`Invalid session status: ${isActive} (type: ${typeof isActive})`);
          throw new Error(`Invalid session status: ${isActive}`);
        }
      } else {
        throw new Error(`Invalid session response structure - Status: ${parsedData.Status}`);
      }
      
    } catch (err) {
      console.error('Session check error:', err);
      isCheckingSessionRef.current = false;
      
      if (isSessionRelatedError(err)) {
        console.warn('Session-related error detected, logging out immediately');
        await logoutCallback(true);
        return false;
      }
      
      if (!isRetry && retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        console.log(`Retrying session check (attempt ${retryCountRef.current}/${retryAttempts})`);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCountRef.current));
        
        return await checkSessionStatus(true, isUserInteraction);
      }
      
      console.warn('Session check failed after retries, logging out');
      await logoutCallback(true);
      return false;
    }
  }, [logoutCallback, isSessionRelatedError, minCheckInterval, retryAttempts, retryDelay]);

  // Start session monitoring
  const startSessionMonitoring = useCallback(() => {
    if (sessionCheckRef.current) {
      clearInterval(sessionCheckRef.current);
    }
    
    const immediateCheck = async () => {
      if (!isMountedRef.current) {
        return;
      }
      await checkSessionStatus(false, false);
    };
    immediateCheck();
    
    const checkSession = async () => {
      if (!isMountedRef.current) {
        return;
      }
      await checkSessionStatus();
    };
    sessionCheckRef.current = setInterval(checkSession, sessionCheckInterval);
  }, [checkSessionStatus, sessionCheckInterval]);

  // Stop session monitoring
  const stopSessionMonitoring = useCallback(() => {
    if (sessionCheckRef.current) {
      clearInterval(sessionCheckRef.current);
      sessionCheckRef.current = null;
    }
    isCheckingSessionRef.current = false;
    retryCountRef.current = 0;
  }, []);

  // Inactivity user activity handler
  const handleUserActivity = useCallback((event) => {
    sessionStorage.setItem('lastActivity', Date.now().toString());
  }, []);

  // Inactivity check
  const checkInactivity = useCallback(async () => {
    const lastActivity = parseInt(sessionStorage.getItem('lastActivity') || '0', 10);
    const timeSinceLastActivity = Date.now() - lastActivity;

    if (timeSinceLastActivity >= inactivityTimeout) {
      console.warn(`User inactive for ${timeSinceLastActivity}ms, logging out`);
      await logoutCallback(true);
    }
  }, [logoutCallback, inactivityTimeout]);

  // Start inactivity monitoring
  const startInactivityMonitoring = useCallback(() => {
    if (inactivityCheckRef.current) {
      clearInterval(inactivityCheckRef.current);
    }

    inactivityCheckRef.current = setInterval(checkInactivity, inactivityCheckInterval);
  }, [checkInactivity, inactivityCheckInterval]);

  // Stop inactivity monitoring
  const stopInactivityMonitoring = useCallback(() => {
    if (inactivityCheckRef.current) {
      clearInterval(inactivityCheckRef.current);
      inactivityCheckRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Initialize last activity timestamp
    sessionStorage.setItem('lastActivity', Date.now().toString());
    
    // Start both monitorings
    startSessionMonitoring();
    startInactivityMonitoring();

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus',
      'blur',
      'keydown'
    ];

    const addEventListeners = () => {
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, { 
          passive: true, 
          capture: true 
        });
      });
    };

    addEventListeners();

    return () => {
      isMountedRef.current = false;
      stopSessionMonitoring();
      stopInactivityMonitoring();

      const removeEventListeners = () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, { capture: true });
        });
      };

      removeEventListeners();
    };
  }, [
    handleUserActivity,
    startSessionMonitoring,
    startInactivityMonitoring,
    stopSessionMonitoring,
    stopInactivityMonitoring
  ]);

  return { 
    checkSessionStatus, 
    stopSessionMonitoring, 
    isSessionRelatedError 
  };
};

export default useUserMonitor;