// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import TextField from "@mui/material/TextField";
// import OfficeOrderPreview from "./OfficeOrderPreview.js";
// import {
//   decryptData,
//   validateJsonData,
// } from "src/components/Decryption/Decrypt";
// import Alerts from "src/components/ui/Alerts.js";
// import TextEdit from "./TextEdit";
// import Swal from "sweetalert2";
// import { HostName } from "src/assets/host/Host";
// const signingAuthorityOptions = [
//   { value: "AR", label: "Assistant Registrar" },
//   { value: "Deputy Registrar", label: "Deputy Registrar" },
//   { value: "Registrar", label: "Registrar" },
// ];
// const getToColumnHtml = (formData) => {
//   const departmentLine = formData.department
//     ? `<br>Thro the Head, ${formData.department}`
//     : "";
//   return `<p><strong>To</strong><br>${formData.facultyname} (ID No. ${formData.employeeid})${departmentLine}</p><p><strong>Sir,</strong></p>`;
// };

// const SaveandHold = ({ onClose, record, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     employeeid: "",
//     facultyname: "",
//     department: "",
//     designation: "",
//     visitfrom: "",
//     visitto: "",
//     natureofparticipation: "",
//     country: "",
//     city: "",
//     claimType: "",
//     signingauthority: "",
//     toSection: [],
//     remarks: "",
//   });

//   const [bodyData, setBodyData] = useState({
//     referencenumber: "",
//     subject: "",
//     body: "",
//     refsub: "",
//     referenceDate: "",
//     template: "",
//     header: "",
//     footer: "",
//   });

//   const [showPreview, setShowPreview] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//   const [isDraftSaved, setIsDraftSaved] = useState(false);

//   const sessionId = Cookies.get("session_id");
//   const jwtToken = Cookies.get("HRToken");
//   const empId = Cookies.get("EmpId");
//    const userRole = Cookies.get("selectedRole"); 

//   const toSectionOptions = [
//     `The Head of ${formData?.department || ""}`,
//     "The Dean (Faculty)",
//     "The Dean (Admin)",
//     "The Dean (IC&SR)",
//     "The Dean (ACR)",
//     "The Dean (GE)",
//     "The Deputy Registrar (F&A)",
//     "Office copy",
//     "AR (Paybill)",
//     "AR (Bills)",
//   ];
//   const validateForm = () => {
//     const requiredFields = {
//       natureofparticipation: "Nature of Visit",
//       visitfrom: "Visit From Date",
//       visitto: "Visit To Date",
//       country: "Country",
//       city: "City/Town",
//       subject: "Subject",
//       refsub: "Reference (Ref)",
//       body: "Body",
//       signingauthority: "Signing Authority",
//       toSection: "To Section",
//       remarks: "Remarks",
//     };

//     const missingFields = [];

//     for (const [key, label] of Object.entries(requiredFields)) {
//       const value =
//         formData[key] !== undefined
//           ? formData[key]
//           : bodyData[key] !== undefined
//           ? bodyData[key]
//           : "";

//       if (
//         value === "" ||
//         value === null ||
//         (Array.isArray(value) && value.length === 0)
//       ) {
//         missingFields.push(label);
//       }
//     }

//     if (missingFields.length > 0) {
//       const message =
//         missingFields.length === 1
//           ? `${missingFields[0]} is required.`
//           : `Please fill the following required fields: ${missingFields.join(
//               ", "
//             )}.`;
//       setError(message);
//       return false;
//     }

//     setError("");
//     return true;
//   };
//   const formatDate = (dateValue) => {
//     if (!dateValue) return "";
//     const date = new Date(dateValue);
//     return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
//   };
//   const formatDateTime = (dateValue) => {
//     if (!dateValue) return null;
//     const isStart = dateValue === formData.visitfrom;
//     const time = isStart ? "09:00:00" : "17:00:00";
//     return `${dateValue}T${time}+05:30`;
//   };
//   const fetchEmployeeDetails = async (coverpageno, employeeid) => {
//     setLoading(true);
//     setError("");
//     try {
//       if (!jwtToken) throw new Error("Authentication token missing.");
//       if (!employeeid) throw new Error("Employee ID missing");

//       const body = {
//         employeeid,
//         coverpageno,
//         token: "HRFGVJISOVp1fncC",
//         session_id: sessionId,
//       };

//       const response = await fetch(`${HostName}/OfficeOrder_taskvisitdetails`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${jwtToken}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const encryptedData = await response.json();
//       const encryptedPayload = encryptedData.Data ?? encryptedData.data;
//       if (!encryptedPayload) throw new Error("Encrypted Data missing");

//       const decryptedString = await decryptData(encryptedPayload);
//       const parsedData = validateJsonData(decryptedString);

//       const records = parsedData?.Records ?? parsedData?.Data?.Records ?? [];
//       if (!records.length) throw new Error("No records found");

//       const record = records[0];
//       const rawCcList = record.cc_to || "";
//       const ccSectionsArray = rawCcList
//         ? rawCcList
//             .split(",")
//             .map((s) => s.trim())
//             .filter((s) => s)
//         : [];

//       setFormData({
//         employeeid: record?.employee_id || "",
//         facultyname: record?.employee_name || "",
//         department: record.department || "",
//         designation: record.designation || "",
//         visitfrom: formatDate(record.visit_from),
//         visitto: formatDate(record.visit_to),
//         natureofparticipation: record.nature_of_visit || "",
//         country: record.country || "",
//         city: record.city_town || "",
//         claimType: record.claim_type || "",
//         signingauthority: record.signing_authority || "",
//         toSection: ccSectionsArray,
//         remarks: record.remarks || "",
//         leaveDetails: record.leaveDetails,
//       });

//       setBodyData({
//         referencenumber: record.order_no || "",
//         subject: record.subject || "",
//         body: record.body_html || "",
//         refsub: record.reference || "",
//         referenceDate: formatDate(record.order_date),
//         template: record.template_id || "",
//         header: record.header_html || "",
//         footer: record.footer_html || "",
//       });

//       setIsDraftSaved(true);
//     } catch (err) {
//       console.error("API Fetch Error:", err);
//       setError(err.message || "Failed to fetch employee data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (record?.coverpageno && record?.employeeid) {
//       fetchEmployeeDetails(record.coverpageno, record.employeeid);
//     }
//   }, [record]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((prev) => {
//         const current = Array.isArray(prev.toSection) ? prev.toSection : [];
//         const updated = checked
//           ? [...current, value]
//           : current.filter((v) => v !== value);
//         return { ...prev, toSection: updated };
//       });
//     } else if (
//       ["referencenumber", "subject", "refsub", "referenceDate"].includes(name)
//     ) {
//       setBodyData((prev) => ({ ...prev, [name]: value }));
//       setIsDraftSaved(false);
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setIsDraftSaved(false);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const coverpageno = record?.coverpageno;

