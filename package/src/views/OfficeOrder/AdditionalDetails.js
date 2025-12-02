/**
 * @fileoverview ApprovalForm component for handling office order approvals.
 * Manages form data, comments, approver actions, and preview for permission cum relief tasks.
 * @module AdditionalDetails
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @modifiedby Rovita
 * @modifiedon 21-11-2025
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import OfficeOrderPreview from "src/components/Process/PdfPreview.js";
import TextEdit from "src/views/OfficeOrder/TextEdit";
import Swal from "sweetalert2";
import { HostName } from "src/assets/host/Host";
import { HostName2 } from "src/assets/host/Host";
import { useNavigate } from "react-router-dom";
import CommentsHistory from "src/components/Process/CommentsSection";
import Dropdown from "src/components/ui/Dropdown";
import DropdownWithCheckboxes from "src/components/ui/DropdownWithCheckBox";
import FormSection from "src/components/ui/TopColorCard.js"; 
import {
  sendEncryptedData,
  decryptData,
  encryptPayloadForGo,
  validateJsonData,
  encryptDataWithKey,
} from "src/components/Encryption/EncryptionKey";
import HeaderSection from "src/components/Process/HeaderSection";
import RemarksAndActions from "src/components/Process/RemarksAndActions"; 
import { Typography, Box } from "@mui/material"; 
const ACTIVITY_RESOURCES_ENDPOINT = `${HostName2}/ActivityResources`;
const FILE_DOWNLOAD_ENDPOINT = `${HostName2}/FileDownload`;
const TASK_DETAILS_ENDPOINT = "/OfficeOrder_taskvisitdetails";
const GenericFileViewerModal = ({
  fileUrl,
  title,
  onClose,
  loading,
  mimeType,
}) => {
  const isIframeCompatible =
    mimeType?.includes("application/pdf") ||
    mimeType?.includes("image/") ||
    mimeType?.includes("video/") ||
    mimeType?.includes("text/");

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
          ) : isIframeCompatible ? (
            <iframe
              src={fileUrl}
              title={title}
              style={styles.iframe}
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="error">
                File Type Not Viewable In-App: {mimeType}
              </Typography>
              <Typography sx={{ mt: 2, mb: 3 }}>
                This document type cannot be displayed directly. Click the link
                below to open the file in a new tab, where your browser's
                default viewer or download process will take over.
              </Typography>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  wordBreak: "break-all",
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: "#1976D2",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "6px",
                }}
              >
                Open / Download File: {title}
              </a>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Main React component for the Approval Form.
 * Handles loading task data, employee details, comments, approval actions,
 * editing office order content, saving drafts, submitting approvals/rejections,
 * and generating previews.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} [props.taskData] - Task data containing details like TaskId, EmployeeID, etc.
 * @param {Function} [props.onClose] - Callback function to close the form/modal.
 * @param {Object} [props.record] - Optional record data with employeeid, coverpageno.
 * @param {Function} [props.showSnackbar] - Optional callback to show snackbar notifications.
 * @returns {JSX.Element} The rendered approval form component.
 */
