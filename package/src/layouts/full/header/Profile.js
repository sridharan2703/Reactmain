/**
 * @fileoverview Profile Component (User Profile and Role Switch Dropdown).
 * @module Profile
 * @description Manages user authentication state, role selection, session monitoring (inactivity/expiry check)
 * with encryption/decryption, and the logout process. Renders a dropdown accessible via the user avatar.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - React hooks: useState, useEffect, useCallback, useNavigate.
 * - Material-UI components: For UI structure and styling.
 * - Encryption/Decryption utilities: For secure API communication.
 * - Cookies: For managing session and role data.
 * - HostName: API host configuration.
 */
// import React, { useState, useEffect, useCallback } from "react";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

import ProfileImg from "src/assets/images/profile/user-1.jpg";

import {
  encryptPayloadForGo,
  decryptData,
  isWebCryptoSupported,
  isSessionRelatedError,
  clearKeyCache,
} from "src/components/Encryption/EncryptionKey";

import Cookies from "js-cookie";
import { HostName } from "src/assets/host/Host";

const getAuthHeaders = async () => {
  const encryptedToken = Cookies.get("HRToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${encryptedToken}`,
  };
};

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configuration
  const IMMEDIATE_LOGOUT_MODE = true;
  const INACTIVITY_CHECK_INTERVAL = 10 * 1000;
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 10 minutes
  const RETRY_ATTEMPTS = 2;
  const RETRY_DELAY = 2000;
  const MIN_CHECK_INTERVAL = 30 * 1000;

  const timeoutRef = React.useRef(null);
  const inactivityCheckRef = React.useRef(null);
  const retryCountRef = React.useRef(0);
  const isCheckingSessionRef = React.useRef(false);
  const isComponentMountedRef = React.useRef(true);
  const lastSuccessfulCheckRef = React.useRef(null);

  const API_TOKEN = "HRFGVJISOVp1fncC";

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const setCookie = (name, value, days = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const getLoginName = () => {
    const loginName =
      sessionStorage.getItem("username") ||
      localStorage.getItem("username") ||
      getCookie("username");
    return loginName;
  };

  const handleLogout = useCallback(
    async (isAutoLogout = false, reason = "") => {
      try {
        console.log(
          `Logout initiated - Auto: ${isAutoLogout}, Reason: ${
            reason || "Manual logout"
          }`
        );

        stopSessionMonitoring();

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Clear decryption key cache
        clearKeyCache();

        const sessionId = getCookie("session_id");

        const clearAllStorage = () => {
          deleteCookie("session_id");
          deleteCookie("selectedRole");
          deleteCookie("userRole");
          deleteCookie("userId");
          deleteCookie("EmpId");
          deleteCookie("username");
          deleteCookie("userData");
          deleteCookie("HRToken");
          deleteCookie("isAuthenticated");
          sessionStorage.clear();
          localStorage.removeItem("username");
          localStorage.removeItem("userRole");
        };

        if (!sessionId) {
          clearAllStorage();
          navigate("/auth/login", { replace: true });
          return;
        }

        // ENHANCED: Report logout to backend with proper encryption/decryption
        try {
          const headers = await getAuthHeaders();

          // ENCRYPTION: Create and encrypt logout payload
          const requestBodyPayload = {
            token: "HRFGVJISOVp1fncC",
            Session_id: sessionId, // Added Session_id as required by backend
            P_id: sessionId,
            idletimeout: isAutoLogout ? 1 : 0,
          };

          console.log("🔐 Logout - Original payload:", requestBodyPayload);
          const encryptedRequestData = await encryptPayloadForGo(
            requestBodyPayload
          );
          console.log("🔐 Logout - Payload encrypted successfully");

          const response = await fetch(
            `https://wftest1.iitm.ac.in:7007/SessionTimeout`,
            {
              method: "POST",
              headers: headers,
              body: JSON.stringify({ Data: encryptedRequestData }),
              signal: AbortSignal.timeout(5000),
            }
          );

          console.log("🔐 Logout - Response status:", response.status);

          if (response.ok) {
            // DECRYPTION: Handle encrypted response from server
            try {
              const encryptedResponse = await response.json();
              console.log(
                "🔐 Logout - Encrypted response received:",
                encryptedResponse
              );

              if (encryptedResponse.Data) {
                const decryptedResponse = await decryptData(
                  encryptedResponse.Data
                );
                console.log(
                  "🔓 Logout - Decrypted response:",
                  decryptedResponse
                );

                // Handle decrypted response (could be string or object)
                let parsedResponse;
                if (typeof decryptedResponse === "string") {
                  try {
                    parsedResponse = JSON.parse(decryptedResponse);
                  } catch (e) {
                    parsedResponse = { message: decryptedResponse };
                  }
                } else {
                  parsedResponse = decryptedResponse;
                }

                console.log("✅ Logout - Server response:", parsedResponse);

                // Check if logout was successful on server side
                if (
                  parsedResponse.Status === 200 ||
                  parsedResponse.status === 200
                ) {
                  console.log("✅ Logout confirmed by server");
                }
              }
            } catch (decryptError) {
              console.warn(
                "⚠️ Logout - Could not decrypt server response, but continuing logout:",
                decryptError
              );
              // Continue with logout even if decryption fails
            }
          } else {
            console.warn(
              "⚠️ Logout - Server returned error status:",
              response.status
            );
            // Continue with logout even if server call fails
          }
        } catch (apiError) {
          console.error(
            "❌ Logout - Failed to report logout to server, but continuing:",
            apiError
          );
          // Continue with client-side logout even if server call fails
        }

        // Always clear client storage regardless of server response
        clearAllStorage();

        // Redirect to login page
        if (isComponentMountedRef.current) {
          navigate("/auth/login", {
            replace: true,
            state: {
              message:
                reason ||
                (isAutoLogout
                  ? "Session expired due to inactivity"
                  : "You have been logged out successfully"),
            },
          });
        } else {
          window.location.href = "/auth/login";
        }
      } catch (error) {
        console.error("❌ Logout error:", error);

        // Ensure cleanup happens even on error
        const emergencyCleanup = () => {
          deleteCookie("session_id");
          deleteCookie("selectedRole");
          deleteCookie("userRole");
          deleteCookie("userId");
          deleteCookie("EmpId");
          deleteCookie("username");
          deleteCookie("userData");
          deleteCookie("HRToken");
          deleteCookie("isAuthenticated");
          sessionStorage.clear();
          localStorage.removeItem("username");
          localStorage.removeItem("userRole");
          clearKeyCache();
        };

        emergencyCleanup();

        if (isComponentMountedRef.current) {
          navigate("/auth/login", {
            replace: true,
            state: {
              message: "Logout completed with warnings. Please login again.",
            },
          });
        } else {
          window.location.href = "/auth/login";
        }
      }

      handleClose2();
    },
    [navigate]
  );

  const checkSessionStatus = useCallback(
    async (isRetry = false, isUserInteraction = false) => {
      if (isCheckingSessionRef.current) {
        return true;
      }

      if (
        !isUserInteraction &&
        lastSuccessfulCheckRef.current &&
        Date.now() - lastSuccessfulCheckRef.current < MIN_CHECK_INTERVAL
      ) {
        return true;
      }

      if (!isWebCryptoSupported()) {
        console.error("Web Crypto API not supported");
        isCheckingSessionRef.current = false;
        return false;
      }

      if (!isComponentMountedRef.current) {
        return false;
      }

      isCheckingSessionRef.current = true;

      try {
        const sessionId = getCookie("session_id");

        if (!sessionId) {
          console.warn("No session ID found");
          isCheckingSessionRef.current = false;
          await handleLogout(true, "Session ID not found");
          return false;
        }

        const headers = await getAuthHeaders();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // ENCRYPTION: Create and encrypt payload
        const requestPayloadBody = {
          token: "HRFGVJISOVp1fncC",
          Session_id: sessionId,
          P_id: sessionId,
        };

        console.log("🔐 Session check - Original payload:", requestPayloadBody);
        const encryptedPayloadData = await encryptPayloadForGo(
          requestPayloadBody
        );
        console.log("🔐 Session check - Encrypted payload ready");

        const response = await fetch(
          `https://wftest1.iitm.ac.in:7007/Sessiondata`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ Data: encryptedPayloadData }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const status = response.status;
          const error = new Error(
            `Session check failed with status: ${status}`
          );
          error.isSessionRelated =
            status === 401 || status === 403 || (status >= 500 && status < 600);
          error.userMessage = error.isSessionRelated
            ? status >= 500
              ? "Server error occurred. Please log in again."
              : "Your session has expired. Please log in again."
            : "Unable to connect to server. Please try again.";
          throw error;
        }

        const encryptedResponse = await response.json();
        console.log("🔐 Session check - Encrypted response received");

        if (!encryptedResponse.Data) {
          throw new Error("No encrypted data received from server");
        }

        // DECRYPTION: Decrypt the response
        let decryptedData;
        let parsedData;

        try {
          console.log("🔓 Session check - Decrypting response...");
          decryptedData = await decryptData(encryptedResponse.Data);
          console.log("🔓 Session check - Decrypted data:", decryptedData);

          // ENHANCED: Better response parsing
          if (typeof decryptedData === "string") {
            try {
              // Try to parse as JSON first
              parsedData = JSON.parse(decryptedData);
            } catch (parseError) {
              console.warn(
                "Failed to parse decrypted string as JSON, treating as raw message"
              );
              // If it's not JSON, check if it contains session status directly
              if (
                decryptedData.includes("active") ||
                decryptedData.includes("inactive")
              ) {
                parsedData = { message: decryptedData };
              } else {
                // Try to extract status from string
                const statusMatch = decryptedData.match(/"Status":(\d+)/);
                const status = statusMatch ? parseInt(statusMatch[1]) : null;
                parsedData = {
                  Status: status,
                  message: decryptedData,
                };
              }
            }
          } else {
            // Already an object
            parsedData = decryptedData;
          }

          console.log("✅ Session check - Parsed data:", parsedData);
        } catch (decryptError) {
          console.error("❌ Session check - Decryption error:", decryptError);

          // Enhanced error classification
          if (
            decryptError.message.includes("session") ||
            decryptError.message.includes("expired") ||
            decryptError.message.includes("invalid") ||
            decryptError.message.includes("key") ||
            decryptError.message.includes("decryption failed")
          ) {
            const sessionError = new Error(
              "Session decryption failed - possible session expiry"
            );
            sessionError.isSessionRelated = true;
            sessionError.userMessage =
              "Your session has expired. Please log in again.";
            throw sessionError;
          }

          // For generic decryption errors, retry instead of logout
          throw new Error(
            "Temporary decryption issue: " + decryptError.message
          );
        }

        // ENHANCED: Response validation with better debugging
        const status =
          parsedData.Status || parsedData.status || parsedData.code;
        const data =
          parsedData.Data ||
          parsedData.data ||
          parsedData.records ||
          parsedData;

        console.log("📊 Session check - Response analysis:", {
          status: status,
          hasData: !!data,
          message: parsedData.message,
          fullStructure: Object.keys(parsedData),
        });

        // Check for explicit failure in message
        if (
          parsedData.message &&
          (parsedData.message.toLowerCase().includes("invalid") ||
            parsedData.message.toLowerCase().includes("expired") ||
            parsedData.message.toLowerCase().includes("not found") ||
            parsedData.message.toLowerCase().includes("failed"))
        ) {
          console.warn(
            "Session explicitly failed via message:",
            parsedData.message
          );
          return false;
        }

        // Only require 200 status for clear success
        if (status && status !== 200) {
          console.warn(`Session check returned status: ${status}`);
          return false;
        }

        // FLEXIBLE: Session data extraction
        const sessionData = data;
        let sessionRecord;

        if (
          sessionData.Records &&
          Array.isArray(sessionData.Records) &&
          sessionData.Records.length > 0
        ) {
          sessionRecord = sessionData.Records[0];
          console.log("📋 Using Records[0] structure");
        } else if (Array.isArray(sessionData) && sessionData.length > 0) {
          sessionRecord = sessionData[0];
          console.log("📋 Using array[0] structure");
        } else if (typeof sessionData === "object" && sessionData !== null) {
          sessionRecord = sessionData;
          console.log("📋 Using direct object structure");
        } else {
          console.warn("Unexpected session data format:", sessionData);
          return false;
        }

        // FLEXIBLE: Active status checking
        const isActive =
          sessionRecord.is_active ??
          sessionRecord.active ??
          sessionRecord.status ??
          sessionRecord.isActive;

        console.log("🔍 Session active status check:", {
          rawValue: isActive,
          type: typeof isActive,
          availableFields: Object.keys(sessionRecord),
        });

        // Check if session is explicitly inactive
        if (
          isActive === 0 ||
          isActive === "0" ||
          isActive === false ||
          isActive === "false" ||
          isActive === "inactive"
        ) {
          console.warn("Session is marked as inactive by server");
          throw new Error("Session deactivated");
        }

        // Check if session is explicitly active
        if (
          isActive === 1 ||
          isActive === "1" ||
          isActive === true ||
          isActive === "true" ||
          isActive === "active"
        ) {
          lastSuccessfulCheckRef.current = Date.now();
          retryCountRef.current = 0;
          isCheckingSessionRef.current = false;
          console.log("✅ Session check passed");
          return true;
        }

        // If status is undefined or null, be conservative
        if (isActive === undefined || isActive === null) {
          console.warn(
            "Session status is undefined/null, defaulting to inactive"
          );
          return false;
        }

        // Unknown status value
        console.warn(
          `Unknown session status value: ${isActive} (type: ${typeof isActive})`
        );
        return false;
      } catch (err) {
        console.error("❌ Session check error:", err.message);
        isCheckingSessionRef.current = false;

        // ENHANCED: Error classification
        const isClearSessionError =
          err.isSessionRelated ||
          err.message.includes("Session expired") ||
          err.message.includes("Session deactivated") ||
          err.message.includes("Session decryption failed") ||
          err.message.includes("session expiry");

        if (isClearSessionError) {
          console.warn(
            "Clear session error detected, logging out:",
            err.message
          );
          await handleLogout(
            true,
            err.userMessage || "Your session has expired"
          );
          return false;
        }

        // For temporary errors, use retry logic
        if (!isRetry && retryCountRef.current < RETRY_ATTEMPTS) {
          retryCountRef.current++;
          console.log(
            `Retrying session check (attempt ${retryCountRef.current}/${RETRY_ATTEMPTS})`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * retryCountRef.current)
          );
          return await checkSessionStatus(true, isUserInteraction);
        }

        console.warn("Session check failed after retries, but not logging out");
        return false;
      }
    },
    [handleLogout]
  );

  const fetchRoleData = useCallback(async () => {
    if (!isWebCryptoSupported()) {
      setError("Web Crypto API not supported in this browser");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loginName = getLoginName();

      const headers = await getAuthHeaders();
      const sessionId = Cookies.get("session_id");

      const requestBody = {
        token: "HRFGVJISOVp1fncC",
        UserName: loginName,
        P_id: sessionId,
      };

      const encryptedPayload = await encryptPayloadForGo(requestBody);
      console.log("✅ Payload encrypted successfully");

      const response = await fetch(`${HostName}/Defaultrole`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok) {
        const status = response.status;
        const error = new Error(`Role fetch failed with status: ${status}`);
        error.isSessionRelated =
          status === 401 || status === 403 || (status >= 500 && status < 600);
        error.userMessage = error.isSessionRelated
          ? status >= 500
            ? "Server error occurred. Please log in again."
            : "Your session has expired. Please log in again."
          : "Unable to connect to server. Please try again.";
        throw error;
      }

      const encryptedResponse = await response.json();
      console.log("🔐 Encrypted response received:", encryptedResponse);

      if (!encryptedResponse.Data) {
        throw new Error("No encrypted data received from API");
      }

      let decryptedData;
      let parsedData;

      try {
        decryptedData = await decryptData(encryptedResponse.Data);
        console.log("✅ Data decrypted successfully:", decryptedData);

        // FIX: Check if decryptedData is already an object or needs parsing
        if (typeof decryptedData === "string") {
          try {
            parsedData = JSON.parse(decryptedData);
          } catch (parseError) {
            console.error("Failed to parse decrypted string:", parseError);
            throw new Error("Invalid JSON format in decrypted data");
          }
        } else {
          parsedData = decryptedData;
        }

        console.log("✅ Data parsed successfully:", parsedData);
      } catch (decryptError) {
        console.error("Decryption error while fetching roles:", decryptError);
        if (isSessionRelatedError(decryptError)) {
          const userMessage =
            decryptError.userMessage ||
            "Your session has expired. Please log in again.";
          console.warn("Session-related decryption failure:", userMessage);
          await handleLogout(true, userMessage);
          return;
        }
        throw decryptError;
      }

      // FIXED: Better status checking with more flexibility
      const status = parsedData.Status || parsedData.status || parsedData.code;
      const data = parsedData.Data || parsedData.data || parsedData.records;

      console.log("📊 Response analysis:", {
        status: status,
        hasData: !!data,
        message: parsedData.message,
        fullResponse: parsedData,
      });

      if (status !== 200 || !data) {
        const error = new Error(
          parsedData.message ||
            `Invalid role response - Status: ${status || "No status"}`
        );
        error.isSessionRelated = true;
        error.userMessage =
          "Unable to load roles. Your session may have expired.";
        throw error;
      }

      setRoleData(data);
      const savedRole = getCookie("selectedRole");

      const allAvailableRoles = data.Records || data.records || [];

      console.log("🎯 Available roles:", allAvailableRoles);

      if (
        savedRole &&
        allAvailableRoles.some((role) => role.RoleName === savedRole)
      ) {
        setSelectedRole(savedRole);
      } else if (allAvailableRoles.length > 0) {
        const defaultRole = allAvailableRoles[0].RoleName;
        setSelectedRole(defaultRole);
        setCookie("selectedRole", defaultRole);
      }

      console.log("✅ Role data fetched and processed successfully");
    } catch (err) {
      console.error("Error fetching role data:", err);

      // TEMPORARY: Don't logout for role fetch errors, just show error
      // This prevents automatic logout when roles can't be loaded
      if (isSessionRelatedError(err)) {
        console.warn(
          "Session-related error in role fetch, but not logging out:",
          err.message
        );
        setError(
          err.userMessage ||
            "Unable to load user roles. Please refresh the page."
        );
   
      } else {
        setError(
          err.userMessage ||
            err.message ||
            "Unable to load data. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);


  const startSessionMonitoring = useCallback(() => {
    let initialCheckDone = false;

    const immediateCheck = async () => {
      if (!isComponentMountedRef.current) {
        return;
      }

      try {
        // For initial check, be very lenient
        const success = await checkSessionStatus(false, false);

        if (!success && !initialCheckDone) {
          console.warn("Initial session check failed, but continuing...");
          // Don't take any action - this might be a temporary issue
        }

        initialCheckDone = true;
      } catch (error) {
        console.warn("Initial session check error, but continuing:", error);
        initialCheckDone = true;
      }
    };

    // Wait a bit before first check to let other operations complete
    setTimeout(immediateCheck, 3000);
  }, [checkSessionStatus]);

  const startInactivityMonitoring = useCallback(() => {
    if (inactivityCheckRef.current) {
      clearInterval(inactivityCheckRef.current);
    }

    const checkInactivity = async () => {
      if (!isComponentMountedRef.current) {
        return;
      }

      const lastActivity = parseInt(
        sessionStorage.getItem("lastActivity") || "0",
        10
      );
      const timeSinceLastActivity = Date.now() - lastActivity;

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        console.warn(
          `User inactive for ${timeSinceLastActivity}ms, logging out`
        );
        await handleLogout(true, "Session expired due to inactivity");
      }
    };

    inactivityCheckRef.current = setInterval(
      checkInactivity,
      INACTIVITY_CHECK_INTERVAL
    );
  }, [handleLogout]);

  const stopSessionMonitoring = useCallback(() => {
    if (inactivityCheckRef.current) {
      clearInterval(inactivityCheckRef.current);
      inactivityCheckRef.current = null;
    }
    isCheckingSessionRef.current = false;
    retryCountRef.current = 0;
  }, []);

  useEffect(() => {
    isComponentMountedRef.current = true;

    sessionStorage.setItem("lastActivity", Date.now().toString());

    fetchRoleData();
    startSessionMonitoring();
    startInactivityMonitoring();

    return () => {
      isComponentMountedRef.current = false;
      stopSessionMonitoring();
    };
  }, [
    fetchRoleData,
    startSessionMonitoring,
    startInactivityMonitoring,
    stopSessionMonitoring,
  ]);

  const handleRoleSelect = async (roleName) => {
    const isSessionValid = await checkSessionStatus(false, true);

    if (!isSessionValid) {
      return;
    }

    const previousRole = selectedRole;

    setSelectedRole(roleName);
    setCookie("selectedRole", roleName);
    setCookie("userRole", roleName, 7);

    const userDataCookie = getCookie("userData");
    if (userDataCookie) {
      try {
        const userData = JSON.parse(userDataCookie);
        userData.role = roleName;
        setCookie("userData", JSON.stringify(userData), 7);
      } catch (e) {
        console.error("Error updating userData cookie:", e);
      }
    }

    if (sessionStorage.getItem("userRole")) {
      sessionStorage.setItem("userRole", roleName);
    }
    if (localStorage.getItem("userRole")) {
      localStorage.setItem("userRole", roleName);
    }

    handleClose2();
    window.dispatchEvent(
      new CustomEvent("roleChanged", {
        detail: { newRole: roleName },
      })
    );

    if (previousRole && previousRole !== roleName) {
      window.location.href = "/dashboard";
    } else if (!previousRole) {
      navigate("/dashboard");
    }
  };

  const handleUserActivity = useCallback(
    async (event) => {
      // Only update activity on mouse click events
      if (event.type !== "click") {
        return;
      }

      sessionStorage.setItem("lastActivity", Date.now().toString());

      if (IMMEDIATE_LOGOUT_MODE) {
        const lastCheck = lastSuccessfulCheckRef.current || 0;
        const timeSinceLastCheck = Date.now() - lastCheck;

        if (timeSinceLastCheck > 10000) {
          await checkSessionStatus(false, true);
        }
      }
    },
    [checkSessionStatus]
  );

  useEffect(() => {
    const events = ["click"];

    const addEventListeners = () => {
      events.forEach((event) => {
        document.addEventListener(event, handleUserActivity, {
          passive: true,
          capture: true,
        });
      });
    };

    const removeEventListeners = () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, {
          capture: true,
        });
      });
    };

    addEventListeners();

    return () => {
      removeEventListeners();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleUserActivity]);

  const handleManualLogout = () => {
    handleLogout(false);
  };

  const handleRefreshRoles = () => {
    fetchRoleData();
  };

  const availableRoles = roleData?.Records || [];

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="profile menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "#ed553b",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 45,
            height: 45,
          }}
        />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
          },
        }}
      >
        {selectedRole && (
          <Box px={2} py={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Current Role:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {selectedRole}
            </Typography>
          </Box>
        )}

        <Divider />

        <Box px={2} py={1}>
          {error && (
            <Alert severity="error" sx={{ mb: 1, fontSize: "0.75rem" }}>
              {error}
            </Alert>
          )}

          {loading && !roleData && (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={20} />
            </Box>
          )}

          {availableRoles.length > 0 && (
            <Box>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mb: 1, display: "block" }}
              >
                {availableRoles.length} role
                {availableRoles.length !== 1 ? "s" : ""} available
              </Typography>
              {availableRoles.map((role, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleRoleSelect(role.RoleName)}
                  selected={role.RoleName === selectedRole}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    bgcolor:
                      role.RoleName === selectedRole
                        ? "#ed553b"
                        : "background.paper",
                    "&:hover": {
                      bgcolor:
                        role.RoleName === selectedRole
                          ? "#f8c6b0"
                          : "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={role.RoleName}
                    primaryTypographyProps={{
                      fontWeight:
                        role.RoleName === selectedRole ? "bold" : "normal",
                      color:
                        role.RoleName === selectedRole
                          ? "#ed553b"
                          : "text.primary",
                    }}
                  />
                </MenuItem>
              ))}
            </Box>
          )}

          {roleData && availableRoles.length === 0 && (
            <Box py={2} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                No roles available
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        <Box mt={1} py={1} px={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleManualLogout}
            sx={{
              backgroundColor: "#ed553b",
              "&:hover": {
                backgroundColor: "#d94a32",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
