/**
 * @fileoverview Inbox component for displaying user-specific tasks and roles.
 * Handles cookie decoding, session validation, and role-based tab display.
 * @module src/pages/Inbox/Inbox
 * @author Rakshana
 * @date 27/10/2025
 * @since 1.0.0
 */

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import InboxTable from "./InboxTable";
import {
  decryptData,
  // Assuming encryptPayloadForGo is available in the same utility file
  encryptPayloadForGo, 
  validateJsonData, // validateJsonData is in original, but will replace with explicit parsing
  isWebCryptoSupported,
} from "src/components/Encryption/EncryptionKey";
import { HostName } from "src/assets/host/Host";

const API_TOKEN = "HRFGVJISOVp1fncC";

/* -----------------------------------------------------
 * Utility: Cookie Helpers using js-cookie library
 * ----------------------------------------------------- */
const getCookie = (name) => {
  return Cookies.get(name);
};

const setCookie = (name, value, days = 1) => {
  Cookies.set(name, value, { expires: days, path: '/' });
};

const deleteCookie = (name) => {
  Cookies.remove(name, { path: '/' });
};

/* -----------------------------------------------------
 * Utility: Authentication Helpers
 * ----------------------------------------------------- */
const getLoginName = () =>
  sessionStorage.getItem("username") ||
  localStorage.getItem("username") ||
  getCookie("username");

const getAuthHeaders = async () => {
  const encryptedToken = getCookie("HRToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${encryptedToken}`,
  };
};

/* -----------------------------------------------------
 * Component: Page Container
 * ----------------------------------------------------- */
const PageContainer = ({ children }) => (
  <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
    {children}
  </div>
);

/* -----------------------------------------------------
 * Component: Inbox
 * ----------------------------------------------------- */
const Inbox = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const isMobile = window.innerWidth <= 768;

  /* -----------------------------------------------------
   * Fetch Role Data
   * ----------------------------------------------------- */
  const fetchRoleData = useCallback(async () => {
    if (!isWebCryptoSupported()) {
      setError("Web Crypto API not supported in this browser");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loginName = getLoginName();
      // NOTE: Using 'session_id' from the original component, but the key 'P_id'
      // from the request body in the first example for consistency with the encryption method.
      const sessionId = getCookie("session_id"); 
      const headers = await getAuthHeaders();

      // --- REQUEST ENCRYPTION START ---
      const requestBody = {
        token: API_TOKEN,
        UserName: loginName,
        P_id: sessionId, 
      };

      const encryptedPayload = await encryptPayloadForGo(requestBody);
 

      const response = await fetch(`${HostName}/Defaultrole`, {
        method: "POST",
        headers: headers,
        // Send the encrypted payload wrapped in a 'Data' object
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const encryptedResponse = await response.json();
 

      if (!encryptedResponse.Data) {
        throw new Error("No encrypted data received from API");
      }

      // --- RESPONSE DECRYPTION START ---
      let decryptedData;
      let parsedData;

      try {
        decryptedData = await decryptData(encryptedResponse.Data);


        // FIX: Check if decryptedData is already an object or needs parsing
        if (typeof decryptedData === "string") {
          try {
            parsedData = JSON.parse(decryptedData);
          } catch (parseError) {

            throw new Error("Invalid JSON format in decrypted data");
          }
        } else {
          parsedData = decryptedData;
        }

      } catch (decryptError) {

        throw new Error("Decryption failed. Invalid response data.");
      }
      // --- RESPONSE DECRYPTION END ---


      // The rest of the logic uses the parsedData object
      // FIXED: Better status checking (matching the robust check from the first example)
      const status = parsedData.Status || parsedData.status || parsedData.code;
      const data = parsedData.Data || parsedData.data || parsedData.records;

      if (status === 200 && data) {
        const availableRoles = data.Records || data.records || [];
        setRoleData(availableRoles);

        const savedRole = getCookie("selectedRole");
        
        if (savedRole && availableRoles.some((r) => r.RoleName === savedRole)) {
          const roleIndex = availableRoles.findIndex(
            (r) => r.RoleName === savedRole
          );
          setActiveTab(roleIndex + 1);
        } else if (availableRoles.length > 0) {
          const defaultRole = availableRoles[0].RoleName;
          setActiveTab(1);
          setCookie("selectedRole", defaultRole);
        } else {
          setActiveTab(0);
          deleteCookie("selectedRole");
        }
      } else {
        throw new Error(parsedData.message || "Failed to fetch role data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoleData();
  }, [fetchRoleData]);

  /* -----------------------------------------------------
   * Tab Data Construction
   * ----------------------------------------------------- */
  const tabs = [
    { name: "All Task", icon: "🗂️", count: 0 },
    ...roleData.map((role) => ({
      name: role.RoleName,
      icon: "📋",
      count: 0,
    })),
  ];

  /* -----------------------------------------------------
   * Handle Tab Click
   * ----------------------------------------------------- */
  const handleTabClick = (index, tabName) => {
    setActiveTab(index);
    if (isMobile) setShowMobileMenu(false);

    if (index !== 0) {
      deleteCookie("selectedRole");
      setCookie("selectedRole", tabName);
    } else {
      deleteCookie("selectedRole");
    }
  };

  /* -----------------------------------------------------
   * Render UI
   * ----------------------------------------------------- */
  return (
    <PageContainer>
      <div
        style={{
          background: "white",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "white",
            borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
            padding: "0 16px",
            flexShrink: 0,
          }}
        >
          {/* Mobile Header with Search */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
              }}
            >
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {showMobileMenu ? "✕" : "☰"}
              </button>
              <input
                type="search"
                placeholder="Search tasks..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  width: "120px",
                  outline: "none",
                }}
              />
            </div>
          )}

          {/* Tabs */}
          {loading ? (
            <div style={{ padding: "12px 16px" }}>Loading...</div>
          ) : error ? (
            <div style={{ color: "red", padding: "12px 16px" }}>{error}</div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                ...(isMobile && showMobileMenu
                  ? {
                      flexDirection: "column",
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "white",
                      zIndex: 100,
                    }
                  : {}),
              }}
            >
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  flex: 1,
                  ...(isMobile && showMobileMenu
                    ? { flexDirection: "column", overflowX: "visible", flex: "none" }
                    : {}),
                }}
              >
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => handleTabClick(index, tab.name)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: isMobile && showMobileMenu ? "16px 20px" : "12px 16px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      borderBottom:
                        activeTab === index
                          ? "3px solid #20639b"
                          : "3px solid transparent",
                      color: activeTab === index ? "#20639b" : "#6B7280",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ fontSize: "16px", marginRight: "5px" }}>
                      {tab.icon}
                    </span>
                    {tab.name}
                    {tab.count > 0 && (
                      <span
                        style={{
                          marginLeft: "8px",
                          background:
                            activeTab === index
                              ? "linear-gradient(135deg, #20639b, #764ba2)"
                              : "#9CA3AF",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          minWidth: "16px",
                          textAlign: "center",
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {!isMobile && (
                <input
                  type="search"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  style={{
                    marginLeft: "16px",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    width: "250px",
                    outline: "none",
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Table Section */}
        {!loading && !error && <InboxTable activeRole={tabs[activeTab]?.name} searchValue={searchValue} />}
      </div>
    </PageContainer>
  );
};

export default Inbox;