//       if (!jwtToken) throw new Error("Authentication token missing.");
//       if (!empId) throw new Error("Employee ID missing in cookies.");

//       const payload = {
//         token: "HRFGVJISOVp1fncC",
//         employeeid: empId,
//         coverpageno: coverpageno,
//         Body: bodyData.body,
//         Subject: bodyData.subject,
//         Referencenumber: bodyData.referencenumber,
//         session_id: sessionId,
//       };

//       const response = await fetch(`${HostName}/OfficeOrder_taskvisitdetails`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${jwtToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error("Failed to update Office Order");

//       Swal.fire({
//         title: "Updated!",
//         text: "Changes have been Updated successfully.",
//         icon: "success",
//         timer: 2000,
//         showConfirmButton: false,
//       });

//       setPreviewCoverPageNo(coverpageno);
//       setShowPreview(false);
//       setIsDraftSaved(true);
//     } catch (err) {
//       console.error("Update API Error:", err);
//       setError(err.message || "Failed to update Office Order");
//       Swal.fire({
//         title: "Error",
//         text: err.message || "Failed to update Office Order",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       if (!jwtToken) throw new Error("Authentication token missing.");
//       if (!empId) throw new Error("Employee ID missing in cookies.");
//       const statusResponse = await fetch(
//         "https://wftest1.iitm.ac.in:7000/Statusmasternew",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify({
//             statusdescription: "saveandhold",
//             token: "HRFGVJISOVp1fncC",
//             session_id: sessionId,
//           }),
//         }
//       );

//       if (!statusResponse.ok) throw new Error("Failed to fetch status");

//       const encryptedStatus = await statusResponse.json();
//       const decryptedString = await decryptData(
//         encryptedStatus.Data ?? encryptedStatus.data
//       );
//       const validStatusData = validateJsonData(decryptedString);
//       const taskStatusId = validStatusData?.Data?.Records?.[0]?.statusid ?? 8;
//       const selectedAuthority = signingAuthorityOptions.find(
//         (opt) => opt.value === formData.signingauthority
//       );
//       const signatureText = selectedAuthority
//         ? selectedAuthority.label
//         : formData.signingauthority;
//       const reqpayload = {
//         token: "HRFGVJISOVp1fncC",
//         session_id: sessionId,
//         typeofsubmit: "draft",
//         p_cover_page_no: record?.coverpageno,
//         p_employee_id: formData?.employeeid,
//         p_employee_name: formData?.facultyname,
//         p_department: formData?.department,
//         p_designation: formData?.designation,
//         p_visit_from: formatDateTime(formData.visitfrom),
//         p_visit_to: formatDateTime(formData.visitto),
//         p_duration:
//           formData.visitfrom && formData.visitto
//             ? Math.ceil(
//                 (new Date(formData.visitto) - new Date(formData.visitfrom)) /
//                   (1000 * 60 * 60 * 24) +
//                   1
//               )
//             : 0,
//         p_nature_of_visit: formData?.natureofparticipation,
//         p_claim_type: formData?.claimType || "",
//         p_city_town: formData?.city,
//         p_country: formData?.country,
//         p_header_html: bodyData.header || "",
//         p_order_no: bodyData.referencenumber || "",
//         p_order_date: formatDate(bodyData.referenceDate),
//         p_to_column: getToColumnHtml(formData),
//         p_subject: bodyData.subject || "",
//         p_reference: bodyData.refsub,
//         p_body_html: bodyData.body,
//         p_signature_html: `<p>${signatureText}</p>`,
//         p_cc_to: Array.isArray(formData.toSection)
//           ? formData.toSection.join(",")
//           : formData.toSection || "Office copy",
//         p_footer_html: bodyData.footer || "",
//         p_task_status_id: taskStatusId,
//         p_initiated_by: empId || "admin",
//         p_updated_by: empId || "admin",
//         p_updated_on: new Date().toISOString(),
//         p_process_id: 1,
//         p_remarks: formData.remarks,
//         p_email_flag: false,
//         p_reject_flag: 0,
//         p_assign_to: formData.employeeid || "",
//         p_assigned_role: "initiator",
//         p_activity_seq_no: 0,
//         p_is_task_return: false,
//         p_is_task_approved: false,
//         p_user_role: userRole || "", // <--- ADDED: User role from cookie

//       };

//       const response = await fetch(
//         `${HostName}/OfficeOrder_InsertOfficedetails`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify(reqpayload),
//         }
//       );

//       if (!response.ok)
//         throw new Error(
//           "Failed to save as draft (OfficeOrder_InsertOfficedetails)"
//         );

//       await Swal.fire({
//         title: "Saved!",
//         text: "The task has been saved successfully as a draft.",
//         icon: "success",
//         timer: 2000,
//         showConfirmButton: false,
//       });

//       setIsDraftSaved(true);
//       setPreviewCoverPageNo(record?.coverpageno);
//       setSelectedEmployeeId(formData.employeeid);
//     } catch (err) {
//       console.error("Save as Draft API Error:", err);
//       setError(err.message || "Failed to save as draft");
//       Swal.fire({
//         title: "Error",
//         text: err.message || "Failed to save as draft",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     const confirmResult = await Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete the task?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#ED553B",
//       cancelButtonColor: "#6c757d",
//       confirmButtonText: "Yes, Delete",
//       cancelButtonText: "No, Cancel",
//     });

//     if (!confirmResult.isConfirmed) return;

//     try {
//       setLoading(true);
//       setError("");

//       if (!jwtToken) throw new Error("Authentication token missing.");

//       const statusResponse = await fetch(
//         "https://wftest1.iitm.ac.in:7000/Statusmasternew",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify({
//             statusdescription: "Deleted",
//             token: "HRFGVJISOVp1fncC",
//             session_id: sessionId,
//           }),
//         }
//       );

//       if (!statusResponse.ok) throw new Error("Failed to fetch status");

//       const encryptedStatus = await statusResponse.json();
//       const decryptedString = await decryptData(
//         encryptedStatus.Data ?? encryptedStatus.data
//       );
//       const validStatusData = validateJsonData(decryptedString);
//       const deletedStatusId =
//         validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

