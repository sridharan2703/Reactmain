/**
 * @file OTPVerification.js
 * @description
 * Main page for displaying office order modules as cards with counts.
 * Updated: Fixed layout to handle dynamic table width and sidebar resizing.
 * @module src/views/authentication/auth/OTPVerification
 * @author Rakshana
 * @date 22/07/2025
 * @since 1.0.0
 * @modifiedby Rovita
 * @modifiedon 26-11-2025
 */

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { 
  Security, 
  Timer, 
  DevicesOther, 
  VerifiedUser, 
  ExpandMore,
  Delete 
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { isWebCryptoSupported } from 'src/components/Decryption/Decrypt';
import {
  decryptData,
  encryptPayloadForGo,
} from 'src/components/Encryption/EncryptionKey';

const TRUST_DURATION_DAYS = 30;

/**
 * Gets authentication headers with encrypted token
 * @returns {Object} Headers object with authorization token
 */
const getAuthHeaders = async () => {
  const encryptedToken = Cookies.get('HRToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${encryptedToken}`,
  };
};

/**
 * Generates a unique device fingerprint based on browser and device characteristics
 * @returns {string} A unique device fingerprint hash
 */
const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.deviceMemory || 'unknown'
  ].join('|');
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

/**
 * Gets readable device information as a formatted string
 * @returns {string} A string describing the device, browser, and OS
 */
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let deviceType = 'Unknown Device';
  let browser = 'Unknown Browser';
  if (/Mobile|Android|iPhone|iPad/.test(ua)) {
    if (/iPhone/.test(ua)) deviceType = 'iPhone';
    else if (/iPad/.test(ua)) deviceType = 'iPad';
    else if (/Android/.test(ua)) deviceType = 'Android Device';
    else deviceType = 'Mobile Device';
  } else {
    deviceType = 'Desktop';
  }
  if (/Chrome/.test(ua)) browser = 'Chrome';
  else if (/Firefox/.test(ua)) browser = 'Firefox';
  else if (/Safari/.test(ua)) browser = 'Safari';
  else if (/Edge/.test(ua)) browser = 'Edge';

  return `${deviceType} - ${browser}`;
};

/**
 * Individual OTP input component
 */
const OtpInput = forwardRef(({ value, onChange, disabled, index, onKeyDown, onPaste }, ref) => {
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    onChange(index, val);
  };

  const handleKeyDown = (e) => {
    onKeyDown(e, index);
  };

  const handlePaste = (e) => {
    onPaste(e, index);
  };

  return (
    <TextField
      inputRef={ref}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      disabled={disabled}
      inputProps={{
        maxLength: 1,
        style: {
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: '500',
          padding: '12px 0'
        },
        autoComplete: 'one-time-code'
      }}
      sx={{
        width: '50px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          transition: 'all 0.2s ease-in-out',
          '&:hover fieldset': {
            borderColor: disabled ? '#e0e0e0' : '#1976d2',
            borderWidth: '2px'
          },
          '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
            borderWidth: '2px',
            boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)'
          },
          '& fieldset': {
            transition: 'all 0.2s ease-in-out'
          }
        },
        '& .MuiInputBase-input': {
          transition: 'all 0.2s ease-in-out'
        }
      }}
    />
  );
});

/**
 * Main OTP Verification Component
 * Handles OTP verification, trusted devices, and device management
 */
