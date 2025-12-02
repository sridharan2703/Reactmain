/**
 * @fileoverview Employee Visit Form component for handling permission cum relief requests.
 * Manages form data, validation, API interactions for saving drafts, submitting,
 * and generating previews for office orders related to employee visits.
 * @module EmployeeVisitForm
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @modifiedby Rovita
 * @modifiedon 21-11-2025
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import OfficeOrderPreview from "src/components/Process/PdfPreview.js";
import DropdownWithCheckboxes from "src/components/ui/DropdownWithCheckBox";
import Dropdown from "src/components/ui/Dropdown"; 
import Alerts from "src/components/ui/Alerts.js";
import TextEdit from "./TextEdit";
import Swal from "sweetalert2";
import { HostName } from "src/assets/host/Host";
import { HostName2 } from "src/assets/host/Host";
import FormSection from "src/components/ui/TopColorCard.js"; 
import { BackButton } from "src/components/ui/Button.js";
import RemarksAndActions from "src/components/Process/RemarksAndActions"; 
import {
  decryptData,
  encryptPayloadForGo,
  validateJsonData,
} from "src/components/Encryption/EncryptionKey";
import HeaderSection from "src/components/Process/HeaderSection";
import { Typography } from "@mui/material"; 
import EmployeeEfilePopup from "src/views/Menus/EmployeeFile/EmployeeEfilePopup";


const ACTIVITY_RESOURCES_ENDPOINT = "/ActivityResources";
const FILE_DOWNLOAD_ENDPOINT = `${HostName2}/FileDownload`; 
const TASK_DETAILS_ENDPOINT = "/OfficeOrder_taskvisitdetails";
const CC_ROLES_ENDPOINT = "/OfficeOrder_CcRoles"; 

const GenericFileViewerModal = ({ fileUrl, title, onClose, loading }) => {
  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(3px)",
    },
    modalContent: {
      width: "90%",
      height: "85%",
      maxWidth: "1200px",
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 28px",
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: "#F7F7F7",
    },
    modalTitle: { margin: 0, fontSize: "18px", fontWeight: "600" },
    closeButton: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      background: "#ef4444",
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
    },
    modalBody: {
      flex: 1,
      overflowY: "auto",
      padding: "0",
      background: "#f9fafb",
    },
    iframe: { width: "100%", height: "100%", border: "none" },
  };
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Activity Resource: {title}</h3>
          <button onClick={onClose} style={styles.closeButton}>
            ✕ Close
          </button>
        </div>
        <div style={styles.modalBody}>
          {loading ? (
            <Typography sx={{ p: 4 }}>Loading file content...</Typography>
          ) : (
            <iframe
              src={fileUrl}
              title={title}
              style={styles.iframe}
              frameBorder="0"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Strips non-English (non-ASCII) characters from the given text for safety and compatibility.
 * @param {string} text - The input text to process.
 * @returns {string} The processed text with non-ASCII characters removed.
 */
const stripNonEnglish = (text) => {
  if (typeof text !== "string") return text;
  return text.replace(/[^\x00-\x7F]/g, ""); // Basic ASCII filter for safety
};


/**
 * Formats a date string into an ISO timestamp with a specified hour and Indian timezone offset.
 * @param {string} dateStr - The date string in YYYY-MM-DD format.
 * @param {string} [hour="09:00:00"] - The hour in HH:MM:SS format to append.
 * @returns {string|null} The formatted ISO timestamp or null if input is invalid.
 */
