import React, { useState, useEffect, useMemo, useCallback } from "react";
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

const ApprovalForm = ({ onClose, record, taskData }) => {
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
  const actualTaskData = useMemo(() => {
    if (!taskData) {
      return null;
    }
    if (taskData.TaskId || taskData.CoverPageNo) {
      return {
        ...taskData,
        coverpageno: taskData.coverpageno || taskData.CoverPageNo,
        employeeid: taskData.employeeid || taskData.EmployeeId,
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
        coverpageno: extractedRecord.coverpageno,
        employeeid: extractedRecord.employeeid,
        Processid:
          extractedRecord.ProcessId || extractedRecord.Processid || "1",
      };
    }

    return null;
  }, [taskData]);
  const [initiatorComments] = useState([
    {
      id: 1,
      date: "2025-10-05",
      commenter: "Dr. Rajesh Kumar",
      role: "Initiator",
      comment:
        "Request for approval of international conference attendance. All supporting documents are attached.",
    },
    {
      id: 2,
      date: "2025-10-07",
      commenter: "Dr. Rajesh Kumar",
      role: "Initiator",
      comment:
        "Updated the travel dates as per the conference schedule change.",
    },
    {
      id: 3,
      date: "2025-10-08",
      commenter: "Prof. Anitha Sharma",
      role: "HOD",
      comment:
        "Forwarding for further approval. The conference is relevant to ongoing research.",
    },
  ]);

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
  const fetchEmployeeData = useCallback(async () => {
    const empIdForFetch = actualTaskData?.employeeid;
    const coverpageForFetch = actualTaskData?.coverpageno;

    console.log(
      "Fetching task details for CoverPage:",
      coverpageForFetch,
      "EmpID:",
      empIdForFetch
    );

    if (!coverpageForFetch || !empIdForFetch) {
      console.warn(
        "CoverPageNo or EmployeeID missing for fetching details:",
        actualTaskData
      );
      setLoading(false);
      setError(
        "Required data (CoverPageNo/EmployeeID) missing to load form details."
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");

      const body = {
        employeeid: empIdForFetch, // Use employeeid from task data
        coverpageno: coverpageForFetch, // Use coverpageno from task data
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        taskstatusid: "4",
      };

      const response = await fetch(
        `${HostName}/OfficeOrder_approval_empdetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok)
        throw new Error(`API request failed: ${response.status}`);

      const encryptedData = await response.json();
      const encryptedPayload = encryptedData.Data ?? encryptedData.data;
      if (!encryptedPayload) throw new Error("Encrypted Data missing");

      const decryptedString = await decryptData(encryptedPayload);
      const parsedData = validateJsonData(decryptedString);

      const records = parsedData?.Records ?? parsedData?.Data?.Records ?? [];
      if (records.length === 0)
        throw new Error("No records found for this task.");

      const record = records[0];
      const formatDate = (dateValue) => {
        if (!dateValue) return "";
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
      };

      setFormData({
        employeeid: record.employeeid || empIdForFetch,
        facultyname: record.FacultyName || "",
        department: record.Department || "",
        designation: record.Designation || "",
        visitfrom: formatDate(record.VisitFrom),
        visitto: formatDate(record.VisitTo),
        natureofparticipation_value: record.NatureOfParticipation || "",
        country: record.Country?.trim() || "",
        city: record.CityTown || "",
        claimtype: record.ClaimType || "",
        signingAuthority: record.SigningAuthority || "",
        toSection: record.AssignTo ? [record.AssignTo] : [],
        remarks: record.Remarks || "",
      });
      setSelectedEmployeeId(empIdForFetch);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(err.message || "Failed to fetch employee data.");
    } finally {
      setLoading(false);
    }
  }, [actualTaskData, sessionId]); // Dependency on actualTaskData and sessionId

  /*************************Body Fetch*************************/
  const handleInsertDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      const empId = Cookies.get("EmpId");
      const coverpage =
        actualTaskData?.coverpageno || record?.coverpageno || ""; // Use actualTaskData if available

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!empId) throw new Error("Employee ID missing in cookies.");

      const formatTimestamp = (dateStr, hour = "09:00:00") => {
        if (!dateStr || !dateStr.trim()) return null;
        if (dateStr.includes("T")) return dateStr;
        return `${dateStr}T${hour}`;
      };

      const calculateDuration = (from, to) => {
        if (!from || !to) return 0;
        const diff = new Date(to) - new Date(from);
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
      };

      const responsepayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        p_coverpageno: coverpage,
        p_employeeid: actualTaskData?.employeeid || record?.employeeid || empId, // Use data from task/actualTaskData
        p_facultyname: record?.applicant || formData.facultyname,
        p_department: record?.department || formData.department,
        p_designation: record?.designation || formData.designation,
        p_visitfrom: formatTimestamp(
          formData?.visitfrom || record?.visitfrom,
          "09:00:00"
        ),
        p_visitto: formatTimestamp(
          formData?.visitto || record?.visitto,
          "17:00:00"
        ),
        p_duration: calculateDuration(
          formData?.visitfrom || record?.visitfrom,
          formData?.visitto || record?.visitto
        ),
        p_leavetype: JSON.stringify(record.leaveDetails || []),
        p_natureofparticipation:
          formData?.natureofparticipation_value || record?.natureOfvisit,
        p_claimtype: formData?.claimtype || record?.claimtype,
        p_country: formData?.country || record?.country,
        p_citytown: formData?.city || record?.city,
        p_signingauthority: null,
        p_receipientto: "",
        p_assignto: null,
        p_assignedrole: null,
        p_taskstatusid: 0,
        p_activityseqno: 0,
        p_istaskreturn: 0,
        p_istaskapproved: 0,
        p_initiatedby: "null",
        p_initiatedon: new Date().toISOString(),
        p_updatedby: "WF_Initiator",
        p_updatedon: new Date().toISOString(),
        p_template: "null",
        p_body: "bodyDa.body", // <-- CHECK THIS HARDCODED VALUE
        p_header: "null",
        p_footer: "null",
        p_referencenumber: "",
        p_subject: "null",
        p_remarks: "remarks", // <-- CHECK THIS HARDCODED VALUE
        p_Date: "",
        p_Ref: "",
      };

      const response = await fetch(
        `${HostName}/OfficeOrder_InsertOfficedetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(responsepayload),
        }
      );

      if (!response.ok) throw new Error("Insert failed");
      await response.json();
    } catch (err) {
      console.error("Insert API Error:", err);
      setError(err.message || "Insert failed");
      Swal.fire({
        title: "Error",
        text: err.message || "Insert failed",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const initializeData = async () => {
      if (actualTaskData?.coverpageno && actualTaskData?.employeeid) {
        try {
          setLoading(true);
          await fetchEmployeeData();
        } catch (error) {
          console.error("Initialization error:", error);
          setError(error.message || "Failed to initialize form data");
        } finally {
          setLoading(false);
        }
      }
    };

    initializeData();
  }, [actualTaskData, fetchEmployeeData]); // Dependencies updated

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const current = Array.isArray(prev.toSection) ? prev.toSection : [];
        const updated = checked
          ? [...current, value]
          : current.filter((v) => v !== value);
        return { ...prev, toSection: updated };
      });
    } else if (["referencenumber", "subject"].includes(name)) {
      setBodyData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApprovalActionChange = (action) => {
    setApprovalAction(approvalAction === action ? "" : action);
  };

  const handleFinalSubmit = async () => {
    if (!approvalAction) {
      Swal.fire({
        title: "Warning",
        text: "Please select either Approve or Reject",
        icon: "warning",
      });
      return;
    }

    if (!approverRemarks.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Please provide remarks before submitting",
        icon: "warning",
      });
      return;
    }

    const isApprove = approvalAction === "approve";

    Swal.fire({
      title: isApprove ? "Approve Request?" : "Reject Request?",
      text: `Are you sure you want to ${
        isApprove ? "approve" : "reject"
      } this request?`,
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: isApprove ? "Yes, Approve" : "Yes, Reject",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(
          `Submitting ${approvalAction} with remarks: ${approverRemarks}`
        );
        Swal.fire({
          title: isApprove ? "Approved!" : "Rejected!",
          text: `The request has been ${
            isApprove ? "approved" : "rejected"
          } successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      const empId = Cookies.get("EmpId");
      const coverpageno =
        actualTaskData?.coverpageno || record?.coverpageno || "";

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!empId) throw new Error("Employee ID missing in cookies.");

      const payload = {
        token: "HRFGVJISOVp1fncC",
        employeeid: empId, // Updated by cookie/session ID?
        coverpageno: coverpageno,
        Body: bodyData.body,
        Subject: bodyData.subject,
        Referencenumber: bodyData.referenceNo || bodyData.referencenumber, // Check which field is used in API call
        session_id: sessionId,
      };

      const response = await fetch(`${HostName}/Officeordertemppoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update Office Order");
      await response.json();

      Swal.fire({
        title: "Saved!",
        text: "Changes have been saved successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setPreviewCoverPageNo(coverpageno);
      setShowPreview(false);
    } catch (err) {
      console.error("Update API Error:", err);
      setError(err.message || "Failed to update Office Order");
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to update Office Order",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      const empId = Cookies.get("EmpId");
      const coverpageno =
        actualTaskData?.coverpageno || record?.coverpageno || "";
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!empId) throw new Error("Employee ID missing in cookies.");

      const statusResponse = await fetch(
        "https://wftest1.iitm.ac.in:7000/Statusmasternew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            statusdescription: "saveandhold",
            token: "HRFGVJISOVp1fncC",
            session_id: sessionId,
          }),
        }
      );

      if (!statusResponse.ok) throw new Error("Failed to fetch status");

      const encryptedStatus = await statusResponse.json();
      const encryptedPayload = encryptedStatus.Data ?? encryptedStatus.data;
      if (!encryptedPayload) throw new Error("Encrypted data missing");

      const decryptedString = await decryptData(encryptedPayload);
      const validStatusData = validateJsonData(decryptedString);
      const taskStatusId = validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

      const reqpayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        p_coverpageno: coverpageno,
        p_employeeid: actualTaskData?.employeeid || record?.employeeid || empId,
        p_facultyname: formData.facultyname || record?.applicant,
        p_department: formData.department || record?.department,
        p_designation: formData.designation || record?.designation,
        p_visitfrom: formatTimestamp(
          formData?.visitfrom || record?.visitfrom,
          "09:00:00"
        ),
        p_visitto: formatTimestamp(
          formData?.visitto || record?.visitto,
          "17:00:00"
        ),
        p_duration: 0, // Should be calculated based on formData/record dates
        p_leavetype: JSON.stringify(record.leaveDetails || []),
        p_natureofparticipation:
          formData?.natureofparticipation_value || record?.natureOfvisit,
        p_claimtype: formData?.claimtype || record?.claimtype,
        p_country: formData?.country || record?.country,
        p_citytown: formData?.city || record?.city,
        p_signingauthority: formData.signingAuthority,
        p_receipientto: "",
        p_assignto: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : formData.toSection || "",
        p_assignedrole: "Approver",
        p_taskstatusid: taskStatusId,
        p_activityseqno: 0,
        p_istaskreturn: 0,
        p_istaskapproved: 0,
        p_initiatedby: "admin",
        p_initiatedon: new Date().toISOString(),
        p_updatedby: "admin",
        p_updatedon: new Date().toISOString(),
        p_template: "Template1",
        p_body: bodyData.body,
        p_header: bodyData.header || "",
        p_footer: bodyData.footer,
        p_referencenumber: bodyData.referenceNo || "",
        p_subject: bodyData.subject || "",
        p_remarks: formData.remarks,
        p_Date: bodyData.referenceDate,
        p_Ref: bodyData.refsubject,
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

      if (!response.ok) throw new Error("Failed to insert Office Order");
      await response.json();

      Swal.fire({
        title: "Saved!",
        text: "The task has been saved and put on hold successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Insert API Error:", err);
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      const empId = Cookies.get("EmpId");
      const coverpageno =
        actualTaskData?.coverpageno || record?.coverpageno || "";
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!empId) throw new Error("Employee ID missing in cookies.");

      const statusResponse = await fetch(
        "https://wftest1.iitm.ac.in:7000/Statusmasternew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            statusdescription: "ongoing",
            token: "HRFGVJISOVp1fncC",
            session_id: sessionId,
          }),
        }
      );

      if (!statusResponse.ok) throw new Error("Failed to fetch status");

      const encryptedStatus = await statusResponse.json();
      const encryptedPayload = encryptedStatus.Data ?? encryptedStatus.data;
      if (!encryptedPayload) throw new Error("Encrypted data missing");

      const decryptedString = await decryptData(encryptedPayload);
      const validStatusData = validateJsonData(decryptedString);
      const taskStatusId = validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

      const requestpayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        p_coverpageno: coverpageno,
        p_employeeid: formData.employeeid,
        p_facultyname: formData.facultyname,
        p_department: formData.department,
        p_designation: formData.designation,
        p_visitfrom: formData.visitfrom
          ? `${formData.visitfrom}T09:00:00Z`
          : null,
        p_visitto: formData.visitto ? `${formData.visitto}T17:00:00Z` : null,
        p_duration:
          formData.visitfrom && formData.visitto
            ? Math.ceil(
                (new Date(formData.visitto) - new Date(formData.visitfrom)) /
                  (1000 * 60 * 60 * 24) +
                  1
              )
            : 0,
        p_leavetype: JSON.stringify(record.leaveDetails || []),
        p_natureofparticipation: formData.natureofparticipation_value,
        p_claimtype: formData.claimtype,
        p_country: formData.country,
        p_citytown: formData.city,
        p_signingauthority: formData.signingAuthority,
        p_receipientto: "Initiator",
        p_assignto: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : formData.toSection || "",
        p_assignedrole: "Approver",
        p_taskstatusid: taskStatusId,
        p_activityseqno: 0,
        p_istaskreturn: 0,
        p_istaskapproved: 0,
        p_initiatedby: "admin",
        p_initiatedon: new Date().toISOString(),
        p_updatedby: "admin",
        p_updatedon: new Date().toISOString(),
        p_template: "Template1",
        p_body: bodyData.body,
        p_header: bodyData.header || "",
        p_footer: bodyData.footer,
        p_referencenumber: bodyData.referenceNo || "",
        p_subject: bodyData.subject || "",
        p_remarks: formData.remarks,
        p_Date: bodyData.referenceDate,
        p_Ref: bodyData.refsubject,
      };

      const response = await fetch(
        `${HostName}/OfficeOrder_InsertOfficedetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestpayload),
        }
      );

      if (!response.ok) throw new Error("Failed to insert Office Order");
      await response.json();

      Swal.fire({
        title: "Saved!",
        text: "The task has been saved and put on hold successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Insert API Error:", err);
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

  const handlePreview = async () => {
    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      const empId = Cookies.get("EmpId");
      const coverpageno =
        actualTaskData?.coverpageno || record?.coverpageno || "";

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!empId) throw new Error("Employee ID missing in cookies.");

      const previewpayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        p_coverpageno: coverpageno,
        p_employeeid: formData.employeeid,
        p_facultyname: formData.facultyname,
        p_department: formData.department,
        p_designation: formData.designation,
        p_visitfrom: formData.visitfrom
          ? `${formData.visitfrom}T09:00:00Z`
          : null,
        p_visitto: formData.visitto ? `${formData.visitto}T17:00:00Z` : null,
        p_duration:
          formData.visitfrom && formData.visitto
            ? Math.ceil(
                (new Date(formData.visitto) - new Date(formData.visitfrom)) /
                  (1000 * 60 * 60 * 24) +
                  1
              )
            : 0,
        p_leavetype: JSON.stringify(record.leaveDetails || []),
        p_natureofparticipation: formData.natureofparticipation_value,
        p_claimtype: formData.claimtype,
        p_country: formData.country,
        p_citytown: formData.city,
        p_signingauthority: formData.signingAuthority,
        p_receipientto: "Initiator",
        p_assignto: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : formData.toSection || "",
        p_assignedrole: null,
        p_taskstatusid: 0,
        p_activityseqno: 0,
        p_istaskreturn: 0,
        p_istaskapproved: 0,
        p_initiatedby: "WF_Initiator",
        p_initiatedon: new Date().toISOString(),
        p_updatedby: "WF_Initiator",
        p_updatedon: new Date().toISOString(),
        p_template: "HTML Template",
        p_body: bodyData.body,
        p_header: bodyData.header || "",
        p_footer: bodyData.footer,
        p_referencenumber: bodyData.referenceNo || "",
        p_subject: bodyData.subject,
        p_ref: bodyData.refsubject,
        p_remarks: formData.remarks,
        p_Date: bodyData.referenceDate,
        p_Ref: bodyData.refsubject,
      };

      const response = await fetch(
        `${HostName}/OfficeOrder_InsertOfficedetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(previewpayload),
        }
      );

      if (!response.ok) throw new Error("Insert failed");
      await response.json();

      setPreviewCoverPageNo(coverpageno);
      setSelectedEmployeeId(formData.employeeid || actualTaskData.employeeid);
      setShowPreview(true);
    } catch (err) {
      console.error("Insert API Error:", err);
      setError(err.message || "Insert failed");
      Swal.fire({
        title: "Error",
        text: err.message || "Insert failed",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => setShowPreview(false);
  const handleBack = () => onClose?.();

  const formatTimestamp = (dateStr, hour = "09:00:00") => {
    if (!dateStr || !dateStr.trim()) return null;
    return `${dateStr}T${hour}Z`;
  };

  if (loading) return <div style={loadingStyle}>Loading employee data...</div>;
  if (showPreview)
    return (
      <OfficeOrderPreview
        coverpageno={previewCoverPageNo}
        formData={formData}
        bodyData={bodyData}
        onBack={handleClosePreview}
        employeeid={selectedEmployeeId}
      />
    );

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Header Section */}
        <div
          style={{
            paddingBottom: "16px",
            marginBottom: "24px",
          }}
        >
          <h2 style={headingStyle}>Permission Cum Relief</h2>
          <p
            style={{
              color: "#6B7280",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            Official Approval Document
          </p>
        </div>

        {error && <Alerts type="error" variant="outlined" message={error} />}

        {/* CARD 1: Approver Action */}
        <div
          style={{
            marginBottom: "24px",
            padding: "24px",
            border: "2px solid #2563EB",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
            position: "relative",
          }}
        >
          {/* Official Badge */}
          <div
            style={{
              position: "absolute",
              top: "-12px",
              left: "24px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              padding: "4px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            APPROVER SECTION
          </div>

          {/* Checkbox for Approve/Reject */}
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "16px",
              alignItems: "center",
              padding: "16px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "12px 20px",
                borderRadius: "8px",
                border:
                  approvalAction === "approve"
                    ? "1px solid #10B981"
                    : "1px solid transparent",
                transition: "all 0.3s ease",
                flex: 1,
                backgroundColor:
                  approvalAction === "approve" ? "#D1FAE5" : "#F9FAFB",
              }}
            >
              <input
                type="checkbox"
                checked={approvalAction === "approve"}
                onChange={() => handleApprovalActionChange("approve")}
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "12px",
                  cursor: "pointer",
                  accentColor: "#10B981",
                }}
              />
              <div>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#10B981",
                    display: "block",
                  }}
                >
                  ✓ APPROVE
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6B7280",
                    marginTop: "2px",
                  }}
                >
                  Grant permission
                </span>
              </div>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "12px 20px",
                borderRadius: "8px",
                border:
                  approvalAction === "reject"
                    ? "1px solid #EF4444"
                    : "1px solid transparent",
                backgroundColor:
                  approvalAction === "reject" ? "#FEE2E2" : "#F9FAFB",
                transition: "all 0.3s ease",
                flex: 1,
              }}
            >
              <input
                type="checkbox"
                checked={approvalAction === "reject"}
                onChange={() => handleApprovalActionChange("reject")}
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "12px",
                  cursor: "pointer",
                  accentColor: "#EF4444",
                }}
              />
              <div>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#EF4444",
                    display: "block",
                  }}
                >
                  ✗ REJECT
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6B7280",
                    marginTop: "2px",
                  }}
                >
                  Decline request
                </span>
              </div>
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                ...labelStyle,
                fontSize: "14px",
                fontWeight: "600",
                color: "#1F2937",
              }}
            >
              Official Remarks <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <TextField
              value={approverRemarks}
              onChange={(e) => setApproverRemarks(e.target.value)}
              placeholder="Enter your official remarks and observations here..."
              multiline
              rows={4}
              fullWidth
              style={{
                fontFamily: "inherit",
                fontSize: "14px",
                lineHeight: "1.6",
                backgroundColor: "#FFFFFF",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
              }}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              borderTop: "0px solid #BFDBFE",
              paddingTop: "16px",
            }}
          >
            <button
              type="button"
              onClick={handleSave}
              style={{
                ...buttonStyle,
                backgroundColor: "#7C3AED",
                boxShadow: "0 2px 6px rgba(124, 58, 237, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#6D28D9";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#7C3AED";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 6px rgba(124, 58, 237, 0.3)";
              }}
            >
              Save & Hold
            </button>

            <button
              type="button"
              onClick={handlePreview}
              style={{
                ...buttonStyle,
                backgroundColor: "#F59E0B",
                boxShadow: "0 2px 6px rgba(245, 158, 11, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#D97706";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#F59E0B";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 6px rgba(245, 158, 11, 0.3)";
              }}
            >
              Preview
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              style={{
                ...buttonStyle,
                backgroundColor:
                  approvalAction === "approve"
                    ? "#10B981"
                    : approvalAction === "reject"
                    ? "#EF4444"
                    : "#9CA3AF",
                opacity: approvalAction ? 1 : 0.6,
                cursor: approvalAction ? "pointer" : "not-allowed",
                boxShadow: approvalAction
                  ? "0 2px 6px rgba(0, 0, 0, 0.2)"
                  : "none",
                transition: "all 0.3s ease",
                fontWeight: "700",
              }}
              disabled={!approvalAction}
              onMouseEnter={(e) => {
                if (approvalAction) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (approvalAction) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.2)";
                }
              }}
            >
              {approvalAction === "approve"
                ? "✓ CONFIRM APPROVAL"
                : approvalAction === "reject"
                ? "✗ CONFIRM REJECTION"
                : " SELECT ACTION"}
            </button>
          </div>
        </div>

        {/* CARD 2: Scrollable Container with Comment History and Form */}
        <div
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            border: "2px solid #E5E7EB",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <form onSubmit={handleUpdate} style={{ padding: "24px" }}>
            {/* Initiator Comments History Table */}
            <div
              style={{
                marginBottom: "24px",
                padding: "24px",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                backgroundColor: "#F9FAFB",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  borderBottom: "2px solid #E5E7EB",
                  paddingBottom: "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#111827",
                    letterSpacing: "0.3px",
                  }}
                >
                  Comment History
                </h3>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Date</th>
                      <th style={tableHeaderStyle}>Commenter</th>
                      <th style={tableHeaderStyle}>Role</th>
                      <th style={tableHeaderStyle}>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initiatorComments.map((comment) => (
                      <tr key={comment.id}>
                        <td style={tableCellStyle}>{comment.date}</td>
                        <td style={tableCellStyle}>{comment.commenter}</td>
                        <td style={tableCellStyle}>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor:
                                comment.role === "Initiator"
                                  ? "#DBEAFE"
                                  : "#FEF3C7",
                              color:
                                comment.role === "Initiator"
                                  ? "#1E40AF"
                                  : "#92400E",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {comment.role}
                          </span>
                        </td>
                        <td style={{ ...tableCellStyle, textAlign: "left" }}>
                          {comment.comment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Employee Info */}
            <div
              style={{
                marginBottom: "24px",
                padding: "24px",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                backgroundColor: "#F9FAFB",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  borderBottom: "2px solid #E5E7EB",
                  paddingBottom: "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#111827",
                    letterSpacing: "0.3px",
                  }}
                >
                  Employee Information
                </h3>
              </div>

              <div style={gridRowStyle}>
                <TextField
                  label="Employee ID"
                  name="employeeid"
                  value={formData.employeeid}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Employee Name"
                  name="facultyname"
                  value={formData.facultyname}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>

              <div style={gridRowStyle}>
                <TextField
                  label="Nature of Visit"
                  name="natureofparticipation_value"
                  value={formData.natureofparticipation_value}
                  onChange={handleChange}
                />
                <TextField
                  type="date"
                  name="visitfrom"
                  value={formData.visitfrom}
                  onChange={handleChange}
                />
                <TextField
                  type="date"
                  name="visitto"
                  value={formData.visitto}
                  onChange={handleChange}
                />
                <TextField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div style={{ width: "23%" }}>
                <TextField
                  label="City/Town"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <div></div>
              </div>
            </div>

            <div
              style={{
                marginBottom: "24px",
                padding: "24px",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                backgroundColor: "#F9FAFB",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  borderBottom: "2px solid #E5E7EB",
                  paddingBottom: "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#111827",
                    letterSpacing: "0.3px",
                  }}
                >
                  Office Order Details
                </h3>
              </div>
              <div style={{ ...gridRowTwoColumnStyle, width: "35%" }}>
                <TextField
                  label="Reference Number"
                  name="referenceNo"
                  value={bodyData.referenceNo || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>

              <div style={{ ...gridRowTwoColumnStyle, width: "30%" }}>
                <TextField
                  label="Date"
                  name="referenceDate"
                  value={bodyData.referenceDate || ""}
                  onChange={handleChange}
                />
              </div>
              <TextField
                label="Header"
                value={bodyData.header || ""}
                name="header"
                variant="outlined"
                fullWidth
                sx={{ display: "none" }}
              />
              <div style={gridRowTwoColumnStyles}>
                <TextField
                  label="Subject"
                  name="subject"
                  value={bodyData.subject}
                  onChange={handleChange}
                />

                <div style={{ marginBottom: "16px", width: "60%" }}>
                  <label style={labelStyle}>Ref</label>
                  <input
                    type="text"
                    name="refsubject"
                    value={bodyData.refsubject || ""}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Body</label>
                <TextEdit
                  value={bodyData.body}
                  onChange={(value) =>
                    setBodyData((prev) => ({
                      ...prev,
                      body: value,
                    }))
                  }
                />
              </div>
              <div style={{ width: "23%" }}>
                <Select
                  label="Signing Authority"
                  name="signingAuthority"
                  value={formData.signingAuthority}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select signing authority" },
                    { value: "Deputy Registrar", label: "Deputy Registrar" },
                    {
                      value: "Assistant Registrar",
                      label: "Assistant Registrar",
                    },
                    { value: "Registrar", label: "Registrar" },
                  ]}
                />
                <div></div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>TO Section</label>
                <div style={checkboxGridStyle}>
                  {toSectionOptions.map((opt) => (
                    <div key={opt} style={checkboxItemStyle}>
                      <input
                        type="checkbox"
                        value={opt}
                        checked={formData.toSection.includes(opt)}
                        onChange={handleChange}
                        style={{ marginRight: "8px" }}
                      />
                      <span style={{ fontSize: "14px" }}>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* END OF CARD 2 - SCROLLABLE CONTAINER */}
      </div>
    </div>
  );
};

/* ---------- REUSABLE COMPONENTS (Unchanged) ---------- */
const Select = ({ label, options, ...props }) => {
  const key = `${props.name}-${props.value}`;
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select key={key} {...props} style={inputStyle}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/* ---------- STYLES (Unchanged) ---------- */
const containerStyle = {
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "20px",
  backgroundColor: "#F3F4F6",
};
const cardStyle = {
  width: "100%",
  maxWidth: "1800px",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  marginTop: "20px",
};
const headingStyle = {
  marginBottom: "8px",
  color: "#111827",
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "0.5px",
};
const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#374151",
  fontSize: "13px",
  letterSpacing: "0.3px",
  textTransform: "uppercase",
};
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "2px solid #D1D5DB",
  fontSize: "14px",
  color: "#374151",
  transition: "all 0.3s ease",
  backgroundColor: "#FFFFFF",
};
const buttonStyle = {
  padding: "12px 24px",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
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
  gridTemplateColumns: "repeat(1, 1fr)",
  gap: "16px",
  marginBottom: "16px",
  width: "60%",
};

const checkboxGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "8px",
  marginTop: "8px",
};
const checkboxItemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "6px",
};
const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "18px",
  color: "#6B7280",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "8px",
};

const tableHeaderStyle = {
  backgroundColor: "#F3F4F6",
  padding: "14px 12px",
  textAlign: "left",
  fontWeight: "700",
  fontSize: "13px",
  color: "#111827",
  border: "1px solid #E5E7EB",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
};

const tableCellStyle = {
  padding: "14px 12px",
  textAlign: "center",
  fontSize: "14px",
  color: "#4B5563",
  border: "1px solid #E5E7EB",
  lineHeight: "1.6",
};

export default ApprovalForm;