//       const reqpayload = {
//         token: "HRFGVJISOVp1fncC",
//         session_id: sessionId,
//         p_coverpageno: record.coverpageno,
//         p_employeeid: record.employeeid,
//         p_taskstatusid: String(deletedStatusId),
//         p_updatedby: "DELETEBYUSER",
//         p_updatedon: new Date().toISOString(),
//       };

//       const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${jwtToken}`,
//         },
//         body: JSON.stringify(reqpayload),
//       });

//       if (!response.ok) throw new Error("Failed to update Office Order");

//       await Swal.fire({
//         title: "Deleted!",
//         text: "The task has been marked as deleted successfully.",
//         icon: "success",
//         timer: 2000,
//         showConfirmButton: false,
//       });
//       onClose?.();
//       if (onSuccess) {
//         onSuccess();
//       }
//     } catch (err) {
//       console.error("Delete API Error:", err);
//       setError(err.message || "Failed to delete Office Order");
//       Swal.fire({
//         title: "Error",
//         text: err.message || "Failed to delete Office Order",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default browser form submission

//     if (!validateForm()) return;
//     try {
//       setLoading(true);
//       setError("");

//       if (!jwtToken) throw new Error("Authentication token missing.");
//       if (!empId) throw new Error("Employee ID missing in cookies.");
//       const statusResponse = await fetch(
//         "https://wftest1.iitm.ac.in:7000/Statusmasternew",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify({
//             statusdescription: "ongoing",
//             token: "HRFGVJISOVp1fncC",
//             session_id: sessionId,
//           }),
//         }
//       );

//       if (!statusResponse.ok)
//         throw new Error("Failed to fetch status for 'ongoing'");

//       const encryptedStatus = await statusResponse.json();
//       const decryptedString = await decryptData(
//         encryptedStatus.Data ?? encryptedStatus.data
//       );
//       const validStatusData = validateJsonData(decryptedString);
//       const taskStatusId = validStatusData?.Data?.Records?.[0]?.statusid ?? 8;
//       const selectedAuthority = signingAuthorityOptions.find(
//         (opt) => opt.value === formData.signingauthority
//       );
//       const signatureText = selectedAuthority
//         ? selectedAuthority.label
//         : formData.signingauthority;
//       const requestpayload = {
//         token: "HRFGVJISOVp1fncC",
//         session_id: sessionId,
//         typeofsubmit: "Submit",
//         p_cover_page_no: record?.coverpageno,
//         p_employee_id: formData.employeeid,
//         p_employee_name: formData.facultyname,
//         p_department: formData.department,
//         p_designation: formData.designation,
//         p_visit_from: formatDateTime(formData.visitfrom),
//         p_visit_to: formatDateTime(formData.visitto),
//         p_duration:
//           formData.visitfrom && formData.visitto
//             ? Math.ceil(
//                 (new Date(formData.visitto) - new Date(formData.visitfrom)) /
//                   (1000 * 60 * 60 * 24) +
//                   1
//               )
//             : 0,
//         p_nature_of_visit: formData.natureofparticipation,
//         p_claim_type: formData.claimType || "",
//         p_city_town: formData.city,
//         p_country: formData.country,
//         p_header_html: bodyData.header || "",
//         p_order_no: bodyData.referencenumber || "",
//         p_order_date: formatDate(bodyData.referenceDate),
//         p_to_column: getToColumnHtml(formData),
//         p_subject: bodyData.subject || "",
//         p_reference: bodyData.refsub,
//         p_body_html: bodyData.body,
//         p_signature_html: `<p>${signatureText}</p>`,
//         p_cc_to: Array.isArray(formData.toSection)
//           ? formData.toSection.join(",")
//           : formData.toSection || "wf_admin@iitm.ac.in",
//         p_footer_html: bodyData.footer,
//         p_assign_to: "WF_Admin", // *** Placeholder based on example ***
//         p_assigned_role: "initiator",
//         p_task_status_id: taskStatusId,
//         p_activity_seq_no: 1,
//         p_is_task_return: false,
//         p_is_task_approved: true,
//         p_initiated_by: empId || "admin",
//         p_initiated_on: new Date().toISOString().replace("Z", "+05:30"),
//         p_updated_by: empId || "admin",
//         p_updated_on: new Date().toISOString().replace("Z", "+05:30"),
//         p_process_id: 1,
//         p_remarks: formData.remarks,
//         p_email_flag: false,
//         p_reject_flag: 0,
//         p_user_role: userRole || "", // <--- ADDED: User role from cookie

//       };

//       const response = await fetch(
//         `${HostName}/OfficeOrder_InsertOfficedetails`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify(requestpayload),
//         }
//       );

//       if (!response.ok)
//         throw new Error("Failed to insert Office Order (Submit)");

//       await Swal.fire({
//         title: "Submitted!",
//         text: "The task has been Submitted Successfully.",
//         icon: "success",
//         timer: 2000,
//         showConfirmButton: false,
//       });
//       onClose?.();

//       if (onSuccess) {
//         onSuccess();
//       }
//     } catch (err) {
//       console.error("Insert API Error:", err);
//       setError(err.message || "Failed to insert Office Order");
//       Swal.fire({
//         title: "Error",
//         text: err.message || "Failed to insert Office Order",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeTimestamp = (text) => {
//     if (!text) return "";
//     return text.replace(/(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}.*?/g, "$1");
//   };

//   const handlePreview = async () => {
//     if (!isDraftSaved) {
//       setError("Please save the current changes as a draft first to preview.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       if (!jwtToken) throw new Error("Authentication token missing.");
//       if (!empId) throw new Error("Employee ID missing in cookies.");

//       const previewpayload = {
//         employeeid: formData.employeeid,
//         coverpageno: record?.coverpageno,
//         templatetype: "draft",
//         status: "saveandhold",
//       };

//       const response = await fetch(
//         `https://wftest1.iitm.ac.in:8080/api/officeorder/pdf`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify(previewpayload),
//         }
//       );

//       if (!response.ok)
//         throw new Error("Preview generation failed via new API");

//       setPreviewCoverPageNo(record?.coverpageno);
//       setSelectedEmployeeId(record?.employeeid);
//       setShowPreview(true);
//     } catch (err) {
//       console.error("New Preview API Error:", err);
//       setError(err.message || "Error generating preview");
//       Swal.fire({
//         title: "Error",
//         text: err.message || "Error generating preview",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClosePreview = () => setShowPreview(false);
//   const handleBack = () => onClose?.();