const formatTimestamp = (dateStr, hour = "09:00:00") => {
  if (!dateStr || !dateStr.trim()) return null;
  const date = new Date(`${dateStr}T${hour}`);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}+05:30`;
};

/**
 * Calculates the duration in days between two dates, inclusive.
 * @param {string} from - The start date string.
 * @param {string} to - The end date string.
 * @returns {number} The calculated duration in days.
 */
const calculateDuration = (from, to) => {
  if (!from || !to) return 0;
  const diff = new Date(to) - new Date(from);
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Generates HTML for the "To" column based on form data.
 * @param {Object} formData - The form data object containing signing authority and employee details.
 * @returns {string} The formatted HTML string for the "To" column.
 */
const getToColumnHtml = (formData) => {
  const {
    department = "N/A Department",
    facultyname = "N/A Name",
    employeeid = "N/A",
  } = formData;
  return `<p><strong>To</strong><br>${facultyname} (ID No. ${employeeid})<br>Thro the Head, ${department}</p><p><strong>Sir,</strong></p>`;
};

/**
 * Main React component for the Employee Visit Form.
 * Handles form state, data fetching, validation, saving drafts, submission,
 * and preview generation for permission cum relief office orders.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} [props.onClose] - Callback function to close the form/modal.
 * @param {Object} [props.record] - Initial record data containing cover page number and employee ID.
 * @param {Function} [props.onSuccess] - Optional callback on successful submission.
 * @returns {JSX.Element} The rendered form component.
 */
const EmployeeVisitForm = ({ onClose, record, onSuccess }) => {
  const [formData, setFormData] = useState({
    employeeid: "",
    facultyname: "",
    department: "",
    designation: "",
    visitfrom: "",
    visitto: "",
    natureofparticipation_value: "",
    country: "",
    city: "",
    claimtype: "",
    signingAuthority: "",
    toSection: [],
    remarks: "",
    priority: "normal", // Added priority field
    leave: "",
  });

  const [bodyData, setBodyData] = useState({
    referenceNo: "",
    referenceDate: "",
    subject: "",
    refsubject: "",
    body: "",
    header: "",
    footer: "",
    template: "",
    orderNo: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [processId, setProcessId] = useState(1); // Default to 1 as per payload
  const [activityResources, setActivityResources] = useState([]);
  const [fileViewerData, setFileViewerData] = useState(null); // State for file viewer
  const [isEfilePopupOpen, setIsEfilePopupOpen] = useState(false);
  // FIX: New state to block spurious dirty updates after modal closes
  const [isClosingPreview, setIsClosingPreview] = useState(false);
  // NEW: State for individual field errors
  const [fieldErrors, setFieldErrors] = useState({});
  const [toSectionOptions, setToSectionOptions] = useState([]);
  const [ccRolesLoading, setCcRolesLoading] = useState(false);
  

  const getRecordField = (field) =>
    record && record[field] ? record[field] : undefined;
  const sessionId = Cookies.get("session_id");
  const empId = Cookies.get("EmpId");
  const userRole = Cookies.get("selectedRole");
  const jwtToken = Cookies.get("HRToken");

  // NEW: Function to fetch CC Roles from API
// NEW: Function to fetch CC Roles from API
const fetchCcRoles = useCallback(
  async (Employeeid) => {
    if (!sessionId || !Employeeid) {
      return;
    }

    setCcRolesLoading(true); // Start loading
    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");

      const payload = {
        token: "HRFGVJISOVp1fncC",
        P_id: sessionId,
        employee_id: Employeeid,
      };

      const encryptedPayload = await encryptPayloadForGo(payload);

      const response = await fetch(`${HostName}${CC_ROLES_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok) {
        throw new Error(`CC Roles API error: ${response.status}`);
      }

      const encryptedResponse = await response.json();
      const encryptedData = encryptedResponse?.Data ?? encryptedResponse?.data;

      if (!encryptedData) {
        throw new Error("Encrypted Data missing in CC Roles response.");
      }

      const decryptedObj = await decryptData(encryptedData);
      let parsedResponse;

      try {
        parsedResponse =
          typeof decryptedObj === "string"
            ? JSON.parse(decryptedObj)
            : decryptedObj;
      } catch (e) {
        throw new Error("Failed to parse CC roles response");
      }

      const records = parsedResponse?.Data?.Records || [];

      // Transform the API response to the required format
      const transformedOptions = records.map((record) => ({
        value: record.role_name,
        label: record.role_name,
      }));

      setToSectionOptions(transformedOptions);
    } catch (err) {
      // Show error message but don't set hardcoded options
      Swal.fire({
        title: "Warning",
        text: "Could not fetch To Section options. Please try again or contact support.",
        icon: "warning",
        timer: 3000,
        showConfirmButton: false,
      });
      // Keep the options array empty - this will show the dropdown as empty
      setToSectionOptions([]);
    } finally {
      setCcRolesLoading(false); // End loading
    }
  },
  [sessionId]
);

  // Refactored signing options for cleaner handling of placeholder
  const baseSigningOptions = useMemo(
    () => [
      { value: "Assistant Registrar", label: "Assistant Registrar" },
      { value: "Deputy Registrar", label: "Deputy Registrar" },
      { value: "Registrar", label: "Registrar" },
    ],
    []
  );

  const signingValue = useMemo(() => {
    if (!formData.signingAuthority || formData.signingAuthority.trim() === "") {
      //return { value: "", label: "Select Signing Authority" };
    }
    return (
      baseSigningOptions.find(
        (opt) => opt.value === formData.signingAuthority
      ) || {
        value: formData.signingAuthority,
        label: formData.signingAuthority,
      }
    );
  }, [formData.signingAuthority, baseSigningOptions]);