const AdditionalDetails = ({ taskData, onClose, record, showSnackbar }) => {
  const navigate = useNavigate();

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
    leave: "",
    subject: "",
    ref: "",
    referenceNumber: "",
    template: "",
    body: "",
    date: "",
    header: "",
    footer: "",
  });

  const [bodyData, setBodyData] = useState({
    referencenumber: "",
    subject: "",
    body: "",
    refsubject: "",
    Date: "",
    Ref: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [approverRemarks, setApproverRemarks] = useState("");
  const [approvalAction, setApprovalAction] = useState(""); // "approve" or "reject"
  const [initiatorComments, setInitiatorComments] = useState([]);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isOfficeOrderEditable, setIsOfficeOrderEditable] = useState(false);
  const [isOfficeOrderExpanded, setIsOfficeOrderExpanded] = useState(false);
  const [returnToUser, setReturnToUser] = useState("");
  const [sendBackToMe, setSendBackToMe] = useState(false);
  const [apiReturnUserOptions, setApiReturnUserOptions] = useState([]);
  const [activityResources, setActivityResources] = useState({}); // State for fetched activity resources
  const [fileViewerData, setFileViewerData] = useState(null); // State for file viewer {url, title, mimeType}
  const [previewData, setPreviewData] = useState(null); // State for preview data from EmployeeVisitForm logic
  const [taskId, setTaskId] = useState(null); // For task ID management
  const [processId, setProcessId] = useState(null); // For process ID management
  const commentsHeaderColor = "#3F51B5";
  const [priority, setPriority] = useState("17"); // Default to Normal (ID 17)
  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Memoized current preview data combining form and body data.
   */
  const currentPreviewData = useMemo(() => {
    return {
      formData: {
        ...formData,
        signingAuthorityLabel: formData.signingAuthority,
      },
      bodyData: {
        ...bodyData,
      },
    };
  }, [formData, bodyData]);

  /**
   * Memoized actual task data, extracting and normalizing from taskData.
   */
  const actualTaskData = useMemo(() => {
    if (!taskData) {
      return null;
    }
    if (taskData.TaskId) {
      return {
        ...taskData,
        Processid: taskData.ProcessId || taskData.Processid || "1",
      };
    }
    if (
      taskData.Data &&
      taskData.Data.Records &&
      taskData.Data.Records.length > 0
    ) {
      const extractedRecord = taskData.Data.Records[0];
      return {
        ...extractedRecord,
        TaskId: extractedRecord.taskid || extractedRecord.TaskId,
        EmployeeID: extractedRecord.employeeid || extractedRecord.EmployeeID,
        CoverPageNo: extractedRecord.coverpageno || extractedRecord.CoverPageNo,
        ProcessId: extractedRecord.processid || extractedRecord.ProcessId,
        ActivitySeqNo:
          extractedRecord.activityseqno || extractedRecord.ActivitySeqNo,
        Processid:
          extractedRecord.processid || extractedRecord.ProcessId || "1",
      };
    }
    return null;
  }, [taskData]);

  const sessionId = Cookies.get("session_id");

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

  const signingAuthorityOptions = [
     { value: "Assistant Registrar", label: "Assistant Registrar" },
    { value: "Deputy Registrar", label: "Deputy Registrar" },
    { value: "Registrar", label: "Registrar" },
  ];

  /**
   * Memoized return user options including API fetched users and initiator.
   */
  const returnUserOptions = useMemo(() => {
    const initialOption = { value: "", label: "Select Next/Return User" };
    return [initialOption, ...apiReturnUserOptions];
  }, [apiReturnUserOptions]);

  /**
   * Strips HTML tags from a string to extract plain text.
   * @param {string} htmlString - The HTML string to strip.
   * @returns {string} The plain text content.
   */
  const stripHtml = (htmlString) => {
    if (!htmlString) return "";
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || "";
  };

  /**
   * Formats a date value for input fields (YYYY-MM-DD).
   * @param {string} dateValue - The raw date value to format.
   * @returns {string} The formatted date string or empty if invalid.
   */
  const formatDateInput = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  /**
   * Formats a date string for API with specified time and timezone offset.
   * @param {string} dateString - The date string in YYYY-MM-DD format.
   * @param {string} [time="09:00:00"] - The time in HH:MM:SS format.
   * @returns {string|null} The formatted ISO timestamp or null if invalid.
   */
  const formatDateForAPI = (dateString, time = "09:00:00") => {
    if (!dateString || dateString.trim() === "") return null;
    const datePart = new Date(dateString);
    if (isNaN(datePart.getTime())) return null;
    const [hours, minutes, seconds] = time.split(":").map(Number);
    datePart.setHours(hours, minutes, seconds, 0);
    const tzOffset = -datePart.getTimezoneOffset();
    const tzOffsetHours = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(
      2,
      "0"
    );
    const tzOffsetMins = String(Math.abs(tzOffset) % 60).padStart(2, "0");
    const tzSign = tzOffset >= 0 ? "+" : "-";
    const year = datePart.getFullYear();
    const month = String(datePart.getMonth() + 1).padStart(2, "0");
    const day = String(datePart.getDate()).padStart(2, "0");
    const hour = String(datePart.getHours()).padStart(2, "0");
    const minute = String(datePart.getMinutes()).padStart(2, "0");
    const second = String(datePart.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}:${second}${tzSign}${tzOffsetHours}:${tzOffsetMins}`;
  };

  /**
   * Calculates the duration in days between two dates, inclusive.
   * @param {string} from - The start date string.
   * @param {string} to - The end date string.
   * @returns {number} The calculated duration in days.
   */
  const calculateDuration = (from, to) => {
    if (!from || !to || from.trim() === "" || to.trim() === "") return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return 0;
    const diff = toDate - fromDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  /**
   * Sanitizes a field value to ensure it's a string or empty.
   * @param {*} value - The value to sanitize.
   * @returns {string} The sanitized string value.
   */
  const sanitizeField = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return value;
  };

  /**
   * Fetches status ID by description from the Statusmaster API.
   * @param {string} statusDescription - The status description to query.
   * @returns {Promise<number>} The status ID or default 8.
   */
  const fetchStatusIdByDescription = async (statusDescription) => {
    try {
      if (!sessionId) throw new Error("Session ID missing");
      const payload = {
        statusdescription: statusDescription,
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
      };
      const response = await sendEncryptedData("/Statusmasternew", payload);
      const decrypted = await decryptData(response.Data ?? response.data);
      if (!validateJsonData(decrypted))
        throw new Error("Decrypted status response is invalid");
      return decrypted?.Data?.Records?.[0]?.statusid ?? 8;
    } catch (error) {
      throw error;
    }
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
    [sessionId]
  );

  /**
   * Generates HTML for the "To" column based on form data.
   * @returns {string} The formatted HTML string for the "To" column.
   */
  const generateToColumnHtml = () => {
    const name = sanitizeField(formData.facultyname);
    const id = sanitizeField(formData.employeeid);
    const dept = sanitizeField(formData.department);
    return `<p><strong>To</strong><br>${name} (ID No. ${id})<br>Thro the Head, ${dept}</p><p><strong>Sir,</strong></p>`;
  };

  /**
   * Fetches API return user options for task return functionality.
   * Populates options from comments and adds initiator if needed.
   */
  const fetchApiReturnUsers = useCallback(async () => {
    const taskId = actualTaskData?.TaskId;
    const sessionId = Cookies.get("session_id");

    if (!taskId) return;

    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");

      const body = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        task_id: taskId,
      };
      const encryptedPayload = await encryptPayloadForGo(body);
      const response = await fetch(`${HostName}/OfficeOrder_ReturnDropdown`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch return users: ${response.status}`);
      }
      const encryptedResponse = await response.json();
      const encryptedData = encryptedResponse?.Data ?? encryptedResponse?.data;

      if (!encryptedData) {
        throw new Error("Encrypted Data missing in return users response");
      }

      const decryptedString = await decryptData(encryptedData);
      const parsedData = validateJsonData(decryptedString)
        ? decryptedString
        : JSON.parse(decryptedString);

      const records = parsedData?.Records ?? parsedData?.Data?.Records ?? [];
      const uniqueUsers = new Set();
      const options = [];

      records.forEach((r) => {
        const userId = r.comment_by;
        if (userId && !uniqueUsers.has(userId)) {
          uniqueUsers.add(userId);
          const role = r.comment_role || "";
          options.push({ value: userId, label: role });
        }
      });

      const initiatorId = actualTaskData?.InitiatedBy;
      if (initiatorId && !uniqueUsers.has(initiatorId)) {
        options.push({
          value: initiatorId,
          label: `${initiatorId} - Initiator`,
        });
      }

      options.sort((a, b) => a.label.localeCompare(b.label));
      setApiReturnUserOptions(options);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text:
          err.userMessage ||
          "Failed to load return user options. Please try again.",
        icon: "error",
      });
    }
  }, [actualTaskData?.TaskId, sessionId, actualTaskData?.InitiatedBy]);

  /**
   * Fetches employee data and office order details from the API.
   * Populates form and body data states, processes subject/reference splitting.
   */
  const fetchEmployeeData = useCallback(async () => {
    const employeeId =
      actualTaskData?.EmployeeID ||
      actualTaskData?.employeeid ||
      actualTaskData?.EmployeeId ||
      record?.employeeid ||
      record?.EmployeeID;

    const coverPageNo =
      actualTaskData?.CoverPageNo ||
      actualTaskData?.coverpageno ||
      record?.coverpageno ||
      actualTaskData?.TaskId;

    if (!employeeId || !coverPageNo) {
      setError(
        "Required document parameters missing (EmployeeID or CoverPageNo)."
      );
      return;
    }

    setLoading(true);
    setError("");

    const cleanSubject = (subject) => {
      if (!subject) return { mainSubject: "", reference: "" };
      let cleaned = subject.replace(/^Sir,\s*/i, "");
      const refIndex = cleaned.indexOf("Ref:");
      let mainSubject = cleaned;
      let reference = "";
      if (refIndex !== -1) {
        mainSubject = cleaned.slice(0, refIndex).trim();
        reference = cleaned.slice(refIndex + 4).trim();
      }
      return { mainSubject, reference };
    };

    try {
      const jwtToken = Cookies.get("HRToken");
      const sessionId = Cookies.get("session_id");
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!sessionId) throw new Error("Session ID missing.");

      const endpoint = `${HostName}/OfficeOrder_taskvisitdetails`;

      const requestPayload = {
        token: "HRFGVJISOVp1fncC",
        employeeid: employeeId,
        coverpageno: coverPageNo,
        session_id: sessionId,
      };
      const encryptedPayload = await encryptPayloadForGo(requestPayload);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const encryptedResponse = await response.json();
      const encryptedData = encryptedResponse?.Data ?? encryptedResponse?.data;
      if (!encryptedData)
        throw new Error("Encrypted Data missing in visit details response.");

      const decryptedObj = await decryptData(encryptedData);
      const parsed =
        typeof decryptedObj === "string"
          ? JSON.parse(decryptedObj)
          : decryptedObj;

      if (!validateJsonData(parsed))
        throw new Error("Invalid response format from server.");

      const records = parsed?.Records ?? parsed?.Data?.Records ?? [];
      if (records.length === 0)
        throw new Error("No records found in visit details response.");

      const dataRecord = records[0];
      const { mainSubject, reference } = cleanSubject(dataRecord.subject || "");

      let signingAuthorityValue = dataRecord.signing_authority || "";
      if (!signingAuthorityValue && dataRecord.signature_html) {
        const signatureText = stripHtml(dataRecord.signature_html).trim();
        const matchedOption = signingAuthorityOptions.find(
          (opt) => opt.label.toLowerCase() === signatureText.toLowerCase()
        );
        signingAuthorityValue = matchedOption
          ? matchedOption.value
          : signatureText;
      }
      const employeeData = {
        employeeid: dataRecord.employee_id || "",
        facultyname: dataRecord.employee_name || "",
        department: dataRecord.department || "",
        designation: dataRecord.designation || "",
        visitfrom: formatDateInput(dataRecord.visit_from),
        visitto: formatDateInput(dataRecord.visit_to),
        natureofparticipation_value: dataRecord.nature_of_visit || "",
        country: dataRecord.country?.trim() || "",
        city: dataRecord.city_town || "",
        claimtype: dataRecord.claim_type || "",
        signingAuthority: signingAuthorityValue,
        remarks: dataRecord.remarks || "",
        subject: mainSubject,
        ref: reference || stripHtml(dataRecord.reference) || "",
        referenceNumber: dataRecord.order_no || "",
        body: dataRecord.body_html || "",
        date: formatDateInput(dataRecord.order_date),
        header: stripHtml(dataRecord.header_html) || "",
        footer: stripHtml(dataRecord.footer_html) || "",
        toSection: dataRecord.cc_to
          ? dataRecord.cc_to
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
      };

      setFormData(employeeData);
      setBodyData({
        referencenumber: dataRecord.order_no || "",
        subject: mainSubject,
        body: dataRecord.body_html || "",
        refsubject: reference || stripHtml(dataRecord.reference) || "",
        Date: formatDateInput(dataRecord.order_date),
      });
      setPreviewCoverPageNo(coverPageNo);
      setSelectedEmployeeId(employeeId);
      setTaskId(dataRecord.task_id || actualTaskData?.TaskId);
      setProcessId(dataRecord.process_id || actualTaskData?.Processid || 1);
      setPriority(dataRecord.priority || "17");
    } catch (err) {
      setError(err.message || "Failed to fetch employee visit details");
    } finally {
      setLoading(false);
    }
  }, [actualTaskData, record, sessionId]);

  /**
   * Fetches comments and remarks for the task from the API.
   * Populates initiator comments state.
   */
  const fetchCommentsData = useCallback(async () => {
    const officeOrderId = actualTaskData?.TaskId;
    const processId = actualTaskData?.Processid;

    if (!officeOrderId || !processId) return;

    try {
      const jwtToken = Cookies.get("HRToken");
      const sessionId = Cookies.get("session_id");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!sessionId) throw new Error("Session ID missing.");

      const endpoint = `${HostName}/OfficeOrder_approval_remarks`;

      const requestPayload = {
        token: "HRFGVJISOVp1fncC",
        taskid: officeOrderId,
        session_id: sessionId,
        process_id: Number(processId),
      };

      const encryptedPayload = await encryptPayloadForGo(requestPayload);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const encryptedResponse = await response.json();
      const encryptedData = encryptedResponse?.Data ?? encryptedResponse?.data;

      if (!encryptedData)
        throw new Error("Encrypted Data missing in comments response.");

      const decryptedObj = await decryptData(encryptedData);
      const parsed =
        typeof decryptedObj === "string"
          ? JSON.parse(decryptedObj)
          : decryptedObj;
      if (!validateJsonData(parsed)) {
        throw new Error("Decrypted response has unexpected format.");
      }

      const records = parsed?.Records ?? parsed?.Data?.Records ?? [];
      const commentsArray = records.map((r, index) => ({
        id: index + 1,
        commenter: r.UpdatedBy || r.UserID || "Unknown",
        role: r.UserRole || "",
        comment: r.Remarks || "",
        date: r.UpdatedOn
          ? new Date(r.UpdatedOn).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "",
      }));

      setInitiatorComments(commentsArray);
    } catch (err) {
    }
  }, [actualTaskData?.TaskId, actualTaskData?.Processid]);

  /**
   * Fetches the activity resources (Guidelines, Video, Flowchart, HelpDoc)
   * for the current process and activity.
   */
  const fetchActivityResources = useCallback(async () => {
    const processId = actualTaskData?.Processid;
    const activityId = actualTaskData?.ActivitySeqNo;
    const sessionId = Cookies.get("session_id");

    if (!processId || !activityId || !sessionId) return;
 try {
      const jwtToken = Cookies.get("HRToken");
      const body = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        ProcessId: Number(processId),
        ActivityId: Number(activityId),
      };
      const encryptedPayload = await encryptPayloadForGo(body);

      const response = await fetch(ACTIVITY_RESOURCES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok)
        throw new Error(
          `Failed to fetch activity resources metadata. Status: ${response.status}`
        );

      const encryptedResponse = await response.json();
      const encryptedData = encryptedResponse?.Data ?? encryptedResponse?.data;
      if (!encryptedData)
        throw new Error("Encrypted Data missing in resource response");

      const decryptedResult = await decryptData(encryptedData);

      let parsedData;
      try {
        if (typeof decryptedResult === "object" && decryptedResult !== null) {
          parsedData = decryptedResult;
        } else if (typeof decryptedResult === "string") {
          const cleanedString = decryptedResult
            .replace(/[-\u001F\u007F-\u009F]/g, "")
            .trim();
          if (!cleanedString) {
            throw new Error("Decrypted data is empty or only whitespace.");
          }
          parsedData = JSON.parse(cleanedString);
        } else {
          throw new TypeError(
            "Decrypted data is neither a string nor a valid object."
          );
        }
      } catch (e) {
     
        throw new Error(
          "Invalid JSON response after decryption for ActivityResources."
        );
      }

      const records = parsedData?.Records ?? parsedData?.Data?.Records ?? [];
      const resourceMap = records.reduce((acc, r) => {
        acc[r.resource_type.toLowerCase()] = r;
        return acc;
      }, {});
   setActivityResources(resourceMap);
    } catch (err) {
      throw err;
    }
  }, [actualTaskData?.Processid, actualTaskData?.ActivitySeqNo, sessionId]);

  /**
   * Handles fetching a file's content from the FileDownload API,
   * handling both JSON (encrypted base64) and raw binary stream responses.
   */
  const handleFileDownload = useCallback(async (resource) => {
    if (!resource.file_name || !resource.file_path) {
      Swal.fire("Error", "File details missing for download.", "error");
      return;
    }
   try {
      setLoading(true);
      const jwtToken = Cookies.get("HRToken");
      const sessionId = Cookies.get("session_id");

      const body = {
        token: "HRFGVJISOVp1fncC",
        file_name: resource.file_name,
        file_path: resource.file_path,
        session_id: sessionId,
      };

      const encryptedPayload = await encryptPayloadForGo(body);

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
        throw new Error(
          `File download failed. Server: ${
            response.status
          } ${errorText.substring(0, 100)}...`
        );
      }
      const contentType = response.headers.get("Content-Type") || "";
      let fileContentBase64 = null;
      let blob = null;
      let mimeType = "application/octet-stream";
      const fileExtension = resource.file_name.split(".").pop().toLowerCase();

      if (fileExtension === "pdf") mimeType = "application/pdf";
      else if (fileExtension === "mp4") mimeType = "video/mp4";
      else if (fileExtension === "doc" || fileExtension === "docx")
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      else if (fileExtension === "png") mimeType = "image/png";
      try {
        const responseText = await response.clone().text(); // Clone is essential to read text, then stream/blob if needed later
        const encryptedResponse = JSON.parse(responseText);
        const encryptedData =
          encryptedResponse?.Data ?? encryptedResponse?.data;

        if (encryptedData) {
          const decryptedObj = await decryptData(encryptedData);
          const parsed =
            typeof decryptedObj === "string"
              ? JSON.parse(decryptedObj)
              : decryptedObj;
          fileContentBase64 =
            parsed?.file_content || parsed?.Data?.file_content;
        }

        if (fileContentBase64) {
          const byteCharacters = atob(fileContentBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          blob = new Blob([byteArray], { type: mimeType });
        } else if (contentType.includes("application/json")) {
          throw new Error("File content not found in decrypted JSON response.");
        }
      } catch (e) {
        if (
          e instanceof SyntaxError ||
          (contentType && !contentType.includes("application/json"))
        ) {
          blob = await response.blob();
          mimeType = blob.type || mimeType; // Use the type from the blob if available
        } else {
          throw e;
        }
      }

      if (!blob) {
        throw new Error(
          "File could not be processed as JSON/Base64 or as a raw binary stream."
        );
      }

      const url = URL.createObjectURL(blob);

      setFileViewerData({
        url: url,
        title: resource.title || resource.file_name,
        mimeType: mimeType,
      });
    } catch (err) {
      
      Swal.fire("Error", err.message || "Failed to download file.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles clicks on HeaderSection resource icons (Guidelines, Video, etc.).
   * @param {string} resourceType - The type of resource (e.g., 'guidelines', 'video').
   */
  const handleResourceClick = useCallback(
    (resourceType) => {
      const resource = activityResources[resourceType.toLowerCase()];
   if (!resource) {
        Swal.fire(
          "Info",
          `${resourceType} not available for this activity.`,
          "info"
        );
        return;
      }
      const hasFile = resource.file_name && resource.file_path;
      if (hasFile) {
     
        handleFileDownload(resource);
      } else if (resource.content) {
      } else {
        Swal.fire(
          "Info",
          `${resourceType} is available but no content or file is attached.`,
          "info"
        );
      }
    },
    [activityResources, handleFileDownload]
  );
  const headerHandlers = useMemo(
    () => ({
      onGuidelinesClick: () => handleResourceClick("guidelines"),
      onVideoClick: () => handleResourceClick("video"),
      onHelDocClick: () => handleResourceClick("helpdoc"),
      onFlowchartClick: () => handleResourceClick("flowchart"),
      onEfileClick: () => handleResourceClick("efile"),
    }),
    [handleResourceClick]
  );

  /**
   * Handles navigation back or close.
   */
  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  }, [onClose, navigate]);

  /**
   * Effect hook to load all initial data: employee details, comments, return users, and resources.
   */
  useEffect(() => {
    const loadAllData = async () => {
      if (!actualTaskData?.TaskId) {
        return;
      }
      setLoading(true);
      try {
        await Promise.all([
          fetchEmployeeData(),
          fetchCommentsData(),
          fetchApiReturnUsers(),
          fetchActivityResources(), // Added resource fetching
        ]);
      } catch (error) {
        setError(
          error.message || "An error occurred during initial data loading."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [
    actualTaskData?.TaskId,
    fetchEmployeeData,
    fetchCommentsData,
    fetchApiReturnUsers,
    fetchActivityResources, // Added dependency
  ]);

  /**
   * Handles changes to form inputs, respecting edit mode and field types.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value, type, checked, disabled } = e.target;
    if (disabled) return;
    if (name === "remarks") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }
    if (isOfficeOrderEditable) {
      if (type === "checkbox") {
        setFormData((prev) => {
          const current = Array.isArray(prev.toSection) ? prev.toSection : [];
          const updated = checked
            ? [...current, value]
            : current.filter((v) => v !== value);
          return { ...prev, toSection: updated };
        });
      } else if (
        [
          "referencenumber",
          "subject",
          "Date",
          "refsubject",
          "header",
          "footer",
        ].includes(name)
      ) {
        setBodyData((prev) => ({
          ...prev,
          [name === "Date" ? "Date" : name]: value,
        }));
        setFormData((prev) => ({
          ...prev,
          [name === "Date" ? "date" : name]: value,
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  /**
   * Handles changes to the body text editor.
   * @param {string} value - The new body content.
   */
  const handleBodyChange = (value) => {
    if (!isOfficeOrderEditable) return;
    setBodyData((prev) => ({ ...prev, body: value }));
    setFormData((prev) => ({ ...prev, body: value }));
  };

  /**
   * Handles changes to the To Section multi-select.
   * @param {Array} selected - The selected options array.
   */
  const handleToSectionChange = useCallback(
    (selected) => {
      if (!isOfficeOrderEditable) return;
      setFormData((prev) => ({ ...prev, toSection: selected }));
      // Clear error when user selects options
      if (fieldErrors.toSection) {
        setFieldErrors((prev) => ({ ...prev, toSection: "" }));
      }
    },
    [isOfficeOrderEditable, fieldErrors.toSection]
  );

  /**
   * Handles changes to the Priority.
   */
  const handlePriorityChange = useCallback((value) => {
    setPriority(value);
  }, []);
  const createInsertPayload = (typeOfSubmit, taskStatusId, submitterRole) => {
    const empId = Cookies.get("EmpId");
    const now = new Date().toISOString();
    const coverPageNo = sanitizeField(
      actualTaskData?.CoverPageNo || actualTaskData?.coverpageno
    );

    return {
      token: "HRFGVJISOVp1fncC",
      session_id: sessionId,
      typeofsubmit: typeOfSubmit,
      p_cover_page_no: coverPageNo,
      p_employee_id: sanitizeField(formData.employeeid),
      p_employee_name: sanitizeField(formData.facultyname),
      p_department: sanitizeField(formData.department),
      p_designation: sanitizeField(formData.designation),
      p_visit_from: formatDateForAPI(formData.visitfrom, "09:00:00"),
      p_visit_to: formatDateForAPI(formData.visitto, "17:00:00"),
      p_duration: calculateDuration(formData.visitfrom, formData.visitto),
      p_nature_of_visit: sanitizeField(formData.natureofparticipation_value),
      p_claim_type: sanitizeField(formData.claimtype),
      p_city_town: sanitizeField(formData.city),
      p_country: sanitizeField(formData.country),
      p_header_html: sanitizeField(formData.header),
      p_order_no: sanitizeField(bodyData.referencenumber),
      p_order_date:
        formatDateForAPI(bodyData.Date, "00:00:00")?.split("T")[0] || "",
      p_to_column: generateToColumnHtml(),
      p_subject: sanitizeField(bodyData.subject),
      p_reference: sanitizeField(bodyData.refsubject),
      p_body_html: sanitizeField(bodyData.body),
      p_signature_html: sanitizeField(String(formData.signingAuthority)),
      p_cc_to: Array.isArray(formData.toSection)
        ? formData.toSection.join(",")
        : "",
      p_footer_html: sanitizeField(formData.footer),
      p_assign_to: typeOfSubmit === "draft" ? empId : "", // Assign to initiator for draft
      p_assigned_role:
        typeOfSubmit === "draft" ? Cookies.get("selectedRole") : "",
      p_task_status_id: taskStatusId,
      p_activity_seq_no: actualTaskData?.ActivitySeqNo || 1,
      p_is_task_return: false,
      p_is_task_approved: true,
      p_initiated_by: sanitizeField(actualTaskData?.InitiatedBy || empId),
      p_initiated_on: actualTaskData?.InitiatedOn || now,
      p_updated_by: sanitizeField(empId),
      p_updated_on: now,
      p_process_id: Number(
        actualTaskData?.Processid || actualTaskData?.ProcessId
      ),
      p_remarks: sanitizeField(formData.remarks),
      p_email_flag: false,
      p_reject_flag: 0,
      p_user_role: submitterRole,
      p_task_id: actualTaskData?.TaskId,
      p_priority: sanitizeField(String(priority)), // FIX: Explicitly cast to string here
    };
  };

  /**
   * Handles saving the form as a draft via API securely and generates PDF.
   */
  const handleSave = async () => {
    try {
      setLoading(true);
      const jwtToken = Cookies.get("HRToken");
      const empId = Cookies.get("EmpId");
      if (!jwtToken || !empId)
        throw new Error("Authentication details missing.");

      const userRole = Cookies.get("selectedRole");
      const taskStatusId = await fetchStatusIdByDescription("saveandhold"); // Get Status ID for save/draft
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

      if (!response.ok)
        throw new Error(
          `Failed to save Office Order. Server status: ${response.status}`
        );
      await fetchTaskDetails(previewCoverPageNo, formData.employeeid, true);

      Swal.fire({
        title: "Saved!",
        text: "The task has been saved successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setIsSavedSuccessfully(true);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to save Office Order",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validates the three required fields for submission
   * @returns {boolean} True if all required fields are valid
   */

  const validateRequiredFieldsForSubmit = () => {
    const errors = {};

    // Check Signing Authority - set proper error message
    if (!formData.signingAuthority || formData.signingAuthority.trim() === "") {
      errors.signingAuthority = "Signing Authority is required";
    }

    // Check To Section
    if (!formData.toSection || formData.toSection.length === 0) {
      errors.toSection = "To Section is required";
    }

    // Check Remarks
    if (!formData.remarks || formData.remarks.trim() === "") {
      errors.remarks = "Official Remarks are required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles submission of the form via API securely with validation
   */
  const handleSubmit = async () => {
    // Validate required fields before submission
    if (!validateRequiredFieldsForSubmit()) {
      // Create a detailed error message listing missing fields
      const missingFields = [];

      if (fieldErrors.signingAuthority) missingFields.push("Signing Authority");
      if (fieldErrors.toSection) missingFields.push("To Section");
      if (fieldErrors.remarks) missingFields.push("Official Remarks");

      let errorMessage = "";
      let alertTitle = "Required Fields Missing";

      // 1] If all three required fields are missing
      if (missingFields.length === 3) {
        errorMessage =
          "Required fields Signing Authority, To Section, and Official Remarks are missing";
      }
      // 2] If any field(s) is missing
      else if (missingFields.length > 0) {
        errorMessage = `Required fields ${missingFields.join(
          ", "
        )} are missing`;
      }

      setError(errorMessage);

      // Force re-render of field errors by updating state
      setFieldErrors((prev) => ({ ...prev }));

      Swal.fire({
        title: alertTitle,
        text: errorMessage,
        icon: "warning",
      });
      return;
    }

    // ... rest of your submit logic
    try {
      setLoading(true);
      const jwtToken = Cookies.get("HRToken");
      const empId = Cookies.get("EmpId");
      if (!jwtToken || !empId)
        throw new Error("Authentication details missing.");

      const userRole = Cookies.get("selectedRole");
      const taskStatusId = await fetchStatusIdByDescription("ongoing");
      const rawPayload = createInsertPayload("submit", taskStatusId, userRole);
      rawPayload.p_assign_to = "";
      rawPayload.p_assigned_role = "";
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

      Swal.fire({
        title: "Re-Submitted!",
        text: "The task has been re-submitted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/inbox"), 2000);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to submit Office Order",
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

    setLoading(true);
    setError("");

    try {
      let currentTaskId = taskId || actualTaskData?.TaskId;
      let currentProcessId = processId || actualTaskData?.Processid || 1;
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
   * Closes the preview modal and revokes PDF URL to free memory.
   */
  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  /**
   * Logic to call handleBack
   */
  const handleCancel = () => {
    handleBack();
  };

  const handleCloseFileViewer = useCallback(() => {
    if (fileViewerData?.url) {
      URL.revokeObjectURL(fileViewerData.url); // Revoke the created URL
    }
    setFileViewerData(null);
  }, [fileViewerData]);

  if (loading) return <div style={loadingStyle}>Loading employee data...</div>;

  if (fileViewerData?.url) {
    return (
      <GenericFileViewerModal
        fileUrl={fileViewerData.url}
        title={fileViewerData.title}
        onClose={handleCloseFileViewer}
        loading={loading}
        mimeType={fileViewerData.mimeType}
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
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* --- Header Section Component (DYNAMIC) --- */}
        <HeaderSection
          title={actualTaskData?.ProcessName + " Additional Details"}
          {...headerHandlers}
        />

        {/* Error Alert */}
        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              color: "#DC2626",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        {/* This main div now contains all interactive and informational sections */}
        <div
          style={{
            maxHeight: "100%",
            overflowY: "auto",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ padding: "15px" }} // Reduced padding for compactness
          >
            {/* --- Remarks Section  --- */}
            <RemarksAndActions
              remarks={formData.remarks}
              onRemarksChange={(value) => {
                setFormData((prev) => ({ ...prev, remarks: value }));
                // Clear error when user types in remarks
                if (fieldErrors.remarks) {
                  setFieldErrors((prev) => ({ ...prev, remarks: "" }));
                }
              }}
              priority={priority}
              onPriorityChange={handlePriorityChange}
              onSave={handleSave}
              onSubmit={handleSubmit}
              onPreview={handlePreview}
              isSavedSuccessfully={isSavedSuccessfully}
              loading={loading}
              additionalDetails={true} 
              remarksError={fieldErrors.remarks} 
            />

            {/* --- Comments Section Component --- */}
            <CommentsHistory
              taskId={actualTaskData?.TaskId}
              processId={actualTaskData?.Processid}
              sessionId={sessionId}
              headerColor={commentsHeaderColor}
            />

            {/* --- Employee Info Section (COMPACT) --- */}
            <FormSection style={readOnlySectionStyle}>
              <div style={sectionHeaderStyle}>
                <h3 style={sectionHeadingStyle}>Employee Information</h3>
              </div>
              <div style={gridRowStyle}>
                <TextField
                  label="Employee ID"
                  value={formData.employeeid}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  size="small" // Added for compactness
                />
                <TextField
                  label="Employee Name"
                  value={formData.facultyname}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Department"
                  value={formData.department}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Designation"
                  value={formData.designation}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </div>
              <div style={gridRowStyle}>
                <TextField
                  label="Nature of Visit"
                  value={formData.natureofparticipation_value}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  type="date"
                  label="Visit From"
                  value={formData.visitfrom}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="date"
                  label="Visit To"
                  value={formData.visitto}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Country"
                  value={formData.country}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </div>
              <div style={gridRowStyle}>
                <TextField
                  label="City/Town"
                  name="city"
                  value={formData.city}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </div>
            </FormSection>

            {/* --- Office Order Details Section (COMPACT) --- */}
            <FormSection style={officeOrderSectionStyle}>
              <div
                style={{
                  ...officeOrderHeaderStyle,
                  backgroundColor: isOfficeOrderEditable
                    ? "#FFFBEB"
                    : "#ECEFF1",
                  borderBottom: isOfficeOrderExpanded
                    ? "1px solid #CFD8DC"
                    : "none",
                }}
                onClick={() => setIsOfficeOrderExpanded(!isOfficeOrderExpanded)}
              >
                <div
                  style={{ display: "flex", alignItems: "center", flexGrow: 1 }}
                >
                  <h3
                    style={{
                      ...sectionHeadingStyle,
                      color: isOfficeOrderEditable ? "#9D5A00" : "#263238",
                      marginRight: "15px",
                    }}
                  >
                    Office Order Content & Details
                  </h3>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: isOfficeOrderEditable ? "#A16207" : "#546E7A",
                      backgroundColor: isOfficeOrderEditable
                        ? "#FEF3C7"
                        : "#E0F7FA",
                      padding: "2px 6px",
                      borderRadius: "3px",
                    }}
                  >
                    {isOfficeOrderEditable
                      ? "EDITING IN PROGRESS"
                      : "READ-ONLY"}
                  </span>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isOfficeOrderEditable) {
                        Swal.fire({
                          title: "Discard Changes?",
                          text: "Are you sure you want to exit edit mode?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, Exit Edit Mode",
                        }).then((res) => {
                          if (res.isConfirmed) {
                            setIsOfficeOrderEditable(false);
                          }
                        });
                      } else {
                        setIsOfficeOrderEditable(true);
                        if (!isOfficeOrderExpanded)
                          setIsOfficeOrderExpanded(true);
                      }
                    }}
                    style={{
                      ...buttonStyle,
                      backgroundColor: isOfficeOrderEditable
                        ? "#EF4444"
                        : "#10B981",
                      padding: "4px 12px",
                      fontSize: "11px",
                      borderRadius: "4px",
                    }}
                  >
                    {isOfficeOrderEditable ? "Exit Edit Mode" : "Edit Content"}
                  </button>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#263238"
                    strokeWidth="2"
                    style={{
                      transform: isOfficeOrderExpanded
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {isOfficeOrderExpanded && (
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB" }}>
                  {" "}
                  {/* Reduced padding */}
                  <div
                    style={{
                      ...gridRowStyle,
                      gridTemplateColumns: "1fr 1fr 2fr 2fr",
                    }}
                  >
                    <TextField
                      label="Reference Number"
                      name="referencenumber"
                      value={bodyData.referencenumber}
                      onChange={handleChange}
                      InputProps={{ readOnly: !isOfficeOrderEditable }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Date"
                      name="Date"
                      type="date"
                      value={bodyData.Date}
                      onChange={handleChange}
                      InputProps={{ readOnly: !isOfficeOrderEditable }}
                      variant="outlined"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div style={gridRowTwoColumnStyles}>
                    <TextField
                      label="Subject"
                      name="subject"
                      value={bodyData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      InputProps={{ readOnly: !isOfficeOrderEditable }}
                      size="small"
                    />
                    <TextField
                      label="Ref"
                      name="refsubject"
                      value={bodyData.refsubject}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      InputProps={{ readOnly: !isOfficeOrderEditable }}
                      size="small"
                    />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    {" "}
                    {/* Reduced margin */}
                    <label style={labelStyle}>Body</label>
                    <TextEdit
                      value={bodyData.body}
                      onChange={handleBodyChange}
                      readOnly={!isOfficeOrderEditable}
                    />
                  </div>
                  <br />
                  {/* Signing Authority and TO Section side by side */}
                   <div style={gridRowTwoColumnStyles}>
                    <div>
                      {isOfficeOrderEditable ? (
                        <FormControl
                          fullWidth
                          size="small"
                          error={!!fieldErrors.signingAuthority}
                        >
                          <InputLabel>Signing Authority*</InputLabel>
                          <Select
                            value={formData.signingAuthority || ""}
                            label="Signing Authority*"
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                signingAuthority: newValue,
                              }));
                          
                            }}
                            displayEmpty
                            sx={{ height: "52px" }}
                            endAdornment={
                              formData.signingAuthority && (
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                      ...prev,
                                      signingAuthority: "",
                                    }));
                                   
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    padding: "4px",
                                    marginRight: "8px",
                                    color: "#666",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    "&:hover": {
                                      color: "#ff4444",
                                    },
                                  }}
                                >
                                  ×
                                </span>
                              )
                            }
                          >
                            {signingAuthorityOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
     
                        </FormControl>
                      ) : (
                        <TextField
                          label="Signing Authority*"
                          value={
                            signingAuthorityOptions.find(
                              (opt) => opt.value === formData.signingAuthority
                            )?.label ||
                            formData.signingAuthority ||
                            "N/A"
                          }
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": { height: "52px" },
                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 12px) scale(1)",
                            },
                            "& .MuiInputLabel-shrink": {
                              transform: "translate(14px, -9px) scale(0.75)",
                            },
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    </div>
                    <div>
                      <DropdownWithCheckboxes
                        label="To Section*"
                        options={toSectionOptions.map((opt) => ({
                          value: opt,
                          label: opt,
                        }))}
                        value={formData.toSection}
                        onChange={(selected) => {
                          handleToSectionChange(selected);
                          // Clear error when user selects/deselects options
                          if (fieldErrors.toSection) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              toSection: "",
                            }));
                          }
                        }}
                        disabled={!isOfficeOrderEditable}
                        error={!!fieldErrors.toSection}
                        helperText={fieldErrors.toSection}
                      />
                    </div>
                  </div>
                </div>
              )}
            </FormSection>
          </form>
        </div>
      </div>
    </div>
  );
};

