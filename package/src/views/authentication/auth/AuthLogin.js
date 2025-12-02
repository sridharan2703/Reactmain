/**
 * @file AuthLogin.js
 * @description
 * Main page for displaying office order modules as cards with counts.
 * Updated: Fixed layout to handle dynamic table width and sidebar resizing.
 * @module src/views/authentication/auth/AuthLogin
 * @author Rakshana
 * @date 22/07/2025
 * @since 1.0.0
 * @modifiedby Rovita
 * @modifiedon 26-11-2025
 */
import React, { useState, useEffect, useRef } from "react";
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
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Shield,
  DevicesOther,
} from "@mui/icons-material";
import {
  authenticateUser,
  encryptECB,
} from "src/components/Encryption/Encryption";
import Cookies from "js-cookie";
import OtpVerification from "./OTPVerification";
import {
  decryptData,
  encryptPayloadForGo,
  clearKeyCache, // IMPORTANT: Ensure this is exported from EncryptionKey.js
} from "src/components/Encryption/EncryptionKey";

// Enhanced cleanup function
// This needs to be exported so it can be used by other components (like Profile)
export const cleanupSession = () => {
  // 1. Remove Cookies
  const cookiesToRemove = [
    "username",
    "session_id",
    "HRToken",
    "isAuthenticated",
    "selectedRole",
    "userRole",
    "userId",
    "EmpId",
    "userData"
  ];
  
  cookiesToRemove.forEach(cookie => Cookies.remove(cookie, { path: '/' }));

  // 2. Clear Session Storage
  sessionStorage.clear();

  // 3. Clear Local Storage (Selective)
  // We do NOT clear trusted_devices_xx here, but we MUST clear cached keys
  localStorage.removeItem("encryption_key");
  localStorage.removeItem("username");
  localStorage.removeItem("userRole");
  localStorage.removeItem("lastActivity");

  // 4. Clear In-Memory Encryption Keys
  // This is the specific fix for "Decryption Failed" on second login
  try {
    if (typeof clearKeyCache === 'function') {
      clearKeyCache();
    }
  } catch (e) {
  }
};