//   if (loading) return <div style={loadingStyle}>Loading employee data...</div>;
//   if (showPreview)
//     return (
//       <OfficeOrderPreview
//         coverpageno={previewCoverPageNo}
//         formData={formData}
//         bodyData={bodyData}
//         onBack={handleClosePreview}
//         employeeid={selectedEmployeeId}
//       />
//     );
//   return (
//     <div style={containerStyle}>
//       <div style={cardStyle}>
//         <button onClick={handleBack} style={backButtonStyle}>
//           ← Back
//         </button>
//         <h2 style={headingStyle}>Permission Cum Relief</h2>
//         {error && <Alerts type="error" variant="outlined" message={error} />}

//         <form onSubmit={handleSubmit}>
//           {/* Employee Info */}
//           <div
//             style={{
//               marginBottom: "30px",
//               padding: "20px",
//               border: "1px solid #e5e7eb",
//               borderRadius: "10px",
//             }}
//           >
//             <h3
//               style={{
//                 marginBottom: "16px",
//                 fontSize: "18px",
//                 fontWeight: "600",
//                 color: "#374151",
//               }}
//             >
//               Employee Information
//             </h3>

//             <div style={gridRowStyle}>
//               <TextField
//                 label="Employee ID"
//                 name="employeeid"
//                 value={formData.employeeid}
//                 onChange={handleChange}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//               />
//               <TextField
//                 label="Employee Name"
//                 name="facultyname"
//                 value={formData.facultyname}
//                 onChange={handleChange}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//               />
//               <TextField
//                 label="Department"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//               />
//               <TextField
//                 label="Designation"
//                 name="designation"
//                 value={formData.designation}
//                 onChange={handleChange}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//               />
//             </div>

//             <div style={gridRowStyle}>
//               <TextField
//                 label="Nature of Visit"
//                 name="natureofparticipation"
//                 value={formData.natureofparticipation}
//                 onChange={handleChange}
//               />
//               <TextField
//                 type="date"
//                 label="Visit From"
//                 name="visitfrom"
//                 value={formData.visitfrom}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 type="date"
//                 label="Visit To"
//                 name="visitto"
//                 value={formData.visitto}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 label="Country"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//               />
//             </div>

//             <div style={{ width: "23%" }}>
//               <TextField
//                 label="City/Town"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//               />
//               <div></div>
//             </div>
//           </div>
//           {/* Office Order Details */}
//           <div
//             style={{
//               marginBottom: "30px",
//               padding: "20px",
//               border: "1px solid #e5e7eb",
//               borderRadius: "10px",
//             }}
//           >
//             <h3
//               style={{
//                 marginBottom: "16px",
//                 fontSize: "18px",
//                 fontWeight: "600",
//                 color: "#374151",
//               }}
//             >
//               Office Order Details
//             </h3>
//             <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//               <div style={{ flex: 1, minWidth: "250px" }}>
//                 <TextField
//                   label="Reference Number"
//                   name="referencenumber"
//                   value={bodyData.referencenumber}
//                   onChange={handleChange}
//                   InputProps={{
//                     readOnly: true,
//                   }}
//                 />
//               </div>

//               <div style={{ flex: 1, minWidth: "200px" }}>
//                 <TextField
//                   type="date"
//                   label="Date"
//                   name="referenceDate"
//                   value={bodyData.referenceDate || ""}
//                   onChange={handleChange}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </div>
//             </div>

//             <div style={{ ...gridRowTwoColumnStyles, width: "100%" }}>
//               <TextField
//                 label="Subject"
//                 name="subject"
//                 value={bodyData.subject}
//                 onChange={handleChange}
//               />
//               <div style={{ marginBottom: "16px", width: "60%" }}>
//                 <label style={labelStyle}>Ref</label>
//                 <input
//                   type="text"
//                   name="refsub"
//                   value={bodyData.refsub || ""}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>

//             <div style={{ marginBottom: "16px" }}>
//               <label style={labelStyle}>Body</label>
//               <TextEdit
//                 value={bodyData.body}
//                 onChange={(value) =>
//                   setBodyData((prev) => ({
//                     ...prev,
//                     body: removeTimestamp(value),
//                   }))
//                 }
//               />
//             </div>
//             <div style={{ width: "23%" }}>
//               <Select
//                 label="Signing Authority"
//                 name="signingauthority"
//                 value={formData.signingauthority}
//                 onChange={handleChange}
//                 options={signingAuthorityOptions}
//               />
//               <div></div>
//             </div>

//             {/* TO Section */}
//             <div style={{ marginBottom: "16px" }}>
//               <label style={labelStyle}>TO Section</label>
//               <div style={checkboxGridStyle}>
//                 {toSectionOptions.map((opt) => (
//                   <div key={opt} style={checkboxItemStyle}>
//                     <input
//                       type="checkbox"
//                       value={opt}
//                       checked={formData.toSection.includes(opt)}
//                       onChange={handleChange}
//                       style={{ marginRight: "8px" }}
//                     />
//                     <span style={{ fontSize: "14px" }}>{opt}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div style={gridRowTwoColumnStyle}>
//               <TextField
//                 label="Remarks"
//                 name="remarks"
//                 value={formData.remarks}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* Buttons */}
//           <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
//             <button
//               type="button"
//               onClick={handleSave}
//               style={{ ...buttonStyle, backgroundColor: "#6B21A8" }}
//             >
//               Save as Draft
//             </button>

//             <button
//               type="submit"
//               style={{ ...buttonStyle, backgroundColor: "#10B981" }} // Green for Submit
//             >
//               Submit
//             </button>
//             <button
//               type="button"
//               onClick={handlePreview}
//               style={{
//                 ...buttonStyle,
//                 backgroundColor: isDraftSaved ? "#D97706" : "#9ca3af",
//                 cursor: isDraftSaved ? "pointer" : "not-allowed",
//               }}
//               disabled={!isDraftSaved}
//             >
//               Preview
//             </button>

