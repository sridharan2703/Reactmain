/**
 * @fileoverview Component for viewing, editing, submitting, or deleting a previously saved Office Order draft ("Save and Hold" task).
 * Manages form data, validation, API interactions for saving drafts, submitting, deleting,
 * and generating previews for office orders related to employee visits.
 * @module SaveandHold
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
import Alerts from "src/components/ui/Alerts.js";
import TextEdit from "./TextEdit";
import Swal from "sweetalert2";
import { HostName } from "src/assets/host/Host";
import { HostName2 } from "src/assets/host/Host";
import DropdownWithCheckboxes from "src/components/ui/DropdownWithCheckBox";
import Dropdown from "src/components/ui/Dropdown";
import FormSection from "src/components/ui/TopColorCard.js";
import { BackButton } from "src/components/ui/Button.js";
import RemarksAndActions from "src/components/Process/RemarksAndActions";
import {
  sendEncryptedData,
  decryptData,
  encryptPayloadForGo,
  validateJsonData,
} from "src/components/Encryption/EncryptionKey";
import HeaderSection from "src/components/Process/HeaderSection";
import { Typography, Box } from "@mui/material";
import EmployeeEfilePopup from "src/views/Menus/EmployeeFile/EmployeeEfilePopup";
const ACTIVITY_RESOURCES_ENDPOINT = "/ActivityResources";
const FILE_DOWNLOAD_ENDPOINT = `${HostName2}/FileDownload`;
/**
 * A modal component for displaying a file (typically PDF) downloaded from the activity resources.
 *
 * @param {object} props - The component props.
 * @param {string} props.fileUrl - The Object URL of the file content (e.g., PDF or image).
 * @param {string} props.title - The title to display in the modal header.
 * @param {function(): void} props.onClose - Callback function to close the modal.
 * @param {boolean} props.loading - Indicates if the file content is currently being fetched.
 * @returns {JSX.Element} The Generic File Viewer Modal component.
 */
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
 * Formats a date string into an ISO timestamp string with a specific time and IST offset (+05:30).
 * @param {string} dateStr - The date string (e.g., "YYYY-MM-DD").
 * @param {string} [hour="09:00:00"] - The time of day to append (e.g., "HH:mm:ss").
 * @returns {string | null} The formatted ISO timestamp string or null if the date is invalid/missing.
 */
const formatTimestamp = (dateStr, hour = "09:00:00") => {
  if (!dateStr || !dateStr.trim()) return null;
  const date = new Date(`${dateStr}T${hour}`);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const [h, m, s] = hour.split(":");
  const isoTime = `${h}:${m}:${s}`;

  return `${year}-${month}-${day}T${isoTime}+05:30`;
};

/**
 * Calculates the duration of the visit in days (inclusive of start and end date).
 * @param {string} from - The visit start date string (YYYY-MM-DD format).
 * @param {string} to - The visit end date string (YYYY-MM-DD format).
 * @returns {number} The duration in days.
 */
