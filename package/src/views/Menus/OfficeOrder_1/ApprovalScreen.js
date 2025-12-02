import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import OfficeOrderPreview from "src/views/OfficeOrder/OfficeOrderPreview.js";
import {
  decryptData,
  validateJsonData,
} from "src/components/Decryption/Decrypt";
import Alerts from "src/components/ui/Alerts.js";
import TextEdit from "src/views/OfficeOrder/TextEdit";
import Swal from "sweetalert2";
import { HostName } from "src/assets/host/Host";
import { useNavigate } from "react-router-dom";
import ApproverSection from "src/components/Process/ApproverSection";
import CommentsSection from "src/components/Process/CommentsSection";
import Dropdown from "src/components/ui/Dropdown";

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
  const [apiReturnUserOptions, setApiReturnUserOptions] = useState([]);

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
        Processid:
          extractedRecord.ProcessId || extractedRecord.Processid || "1",
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
    { value: "", label: "Select signing authority" },
    { value: "Deputy Registrar", label: "Deputy Registrar" },
    { value: "Assistant Registrar", label: "Assistant Registrar" },
    { value: "Registrar", label: "Registrar" },
  ];

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
    if (value === null || value === undefined || value === "") return "";
    return value;
  };

  const fetchStatusIdByDescription = async (statusDescription) => {
    const jwtToken = Cookies.get("HRToken");
    if (!jwtToken) throw new Error("Authentication token missing.");

    const statusResponse = await fetch(
      "https://wftest1.iitm.ac.in:7000/Statusmasternew",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          statusdescription: statusDescription,
          token: "HRFGVJISOVp1fncC",
          session_id: sessionId,
        }),
      }
    );

    if (!statusResponse.ok)
      throw new Error(`Failed to fetch status for ${statusDescription}`);

    const encryptedStatus = await statusResponse.json();
    const encryptedPayload = encryptedStatus.Data ?? encryptedStatus.data;
    if (!encryptedPayload)
      throw new Error("Encrypted data missing in status response");

    const decryptedString = await decryptData(encryptedPayload);
    const validStatusData = validateJsonData(decryptedString);
    return validStatusData?.Data?.Records?.[0]?.statusid ?? 8;
  };

  const generateToColumnHtml = () => {
    const name = sanitizeField(formData.facultyname);
    const id = sanitizeField(formData.employeeid);
    const dept = sanitizeField(formData.department);
    return `<p><strong>To</strong><br>${name} (ID No. ${id})<br>Thro the Head, ${dept}</p><p><strong>Sir,</strong></p>`;
  };