// NEW: Effect to fetch CC roles when employee ID is available
useEffect(() => {
  if (formData.employeeid && formData.employeeid.trim() !== "") {
    fetchCcRoles(formData.employeeid);
  }
}, [formData.employeeid, fetchCcRoles]);

  /**
   * Handles changes to the signing authority dropdown selection.
   * @param {string|object} selectedOption - The newly selected option string or object.
   */
  const handleSigningChange = (selectedOption) => {
    let finalValue = selectedOption;
    if (
      typeof selectedOption === "object" &&
      selectedOption !== null &&
      "value" in selectedOption
    ) {
      finalValue = selectedOption.value;
    }

    setFormData((prev) => ({ ...prev, signingAuthority: finalValue }));

    // Enhanced error handling
    if (!finalValue || finalValue.trim() === "") {
      // Set error when unselected or empty
      setFieldErrors((prev) => ({
        ...prev,
        signingAuthority: "Signing Authority is required",
      }));
    } else {
      // Clear error when a valid option is selected
      if (fieldErrors.signingAuthority) {
        setFieldErrors((prev) => ({ ...prev, signingAuthority: "" }));
      }
    }

    // FIX: Apply the safe check
    if (!isInitialLoad && !isClosingPreview) {
      setIsSavedSuccessfully(false);
    }
  };

  /**
   * Handles changes to the To Section dropdown (checkboxes).
   * @param {string[]} selected - Array of selected options.
   */
  const handleToSectionChange = (selected) => {
    setFormData((prev) => ({ ...prev, toSection: selected }));

    // Enhanced error handling
    if (!selected || selected.length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        toSection: "To Section is required",
      }));
    } else {
      if (fieldErrors.toSection) {
        setFieldErrors((prev) => ({ ...prev, toSection: "" }));
      }
    }

    if (!isInitialLoad && !isClosingPreview) {
      setIsSavedSuccessfully(false);
    }
  };

  /**
   * Creates a payload object for API requests based on the action type.
   * Configures submission type, roles, and HTML content for office order generation.
   * @param {string} actionType - The action type: 'saveasdraft', 'submit', or 'preview'.
   * @param {number} taskStatusId - The task status ID for workflow tracking.
   * @param {string} userRole - The user's role for assignment.
   * @returns {Object} The formatted payload object for the API.
   */
  const createPayload = (actionType, taskStatusId, userRole) => {
    let assignedRole, typeofsubmit;
    const currentInitiator = empId || "admin";

    if (actionType === "saveasdraft") {
      typeofsubmit = "draft";
      assignedRole = "Reviewer";
    } else if (actionType === "submit") {
      typeofsubmit = "submit";
      assignedRole = "Approver";
    } else if (actionType === "preview") {
      typeofsubmit = "preview";
      assignedRole = "WF_Initiator";
    }

    let toColumnValue = getToColumnHtml(formData);

    let signatureHtml = "";
    if (actionType === "submit" || actionType === "saveasdraft") {
      signatureHtml = formData.signingAuthority;
    }

    const processType = getRecordField("processtype")?.toLowerCase() || "PCR";
    const isAmendment = processType === "amendment";
    const isCancellation = processType === "cancellation";
    let orderType = "PCR"; // default
    if (isAmendment) {
      orderType = "AMENDMENT";
    } else if (isCancellation) {
      orderType = "CANCELLATION";
    }

    const originalOrderNo =
      isAmendment || isCancellation
        ? bodyData.orderNo || "" // Ensure non-null string is passed if amendment/cancellation
        : "";

    let apiPriority = formData.priority;
    if (apiPriority === "normal" || apiPriority === "") {
      apiPriority = "17"; // Default API ID for Normal Priority
    }

    return {
      token: "HRFGVJISOVp1fncC",
      session_id: sessionId,
      typeofsubmit,
      p_cover_page_no: record?.coverpageno || "",
      p_employee_id: formData.employeeid,
      p_employee_name: formData.facultyname,
      p_department: formData.department,
      p_designation: formData.designation,
      p_visit_from: formatTimestamp(formData.visitfrom, "09:00:00"),
      p_visit_to: formatTimestamp(formData.visitto, "09:00:00"),
      p_duration: calculateDuration(formData.visitfrom, formData.visitto),
      p_nature_of_visit: formData.natureofparticipation_value,
      p_claim_type: formData.claimtype,
      p_city_town: formData.city,
      p_country: formData.country,
      p_header_html: bodyData.header || "",
      p_order_no: bodyData.referenceNo || "",
      p_order_date:
        bodyData.referenceDate || new Date().toISOString().split("T")[0],
      p_to_column: toColumnValue,
      p_subject: bodyData.subject || "",
      p_reference: bodyData.refsubject || "",
      p_body_html: bodyData.body || "",
      p_signature_html: signatureHtml, // Using raw string value (e.g., "Registrar")
      p_cc_to: Array.isArray(formData.toSection)
        ? formData.toSection.join(",")
        : formData.toSection || "",
      p_footer_html: bodyData.footer || "",
      p_task_status_id: taskStatusId,
      p_activity_seq_no: 1,
      p_is_task_return: false,
      p_is_task_approved: actionType === "submit",
      p_initiated_by: currentInitiator,
      p_initiated_on: new Date().toISOString(),
      p_updated_by: currentInitiator,
      // p_updated_on: new Date().toISOString().replace("Z", "+05:30"),
      p_updated_on: new Date().toISOString(),
      p_process_id: processId || 1,
      p_remarks: formData.remarks,
      p_priority: apiPriority, // FIX: Use the resolved API priority value
      p_email_flag: false,
      p_reject_flag: 0,
      p_user_role: userRole,
      p_order_type: orderType, // Will be AMENDMENT, CANCELLATION, or PCR
      p_original_order_no: originalOrderNo, // Will be the orderNo field or ""
    };
  };

  /**
   * Fetch Task Details to get process_id and task_id using the provided API.
   * Returns the fetched values for immediate use.
   * @param {string} coverpageno - The cover page number.
   * @param {string} employeeid - The employee ID.
   * @param {boolean} [isPostSave=false] - Flag to indicate if called after save.
   * @returns {Promise<{taskId: string|null, processId: number}>}
   */
  const fetchTaskDetails = useCallback(
    async (coverpageno, employeeid, isPostSave = false) => {
      if (!sessionId || !coverpageno || !employeeid) {
        return { taskId: null, processId: 1 };
      }
      try {
        const jwtToken = Cookies.get("HRToken");
        if (!jwtToken) throw new Error("Authentication token missing.");

        const taskDetailsPayload = {
          P_id: sessionId,
          coverpageno,
          employeeid,
          token: "HRFGVJISOVp1fncC",
        };

        const encryptedPayload = await encryptPayloadForGo(taskDetailsPayload);

        const response = await fetch(
          `${HostName}${TASK_DETAILS_ENDPOINT}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ Data: encryptedPayload }),
          }
        );

        if (!response.ok) {
          throw new Error(`Task Details API error: ${response.status}`);
        }

        const encryptedResponse = await response.json();
        const encryptedData =
          encryptedResponse?.Data ?? encryptedResponse?.data;
        if (!encryptedData)
          throw new Error("Encrypted Data missing in TaskDetails response.");

        const decryptedObj = await decryptData(encryptedData);
        let parsedResponse;
        try {
          parsedResponse =
            typeof decryptedObj === "string"
              ? JSON.parse(decryptedObj)
              : decryptedObj;
        } catch (e) {

          throw new Error("Failed to parse task details response");
        }

        const responseData =
          parsedResponse?.Data?.Records?.[0] || parsedResponse;
        const fetchedProcessId = responseData?.process_id || 1;
        const fetchedTaskId = responseData?.task_id;

        if (fetchedTaskId) {
          setTaskId(fetchedTaskId);
        }
        if (fetchedProcessId) {
          setProcessId(fetchedProcessId);
        }

        return {
          taskId: fetchedTaskId || null,
          processId: fetchedProcessId || 1,
        };
      } catch (err) {
        if (isPostSave) {
          setProcessId(1);
        } else {
          setError("Failed to fetch task details.");
        }
        return { taskId: null, processId: 1 };
      }
    },
    [sessionId, jwtToken]
  );

  /**
   * Fetch Activity Resources securely from the API.
   */
  const fetchActivityResources = useCallback(async () => {
    const processId = getRecordField("ProcessId") || 1;
    const activityId = getRecordField("ActivityId") || 1;
    const pId = sessionId;

    try {
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!sessionId) throw new Error("Session ID missing.");

      const rawPayload = {
        token: "HRFGVJISOVp1fncC",
        P_id: pId, // Correctly using sessionId for P_id
        ProcessId: processId,
        ActivityId: activityId,
        session_id: sessionId,
      };

      const encryptedPayload = await encryptPayloadForGo(rawPayload);

      const response = await fetch(
        `${HostName2}${ACTIVITY_RESOURCES_ENDPOINT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ Data: encryptedPayload }),
        }
      );

      if (!response.ok)
        throw new Error(`ActivityResources API error: ${response.status}`);

      const encryptedResponse = await response.json();
      const encryptedData = encryptedResponse?.Data ?? encryptedResponse?.data;
      if (!encryptedData)
        throw new Error(
          "Encrypted Data missing in ActivityResources response."
        );

      const decryptedObj = await decryptData(encryptedData);
      const parsed =
        typeof decryptedObj === "string"
          ? JSON.parse(decryptedObj)
          : decryptedObj;

      const records = parsed?.Data?.Records ?? [];
      setActivityResources(records);
    } catch (err) {
    }
  }, [sessionId, getRecordField, jwtToken]);

  /**
   * Helper function to find a resource by its type.
   * @param {string} type - The resource_type (e.g., 'guidelines', 'video').
   * @returns {Object|null} The resource object or null.
   */
  const findResource = useCallback(
    (type) => {
      return (
        activityResources.find(
          (res) => res.resource_type?.toLowerCase() === type.toLowerCase()
        ) || null
      );
    },
    [activityResources]
  );

  /**
   * Handles the secure file download via a dedicated API endpoint.
   * Modififed to show file in an iframe instead of downloading.
   * @param {Object} resource - The resource object with file_name and file_path.
   */
  const downloadFileHandler = useCallback(
    async (resource) => {
      setLoading(true);
      setFileViewerData(null); // Clear previous viewer data

      let urlToRevoke = null;
      try {
        const rawPayload = {
          file_name: resource.file_name,
          file_path: resource.file_path,
          token: "HRFGVJISOVp1fncC",
          Session_id: sessionId, // Use Session_id as per API spec
        };

        const encryptedPayload = await encryptPayloadForGo(rawPayload);

        const response = await fetch(FILE_DOWNLOAD_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ Data: encryptedPayload }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMsg = `View File failed: ${response.status}.`;
          try {
            const errorJson = JSON.parse(errorText);
            errorMsg = errorJson.message || errorText;
          } catch {
            errorMsg = errorText;
          }
          throw new Error(errorMsg);
        }

        const blob = await response.blob();
        const mimeType =
          response.headers.get("Content-Type") || "application/octet-stream";
        const finalBlob = new Blob([blob], { type: mimeType });
        urlToRevoke = window.URL.createObjectURL(finalBlob);

        setFileViewerData({
          url: urlToRevoke,
          title: resource.title || resource.file_name,
          type: mimeType,
        });
      } catch (viewError) {
        if (urlToRevoke) window.URL.revokeObjectURL(urlToRevoke);
        Swal.fire({
          title: "View File Failed",
          text: `Could not retrieve the file: ${viewError.message}`,
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [sessionId, jwtToken]
  );

  const createResourceHandler = useCallback(
    (type) => () => {
      const resource = findResource(type);
      if (!resource) {
        Swal.fire({
          title: "No Resource Found",
          text: `No resource of type '${type}' is available for this activity.`,
          icon: "info",
        });
        return;
      }

      if (resource.file_name && resource.file_path) {
        downloadFileHandler(resource);
      } else if (resource.content) {
        Swal.fire({
          title: resource.title || `${type} Content`,
          html: `<div style="max-height: 400px; overflow-y: auto; text-align: left; padding: 10px; border: 1px solid #ccc; background-color: #f9f9f9;">${resource.content}</div>`,
          icon: "info",
          width: 600,
        });
      }
    },
    [findResource, downloadFileHandler]
  );

  const handleEFile = () => {
    const currentEmployeeId =
      formData.employeeid || // if stored in form state
      selectedEmployeeId || // if stored in separate state
      getEmployeeIdFromContext(); // if from context

    setSelectedEmployeeId(currentEmployeeId);
    setIsEfilePopupOpen(true);
  };

  const handleCloseEfilePopup = () => {
    setIsEfilePopupOpen(false);
    setSelectedEmployeeId("");
  };

  const headerHandlers = useMemo(
    () => ({
      onGuidelinesClick: createResourceHandler("guidelines"),
      onVideoClick: createResourceHandler("video"),
      onHelDocClick: createResourceHandler("helpdoc"),
      onFlowchartClick: createResourceHandler("flowchart"),
      onEfileClick: handleEFile, // Use the popup handler for E-File
    }),
    [createResourceHandler, handleEFile]
  );

  /**
   * Fetch data with optional processtype
   */
  const fetchAllData = async (coverpageno, employeeid) => {
    setLoading(true);
    setError("");
    try {
      const jwtToken = Cookies.get("HRToken");
      const sessionId = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!employeeid) throw new Error("Employee ID missing.");
      if (!coverpageno) throw new Error("Cover page number missing.");

      const requestBody = {
        employeeid,
        coverpageno,
        session_id: sessionId,
        token: "HRFGVJISOVp1fncC",
      };

      const processtype = getRecordField("processtype");
      if (processtype) requestBody.processtype = processtype;

      const encryptedPayload = await encryptPayloadForGo(requestBody);

      const apiUrl = `${HostName}/OfficeOrder_datatemplate`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok)
        throw new Error(`Failed to fetch data: ${response.status}`);

      const encryptedData = await response.json();
      const encryptedPayloadData = encryptedData?.Data ?? encryptedData?.data;

      if (!encryptedPayloadData) throw new Error("Encrypted Data missing");

      const decryptedString = await decryptData(encryptedPayloadData);
      let parsedData;
      try {
        parsedData = validateJsonData(decryptedString)
          ? JSON.parse(decryptedString)
          : decryptedString;
      } catch {
        parsedData = decryptedString;
      }

      if (!parsedData?.Data?.Records?.length) {
        throw new Error("No records found in API response");
      }

      const record = parsedData.Data.Records[0];
      const formatDate = (dateValue) => {
  if (!dateValue) return "";
  
  // Handle DD-MM-YYYY format (from API)
  if (typeof dateValue === 'string' && dateValue.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [day, month, year] = dateValue.split('-');
    return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD for input[type="date"]
  }
  
  // Handle other date formats
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

      const formatHtmlTable = (htmlString) => {
        if (!htmlString || typeof htmlString !== "string") return htmlString;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString;
        const table = tempDiv.querySelector("table");
        if (!table) return htmlString;

        const rows = Array.from(table.querySelectorAll("tr"));
        let bodyRowsHtml = "";

        const cleanDate = (str) => {
          if (!str) return "";
          const match = str.match(/(\d{4}-\d{2}-\d{2})/);
          return match ? match[1] : str.trim();
        };

        const looksLikeDate = (str) => /(\d{4}-\d{2}-\d{2})/.test(str);
        let startIndex = 0;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const text = row.textContent.trim().toLowerCase();
          const cells = Array.from(row.querySelectorAll("td, th"));

          const isHeaderText =
            (text.includes("leave type") &&
              text.includes("from") &&
              text.includes("to")) ||
            cells.every((cell) => {
              const cellText = cell.textContent.trim().toLowerCase();
              return (
                cellText === "leave type" ||
                cellText === "from" ||
                cellText === "to"
              );
            });

          if (isHeaderText) {
            startIndex = i + 1;
            continue;
          }

          if (cells.length >= 3) {
            const hasData = cells.some((cell) => {
              const cellText = cell.textContent.trim();
              return (
                cellText &&
                !cellText.toLowerCase().includes("leave type") &&
                !cellText.toLowerCase().includes("from") &&
                !cellText.toLowerCase().includes("to")
              );
            });
            if (hasData) {
              startIndex = i;
              break;
            }
          }
        }

        for (let i = startIndex; i < rows.length; i++) {
          const cells = Array.from(rows[i].querySelectorAll("td, th"));
          if (cells.length < 3) continue;

          let leaveType = cells[0]?.textContent.trim() || "";
          let fromDate = cleanDate(cells[1]?.textContent.trim() || "");
          let toDate = cleanDate(cells[2]?.textContent.trim() || "");

          if (
            looksLikeDate(leaveType) &&
            !looksLikeDate(fromDate) &&
            fromDate
          ) {
            const temp = leaveType;
            leaveType = fromDate;
            fromDate = cleanDate(temp);
          }

          if (leaveType || fromDate || toDate) {
            bodyRowsHtml += `
            <tr>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${leaveType}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${fromDate}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${toDate}</td>
            </tr>
          `;
          }
        }

        const newTableHtml = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">Leave Type</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">From</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">To</th>
            </tr>
          </thead>
          <tbody>
            ${
              bodyRowsHtml ||
              '<tr><td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: center;">-</td></tr>'
            }
          </tbody>
        </table>
      `;

        table.outerHTML = newTableHtml;
        return tempDiv.innerHTML;
      };

      setFormData((prev) => ({
        ...prev,
        employeeid: record.Employeeid || "",
        facultyname: record.Employeename || "",
        department: record.Department || "",
        designation: record.Designation || "",
        visitfrom: formatDate(record.VisitFrom),
        visitto: formatDate(record.VisitTo),
        natureofparticipation_value: record.NatureOfVisit || "",
        country: record.Country?.trim() || "",
        city: record.CityTown || "",
        claimtype: record.ClaimType || "",
        signingAuthority: "",
        toSection: [],
        remarks: "",
        priority: record.Priority || "normal", // Set Priority from fetched data
      }));

      const destination = record.Country || "";
      let processedSubject = (record.Subject || "").replace(
        /\{\{\.Destination\}\}/g,
        destination
      );
      const referenceText = record.Reference || "";

      setBodyData((prev) => ({
        ...prev,
        referenceNo: record.ReferenceNumber || "",
        orderNo: record.OrderNo || "",
        referenceDate: record.ReferenceDate || "",
        subject: stripNonEnglish(processedSubject),
        refsubject: referenceText,
        body: formatHtmlTable(record.Body || ""),
        header: record.Header || "",
        footer: record.Footer || "",
        template: stripNonEnglish(record.filled_template || ""),
      }));

      setTaskId(record.p_id || null);
      setIsSavedSuccessfully(true);
      setPreviewCoverPageNo(coverpageno);
      setSelectedEmployeeId(employeeid);

      if (record.Employeeid) {
        fetchCcRoles(record.Employeeid);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (isInitialLoad && record?.coverpageno && record?.employeeid) {
        setLoading(true);
        await fetchAllData(record.coverpageno, record.employeeid);
        await fetchActivityResources();

        setIsInitialLoad(false);
        setLoading(false);
      }
    };
    initializeData();
  }, [record, sessionId, isInitialLoad, fetchActivityResources]); // Added fetchActivityResources dependency

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // FIX: Only set dirty flag if NOT in the short blocking window
    if (!isInitialLoad && !isClosingPreview) setIsSavedSuccessfully(false);

    // NEW: Clear error for the field being changed
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));

    if (type === "checkbox") {
      setFormData((prev) => {
        const current = Array.isArray(prev.toSection) ? prev.toSection : [];
        const updated = checked
          ? [...current, value]
          : current.filter((v) => v !== value);
        // FIX: Also need to check if value actually changes for checkboxes to prevent dirty state on remount
        if (
          !isInitialLoad &&
          !isClosingPreview &&
          JSON.stringify(current.sort()) === JSON.stringify(updated.sort())
        ) {
          return prev;
        }
        if (!isInitialLoad && !isClosingPreview) setIsSavedSuccessfully(false);
        // NOTE: Error clearing/setting for toSection is handled in the dedicated handleToSectionChange
        return { ...prev, toSection: updated };
      });
    } else if (
      [
        "referenceNo",
        "referenceDate",
        "subject",
        "refsubject",
        "body",
        "header",
        "footer",
        "template",
        "orderNo",
      ].includes(name)
    ) {
      setBodyData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
 /**
   * Validates the form data.
   * @param {boolean} isDraft - If true, Remarks validation is skipped.
   */
  const validateForm = (isDraft = false) => {
    const validationErrors = {}; 
    const invalidFields = [];

    const processType = getRecordField("processtype");
    const isAmendment = processType === "amendment";
    const isCancellation = processType === "cancellation";

    // 1. Define base required fields (always required for consistency in this form)
    const requiredFields = {
      signingAuthority: "Signing Authority",
      toSection: "To Section",
    };

    // 2. Add Remarks ONLY for Submit (NOT for Draft)
    if (!isDraft) {
      requiredFields.remarks = "Remarks";
    }

    if ((isAmendment || isCancellation) && !isDraft) {
      if (!bodyData.orderNo?.trim()) {
        validationErrors.orderNo =
          "Original Order No. is required for amendment/cancellation.";
      }
    }

    // Validate the defined required fields
    for (const [key, label] of Object.entries(requiredFields)) {
      const value = formData[key];
      if (
        !value ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && !value.trim())
      ) {
        validationErrors[key] = `${label} is required.`;
      }
    }

    setFieldErrors(validationErrors);

    const allErrors = [
      ...Object.values(validationErrors).filter((m) => m.includes("required")),
      ...invalidFields,
    ];

    if (allErrors.length > 0) {
      const uniqueMessages = Array.from(new Set(allErrors.filter(Boolean)));
      const msg = uniqueMessages.join(". ");
      setError(msg);
      Swal.fire({
        title: "Required Fields are Missing",
        text: msg, // Show specific missing fields
        icon: "warning",
      });
      return false;
    }

    setError("");
    return true;
  };

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!validateForm(true)) return;

    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");

      const taskStatusId = 6;
      const reqpayload = createPayload("saveasdraft", taskStatusId, userRole);
      const encryptedPayload = await encryptPayloadForGo(reqpayload);

      const response = await fetch(
        `${HostName}/OfficeOrder_InsertOfficedetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ Data: encryptedPayload }),
        }
      );

      if (!response.ok) throw new Error("Failed to insert Office Order");

      const encryptedResponse = await response.json();
      if (encryptedResponse?.Data || encryptedResponse?.data) {
        const encryptedPayloadData =
          encryptedResponse?.Data ?? encryptedResponse?.data;
        const decryptedObj = await decryptData(encryptedPayloadData);
        let parsedResponse;
        try {
          parsedResponse =
            typeof decryptedObj === "string"
              ? JSON.parse(decryptedObj)
              : decryptedObj;
        } catch (e) {
      
        }
        const newTaskId = parsedResponse?.task_id;
        if (newTaskId) {
          setTaskId(newTaskId);
        }
      }

      await fetchTaskDetails(record?.coverpageno, formData.employeeid, true);
      setIsSavedSuccessfully(true);

      await Swal.fire({
        title: "Saved!",
        text: "The task has been saved as a draft successfully. You may now view the preview.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      
      setError(err.message || "Failed to insert Office Order");
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to save as draft",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
 * Validates only the three required fields for submission
 * @returns {boolean} True if all required fields are valid
 */
const validateRequiredFieldsForSubmit = () => {
  const errors = {};

  // Check Signing Authority
  if (!formData.signingAuthority || formData.signingAuthority.trim() === "") {
    errors.signingAuthority = "Signing Authority is required";
  }

  // Check To Section
  if (!formData.toSection || formData.toSection.length === 0) {
    errors.toSection = "To Section is required";
  }

  // Check Remarks
  if (!formData.remarks || formData.remarks.trim() === "") {
    errors.remarks = "Remarks are required";
  }

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};

  /**
   * Handles form submission after validation with encrypted payload.
   * Submits to API and closes the form on success.
   * @param {Object} [e] - Optional event object to prevent default.
   */
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Validate only the three required fields for submission
    if (!validateRequiredFieldsForSubmit()) {
      // Create a detailed error message listing ALL missing fields
      const missingFields = [];

      if (fieldErrors.signingAuthority) missingFields.push("Signing Authority");
      if (fieldErrors.toSection) missingFields.push("To Section");
      if (fieldErrors.remarks) missingFields.push("Remarks");

      let errorMessage = "";

      // 1] If all three required fields are missing
      if (missingFields.length === 3) {
        errorMessage =
          "All required fields are missing: Signing Authority, To Section, and Remarks";
      }
      // 2] If any field(s) is missing
      else if (missingFields.length > 0) {
        errorMessage = `${missingFields.join(", ")}`;
      }

      setError(errorMessage);
      Swal.fire({
        title: "Required Fields Missing",
        text: errorMessage,
        icon: "warning",
      });
      return;
    }

    // If basic required fields are valid, then do full form validation
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");

      const taskStatusId = 4; // Assuming 4 is Approved/Submitted for this flow.
      const requestpayload = createPayload("submit", taskStatusId, userRole);
      const encryptedPayload = await encryptPayloadForGo(requestpayload);

      const response = await fetch(
        `${HostName}/OfficeOrder_InsertOfficedetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ Data: encryptedPayload }),
        }
      );

      if (!response.ok) throw new Error("Failed to insert Office Order");

      const encryptedResponse = await response.json();
      if (encryptedResponse?.Data || encryptedResponse?.data) {
        const encryptedPayloadData =
          encryptedResponse?.Data ?? encryptedResponse?.data;
        const decryptedObj = await decryptData(encryptedPayloadData);
        let parsedResponse;
        try {
          parsedResponse =
            typeof decryptedObj === "string"
              ? JSON.parse(decryptedObj)
              : decryptedObj;
        } catch (e) {
        
        }
        const newTaskId = parsedResponse?.task_id;
        if (newTaskId) {
          setTaskId(newTaskId);
        }
      }

      setLoading(false);
      setIsSavedSuccessfully(true);

      await Swal.fire({
        title: "Submitted!",
        text: "The task has been submitted successfully. Returning to previous page.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

      onClose?.(true);
    } catch (err) {

      setError(err.message || "Failed to insert Office Order");
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to insert Office Order",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles preview generation after ensuring a draft is saved.
   * Uses the OfficeOrderPreview component directly with local form and body data.
   */
  const handlePreview = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Pre-check for Signing Authority, though validateForm handles it too
    if (!formData.signingAuthority) {
      setError("Please select a Signing Authority before generating preview.");
      Swal.fire({
        title: "Mandatory fields are missing",
        text: "Please select a Signing Authority before generating preview.",
        icon: "warning",
      });
      // Set field error for visual feedback
      setFieldErrors((prev) => ({
        ...prev,
        signingAuthority: "Signing Authority is required for Preview.",
      }));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, signingAuthority: "" })); // Clear error if check passes

    setLoading(true);
    setError("");

    try {
      let currentTaskId = taskId;
      let currentProcessId = processId || 1;
      const session_id = Cookies.get("session_id");
      if (!currentTaskId) {
  const { taskId: fetchedTaskId, processId: fetchedProcessId } =
          await fetchTaskDetails(
            record.coverpageno,
            formData.employeeid,
            false
          );

        if (!fetchedTaskId) {
          throw new Error(
            "Unable to retrieve Task ID. Please save as draft first."
          );
        }

        currentTaskId = fetchedTaskId;
        currentProcessId = fetchedProcessId;
      }

      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        task_id: currentTaskId,
        process_id: currentProcessId,
        status: "draft",
        templatetype: "draft",
        P_id: session_id,
      };

      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);
      const requestBody = { Data: encryptedPayload };
      setPreviewData({ requestBody });
      setShowPreview(true);
    } catch (err) {
      const errorMessage =
        err.message ||
        "An unexpected error occurred while generating the preview.";
      setError(errorMessage);
      Swal.fire({
        title: "Preview Error",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Closes the preview modal and re-asserts the successful save state.
   */
  const handleClosePreview = () => {
    // FIX 1: Set a flag to block spurious onChange events
    setIsClosingPreview(true);

    // 2. Close the modal
    setShowPreview(false);
    setPreviewData(null);

    // 3. Explicitly re-assert the successful save state.
    setIsSavedSuccessfully(true);

    // 4. Reset the flag after a short delay to allow form re-render to complete safely
    setTimeout(() => {
      setIsClosingPreview(false);
    }, 50);
  };

  /**
   * Handles back navigation by calling the onClose callback.
   */
  const handleBack = () => onClose?.(false);

  /**
   * Closes the file viewer modal and revokes the URL.
   */
  const handleCloseFileViewer = useCallback(() => {
    if (fileViewerData?.url) {
      window.URL.revokeObjectURL(fileViewerData.url); // Revoke the created URL
    }
    setFileViewerData(null);
  }, [fileViewerData]);

  const getEmployeeIdFromContext = () => {
    return formData.employeeid || "";
  };

  if (loading && isInitialLoad)
    return <div style={loadingStyle}>Loading employee data...</div>;

  if (fileViewerData?.url) {
    return (
      <GenericFileViewerModal
        fileUrl={fileViewerData.url}
        title={fileViewerData.title}
        onClose={handleCloseFileViewer}
        loading={loading}
      />
    );
  }

  if (showPreview && previewData) {
    return (
      <OfficeOrderPreview
        requestBody={previewData.requestBody}
        onBack={handleClosePreview}
      />
    );
  }

  return (
    <div style={cardStyle}>
      {/* 🔹 Header Wrapper (BackButton slightly raised) */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <div
          style={{
            position: "absolute",
            top: "-50px", // adjust upward movement
            left: "0",
            zIndex: 2,
          }}
        >
          <BackButton onClick={handleBack} />
        </div>
        {/* Pass handlers to HeaderSection (removed unused props like type, open, etc.) */}
        <HeaderSection title="Permission Cum Relief" {...headerHandlers} />
      </div>

      <EmployeeEfilePopup
        type="efile"
        open={isEfilePopupOpen}
        onClose={handleCloseEfilePopup}
        employeeId={selectedEmployeeId}
        userRole={userRole}
        sessionId={sessionId}
      />

      {error && <Alerts type="error" variant="outlined" message={error} />}

      <form onSubmit={handleSubmit}>
        {/* Employee Info */}
        <FormSection>
          <h3 style={sectionHeadingStyle}>Employee Information</h3>
          {/* Row 1: Employee ID, Name, Dept, Desig */}
          <div style={gridRowStyle}>
            <TextField
              label="Employee ID"
              name="employeeid"
              value={formData.employeeid}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Employee Name"
              name="facultyname"
              value={formData.facultyname}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
          </div>

          {/* Row 2: Nature, Visit From, Visit To, Country */}
          <div style={gridRowStyle}>
            <TextField
              label="Nature of Visit"
              name="natureofparticipation_value"
              value={formData.natureofparticipation_value}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth

            />
            <TextField
              type="date"
              label="Visit From"
              name="visitfrom"
              value={formData.visitfrom}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              type="date"
              label="Visit To"
              name="visitto"
              value={formData.visitto}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
          </div>

          {/* Row 3: City/Town (1 column) */}
          <div style={gridRowStyle}>
            <TextField
              label="City/Town"
              name="city"
              value={formData.city}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            {/* Claim Type hidden field */}
            <TextField
              label="Claim Type"
              name="claimtype"
              value={formData.claimtype}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              sx={{ display: "none" }}
            />
            <div></div> {/* Filler */}
            <div></div> {/* Filler */}
            <div></div> {/* Filler */}
          </div>
        </FormSection>

        {/* Office Order Details */}
        <FormSection>
          <h3 style={sectionHeadingStyle}>Office Order Details</h3>

          {/* Hidden Header/Footer fields */}
          <TextField
            label="Header"
            name="header"
            value={bodyData.header || ""}
            variant="outlined"
            fullWidth
            sx={{ display: "none" }}
          />
          <TextField
            label="Reference Number"
            name="referenceNo"
            value={bodyData.referenceNo}
            onChange={handleChange}
            InputProps={{ readOnly: true }}
            variant="outlined"
            fullWidth
            sx={{ display: "none" }}
          />
          <TextField
            label="Reference Date"
            name="referenceDate"
            value={bodyData.referenceDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
            sx={{ display: "none" }}
          />

          {/* Subject and Ref in one row (2 columns) */}
          <div style={gridRowTwoColumnStyles}>
            <TextField
              label="Subject"
              name="subject"
              value={bodyData.subject}
              onChange={handleChange}
              //  InputProps={{ readOnly: true }}
              InputProps={{
                readOnly:
                  getRecordField("processtype")?.toLowerCase() !==
                    "amendment" &&
                  getRecordField("processtype")?.toLowerCase() !==
                    "cancellation",
              }}
              variant="outlined"
              fullWidth
              multiline
              rows={1}
              error={!!fieldErrors.subject}
              helperText={fieldErrors.subject}
            />
            {/* Using TextField equivalent structure for Ref for consistent height */}
            <TextField
              label="Ref"
              name="refsubject"
              value={bodyData.refsubject || ""}
              //  InputProps={{ readOnly: true }}
              InputProps={{
                readOnly:
                  getRecordField("processtype")?.toLowerCase() !==
                    "amendment" &&
                  getRecordField("processtype")?.toLowerCase() !==
                    "cancellation",
              }}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              multiline
              rows={1}
              error={!!fieldErrors.refsubject}
              helperText={fieldErrors.refsubject}
            />
          </div>

          {/* Body (Full width) */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Body</label>
            <TextEdit
              value={bodyData.body}
              onChange={(value) => {
                setBodyData((prev) => ({ ...prev, body: value }));
                // FIX: Apply the safe check
                if (!isInitialLoad && !isClosingPreview) {
                  setIsSavedSuccessfully(false);
                }
                // NEW: Clear error
                setFieldErrors((prev) => ({ ...prev, body: "" }));
              }}
            />
            {/* Manual helper text display for TextEdit Mandatory fields are missing */}
            {fieldErrors.body && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {fieldErrors.body}
              </Typography>
            )}
          </div>
          <br />

          {/* Signing Authority and TO Section side by side */}
          <div style={gridRowTwoColumnStyles}>
            <div>
              <Dropdown
                label="Signing Authority *"
                options={[
                  // { value: "", label: "Select Signing Authority" },
                  ...baseSigningOptions,
                ]}
                value={signingValue}
                onChange={handleSigningChange}
                error={!!fieldErrors.signingAuthority}
                helperText={fieldErrors.signingAuthority}
              />
            </div>
            <div>
<DropdownWithCheckboxes
  label="To Section *"
  options={toSectionOptions}
  value={formData.toSection}
  onChange={handleToSectionChange}
  error={!!fieldErrors.toSection}
  helperText={fieldErrors.toSection}
  loading={ccRolesLoading} // Pass loading state
  placeholder={ccRolesLoading ? "Loading options..." : "Select options"}
/>
            </div>
          </div>
          <br />
        </FormSection>

        {/* Separate Section for Remarks and Actions */}
        <FormSection>
          <h3 style={sectionHeadingStyle}>Remarks and Actions</h3>
          <RemarksAndActions
            remarks={formData.remarks}
            onRemarksChange={(value) => {
              setFormData((prev) => ({ ...prev, remarks: value }));
              // FIX: Apply the safe check
              if (!isInitialLoad && !isClosingPreview) {
                setIsSavedSuccessfully(false);
              }
              // Enhanced error handling for remarks
              if (!value || value.trim() === "") {
                // Set error when remarks are empty
                setFieldErrors((prev) => ({
                  ...prev,
                  remarks: "Remarks are required",
                }));
              } else {
                // Clear error when remarks are filled
                if (fieldErrors.remarks) {
                  setFieldErrors((prev) => ({ ...prev, remarks: "" }));
                }
              }
            }}
            priority={formData.priority}
            onPriorityChange={(value) => {
              setFormData((prev) => ({ ...prev, priority: value }));
              // FIX: Apply the safe check
              if (!isInitialLoad && !isClosingPreview) {
                setIsSavedSuccessfully(false);
              }
              // NEW: Clear error
              setFieldErrors((prev) => ({ ...prev, priority: "" }));
            }}
            onSave={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              handleSave(e);
            }}
            onSubmit={handleSubmit}
            onPreview={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              handlePreview(e);
            }}
            isSavedSuccessfully={isSavedSuccessfully}
            loading={loading}
            initiator={true}
            // Pass errors to RemarksAndActions component if it supports them
            remarksError={fieldErrors.remarks}
          />
        </FormSection>
      </form>
    </div>
  );
};

/* ---------- STYLES (Refined for Consistency) ---------- */
const cardStyle = {
  width: "100%",
  maxWidth: "2000px",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  marginTop: "20px",
};

const headingStyle = {
  marginBottom: "24px",
  color: "rgb(107, 114, 128)",
  fontSize: "24px",
  fontWeight: "600",
};

const sectionHeadingStyle = {
  marginBottom: "16px",
  fontSize: "18px",
  fontWeight: "600",
  color: "#374151",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "500",
  color: "#374151",
};

const gridRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
  marginBottom: "16px",
};

const gridRowTwoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(1, 1fr)",
  gap: "16px",
  marginBottom: "16px",
};

const gridRowTwoColumnStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)", // Changed to 2fr here for Subject/Ref
  gap: "16px",
  marginBottom: "16px",
  width: "100%",
};

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "18px",
  color: "#6B7280",
};

export default EmployeeVisitForm;