const AuthLogin = ({ subtitle, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [mobileNo, setMobileNo] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpPhase, setOtpPhase] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [isTrustedDevice, setIsTrustedDevice] = useState(false);
  const [showTrustDialog, setShowTrustDialog] = useState(false);
  const [trustedDevices, setTrustedDevices] = useState([]);
  
  const loginAttemptRef = useRef(0);
  const lastUsernameRef = useRef("");
  
  const TRUST_DURATION_DAYS = 30;
  const API_TOKEN = "HRFGVJISOVp1fncC";
  const ENCRYPTION_KEY = "7xPz!qL3vNc#eRb9Wm@f2Zh8Kd$gYp1B";

  // Run cleanup when the Login component mounts
  useEffect(() => {
    // Check if we are already logged in? 
    // Usually on the login page, we want a fresh state.
    // However, we shouldn't wipe the username field if the user typed it.
    cleanupSession();
    resetLoginState();
    
    return () => {
      loginAttemptRef.current = 0;
    };
  }, []);

  const resetLoginState = () => {
    setOtpPhase(false);
    setVerifiedUser(null);
    setGeneratedOtp("");
    setMobileNo("");
    setSessionId("");
    setError("");
    setSuccess(false);
    setLoading(false);
    setOtpLoading(false);
    setIsTrustedDevice(false);
    loginAttemptRef.current = 0;
  };

  const generateDeviceFingerprint = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("Device fingerprint", 2, 2);

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.hardwareConcurrency || "unknown",
      navigator.deviceMemory || "unknown",
      // Removed timestamp here for consistency in trust check, 
      // or ensure timestamp is handled separately for trusted devices logic
    ].join("|");
    
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let deviceType = "Unknown Device";
    let browser = "Unknown Browser";

    if (/Mobile|Android|iPhone|iPad/.test(ua)) {
      if (/iPhone/.test(ua)) deviceType = "iPhone";
      else if (/iPad/.test(ua)) deviceType = "iPad";
      else if (/Android/.test(ua)) deviceType = "Android Device";
      else deviceType = "Mobile Device";
    } else {
      deviceType = "Desktop";
    }

    if (/Chrome/.test(ua)) browser = "Chrome";
    else if (/Firefox/.test(ua)) browser = "Firefox";
    else if (/Safari/.test(ua)) browser = "Safari";
    else if (/Edge/.test(ua)) browser = "Edge";

    return `${deviceType} - ${browser}`;
  };

  const getDeviceInfoString = (deviceInfo) => {
    if (typeof deviceInfo === "string") {
      return deviceInfo;
    } else if (typeof deviceInfo === "object" && deviceInfo !== null) {
      const {
        browser = "Unknown Browser",
        os = "Unknown OS",
      } = deviceInfo;
      return `${os} - ${browser}`;
    } else {
      return "Unknown Device";
    }
  };

  const checkTrustedDevice = (username) => {
    if (lastUsernameRef.current !== username) {
      setIsTrustedDevice(false);
      lastUsernameRef.current = username;
    }

    const deviceFingerprint = generateDeviceFingerprint();
    const trustedDevicesData = localStorage.getItem(
      `trusted_devices_${username}`
    );

    if (trustedDevicesData) {
      try {
        const devices = JSON.parse(trustedDevicesData);
        const currentTime = new Date().getTime();
        const validDevices = devices.filter(
          (device) => currentTime < device.expiresAt
        );
        localStorage.setItem(
          `trusted_devices_${username}`,
          JSON.stringify(validDevices)
        );
        setTrustedDevices(validDevices);
        const trustedDevice = validDevices.find(
          (device) => device.fingerprint === deviceFingerprint
        );

        return !!trustedDevice;
      } catch (error) {
        localStorage.removeItem(`trusted_devices_${username}`);
        return false;
      }
    }
    return false;
  };

  const addTrustedDevice = (username) => {
    const deviceFingerprint = generateDeviceFingerprint();
    const deviceInfo = getDeviceInfo();
    const currentTime = new Date().getTime();
    const expiresAt = currentTime + TRUST_DURATION_DAYS * 24 * 60 * 60 * 1000;

    try {
      const existingDevices = JSON.parse(
        localStorage.getItem(`trusted_devices_${username}`) || "[]"
      );
      const filteredDevices = existingDevices.filter(
        (device) => device.fingerprint !== deviceFingerprint
      );

      const newDevice = {
        fingerprint: deviceFingerprint,
        deviceInfo,
        trustedAt: currentTime,
        expiresAt,
        location: "Current Location",
      };

      const updatedDevices = [...filteredDevices, newDevice];
      localStorage.setItem(
        `trusted_devices_${username}`,
        JSON.stringify(updatedDevices)
      );
      setTrustedDevices(updatedDevices);
      setIsTrustedDevice(true);
    } catch (error) {
    }
  };

  const removeTrustedDevice = (username, fingerprint) => {
    try {
      const existingDevices = JSON.parse(
        localStorage.getItem(`trusted_devices_${username}`) || "[]"
      );
      const updatedDevices = existingDevices.filter(
        (device) => device.fingerprint !== fingerprint
      );
      localStorage.setItem(
        `trusted_devices_${username}`,
        JSON.stringify(updatedDevices)
      );
      setTrustedDevices(updatedDevices);
      
      if (fingerprint === generateDeviceFingerprint()) {
        setIsTrustedDevice(false);
      }
    } catch (error) {
    }
  };

  const sendOtpSms = async (mobileNumber, sessionId, retryCount = 0) => {
    try {
      setOtpLoading(true);
      setError("");

      if (loginAttemptRef.current > 0 && retryCount === 0) {
        return false;
      }

      loginAttemptRef.current++;

      if (!mobileNumber || !/^\d{10,}$/.test(mobileNumber.replace(/\D/g, ""))) {
        throw new Error("Invalid or missing mobile number");
      }

      let actualOtpSentToMobile = "";
      const encryptedMobileNo = encryptECB(
        mobileNumber.replace(/\D/g, ""),
        ENCRYPTION_KEY
      );

      const otpSendRequestBody = {
        token: API_TOKEN,
        send_to: encryptedMobileNo,
        P_id: sessionId,
      };

      try {
        const encryptedSendOtpPayload = await encryptPayloadForGo(
          otpSendRequestBody
        );

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("HRToken")}`,
        };

        const otpSendResponse = await fetch(
          "https://wftest1.iitm.ac.in:7007/SendOTP",
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ Data: encryptedSendOtpPayload }),
          }
        );

        if (!otpSendResponse.ok) {
          if (retryCount < 1) {
            return await sendOtpSms(mobileNumber, sessionId, retryCount + 1);
          }
          throw new Error(
            `Failed to send OTP: HTTP error! status: ${otpSendResponse.status}`
          );
        }

        const otpSendEncryptedData = await otpSendResponse.json();

        if (!otpSendEncryptedData.Data) {
          throw new Error("No encrypted data received from SendOTP API");
        }

        const decryptedSendOtpResponse = await decryptData(
          otpSendEncryptedData.Data
        );

        let parsedSendOtpResponse;
        if (typeof decryptedSendOtpResponse === "object") {
          parsedSendOtpResponse = decryptedSendOtpResponse;
        } else {
          parsedSendOtpResponse = JSON.parse(decryptedSendOtpResponse);
        }

        if (parsedSendOtpResponse.otp_sent) {
          actualOtpSentToMobile = parsedSendOtpResponse.otp_sent.toString();
        } else {
          throw new Error("OTP not found in response");
        }
      } catch (otpSendError) {
   
        if (retryCount < 1) {
          return await sendOtpSms(mobileNumber, sessionId, retryCount + 1);
        }
        throw new Error(otpSendError.message || "Failed to send OTP.");
      }

      setGeneratedOtp(actualOtpSentToMobile);

      const loginOtpRequestBody = {
        token: API_TOKEN,
        username: formData.username,
        mobileno: parseInt(mobileNumber.replace(/\D/g, "")),
        otp: parseInt(actualOtpSentToMobile),
        P_id: sessionId,
      };

      const encryptedLoginOtpPayload = await encryptPayloadForGo(
        loginOtpRequestBody
      );

      const loginOtpHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("HRToken")}`,
      };

      const response = await fetch(`https://wftest1.iitm.ac.in:7007/Loginotp`, {
        method: "POST",
        headers: loginOtpHeaders,
        body: JSON.stringify({ Data: encryptedLoginOtpPayload }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error from Loginotp API: ${response.status}`);
      }

      const encryptedLoginotpData = await response.json();

      if (!encryptedLoginotpData.Data) {
        throw new Error("No encrypted data received from Loginotp API");
      }

      const decryptedLoginotpData = await decryptData(
        encryptedLoginotpData.Data
      );

      let result;
      if (typeof decryptedLoginotpData === "object") {
        result = decryptedLoginotpData;
      } else {
        result = JSON.parse(decryptedLoginotpData);
      }

      if (result.message !== "OTP record inserted successfully") {
        throw new Error(
          "Failed to insert OTP record: " + (result.message || "Unknown error")
        );
      }

      loginAttemptRef.current = 0;
      return true;
    } catch (error) {
      loginAttemptRef.current = 0;
      if (
        error.message.includes("Decrypted response is not valid JSON structure")
      ) {
        throw new Error("Server response format issue.");
      }
      throw new Error(error.message || "Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    
    // If username changes, we should ensure state is reset
    if (name === "username" && otpPhase) {
      resetLoginState();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Please enter both username and password");
      return;
    }

    if (loading || otpLoading) {
      return;
    }
    // This ensures no old encryption keys or session IDs interfere with the new login
    try {
      cleanupSession(); 
    } catch (e) {
    }

    setLoading(true);
    setError("");

    try {
      // AuthenticateUser should generate NEW keys internally
      const result = await authenticateUser(
        formData.username,
        formData.password
      );

      if (result.success) {
        if (!result.user.mobileNo) {
          setError("Mobile number not found for this user.");
          setLoading(false);
          return;
        }

        setMobileNo(result.user.mobileNo);
        setSessionId(result.sessionId || result.user.userId);
        
        // Trusted device logic
        const isDeviceTrusted = checkTrustedDevice(formData.username);
        setIsTrustedDevice(isDeviceTrusted);

        if (isDeviceTrusted) {
          setSuccess(true);
          setVerifiedUser(result.user);
          sessionStorage.setItem("userInfo", JSON.stringify(result.user));
          Cookies.set("username", result.user.username, { expires: 1 });
          Cookies.set("session_id", result.sessionId || result.user.userId, {
            expires: 1,
          });

          if (onLoginSuccess) onLoginSuccess(result.user);
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        } else {
          try {
            await sendOtpSms(
              result.user.mobileNo,
              result.sessionId || result.user.userId
            );
            setOtpPhase(true);
            setVerifiedUser(result.user);
            sessionStorage.setItem("userInfo", JSON.stringify(result.user));
            Cookies.set("username", result.user.username, { expires: 1 });
            Cookies.set("session_id", result.sessionId || result.user.userId, {
              expires: 1,
            });
          } catch (smsError) {
            setError(smsError.message || "Failed to send OTP.");
            // Proceed with fallback for testing/demo if needed
            setOtpPhase(true);
            setVerifiedUser(result.user);
            setGeneratedOtp(
              Math.floor(100000 + Math.random() * 900000).toString()
            );
          }
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
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
      window.location.href = "/dashboard";
    }, 2000);
  };

  const handleOtpResend = async () => {
    setError("");
    setSuccess(false);

    try {
      await sendOtpSms(mobileNo, sessionId);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message || "Failed to resend OTP.");
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {!otpPhase && (
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {isTrustedDevice
                ? "Welcome back! Trusted device verified."
                : "Login successful!"}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Username
            </Typography>
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
                    <Person sx={{ color: "#9ca3af", fontSize: "1.25rem" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#9ca3af", fontSize: "1.25rem" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {formData.username && trustedDevices.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Shield sx={{ color: "#10b981", mr: 1, fontSize: "1rem" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#10b981", fontWeight: 500 }}
                >
                  Trusted Devices ({trustedDevices.length})
                </Typography>
                <Button
                  size="small"
                  onClick={() => setShowTrustDialog(true)}
                  sx={{
                    ml: "auto",
                    textTransform: "none",
                    fontSize: "0.75rem",
                  }}
                >
                  Manage
                </Button>
              </Box>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Skip verification on trusted devices for {TRUST_DURATION_DAYS}{" "}
                days
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
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
            }}
          >
            {loading || otpLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} sx={{ color: "white" }} />
                <span>{loading ? "Signing In..." : "Sending OTP..."}</span>
              </Box>
            ) : (
              <span style={{ color: "white" }}>Sign In</span>
            )}
          </Button>

          {subtitle && (
            <Box sx={{ mt: 3, textAlign: "center" }}>{subtitle}</Box>
          )}
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

      {/* Trust Device Dialog code remains same */}
      <Dialog
        open={showTrustDialog}
        onClose={() => setShowTrustDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
              <Typography variant="body2" sx={{ mb: 2, color: "#6b7280" }}>
                These devices can skip OTP verification until they expire.
              </Typography>
              {trustedDevices.map((device, index) => (
                <Box
                  key={device.fingerprint}
                  sx={{
                    p: 2,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {getDeviceInfoString(device.deviceInfo)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6b7280", display: "block" }}
                      >
                        Trusted on {formatDate(device.trustedAt)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6b7280", display: "block" }}
                      >
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
                      onClick={() =>
                        removeTrustedDevice(
                          formData.username,
                          device.fingerprint
                        )
                      }
                      sx={{ textTransform: "none" }}
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
          <Button onClick={() => setShowTrustDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuthLogin;