const fetchApiReturnUsers = useCallback(async () => {
  const taskId = actualTaskData?.TaskId;
  const currentEmpId = Cookies.get("EmpId");
  
  if (!taskId) {
    return;
  }

  try {
    const jwtToken = Cookies.get("HRToken");
    if (!jwtToken) throw new Error("Authentication token missing.");

    const body = {
      token: "HRFGVJISOVp1fncC",
      session_id: sessionId,
      task_id: taskId,
    };

    const response = await fetch(
      "https://wftest1.iitm.ac.in:7000/OfficeOrder_ReturnDropdown",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch return users: ${response.status}`);
    }

    const encryptedData = await response.json();
    const encryptedPayload = encryptedData.Data ?? encryptedData.data;
    
    if (!encryptedPayload) {
      throw new Error("Encrypted Data missing in return users response");
    }

    const decryptedString = await decryptData(encryptedPayload);
    const parsedData = validateJsonData(decryptedString);

    const records = parsedData?.Records ?? 
                   parsedData?.Data?.Records ?? 
                   [];
    
    const uniqueUsers = new Set();
    const options = [];

    records.forEach((r) => {
      const userId = r.comment_by;
      
      // Changed: Removed the currentEmpId check - allow returning to any user including self
      if (userId && !uniqueUsers.has(userId)) {
        uniqueUsers.add(userId);
        const firstName = r.firstname || "";
        const role = r.comment_role || "";
        
        const label = role
        
        options.push({
          value: userId,
          label: label,
        });
      }
    });
    
    // Add initiator if available and not already in list
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
    console.error("Fetch Return Users Error:", err);
    Swal.fire({
      title: "Error",
      text: "Failed to load return user options. Please try again.",
      icon: "error",
    });
  }
}, [actualTaskData?.TaskId, sessionId, actualTaskData?.InitiatedBy]);
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
      if (!jwtToken) throw new Error("Authentication token missing.");

      const body = {
        token: "HRFGVJISOVp1fncC",
        employeeid: employeeId,
        coverpageno: coverPageNo,
        session_id: sessionId,
      };

      const response = await fetch(
        "https://wftest1.iitm.ac.in:7000/OfficeOrder_taskvisitdetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const encryptedData = await response.json();
      const encryptedPayload = encryptedData.Data ?? encryptedData.data;
      if (!encryptedPayload) {
        throw new Error(
          "Encrypted Data missing in task visit details response"
        );
      }

      const decryptedString = await decryptData(encryptedPayload);
      const parsedData = validateJsonData(decryptedString);

      const records = parsedData?.Records ?? parsedData?.Data?.Records ?? [];
      if (records.length === 0) {
        throw new Error("No records found in task visit details response");
      }

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
    } catch (err) {
      setError(err.message || "Failed to fetch employee data");
    } finally {
      setLoading(false);
    }
  }, [actualTaskData, record, sessionId]);

  const fetchCommentsData = useCallback(async () => {
    const officeOrderId = actualTaskData?.TaskId;
    if (!officeOrderId) return;

    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");

      const body = {
        token: "HRFGVJISOVp1fncC",
        taskid: officeOrderId,
        session_id: sessionId,
      };

      const response = await fetch(
        "https://wftest1.iitm.ac.in:7000/OfficeOrder_approval_remarks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const encryptedData = await response.json();
      const encryptedPayload = encryptedData.Data ?? encryptedData.data;
      if (!encryptedPayload)
        throw new Error("Encrypted Data missing in comments response");

      const decryptedString = await decryptData(encryptedPayload);
      const parsedData = validateJsonData(decryptedString);

      const records = parsedData?.Records ?? parsedData?.Data?.Records ?? [];
      const commentsArray = records.map((r, index) => ({
        id: index + 1,
        commenter: r.UpdatedBy || "Unknown",
        role: r.UserRole,
        comment: r.Remarks || "",
        date: new Date(r.UpdatedOn).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      }));
      setInitiatorComments(commentsArray);
    } catch (err) {
      console.error("Fetch Comments Error:", err);
    }
  }, [actualTaskData?.TaskId, sessionId]);

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

  const handleBodyChange = (value) => {
    if (!isOfficeOrderEditable) return;
    setBodyData((prev) => ({ ...prev, body: value }));
    setFormData((prev) => ({ ...prev, body: value }));
  };

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
      if (!jwtToken || !empId)
        throw new Error("Authentication details missing.");

      const taskStatusId = await fetchStatusIdByDescription("saveandhold");
      const userRole = Cookies.get("selectedRole");

      const reqpayload = {
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
        p_signature_html: sanitizeField(formData.signingAuthority),
        p_cc_to: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : "",
        p_footer_html: sanitizeField(formData.footer),
        p_assign_to: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : "",
        p_assigned_role: actualTaskData?.AssignedRole || "Approver",
        p_task_status_id: taskStatusId,
        p_activity_seq_no: actualTaskData?.ActivitySeqNo || 0,
        p_is_task_return: false,
        p_is_task_approved: false,
        p_initiated_by: sanitizeField(actualTaskData?.InitiatedBy || empId),
        p_initiated_on: actualTaskData?.InitiatedOn || new Date().toISOString(),
        p_updated_by: sanitizeField(empId),
        p_updated_on: new Date().toISOString(),
        p_process_id: Number(
          actualTaskData?.Processid || actualTaskData?.ProcessId || 1
        ),
        p_remarks: sanitizeField(formData.remarks),
        p_email_flag: false,
        p_reject_flag: 0,
        p_user_role: userRole || "",
      };

      const response = await fetch(
        `${HostName}/OfficeOrder_InsertOfficedetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(reqpayload),
        }
      );

      if (!response.ok) throw new Error("Failed to save Office Order");

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

  const handleSubmit = async () => {
    if (!approvalAction) {
      Swal.fire("Select Action", "Please choose Approve or Reject.", "warning");
      return;
    }
    if (!approverRemarks.trim()) {
      Swal.fire(
        "Remarks Required",
        "Please fill in Official Remarks.",
        "warning"
      );
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
      if (!jwtToken || !empId)
        throw new Error("Authentication details missing.");

      const userRole = Cookies.get("selectedRole");

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
        p_signature_html: sanitizeField(formData.signingAuthority),
        p_cc_to: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : "",
        p_footer_html: sanitizeField(formData.footer),
        p_assign_to: isReject
          ? sanitizeField(returnToUser)
          : sanitizeField(empId),
        p_assigned_role: actualTaskData?.AssignedRole || "Reviewer",
        p_task_status_id: isApprove ? 4 : 10,
        p_activity_seq_no: actualTaskData?.ActivitySeqNo || 0,
        p_is_task_return: isReject,
        p_is_task_approved: isApprove,
        p_initiated_by: sanitizeField(actualTaskData?.InitiatedBy || empId),
        p_initiated_on: actualTaskData?.InitiatedOn || new Date().toISOString(),
        p_updated_by: sanitizeField(empId),
        p_updated_on: new Date().toISOString(),
        p_process_id: Number(
          actualTaskData?.Processid || actualTaskData?.ProcessId || 1
        ),
        p_remarks: sanitizeField(approverRemarks),
        p_email_flag: false,
        p_reject_flag: isReject ? 1 : 0,
        p_user_role: userRole || "",
      };

      const response = await fetch(
        `${HostName}/OfficeOrder_InsertOfficedetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.statusText}`);
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
        text: err.message || "Failed to update Office Order",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const coverPageNo =
      actualTaskData?.CoverPageNo ||
      actualTaskData?.coverpageno ||
      actualTaskData?.TaskId;
    if (!coverPageNo || !formData.employeeid) {
      Swal.fire(
        "Missing Data",
        "Cannot generate preview: Missing required data.",
        "warning"
      );
      return;
    }
    setPreviewCoverPageNo(coverPageNo);
    setSelectedEmployeeId(formData.employeeid);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setShowPreview(false);
  };

  const handleBack = () => navigate(-1);

  if (loading) return <div style={loadingStyle}>Loading employee data...</div>;

  if (showPreview) {
    return (
      <OfficeOrderPreview
        coverpageno={previewCoverPageNo}
        formData={currentPreviewData.formData}
        bodyData={currentPreviewData.bodyData}
        onBack={handleClosePreview}
        employeeid={selectedEmployeeId}
        isLocalPreview={true}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div
          style={{
            paddingBottom: "10px",
            marginBottom: "20px",
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <h2 style={headingStyle}>Permission Cum Relief Approval</h2>
        </div>

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
            {/* --- Approver Section Component (STICKY BOX) --- */}
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
                setApproverRemarks={setApproverRemarks}
                handleSave={handleSave}
                handleSubmit={handleSubmit}
                handlePreview={handlePreview}
              />
            </div>

            {/* --- Comments Section Component --- */}
            <CommentsSection
              comments={initiatorComments}
              loading={loading && initiatorComments.length === 0}
            />

            {/* --- Employee Info Section (COMPACT) --- */}
            <div style={readOnlySectionStyle}>
              <div style={sectionHeaderStyle}>
                <h3 style={sectionHeadingStyle}>
                  Employee Information (Read-Only)
                </h3>
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
            </div>

            {/* --- Office Order Details Section (COMPACT) --- */}
            <div style={officeOrderSectionStyle}>
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
                        ? "#10B981"
                        : "#10B981",
                      padding: "4px 12px",
                      fontSize: "11px",
                      borderRadius: "4px",
                    }}
                  >
                    {isOfficeOrderEditable ? "Edit Content" : "Edit Content"}
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
                  <div style={gridRowStyle}>
                    <Dropdown
                      label="Signing Authority"
                      name="signingAuthority"
                      value={formData.signingAuthority}
                      onChange={handleChange}
                      disabled={!isOfficeOrderEditable}
                      options={signingAuthorityOptions}
                      inputStyleOverride={{ height: "44px" }} // Compact height
                    />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    {" "}
                    {/* Reduced margin */}
                    <label style={labelStyle}>CC TO Section</label>
                    <div style={checkboxGridStyle}>
                      {toSectionOptions.map((opt) => (
                        <div key={opt} style={checkboxItemStyle}>
                          <input
                            type="checkbox"
                            name="toSection"
                            value={opt}
                            checked={formData.toSection.includes(opt)}
                            onChange={handleChange}
                            style={{ marginRight: "8px" }}
                            disabled={!isOfficeOrderEditable}
                          />
                          <span
                            style={{
                              fontSize: "13px",
                              opacity: !isOfficeOrderEditable ? 0.6 : 1,
                            }}
                          >
                            {opt}
                          </span>{" "}
                          {/* Smaller font */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
  backgroundColor: "#f9fafb",
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
const backButtonStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#6B7280",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
  marginBottom: "10px",
  fontSize: "14px",
  display: "inline-block",
};
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
const checkboxGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "6px",
  marginTop: "6px",
  padding: "10px",
  border: "1px solid #CFD8DC",
  borderRadius: "4px",
  backgroundColor: "#FFFFFF",
}; // Compact checkbox grid
const checkboxItemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "4px",
}; // Reduced margin
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
  fontWeight: "700",
  color: "#3F51B5",
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