//             <button
//               type="button"
//               onClick={handleDelete}
//               style={{ ...buttonStyle, backgroundColor: "#EF4444" }}
//             >
//               Delete
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// /* ---------- REUSABLE COMPONENTS (Copied for completeness) ---------- */
// const Select = ({ label, options, ...props }) => {
//   const key = `${props.name}-${props.value}`;
//   return (
//     <div>
//       <label style={labelStyle}>{label}</label>
//       <select key={key} {...props} style={inputStyle} onChange={props.onChange}>
//         <option value="">Select {label}</option>
//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// /* ---------- STYLES (Copied for completeness) ---------- */
// const containerStyle = {
//   width: "100%",
//   minHeight: "100vh",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "flex-start",
//   padding: "20px",
// };
// const cardStyle = {
//   width: "100%",
//   maxWidth: "1200px",
//   padding: "32px",
//   borderRadius: "12px",
//   boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//   backgroundColor: "#fff",
//   marginTop: "20px",
// };
// const headingStyle = {
//   marginBottom: "24px",
//   color: "rgb(107, 114, 128)",
//   fontSize: "24px",
//   fontWeight: "600",
// };
// const labelStyle = {
//   display: "block",
//   marginBottom: "6px",
//   fontWeight: "500",
//   color: "#374151",
// };
// const inputStyle = {
//   width: "100%",
//   padding: "10px 12px",
//   borderRadius: "8px",
//   border: "1px solid #D1D5DB",
//   fontSize: "14px",
//   color: "#374151",
// };
// const buttonStyle = {
//   padding: "10px 20px",
//   border: "none",
//   borderRadius: "8px",
//   color: "#fff",
//   cursor: "pointer",
//   fontWeight: "600",
// };
// const backButtonStyle = {
//   padding: "8px 16px",
//   border: "none",
//   borderRadius: "6px",
//   backgroundColor: "rgb(37, 99, 235)",
//   color: "#fff",
//   cursor: "pointer",
//   fontWeight: "600",
//   marginBottom: "20px",
// };
// const gridRowStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(4, 1fr)",
//   gap: "16px",
//   marginBottom: "16px",
// };
// const gridRowTwoColumnStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(1, 1fr)",
//   gap: "16px",
//   marginBottom: "16px",
// };

// const gridRowTwoColumnStyles = {
//   display: "grid",
//   gridTemplateColumns: "repeat(2, 1fr)",
//   gap: "16px",
//   marginBottom: "16px",
// };

// const checkboxGridStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(2, 1fr)",
//   gap: "8px",
//   marginTop: "8px",
// };
// const checkboxItemStyle = {
//   display: "flex",
//   alignItems: "center",
//   marginBottom: "6px",
// };
// const loadingStyle = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100vh",
//   fontSize: "18px",
//   color: "#6B7280",
// };

// export default SaveandHold;



import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import OfficeOrderPreview from "./OfficeOrderPreview.js";
import {
  decryptData,
  validateJsonData,
} from "src/components/Decryption/Decrypt";
import Alerts from "src/components/ui/Alerts.js";
import TextEdit from "./TextEdit";
import Swal from "sweetalert2";
import { HostName } from "src/assets/host/Host";

// New custom style for full-width TextEdit container
const fullWidthInputStyle = {
  marginBottom: "16px",
};

const signingAuthorityOptions = [
  { value: "AR", label: "Assistant Registrar" },
  { value: "Deputy Registrar", label: "Deputy Registrar" },
  { value: "Registrar", label: "Registrar" },
];
const getToColumnHtml = (formData) => {
  const departmentLine = formData.department
    ? `<br>Thro the Head, ${formData.department}`
    : "";
  return `<p><strong>To</strong><br>${formData.facultyname} (ID No. ${formData.employeeid})${departmentLine}</p><p><strong>Sir,</strong></p>`;
};