/* --- STYLES (UPDATED FOR COMPACTNESS AND USER-FRIENDLINESS) --- */
const containerStyle = {
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "10px",
};
const cardStyle = {
  width: "100%",
  maxWidth: "1800px",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  marginTop: "10px",
}; // Reduced padding
const headingStyle = {
  marginBottom: "8px",
  color: "#3F51B5",
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "0.5px",
}; // Slightly smaller heading
const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#374151",
  fontSize: "12px",
  letterSpacing: "0.3px",
  textTransform: "uppercase",
}; // Smaller label
const buttonStyle = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
}; // Compact button

const gridRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "12px",
  marginBottom: "12px",
}; // Reduced gap and margin
const gridRowTwoColumnStyles = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginBottom: "12px",
  width: "70%",
}; // Reduced gap and margin

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "18px",
  color: "#6B7280",
};
const sectionHeadingStyle = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "600",
  letterSpacing: "0.3px",
}; // Smaller heading
const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
  borderBottom: "1px solid #CFD8DC",
  paddingBottom: "8px",
}; // Reduced margins
const readOnlySectionStyle = {
  marginBottom: "16px",
  padding: "16px",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  backgroundColor: "#F9FAFB",
  boxShadow: "0 0 5px rgba(0, 0, 0, 0.03)",
}; // Reduced padding and margin
const officeOrderSectionStyle = {
  marginBottom: "16px",
  border: "1px solid #CFD8DC",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
}; // Reduced margin and radius
const officeOrderHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
}; // Reduced padding

export default AdditionalDetails;