const OtpVerification = ({
  verifiedUser,
  onOtpSuccess,
  onResendOtp,
  phoneNumber,
  otpLoading = false,
  sessionId
}) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(Date.now());
  const [resendAttempts, setResendAttempts] = useState(3);
  const [trustThisDevice, setTrustThisDevice] = useState(false);
  const [trustedDevices, setTrustedDevices] = useState([]);
  const [isCurrentDeviceTrusted, setIsCurrentDeviceTrusted] = useState(false);
  const [isSkippingOtp, setIsSkippingOtp] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCheckingTrustedDevice, setIsCheckingTrustedDevice] = useState(true);

  const timerRef = useRef(null);
  const inputRefs = useRef([]);
  inputRefs.current = otpValues.map((_, i) => inputRefs.current[i] ?? React.createRef());

  const navigate = useNavigate();
  const API_TOKEN = 'HRFGVJISOVp1fncC';

  /**
   * Retrieves username from sessionStorage, localStorage, or cookies
   * @returns {string} The username
   */
  const getUsername = () => {
    const username = sessionStorage.getItem('username') ||
                    localStorage.getItem('username') ||
                    Cookies.get('username');
    return username || '';
  };

  /**
   * Checks if the current device is trusted for the given username
   * @param {string} username - The username to check trusted devices for
   * @returns {boolean} True if the device is trusted, false otherwise
   */
  const checkTrustedDevice = (username) => {
    if (!username) return false;
    
    const deviceFingerprint = generateDeviceFingerprint();
    const trustedDevicesData = localStorage.getItem(`trusted_devices_${username}`);

    if (trustedDevicesData) {
      try {
        let devices = JSON.parse(trustedDevicesData);
        const currentTime = new Date().getTime();
        
        // Filter out expired devices
        const validDevices = devices.filter(device => currentTime < device.expiresAt);
        
        // Update storage with valid devices only
        if (validDevices.length !== devices.length) {
          localStorage.setItem(`trusted_devices_${username}`, JSON.stringify(validDevices));
        }
        
        setTrustedDevices(validDevices);
        
        // Check if current device is trusted
        const isTrusted = validDevices.some(device => device.fingerprint === deviceFingerprint);
        return isTrusted;
      } catch (error) {
        return false;
      }
    }
    
    return false;
  };

  /**
   * Adds the current device to the trusted devices list for the given username
   * @param {string} username - The username to add the trusted device for
   */
  const addTrustedDevice = (username) => {
    if (!username) return;

    const deviceFingerprint = generateDeviceFingerprint();
    const deviceInfo = getDeviceInfo();
    const currentTime = new Date().getTime();
    const expiresAt = currentTime + (TRUST_DURATION_DAYS * 24 * 60 * 60 * 1000);

    const existingDevices = JSON.parse(
      localStorage.getItem(`trusted_devices_${username}`) || '[]'
    );

    // Remove existing entry for this device if any
    const filteredDevices = existingDevices.filter(
      device => device.fingerprint !== deviceFingerprint
    );

    const newDevice = {
      fingerprint: deviceFingerprint,
      deviceInfo,
      trustedAt: currentTime,
      expiresAt,
      location: 'Current Location'
    };

    const updatedDevices = [...filteredDevices, newDevice];
    localStorage.setItem(`trusted_devices_${username}`, JSON.stringify(updatedDevices));
    setTrustedDevices(updatedDevices);
    setIsCurrentDeviceTrusted(true);
  };

  /**
   * Removes a trusted device from the list for the given username
   * @param {string} username - The username to remove the trusted device for
   * @param {string} fingerprint - The fingerprint of the device to remove
   */
  const removeTrustedDevice = (username, fingerprint) => {
    let existingDevices = JSON.parse(localStorage.getItem(`trusted_devices_${username}`) || '[]');
    const updatedDevices = existingDevices.filter(device =>
      device.fingerprint !== fingerprint
    );
    localStorage.setItem(`trusted_devices_${username}`, JSON.stringify(updatedDevices));
    setTrustedDevices(updatedDevices);
    setIsCurrentDeviceTrusted(checkTrustedDevice(username));
    setSuccess('Device removed successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  /**
   * Skip OTP verification for trusted devices
   * @returns {boolean} True if skip was successful, false otherwise
   */
  const skipOtpForTrustedDevice = async () => {
    const username = getUsername();
    if (!username || !sessionId) {
      setIsSkippingOtp(false);
      setIsCheckingTrustedDevice(false);
      return false;
    }

    try {
      setIsSkippingOtp(true);
      setSuccess('Trusted device detected. Skipping OTP verification...');

      // Simulate successful verification for trusted device
      const mockSuccessResponse = {
        success: true,
        message: 'OTP verification skipped - Trusted device',
        session_id: sessionId,
        Status: 200,
        validcheck: '1'
      };

      // Set session cookies
      Cookies.set('session_id', sessionId, { expires: 7 });
      if (!Cookies.get('username')) {
        Cookies.set('username', username, { expires: 7 });
      }

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const userData = {
        ...verifiedUser,
        username: username,
        mobileNo: phoneNumber,
      };

      // Call success callback
      if (onOtpSuccess) {
        onOtpSuccess({
          user: userData,
          sessionId: sessionId,
          apiResponse: mockSuccessResponse,
          deviceTrusted: true,
          skippedOtp: true,
        });
      } else {
        navigate('/dashboard');
      }

      return true;
    } catch (error) {
      setError('Failed to skip OTP. Please enter verification code.');
      setIsSkippingOtp(false);
      setIsCheckingTrustedDevice(false);
      return false;
    }
  };

  const otp = otpValues.join('');

  /**
   * Focuses on a specific OTP input field
   * @param {number} index - The index of the input to focus
   */
  const focusInput = (index) => {
    if (index >= 0 && index < 6 && inputRefs.current[index]?.current) {
      inputRefs.current[index].current.focus();
    }
  };
  
  /**
   * Starts the OTP countdown timer
   */
  const startOtpTimer = () => {
    setTimeLeft(45);
    setIsOtpExpired(false);
    setOtpSentTime(Date.now());

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsOtpExpired(true);
          clearInterval(timerRef.current);
          if (resendAttempts <= 0) {
            setTimeout(() => window.location.reload(), 2000);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  /**
   * Force refresh the page to clear all cached encryption data
   */
  const forcePageRefresh = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  // Initialize component and check trusted device status
  useEffect(() => {
    const initializeComponent = async () => {
      const username = getUsername();
      
      if (username && sessionId) {
        // Check if device is trusted
        const isTrusted = checkTrustedDevice(username);
        setIsCurrentDeviceTrusted(isTrusted);

        // Auto-skip OTP for trusted devices
        if (isTrusted) {
          await skipOtpForTrustedDevice();
        } else {
          // Only start timer if device is not trusted
          startOtpTimer();
          setTimeout(() => focusInput(0), 100);
        }
      } else {
        // Start timer if no username/sessionId
        startOtpTimer();
        setTimeout(() => focusInput(0), 100);
      }
      
      setIsInitialized(true);
      setIsCheckingTrustedDevice(false);
    };

    const timeoutId = setTimeout(() => {
      initializeComponent();
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [sessionId]);

  // Auto-submit OTP only for non-trusted devices
  useEffect(() => {
    if (otp.length === 6 && !isVerifying && !isOtpExpired && !isCurrentDeviceTrusted && isInitialized) {
      handleOtpSubmit();
    }
  }, [otp, isInitialized]);

  /**
   * Handles OTP input changes and manages focus
   * @param {number} index - The index of the changed input
   * @param {string} value - The new value
   */
  const handleOtpChange = (index, value) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    if (error) setError('');
    if (success) setSuccess('');
    if (value && index < 5) {
      setTimeout(() => focusInput(index + 1), 10);
    }
  };

  /**
   * Handles keyboard events for OTP inputs
   * @param {Object} e - Keyboard event
   * @param {number} index - The index of the input
   */
  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        const newValues = [...otpValues];
        
        if (otpValues[index]) {
          newValues[index] = '';
          setOtpValues(newValues);
        } else if (index > 0) {
          newValues[index - 1] = '';
          setOtpValues(newValues);
          focusInput(index - 1);
        }
        break;

      case 'Delete':
        e.preventDefault();
        const deleteValues = [...otpValues];
        deleteValues[index] = '';
        setOtpValues(deleteValues);
        break;

      case 'ArrowLeft':
        e.preventDefault();
        focusInput(Math.max(0, index - 1));
        break;

      case 'ArrowRight':
        e.preventDefault();
        focusInput(Math.min(5, index + 1));
        break;

      case 'Home':
        e.preventDefault();
        focusInput(0);
        break;

      case 'End':
        e.preventDefault();
        focusInput(5);
        break;

      case 'Enter':
        if (otp.length === 6) {
          handleOtpSubmit();
        }
        break;

      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        e.preventDefault();
        handleOtpChange(index, e.key);
        break;

      default:
        if (!/^\d$/.test(e.key) && !['Tab', 'Shift'].includes(e.key)) {
          e.preventDefault();
        }
        break;
    }
  };

  /**
   * Handles paste events for OTP inputs
   * @param {Object} e - Paste event
   * @param {number} index - The index where paste occurred
   */
  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length > 0) {
      const newOtpValues = [...otpValues];
      const availableSlots = 6 - index;
      const digitsToPaste = pastedData.slice(0, availableSlots);
      
      for (let i = 0; i < digitsToPaste.length; i++) {
        if (index + i < 6) {
          newOtpValues[index + i] = digitsToPaste[i];
        }
      }
      
      setOtpValues(newOtpValues);
      
      const nextFocusIndex = Math.min(index + digitsToPaste.length, 5);
      setTimeout(() => focusInput(nextFocusIndex), 10);
    }
  };

  /**
   * Clears all OTP input fields
   */
  const clearOtpInputs = () => {
    setOtpValues(['', '', '', '', '', '']);
    setTimeout(() => focusInput(0), 100);
  };

  /**
   * Submits OTP for verification
   */
  const handleOtpSubmit = async () => {
    // Don't proceed if device is trusted or not initialized
    if (isCurrentDeviceTrusted || !isInitialized) return;

    if (otp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (isOtpExpired) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    // Additional validation
    if (!sessionId) {
      setError('Session expired. Please try again.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const username = getUsername();
      if (!username) {
        throw new Error('Username not found. Please login again.');
      }

      if (!sessionId) {
        throw new Error('Session ID not found. Please login again.');
      }

      const headers = await getAuthHeaders();
      const requestBody = {
        token: API_TOKEN,
        username: username,
        mobileno: parseInt(phoneNumber?.replace(/\D/g, '') || '0'),
        P_id: sessionId,
        otp: parseInt(otp),
        otpsendon: new Date(otpSentTime).toISOString(),
        otpverifiedon: new Date().toISOString(),
        status: 1,
        updatedon: new Date().toISOString()
      };

      // Check Web Crypto support before encryption
      if (!isWebCryptoSupported()) {
        throw new Error('Browser security features not supported. Please update your browser.');
      }

      const encryptedPayload = await encryptPayloadForGo(requestBody);
      
      const response = await fetch(`https://wftest1.iitm.ac.in:7007/Loginotpupdate`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Verification failed. Please try again.`);
      }

      const responseData = await response.json();
      
      if (!responseData.Data) {
        throw new Error('No response data received from server');
      }

      // Decrypt the response
      const decryptedData = await decryptData(responseData.Data);
      let result = typeof decryptedData === 'string' ? JSON.parse(decryptedData) : decryptedData;

      // Check for success
      const isSuccess = 
        result.success === true ||
        result.success === 'true' ||
        result.Status === 200 ||
        result.validcheck === '1' ||
        result.validcheck === 1;

      if (isSuccess) {
        const finalSessionId = result.session_id || result.P_id || sessionId;

        setSuccess('OTP verified successfully!');
        setResendAttempts(3);
        
        // Set session cookies
        Cookies.set('session_id', finalSessionId, { expires: 7 });
        if (!Cookies.get('username')) {
          Cookies.set('username', username, { expires: 7 });
        }

        // Add to trusted devices if checkbox is checked
        if (trustThisDevice && !isCurrentDeviceTrusted) {
          addTrustedDevice(username);
          setSuccess('OTP verified successfully! Device trusted for 30 days.');
        }

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        const userData = {
          ...verifiedUser,
          username: username,
          mobileNo: phoneNumber,
        };

        // Call success callback
        if (onOtpSuccess) {
          onOtpSuccess({
            user: userData,
            sessionId: finalSessionId,
            apiResponse: result,
            deviceTrusted: trustThisDevice || isCurrentDeviceTrusted,
            skippedOtp: false,
          });
        }
      } else {
        const errorMessage = result.message || 'Invalid OTP. Please try again.';
        setError(errorMessage);
        clearOtpInputs();
      }
    } catch (error) {
      // Enhanced error handling with automatic refresh for encryption issues
      if (error.message.includes('Decryption failed') || 
          error.message.includes('session') ||
          error.message.includes('encryption') ||
          error.message.includes('decryption')) {
        
        setError('Session conflict detected. Refreshing page...');
        
        // Auto-refresh after short delay
        setTimeout(() => {
          forcePageRefresh();
        }, 2000);
        
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.message || 'OTP verification failed. Please try again.');
      }
      
      clearOtpInputs();
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handles OTP resend functionality
   */
  const handleResendOtp = async () => {
    if (resendAttempts <= 0) {
      setError('Maximum resend attempts reached. Refreshing page...');
      setTimeout(() => window.location.reload(), 3000);
      return;
    }

    try {
      setError('');
      clearOtpInputs();
      setSuccess('');

      if (!sessionId) {
        throw new Error('Session ID not available. Please login again.');
      }

      await onResendOtp();
      const newAttempts = resendAttempts - 1;
      setResendAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        setError('This was your last resend attempt. Page will refresh shortly...');
        setTimeout(() => window.location.reload(), 3000);
        return;
      }
      
      startOtpTimer();
      setSuccess('New verification code sent!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    }
  };

  /**
   * Formats seconds into MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Formats timestamp into localized date string
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted date string
   */
  const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();

  // Show loading page when checking trusted device status
  if (isCheckingTrustedDevice || isSkippingOtp) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgb(255, 255, 255)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          height: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: 400,
            height: 200,
            borderRadius: 3,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isSkippingOtp ? 'Trusted Device Detected' : 'Checking Device Security...'}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {isSkippingOtp 
              ? 'Skipping OTP verification for trusted device' 
              : 'Verifying your device security status'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'rgb(255, 255, 255)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 400,
          minHeight: 520,
          borderRadius: 3,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              transition: 'all 0.3s ease'
            }}
          >
            <Security sx={{ fontSize: 32, color: '#1976d2' }} />
          </Box>
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Verify OTP
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Code sent to ••••••{phoneNumber?.slice(-4) || ''}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Enter the 6-digit code or paste it from your messages
          </Typography>

          {/* Device Status Indicator */}
          {isCurrentDeviceTrusted && trustedDevices.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Chip
                icon={<VerifiedUser />}
                label={`Trusted Device (${trustedDevices.length})`}
                color="success"
                variant="outlined"
                size="small"
                sx={{
                  fontWeight: 500,
                  animation: 'pulse 2s ease-in-out',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 }
                  }
                }}
              />
            </Box>
          )}
        </Box>

        {/* Timer Display */}
        <Box display="flex" alignItems="center" justifyContent="center" mt={3} mb={2}>
          <Timer
            sx={{ 
              mr: 1, 
              color: timeLeft <= 10 ? '#f44336' : '#1976d2', 
              fontSize: 22,
              animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 }
              }
            }}
          />
          <Typography
            variant="body1"
            color={timeLeft <= 10 ? 'error' : 'primary'}
            fontWeight="600"
            sx={{ fontSize: '1.1rem' }}
          >
            {isOtpExpired ? 'Code Expired' : formatTime(timeLeft)}
          </Typography>
        </Box>

        {/* Alert Messages */}
        <Box sx={{ width: '100%', mb: 2, minHeight: '60px' }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                animation: 'slideIn 0.3s ease-out',
                '@keyframes slideIn': {
                  '0%': { opacity: 0, transform: 'translateY(-10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                borderRadius: 2,
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              {success}
            </Alert>
          )}
        </Box>

        {/* OTP Input Section */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Typography variant="body1" fontWeight="600" gutterBottom textAlign="center" sx={{ mb: 3 }}>
            Enter Verification Code
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            {otpValues.map((value, index) => (
              <OtpInput
                key={index}
                ref={inputRefs.current[index]}
                value={value}
                onChange={handleOtpChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                disabled={isOtpExpired || isVerifying}
                index={index}
              />
            ))}
          </Stack>

          <Typography 
            variant="caption" 
            color="text.secondary" 
            textAlign="center" 
            display="block"
            sx={{ mt: 2 }}
          >
            {otp.length}/6 digits entered
            {otp.length === 6 && ' • Auto-verifying...'}
          </Typography>

          {/* Trust Device Option */}
          {!isCurrentDeviceTrusted && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trustThisDevice}
                      onChange={(e) => setTrustThisDevice(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DevicesOther sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Trust this device for 30 days
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                display="block"
                sx={{ mt: 1 }}
              >
                Skip OTP verification on this device
              </Typography>
            </>
          )}

          {/* Manage Trusted Devices Section */}
          {trustedDevices.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Accordion sx={{ width: '100%' }} defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body2" fontWeight="600">
                    Manage Trusted Devices ({trustedDevices.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ width: '100%' }}>
                    {trustedDevices.map((device) => (
                      <ListItem key={device.fingerprint} divider>
                        <ListItemText
                          primary={device.deviceInfo}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                Trusted: {formatDate(device.trustedAt)} • Expires: {formatDate(device.expiresAt)}
                              </Typography>
                              {device.fingerprint === generateDeviceFingerprint() && (
                                <Chip label="Current" size="small" color="primary" sx={{ ml: 1 }} />
                              )}
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => {
                              if (window.confirm('Remove this trusted device?')) {
                                const username = getUsername();
                                if (username) removeTrustedDevice(username, device.fingerprint);
                              }
                            }}
                            disabled={device.fingerprint === generateDeviceFingerprint()}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  {trustedDevices.length === 0 && (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      No trusted devices.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </Box>

        {/* Action Buttons */}
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleOtpSubmit}
            disabled={otp.length !== 6 || isVerifying || isOtpExpired}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }
            }}
          >
            {isVerifying ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleResendOtp}
            disabled={
              otpLoading || isVerifying || (!isOtpExpired && timeLeft > 0) || resendAttempts <= 0
            }
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                borderWidth: '2px'
              }
            }}
          >
            {otpLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Sending...
              </>
            ) : (
              `Resend Code (${resendAttempts} left)`
            )}
          </Button>

          <Button
            variant="text"
            size="small"
            onClick={clearOtpInputs}
            disabled={isVerifying || otp.length === 0}
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Clear Code
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default OtpVerification;