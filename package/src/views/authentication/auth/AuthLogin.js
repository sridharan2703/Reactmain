/**
 * @fileoverview Task Inbox component for displaying and managing tasks
 * @module src/views/authentication/auth/AuthLogin
 * @author Rakshana
 * @date 22/07/2025
 * @since 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Shield, DevicesOther } from '@mui/icons-material';
import { authenticateUser } from 'src/components/Encryption/Encryption';
import Cookies from 'js-cookie';
import OtpVerification from './OTPVerification';
import { HostName } from "src/assets/host/Host";

const AuthLogin = ({ subtitle, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [mobileNo, setMobileNo] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [otpPhase, setOtpPhase] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [isTrustedDevice, setIsTrustedDevice] = useState(false);
  const [showTrustDialog, setShowTrustDialog] = useState(false);
  const [trustedDevices, setTrustedDevices] = useState([]);
  const TRUST_DURATION_DAYS = 30;
  const API_TOKEN = 'HRFGVJISOVp1fncC';

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

  const checkTrustedDevice = (username) => {
    const deviceFingerprint = generateDeviceFingerprint();
    const trustedDevicesData = localStorage.getItem(`trusted_devices_${username}`);

    if (trustedDevicesData) {
      const devices = JSON.parse(trustedDevicesData);
      const currentTime = new Date().getTime();
      const validDevices = devices.filter(device =>
        currentTime < device.expiresAt
      );
      localStorage.setItem(`trusted_devices_${username}`, JSON.stringify(validDevices));
      setTrustedDevices(validDevices);
      const trustedDevice = validDevices.find(device =>
        device.fingerprint === deviceFingerprint
      );

      return !!trustedDevice;
    }

    return false;
  };

  const addTrustedDevice = (username) => {
    const deviceFingerprint = generateDeviceFingerprint();
    const deviceInfo = getDeviceInfo();
    const currentTime = new Date().getTime();
    const expiresAt = currentTime + (TRUST_DURATION_DAYS * 24 * 60 * 60 * 1000);

    const existingDevices = JSON.parse(localStorage.getItem(`trusted_devices_${username}`) || '[]');
    const filteredDevices = existingDevices.filter(device =>
      device.fingerprint !== deviceFingerprint
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
  };

  const removeTrustedDevice = (username, fingerprint) => {
    const existingDevices = JSON.parse(localStorage.getItem(`trusted_devices_${username}`) || '[]');
    const updatedDevices = existingDevices.filter(device =>
      device.fingerprint !== fingerprint
    );
    localStorage.setItem(`trusted_devices_${username}`, JSON.stringify(updatedDevices));
    setTrustedDevices(updatedDevices);
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtpSms = async (otpCode, mobileNumber, sessionId) => {
    try {
      setOtpLoading(true);

      if (!mobileNumber || !/^\d{10,}$/.test(mobileNumber.replace(/\D/g, ''))) {
        throw new Error('Invalid or missing mobile number');
      }

      if (!sessionId) {
        throw new Error('Session ID not provided for OTP request. Please try logging in again.');
      }

      const message = encodeURIComponent(`The OTP to verify your mobile number on HMIS-Institute hospital is ${otpCode}-IITMWF`);
      const apiUrl = `https://enterprise.smsgupshup.com/GatewayAPI/rest?v=1.1&method=SendMessage&msg_type=TEXT&userid=2000230894&auth_scheme=plain&password=z6eucW@q%20&format=text&msg=${message}&send_to=${mobileNumber}`;

      try {
        await fetch(apiUrl, {
          method: 'GET',
          mode: 'no-cors'
        });
      } catch (corsError) {
      }

      const requestBody = {
        token: API_TOKEN,
        username: formData.username,
        mobileno: parseInt(mobileNumber.replace(/\D/g, '')),
        session_id: sessionId,
        otp: parseInt(otpCode),
        otpsendon: new Date().toISOString(),
        otpverifiedon: null,
        status: 0,
        updatedon: new Date().toISOString()
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('HRToken')}`,
      };

      const response = await fetch(`${HostName}/Loginotp`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const encryptedData = await response.json();
      if (!encryptedData.Data) {
        throw new Error('No encrypted data received from API');
      }

      const decryptedData = await decryptData(encryptedData.Data);
      const result = validateJsonData(decryptedData);

      if (result.message !== 'OTP record inserted successfully') {
        throw new Error('Failed to insert OTP record');
      }

      return true;
    } catch (error) {
      if (error.message.includes('CORS') || error.message.includes('NetworkError')) {
        return true; // Treat as success for no-cors SMS API
      }
      throw new Error(error.message || 'Failed to send OTP SMS or call Loginotp API');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authenticateUser(formData.username, formData.password);

      if (result.success) {
        if (!result.user.mobileNo) {
          setError('Mobile number not found for this user. Please contact support.');
          setLoading(false);
          return;
        }

        setMobileNo(result.user.mobileNo);
        setSessionId(result.sessionId || result.user.userId);
        const isDeviceTrusted = checkTrustedDevice(formData.username);
        setIsTrustedDevice(isDeviceTrusted);

        if (isDeviceTrusted) {
          setSuccess(true);
          setVerifiedUser(result.user);
          sessionStorage.setItem('userInfo', JSON.stringify(result.user));
          Cookies.set('username', result.user.username, { expires: 1 });
          Cookies.set('session_id', result.sessionId || result.user.userId, { expires: 1 });

          if (onLoginSuccess) onLoginSuccess(result.user);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          const otpCode = generateOtp();
          setGeneratedOtp(otpCode);

          if (!result.sessionId) {
            setError('Session ID not found in HRldap response. Using user ID as fallback.');
          }

          try {
            await sendOtpSms(otpCode, result.user.mobileNo, result.sessionId || result.user.userId);
            setOtpPhase(true);
            setVerifiedUser(result.user);
            sessionStorage.setItem('userInfo', JSON.stringify(result.user));
            Cookies.set('username', result.user.username, { expires: 1 });
            Cookies.set('session_id', result.sessionId || result.user.userId, { expires: 1 });
          } catch (smsError) {
            setError(smsError.message || 'Failed to send OTP. Please try again.');
            setOtpPhase(true);
            setVerifiedUser(result.user);
            sessionStorage.setItem('userInfo', JSON.stringify(result.user));
            Cookies.set('username', result.user.username, { expires: 1 });
            Cookies.set('session_id', result.sessionId || result.user.userId, { expires: 1 });
          }
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = (data) => {
    const { user, trustDevice } = data;

    if (trustDevice) {
      addTrustedDevice(formData.username);
    }

    setSuccess(true);
    if (onLoginSuccess) onLoginSuccess(user);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  const handleOtpResend = async () => {
    setError('');
    setSuccess(false);

    try {
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      await sendOtpSms(newOtp, mobileNo, sessionId);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (formData.username) {
      const devices = JSON.parse(localStorage.getItem(`trusted_devices_${formData.username}`) || '[]');
      setTrustedDevices(devices);
    }
  }, [formData.username]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!otpPhase && (
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {isTrustedDevice ? 'Welcome back! Trusted device verified.' : 'Login successful!'}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Username</Typography>
            <TextField
              fullWidth
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#9ca3af', fontSize: '1.25rem' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Password</Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#9ca3af', fontSize: '1.25rem' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end" disabled={loading}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>

          {formData.username && trustedDevices.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Shield sx={{ color: '#10b981', mr: 1, fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 500 }}>
                  Trusted Devices ({trustedDevices.length})
                </Typography>
                <Button
                  size="small"
                  onClick={() => setShowTrustDialog(true)}
                  sx={{ ml: 'auto', textTransform: 'none', fontSize: '0.75rem' }}
                >
                  Manage
                </Button>
              </Box>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Skip verification on trusted devices for {TRUST_DURATION_DAYS} days
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={loading || !formData.username || !formData.password}
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
            }}
          >
            {loading || otpLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                <span>{loading ? 'Signing In...' : 'Sending OTP...'}</span>
              </Box>
            ) : (
              <span style={{ color: 'white' }}>Sign In</span>
            )}
          </Button>

          {subtitle && <Box sx={{ mt: 3, textAlign: 'center' }}>{subtitle}</Box>}
        </Box>
      )}

      {otpPhase && (
        <OtpVerification
          verifiedUser={verifiedUser}
          onOtpSuccess={handleOtpSuccess}
          onResendOtp={handleOtpResend}
          phoneNumber={mobileNo}
          generatedOtp={generatedOtp}
          otpLoading={otpLoading}
          trustDurationDays={TRUST_DURATION_DAYS}
          sessionId={sessionId}
        />
      )}

      <Dialog
        open={showTrustDialog}
        onClose={() => setShowTrustDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DevicesOther sx={{ mr: 1 }} />
            Trusted Devices
          </Box>
        </DialogTitle>
        <DialogContent>
          {trustedDevices.length === 0 ? (
            <Typography color="textSecondary">
              No trusted devices found.
            </Typography>
          ) : (
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: '#6b7280' }}>
                These devices can skip OTP verification until they expire.
              </Typography>
              {trustedDevices.map((device, index) => (
                <Box
                  key={device.fingerprint}
                  sx={{
                    p: 2,
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    mb: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {device.deviceInfo}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                        Trusted on {formatDate(device.trustedAt)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                        Expires on {formatDate(device.expiresAt)}
                      </Typography>
                      {device.fingerprint === generateDeviceFingerprint() && (
                        <Chip
                          label="Current Device"
                          size="small"
                          color="primary"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeTrustedDevice(formData.username, device.fingerprint)}
                      sx={{ textTransform: 'none' }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTrustDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuthLogin;