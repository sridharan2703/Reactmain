/**
 * @fileoverview Employee E-File Data Transformation and Rendering System
 * @module EmployeeEfileDataHandlers
 * @description Comprehensive data transformation utilities and renderer components for Employee E-File system.
 * Handles API data normalization, section-specific rendering, and dynamic UI generation for employee information.
 *
 * @author Susmitha
 * @version 1.0.0
 * @created 10-11-2024
 * @lastModified 17-11-2024
 *
 * @dependencies
 * - React: Core React library
 * - Material-UI: UI component library
 * - Custom Components: Various internal UI components
 * - Cookies: Authentication and session management
 *
 * @features
 * - Multi-format API data transformation
 * - Section-specific rendering strategies
 * - Dynamic document browser
 * - Access control and validation
 * - Error handling and loading states
 * - Responsive design patterns
 *
 * @sectionTypes
 * - personal: Personal information with card layout
 * - appointment: Employment details with structured cards
 * - education: Tabular education records
 * - experience: Work experience in table format
 * - dependents: Compact profile view for family members
 * - nominee: Nominee details with card layout
 * - contact: Address information cards
 * - language: Language proficiency with Hindi focus
 * - documents: Dynamic document browser
 * - apar/leave/ltc/etc: Tabular data sections
 */

// ==========================================================================
// LIBRARY AND HOOK IMPORTS
// ==========================================================================

import React, { useState, useEffect } from "react";
import {
  // Material-UI (MUI) components for UI structure and styling
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Divider,
  Fade,
  Grow,
  Alert,
  Snackbar,
  Tooltip,
  Card,
} from "@mui/material";
import {
  // Material-UI Icons for navigation and section identification
  Translate,
  School as EducationIcon,
  Work as WorkIcon,
  Description as DocumentIcon,
  BeachAccess as LeaveIcon,
  CardTravel as LTCIcon,
  Description as OrderIcon,
  Assessment as AppraisalIcon,
  Flight as TravelIcon,
  Receipt as ClaimIcon,
  Person as PersonalIcon,
  Contacts as ContactIcon,
  Group as DependentIcon,
  AccountBalance as NomineeIcon,
  AccountBalance as AccountBalanceIcon,
  Lock as LockIcon,
  Error as ErrorIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

// ==========================================================================
// CUSTOM COMPONENT AND UTILITY IMPORTS
// ==========================================================================
import CommonDataTable from "src/components/ui/Table.js"; // Standard table component for tabular data
import DependentSectionCard from "src/components/ui/SideColorCard.js"; // Card component for dependent sections
import IconNavigationSection from "src/components/ui/IconNavigationSection.js"; // Horizontal navigation for sections
import TopColorCard from "src/components/ui/TopColorCard.js"; // Card component with color strip on top
import SideColorCard from "src/components/ui/SideColorCard.js"; // Card component with color strip on the side
import DynamicDocumentBrowser from "./DocumentList.js"; // Component for displaying documents in a file-browser style
import Dropdown from "src/components/ui/Dropdown"; // Custom dropdown component (used for Admin E-File employee selection)
import {
  // Custom encryption/decryption utilities for secure API communication
  decryptData,
  encryptPayloadForGo,
} from "src/components/Encryption/EncryptionKey";
//Import custom styles and shared UI components
import {
  IconCard,
  SectionContainer,
  StatusChip,
  floatAnimation,
  slideUpFade,
  scaleIn,
  gradientFlow,
} from "src/components/ui/InfoCards";

import {
  // Imports for sub-components used in specific section renders
  ProfessionalDependentView,
  ViewToggleButtons,
  NomineeCard,
  DetailItem,
} from "./employeeEfileComponents";
import { useLocation } from "react-router-dom"; // Hook to access routing state
import Cookies from "js-cookie"; // Library for managing browser cookies
import { Host } from "src/assets/host/Host"; // API host URL configuration
import FancyCircularLoader from "src/components/ui/Loader"; // Custom loading spinner component

/**
 * @typedef {Object} EmployeeEfileProps
 * @property {string} [initialEmployeeId=""] - Employee ID passed directly as a prop (often used in Popup/User views).
 * @property {string} employeeId - Employee ID passed directly as a prop.
 * @property {string} userRole - User's role passed as a prop.
 * @property {string} sessionId - User's session ID passed as a prop.
 * @property {'adminefile'|'popup'|'userefile'|'efile'} [type] - Defines the context/view type of the component.
 */

/**
 * Employee E-File Component: Main application component for HR E-File viewing.
 * @param {EmployeeEfileProps} props - The component's props.
 * @returns {JSX.Element} The E-File dashboard or a specific section detail view.
 */
const EmployeeEfile = ({
  initialEmployeeId = "", // Default to empty string for initial employee ID
  employeeId, // Prop for current employee ID
  userRole, // Prop for user's role
  sessionId, // Prop for user's session ID
  type: propType, // Accepts 'type' as a prop
}) => {
  // Determine the effective view type from props, location state, or default to 'adminefile'
  const { state } = useLocation(); // Get state from React Router
  const type = propType || state?.type || "adminefile"; // Prioritize propType, then state, then default



  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [currentPage, setCurrentPage] = useState("dashboard"); // Controls main view: 'dashboard' or 'section'
  const [activeSection, setActiveSection] = useState(null); // ID of the currently viewed section
  const [dependentView, setDependentView] = useState("professional"); // Toggles view for Dependent section
  const [selectedSections, setSelectedSections] = useState([]); // State for multi-select (kept for context)

  const [form, setForm] = useState({
    employeeid: "", // Employee ID selected in the Admin dropdown
  });

  const [loading, setLoading] = useState(false); // Global loading state for initial data fetch (kept for context)
  const [error, setError] = useState({}); // Stores API errors, keyed by section ID or 'global'
  const [apiSectionData, setApiSectionData] = useState({}); // Stores the fetched and decrypted API data for all sections
  const [apiSectionLoading, setApiSectionLoading] = useState({}); // Loading state for individual sections
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message displayed in the Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity (color) of the Snackbar
  const [moduleList, setModuleList] = useState([]); // List of accessible modules from the role API
  const [hasEfileAccess, setHasEfileAccess] = useState(null); // Overall E-File access boolean
  const [roleCheckLoading, setRoleCheckLoading] = useState(true); // Loading state for the initial role/access API
  const [roleApiFailed, setRoleApiFailed] = useState(false); // Flag if the role API entirely failed
  const [isAutoFilled, setIsAutoFilled] = useState(false); // Tracks if the employee ID was auto-filled (kept for context)
  const [isInitialized, setIsInitialized] = useState(false); // Tracks if the initial setup is complete

  // ==========================================================================
  // TYPE-BASED CONFIGURATION
  // ==========================================================================

  /**
   * Defines component behavior and configuration based on the 'type' prop.
   * @returns {Object} Configuration object for rendering.
   */
  const getEffectiveParameters = () => {
    switch (type) {
      case "adminefile": // Admin E-File view
        return {
          employeeId: form.employeeid, // From dropdown state
          userRole: Cookies.get("selectedRole") || userRole,
          sessionId: Cookies.get("session_id") || sessionId,
          showHeader: true,
          showDropdown: true,
          background: "#5690ecff",
          minHeight: "100vh",
          titleText: "EMPLOYEE E-FILE",
        };

      case "popup": // Embedded view
        return {
          employeeId: employeeId || initialEmployeeId, // From props
          userRole: userRole,
          sessionId: sessionId,
          showHeader: false,
          showDropdown: false,
          background: "purple",
          minHeight: "auto",
          titleText: "Employee E-File",
        };

      case "userefile": // User's own E-File view
        // User's own E-File view
        // Both types will hide header and dropdown
        const empId = Cookies.get("EmpId");
        return {
          employeeId: empId || employeeId || initialEmployeeId,
          userRole: Cookies.get("selectedRole") || userRole,
          sessionId: Cookies.get("session_id") || sessionId,
          showHeader: false, // Header hidden
          showDropdown: false, // Dropdown hidden
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
          minHeight: "auto",
          titleText: "Employee File (User View)",
        };

      default: // Default fallback
        return {
          employeeId: form.employeeid,
          userRole: userRole,
          sessionId: sessionId,
          showHeader: true,
          showDropdown: true,
          background: "purple",
          minHeight: "100vh",
          titleText: "Employee E-File",
        };
    }
  };
  const effectiveParams = getEffectiveParameters(); // Get the active configuration
  const effectiveEmployeeId = effectiveParams.employeeId; // Employee ID currently being viewed
  const effectiveUserRole = effectiveParams.userRole; // User role for API access checks
  const effectiveSessionId = effectiveParams.sessionId; // Session ID for API payload

  // ==========================================================================
  // BACKGROUND STYLING
  // ==========================================================================

  /**
   * Defines outer and inner background styles based on the view type.
   * @returns {Object} Style objects for outer and inner containers.
   */
  const getBackgroundStyles = () => {
    // Outer Background - Full page background
    const outerBackground = {
      background: " rgba(253, 255, 255, 1)",
      minHeight: "100vh",
      padding: type === "popup" ? "10px" : "20px",
      borderRadius: "9px",
    };

    // Inner Background - Content area background
    const innerBackground = {
      background: "rgba(255, 255, 255, 1)",
      borderRadius: "5px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      minHeight: type === "popup" ? "auto" : "calc(100vh - 40px)",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
    };

    return { outerBackground, innerBackground };
  };

  const { outerBackground, innerBackground } = getBackgroundStyles();

  // ==========================================================================
  // THEME AND RESPONSIVE HOOKS
  // ==========================================================================

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // eslint-disable-next-line
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // ==========================================================================
  // SECTION CONFIGURATION
  // ==========================================================================

  /**
   * Defines all possible E-File sections with their properties.
   */

  const sections = [
    {
      id: "personal",
      label: "Personal",
      icon: <PersonalIcon />,
      color: "#1976d2",
      apiCategory: "personaldetails",
    },
    {
      id: "appointment",
      label: "Appointment",
      icon: <WorkIcon />,
      color: "#2e7d32",
      apiCategory: "appointmentdetails",
    },
    {
      id: "education",
      label: "Education",
      icon: <EducationIcon />,
      color: "#ed6c02",
      apiCategory: "educationdetails",
    },
    {
      id: "experience",
      label: "Experience",
      icon: <WorkIcon />,
      color: "#9c27b0",
      apiCategory: "experiencedetails",
    },
    {
      id: "dependents",
      label: "Dependent",
      icon: <DependentIcon />,
      color: "#0288d1",
      apiCategory: "dependentdetails",
    },
    {
      id: "nominee",
      label: "Nominee",
      icon: <NomineeIcon />,
      color: "#7b1fa2",
      apiCategory: "nomineedetails",
    },
    {
      id: "contact",
      label: "Contact",
      icon: <ContactIcon />,
      color: "#d32f2f",
      apiCategory: "contactdetails",
    },
    {
      id: "language",
      label: "Language",
      icon: <Translate />,
      color: "#388e3c",
      apiCategory: "languagedetails",
    },
    {
      id: "documents",
      label: "Document",
      icon: <DocumentIcon />,
      color: "#f57c00",
      apiCategory: "documentdetails",
    },
    {
      id: "apar",
      label: "APAR",
      icon: <AppraisalIcon />,
      color: "#00796b",
      apiCategory: "apardetails",
    },
    {
      id: "leave",
      label: "Leave",
      icon: <LeaveIcon />,
      color: "#c2185b",
      apiCategory: "leavedetails",
    },
    {
      id: "ltc",
      label: "LTC",
      icon: <LTCIcon />,
      color: "#512da8",
      apiCategory: "ltcdetails",
    },
    {
      id: "officeorder",
      label: "Office Order",
      icon: <OrderIcon />,
      color: "#5d4037",
      apiCategory: "officeorderdetails",
    },
    {
      id: "travel",
      label: "Travel",
      icon: <TravelIcon />,
      color: "#e65100",
      apiCategory: "traveldetails",
    },
    {
      id: "claims",
      label: "Claims",
      icon: <ClaimIcon />,
      color: "#c62828",
      apiCategory: "claimsdetails",
    },
  ];

  // ==========================================================================
  // HELPER FUNCTIONS
  // ==========================================================================

  /**
   * Checks if an employee ID is selected or available based on the view type.
   * @returns {boolean} True if an employee ID is effectively set.
   */
  const isEmployeeSelected = () => {
    // For popup and userefile types, employee is always considered selected
    if (type === "popup" || type === "userefile") {
      return !!effectiveEmployeeId;
    }
    // For adminefile type, check if dropdown has a value
    return form.employeeid && form.employeeid !== "";
  };

  /**
   * Checks the API response from the RoleBasedModulesHandler for E-File access and available modules.
   * @param {Object|Array} apiResponse - The parsed (potentially decrypted) API response.
   * @returns {{hasAccess: boolean, modules: Array}} Access status and module list.
   */
  const checkApiResponseForAccess = (apiResponse) => {


    let modulesArray = [];

    // Handle different API response structures
    if (Array.isArray(apiResponse)) {
      modulesArray = apiResponse;
    } else if (apiResponse?.Data && Array.isArray(apiResponse.Data)) {
      modulesArray = apiResponse.Data;
    } else {
      
      return { hasAccess: false, modules: [] };
    }

    // Check if we have any modules
    if (modulesArray.length === 0) {
     
      return { hasAccess: false, modules: [] };
    }

    const hasAccess = modulesArray.length > 0;

    return {
      hasAccess: hasAccess,
      modules: modulesArray,
    };
  };

  // ==========================================================================
  // API INTEGRATION
  // ==========================================================================
  // Effect to perform role check and employee list fetch on initialization
  useEffect(() => {
    if (effectiveEmployeeId && effectiveUserRole && effectiveSessionId) {
      fetchAllData();
    }
  }, [effectiveEmployeeId, effectiveUserRole, effectiveSessionId, type]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // For adminefile type, fetch employee dropdown first
      if (type === "adminefile") {
        await fetchEmployeeDetails();
      }

      // Then fetch role data and section data
      await Promise.all([
        fetchRoleData(effectiveUserRole, effectiveSessionId),
        fetchSectionDataForAll(),
      ]);
    } catch (error) {
      // Error fetching data
    } finally {
      setLoading(false);
    }
  };
  /**
   * Fetches the role-based modules from the API to determine section access.
   * @param {string} role - The user's role.
   * @param {string} session_id - The user's session ID.
   * @returns {Promise<Array>} The list of accessible modules.
   */
  const fetchRoleData = async (role, session_id) => {

    if (!session_id) {
      const errorMsg = "Session ID is undefined or null in fetchRoleData";
      throw new Error(errorMsg);
    }

    try {
      const jwtToken = Cookies.get("HRToken");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!role) throw new Error("User role missing.");

      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id,
        role_name: role,
        type: type,
      };

      // Decryption Logic (robust handling of pre-decrypted or encrypted data)
      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);

      const requestBody = { Data: encryptedPayload };

      const response = await fetch(
        "https://wftest1.iitm.ac.in:3000/RoleBasedModulesHandler",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("API response is not valid JSON");
      }

      // Check if response is already decrypted (array of modules)
      if (responseData.Data && Array.isArray(responseData.Data)) {

        const { hasAccess, modules: filteredModules } =
          checkApiResponseForAccess(responseData);

        setHasEfileAccess(hasAccess);
        setModuleList(filteredModules);
        setRoleApiFailed(false);


        return filteredModules;
      }

      // If encrypted, try decryption
      const encryptedResponse = responseData.Data ?? responseData.data;

      if (!encryptedResponse) {
        throw new Error("No data payload found in response");
      }

      const decryptedString = await decryptData(encryptedResponse);

      if (!decryptedString) throw new Error("Decryption returned empty result");

      let parsedData;
      try {
        parsedData = JSON.parse(decryptedString);
      } catch (parseError) {
        parsedData = decryptedString;
      }

      const { hasAccess, modules } = checkApiResponseForAccess(parsedData);

      setHasEfileAccess(hasAccess);
      setModuleList(modules);
      setRoleApiFailed(false);


      return modules;
    } catch (err) {
      setHasEfileAccess(false);
      setRoleApiFailed(true);
      setError((prev) => ({
        ...prev,
        role: err.message || "Failed to fetch role-based modules",
      }));
      throw err;
    }
  };

  /**
   * Fetches the list of all employees for the Admin E-File dropdown.
   */
  const fetchEmployeeDetails = async () => {

    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        type: "adminefile",
      };

      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);
      const requestBody = { Data: encryptedPayload };

      const response = await fetch(`${Host}/EmployeeDropdown`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      const encryptedData = responseData.Data;
      const decryptedData = await decryptData(encryptedData);

      if (decryptedData.Status !== 200) {
        throw new Error(decryptedData.message || "API returned non-200 status");
      }

      let employeeList = [];

      if (Array.isArray(decryptedData.Data)) {
        employeeList = decryptedData.Data.map((rec) => ({
          label: rec.employeeid,
          value: rec.employeeid,
        }));
      } else {
        // Expected Data to be an array, got:
      }

      setApiSectionData((prev) => ({
        ...prev,
        employees: employeeList,
      }));

      return employeeList;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        employees:
          err.userMessage || err.message || "Failed to fetch employee details",
      }));
      throw err;
    }
  };
  // useEffect(() => {
  //   fetchEmployeeDetails();
  // }, []);

  /**
   * Fetches section data from API
   * @param {string} sectionId - The section ID to fetch data for
   * @param {string} employeeid - The employee ID from dropdown
   */

  // Fetch section data using employee ID from popup

  const fetchPersonalDetails = async (employeeid = effectiveEmployeeId) => {

    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const pureEmployeeId = employeeid?.split("-")[0]?.trim();
      if (!pureEmployeeId) {
        return;
      }

      // 🔐 Encrypt payload
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        employeeid: pureEmployeeId,
      };

      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);

      const requestBody = {
        Data: encryptedPayload,
      };


      const response = await fetch(`${Host}/EmployeeBasicDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      // Get raw response to see actual format
      const rawResponse = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(rawResponse);
      } catch (parseError) {
        throw new Error("API response is not valid JSON");
      }

      // Check if response is already decrypted (based on personal details structure)
      if (
        responseData.Data &&
        (responseData.Data.personal_details ||
          responseData.Data.family_details ||
          responseData.Data.bank_details)
      ) {

        const personalData = responseData.Data;

        // Store in state
        setApiSectionData((prev) => ({
          ...prev,
          personal: personalData,
        }));

        return personalData;
      }

      // If we have encrypted data, try to handle it
      const encryptedData = responseData.Data ?? responseData.data;

      if (!encryptedData) {
        throw new Error("No data payload found in response");
      }

      // Try different decryption approaches
      let finalData;

      // Approach 1: Try the standard decryption
      if (typeof encryptedData === "string") {
        try {
          const decryptedString = await decryptData(encryptedData);

          // Direct JSON parse instead of validateJsonData
          try {
            finalData = JSON.parse(decryptedString);
          } catch (jsonError) {
            // If it's not JSON, use as string/raw data
            finalData = decryptedString;
          }
        } catch (decryptError) {

          // Approach 2: Try direct JSON parse (might already be decrypted)
          try {
            finalData = JSON.parse(encryptedData);
          } catch (jsonError) {

            // Approach 3: Use as plain object
            finalData = encryptedData;
          }
        }
      } else {
        // Data is already an object
        finalData = encryptedData;
      }


      // Extract personal data (not experience data)
      let personalData = {};

      if (finalData?.Data) {
        // If data is nested under Data
        personalData = finalData.Data;
      } else if (
        finalData?.personal_details ||
        finalData?.family_details ||
        finalData?.bank_details
      ) {
        // If data is at root level with personal structure
        personalData = finalData;
      } else {
        // Use whatever we got
        personalData = finalData || {};
      }


      // Store in state
      setApiSectionData((prev) => ({
        ...prev,
        personal: personalData,
      }));

      return personalData;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        personal: err.message || "Failed to fetch employee personal details",
      }));
      throw err;
    }
  };

  const fetchAppointmentDetails = async (employeeid = effectiveEmployeeId) => {


    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const pureEmployeeId = employeeid?.split("-")[0]?.trim();
      if (!pureEmployeeId) {
        return;
      }

      // 🔐 Encrypt payload
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        employeeid: pureEmployeeId,
      };


      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);


      const requestBody = {
        Data: encryptedPayload,
      };


      const response = await fetch(`${Host}/EmployeeAppointmentDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      // Get raw response to see actual format
      const rawResponse = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(rawResponse);
      } catch (parseError) {
        throw new Error("API response is not valid JSON");
      }

      // Check if response is already decrypted (based on your API response structure)
      if (
        responseData.Data &&
        (responseData.Data.employment_information ||
          responseData.Data.employment_details)
      ) {

        const appointmentData = responseData.Data;

        // Store in state - CORRECTED: store under "appointment" key
        setApiSectionData((prev) => ({
          ...prev,
          appointment: appointmentData,
        }));

        return appointmentData;
      }

      // If we have encrypted data, try to handle it
      const encryptedData = responseData.Data ?? responseData.data;

      if (!encryptedData) {
        throw new Error("No data payload found in response");
      }


      // Try different decryption approaches
      let finalData;

      // Approach 1: Try the standard decryption
      if (typeof encryptedData === "string") {
        try {
          const decryptedString = await decryptData(encryptedData);

          // Direct JSON parse instead of validateJsonData
          try {
            finalData = JSON.parse(decryptedString);
          } catch (jsonError) {
            // If it's not JSON, use as string/raw data
            finalData = decryptedString;
          }
        } catch (decryptError) {

          // Approach 2: Try direct JSON parse (might already be decrypted)
          try {
            finalData = JSON.parse(encryptedData);
          } catch (jsonError) {

            // Approach 3: Use as plain object
            finalData = encryptedData;
          }
        }
      } else {
        // Data is already an object
        finalData = encryptedData;
      }


      // Extract appointment data - CORRECTED for appointment structure
      let appointmentData = {};

      if (finalData?.Data) {
        // If data is nested under Data
        appointmentData = finalData.Data;
      } else if (
        finalData?.employment_information ||
        finalData?.employment_details
      ) {
        // If data is at root level with appointment structure
        appointmentData = finalData;
      } else {
        // Use whatever we got
        appointmentData = finalData || {};
      }


      // Store in state - CORRECTED: store under "appointment" key
      setApiSectionData((prev) => ({
        ...prev,
        appointment: appointmentData,
      }));

      return appointmentData;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        appointment:
          err.message || "Failed to fetch employee appointment details",
      }));
      throw err;
    }
  };

  const fetchEducationDetails = async (employeeid = effectiveEmployeeId) => {

    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const pureEmployeeId = employeeid?.split("-")[0]?.trim();
      if (!pureEmployeeId) {
        return;
      }

      // 🔐 Encrypt request payload
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        employeeid: pureEmployeeId,
      };


      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);

      const requestBody = { Data: encryptedPayload };


      const response = await fetch(`${Host}/EmployeeEducationDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      // Parse the response
      const responseData = await response.json();


      // Check if we have encrypted data
      const encryptedData = responseData.Data;

      if (!encryptedData) {
        throw new Error("No Data field in response");
      }

      if (typeof encryptedData !== "string") {
        throw new Error(
          `Expected encrypted string, got ${typeof encryptedData}`
        );
      }


      // ✅ CRITICAL: decryptData() returns a PARSED OBJECT, not a string!
      // It internally does: JSON.parse(decryptedString)
      const decryptedData = await decryptData(encryptedData);


      // Validate decrypted response
      if (decryptedData.Status !== 200) {
        throw new Error(
          decryptedData.message || `API error: Status ${decryptedData.Status}`
        );
      }

      // -----------------------------------------------------------
      // START OF CHANGES: Robust Data Extraction
      // -----------------------------------------------------------
      let educationDetails = [];

      // 1. Check for the previous structure: { Data: { education_details: [...] } }
      if (
        decryptedData.Data &&
        decryptedData.Data.education_details &&
        Array.isArray(decryptedData.Data.education_details)
      ) {
        educationDetails = decryptedData.Data.education_details;
      }
      // 2. Check for the NEW structure: { Data: [...] }
      else if (decryptedData.Data && Array.isArray(decryptedData.Data)) {
        educationDetails = decryptedData.Data;
      }
      // 3. Check for the root structure: { education_details: [...] }
      else if (
        decryptedData.education_details &&
        Array.isArray(decryptedData.education_details)
      ) {
        educationDetails = decryptedData.education_details;
      }
      // 4. Fallback: If the decrypted data itself is the array
      else if (Array.isArray(decryptedData)) {
        educationDetails = decryptedData;
      } else {
        educationDetails = []; // Ensure it remains an array
      }
      // -----------------------------------------------------------
      // END OF CHANGES
      // -----------------------------------------------------------

      // Ensure it's an array (redundant check, but safe)
      if (!Array.isArray(educationDetails)) {
        educationDetails = [];
      }


      // Store in state (This is the primary storage used by the UI logic)
      setApiSectionData((prev) => ({
        ...prev,
        education: educationDetails,
      }));


      return educationDetails;
    } catch (err) {

      // Enhanced error logging
      if (err.isSessionRelated) {
        // Session-related error detected
      }

      setError((prev) => ({
        ...prev,
        education:
          err.userMessage ||
          err.message ||
          "Failed to fetch employee education details",
      }));

      throw err;
    }
  };

  const fetchDependentDetails = async (employeeid = effectiveEmployeeId) => {

    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const pureEmployeeId = employeeid?.split("-")[0]?.trim();
      if (!pureEmployeeId) {
        return;
      }

      // 🔐 Encrypt request payload
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        employeeid: pureEmployeeId,
      };


      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);

      const requestBody = { Data: encryptedPayload };


      const response = await fetch(`${Host}/EmployeeDependentDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      // Parse the response
      const responseData = await response.json();


      // Check if we have encrypted data
      const encryptedData = responseData.Data;

      if (!encryptedData) {
        throw new Error("No Data field in response");
      }

      if (typeof encryptedData !== "string") {
        throw new Error(
          `Expected encrypted string, got ${typeof encryptedData}`
        );
      }


      // ✅ CRITICAL FIX: decryptData() returns a PARSED OBJECT, not a string!
      const decryptedData = await decryptData(encryptedData);


      // Validate decrypted response
      if (decryptedData.Status !== 200) {
        throw new Error(
          decryptedData.message || `API error: Status ${decryptedData.Status}`
        );
      }

      // -----------------------------------------------------------
      // START OF CHANGES: Robust Data Extraction
      // -----------------------------------------------------------
      let dependentData = [];

      // 1. Check for the intended structure: { Data: { dependents: [...] } } (Your current structure)
      if (
        decryptedData.Data &&
        decryptedData.Data.dependents &&
        Array.isArray(decryptedData.Data.dependents)
      ) {
        dependentData = decryptedData.Data.dependents;
      }
      // 2. Check for the direct array structure: { Data: [...] } (Potential format)
      else if (decryptedData.Data && Array.isArray(decryptedData.Data)) {
        dependentData = decryptedData.Data;
      }
      // 3. Check for the root structure: { dependents: [...] }
      else if (
        decryptedData.dependents &&
        Array.isArray(decryptedData.dependents)
      ) {
        dependentData = decryptedData.dependents;
      }
      // 4. Fallback: If the decrypted data itself is the array
      else if (Array.isArray(decryptedData)) {
        dependentData = decryptedData;
      } else {
        dependentData = [];
      }
      // -----------------------------------------------------------
      // END OF CHANGES
      // -----------------------------------------------------------

      // Ensure it's an array
      if (!Array.isArray(dependentData)) {
        dependentData = [];
      }


      // Store in state
      setApiSectionData((prev) => ({
        ...prev,
        dependents: dependentData,
      }));


      return dependentData;
    } catch (err) {

      // Enhanced error logging
      if (err.isSessionRelated) {
        // Session-related error detected
      }

      setError((prev) => ({
        ...prev,
        dependents:
          err.userMessage ||
          err.message ||
          "Failed to fetch employee dependent details",
      }));

      throw err;
    }
  };

  const fetchLanguageDetails = async (employeeid = effectiveEmployeeId) => {

    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const pureEmployeeId = employeeid?.split("-")[0]?.trim();
      if (!pureEmployeeId) {
        return;
      }

      // 🔐 Encrypt payload
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        employeeid: pureEmployeeId,
      };


      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);

      const requestBody = {
        Data: encryptedPayload,
      };


      const response = await fetch(`${Host}/EmployeeLanguageDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      // Get raw response to see actual format
      const rawResponse = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(rawResponse);
      } catch (parseError) {
        throw new Error("API response is not valid JSON");
      }

      // Check if response is already decrypted (based on API response structure)
      if (
        responseData.Data &&
        (responseData.Data.hindi_proficiency || responseData.Data.languages)
      ) {

        const languageData = responseData.Data; // Store the entire Data object

        // Store in state
        setApiSectionData((prev) => ({
          ...prev,
          language: languageData,
        }));

        return languageData;
      }

      // If we have encrypted data, try to handle it
      const encryptedData = responseData.Data ?? responseData.data;

      if (!encryptedData) {
        throw new Error("No data payload found in response");
      }


      // Try different decryption approaches
      let finalData;

      // Approach 1: Try the standard decryption
      if (typeof encryptedData === "string") {
        try {
          const decryptedString = await decryptData(encryptedData);

          // Direct JSON parse instead of validateJsonData
          try {
            finalData = JSON.parse(decryptedString);
          } catch (jsonError) {
            // If it's not JSON, use as string/raw data
            finalData = decryptedString;
          }
        } catch (decryptError) {

          // Approach 2: Try direct JSON parse (might already be decrypted)
          try {
            finalData = JSON.parse(encryptedData);
          } catch (jsonError) {

            // Approach 3: Use as plain object
            finalData = encryptedData;
          }
        }
      } else {
        // Data is already an object
        finalData = encryptedData;
      }


      // Extract language data - CORRECTED for language structure
      let languageData = {};

      if (finalData?.Data) {
        // If data is nested under Data
        languageData = finalData.Data;
      } else if (finalData?.hindi_proficiency || finalData?.languages) {
        // If data is at root level with language structure
        languageData = finalData;
      } else {
        // Use whatever we got
        languageData = finalData || {};
      }


      // Store in state
      setApiSectionData((prev) => ({
        ...prev,
        language: languageData,
      }));

      return languageData;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        language: err.message || "Failed to fetch employee language details", // CORRECTED
      }));
      throw err;
    }
  };

  const fetchDocumentDetails = async (employeeid = effectiveEmployeeId) => {

    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const pureEmployeeId = employeeid?.split("-")[0]?.trim();
      if (!pureEmployeeId) {
        return;
      }

      // 🔐 Encrypt payload
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        employeeid: pureEmployeeId,
      };


      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);

      const requestBody = {
        Data: encryptedPayload,
      };


      const response = await fetch(`${Host}/EmployeeDocumentDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      // Get raw response to see actual format
      const rawResponse = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(rawResponse);
      } catch (parseError) {
        throw new Error("API response is not valid JSON");
      }

      // Check if response is already decrypted (based on your sample response structure)
      if (responseData.Data && responseData.Data.document_details) {

        const documentData = responseData.Data.document_details;

        // Store in state
        setApiSectionData((prev) => ({
          ...prev,
          documents: documentData,
        }));

        return documentData;
      }

      // If we have encrypted data, try to handle it
      const encryptedData = responseData.Data ?? responseData.data;

      if (!encryptedData) {
        throw new Error("No data payload found in response");
      }


      // Try different decryption approaches
      let finalData;

      // Approach 1: Try the standard decryption
      if (typeof encryptedData === "string") {
        try {
          const decryptedString = await decryptData(encryptedData);

          // Direct JSON parse instead of validateJsonData
          try {
            finalData = JSON.parse(decryptedString);
          } catch (jsonError) {
            // If it's not JSON, use as string/raw data
            finalData = decryptedString;
          }
        } catch (decryptError) {

          // Approach 2: Try direct JSON parse (might already be decrypted)
          try {
            finalData = JSON.parse(encryptedData);
          } catch (jsonError) {

            // Approach 3: Use as plain object
            finalData = encryptedData;
          }
        }
      } else {
        // Data is already an object
        finalData = encryptedData;
      }


      // Extract experience data
      let documentData = [];

      if (finalData?.Data?.document_details) {
        documentData = finalData.Data.document_details;
      } else if (finalData?.document_details) {
        documentData = finalData.document_details;
      } else if (Array.isArray(finalData)) {
        documentData = finalData;
      } else {
        documentData = [finalData];
      }


      // Store in state
      setApiSectionData((prev) => ({
        ...prev,
        documents: documentData,
      }));

      return documentData;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        documents: err.message || "Failed to fetch employee experience details",
      }));
      throw err;
    }
  };

  const fetchNomineeDetails = async (employeeid = effectiveEmployeeId) => {

    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const pureEmployeeId = employeeid?.split("-")[0]?.trim();
      if (!pureEmployeeId) {
        return;
      }

      // 🔐 Encrypt payload
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        employeeid: pureEmployeeId,
      };


      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);

      const requestBody = { Data: encryptedPayload };


      const response = await fetch(`${Host}/EmployeeNomineeDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      const responseData = await response.json();
      const encryptedData = responseData.Data;

      if (!encryptedData) {
        throw new Error("No Data field in response");
      }
      if (typeof encryptedData !== "string") {
        throw new Error(
          `Expected encrypted string, got ${typeof encryptedData}`
        );
      }


      // ✅ decryptData() returns a PARSED OBJECT!
      const decryptedData = await decryptData(encryptedData);


      // Validate decrypted response
      if (decryptedData.Status !== 200) {
        throw new Error(
          decryptedData.message || `API error: Status ${decryptedData.Status}`
        );
      }

      // 🎯 Extract the object inside 'Data'
      const nomineeData = decryptedData.Data || {};


      // Store the *extracted object* in state
      setApiSectionData((prev) => ({
        ...prev,
        nominee: nomineeData, // Store the object: { employeeid: "...", gpf_nominee: {...}, ... }
      }));

      // Return the object
      return nomineeData;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        nominee: err.message || "Failed to fetch employee nominee details",
      }));
      throw err;
    }
  };
  const fetchContactDetails = async (employeeid = effectiveEmployeeId) => {

    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const pureEmployeeId = employeeid?.split("-")[0]?.trim();
      if (!pureEmployeeId) {
        return;
      }

      // 🔐 Encrypt payload
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        employeeid: pureEmployeeId,
      };


      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);

      const requestBody = {
        Data: encryptedPayload,
      };


      const response = await fetch(`${Host}/EmployeeContactDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      // Get raw response to see actual format
      const rawResponse = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(rawResponse);
      } catch (parseError) {
        throw new Error("API response is not valid JSON");
      }

      // Check if response is already decrypted (based on contact structure)
      if (
        responseData.Data &&
        (responseData.Data.current_address ||
          responseData.Data.permanent_address)
      ) {

        const contactData = responseData.Data;

        // Store in state
        setApiSectionData((prev) => ({
          ...prev,
          contact: contactData,
        }));

        return contactData;
      }

      // If we have encrypted data, try to handle it
      const encryptedData = responseData.Data ?? responseData.data;

      if (!encryptedData) {
        throw new Error("No data payload found in response");
      }


      // Try different decryption approaches
      let finalData;

      // Approach 1: Try the standard decryption
      if (typeof encryptedData === "string") {
        try {
          const decryptedString = await decryptData(encryptedData);

          // Direct JSON parse instead of validateJsonData
          try {
            finalData = JSON.parse(decryptedString);
          } catch (jsonError) {
            // If it's not JSON, use as string/raw data
            finalData = decryptedString;
          }
        } catch (decryptError) {

          // Approach 2: Try direct JSON parse (might already be decrypted)
          try {
            finalData = JSON.parse(encryptedData);
          } catch (jsonError) {

            // Approach 3: Use as plain object
            finalData = encryptedData;
          }
        }
      } else {
        // Data is already an object
        finalData = encryptedData;
      }


      // Extract contact data
      let contactData = {};

      if (finalData?.Data) {
        // If data is nested under Data
        contactData = finalData.Data;
      } else if (finalData?.current_address || finalData?.permanent_address) {
        // If data is at root level with contact structure
        contactData = finalData;
      } else {
        // Use whatever we got
        contactData = finalData || {};
      }


      // Store in state
      setApiSectionData((prev) => ({
        ...prev,
        contact: contactData,
      }));

      return contactData;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        contact: err.message || "Failed to fetch employee contact details",
      }));
      throw err;
    }
  };

  const fetchExperienceDetails = async (employeeid = effectiveEmployeeId) => {

    try {
      const jwtToken = Cookies.get("HRToken");
      const session_id = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!session_id) throw new Error("Session ID missing.");

      const pureEmployeeId = employeeid?.split("-")[0]?.trim();
      if (!pureEmployeeId) {
        return;
      }

      // 🔐 Encrypt payload
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        session_id: session_id,
        employeeid: pureEmployeeId,
      };


      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);

      const requestBody = { Data: encryptedPayload };


      const response = await fetch(`${Host}/EmployeeExperienceDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }

      const responseData = await response.json();
      const encryptedData = responseData.Data;

      if (!encryptedData) {
        throw new Error("No Data field in response");
      }
      if (typeof encryptedData !== "string") {
        throw new Error(
          `Expected encrypted string, got ${typeof encryptedData}`
        );
      }


      // ✅ decryptData() returns a PARSED OBJECT!
      const decryptedData = await decryptData(encryptedData);


      // Validate decrypted response
      if (decryptedData.Status !== 200) {
        throw new Error(
          decryptedData.message || `API error: Status ${decryptedData.Status}`
        );
      }

      // 🎯 Extract the experience array from 'Data' (New format) or 'Data.experience_details' (Old format)
      let experienceData = [];

      if (decryptedData.Data && Array.isArray(decryptedData.Data)) {
        experienceData = decryptedData.Data;
      } else if (
        decryptedData.Data?.experience_details &&
        Array.isArray(decryptedData.Data.experience_details)
      ) {
        experienceData = decryptedData.Data.experience_details;
      } else if (Array.isArray(decryptedData)) {
        experienceData = decryptedData;
      } else {
        experienceData = [];
      }


      // Store the *extracted array* in state
      setApiSectionData((prev) => ({
        ...prev,
        experience: experienceData, // Store the array: [ {...}, {...} ]
      }));

      // Return the array
      return experienceData;
    } catch (err) {
      setError((prev) => ({
        ...prev,
        experience:
          err.message || "Failed to fetch employee experience details",
      }));
      throw err;
    }
  };
  // ==========================================================================
  // SECTION DATA FETCHER - UPDATED (fetchSectionData REMOVED)
  // ==========================================================================

  /**
   * Universal function to fetch data for a specific section using the appropriate specialized function.
   * Handles individual section loading and error states.
   * @param {string} sectionId - The section ID (e.g., 'personal', 'education').
   * @param {string} [employeeid=effectiveEmployeeId] - The employee ID to fetch data for.
   */

  const fetchSectionData = async (
    sectionId,
    employeeid = effectiveEmployeeId
  ) => {

    // Set loading state for this specific section
    setApiSectionLoading((prev) => ({
      ...prev,
      [sectionId]: true,
    }));

    // Clear any previous error for this section
    setError((prev) => ({
      ...prev,
      [sectionId]: null,
    }));

    try {
      // Use specialized functions for each section
      switch (sectionId) {
        case "personal":
          await fetchPersonalDetails(employeeid);
          break;
        case "appointment":
          await fetchAppointmentDetails(employeeid);
          break;
        case "education":
          await fetchEducationDetails(employeeid);
          break;
        case "experience":
          await fetchExperienceDetails(employeeid);
          break;
        case "dependents":
          await fetchDependentDetails(employeeid);
          break;
        case "language":
          await fetchLanguageDetails(employeeid);
          break;
        case "documents":
          await fetchDocumentDetails(employeeid);
          break;
        case "nominee":
          await fetchNomineeDetails(employeeid);
          break;
        case "contact":
          await fetchContactDetails(employeeid);
          break;
        default:
          throw new Error(`No data fetcher available for ${sectionId}`);
      }

    } catch (err) {
      setError((prev) => ({
        ...prev,
        [sectionId]: err.message || `Failed to fetch ${sectionId} data`,
      }));
    } finally {
      // ✅ Always clear loading state
      setApiSectionLoading((prev) => ({
        ...prev,
        [sectionId]: false,
      }));
    }
  };

  // Fetch data for all accessible sections
  const fetchSectionDataForAll = async () => {
    if (!effectiveEmployeeId) return;

    const accessibleSections = getAccessibleSections();

    for (const section of accessibleSections) {
      await fetchSectionData(section.id, effectiveEmployeeId);
    }
  };

  // ==========================================================================
  // USE EFFECT HOOKS
  // ==========================================================================

  useEffect(() => {
    if (
      !roleCheckLoading &&
      hasEfileAccess &&
      initialEmployeeId &&
      !form.employeeid &&
      !isInitialized
    ) {

      setForm((prev) => ({
        ...prev,
        employeeid: initialEmployeeId,
      }));
      setIsAutoFilled(true);
      setIsInitialized(true);
    }
  }, [
    roleCheckLoading,
    hasEfileAccess,
    initialEmployeeId,
    form.employeeid,
    isInitialized,
  ]);

  // ==========================================================================
  // ACCESS CONTROL VIEWS
  // ==========================================================================
  // Effect to perform role check and employee list fetch on initialization
  useEffect(() => {
    const initializeData = async () => {
      try {
        const jwtToken = Cookies.get("HRToken");

        const sessionId = effectiveSessionId;
        const userRole = effectiveUserRole;

        if (!jwtToken || !sessionId || !userRole) {
          setHasEfileAccess(false);
          setRoleCheckLoading(false);
          return;
        }

        setRoleCheckLoading(true);

        // STEP 1: FETCH ROLE DATA (Crucial for access)
        const modules = await fetchRoleData(userRole, sessionId);

        const hasAccess = Array.isArray(modules) && modules.length > 0;

        if (!hasAccess) {
          setHasEfileAccess(false);
          return;
        }

        // STEP 2: FETCH EMPLOYEE DETAILS (Only required for Admin view)
        await fetchEmployeeDetails();

      } catch (err) {
        setHasEfileAccess(false);
        setError((prev) => ({
          ...prev,
          global: err.message || "Failed to initialize data",
        }));
      } finally {
        setRoleCheckLoading(false);
        setLoading(false);
      }
    };

    if (effectiveUserRole && effectiveSessionId) {
      initializeData();
    } else {
      setRoleCheckLoading(false);
    }
  }, [effectiveUserRole, effectiveSessionId]);
  // Effect to trigger fetching all accessible sections once the employee ID is set/changed
  useEffect(() => {
    if (roleCheckLoading || !hasEfileAccess || !form.employeeid) {
      return;
    }


    // Fetch data for all accessible sections
    const accessibleSections = getAccessibleSections();
    accessibleSections.forEach((section) => {
      fetchSectionData(section.id, form.employeeid);
    });
  }, [form.employeeid, hasEfileAccess, roleCheckLoading]);

  // Update form when employeeId prop changes
  useEffect(() => {
    if (effectiveEmployeeId && effectiveEmployeeId !== form.employeeid) {
      setForm((prev) => ({
        ...prev,
        employeeid: effectiveEmployeeId,
      }));
    }
  }, [effectiveEmployeeId]);
  // ==========================================================================
  // ACCESS CONTROL
  // ==========================================================================

  /**
   * Determines if a section card should be visually disabled.
   * @param {string} sectionId - The ID of the section.
   * @returns {boolean} True if the section should be disabled/locked.
   */
  const isSectionDisabledWithAccess = (sectionId) => {
    if (roleApiFailed) {
      return true;
    }

    if (!hasEfileAccess) {
      return true;
    }

    if (!isEmployeeSelected()) {
      return true;
    }

    return false;
  };

  // ==========================================================================
  // SECTION DETAIL RENDERER
  // ==========================================================================

  /**
   * Renders the detailed view of a selected section.
   * @returns {JSX.Element|null} The section detail JSX or null.
   */
  const renderSectionDetail = () => {
    if (!activeSection) return null;

    const currentSection = getCurrentSectionData();
    const sectionInfo = sections.find((s) => s.id === activeSection);

    // Get accessible sections for navigation
    const accessibleSections = getAccessibleSections();
    const sectionsForNavigation = roleApiFailed ? sections : accessibleSections;

    return (
      <Box
        sx={{
          background: "rgb(255,255,255,1)",
          py: 4,
        }}
      >
        <SectionContainer maxWidth="xl">
          <IconNavigationSection
            sections={sectionsForNavigation}
            activeSection={activeSection}
            onSectionClick={handleSectionClick}
            onBackClick={handleBackToDashboard}
            color={sectionInfo?.color}
            isSectionDisabled={isSectionDisabledWithAccess}
          />
          <Paper
            sx={{
              p: isMobile ? 2 : 4,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mb: 2,
                mt: -2,
                flexDirection: isMobile ? "column" : "row",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <Avatar
                sx={{
                  width: isMobile ? 48 : 60,
                  height: isMobile ? 48 : 60,
                  backgroundColor: sectionInfo.color,
                  boxShadow: `0 8px 25px ${sectionInfo.color}40`,
                }}
              >
                {sectionInfo.icon}
              </Avatar>
              <Box>
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  fontWeight="700"
                  sx={{
                    background: `linear-gradient(45deg, ${sectionInfo.color}, ${sectionInfo.color}80)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {currentSection.title || sectionInfo.label}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Employee ID: {form.employeeid}
                </Typography>
              </Box>
            </Box>
            <Fade in timeout={500}>
              <Box>{renderSectionContent()}</Box>
            </Fade>
          </Paper>
        </SectionContainer>
      </Box>
    );
  };

  // ==========================================================================
  // MAIN VIEW RENDERERS
  // ==========================================================================

  /**
   * Renders the main dashboard view with the employee dropdown and all section cards.
   * @returns {JSX.Element} The dashboard JSX.
   */
  const renderDashboard = () => {
    const config = effectiveParams;

    // Get accessible sections based on role access
    const accessibleSections = getAccessibleSections();
    const sectionsToDisplay = roleApiFailed ? sections : accessibleSections;

    return (
      <Box sx={outerBackground}>
        {/* Inner Background Container */}
        <Box sx={innerBackground}>
          <Container
            maxWidth="xl"
            sx={{
              animation:
                type === "adminefile"
                  ? `${gradientFlow} 15s ease infinite`
                  : "none",
              py: type === "popup" ? 2 : 4,
            }}
          >
            {/* CONDITIONAL HEADER - Based on type */}
            {config.showHeader && type !== "efile" && type !== "userefile" && (
              <Card
                sx={{
                  p: isMobile ? 3 : 4,
                  mb: 6,
                  borderRadius: "16px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  animation: `${slideUpFade} 0.8s ease-out`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                    textAlign: "center",
                  }}
                >
                  {/* Title */}
                  <Typography
                    variant={isMobile ? "h3" : "h2"}
                    sx={{
                      fontFamily: '"Times New Roman", Times, serif',
                      fontWeight: 800,
                      background: "linear-gradient(45deg, #1976d2, #00bcd4)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "#1976d2",
                      mb: isMobile ? 2 : 0,
                      fontSize: isMobile ? "2rem" : "3rem",
                    }}
                  >
                    {config.titleText}
                  </Typography>

                  {/* Dropdown Section */}
                  {config.showDropdown &&
                    type !== "efile" &&
                    type !== "userefile" && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Dropdown
                          options={apiSectionData.employees || []}
                          value={{
                            label: form.employeeid,
                            value: form.employeeid,
                          }}
                          onChange={(selected) =>
                            setForm({
                              ...form,
                              employeeid: selected?.value || "",
                            })
                          }
                          label="Employee ID"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              height: "52px",
                              width: isMobile ? "100%" : "290px",
                              backgroundColor: "#fff",
                            },
                          }}
                        />
                      </Grid>
                    )}
                </Box>
              </Card>
            )}

            {error.global && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error.global}
              </Alert>
            )}

            {/* SHOW LOADER WHILE CHECKING ACCESS PERMISSIONS */}
            {roleCheckLoading && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                }}
              >
                <FancyCircularLoader />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Checking access permissions...
                </Typography>
              </Box>
            )}

            {/* SHOW LOADER WHILE FETCHING DATA */}
            {loading && !roleCheckLoading && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                }}
              >
                <FancyCircularLoader />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Loading employee data...
                </Typography>
              </Box>
            )}

            {/* All Sections Grid - Only show when not loading */}
            {!roleCheckLoading && !loading && (
              <Box>
                <Grow in timeout={1000}>
                  <Grid
                    container
                    spacing={type === "popup" ? 1 : 2}
                    justifyContent="center"
                  >
                    {sectionsToDisplay.map((section) => (
                      <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        key={section.id}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Tooltip
                          title={getSectionTooltipWithAccess()}
                          placement="top"
                          arrow
                        >
                          <span>
                            <IconCard
                              color={section.color}
                              onClick={() => {
                                if (section.id === "personal") {
                                  handlePersonalDetailsClick();
                                } else {
                                  handleSectionClick(section.id);
                                }
                              }}
                              sx={{
                                animation: `${scaleIn} 0.5s ease-out`,
                                width: isMobile ? 160 : 180,
                                minHeight: isMobile ? 70 : 80,
                                position: "relative",
                                overflow: "hidden",
                                cursor: isSectionDisabledWithAccess(section.id)
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: isSectionDisabledWithAccess(section.id)
                                  ? 0.6
                                  : 1,
                                filter: isSectionDisabledWithAccess(section.id)
                                  ? "grayscale(0.5)"
                                  : "none",
                                "&:hover": isSectionDisabledWithAccess(
                                  section.id
                                )
                                  ? {}
                                  : {
                                      transform: "translateY(-4px)",
                                      boxShadow: `0 12px 30px ${section.color}40`,
                                    },
                              }}
                            >
                              {/* Show lock icon for disabled sections */}
                              {isSectionDisabledWithAccess(section.id) && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    zIndex: 2,
                                  }}
                                >
                                  <LockIcon
                                    sx={{
                                      fontSize: 16,
                                      color: "text.disabled",
                                    }}
                                  />
                                </Box>
                              )}

                              {/* Show API failure indicator */}
                              {roleApiFailed && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    left: 4,
                                    zIndex: 2,
                                  }}
                                >
                                  <ErrorIcon
                                    sx={{ fontSize: 16, color: "warning.main" }}
                                  />
                                </Box>
                              )}

                              {error[section.id] && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: isSectionDisabledWithAccess(
                                      section.id
                                    )
                                      ? 24
                                      : 4,
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: "error.main",
                                    zIndex: 2,
                                  }}
                                />
                              )}
                              {apiSectionLoading[section.id] && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: isSectionDisabledWithAccess(
                                      section.id
                                    )
                                      ? 24
                                      : 4,
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: "primary.main",
                                    animation:
                                      "pulse 1.5s ease-in-out infinite",
                                    zIndex: 2,
                                  }}
                                />
                              )}
                              <Avatar
                                sx={{
                                  backgroundColor: isSectionDisabledWithAccess(
                                    section.id
                                  )
                                    ? "grey.400"
                                    : section.color,
                                  width: isMobile ? 40 : 50,
                                  height: isMobile ? 40 : 50,
                                  mb: 1,
                                  animation: isSectionDisabledWithAccess(
                                    section.id
                                  )
                                    ? "none"
                                    : `${floatAnimation} 3s ease-in-out infinite`,
                                  boxShadow: isSectionDisabledWithAccess(
                                    section.id
                                  )
                                    ? "none"
                                    : `0 8px 25px ${section.color}40`,
                                }}
                              >
                                {section.icon}
                              </Avatar>
                              <Typography
                                variant={isMobile ? "body2" : "h6"}
                                fontWeight="600"
                                sx={{
                                  background: isSectionDisabledWithAccess(
                                    section.id
                                  )
                                    ? "none"
                                    : `linear-gradient(45deg, ${section.color}, ${section.color}80)`,
                                  backgroundClip: "text",
                                  WebkitBackgroundClip: "text",
                                  color: isSectionDisabledWithAccess(section.id)
                                    ? "text.disabled"
                                    : "transparent",
                                  textAlign: "center",
                                }}
                              >
                                {section.label}
                                {roleApiFailed && " 🔒"}
                              </Typography>
                            </IconCard>
                          </span>
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </Grow>

                {/* Show message if no sections are accessible */}
                {!roleApiFailed &&
                  hasEfileAccess &&
                  accessibleSections.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Alert severity="warning">
                        <Typography variant="body1">
                          You have E-File access but no specific sections are
                          available for your role.
                        </Typography>
                      </Alert>
                    </Box>
                  )}
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    );
  };

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleSectionClick = async (sectionId) => {
    // Current access details:

    // Comprehensive validation
    const validation = validateSectionAccess(sectionId);

    if (!validation.isValid) {

      // Show detailed error message
      const errorMessage = validation.errors.join("\n");
      showSnackbar(errorMessage, "error");

      // If missing critical fields, show more detailed alert
      if (
        validation.missingFields.includes("HRToken") ||
        validation.missingFields.includes("session_id")
      ) {
        showDetailedAccessError(validation);
      }

      return;
    }


    // All validations passed - proceed with section navigation
    setActiveSection(sectionId);
    setCurrentPage("section");

    // Fetch section data if not already loaded
    if (!apiSectionData[sectionId] && !apiSectionLoading[sectionId]) {
      await fetchSectionData(sectionId, form.employeeid);
    } else {
    }
  };

  /**
   * Show detailed access error with retry option
   */
  const showDetailedAccessError = (validation) => {
    const missingFields = validation.missingFields;

    let detailedMessage = "Authentication Issues:\n";

    if (missingFields.includes("HRToken")) {
      detailedMessage += " Authentication token missing (HRToken)\n";
    }
    if (missingFields.includes("session_id")) {
      detailedMessage += " Session ID missing\n";
    }
    if (missingFields.includes("selectedRole")) {
      detailedMessage += " User role not selected\n";
    }
    if (missingFields.includes("employeeid")) {
      detailedMessage += " Employee ID not selected\n";
    }

    detailedMessage += "\nPlease refresh the page or contact administrator.";

    // Optionally show in a dialog instead of snackbar for critical errors
    if (
      missingFields.includes("HRToken") ||
      missingFields.includes("session_id")
    ) {
      showCriticalErrorDialog(detailedMessage);
    }
  };

  /**
   * Show critical error dialog for authentication issues
   */
  const showCriticalErrorDialog = (message) => {
    // You can implement a modal dialog here for critical errors
    // For now, using snackbar but could be enhanced with a proper dialog
    showSnackbar(
      "Critical authentication issue - Please refresh the page",
      "error"
    );
  };
  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
    setActiveSection(null);

    // ✅ Reset the employee dropdown only for admin efile type
    if (type === "adminefile") {
      setForm((prev) => ({
        ...prev,
        employeeid: "", // Clear the selected employee
      }));
    }
  };

  /**
   * Special handler for Personal Details section with enhanced validation 
   */
  const handlePersonalDetailsClick = async () => {
    const sectionId = "personal";

    // Enhanced validation specifically for Personal Details with detailed logging
    const validation = validatePersonalDetailsAccess();

    if (!validation.isValid) {


      // Show comprehensive error message
      showPersonalDetailsAccessError(validation);
      return;
    }


    // Proceed with Personal Details
    await handleSectionClick(sectionId);
  };
  /**
   * Enhanced validation specifically for Personal Details 
   */
  const validatePersonalDetailsAccess = () => {

    const validation = {
      isValid: true,
      errors: [],
      missingFields: [],
    };

    // Step 1: Check if role API failed
    if (roleApiFailed) {
      validation.isValid = false;
      validation.errors.push(
        "Role verification failed - contact administrator"
      );
    } else {
    }

    // Step 2: Check if user has E-File access
    if (!hasEfileAccess) {
      validation.isValid = false;
      validation.errors.push("Access denied to Employee E-File");
    } else {
    }

    // Step 3: Check if employee is selected
    if (!isEmployeeSelected()) {
      validation.isValid = false;
      validation.errors.push("Please select an Employee ID first");
      validation.missingFields.push("employeeid");
    } else {
    }

    // Step 4: Check if Personal section is accessible for this role
    const accessibleSections = getAccessibleSections();
    const hasSectionAccess = accessibleSections.some(
      (section) => section.id === "personal"
    );

    if (!hasSectionAccess) {
      validation.isValid = false;
      validation.errors.push("Access denied to Personal section");
    } else {
    }

    // Step 5: Check required cookies and tokens
    const jwtToken = Cookies.get("HRToken");
    const sessionId = Cookies.get("session_id");
    const userRole = Cookies.get("selectedRole");

    if (!jwtToken) {
      validation.isValid = false;
      validation.errors.push("Authentication token missing");
      validation.missingFields.push("HRToken");
    }

    if (!sessionId) {
      validation.isValid = false;
      validation.errors.push("Session ID missing");
      validation.missingFields.push("session_id");
    }

    if (!userRole) {
      validation.isValid = false;
      validation.errors.push("User role not selected");
      validation.missingFields.push("selectedRole");
    }

    // Step 6: Check screen/category access
    const section = sections.find((s) => s.id === "personal");
    if (section) {
      const hasCategoryAccess = moduleList.some(
        (module) =>
          module.module_name &&
          module.module_name.toLowerCase().includes("personal")
      );

      if (!hasCategoryAccess) {
        validation.isValid = false;
        validation.errors.push(
          "Personal Details module not available for your role"
        );
      }
    }

    // Update overall validity based on errors
    if (validation.errors.length > 0) {
      validation.isValid = false;
    }


    return validation;
  };
  /**
   * Show detailed Personal Details access error
   */
  const showPersonalDetailsAccessError = (validation) => {
    let errorDetails = validation.errors.join("\n• ");

    const accessDetails = getAccessDetails();

    // Add debug information for administrators
    if (process.env.NODE_ENV === "development") {
      errorDetails += `\n\nDebug Info:\n• Role: ${
        accessDetails.userRole || "Not set"
      }\n• Employee: ${
        accessDetails.employeeId || "Not selected"
      }\n• Accessible Sections: ${
        accessDetails.accessibleSections.join(", ") || "None"
      }`;
    }

    // Show in snackbar or consider using a dialog for better visibility
    showSnackbar(`Personal Details: ${validation.errors[0]}`, "error");
  };

  const handleSectionSelection = (event) => {
    const value = event.target.value;

    if (value.includes("ALL") && !selectedSections.includes("ALL")) {
      setSelectedSections(["ALL", ...sections.map((s) => s.id)]);
    } else if (!value.includes("ALL") && selectedSections.includes("ALL")) {
      setSelectedSections([]);
    } else if (!value.includes("ALL") && value.length === sections.length) {
      setSelectedSections(["ALL", ...value]);
    } else {
      setSelectedSections(value);
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // ==========================================================================
  // ACCESS CONTROL HELPERS
  // ==========================================================================

  /**
   * Filters the master list of sections based on the accessible modules from the role API.
   * @returns {Array<Object>} The array of sections the current user can access.
   */
  const getAccessibleSections = () => {

    // If role API failed, return all sections (they will be disabled)
    if (roleApiFailed) {
      return sections;
    }

    // If no modules or no access, return empty array
    if (!hasEfileAccess || !moduleList || moduleList.length === 0) {
      return [];
    }


    const mapping = {
      personal: "personal",
      appointment: "appointment",
      education: "education",
      experience: "experience",
      dependents: "dependents",
      nominee: "nominee",
      contact: "contact",
      language: "language",
      documents: "documents",
      apar: "apar",
      leave: "leave",
      ltc: "ltc",
      officeorder: "officeorder",
      travel: "travel",
      claims: "claims",
    };

    const accessibleSectionIds = [];

    // Method 1: Direct mapping
    moduleList.forEach((module) => {
      const moduleName = module.module_name?.toLowerCase();
      if (moduleName && mapping[moduleName]) {
        accessibleSectionIds.push(mapping[moduleName]);
      }
    });

    // Method 2: Fuzzy matching for remaining modules
    moduleList.forEach((module) => {
      const moduleName = module.module_name?.toLowerCase();
      if (!moduleName) return;

      // Skip if already mapped
      if (accessibleSectionIds.some((id) => mapping[moduleName] === id)) {
        return;
      }

      let matched = false;

      // Try fuzzy matching with sections
      for (const section of sections) {
        if (
          moduleName.includes(section.id.toLowerCase()) ||
          moduleName.includes(section.label.toLowerCase()) ||
          section.label.toLowerCase().includes(moduleName)
        ) {
          accessibleSectionIds.push(section.id);
          matched = true;
          break;
        }
      }

      if (!matched) {
      }
    });


    // Filter sections based on accessible IDs
    const accessibleSections = sections.filter((section) =>
      accessibleSectionIds.includes(section.id)
    );


    return accessibleSections;
  };

  const getSectionTooltipWithAccess = () => {
    if (roleApiFailed) {
      return "Role verification failed - contact administrator";
    }

    if (!hasEfileAccess) {
      return "Access denied to Employee E-File";
    }

    // Different messages based on type
    if (type === "adminefile") {
      return isEmployeeSelected() ? "" : "Please select an Employee ID first";
    } else {
      return isEmployeeSelected() ? "" : "Employee data not available";
    }
  };

  // ==========================================================================
  // DATA TRANSFORMATION FUNCTIONS
  // ==========================================================================

  /**
   * Transforms raw API data into standardized format for UI rendering
   * @param {Object} apiData - Raw API response data
   * @param {string} sectionId - Identifier for the section being transformed
   * @returns {Object} Transformed data object with title and structured content
   * @throws {Error} When data transformation fails
   */

  const transformApiData = (apiData, sectionId) => {
    // Return empty structure if no API data provided
    if (!apiData) return { title: "", content: [] };
    // Find section configuration from predefined sections
    const section = sections.find((s) => s.id === sectionId);
    // Use section label or fallback to section ID
    const sectionTitle = section ? section.label : sectionId;

    // Handle different section types based on actual API response structure
    switch (sectionId) {
      case "personal":
        // Extract nested personal data with safe fallbacks
        const personalDetails = apiData.personal_details || {};
        const familyDetails = apiData.family_details || {};
        const bankDetails = apiData.bank_details || {};

        // Helper function to safely get value or return ''
        const getInfo = (value) => value || " ";

        // Transform personal data into structured format
        const transformedData = {
          title: sectionTitle,
          content: {
            basic: {
              title: "Personal Information",
              icon: <PersonalIcon />,
              fields: [
                // Personal information fields with safe value access
                {
                  label: "First Name",
                  value: getInfo(personalDetails.first_name),
                  type: "text",
                },
                {
                  label: "Middle Name",
                  value: getInfo(personalDetails.middle_name),
                  type: "text",
                },
                {
                  label: "Last Name",
                  value: getInfo(personalDetails.last_name),
                  type: "text",
                },
                {
                  label: "Gender",
                  value: getInfo(personalDetails.gender),
                  type: "text",
                },
                {
                  label: "Marital Status",
                  value: getInfo(personalDetails.marital_status),
                  type: "text",
                },
                {
                  label: "Date of Birth",
                  value: getInfo(personalDetails.dob),
                  type: "date",
                },
                {
                  label: "Age",
                  value: getInfo(personalDetails.age),
                  type: "text",
                },
                {
                  label: "Nationality",
                  value: getInfo(personalDetails.nationality),
                  type: "text",
                },
                {
                  label: "Birth State",
                  value: getInfo(personalDetails.birth_state),
                  type: "text",
                },
                {
                  label: "Birth District",
                  value: getInfo(personalDetails.birth_district),
                  type: "text",
                },
                {
                  label: "Birth Place",
                  value: getInfo(personalDetails.birth_place),
                  type: "text",
                },
                {
                  label: "Hometown",
                  value: getInfo(personalDetails.hometown),
                  type: "text",
                },
                {
                  label: "Religion",
                  value: getInfo(personalDetails.religion),
                  type: "text",
                },
                {
                  label: "Caste Category",
                  value: getInfo(personalDetails.caste_category?.trim()),
                  type: "text",
                },
                {
                  label: "Emergency Contact",
                  value: getInfo(personalDetails.emergency_contact_no),
                  type: "text",
                },
                {
                  label: "Mobile No",
                  value: getInfo(personalDetails.mobile_no),
                  type: "text",
                },
                {
                  label: "Physically Challenged",
                  value: getInfo(personalDetails.is_physically_challenged),
                  type: "text",
                },
                {
                  label: "Disability Percentage",
                  value: getInfo(personalDetails.percentage_of_disability),
                  type: "text",
                },
                {
                  label: "Nature of Disability",
                  value: getInfo(personalDetails.nature_of_disability),
                  type: "text",
                },
                {
                  label: "Personal Email",
                  value: getInfo(personalDetails.personal_email),
                  type: "text",
                },
                {
                  label: "Aadhaar No",
                  value: getInfo(personalDetails.aadhaar_no),
                  type: "text",
                },
                {
                  label: "Mother Tongue",
                  value: getInfo(personalDetails.mother_tongue),
                  type: "text",
                },
                {
                  label: "Identification Marks",
                  value: getInfo(personalDetails.identification_marks),
                  type: "text",
                },
                {
                  label: "PAN Card No",
                  value: getInfo(personalDetails.pan_card_no),
                  type: "text",
                },
              ],
            },
            family: {
              title: "Family Details",
              icon: <DependentIcon />,
              fields: [
                // Family member information
                {
                  label: "Father Name",
                  value: getInfo(familyDetails.father_name),
                  type: "text",
                },
                {
                  label: "Mother Name",
                  value: getInfo(familyDetails.mother_name),
                  type: "text",
                },
                {
                  label: "Spouse Name",
                  value: getInfo(familyDetails.spouse_name),
                  type: "text",
                },
              ],
            },
            bank: {
              title: "Bank Details",
              icon: <AccountBalanceIcon />,
              fields: [
                // Banking information
                {
                  label: "Bank Name",
                  value: getInfo(bankDetails.bank_name),
                  type: "text",
                },
                {
                  label: "IFSC Code",
                  value: getInfo(bankDetails.ifsc_code),
                  type: "text",
                },
                {
                  label: "Bank Account No",
                  value: getInfo(bankDetails.bank_account_no),
                  type: "text",
                },
              ],
            },
          },
        };

        return transformedData;

      case "appointment":
        // Extract employment information with safe access
        const employmentInfo = apiData.employment_information || {};
        const employmentDetails = apiData.employment_details || {};
        const geDetails = (value) => value || " ";
        return {
          title: sectionTitle,
          content: {
            employment: {
              title: "Employment Information",
              icon: <WorkIcon />,
              fields: [
                // Employment basic information
                {
                  label: "Department",
                  value: geDetails(employmentInfo.department),
                  type: "text",
                },
                {
                  label: "Designation",
                  value: geDetails(employmentInfo.designation),
                  type: "text",
                },
                {
                  label: "Employee Group",
                  value: geDetails(employmentInfo.employee_group),
                  type: "text",
                },
                {
                  label: "Employee Name",
                  value: geDetails(employmentInfo.employee_name),
                  type: "text",
                },
                {
                  label: "Employee Status",
                  value: geDetails(employmentInfo.employee_status),
                  type: "text",
                },
                {
                  label: "Employee Type",
                  value: geDetails(employmentInfo.employee_type),
                  type: "text",
                },
                {
                  label: "Grade",
                  value: geDetails(employmentInfo.grade),
                  type: "text",
                },
                {
                  label: "Is Active",
                  value: geDetails(employmentInfo.is_active),
                  type: "text",
                },
                {
                  label: "Route To",
                  value: geDetails(employmentInfo.route_to),
                  type: "text",
                },
                {
                  label: "Section",
                  value: geDetails(employmentInfo.section),
                  type: "text",
                },
              ],
            },
            details: {
              title: "Employment Details",
              icon: <WorkIcon />,
              fields: [
                // Employment detailed information
                {
                  label: "Pay Info",
                  value: geDetails(employmentDetails.pay_info),
                  type: "text",
                },
                {
                  label: "Basic Pay", // Fixed label
                  value: geDetails(employmentDetails.basic_pay),
                  type: "text",
                },
                {
                  label: "Non Practice Pay",
                  value: geDetails(employmentDetails.non_practice_pay),
                  type: "text",
                },
                {
                  label: "Pay Band",
                  value: geDetails(employmentDetails.name_of_pay_band),
                  type: "text",
                },
                {
                  label: "Date of Joining",
                  value: geDetails(employmentDetails.date_of_joining),
                  type: "date",
                },
                {
                  label: "Date of Confirmation",
                  value: geDetails(employmentDetails.date_of_confirmation),
                  type: "date",
                },
                {
                  label: "Date of Retirement",
                  value: geDetails(employmentDetails.date_of_retirement),
                  type: "date",
                },
                {
                  label: "Office Room No",
                  value: geDetails(employmentDetails.office_room_no),
                  type: "text",
                },
                {
                  label: "Office Extension No",
                  value: geDetails(employmentDetails.office_extension_no),
                  type: "text",
                },
              ],
            },
          },
        };

      case "education":

        // --- Data Extraction for State Value ---
        let educationDetails = [];

        // 1. If state stored the raw response (less likely, but for robustness)
        if (apiData?.Data && Array.isArray(apiData.Data)) {
          educationDetails = apiData.Data;
        }
        // 2. If state stored the raw response (old nested structure)
        else if (
          apiData?.Data?.education_details &&
          Array.isArray(apiData.Data.education_details)
        ) {
          educationDetails = apiData.Data.education_details;
        }
        // 3. If state stored the extracted array directly (MOST LIKELY)
        else if (Array.isArray(apiData)) {
          educationDetails = apiData;
        } else {
          educationDetails = [];
        }


        /**
         * Safely extracts and formats field values
         * @param {any} value - Raw field value
         * @param {string} defaultText - Fallback text for empty values
         * @returns {string} Formatted field value
         */
        const getValue = (value, defaultText = "") => {
          if (value === null || value === undefined || value === "") {
            return defaultText;
          }
          return String(value).trim() || defaultText;
        };

        // 🆕 CRITICAL FIX: Filter out empty objects where all fields are empty
        const nonEmptyEducationRecords = educationDetails.filter((edu) => {
          // Check if at least one field has meaningful data
          return (
            getValue(edu.degree_or_exam) !== "" ||
            getValue(edu.institution) !== "" ||
            getValue(edu.university_name) !== "" ||
            getValue(edu.board_name) !== "" ||
            getValue(edu.specialization) !== "" ||
            getValue(edu.class) !== "" ||
            getValue(edu.mode) !== "" ||
            getValue(edu.month_year_of_passing) !== "" ||
            getValue(edu.obtained_marks) !== "" ||
            getValue(edu.percentage_of_marks) !== "" ||
            getValue(edu.registration_no) !== "" ||
            getValue(edu.education_country) !== "" ||
            getValue(edu.education_state) !== ""
          );
        });


        // If no meaningful education data found
        if (nonEmptyEducationRecords.length === 0) {
          return {
            title: sectionTitle,
            content: [], // Return empty array - CommonDataTable error show chestundi
          };
        }

        // Transform only non-empty education records
        const transformedEducation = nonEmptyEducationRecords.map((edu) => {
          const educationRecord = edu || {};

          // Safely parse marks for calculation
          const obtained = Number(educationRecord.obtained_marks);
          const total = Number(educationRecord.percentage_of_marks);
          const hasValidMarks = !isNaN(obtained) && !isNaN(total) && total > 0;

          // Calculate percentage string
          const percentageValue = hasValidMarks
            ? `${((obtained / total) * 100).toFixed(2)} %`
            : "";

          // 🎯 Return a FLAT object. Keys will be auto-generated columns by renderTableSection.
          return {
            "Degree/Exam": getValue(educationRecord.degree_or_exam),
            Institution: getValue(educationRecord.institution),
            "University Name": getValue(educationRecord.university_name),
            "Board Name": getValue(educationRecord.board_name),
            Specialization: getValue(educationRecord.specialization),
            Class: getValue(educationRecord.class),
            Mode: getValue(educationRecord.mode),
            "Passing Year": getValue(educationRecord.month_year_of_passing),
            "Obtained Marks": getValue(educationRecord.obtained_marks),
            "Total/Max Marks": getValue(educationRecord.percentage_of_marks), // Renamed for clarity
            Percentage: percentageValue, // Calculated field
            "Registration No": getValue(educationRecord.registration_no),
            "Education Country": getValue(educationRecord.education_country),
            "Education State": getValue(educationRecord.education_state),
          };
        });


        // Return the array of FLAT objects in the content
        return {
          title: sectionTitle,
          content: transformedEducation,
        };

      case "experience":

        const getData = (value, defaultText = "") => {
          if (value === null || value === undefined || value === "") {
            return defaultText;
          }
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [year, month, day] = value.split("-");
            return `${day}-${month}-${year}`;
          }
          return String(value).trim() || defaultText;
        };

        const experienceRecords = Array.isArray(apiData) ? apiData : [];

        // 🆕 CRITICAL FIX: Filter out empty objects where all fields are empty
        const nonEmptyExperienceRecords = experienceRecords.filter((record) => {
          // Check if at least one field has meaningful data
          return (
            getData(record.organization_name) !== "" ||
            getData(record.designation_experience) !== "" ||
            getData(record.type_of_employment) !== "" ||
            getData(record.from_date) !== "" ||
            getData(record.to_date) !== "" ||
            getData(record.total_experience) !== "" ||
            getData(record.pay_scale) !== "" ||
            getData(record.address1) !== ""
          );
        });


        // 🎯 Data lekunte (OR all records are empty) empty array pass chey
        if (nonEmptyExperienceRecords.length === 0) {
          return {
            title: sectionTitle,
            content: [], // 🎯 Empty array - CommonDataTable error show chestundi
          };
        }

        // Only transform non-empty records
        const transformedExperience = nonEmptyExperienceRecords.map(
          (record) => {
            return {
              "Organization Name": getData(record.organization_name),
              Designation: getData(record.designation_experience),
              "Employment Type": getData(record.type_of_employment),
              "Government Employee":
                getData(record.is_govt_employee) === "1"
                  ? "Yes"
                  : getData(record.is_govt_employee) === "0"
                  ? "No"
                  : getData(record.is_govt_employee),
              "From Date": getData(record.from_date),
              "To Date": getData(record.to_date),
              "Total Experience": getData(record.total_experience),
              "Pay Scale": getData(record.pay_scale),
              Address: getData(record.address1),
            };
          }
        );

        return {
          title: sectionTitle,
          content: transformedExperience,
        };

      case "dependents": {

        // This handles: apiData is array OR apiData.Data.dependents is array OR apiData.dependents is array
        let dependents = Array.isArray(apiData)
          ? apiData
          : apiData?.Data?.dependents ||
            apiData?.dependents ||
            apiData?.Data ||
            [];

        // Ensure we only store an array
        dependents = Array.isArray(dependents) ? dependents : [];

        if (dependents.length === 0) {
          return {
            title: sectionTitle || "Dependent Details",
            content: [], // Pass an empty array
          };
        }


        // Pass the raw array of dependent objects to be consumed by renderCompactProfileSection
        return {
          title: sectionTitle || "Dependent Details",
          content: dependents,
        };
      }
      case "nominee":
        // apiData is now the object: { employeeid: "...", gpf_nominee: {...}, ... }

        // Use optional chaining for safe access
        const generalNominee = apiData.general_nominee || {};
        const gpfNominee = apiData.gpf_nominee || {};
        const gratuityNominee = apiData.gratuity_nominee || {};
        const gtisNominee = apiData.gtis_nominee || {};
        const npsNominee = apiData.nps_nominee || {};

        // Helper function for safe access and date formatting (assuming you need to format it)
        /**
         * Safely extracts nominee field values with date formatting
         * @param {any} value - Raw field value
         * @param {string} defaultText - Fallback text
         * @returns {string} Formatted value
         */
        const getValues = (value, defaultText = "") => {
          if (value === null || value === undefined || value === "") {
            return defaultText;
          }
          // Simple date reformatting from YYYY-MM-DD to DD-MM-YYYY if it looks like a date
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [year, month, day] = value.split("-");
            return `${day}-${month}-${year}`;
          }
          return String(value).trim();
        };

        return {
          title: sectionTitle,
          content: {
            generalNominee: {
              title: "General Nominee",
              icon: <WorkIcon />,
              fields: [
                {
                  // FIX: Use 'dob' which is present in the backend response, not 'dob1'
                  label: "Date of Birth",
                  value: getValues(generalNominee.dob),
                  type: "text",
                },
                {
                  label: "Name",
                  value: getValues(generalNominee.name),
                  type: "text",
                },
                {
                  label: "Relationship/Place",
                  value: getValues(generalNominee.relationship),
                  type: "text",
                },
                {
                  label: "Share Percentage",
                  value: getValues(generalNominee.share_percentage),
                  type: "text",
                },
              ],
            },
            gpfNominee: {
              title: "GPF Nominee",
              icon: <WorkIcon />,
              fields: [
                {
                  // FIX: Use 'dob'
                  label: "Date Of Birth",
                  value: getValues(gpfNominee.dob),
                  type: "text",
                },
                {
                  label: "Name",
                  value: getValues(gpfNominee.name),
                  type: "text",
                },
                {
                  label: "Relationship",
                  value: getValues(gpfNominee.relationship),
                  type: "text",
                },
                {
                  label: "Share Percentage",
                  value: getValues(gpfNominee.share_percentage),
                  type: "text",
                },
              ],
            },
            gratuityNominee: {
              title: "Gratuity Nominee",
              icon: <WorkIcon />,
              fields: [
                {
                  // FIX: Use 'dob'
                  label: "Date Of Birth",
                  value: getValues(gratuityNominee.dob),
                  type: "text",
                },
                {
                  label: "Name",
                  value: getValues(gratuityNominee.name),
                  type: "text",
                },
                {
                  label: "Relationship",
                  value: getValues(gratuityNominee.relationship),
                  type: "text",
                },
                {
                  label: "Share Percentage",
                  value: getValues(gratuityNominee.share_percentage),
                  type: "text",
                },
              ],
            },
            gtisNominee: {
              title: "GTIS Nominee",
              icon: <WorkIcon />,
              fields: [
                {
                  // FIX: Use 'dob'
                  label: "Date Of Birth",
                  value: getValues(gtisNominee.dob),
                  type: "text",
                },
                {
                  label: "Name",
                  value: getValues(gtisNominee.name),
                  type: "text",
                },
                {
                  label: "Relationship",
                  value: getValues(gtisNominee.relationship),
                  type: "text",
                },
                {
                  label: "Share Percentage",
                  value: getValues(gtisNominee.share_percentage),
                  type: "text",
                },
              ],
            },
            npsNominee: {
              title: "NPS Nominee",
              icon: <WorkIcon />,
              fields: [
                {
                  // FIX: Use 'dob'
                  label: "Date Of Birth",
                  value: getValues(npsNominee.dob),
                  type: "text",
                },
                {
                  label: "Name",
                  value: getValues(npsNominee.name),
                  type: "text",
                },
                {
                  label: "Relationship",
                  value: getValues(npsNominee.relationship),
                  type: "text",
                },
                {
                  label: "Share Percentage",
                  value: getValues(npsNominee.share_percentage),
                  type: "text",
                },
              ],
            },
          },
        };

      case "contact":

        // For contact details, we have address structure
        const currentAddress = apiData.current_address || {};
        const permanentAddress = apiData.permanent_address || {};

        return {
          title: sectionTitle,
          content: {
            current: {
              // Changed from "employment" to "current" for better semantics
              title: "Current Address",
              icon: <HomeIcon />, // Consider using HomeIcon instead of WorkIcon
              fields: [
                {
                  label: "Address Line 1",
                  value: currentAddress.address1 || "",
                  type: "text",
                },
                {
                  label: "Address Line 2",
                  value: currentAddress.address2 || "",
                  type: "text",
                },
                {
                  label: "City/Place",
                  value: currentAddress.city || "",
                  type: "text",
                },
                {
                  label: "District",
                  value: currentAddress.district || "",
                  type: "text",
                },
                {
                  label: "State",
                  value: currentAddress.state || "",
                  type: "text",
                },
                {
                  label: "Country",
                  value: currentAddress.country || "",
                  type: "text",
                },
                {
                  label: "PIN Code",
                  value: currentAddress.pincode || "",
                  type: "text",
                },
              ],
            },
            permanent: {
              // Changed from "details" to "permanent" for better semantics
              title: "Permanent Address",
              icon: <HomeIcon />, // Consider using HomeIcon instead of WorkIcon
              fields: [
                {
                  label: "Address Line 1",
                  value: permanentAddress.address1 || "",
                  type: "text",
                },
                {
                  label: "Address Line 2",
                  value: permanentAddress.address2 || "",
                  type: "text",
                },
                {
                  label: "City/Place",
                  value: permanentAddress.city || "",
                  type: "text",
                },
                {
                  label: "District",
                  value: permanentAddress.district || "",
                  type: "text",
                },
                {
                  label: "State",
                  value: permanentAddress.state || "",
                  type: "text",
                },
                {
                  label: "Country",
                  value: permanentAddress.country || "",
                  type: "text",
                },
                {
                  label: "PIN Code",
                  value: permanentAddress.pincode || "",
                  type: "text",
                },
              ],
            },
          },
        };

      case "language":

        // apiData is already the correct object ({ hindi_proficiency, languages })
        const apiDataContent = apiData || {};

        const hindiProficiencyData = apiDataContent.hindi_proficiency || {};
        const languagesData = apiDataContent.languages || [];


        /**
         * Safely extracts language field values
         * @param {any} value - Raw field value
         * @param {string} defaultText - Fallback text
         * @returns {string} Formatted value
         */

        const getLangData = (value, defaultText = "") =>
          value ? String(value).trim() : defaultText;

        const formattedHindiProficiency = {
          "Level of Knowledge": getLangData(
            hindiProficiencyData.hindi_level_of_knowledge
          ),
          "Working Knowledge": getLangData(
            hindiProficiencyData.hindi_working_knowledge
          ),
          "Overall Proficiency": getLangData(
            hindiProficiencyData.hindi_proficiency
          ),
        };

        const formattedLanguages = languagesData.map((lang) => ({
          Language: getLangData(lang.language),
          read: getLangData(lang.read),
          write: getLangData(lang.write),
          speak: getLangData(lang.speak),
        }));

        return {
          title: sectionTitle,
          content: {
            hindiProficiency: formattedHindiProficiency,
            languages: formattedLanguages,
          },
        };

      case "documents":
        // Handle documents data structure
        const documentsData = Array.isArray(apiData) ? apiData : [apiData];
        return {
          title: sectionTitle,
          content: documentsData,
        };

      case "apar":
        // Handle APAR data structure
        const aparData = Array.isArray(apiData) ? apiData : [apiData];
        return {
          title: sectionTitle,
          content: aparData,
        };

      case "leave":
        // Handle leave data structure
        const leaveData = Array.isArray(apiData) ? apiData : [apiData];
        return {
          title: sectionTitle,
          content: leaveData,
        };

      case "ltc":
        // Handle LTC data structure
        const ltcData = Array.isArray(apiData) ? apiData : [apiData];
        return {
          title: sectionTitle,
          content: ltcData,
        };

      case "officeorder":
        // Handle office order data structure
        const officeOrderData = Array.isArray(apiData) ? apiData : [apiData];
        return {
          title: sectionTitle,
          content: officeOrderData,
        };

      case "travel":
        // Handle travel data structure
        const travelData = Array.isArray(apiData) ? apiData : [apiData];
        return {
          title: sectionTitle,
          content: travelData,
        };

      case "claims":
        // Handle claims data structure
        const claimsData = Array.isArray(apiData) ? apiData : [apiData];
        return {
          title: sectionTitle,
          content: claimsData,
        };

      default:
        // Default case for unknown sections
        return {
          title: sectionTitle,
          content: Array.isArray(apiData) ? apiData : [apiData],
        };
    }
  };
  /**
   * Retrieves current section data with transformation
   * @returns {Object} Current section data with title and content
   */

  const getCurrentSectionData = () => {
    // Check if active section exists and has API data
    if (activeSection && apiSectionData[activeSection]) {
      return transformApiData(apiSectionData[activeSection], activeSection);
    }
    return { title: "", content: [] };
  };

  // ==========================================================================
  // SECTION RENDERERS
  // ==========================================================================

  /**
   * Renders card-based sections (personal, appointment, contact)
   * @param {Object} sectionData - Transformed section data
   * @param {string} color - Section theme color
   * @returns {JSX.Element} Card-based section UI
   */

  const renderCardSection = (sectionData, color) => {
    // Handle empty content
    if (!sectionData.content || Object.keys(sectionData.content).length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No data available
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        {/* Iterate through content subsections */}
        {Object.entries(sectionData.content).map(([key, subsection]) => (
          <TopColorCard key={key} color={color} sx={{ mb: 3 }}>
            {/* Subsection header with icon and title */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 0,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: `${color}15`,
                  color: color,
                  mr: isMobile ? 0 : 2,
                  width: 48,
                  height: 48,
                }}
              >
                {subsection.icon}
              </Avatar>
              <Box sx={{ textAlign: isMobile ? "center" : "" }}>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontWeight="700"
                  color={color}
                >
                  {subsection.title}
                </Typography>
              </Box>
            </Box>

            {/* Dynamic Grid Layout */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 2,
                width: "100%",
              }}
            >
              {subsection.fields &&
                subsection.fields.map((field, index) => (
                  <DetailItem
                    key={index}
                    label={field.label}
                    value={
                      field.type === "status" ? (
                        <StatusChip
                          label={field.value}
                          size="small"
                          status={field.value}
                        />
                      ) : field.type === "amount" ? (
                        <Typography
                          variant="body1"
                          fontWeight="700"
                          color={color}
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {field.value}
                        </Typography>
                      ) : (
                        field.value || ""
                      )
                    }
                    maxWidth={300}
                    allowWrap={
                      // Auto-detect fields that typically have long content
                      field.label?.toLowerCase().includes("address") ||
                      field.label?.toLowerCase().includes("description") ||
                      field.label?.toLowerCase().includes("remarks") ||
                      field.label?.toLowerCase().includes("notes") ||
                      field.label?.toLowerCase().includes("line") || // Add this for "Address Line 1"
                      (typeof field.value === "string" &&
                        field.value.length > 25)
                    }
                    minHeight={field.type === "status" ? 70 : 80}
                  />
                ))}
            </Box>
          </TopColorCard>
        ))}
      </Box>
    );
  };

  /**
   * Renders table-based sections (education, experience, etc.)
   * @param {Object} sectionData - Transformed section data
   * @param {string} color - Section theme color
   * @param {Array} columnsConfig - Optional custom column configuration
   * @returns {JSX.Element} Table-based section UI
   */

  const renderTableSection = (sectionData, color, columnsConfig = null) => {
    const content = sectionData.content;

    // Check if there's an error for this specific section
    // eslint-disable-next-line
    const sectionError = error[activeSection];
    // eslint-disable-next-line
    const sectionLoading = apiSectionLoading[activeSection];

    // ------------------------------------------------------------------------
    // FIX START: DETECT AND HANDLE COMPLEX DETAIL LIST STRUCTURE (e.g., Education)
    // ------------------------------------------------------------------------

    // Check if content is an array AND the first item has a 'fields' property which is an array
    const isDetailList =
      Array.isArray(content) &&
      content.length > 0 &&
      Array.isArray(content[0].fields);

    if (isDetailList) {

      // This is the custom render logic for the education structure:
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
          {content.map((record, recordIndex) => (
            <Box
              key={record.id || recordIndex}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                p: 3,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Colored border strip */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 5,
                  bgcolor: color,
                }}
              />

              {/* Title Row */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, pt: 1 }}>
                {record.icon && (
                  <Box sx={{ mr: 1, color: color }}>{record.icon}</Box>
                )}
                <Typography variant="h6" fontWeight="bold">
                  {record.title || `Record ${recordIndex + 1}`}
                </Typography>
              </Box>

              {/* Fields Grid - This part solves the "Objects are not valid" error */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 2,
                }}
              >
                {/* CRUCIAL: Map over the nested 'fields' array */}
                {record.fields.map((field, fieldIndex) => (
                  <Box
                    key={field.label || fieldIndex}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="medium"
                    >
                      {field.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {field.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      );
    }

    // ------------------------------------------------------------------------
    // FIX END: Detail List Logic
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // FALLBACK: Simple Tabular Structure (Your original logic for other sections)
    // ------------------------------------------------------------------------

    // Auto-generate columns if not provided
    const columns =
      columnsConfig ||
      (content[0]
        ? Object.keys(content[0]).map((key) => ({
            key: key,
            label: key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase()),
            render: (row) => row[key] || "",
          }))
        : []);

    /** ----------------------------
     * 🧩 Try rendering CommonDataTable safely
     * ---------------------------- */
    try {
      return (
        <CommonDataTable columns={columns} data={content} headerColor={color} />
      );
    } catch (err) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Alert
            severity="error"
            sx={{ display: "inline-flex", alignItems: "center" }}
          >
            <Typography variant="body1" fontWeight="500" color="error">
              Unexpected error displaying table: {err.message}
            </Typography>
          </Alert>
        </Box>
      );
    }
  };

  /**
   * Renders dependent information section with compact profile view
   * @param {Object} sectionData - Transformed section data
   * @param {string} color - Section theme color
   * @returns {JSX.Element} Dependent information UI
   */

  const renderCompactProfileSection = (sectionData, color) => {
    const dependents = sectionData.content;
    // Check if there's an error for this specific section
    const sectionError = error[activeSection];
    const sectionLoading = apiSectionLoading[activeSection];

    if (sectionError) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Alert
            severity="error"
            sx={{
              mb: 2,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
            action={
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => fetchSectionData(activeSection, form.employeeid)}
                disabled={sectionLoading}
              >
                {sectionLoading ? <FancyCircularLoader size={16} /> : "Retry"}
              </Button>
            }
          >
            <Typography variant="body1" fontWeight="500">
              {sectionError}
            </Typography>
          </Alert>
        </Box>
      );
    }

    if (sectionLoading) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <FancyCircularLoader />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Loading dependent information...
          </Typography>
        </Box>
      );
    }

    if (!dependents || dependents.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No dependent information available
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <ViewToggleButtons
          currentView={dependentView}
          onViewChange={setDependentView}
        />
        {dependentView === "professional" && (
          // This is where the array of dependent objects is passed
          <ProfessionalDependentView dependents={dependents} color={color} />
        )}
      </Box>
    );
  };

  /**
   * Renders nominee details section with card layout
   * @param {Object} sectionData - Transformed section data
   * @param {string} color - Section theme color
   * @returns {JSX.Element} Nominee details UI
   */
  const renderNomineeDetailsSection = (sectionData, color) => {
    // sectionData.content should already be an object like:
    const nominees = sectionData?.content || {};

    // Error and loading checks
    const sectionError = error[activeSection];
    const sectionLoading = apiSectionLoading[activeSection];

    if (sectionError) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Alert
            severity="error"
            sx={{
              mb: 2,
              "& .MuiAlert-message": { width: "100%" },
            }}
            action={
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => fetchSectionData(activeSection, form.employeeid)}
                disabled={sectionLoading}
              >
                {sectionLoading ? <FancyCircularLoader size={16} /> : "Retry"}
              </Button>
            }
          >
            <Typography variant="body1" fontWeight="500">
              {sectionError}
            </Typography>
          </Alert>
        </Box>
      );
    }

    if (sectionLoading) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <FancyCircularLoader />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Loading nominee information...
          </Typography>
        </Box>
      );
    }

    // Check if nominee data is empty
    if (!nominees || Object.keys(nominees).length === 0) {
      return (
        <DependentSectionCard color={color}>
          <Typography variant="h6" textAlign="center" color="text.secondary">
            No nominee information available
          </Typography>
        </DependentSectionCard>
      );
    }

    // ✅ Main render block
    return (
      <Box sx={{ width: "100%", p: 2 }}>
        <Grid container spacing={3}>
          {Object.values(nominees).map((nomineeSection, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ mb: 1, color: color || "primary.main" }}
              >
                {nomineeSection.title || "Untitled Nominee"}
              </Typography>

              <NomineeCard nominee={nomineeSection} color={color} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  /**
   * Renders documents section with dynamic document browser
   * @param {Object} sectionData - Transformed section data
   * @param {string} color - Section theme color
   * @returns {JSX.Element} Documents browser UI
   */

  /**
   * Renders Documents Section with dynamic document browser
   */
  const renderDocumentsSection = (sectionData, color) => {
    const documents = sectionData.content;

    // Check if there's an error for this specific section
    const sectionError = error[activeSection];
    const sectionLoading = apiSectionLoading[activeSection];

    if (sectionError) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Alert
            severity="error"
            sx={{
              mb: 2,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
            action={
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => fetchSectionData(activeSection, form.employeeid)}
                disabled={sectionLoading}
              >
                {sectionLoading ? <FancyCircularLoader size={16} /> : "Retry"}
              </Button>
            }
          >
            <Typography variant="body1" fontWeight="500">
              {sectionError}
            </Typography>
          </Alert>
        </Box>
      );
    }

    if (sectionLoading) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <FancyCircularLoader />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Loading documents...
          </Typography>
        </Box>
      );
    }

    /**
     * Transforms API data into document browser structure
     * @param {Object} apiData - Raw API document data
     * @returns {Object} Structured document browser data
     */
    const transformToDocumentStructure = (apiData) => {

      // If no data or empty array, return sample data for demonstration
      if (!apiData || (Array.isArray(apiData) && apiData.length === 0)) {
        return getSampleDocumentStructure();
      }

      // Handle different possible API response structures
      let documentList = [];

      // Case 1: Array of documents
      if (Array.isArray(apiData)) {
        documentList = apiData;
      }
      // Case 2: Object with documents array
      else if (apiData.documents && Array.isArray(apiData.documents)) {
        documentList = apiData.documents;
      }
      // Case 3: Single document object
      else if (apiData.document_name || apiData.file_name) {
        documentList = [apiData];
      }
      // Case 4: Object with nested data structure
      else {
        // Try to extract any arrays that might contain documents
        const arrays = Object.values(apiData).filter(Array.isArray);
        if (arrays.length > 0) {
          documentList = arrays[0];
        } else {
          documentList = [apiData];
        }
      }


      // If we still have no documents, use sample data
      if (documentList.length === 0) {
        return getSampleDocumentStructure();
      }

      // Group documents by category/type
      const employeeFiles = [];
      const spouseFiles = [];
      const childrenFiles = [];
      const otherFiles = [];

      documentList.forEach((doc, index) => {
        const fileObj = {
          name:
            doc.document_name ||
            doc.file_name ||
            doc.name ||
            `Document ${index + 1}`,
          type: doc.document_type || doc.file_type || doc.type || "file",
          uploadDate: doc.upload_date || doc.created_date,
          size: doc.file_size || doc.size,
          id: doc.document_id || doc.id || index,
        };

        // Categorize based on document name or type
        const docName = fileObj.name.toLowerCase();

        if (docName.includes("spouse") || doc.category === "spouse") {
          spouseFiles.push(fileObj);
        } else if (
          docName.includes("child") ||
          docName.includes("children") ||
          doc.category === "child"
        ) {
          childrenFiles.push(fileObj);
        } else if (
          docName.includes("emp_") ||
          docName.includes("employee") ||
          doc.category === "employee"
        ) {
          employeeFiles.push(fileObj);
        } else {
          otherFiles.push(fileObj);
        }
      });

      // Build folder structure
      const folderStructure = {
        name: "Employee Documents",
        files: employeeFiles.length > 0 ? employeeFiles : otherFiles,
        folders: [],
      };

      // Add spouse folder if there are spouse documents
      if (spouseFiles.length > 0) {
        folderStructure.folders.push({
          name: "Spouse Documents",
          files: spouseFiles,
        });
      }

      // Add children folder if there are children documents
      if (childrenFiles.length > 0) {
        folderStructure.folders.push({
          name: "Children Documents",
          files: childrenFiles,
        });
      }

      // If we have other files but no employee files, create an "Other Documents" folder
      if (otherFiles.length > 0 && employeeFiles.length > 0) {
        folderStructure.folders.push({
          name: "Other Documents",
          files: otherFiles,
        });
      }

      return folderStructure;
    };

    // Sample document structure for demonstration
    const getSampleDocumentStructure = () => {
      return {
        name: "Employee Folder",
        files: [
          { name: "Emp_BankBook.pdf", type: "PDF", size: "2.4 MB" },
          { name: "Emp_File.pdf", type: "PDF", size: "1.8 MB" },
          { name: "Emp_PAN.pdf", type: "PDF", size: "1.2 MB" },
          { name: "Aadhaar_Card.pdf", type: "PDF", size: "3.1 MB" },
        ],
        folders: [
          {
            name: "Spouse",
            files: [
              { name: "Spouse_Aadhar.pdf", type: "PDF", size: "2.9 MB" },
              { name: "Spouse_Photo.jpg", type: "Image", size: "4.2 MB" },
              { name: "Spouse_PAN.pdf", type: "PDF", size: "1.1 MB" },
            ],
          },
          {
            name: "Children",
            files: [
              { name: "Child1_Birth.pdf", type: "PDF", size: "1.5 MB" },
              { name: "Child1_Photo.jpg", type: "Image", size: "3.8 MB" },
              { name: "Child2_Birth.pdf", type: "PDF", size: "1.6 MB" },
              { name: "Child2_Photo.jpg", type: "Image", size: "4.0 MB" },
            ],
          },
          {
            name: "Education",
            files: [
              { name: "Degree_Certificate.pdf", type: "PDF", size: "5.2 MB" },
              { name: "Transcript.pdf", type: "PDF", size: "3.7 MB" },
            ],
          },
        ],
      };
    };

    // eslint-disable-next-line
    const documentStructure = transformToDocumentStructure(documents);

    // eslint-disable-next-line
    const handleFileClick = (file) => {

      // TODO: Implement actual file preview/download logic
      // This could open a modal, download the file, etc.
    };

    // eslint-disable-next-line
    const handleFolderClick = (folder) => {
    };

    return (
      <Box>
        <DynamicDocumentBrowser
          employeeid={form.employeeid}
          sessionId={sessionId}
          onFileClick={(file) => {}}
        />
      </Box>
    );
  };

  /**
   * Renders language section with Hindi proficiency and other languages
   * @param {Object} sectionData - Transformed section data
   * @param {string} color - Section theme color
   * @returns {JSX.Element} Language proficiency UI
   */

  const renderLanguageWithHindiSection = (sectionData, color) => {
    // 🎯 CRITICAL FIX: Destructure the two simple keys from the transformation
    const { languages = [], hindiProficiency = {} } = sectionData.content || {};

    // Check if there's an error for this specific section
    // eslint-disable-next-line
    const sectionError = error[activeSection];
    // eslint-disable-next-line
    const sectionLoading = apiSectionLoading[activeSection];
    /**
     * Safely converts values to lowercase for status comparison
     * @param {any} val - Input value
     * @returns {string} Lowercase string
     */
    const safeLower = (val) =>
      typeof val === "string"
        ? val.toLowerCase()
        : String(val ?? "").toLowerCase();

    // Check if EITHER Hindi or other languages exist
    const hasLanguageData =
      Object.keys(hindiProficiency).length > 0 || languages.length > 0;

    if (!hasLanguageData) {
      return (
        <SideColorCard color={color}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Translate sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No language information available
            </Typography>
          </Box>
        </SideColorCard>
      );
    }

    // Convert the flat hindiProficiency object into an array of {label, value} pairs for rendering
    const hindiFields = Object.entries(hindiProficiency).map(
      ([key, value]) => ({
        label: key,
        value: value,
      })
    );

    return (
      <Box>
        {/* 🎯 HINDI PROFICIENCY CARD */}
        {hindiFields.length > 0 && (
          <SideColorCard color={color} sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 0,
              }}
            >
              <Avatar sx={{ bgcolor: color, mr: isMobile ? 0 : 2 }}>
                <Translate />
              </Avatar>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="600"
                color={color}
                sx={{ textAlign: isMobile ? "center" : "left" }}
              >
                Hindi Language Proficiency
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {/* Render Hindi fields in a grid (similar to your card style) */}
            <Grid container spacing={2}>
              {hindiFields.map((field, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ p: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="medium"
                    >
                      {field.label}:
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {field.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </SideColorCard>
        )}

        {/* 🎯 ALL OTHER LANGUAGES SECTION (Only render if languages array is not empty) */}
        {languages.length > 0 && (
          <SideColorCard color={color}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 0,
              }}
            >
              <Avatar sx={{ bgcolor: color, mr: isMobile ? 0 : 2 }}>
                <Translate />
              </Avatar>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="600"
                color={color}
                sx={{ textAlign: isMobile ? "center" : "left" }}
              >
                Other Languages
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={9}>
              {languages.map((languageDetails, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      width: "160px",
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(0, 0, 0, 0.02)",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: `${color}08`,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color={color}
                      gutterBottom
                    >
                      {languageDetails.Language || "Unknown Language"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Read:
                      </Typography>
                      <StatusChip
                        label={languageDetails.read || ""}
                        size="small"
                        status={safeLower(languageDetails.read)}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Write:
                      </Typography>
                      <StatusChip
                        label={languageDetails.write || ""}
                        size="small"
                        status={safeLower(languageDetails.write)}
                      />
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Speak:
                      </Typography>
                      <StatusChip
                        label={languageDetails.speak || ""}
                        size="small"
                        status={safeLower(languageDetails.speak)}
                      />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </SideColorCard>
        )}
      </Box>
    );
  };
  /**
   * Main section content renderer with error handling and loading states
   * @returns {JSX.Element} Rendered section content
   */
  const renderSectionContent = () => {
    if (!activeSection) return null;

    const currentSection = getCurrentSectionData();
    const sectionColor = sections.find((s) => s.id === activeSection)?.color;

    if (!currentSection || !currentSection.content) {
      const sectionError = error[activeSection];
      const sectionLoading = apiSectionLoading[activeSection];

      if (sectionError) {
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Alert
              severity="error"
              sx={{ mb: 2, "& .MuiAlert-message": { width: "100%" } }}
              action={
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={() =>
                    fetchSectionData(activeSection, form.employeeid)
                  }
                  disabled={sectionLoading}
                >
                  {sectionLoading ? <FancyCircularLoader size={16} /> : "Retry"}
                </Button>
              }
            >
              <Typography variant="body1" fontWeight="500">
                {sectionError}
              </Typography>
            </Alert>
          </Box>
        );
      }

      if (sectionLoading) {
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <FancyCircularLoader />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Loading {activeSection} data...
            </Typography>
          </Box>
        );
      }

      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No data available for this section
          </Typography>
        </Box>
      );
    }

    const sectionRenderers = {
      personal: renderCardSection,
      appointment: renderCardSection,
      contact: renderCardSection,
      education: renderTableSection,
      experience: renderTableSection,
      apar: renderTableSection,
      leave: renderTableSection,
      ltc: renderTableSection,
      officeorder: renderTableSection,
      travel: renderTableSection,
      claims: renderTableSection,
      dependents: renderCompactProfileSection,
      nominee: renderNomineeDetailsSection,
      language: renderLanguageWithHindiSection,
      documents: renderDocumentsSection,
    };

    const renderer = sectionRenderers[activeSection] || renderTableSection;
    return renderer ? renderer(currentSection, sectionColor) : null;
  };

  // ==========================================================================
  // VALIDATION FUNCTIONS
  // ==========================================================================

  /**
   * Validates access permissions for section access
   * @param {string} sectionId - Section identifier to validate
   * @returns {Object} Validation results with isValid flag and error details
   */
  const validateSectionAccess = (sectionId) => {
    const validationResults = {
      isValid: true,
      errors: [],
      missingFields: [],
    };

    // Check if role API failed
    if (roleApiFailed) {
      validationResults.isValid = false;
      validationResults.errors.push(
        "Role verification failed - contact administrator"
      );
      return validationResults;
    }

    // Check if user has E-File access
    if (!hasEfileAccess) {
      validationResults.isValid = false;
      validationResults.errors.push("Access denied to Employee E-File");
      return validationResults;
    }

    // Check if employee is selected
    if (!isEmployeeSelected()) {
      validationResults.isValid = false;
      validationResults.errors.push("Please select an Employee ID first");
      validationResults.missingFields.push("employeeid");
      return validationResults;
    }

    // Check if section is accessible for this role
    const accessibleSections = getAccessibleSections();
    if (!accessibleSections.some((section) => section.id === sectionId)) {
      validationResults.isValid = false;
      validationResults.errors.push(
        `Access denied to ${
          sections.find((s) => s.id === sectionId)?.label || sectionId
        } section`
      );
      return validationResults;
    }

    // Check required cookies and tokens
    const jwtToken = Cookies.get("HRToken");
    const sessionId = Cookies.get("session_id");
    const userRole = Cookies.get("selectedRole");

    if (!jwtToken) {
      validationResults.isValid = false;
      validationResults.errors.push("Authentication token missing");
      validationResults.missingFields.push("HRToken");
    }

    if (!sessionId) {
      validationResults.isValid = false;
      validationResults.errors.push("Session ID missing");
      validationResults.missingFields.push("session_id");
    }

    if (!userRole) {
      validationResults.isValid = false;
      validationResults.errors.push("User role not selected");
      validationResults.missingFields.push("selectedRole");
    }

    // Check screen/category access
    const section = sections.find((s) => s.id === sectionId);
    if (section && !hasCategoryAccess(section.apiCategory)) {
      validationResults.isValid = false;
      validationResults.errors.push(
        `Access denied to ${section.label} category`
      );
    }

    // Update overall validity based on errors
    validationResults.isValid = validationResults.errors.length === 0;

    return validationResults;
  };

  /**
   * Checks if user has access to specific category
   * @param {string} category - Category identifier
   * @returns {boolean} True if user has category access
   */
  const hasCategoryAccess = (category) => {
    if (!moduleList || moduleList.length === 0) return false;

    // Convert category to module name format for comparison
    const categoryModuleName = category.replace("details", "").toLowerCase();

    return moduleList.some(
      (module) =>
        module.module_name &&
        module.module_name.toLowerCase().includes(categoryModuleName)
    );
  };

  /**
   * Provides detailed access information for debugging purposes
   * @returns {Object} Comprehensive access details object
   */
  const getAccessDetails = () => {
    return {
      roleApiFailed,
      hasEfileAccess,
      employeeSelected: isEmployeeSelected(),
      employeeId: form.employeeid,
      jwtToken: !!Cookies.get("HRToken"),
      sessionId: !!Cookies.get("session_id"),
      userRole: Cookies.get("selectedRole"),
      accessibleSections: getAccessibleSections().map((s) => s.id),
      moduleList: moduleList.map((m) => m.module_name),
    };
  };

  // ==========================================================================
  // MAIN VIEW RENDERERS
  // ==========================================================================

  return (
    <>
      {currentPage === "dashboard" && renderDashboard()}
      {currentPage === "section" && renderSectionDetail()}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EmployeeEfile;
