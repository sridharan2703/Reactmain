


/**
 * @fileoverview ApprovalForm component for handling office order approvals.
 * Manages form data, comments, approver actions, and preview for permission cum relief tasks.
 * @module ApprovalForm
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @modifiedby Rovita
 * @modifiedon 21-11-2025
 */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import OfficeOrderPreview from "src/components/Process/PdfPreview.js";
import TextEdit from "src/views/OfficeOrder/TextEdit";
import Swal from "sweetalert2";
import { HostName } from "src/assets/host/Host";
import { HostName2 } from "src/assets/host/Host";
import { useNavigate } from "react-router-dom";
import ApproverSection from "src/components/Process/ApproverSection";
import CommentsHistory from "src/components/Process/CommentsSection";
import Dropdown from "src/components/ui/Dropdown";
import DropdownWithCheckboxes from "src/components/ui/DropdownWithCheckBox";
import FormSection from "src/components/ui/TopColorCard.js";
import Roadmap from "src/components/Process/RoadMap";
import HeaderSection from "src/components/Process/HeaderSection";
import {
  sendEncryptedData,
  decryptData,
  encryptPayloadForGo,
  validateJsonData,
} from "src/components/Encryption/EncryptionKey";
import { Typography, Box } from "@mui/material"; // For modal components
import EmployeeEfilePopup from "src/views/Menus/EmployeeFile/EmployeeEfilePopup";
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
const ApprovalForm = ({ taskData, onClose, record, showSnackbar }) => {
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
    orderType: "PCR",
    originalOrderNo: "",
  });
  const [bodyData, setBodyData] = useState({
    referencenumber: "",
    subject: "",
    body: "",
    refsubject: "",
    Date: "",
    Ref: "",
  });
  const [priority, setPriority] = useState("17");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [approverRemarks, setApproverRemarks] = useState("");
  const [approvalAction, setApprovalAction] = useState("");
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isOfficeOrderEditable, setIsOfficeOrderEditable] = useState(false);
  const [isOfficeOrderExpanded, setIsOfficeOrderExpanded] = useState(false);
  const [returnToUser, setReturnToUser] = useState("");
  const [sendBackToMe, setSendBackToMe] = useState(false);
  const [apiReturnUserOptions, setApiReturnUserOptions] = useState([]);
  const [isSigningAuthorityEnabled, setIsSigningAuthorityEnabled] =
    useState(false);
  const [fileViewerData, setFileViewerData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [processId, setProcessId] = useState(null);
  const [activityResources, setActivityResources] = useState({});
  const [signatureHtml, setSignatureHtml] = useState("");
  const [isEfilePopupOpen, setIsEfilePopupOpen] = useState(false);
  const userRole = Cookies.get("selectedRole");
  const [fieldErrors, setFieldErrors] = useState({});
  const commentsHeaderColor = "#3F51B5";
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
    { value: "", label: "Select signing authority" },
    { value: "Assistant Registrar", label: "Assistant Registrar" },
    { value: "Deputy Registrar", label: "Deputy Registrar" },
    { value: "Registrar", label: "Registrar" },
  ];
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
  const actualTaskData = useMemo(() => {
    if (!taskData) {
      return null;
    }
    if (taskData.TaskId) {
      return {
        ...taskData,
        Processid: taskData.ProcessId || taskData.Processid || "1",
        order_type: taskData.order_type || taskData.ProcessKeyword || "PCR",
        original_order_no:
          taskData.original_order_no || taskData.OriginalOrderNo || "",
        ProcessKeyword: taskData.order_type || taskData.ProcessKeyword || "PCR",
        OriginalOrderNo:
          taskData.original_order_no || taskData.OriginalOrderNo || "",
      };
    }
    if (
      taskData.Data &&
      taskData.Data.Records &&
      taskData.Data.Records.length > 0
    ) {
      const extractedRecord = taskData.Data.Records[0];
      const record = {
        ...extractedRecord,
        TaskId: extractedRecord.taskid || extractedRecord.TaskId,
        EmployeeID: extractedRecord.employeeid || extractedRecord.EmployeeID,
        CoverPageNo: extractedRecord.coverpageno || extractedRecord.CoverPageNo,
        ProcessId: extractedRecord.processid || extractedRecord.ProcessId,
        ActivitySeqNo:
          extractedRecord.activityseqno || extractedRecord.ActivitySeqNo,
        Processid:
          extractedRecord.processid || extractedRecord.ProcessId || "1",
        order_type:
          extractedRecord.order_type || extractedRecord.ProcessKeyword || "PCR",
        original_order_no:
          extractedRecord.original_order_no ||
          extractedRecord.OriginalOrderNo ||
          "",
        ProcessKeyword:
          extractedRecord.order_type || extractedRecord.ProcessKeyword || "PCR",
        OriginalOrderNo:
          extractedRecord.original_order_no ||
          extractedRecord.OriginalOrderNo ||
          "",
      };
      return record;
    }
    return null;
  }, [taskData]);
  const getSignatureHtml = useCallback((signingAuthorityValue) => {
    const selectedOption = signingAuthorityOptions.find(
      (opt) => opt.value === signingAuthorityValue
    );
    const signatureText = selectedOption
      ? selectedOption.label
      : typeof signingAuthorityValue === "string" &&
        signingAuthorityValue !== ""
      ? signingAuthorityValue
      : "";
    const htmlResult = signatureText ? `<p>${signatureText}</p>` : "";
    
    return htmlResult;
  }, []);
  const getSigningAuthorityLabel = useCallback(
    (value) => {
      const option = signingAuthorityOptions.find((opt) => opt.value === value);
      return option ? option.label : value || "N/A";
    },
    [signingAuthorityOptions]
  );
  const returnUserOptions = useMemo(() => {
    const initialOption = { value: "", label: "Select Next/Return User" };
    return [initialOption, ...apiReturnUserOptions];
  }, [apiReturnUserOptions]);
  const stripHtml = (htmlString) => {
    if (!htmlString) return "";
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || "";
  };
  const formatDateInput = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };
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
  const calculateDuration = (from, to) => {
    if (!from || !to || from.trim() === "" || to.trim() === "") return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return 0;
    const diff = toDate - fromDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };
  const sanitizeField = (value) => {
    if (typeof value === "object" && value !== null) {
      if ("value" in value) {
        return value.value || "";
      }
      return "";
    }
    if (value === null || value === undefined || value === "") return "";
    return value;
  };
  const fetchStatusIdByDescription = async (statusDescription) => {
    try {
      const sessionId = Cookies.get("session_id");
      if (!sessionId) throw new Error("Session ID missing");
      const statusValue =
        typeof statusDescription === "object"
          ? statusDescription.value || statusDescription.label
          : statusDescription;
      const payload = {
        statusdescription: statusValue,
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
      };
      const response = await sendEncryptedData("/Statusmasternew", payload);
      const encryptedData = response.Data ?? response.data;
      if (!encryptedData) throw new Error("Encrypted data missing in response");
      const decrypted = await decryptData(encryptedData);
      const parsed = validateJsonData(decrypted) ? decrypted : null;
      if (!parsed) throw new Error("Decrypted response is invalid");
      return parsed?.Data?.Records?.[0]?.statusid ?? 8;
    } catch (error) {
      return 8;
    }
  };
  const generateToColumnHtml = () => {
    const name = sanitizeField(formData.facultyname);
    const id = sanitizeField(formData.employeeid);
    const dept = sanitizeField(formData.department);
    return `<p><strong>To</strong><br>${name} (ID No. ${id})<br>Thro the Head, ${dept}</p><p><strong>Sir,</strong></p>`;
  };
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
  const fetchSendBackToMeStatus = useCallback(async () => {
    const taskId = actualTaskData?.TaskId;
    const processId = actualTaskData?.Processid;
    const activityId = actualTaskData?.ActivitySeqNo;
    const sessionId = Cookies.get("session_id");
    if (!taskId || !processId || !activityId || !sessionId) {
      setIsSigningAuthorityEnabled(true);
      return;
    }
    const SENDBACK_ENDPOINT = `${HostName2}/GetSendBackToMe`;
    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) {
        setIsSigningAuthorityEnabled(true);
        return;
      }
      const body = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        P_id: taskId,
        ProcessId: Number(processId),
        ReturnToActivityId: Number(activityId),
        TaskId: taskId,
      };
      const encryptedPayload = await encryptPayloadForGo(body);
      const response = await fetch(SENDBACK_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ Data: encryptedPayload }),
      });
      if (!response.ok) {
  
        setIsSigningAuthorityEnabled(true);
        return;
      }
      const responseText = await response.text();
      if (!responseText.trim()) {
        setIsSigningAuthorityEnabled(true);
        return;
      }
      let encryptedResponse;
      try {
        encryptedResponse = JSON.parse(responseText);
} catch (e) {
        setIsSigningAuthorityEnabled(true);
        return;
      }
      const encryptedData = encryptedResponse?.Data ?? encryptedResponse?.data;
      if (!encryptedData) {
        setIsSigningAuthorityEnabled(true);
        return;
      }
      let decryptedString;
      try {
        decryptedString = await decryptData(encryptedData);
      } catch (decryptError) {

        setIsSigningAuthorityEnabled(true);
        return;
      }
      if (typeof decryptedString !== "string" || !decryptedString.trim()) {
        setIsSigningAuthorityEnabled(true);
        return;
      }
      let parsedData;
      try {
        parsedData = validateJsonData(decryptedString)
          ? decryptedString
          : JSON.parse(decryptedString);
 
      } catch (parseError) {
setIsSigningAuthorityEnabled(true);
        return;
      }
      const records = parsedData?.Records ?? parsedData?.Data?.Records ?? {};

      const sendBackToMeValue = records.sendbacktome;
 
      let enableStatus = true;
      if (
        sendBackToMeValue === true ||
        sendBackToMeValue === "true" ||
        sendBackToMeValue === 1
      ) {
        enableStatus = false;
  
      } else {
    
      }
      setIsSigningAuthorityEnabled(enableStatus);
 
    } catch (err) {
     
      setIsSigningAuthorityEnabled(true);
    }
  }, [
    actualTaskData?.TaskId,
    actualTaskData?.Processid,
    actualTaskData?.ActivitySeqNo,
    sessionId,
    encryptPayloadForGo,
    decryptData,
    validateJsonData,
  ]);
  const fetchApiReturnUsers = useCallback(async () => {
    const taskId = actualTaskData?.TaskId;
    const sessionId = Cookies.get("session_id");
    const processId = actualTaskData?.Processid;
    const activityId = actualTaskData?.ActivitySeqNo;
    if (!taskId || !processId || !activityId) {
      return;
    }
   const RETURN_ROLE_ENDPOINT = `${HostName2}/GetReturnRole`; 
    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");
      const body = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        ProcessId: Number(processId),
        Current_Activity: Number(activityId),
        TaskId: taskId,
      };
      const encryptedPayload = await encryptPayloadForGo(body);
      const response = await fetch(RETURN_ROLE_ENDPOINT, {
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
      const records = parsedData?.Data?.Records ?? parsedData?.Records ?? [];
      const uniqueUsers = new Set();
      const options = [];
      records.forEach((r) => {
        const userId = r.user_id;
        const roleName = r.role_name;
        if (userId && !uniqueUsers.has(userId)) {
          uniqueUsers.add(userId);
          options.push({
            value: userId,
            label: roleName,
          });
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
  }, [
    actualTaskData?.TaskId,
    sessionId,
    actualTaskData?.InitiatedBy,
    actualTaskData?.Processid,
    actualTaskData?.ActivitySeqNo,
  ]);
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
      const rawSignatureHtml = dataRecord.signature_html || "";
 
      setSignatureHtml(rawSignatureHtml);
      let signingAuthorityValue = dataRecord.signing_authority || "";
      if (dataRecord.signature_html) {
        const rawText = stripHtml(dataRecord.signature_html).trim();
      
        const searchableOptions = signingAuthorityOptions.filter(
          (opt) => opt.value !== ""
        );
        const matchedOption = searchableOptions.find((option) => {
          const labelLower = option.label.toLowerCase();
          const valueLower = option.value.toLowerCase();
          const rawTextLower = rawText.toLowerCase();
          return (
            rawTextLower.includes(labelLower) ||
            rawTextLower.includes(valueLower) ||
            labelLower.includes(rawTextLower) ||
            valueLower.includes(rawTextLower) ||
            option.label.trim() === rawText ||
            option.value.trim() === rawText ||
            labelLower === rawTextLower ||
            valueLower === rawTextLower
          );
        });
        if (matchedOption) {
          signingAuthorityValue = matchedOption.value;
       
        } else {
      
          signingAuthorityValue =
            dataRecord.signing_authority || signingAuthorityValue;
        }
      } else if (signingAuthorityValue) {
      
      }
      const finalSelectedOption = signingAuthorityOptions.find(
        (opt) => opt.value === signingAuthorityValue
      );
      if (finalSelectedOption) {
        signingAuthorityValue = finalSelectedOption.value;
   
      } else if (signingAuthorityValue && signingAuthorityValue !== "") {
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
        orderType: dataRecord.order_type || "PCR",
        originalOrderNo: dataRecord.original_order_no || "",
      };
      setFormData(employeeData);
      setBodyData({
        referencenumber: dataRecord.order_no || "",
        subject: mainSubject,
        body: dataRecord.body_html || "",
        refsubject: reference || stripHtml(dataRecord.reference) || "",
        Date: formatDateInput(dataRecord.order_date),
      });
      setPriority(dataRecord.priority);
      setPreviewCoverPageNo(coverPageNo);
      setSelectedEmployeeId(employeeId);
      setTaskId(dataRecord.task_id || actualTaskData?.TaskId);
      setProcessId(dataRecord.process_id || actualTaskData?.Processid || 1);
    } catch (err) {
      setError(err.message || "Failed to fetch employee visit details");
    } finally {
      setLoading(false);
    }
  }, [actualTaskData, record, sessionId]);
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
        const responseText = await response.clone().text();
        if (!responseText.trim()) {
       
          throw new Error(
            "API returned an empty response. Possible authentication or file-not-found issue."
          );
        }
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
          (e instanceof SyntaxError && !e.message.includes("empty response")) ||
          (contentType && !contentType.includes("application/json"))
        ) {
     
          blob = await response.blob();
          mimeType = blob.type || mimeType;
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
  
      const errorMessage = err.message.includes("empty response")
        ? "Resource download failed: The server returned no data. Check file path/permissions."
        : "Failed to download file: " + err.message;
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, []);
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
  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  }, [onClose, navigate]);
  const handleCloseFileViewer = useCallback(() => {
    if (fileViewerData?.url) {
      window.URL.revokeObjectURL(fileViewerData.url); // Revoke the created URL
    }
    setFileViewerData(null);
  }, [fileViewerData]);
  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };
  useEffect(() => {
    const loadAllData = async () => {
      if (!actualTaskData?.TaskId) {
        return;
      }
      setLoading(true);
      try {
        await Promise.all([
          fetchEmployeeData(),
          fetchApiReturnUsers(),
          fetchActivityResources(),
          fetchSendBackToMeStatus(),
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
    fetchApiReturnUsers,
    fetchActivityResources,
    fetchSendBackToMeStatus,
  ]);
  const handleChange = (e) => {
    const { name, value, type, checked, disabled } = e.target;
    if (disabled) return;
    if (type === "checkbox" && isOfficeOrderEditable) {
      setFormData((prev) => {
        const current = Array.isArray(prev.toSection) ? prev.toSection : [];
        const updated = checked
          ? [...current, value]
          : current.filter((v) => v !== value);
        return { ...prev, toSection: updated };
      });
    } else if (
      isOfficeOrderEditable &&
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
    } else if (isOfficeOrderEditable) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
 const handleSigningAuthorityChange = useCallback(
    (value) => {
      let finalValue = value;
      if (typeof value === "object" && value !== null) {
        if ("value" in value) {
          finalValue = value.value;
        } else if ("label" in value) {
          const matchingOption = signingAuthorityOptions.find(
            (opt) => opt.label === value.label
          );
          finalValue = matchingOption ? matchingOption.value : value.label;
        }
      }

      setFormData((prev) => ({
        ...prev,
        signingAuthority: finalValue,
      }));
      if (!finalValue || finalValue.trim() === "") {
        setFieldErrors((prev) => ({
          ...prev,
          signingAuthority: "Signing Authority is required",
        }));
      } else {
        if (fieldErrors.signingAuthority) {
          setFieldErrors((prev) => ({ ...prev, signingAuthority: "" }));
        }
      }
      const newSignatureHtml = getSignatureHtml(finalValue);
      setSignatureHtml(newSignatureHtml);
    },
    [getSignatureHtml, signingAuthorityOptions, fieldErrors.signingAuthority]
  );
  const handleDropdownChange = useCallback(
    (name, value) => {
      if (!isOfficeOrderEditable) return;
      let finalValue = value;
      if (typeof value === "object" && value !== null && "value" in value) {
        finalValue = value.value;
      }
      if (name === "signingAuthority") {
        handleSigningAuthorityChange(finalValue);
      } else {
        setFormData((prev) => ({ ...prev, [name]: finalValue }));
      }
    },
    [isOfficeOrderEditable, handleSigningAuthorityChange]
  );
  const handleBodyChange = (value) => {
    if (!isOfficeOrderEditable) return;
    setBodyData((prev) => ({ ...prev, body: value }));
    setFormData((prev) => ({ ...prev, body: value }));
  };

  const handleToSectionChange = useCallback(
    (selected) => {
      if (!isOfficeOrderEditable) return;
      setFormData((prev) => ({ ...prev, toSection: selected }));
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
    },
    [isOfficeOrderEditable, fieldErrors.toSection]
  );
  const handleApprovalActionChange = (action) => {
    setApprovalAction(approvalAction === action ? "" : action);
    if (action !== "reject") {
      setReturnToUser("");
    }
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const jwtToken = Cookies.get("HRToken");
      const empId = Cookies.get("EmpId");
      const sessionId = Cookies.get("session_id");
      if (!jwtToken || !empId) {
        throw new Error("Authentication details missing.");
      }
      if (!sessionId) {
        throw new Error("Session ID missing.");
      }
      const taskStatusId = 22;
      const userRole = Cookies.get("selectedRole");
      const signatureHtmlValue = getSignatureHtml(formData.signingAuthority);
      const reqPayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        typeofsubmit: "draft",
        p_cover_page_no: sanitizeField(
          actualTaskData?.CoverPageNo ||
            actualTaskData?.coverpageno ||
            actualTaskData?.TaskId
        ),
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
        p_signature_html: sanitizeField(signatureHtmlValue),
        p_cc_to: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : "",
        p_footer_html: sanitizeField(formData.footer),
        p_assign_to: empId,
        p_assigned_role: userRole,
        p_task_status_id: taskStatusId,
        p_activity_seq_no: actualTaskData?.ActivitySeqNo,
        p_is_task_return: false,
        p_is_task_approved: false,
        p_initiated_by: sanitizeField(actualTaskData?.InitiatedBy || empId),
        p_initiated_on: actualTaskData?.InitiatedOn || new Date().toISOString(),
        p_updated_by: sanitizeField(empId),
        p_updated_on: new Date().toISOString(),
        p_priority: sanitizeField(String(priority)),
        p_process_id: Number(
          actualTaskData?.Processid || actualTaskData?.ProcessId
        ),
        p_remarks: sanitizeField(formData.remarks),
        p_email_flag: false,
        p_reject_flag: 0,
        p_user_role: userRole,
        p_original_order_no:
          formData.originalOrderNo || actualTaskData?.OriginalOrderNo || "",
        p_order_type:
          formData.orderType || actualTaskData?.ProcessKeyword || "PCR",
        p_task_id: actualTaskData?.TaskId || null,
        p_role: "",
        p_requested_user: "",
        p_return_to_role: "",
        p_return_to_user: "",
        p_send_back_to_me: false,
        p_send_back_to_user: "",
      };
      const encryptedPayload = await encryptPayloadForGo(reqPayload);
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
        throw new Error(`Failed to save Office Order: ${response.status}`);
      }
      const encryptedResponse = await response.json();
      const encryptedData = encryptedResponse?.Data ?? encryptedResponse?.data;
      if (!encryptedData) {
        throw new Error("Encrypted Data missing in save response");
      }
      const decryptedObj = await decryptData(encryptedData);
      const parsed =
        typeof decryptedObj === "string"
          ? JSON.parse(decryptedObj)
          : decryptedObj;
      if (!validateJsonData(parsed)) {
        throw new Error("Invalid response format from server");
      }
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
        text: err.userMessage || err.message || "Failed to save Office Order",
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
    if (!formData.signingAuthority || formData.signingAuthority.trim() === "") {
      errors.signingAuthority = "Signing Authority is required";
    }
    if (!formData.toSection || formData.toSection.length === 0) {
      errors.toSection = "To Section is required";
    }
    if (!approverRemarks || approverRemarks.trim() === "") {
      errors.remarks = "Official Remarks are required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async () => {
    if (!approvalAction) {
      Swal.fire("Select Action", "Please choose Approve or Reject.", "warning");
      return;
    }
    if (!validateRequiredFieldsForSubmit()) {
      const missingFields = [];
      if (fieldErrors.signingAuthority) missingFields.push("Signing Authority");
      if (fieldErrors.toSection) missingFields.push("To Section");
      if (fieldErrors.remarks) missingFields.push("Official Remarks");
      let errorMessage = "";
      if (missingFields.length === 3) {
        errorMessage =
          "All required fields are missing: Signing Authority, To Section, and Official Remarks";
      }
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
    if (approvalAction === "reject" && !returnToUser) {
      Swal.fire(
        "User Required",
        "Please select a user to return the task to.",
        "warning"
      );
      return;
    }
    const orderType =
      formData.orderType ||
      actualTaskData?.order_type ||
      actualTaskData?.ProcessKeyword ||
      "PCR";
    const originalOrderNo =
      formData.originalOrderNo ||
      actualTaskData?.original_order_no ||
      actualTaskData?.OriginalOrderNo ||
      "";
    const isApprove = approvalAction === "approve";
    const isReject = approvalAction === "reject";
    const result = await Swal.fire({
      title: isApprove ? "Approve Request?" : "Reject & Return Request?",
      text: `Are you sure you want to ${
        isApprove ? "approve" : "reject and return"
      }?`,
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10B981" : "#EF4444",
      confirmButtonText: isApprove ? "Yes, Approve" : "Yes, Reject and Return",
    });
    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const jwtToken = Cookies.get("HRToken");
      const empId = Cookies.get("EmpId");
      const sessionId = Cookies.get("session_id");
      if (!jwtToken || !empId) {
        throw new Error("Authentication details missing.");
      }
      if (!sessionId) {
        throw new Error("Session ID missing.");
      }
      const userRole = Cookies.get("selectedRole");
      const signatureHtmlValue = getSignatureHtml(formData.signingAuthority);
      const updatePayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        typeofsubmit: "submit",
        p_cover_page_no: sanitizeField(
          actualTaskData?.CoverPageNo ||
            actualTaskData?.coverpageno ||
            actualTaskData?.TaskId
        ),
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
        p_signature_html: sanitizeField(signatureHtmlValue),
        p_cc_to: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : "",
        p_footer_html: sanitizeField(formData.footer),
        p_task_status_id: isApprove ? 4 : 10,
        p_activity_seq_no: actualTaskData?.ActivitySeqNo || 0,
        p_is_task_return: isReject,
        p_is_task_approved: isApprove,
        p_initiated_by: sanitizeField(actualTaskData?.InitiatedBy || empId),
        p_initiated_on: actualTaskData?.InitiatedOn || new Date().toISOString(),
        p_updated_by: sanitizeField(empId),
        p_updated_on: new Date().toISOString(),
        p_priority: sanitizeField(String(priority)),
        p_process_id: Number(
          actualTaskData?.Processid || actualTaskData?.ProcessId
        ),
        p_remarks: sanitizeField(approverRemarks),
        p_original_order_no: originalOrderNo,
        p_order_type: orderType,
        p_task_id: actualTaskData?.TaskId || null,
        p_role: "",
        p_requested_user: isReject ? empId : "",
        p_return_to_role: isReject
          ? returnUserOptions.find((opt) => opt.value === returnToUser)
              ?.label || ""
          : "",
        p_return_to_user: isReject ? returnToUser : "",
        p_send_back_to_me: sendBackToMe,
        p_send_back_to_user: sendBackToMe ? empId : "",
        p_user_role: userRole,
      };
      const encryptedPayload = await encryptPayloadForGo(updatePayload);
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
        throw new Error(
          `Failed to submit: ${response.status} ${response.statusText}`
        );
      }
      const encryptedResponse = await response.json();
      const encryptedData = encryptedResponse?.Data ?? encryptedResponse?.data;
      if (!encryptedData) {
        throw new Error("Encrypted Data missing in submit response");
      }
      const decryptedObj = await decryptData(encryptedData);
      const parsed =
        typeof decryptedObj === "string"
          ? JSON.parse(decryptedObj)
          : decryptedObj;
      if (!validateJsonData(parsed)) {
        throw new Error("Invalid response format from server");
      }
      Swal.fire({
        title: "Success!",
        text: `The task has been ${
          isApprove ? "approved" : "rejected"
        } successfully.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => navigate("/inbox"), 2000);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.userMessage || err.message || "Failed to update Office Order",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handlePreview = async () => {
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
      onGuidelinesClick: () => handleResourceClick("guidelines"),
      onVideoClick: () => handleResourceClick("video"),
      onHelDocClick: () => handleResourceClick("helpdoc"),
      onFlowchartClick: () => handleResourceClick("flowchart"),
      onEfileClick: handleEFile, // Use the popup handler for E-File
    }),
    [handleResourceClick, handleEFile]
  );
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
        <HeaderSection
          title={actualTaskData?.ProcessName + " Approval"}
          {...headerHandlers}
        />
        <EmployeeEfilePopup
          type="efile"
          open={isEfilePopupOpen}
          onClose={handleCloseEfilePopup}
          employeeId={selectedEmployeeId}
          userRole={userRole}
          sessionId={sessionId}
        />
        <Roadmap
          processId={actualTaskData?.Processid}
          currentActivity={actualTaskData?.ActivitySeqNo}
          signingAuthority={formData.signingAuthority}
          sessionId={sessionId}
        />
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
            style={{ padding: "15px" }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                padding: "5px",
                marginBottom: "5px",
              }}
            >

              <ApproverSection
                approvalAction={approvalAction}
                handleApprovalActionChange={handleApprovalActionChange}
                returnToUser={returnToUser}
                setReturnToUser={setReturnToUser}
                returnUserOptions={returnUserOptions}
                approverRemarks={approverRemarks}
                setApproverRemarks={(value) => {
                  setApproverRemarks(value);
                  if (!value || value.trim() === "") {
                    setFieldErrors((prev) => ({
                      ...prev,
                      remarks: "Official Remarks are required",
                    }));
                  } else {
                    if (fieldErrors.remarks) {
                      setFieldErrors((prev) => ({ ...prev, remarks: "" }));
                    }
                  }
                }}
                handleSave={handleSave}
                handleSubmit={handleSubmit}
                handlePreview={handlePreview}
                sendBackToMe={sendBackToMe}
                setSendBackToMe={setSendBackToMe}
                priority={priority}
                setPriority={setPriority}
                onCancel={handleCancel}
                remarksError={fieldErrors.remarks}
              />
            </div>
            <CommentsHistory
              taskId={actualTaskData?.TaskId}
              processId={actualTaskData?.Processid}
              sessionId={sessionId}
              headerColor={commentsHeaderColor}
            />
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
                  size="small"
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
                            setIsOfficeOrderExpanded(false);
                          }
                        });
                      } else {
                        setIsOfficeOrderEditable(true);
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
                <div style={{ padding: "50px", backgroundColor: "#F9FAFB" }}>
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
                    <label style={labelStyle}>Body</label>
                    <TextEdit
                      value={bodyData.body}
                      onChange={handleBodyChange}
                      readOnly={!isOfficeOrderEditable}
                    />
                  </div>
                  <br />
                  <div style={gridRowTwoColumnStyles}>
                    <div style={{ height: "44px" }}>
                      {isOfficeOrderEditable ? (
                        <div>
                          <Dropdown
                            label="Signing Authority *"
                            name="signingAuthority"
                            value={
                              formData.signingAuthority
                                ? {
                                    value: formData.signingAuthority,
                                    label: getSigningAuthorityLabel(
                                      formData.signingAuthority
                                    ),
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              handleDropdownChange(
                                "signingAuthority",
                                selectedOption?.value || ""
                              );
                            }}
                            options={signingAuthorityOptions}
                            inputStyleOverride={{
                              height: "44px",
                              backgroundColor: "#FFFFFF",
                            }}
                            error={!!fieldErrors.signingAuthority}
                            helperText={fieldErrors.signingAuthority}
                          />
                        </div>
                      ) : (
                        <TextField
                          label="Signing Authority"
                          value={getSigningAuthorityLabel(
                            formData.signingAuthority
                          )}
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                    </div>
                    <div style={{ height: "44px" }}>
                      <DropdownWithCheckboxes
                        label="To Section *"
                        options={toSectionOptions.map((opt) => ({
                          value: opt,
                          label: opt,
                        }))}
                        value={formData.toSection}
                        onChange={handleToSectionChange}
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
/* --- STYLES --- */
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
};
const headingStyle = {
  marginBottom: "8px",
  color: "#3F51B5",
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "0.5px",
};
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
export default ApprovalForm;