const SaveandHold = ({ onClose, record, onSuccess }) => {
  const [formData, setFormData] = useState({
    employeeid: "",
    facultyname: "",
    department: "",
    designation: "",
    visitfrom: "",
    visitto: "",
    natureofparticipation: "",
    country: "",
    city: "",
    claimType: "",
    signingauthority: "",
    toSection: [],
    remarks: "",
  });

  const [bodyData, setBodyData] = useState({
    referencenumber: "",
    subject: "",
    body: "",
    refsub: "",
    referenceDate: "",
    template: "",
    header: "",
    footer: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const sessionId = Cookies.get("session_id");
  const jwtToken = Cookies.get("HRToken");
  const empId = Cookies.get("EmpId");
   const userRole = Cookies.get("selectedRole"); 

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
  // const validateForm = () => {
  //   const requiredFields = {
  //     natureofparticipation: "Nature of Visit",
  //     visitfrom: "Visit From Date",
  //     visitto: "Visit To Date",
  //     country: "Country",
  //     city: "City/Town",
  //     subject: "Subject",
  //     refsub: "Reference (Ref)",
  //     body: "Body",
  //     signingauthority: "Signing Authority",
  //     toSection: "To Section",
  //     remarks: "Remarks",
  //   };

  //   const missingFields = [];

  //   for (const [key, label] of Object.entries(requiredFields)) {
  //     const value =
  //       formData[key] !== undefined
  //         ? formData[key]
  //         : bodyData[key] !== undefined
  //         ? bodyData[key]
  //         : "";

  //     if (
  //       value === "" ||
  //       value === null ||
  //       (Array.isArray(value) && value.length === 0)
  //     ) {
  //       missingFields.push(label);
  //     }
  //   }

  //   if (missingFields.length > 0) {
  //     const message =
  //       missingFields.length === 1
  //         ? `${missingFields[0]} is required.`
  //         : `Please fill the following required fields: ${missingFields.join(
  //             ", "
  //           )}.`;
  //     setError(message);
  //     return false;
  //   }

  //   setError("");
  //   return true;
  // };
  

  const validateForm = (isDraft = false) => {
    const requiredFields = {
      natureofparticipation: "Nature of Visit",
      visitfrom: "Visit From Date",
      visitto: "Visit To Date",
      country: "Country",
      city: "City/Town",
      subject: "Subject",
      refsub: "Reference (Ref)",
      body: "Body",
      signingauthority: "Signing Authority",
      toSection: "To Section",
      remarks: "Remarks",
    };

    // For draft, only validate essential employee fields
    const draftRequiredFields = {
      natureofparticipation: "Nature of Visit",
      visitfrom: "Visit From Date",
      visitto: "Visit To Date",
      country: "Country",
      city: "City/Town",
    };

    const fieldsToValidate = isDraft ? draftRequiredFields : requiredFields;
    const missingFields = [];
    const validationErrors = [];

    for (const [key, label] of Object.entries(fieldsToValidate)) {
      const value =
        formData[key] !== undefined
          ? formData[key]
          : bodyData[key] !== undefined
          ? bodyData[key]
          : "";

      if (
        value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        missingFields.push(label);
      }
    }

    // Additional validations
    // 1. Date validations
    if (formData.visitfrom && formData.visitto) {
      const fromDate = new Date(formData.visitfrom);
      const toDate = new Date(formData.visitto);
      
      if (toDate < fromDate) {
        validationErrors.push("Visit To Date cannot be earlier than Visit From Date");
      }
    }

    // 2. Body content validation (for submit only)
    if (!isDraft && bodyData.body) {
      const strippedBody = bodyData.body.replace(/<[^>]*>/g, '').trim();
      if (strippedBody.length < 10) {
        validationErrors.push("Body content must be at least 10 characters long");
      }
    }

    // 3. Subject validation (for submit only)
    if (!isDraft && bodyData.subject) {
      if (bodyData.subject.trim().length < 5) {
        validationErrors.push("Subject must be at least 5 characters long");
      }
    }

    // 4. Reference validation (for submit only)
    if (!isDraft && bodyData.refsub) {
      if (bodyData.refsub.trim().length < 3) {
        validationErrors.push("Reference must be at least 3 characters long");
      }
    }

    // Combine all errors
    const allErrors = [...missingFields, ...validationErrors];

    if (allErrors.length > 0) {
      const errorTitle = isDraft ? "Cannot Save Draft" : "Cannot Submit";
      const errorMessage = missingFields.length > 0
        ? `<strong>Missing Required Fields:</strong><br/>• ${missingFields.join("<br/>• ")}`
        : "";
      const validationMessage = validationErrors.length > 0
        ? `${errorMessage ? "<br/><br/>" : ""}<strong>Validation Errors:</strong><br/>• ${validationErrors.join("<br/>• ")}`
        : "";

      Swal.fire({
        title: errorTitle,
        html: errorMessage + validationMessage,
        icon: "error",
        confirmButtonColor: "#EF4444",
        confirmButtonText: "OK",
      });
      return false;
    }

    setError("");
    return true;
  };
  
  
  
  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };
  const formatDateTime = (dateValue) => {
    if (!dateValue) return null;
    const isStart = dateValue === formData.visitfrom;
    const time = isStart ? "09:00:00" : "17:00:00";
    return `${dateValue}T${time}+05:30`;
  };
  const fetchEmployeeDetails = async (coverpageno, employeeid) => {
    setLoading(true);
    setError("");
    try {
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!employeeid) throw new Error("Employee ID missing");

      const body = {
        employeeid,
        coverpageno,
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
      };

      const response = await fetch(`${HostName}/OfficeOrder_taskvisitdetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(body),
      });

      const encryptedData = await response.json();
      const encryptedPayload = encryptedData.Data ?? encryptedData.data;
      if (!encryptedPayload) throw new Error("Encrypted Data missing");

      const decryptedString = await decryptData(encryptedPayload);
      const parsedData = validateJsonData(decryptedString);

      const records = parsedData?.Records ?? parsedData?.Data?.Records ?? [];
      if (!records.length) throw new Error("No records found");

      const record = records[0];
      const rawCcList = record.cc_to || "";
      const ccSectionsArray = rawCcList
        ? rawCcList
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [];

      // --- START: Logic to derive signingauthority value from signature_html ---
      let signingAuthorityValue = record.signing_authority || ""; // Fallback

      if (record.signature_html) {
          // Extract text inside the first <p>...</p> tag (e.g., "<p>Assistant Registrar</p>" -> "Assistant Registrar")
          const signatureTextMatch = record.signature_html.match(/<p>(.*?)<\/p>/i);
          const signatureLabel = signatureTextMatch ? signatureTextMatch[1].trim() : '';
          
          if (signatureLabel) {
              // Find the corresponding value from the predefined options
              const matchedOption = signingAuthorityOptions.find(
                  (opt) => opt.label.toLowerCase() === signatureLabel.toLowerCase()
              );
              
              // Use the value if matched, otherwise use the label as the value (for custom text)
              signingAuthorityValue = matchedOption ? matchedOption.value : signatureLabel;
          }
      }
      // --- END: Logic to derive signingauthority value from signature_html ---

      setFormData({
        employeeid: record?.employee_id || "",
        facultyname: record?.employee_name || "",
        department: record.department || "",
        designation: record.designation || "",
        visitfrom: formatDate(record.visit_from),
        visitto: formatDate(record.visit_to),
        natureofparticipation: record.nature_of_visit || "",
        country: record.country || "",
        city: record.city_town || "",
        claimType: record.claim_type || "",
        signingauthority: signingAuthorityValue, // Use the derived value
        toSection: ccSectionsArray,
        remarks: record.remarks || "",
        leaveDetails: record.leaveDetails,
      });

      setBodyData({
        referencenumber: record.order_no || "",
        subject: record.subject || "",
        body: record.body_html || "",
        refsub: record.reference || "",
        referenceDate: formatDate(record.order_date),
        template: record.template_id || "",
        header: record.header_html || "",
        footer: record.footer_html || "",
      });

      setIsDraftSaved(true);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(err.message || "Failed to fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (record?.coverpageno && record?.employeeid) {
      fetchEmployeeDetails(record.coverpageno, record.employeeid);
    }
  }, [record]);

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
    } else if (
      ["referencenumber", "subject", "refsub", "referenceDate"].includes(name)
    ) {
      setBodyData((prev) => ({ ...prev, [name]: value }));
      setIsDraftSaved(false);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setIsDraftSaved(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const coverpageno = record?.coverpageno;

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!empId) throw new Error("Employee ID missing in cookies.");

      const payload = {
        token: "HRFGVJISOVp1fncC",
        employeeid: empId,
        coverpageno: coverpageno,
        Body: bodyData.body,
        Subject: bodyData.subject,
        Referencenumber: bodyData.referencenumber,
        session_id: sessionId,
      };

      const response = await fetch(`${HostName}/OfficeOrder_taskvisitdetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update Office Order");

      Swal.fire({
        title: "Updated!",
        text: "Changes have been Updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setPreviewCoverPageNo(coverpageno);
      setShowPreview(false);
      setIsDraftSaved(true);
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
      const decryptedString = await decryptData(
        encryptedStatus.Data ?? encryptedStatus.data
      );
      const validStatusData = validateJsonData(decryptedString);
      const taskStatusId = validStatusData?.Data?.Records?.[0]?.statusid ?? 8;
      const selectedAuthority = signingAuthorityOptions.find(
        (opt) => opt.value === formData.signingauthority
      );
      const signatureText = selectedAuthority
        ? selectedAuthority.label
        : formData.signingauthority;
      const reqpayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        typeofsubmit: "draft",
        p_cover_page_no: record?.coverpageno,
        p_employee_id: formData?.employeeid,
        p_employee_name: formData?.facultyname,
        p_department: formData?.department,
        p_designation: formData?.designation,
        p_visit_from: formatDateTime(formData.visitfrom),
        p_visit_to: formatDateTime(formData.visitto),
        p_duration:
          formData.visitfrom && formData.visitto
            ? Math.ceil(
                (new Date(formData.visitto) - new Date(formData.visitfrom)) /
                  (1000 * 60 * 60 * 24) +
                  1
              )
            : 0,
        p_nature_of_visit: formData?.natureofparticipation,
        p_claim_type: formData?.claimType || "",
        p_city_town: formData?.city,
        p_country: formData?.country,
        p_header_html: bodyData.header || "",
        p_order_no: bodyData.referencenumber || "",
        p_order_date: formatDate(bodyData.referenceDate),
        p_to_column: getToColumnHtml(formData),
        p_subject: bodyData.subject || "",
        p_reference: bodyData.refsub,
        p_body_html: bodyData.body,
        p_signature_html: `<p>${signatureText}</p>`,
        p_cc_to: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : formData.toSection || "Office copy",
        p_footer_html: bodyData.footer || "",
        p_task_status_id: taskStatusId,
        p_initiated_by: empId || "admin",
        p_updated_by: empId || "admin",
        p_updated_on: new Date().toISOString(),
        p_process_id: 1,
        p_remarks: formData.remarks,
        p_email_flag: false,
        p_reject_flag: 0,
        p_assign_to: formData.employeeid || "",
        p_assigned_role: "initiator",
        p_activity_seq_no: 0,
        p_is_task_return: false,
        p_is_task_approved: false,
        p_user_role: userRole || "", // <--- ADDED: User role from cookie

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

      if (!response.ok)
        throw new Error(
          "Failed to save as draft (OfficeOrder_InsertOfficedetails)"
        );

      await Swal.fire({
        title: "Saved!",
        text: "The task has been saved successfully as a draft.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setIsDraftSaved(true);
      setPreviewCoverPageNo(record?.coverpageno);
      setSelectedEmployeeId(formData.employeeid);
    } catch (err) {
      console.error("Save as Draft API Error:", err);
      setError(err.message || "Failed to save as draft");
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to save as draft",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the task?",
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

      const statusResponse = await fetch(
        "https://wftest1.iitm.ac.in:7000/Statusmasternew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            statusdescription: "Deleted",
            token: "HRFGVJISOVp1fncC",
            session_id: sessionId,
          }),
        }
      );

      if (!statusResponse.ok) throw new Error("Failed to fetch status");

      const encryptedStatus = await statusResponse.json();
      const decryptedString = await decryptData(
        encryptedStatus.Data ?? encryptedStatus.data
      );
      const validStatusData = validateJsonData(decryptedString);
      const deletedStatusId =
        validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

      const reqpayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        p_coverpageno: record.coverpageno,
        p_employeeid: record.employeeid,
        p_taskstatusid: String(deletedStatusId),
        p_updatedby: "DELETEBYUSER",
        p_updatedon: new Date().toISOString(),
      };

      const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(reqpayload),
      });

      if (!response.ok) throw new Error("Failed to update Office Order");

      await Swal.fire({
        title: "Deleted!",
        text: "The task has been marked as deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      onClose?.();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Delete API Error:", err);
      setError(err.message || "Failed to delete Office Order");
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to delete Office Order",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission

    if (!validateForm()) return;
    try {
      setLoading(true);
      setError("");

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

      if (!statusResponse.ok)
        throw new Error("Failed to fetch status for 'ongoing'");

      const encryptedStatus = await statusResponse.json();
      const decryptedString = await decryptData(
        encryptedStatus.Data ?? encryptedStatus.data
      );
      const validStatusData = validateJsonData(decryptedString);
      const taskStatusId = validStatusData?.Data?.Records?.[0]?.statusid ?? 8;
      const selectedAuthority = signingAuthorityOptions.find(
        (opt) => opt.value === formData.signingauthority
      );
      const signatureText = selectedAuthority
        ? selectedAuthority.label
        : formData.signingauthority;
      const requestpayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        typeofsubmit: "Submit",
        p_cover_page_no: record?.coverpageno,
        p_employee_id: formData.employeeid,
        p_employee_name: formData.facultyname,
        p_department: formData.department,
        p_designation: formData.designation,
        p_visit_from: formatDateTime(formData.visitfrom),
        p_visit_to: formatDateTime(formData.visitto),
        p_duration:
          formData.visitfrom && formData.visitto
            ? Math.ceil(
                (new Date(formData.visitto) - new Date(formData.visitfrom)) /
                  (1000 * 60 * 60 * 24) +
                  1
              )
            : 0,
        p_nature_of_visit: formData.natureofparticipation,
        p_claim_type: formData.claimType || "",
        p_city_town: formData.city,
        p_country: formData.country,
        p_header_html: bodyData.header || "",
        p_order_no: bodyData.referencenumber || "",
        p_order_date: formatDate(bodyData.referenceDate),
        p_to_column: getToColumnHtml(formData),
        p_subject: bodyData.subject || "",
        p_reference: bodyData.refsub,
        p_body_html: bodyData.body,
        p_signature_html: `<p>${signatureText}</p>`,
        p_cc_to: Array.isArray(formData.toSection)
          ? formData.toSection.join(",")
          : formData.toSection || "wf_admin@iitm.ac.in",
        p_footer_html: bodyData.footer,
        p_assign_to: "WF_Admin", // *** Placeholder based on example ***
        p_assigned_role: "initiator",
        p_task_status_id: taskStatusId,
        p_activity_seq_no: 1,
        p_is_task_return: false,
        p_is_task_approved: true,
        p_initiated_by: empId || "admin",
        p_initiated_on: new Date().toISOString().replace("Z", "+05:30"),
        p_updated_by: empId || "admin",
        p_updated_on: new Date().toISOString().replace("Z", "+05:30"),
        p_process_id: 1,
        p_remarks: formData.remarks,
        p_email_flag: false,
        p_reject_flag: 0,
        p_user_role: userRole || "", // <--- ADDED: User role from cookie

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

      if (!response.ok)
        throw new Error("Failed to insert Office Order (Submit)");

      await Swal.fire({
        title: "Submitted!",
        text: "The task has been Submitted Successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      onClose?.();

      if (onSuccess) {
        onSuccess();
      }
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

  const removeTimestamp = (text) => {
    if (!text) return "";
    return text.replace(/(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}.*?/g, "$1");
  };

  const handlePreview = async () => {
    if (!isDraftSaved) {
      setError("Please save the current changes as a draft first to preview.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!empId) throw new Error("Employee ID missing in cookies.");

      const previewpayload = {
        employeeid: formData.employeeid,
        coverpageno: record?.coverpageno,
        templatetype: "draft",
        status: "saveandhold",
      };

      const response = await fetch(
        `https://wftest1.iitm.ac.in:8080/api/officeorder/pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(previewpayload),
        }
      );

      if (!response.ok)
        throw new Error("Preview generation failed via new API");

      setPreviewCoverPageNo(record?.coverpageno);
      setSelectedEmployeeId(record?.employeeid);
      setShowPreview(true);
    } catch (err) {
      console.error("New Preview API Error:", err);
      setError(err.message || "Error generating preview");
      Swal.fire({
        title: "Error",
        text: err.message || "Error generating preview",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => setShowPreview(false);
  const handleBack = () => onClose?.();

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
        <button onClick={handleBack} style={backButtonStyle}>
          ← Back
        </button>
        <h2 style={headingStyle}>Permission Cum Relief</h2>
        {error && <Alerts type="error" variant="outlined" message={error} />}

        <form onSubmit={handleSubmit}>
          {/* Employee Info */}
          <div
            style={formSectionStyle}
          >
            <h3 style={sectionHeadingStyle}>
              Employee Information
            </h3>

            {/* Row 1: Employee ID, Name, Dept, Desig */}
            <div style={gridRowStyle}>
              <TextField
                label="Employee ID"
                name="employeeid"
                value={formData.employeeid}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Employee Name"
                name="facultyname"
                value={formData.facultyname}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
            </div>

            {/* Row 2: Nature, Visit From, Visit To, Country */}
            <div style={gridRowStyle}>
              <TextField
                label="Nature of Visit"
                name="natureofparticipation"
                value={formData.natureofparticipation}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                type="date"
                label="Visit From"
                name="visitfrom"
                value={formData.visitfrom}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
              <TextField
                type="date"
                label="Visit To"
                name="visitto"
                value={formData.visitto}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
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
                variant="outlined"
                fullWidth
              />
              <div></div> {/* Empty for alignment */}
              <div></div> {/* Empty for alignment */}
              <div></div> {/* Empty for alignment */}
            </div>
          </div>
          
          {/* Office Order Details */}
          <div
            style={formSectionStyle}
          >
            <h3 style={sectionHeadingStyle}>
              Office Order Details
            </h3>

            {/* Row 1: Reference Number, Date */}
            <div style={gridRowTwoColumnStyles}>
              <TextField
                label="Reference Number"
                name="referencenumber"
                value={bodyData.referencenumber}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />

              <TextField
                type="date"
                label="Date"
                name="referenceDate"
                value={bodyData.referenceDate || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
            </div>

            {/* Row 2: Subject, Ref */}
            <div style={gridRowTwoColumnStyles}>
              <TextField
                label="Subject"
                name="subject"
                value={bodyData.subject}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
              {/* Replaced custom input with TextField for consistency */}
              <TextField
                label="Ref"
                name="refsub"
                value={bodyData.refsub || ""}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </div>

            {/* Body (Full width) */}
            <div style={fullWidthInputStyle}>
              <label style={labelStyle}>Body</label>
              <TextEdit
                value={bodyData.body}
                onChange={(value) =>
                  setBodyData((prev) => ({
                    ...prev,
                    body: removeTimestamp(value),
                  }))
                }
              />
            </div>

            {/* Row 3: Signing Authority, Empty */}
            <div style={gridRowTwoColumnStyles}>
              <Select
                label="Signing Authority"
                name="signingauthority"
                value={formData.signingauthority}
                onChange={handleChange}
                options={signingAuthorityOptions}
                fullWidth
              />
              <div></div> {/* Empty for alignment */}
            </div>

            {/* TO Section (Full width, checkbox grid) */}
            <div style={fullWidthInputStyle}>
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

            {/* Remarks (Full width, single column style) */}
            <div style={fullWidthInputStyle}>
              <TextField
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                multiline
                rows={2}
              />
            </div>
          </div>

          {/* Buttons (Right aligned) */}
          <div style={buttonContainerStyle}>
            <button
              type="button"
              onClick={handleSave}
              style={{ ...buttonStyle, backgroundColor: "#6B21A8" }}
            >
              Save as Draft
            </button>

            <button
              type="submit"
              style={{ ...buttonStyle, backgroundColor: "#10B981" }} // Green for Submit
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handlePreview}
              style={{
                ...buttonStyle,
                backgroundColor: isDraftSaved ? "#D97706" : "#9ca3af",
                cursor: isDraftSaved ? "pointer" : "not-allowed",
              }}
              disabled={!isDraftSaved}
            >
              Preview
            </button>

            <button
              type="button"
              onClick={handleDelete}
              style={{ ...buttonStyle, backgroundColor: "#EF4444" }}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- REUSABLE COMPONENTS (Modified for visual consistency) ---------- */
const Select = ({ label, options, fullWidth, ...props }) => {
  const key = `${props.name}-${props.value}`;
  
  // To visually align with TextField, we wrap the select inside a div 
  // that uses the inputStyle/TextField wrapper structure.
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <select key={key} {...props} style={selectInputStyle} onChange={props.onChange}>
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/* ---------- STYLES (Refined and New) ---------- */
const containerStyle = {
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "20px",
  backgroundColor: "#f9fafb", // Light background for professionalism
};
const cardStyle = {
  width: "100%",
  maxWidth: "1200px",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)", // Softer shadow
  backgroundColor: "#fff",
  marginTop: "20px",
};
const headingStyle = {
  marginBottom: "24px",
  color: "#1f2937", // Darker text for elegance
  fontSize: "24px",
  fontWeight: "700",
  borderBottom: "2px solid #e5e7eb", // Subtle divider
  paddingBottom: "8px",
};
const sectionHeadingStyle = {
  marginBottom: "16px",
  fontSize: "18px",
  fontWeight: "600",
  color: "#4b5563",
};
const formSectionStyle = {
    marginBottom: "30px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
}
const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "500",
  color: "#374151",
  fontSize: "14px",
};
const selectInputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "4px", // Matches MUI outlined
  border: "1px solid #D1D5DB",
  fontSize: "16px", // Standard font size
  color: "#374151",
  height: "56px", // Set height to match TextField default height
  backgroundColor: "#fff",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px", // Slightly smaller border radius for modern look
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
  transition: "background-color 0.2s",
  minWidth: "120px",
};
const backButtonStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#3b82f6", // Blue for primary action
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
  marginBottom: "20px",
  fontSize: "14px",
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
};

const checkboxGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "16px", // Increased gap
  marginTop: "8px",
  padding: "12px",
  border: "1px solid #e5e7eb", // Subtle border
  borderRadius: "4px",
};
const checkboxItemStyle = {
  display: "flex",
  alignItems: "center",
};
const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "18px",
  color: "#6B7280",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "12px",
  marginTop: "30px", // Increased spacing
  justifyContent: "flex-end", // Aligned to the right
};

export default SaveandHold;