const calculateDuration = (from, to) => {
  if (!from || !to) return 0;
  const diff = new Date(to) - new Date(from);
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Generates the HTML string for the 'To' column based on employee details.
 * @param {object} formData - The form data containing employee details.
 * @returns {string} The HTML string for the 'To' section.
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
 * Renders the Save and Hold form component for editing and managing a drafted Office Order.
 *
 * @param {object} props - The component props.
 * @param {function(boolean): void} props.onClose - Callback function to close the form and return to the table. Accepts a boolean indicating if a refresh is needed.
 * @param {object} props.record - The initial record data passed from the parent table.
 * @param {function(): void} props.onSuccess - Callback to trigger a refresh in the parent component upon successful submission/deletion.
 * @returns {JSX.Element} The SaveandHold form component.
 */
const SaveandHold = ({ onClose, record, onSuccess }) => {
  /**
   * @typedef {object} FormData
   * @property {string} employeeid - Employee ID.
   * @property {string} facultyname - Employee Name.
   * @property {string} department - Employee Department.
   * @property {string} designation - Employee Designation.
   * @property {string} visitfrom - Visit From Date (YYYY-MM-DD).
   * @property {string} visitto - Visit To Date (YYYY-MM-DD).
   * @property {string} natureofparticipation_value - Nature of Visit.
   * @property {string} country - Country of Visit.
   * @property {string} city - City/Town of Visit.
   * @property {string} claimtype - Claim Type.
   * @property {string} signingAuthority - Selected signing authority value.
   * @property {string[]} toSection - Array of selected CC sections (To Section).
   * @property {string} remarks - Remarks/comments.
   */
  /** @type {[FormData, React.Dispatch<React.SetStateAction<FormData>>]} */
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
  });

  /**
   * @typedef {object} BodyData
   * @property {string} referenceNo - Office Order reference number.
   * @property {string} referenceDate - Office Order reference date (YYYY-MM-DD).
   * @property {string} subject - Subject line.
   * @property {string} refsubject - Reference line.
   * @property {string} body - HTML content of the main body.
   * @property {string} header - HTML content of the header.
   * @property {string} footer - HTML content of the footer.
   * @property {string} template - Template ID.
   */
  /** @type {[BodyData, React.Dispatch<React.SetStateAction<BodyData>>]} */
  const [bodyData, setBodyData] = useState({
    referenceNo: "",
    referenceDate: "",
    subject: "",
    refsubject: "",
    body: "",
    header: "",
    footer: "",
    template: "",
  });

  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [showPreview, setShowPreview] = useState(false);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(false);
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
  const [error, setError] = useState("");
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  /** @type {[object | null, React.Dispatch<React.SetStateAction<object | null>>]} */
  const [previewData, setPreviewData] = useState(null);
  /** @type {[Array.<object>, React.Dispatch<React.SetStateAction<Array.<object>>>]} */
  const [activityResources, setActivityResources] = useState([]);
  /** @type {[object | null, React.Dispatch<React.SetStateAction<object | null>>]} */
  const [fileViewerData, setFileViewerData] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  /** @type {[number | null, React.Dispatch<React.SetStateAction<number | null>>]} */
  const [taskId, setTaskId] = useState(null);
  /** @type {[number, React.Dispatch<React.SetStateAction<number>>]} */
  const [processId, setProcessId] = useState(1);
  /** @type {[object, React.Dispatch<React.SetStateAction<object>>]} */
  const [fieldErrors, setFieldErrors] = useState({});
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isClosingPreview, setIsClosingPreview] = useState(false);
   const [isEfilePopupOpen, setIsEfilePopupOpen] = useState(false);

  const sessionId = Cookies.get("session_id");
  const empId = Cookies.get("EmpId");
  const userRole = Cookies.get("selectedRole");
  const jwtToken = Cookies.get("HRToken");

  const toSectionOptions = [
    `The Head of ${formData?.department || ""}`,
    "The Dean (Faculty)",
    "The Dean (Admin)",
    "The Dean (IC&SR)",
    "The Dean (ACR)",
    "The Dean (GE)",
    "The Deputy Registrar (F&A)",
    "Office copy",
    "AR (Paybill)",
    "AR (Bills)",
  ];

  const signingOptions = [
     { value: "Assistant Registrar", label: "Assistant Registrar" },
    { value: "Deputy Registrar", label: "Deputy Registrar" },
    { value: "Registrar", label: "Registrar" },
  ];

  /**
   * Calculates the selected signing authority option object for the Dropdown component.
   * @type {object}
   */
  const signingValue = useMemo(() => {
    if (!formData.signingAuthority || formData.signingAuthority.trim() === "") {
      //return { value: "", label: "Select Signing Authority" };
    }

    const foundOption = signingOptions.find(
      (opt) => opt.value === formData.signingAuthority
    );

    return (
      foundOption || {
        value: formData.signingAuthority,
        label: formData.signingAuthority,
      }
    );
  }, [formData.signingAuthority]);

  /**
   * Handles the change event for the Signing Authority dropdown.
   * @param {object} selectedOption - The selected option object {value, label}.
   */
  const handleSigningChange = (selectedOption) => {
    if (!selectedOption || selectedOption.value === "") {
      setFormData((prev) => ({ ...prev, signingAuthority: "" }));

      // Set error immediately when unselected
      setFieldErrors((prev) => ({
        ...prev,
        signingAuthority: "Signing Authority is required",
      }));
    } else {
      const newValue = selectedOption.value || "";

      setFormData((prev) => ({ ...prev, signingAuthority: newValue }));

      // Clear error when a valid option is selected
      if (fieldErrors.signingAuthority) {
        setFieldErrors((prev) => ({ ...prev, signingAuthority: "" }));
      }
    }
// Only set dirty flag if not in initial load or closing preview mode
    if (!isInitialLoad && !isClosingPreview) {
      setIsSavedSuccessfully(false);
    }
  };

  /**
   * Formats a date value into YYYY-MM-DD string.
   * @param {string | Date} dateValue - The date value.
   * @returns {string} The formatted date string or an empty string.
   */
  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  /**
   * Fetches activity resource links (like guidelines, e-file) from the API.
   * @returns {Promise<void>}
   */
  const fetchActivityResources = useCallback(async () => {
    const processId = 1;
    const activityId = 1;
    const pId = sessionId;

    try {
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!sessionId) throw new Error("Session ID missing.");

      const rawPayload = {
        token: "HRFGVJISOVp1fncC",
        P_id: pId,
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
  }, [sessionId, jwtToken]);

  /**
   * Finds an activity resource object by its type.
   * @param {string} type - The resource type (e.g., 'guidelines', 'efile').
   * @returns {object | null} The resource object or null if not found.
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
   * Handles the secure download and display of a file resource.
   * @param {object} resource - The resource object containing file_name and file_path.
   * @returns {Promise<void>}
   */
  const downloadFileHandler = useCallback(
    async (resource) => {
      setLoading(true);
      setFileViewerData(null);

      let urlToRevoke = null;

      try {
        const rawPayload = {
          file_name: resource.file_name,
          file_path: resource.file_path,
          token: "HRFGVJISOVp1fncC",
          Session_id: sessionId,
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

  /**
   * Creates a handler function for viewing a specific type of resource.
   * @param {string} type - The resource type (e.g., 'guidelines').
   * @returns {function(): void} The click handler function.
   */
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
        // Display HTML content directly for text-based resources
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

  /**
   * Memoized object containing header action handlers.
   * @type {object}
   */
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
   * Fetches the current task and process IDs for a given record.
   * @param {string} coverpageno - The cover page number.
   * @param {string} employeeid - The employee ID.
   * @returns {Promise<{taskId: number|null, processId: number}>} The task and process IDs.
   */
  const fetchTaskDetails = useCallback(
    async (coverpageno, employeeid) => {
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
          `${HostName}/OfficeOrder_taskvisitdetails`,
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
        
        return { taskId: null, processId: 1 };
      }
    },
    [sessionId, jwtToken]
  );

  /**
   * Fetches the initial employee and office order details for the draft task
   * and populates the form state.
   * @param {string} coverpageno - The cover page number.
   * @param {string} employeeid - The employee ID.
   * @returns {Promise<void>}
   */
  const fetchEmployeeDetails = async (coverpageno, employeeid) => {
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
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
      };
      const encryptedPayload = await encryptPayloadForGo(requestBody);
      const apiUrl = `${HostName}/OfficeOrder_taskvisitdetails`;
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
      const encryptedResponse = encryptedData?.Data ?? encryptedData?.data;
      if (!encryptedResponse)
        throw new Error("Encrypted Data missing in response");

      const decryptedString = await decryptData(encryptedResponse);
      const parsedData = validateJsonData(decryptedString)
        ? decryptedString
        : JSON.parse(decryptedString);

      const records = parsedData?.Records ?? parsedData?.Data?.Records ?? [];
      if (!records.length) throw new Error("No records found");

      const record = records[0];
      const rawCcList = record.cc_to || "";
      const ccSectionsArray = rawCcList
        ? rawCcList
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      let signingAuthorityValue = "";

      if (record.signature_html) {
        // Remove any HTML tags and trim the text
        const signatureText = record.signature_html
          .replace(/<[^>]*>/g, "")
          .trim();

        // Find exact match in signingOptions
        const matchedOption = signingOptions.find(
          (opt) => opt.label.toLowerCase() === signatureText.toLowerCase()
        );

        if (matchedOption) {
          signingAuthorityValue = matchedOption.value;
        } else {
          // Fallback: use the raw text if no match found
          signingAuthorityValue = signatureText;
        }
      }

     

      setFormData({
        employeeid: record.employee_id || "",
        facultyname: record.employee_name || "",
        department: record.department || "",
        designation: record.designation || "",
        visitfrom: formatDate(record.visit_from),
        visitto: formatDate(record.visit_to),
        natureofparticipation_value: record.nature_of_visit || "",
        country: record.country || "",
        city: record.city_town || "",
        claimtype: record.claim_type || "",
        signingAuthority: signingAuthorityValue,
        toSection: ccSectionsArray,
        remarks: record.remarks || "",
      });
      setBodyData({
        referenceNo: record.order_no || "",
        referenceDate: formatDate(record.order_date),
        subject: record.subject || "",
        refsubject: record.reference || "",
        body: record.body_html || "",
        header: record.header_html || "",
        footer: record.footer_html || "",
        template: record.template_id || "",
      });

      // Fetch task details to get taskId and processId
      await fetchTaskDetails(coverpageno, employeeid);

      setIsSavedSuccessfully(true);
      setIsInitialLoad(false);
    } catch (err) {

      setError(err.message || "Failed to fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect to initialize data on component mount.
   */
 useEffect(() => {
    const initializeData = async () => {
      if (record?.coverpageno && record?.employeeid) {
        await fetchEmployeeDetails(record.coverpageno, record.employeeid);
        await fetchActivityResources();
      }
    };
    initializeData();
  }, [record, fetchActivityResources]);

  /**
   * Generic handler for updating form data state.
   * Also tracks if changes have been made to mark the form as dirty.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Only set dirty flag if NOT in the short blocking window
    if (!isInitialLoad && !isClosingPreview) {
      setIsSavedSuccessfully(false);
    }

    if (type === "checkbox") {
      setFormData((prev) => {
        const current = Array.isArray(prev.toSection) ? prev.toSection : [];
        const updated = checked
          ? [...current, value]
          : current.filter((v) => v !== value);

        // Re-check here: if it's not initial load, set dirty state
        if (!isInitialLoad && !isClosingPreview) {
          setIsSavedSuccessfully(false);
        }

        return { ...prev, toSection: updated };
      });
      // Clear error when user selects toSection
      if (fieldErrors.toSection) {
        setFieldErrors((prev) => ({ ...prev, toSection: "" }));
      }
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
      ].includes(name)
    ) {
      setBodyData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user types in remarks
      if (name === "remarks" && fieldErrors.remarks) {
        setFieldErrors((prev) => ({ ...prev, remarks: "" }));
      }
    }
  };

  /**
   * Validates the three fields strictly required for final submission: Signing Authority, To Section, and Remarks.
   * Updates the `fieldErrors` state.
   * @returns {boolean} True if all required fields are valid for submission, otherwise false.
   */
 const validateRequiredFieldsForSubmit = () => {
    const errors = {};

    // Check Signing Authority - more explicit validation
    if (
      !formData.signingAuthority ||
      formData.signingAuthority.trim() === "" ||
      formData.signingAuthority === "Select Signing Authority"
    ) {
      errors.signingAuthority = "Signing Authority is required";
    }

    // Check To Section
    if (!formData.toSection || formData.toSection.length === 0) {
      errors.toSection = "To Section is required";
    }

    // Check Remarks
    // if (!formData.remarks || formData.remarks.trim() === "") {
    //   errors.remarks = "Remarks are required";
    // }

    setFieldErrors(errors);

    // Return true only if ALL required fields are filled
    return Object.keys(errors).length === 0;
  };

  /**
   * Validates the essential fields required to save a draft (Save & Hold).
   * @returns {boolean} True if validation passes, otherwise false.
   */
  const validateFormForDraft = () => {
    const missingFields = [];
    const invalidFields = [];

    // Only basic required fields for draft
    const requiredFieldsForDraft = {
      natureofparticipation_value: "Nature of Visit",
      visitfrom: "Visit From Date",
      visitto: "Visit To Date",
      country: "Country",
      city: "City/Town",
    };

    for (const [key, label] of Object.entries(requiredFieldsForDraft)) {
      let value = formData[key];

      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
      ) {
        missingFields.push(label);
      }
    }

    // Validate date logic only
    if (formData.visitfrom && formData.visitto) {
      const fromDate = new Date(formData.visitfrom);
      const toDate = new Date(formData.visitto);

      if (fromDate > toDate) {
        invalidFields.push(
          "Visit To Date must be equal to or after Visit From Date"
        );
      }
    }

    const errorMessages = [];

    if (missingFields.length > 0) {
      errorMessages.push(
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    if (invalidFields.length > 0) {
      errorMessages.push(...invalidFields);
    }

    if (errorMessages.length > 0) {
      const message = errorMessages.join(". ");
      setError(message);

      Swal.fire({
        title: "Validation Error",
        html: errorMessages.map((msg) => `• ${msg}`).join("<br>"),
        icon: "warning",
      });

      return false;
    }

    setError("");
    return true;
  };

  /**
   * Creates the final payload object structure for both 'Submit' and 'draft' actions.
   * @param {'Submit' | 'draft'} typeOfSubmit - The action type.
   * @param {string} taskStatusId - The status ID corresponding to the action.
   * @param {string} submitterRole - The user's role performing the action.
   * @returns {object} The raw payload data structure.
   */
  const createInsertPayload = (typeOfSubmit, taskStatusId, submitterRole) => {
    const selectedOption = signingOptions.find(
      (opt) => opt.value === formData.signingAuthority
    );
    const signatureText = selectedOption
      ? selectedOption.label
      : formData.signingAuthority || "Authority Not Specified";
    const signatureHtml = `<p>${signatureText}</p>`;
    const toColumnValue = getToColumnHtml(formData);
    const now = new Date().toISOString().replace("Z", "+05:30");
    const initiatedOn = record?.InitiatedOn || now;
    const processId = record?.processid || record?.ProcessId || 1;
    const activitySeqNo =
      typeOfSubmit === "Submit"
        ? 1
        : record?.activityseqno || record?.ActivitySeqNo || 0;

    return {
      token: "HRFGVJISOVp1fncC",
      session_id: sessionId,
      typeofsubmit: typeOfSubmit,
      p_cover_page_no: record?.coverpageno || "",
      p_employee_id: formData.employeeid,
      p_employee_name: formData.facultyname,
      p_department: formData.department,
      p_designation: formData.designation,
      p_visit_from: formatTimestamp(formData.visitfrom, "09:00:00"),
      p_visit_to: formatTimestamp(formData.visitto, "17:00:00"),
      p_duration: calculateDuration(formData.visitfrom, formData.visitto),
      p_nature_of_visit: formData.natureofparticipation_value,
      p_claim_type: formData.claimtype || "",
      p_city_town: formData.city,
      p_country: formData.country,
      p_header_html: bodyData.header || "",
      p_order_no: bodyData.referenceNo || "",
      p_order_date:
        bodyData.referenceDate || new Date().toISOString().split("T")[0],
      p_to_column: toColumnValue,
      p_subject: bodyData.subject || "",
      p_reference: bodyData.refsubject,
      p_body_html: bodyData.body,
      p_signature_html: signatureHtml,
      p_cc_to: Array.isArray(formData.toSection)
        ? formData.toSection.join(",")
        : formData.toSection || "Office copy",
      p_footer_html: bodyData.footer || "",
      p_assign_to: typeOfSubmit === "draft" ? formData.employeeid : "",
      p_assigned_role: "",
      p_task_status_id: taskStatusId,
      p_activity_seq_no: activitySeqNo,
      p_is_task_return: false,
      p_is_task_approved: true,
      p_initiated_by: empId || "admin",
      p_initiated_on: initiatedOn,
      p_updated_by: empId || "admin",
      p_updated_on: now,
      p_process_id: processId,
      p_remarks: formData.remarks,
      p_email_flag: false,
      p_reject_flag: 0,
      p_user_role: submitterRole || "",
      p_priority: "17",
    };
  };

  /**
   * Fetches the unique status ID from the Status Master API based on a status description.
   * @param {string} statusDescription - The human-readable status (e.g., "saveandhold").
   * @returns {Promise<string>} The status ID.
   */
  const fetchStatusIdByDescription = useCallback(
    async (statusDescription) => {
      try {
        if (!sessionId) throw new Error("Session ID missing");
        const payload = {
          statusdescription: statusDescription,
          token: "HRFGVJISOVp1fncC",
          session_id: sessionId,
        };
        const response = await sendEncryptedData("/Statusmasternew", payload);
        const encryptedData = response.Data ?? response.data;

        if (!encryptedData)
          throw new Error("Encrypted data missing in response");

        const decrypted = await decryptData(encryptedData);
        const parsed = validateJsonData(decrypted)
          ? decrypted
          : JSON.parse(decrypted);

        if (!parsed || !parsed.Data?.Records?.[0]?.statusid) {
          throw new Error("Decrypted status response is invalid or empty");
        }
        return parsed.Data.Records[0].statusid;
      } catch (error) {
        throw error;
      }
    },
    [sessionId]
  );

  /**
   * Handles saving the current form data as a draft (Save and Hold).
   * @returns {Promise<void>}
   */
  const handleSave = async () => {
    if (!validateFormForDraft()) return;

    setLoading(true);
    setError("");

    try {
      if (!jwtToken) throw new Error("Authentication token missing.");
     const taskStatusId = await fetchStatusIdByDescription("saveandhold");
     const rawPayload = createInsertPayload("draft", taskStatusId, userRole);
     const encryptedPayload = await encryptPayloadForGo(rawPayload);
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

      if (!response.ok) {
        const errorText = await response.text();
        
        throw new Error(
          `Failed to insert Office Order (Save as Draft). Server status: ${response.status}`
        );
      }

      const responseData = await response.json();
     

      // Fetch updated task details after save to get the new task ID
      await fetchTaskDetails(record?.coverpageno, formData.employeeid);

      setIsSavedSuccessfully(true);
     

      await Swal.fire({
        title: "Saved!",
        text: "The task has been saved as a draft successfully. You may now view the preview.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message || "Failed to save as draft");
      setIsSavedSuccessfully(false);

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
   * Handles the soft deletion of the current draft task by updating its status.
   * @returns {Promise<void>}
   */
  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the task? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ED553B",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setLoading(true);
      setError("");
      if (!jwtToken) throw new Error("Authentication token missing.");
// Get the correct status ID for deletion
      const deletedStatusId = await fetchStatusIdByDescription("Deleted");
    // Create proper encrypted payload for delete
      const rawPayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        p_coverpageno: record.coverpageno,
        p_employeeid: record.employeeid,
        p_taskstatusid: String(deletedStatusId),
        p_updatedby: empId || "admin",
        p_updatedon: new Date().toISOString().replace("Z", "+05:30"),
      };
 // Encrypt the payload
      const encryptedPayload = await encryptPayloadForGo(rawPayload);
      // Send the request with proper structure
      const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ Data: encryptedPayload }), // Wrap in Data object
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update Office Order status. Server status: ${response.status}`
        );
      }

      // Parse the response
      const responseData = await response.json();
       await Swal.fire({
        title: "Deleted!",
        text: "The task has been marked as deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose?.(true); // Close form and trigger table refresh
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Failed to delete Office Order");
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to delete Office Order. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the final submission of the Office Order, moving it to the 'ongoing' status.
   * @param {React.MouseEvent} e - The click event.
   * @returns {Promise<void>}
   */
 const handleSubmit = async (e) => {
    // Prevent default form submission that might be causing the delete validation issue
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
        errorMessage = `Please fill the following required fields: ${missingFields.join(", ")}`;
      }

      setError(errorMessage);
      Swal.fire({
        title: "Required Fields Missing",
        text: errorMessage,
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!empId) throw new Error("Employee ID missing in cookies.");

      const taskStatusId = await fetchStatusIdByDescription("ongoing");
      const rawPayload = createInsertPayload("Submit", taskStatusId, userRole);
      const encryptedPayload = await encryptPayloadForGo(rawPayload);

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

      if (!response.ok)
        throw new Error(
          `Failed to submit Office Order. Server status: ${response.status}`
        );

      setLoading(false);
      setIsSavedSuccessfully(true);

      await Swal.fire({
        title: "Submitted!",
        text: "The task has been Submitted Successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose?.(true); // Close form and trigger table refresh
      if (onSuccess) onSuccess();
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
   * Handles generating and displaying the PDF preview.
   * Requires the form to be saved as a draft first to get a valid task ID.
   * @param {React.MouseEvent} e - The click event.
   * @returns {Promise<void>}
   */
  const handlePreview = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Must be saved first to guarantee taskId is present
    if (!isSavedSuccessfully) {
      setError("Please save as draft before generating a preview.");
      Swal.fire({
        title: "Preview Error",
        text: "Please save as draft before generating a preview.",
        icon: "warning",
      });
      return;
    }

    // NO VALIDATION FOR PREVIEW - Preview button is only enabled after Save.
    // Only basic check for required identifiers
    if (!record?.coverpageno || !formData.employeeid) {
      setError(
        "Cannot generate preview: Missing Cover Page Number or Employee ID."
      );
      Swal.fire({
        title: "Preview Error",
        text: "Cannot generate preview: Missing Cover Page Number or Employee ID.",
        icon: "warning",
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      let currentTaskId = taskId;
      let currentProcessId = processId || 1;
      const session_id = Cookies.get("session_id");
      // If taskId is not available (e.g., first save failed but form stayed open, or initial load missed it), fetch it
      if (!currentTaskId) {
        const { taskId: fetchedTaskId, processId: fetchedProcessId } =
          await fetchTaskDetails(
            record.coverpageno,
            formData.employeeid
          );

        if (!fetchedTaskId) {
          throw new Error(
            "Unable to retrieve Task ID. Please save as draft first."
          );
        } else {
          currentTaskId = fetchedTaskId;
          currentProcessId = fetchedProcessId;
        }
      }

      // Create the request body for preview using task_id and process_id
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
 // Set preview data and show preview
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
   * Handles the click of the Back button, closing the form without refreshing the table.
   */
  const handleBack = () => onClose?.(false);

  /**
   * Handles closing the PDF preview modal.
   */
  const handleClosePreview = () => {
    // 1: Set a flag to block spurious onChange events
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
   * Handles closing the file viewer modal and revoking the Object URL.
   */
  const handleCloseFileViewer = useCallback(() => {
    if (fileViewerData?.url) {
      window.URL.revokeObjectURL(fileViewerData.url);
    }
    setFileViewerData(null);
  }, [fileViewerData]);

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
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "0",
            zIndex: 2,
          }}
        >
          <BackButton onClick={handleBack} />
        </div>

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

      {/* Remove form tag to prevent submission conflicts */}
      <div>
        <FormSection>
          <h3 style={sectionHeadingStyle}>Employee Information</h3>

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
              // InputLabelProps={{ shrink: true }}
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
              // InputLabelProps={{ shrink: true }}
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
            <TextField
              label="Claim Type"
              name="claimtype"
              value={formData.claimtype}
              onChange={handleChange}
              // InputProps={{ readOnly: true }}
              InputProps={{ readOnly: true }}
              sx={{ display: "none" }}
            />
            <div></div>
            <div></div>
            <div></div>
          </div>
        </FormSection>

        <FormSection>
          <h3 style={sectionHeadingStyle}>Office Order Details</h3>

          <div style={gridRowTwoColumnStyles}>
            <TextField
              label="Reference Number"
              name="referenceNo"
              value={bodyData.referenceNo}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              type="date"
              label="Reference Date"
              name="referenceDate"
              value={bodyData.referenceDate}
              onChange={handleChange}
              // InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
          </div>

          <div style={gridRowTwoColumnStyles}>
            <TextField
              label="Subject"
              name="subject"
              value={bodyData.subject}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Ref"
              name="refsubject"
              value={bodyData.refsubject || ""}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              multiline
              rows={2}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Body</label>
            <TextEdit
              value={bodyData.body}
              onChange={(value) => {
                setBodyData((prev) => ({ ...prev, body: value }));
                // Only set dirty flag if NOT in the short blocking window
                if (!isInitialLoad && !isClosingPreview) {
                  setIsSavedSuccessfully(false);
                }
              }}
            />
          </div>
         <br />
          <div style={gridRowTwoColumnStyles}>
            <div>
              <Dropdown
                label="Signing Authority *"
                options={[
                  { value: "", label: "Select Signing Authority" }, // Add empty option for unselecting
                  ...signingOptions,
                ]}
                value={signingValue}
                onChange={handleSigningChange}
                error={!!fieldErrors.signingAuthority}
                helperText={fieldErrors.signingAuthority}
                isClearable={true} // Ensure this prop is passed if your Dropdown supports it
              />
            </div>
            <div>
              <DropdownWithCheckboxes
                label="To Section *"
                options={toSectionOptions.map((opt) => ({
                  value: opt,
                  label: opt,
                }))}
                value={formData.toSection}
                onChange={(selected) => {
                  setFormData((prev) => ({ ...prev, toSection: selected }));
                  // Only set dirty flag if NOT in the short blocking window
                  if (!isInitialLoad && !isClosingPreview) {
                    setIsSavedSuccessfully(false);
                  }
                  if (fieldErrors.toSection) {
                    setFieldErrors((prev) => ({ ...prev, toSection: "" }));
                  }
                }}
                error={!!fieldErrors.toSection}
                helperText={fieldErrors.toSection}
              />
            </div>
          </div>

          <br />
        </FormSection>

        <FormSection>
          <h3 style={sectionHeadingStyle}>Remarks and Actions</h3>
          <RemarksAndActions
            remarks={formData.remarks}
            onRemarksChange={(value) => {
              setFormData((prev) => ({ ...prev, remarks: value }));
              // Only set dirty flag if NOT in the short blocking window
              if (!isInitialLoad && !isClosingPreview) {
                setIsSavedSuccessfully(false);
              }
              // Clear error when user types in remarks
              if (fieldErrors.remarks) {
                setFieldErrors((prev) => ({ ...prev, remarks: "" }));
              }
            }}
            remarksError={fieldErrors.remarks}
            priority={formData.priority}
            onPriorityChange={(value) => {
              setFormData((prev) => ({ ...prev, priority: value }));
              // Only set dirty flag if NOT in the short blocking window
              if (!isInitialLoad && !isClosingPreview) {
                setIsSavedSuccessfully(false);
              }
            }}
            onSave={handleSave}
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
            draft={true}
            initiator={true}
            onDelete={handleDelete}
            onCancel={handleBack}
          />
        </FormSection>
      </div>
    </div>
  );
};

// --- Style Objects (Doced below for brevity) ---
const cardStyle = {
  width: "100%",
  maxWidth: "2000px",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  marginTop: "20px",
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

const gridRowTwoColumnStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
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

export default SaveandHold;