

// // //   // import React, { useState, useEffect } from "react";
// // //   // import Cookies from "js-cookie";
// // //   // import TextField from "@mui/material/TextField";
// // //   // import OfficeOrderPreview from "./OfficeOrderPreview.js";
// // //   // import {
// // //   //   decryptData,
// // //   //   validateJsonData,
// // //   // } from "src/components/Decryption/Decrypt";
// // //   // import Alerts from "src/components/ui/Alerts.js";
// // //   // import TextEdit from "./TextEdit";
// // //   // import Swal from "sweetalert2";
// // //   // import { HostName } from "src/assets/host/Host";

// // //   // const stripNonEnglish = (text) => {
// // //   //   if (typeof text !== "string") return text;
// // //   //   return text.replace(/[^\x00-\x7F]/g, ""); // Basic ASCII filter for safety
// // //   // };
// // //   // const Select = ({ label, options, ...props }) => {
// // //   //   const finalLabelStyle = { ...labelStyle, marginBottom: '8px' }; // Refined label style
// // //   //   const finalInputStyle = { ...inputStyle, height: '56px' }; // Match TextField height

// // //   //   return (
// // //   //     <div style={{ width: "100%" }}>
// // //   //       <label style={finalLabelStyle}>{label}</label>
// // //   //       <select {...props} style={finalInputStyle}>
// // //   //         {options.map((opt) => (
// // //   //           <option key={opt.value} value={opt.value}>
// // //   //             {opt.label}
// // //   //           </option>
// // //   //         ))}
// // //   //       </select>
// // //   //     </div>
// // //   //   );
// // //   // };
// // //   // const formatTimestamp = (dateStr, hour = "09:00:00") => {
// // //   //   if (!dateStr || !dateStr.trim()) return null;
// // //   //   const date = new Date(`${dateStr}T${hour}`);
// // //   //   const year = date.getFullYear();
// // //   //   const month = String(date.getMonth() + 1).padStart(2, "0");
// // //   //   const day = String(date.getDate()).padStart(2, "0");
// // //   //   return `${year}-${month}-${day}T${hour}+05:30`;
// // //   // };
// // //   // const calculateDuration = (from, to) => {
// // //   //   if (!from || !to) return 0;
// // //   //   const diff = new Date(to) - new Date(from);
// // //   //   return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
// // //   // };

// // //   // const EmployeeVisitForm = ({ onClose, record, onSuccess }) => {
// // //   //   const [formData, setFormData] = useState({
// // //   //     employeeid: "",
// // //   //     facultyname: "",
// // //   //     department: "",
// // //   //     designation: "",
// // //   //     visitfrom: "",
// // //   //     visitto: "",
// // //   //     natureofparticipation_value: "",
// // //   //     country: "",
// // //   //     city: "",
// // //   //     claimtype: "", 
// // //   //     signingAuthority: "",
// // //   //     toSection: [],
// // //   //     remarks: "",
// // //   //     leave: "",
// // //   //   });

// // //   //   const [bodyData, setBodyData] = useState({
// // //   //     referenceNo: "",
// // //   //     referenceDate: "",
// // //   //     subject: "",
// // //   //     refsubject: "",
// // //   //     body: "",
// // //   //     header: "",
// // //   //     footer: "",
// // //   //     template: "",
// // //   //   });

// // //   //   const [showPreview, setShowPreview] = useState(false);
// // //   //   const [loading, setLoading] = useState(false);
// // //   //   const [error, setError] = useState("");
// // //   //   const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false); 
// // //   //   const [isInitialLoad, setIsInitialLoad] = useState(true); 
// // //   //   const [previewData, setPreviewData] = useState(null); 
// // //   //   const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
// // //   //   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

// // //   //   const sessionId = Cookies.get("session_id");
// // //   //   const empId = Cookies.get("EmpId");
// // //   //   const userRole = Cookies.get("selectedRole"); 

// // //   //   const toSectionOptions = [
// // //   //     `The Head of ${formData?.department || ""}`,
// // //   //     "The Dean (Faculty)",
// // //   //     "The Dean (Admin)",
// // //   //     "The Dean (IC&SR)",
// // //   //     "The Dean (ACR)",
// // //   //     "The Dean (GE)",
// // //   //     "The Deputy Registrar (F&A)",
// // //   //     "Office copy",
// // //   //     "AR (Paybill)",
// // //   //     "AR (Bills)",
// // //   //   ];

// // //   //   const createPayload = (actionType, taskStatusId, userRole) => {
// // //   //     let assignedRole;
// // //   //     let typeofsubmit;
// // //   //     const currentInitiator = empId || "admin";

// // //   //     if (actionType === "saveasdraft") {
// // //   //       typeofsubmit = "draft"; 
// // //   //       assignedRole = "Reviewer";
// // //   //     } else if (actionType === "submit") {
// // //   //       typeofsubmit = "submit"; 
// // //   //       assignedRole = "Approver"; 
// // //   //     } else if (actionType === "preview") {
// // //   //       typeofsubmit = "preview"; 
// // //   //       assignedRole = "WF_Initiator";
// // //   //     }
// // //   //     let toColumnValue = "";
// // //   //     const signingAuthority = formData.signingAuthority;
// // //   //     const department = formData.department || "N/A Department"; 
// // //   //     const facultyName = formData.facultyname || "N/A Name"; 
// // //   //     if (signingAuthority) {
// // //   //       toColumnValue = `<p><strong>To</strong><br>${facultyName} (ID No. ${
// // //   //         formData.employeeid || "N/A"
// // //   //       })<br>Thro the Head, ${department}</p><p><strong>Sir,</strong></p>`;
// // //   //     }
// // //   //     let signatureHtml = "";

// // //   //     if (actionType === "submit" || actionType === "saveasdraft") {
// // //   //       signatureHtml = `<p>${signingAuthority || "Authority Not Specified"}</p>`;
// // //   //     }

// // //   //     return {
// // //   //       token: "HRFGVJISOVp1fncC",
// // //   //       session_id: sessionId,
// // //   //       typeofsubmit: typeofsubmit, 
// // //   //       p_cover_page_no: record?.coverpageno || "",
// // //   //       p_employee_id: formData.employeeid,
// // //   //       p_employee_name: formData.facultyname,
// // //   //       p_department: formData.department,
// // //   //       p_designation: formData.designation,
// // //   //       p_visit_from: formatTimestamp(formData.visitfrom, "09:00:00"),
// // //   //       p_visit_to: formatTimestamp(formData.visitto, "17:00:00"),
// // //   //       p_duration: calculateDuration(formData.visitfrom, formData.visitto),
// // //   //       p_nature_of_visit: formData.natureofparticipation_value,
// // //   //       p_claim_type: formData.claimtype, 
// // //   //       p_city_town: formData.city,
// // //   //       p_country: formData.country,
// // //   //       p_header_html: bodyData.header || "",
// // //   //       p_order_no: bodyData.referenceNo || "",
// // //   //       p_order_date:
// // //   //         bodyData.referenceDate || new Date().toISOString().split("T")[0],
// // //   //       p_to_column: toColumnValue, 
// // //   //       p_subject: bodyData.subject || "",
// // //   //       p_reference: bodyData.refsubject || "",
// // //   //       p_body_html: bodyData.body || "", 
// // //   //       p_signature_html: signatureHtml, 
// // //   //       p_cc_to: Array.isArray(formData.toSection)
// // //   //         ? formData.toSection.join(",")
// // //   //         : formData.toSection || "",
// // //   //       p_footer_html: bodyData.footer || "",
// // //   //       p_assign_to: currentInitiator, 
// // //   //       p_assigned_role: assignedRole, 
// // //   //       p_task_status_id: taskStatusId, 
// // //   //       p_activity_seq_no: actionType === "submit" ? 1 : 0, 
// // //   //       p_is_task_return: false,
// // //   //       p_is_task_approved: actionType === "submit", 
// // //   //       p_initiated_by: currentInitiator,
// // //   //       p_initiated_on: new Date().toISOString().replace("Z", "+05:30"), 
// // //   //       p_updated_by: currentInitiator,
// // //   //       p_updated_on: new Date().toISOString().replace("Z", "+05:30"), 
// // //   //       p_process_id: 1,
// // //   //       p_remarks: formData.remarks,
// // //   //       p_email_flag: false,
// // //   //       p_reject_flag: 0,
// // //   //       p_user_role: userRole || "", 
// // //   //     };
// // //   //   };
// // //   //   const fetchAllData = async (coverpageno, employeeid) => {
// // //   //     setLoading(true);
// // //   //     setError("");
// // //   //     try {
// // //   //       const jwtToken = Cookies.get("HRToken");
// // //   //       if (!jwtToken) throw new Error("Authentication token missing.");
// // //   //       if (!employeeid) throw new Error("Employee ID missing.");
// // //   //       if (!coverpageno) throw new Error("Cover page number missing.");

// // //   //       const apiUrl = `https://wftest1.iitm.ac.in:7000/OfficeOrder_datatemplate`;

// // //   //       const response = await fetch(apiUrl, {
// // //   //         method: "POST",
// // //   //         headers: {
// // //   //           "Content-Type": "application/json",
// // //   //           Authorization: `Bearer ${jwtToken}`,
// // //   //         },
// // //   //         body: JSON.stringify({
// // //   //           employeeid: employeeid,
// // //   //           coverpageno: coverpageno,
// // //   //           session_id: sessionId,
// // //   //           token: "HRFGVJISOVp1fncC",
// // //   //         }),
// // //   //       });

// // //   //       if (!response.ok) throw new Error("Failed to fetch data from API");

// // //   //       const encryptedData = await response.json();
// // //   //       const encryptedPayload = encryptedData.Data ?? encryptedData.data;
// // //   //       if (!encryptedPayload) throw new Error("Encrypted Data missing");

// // //   //       const decryptedString = await decryptData(encryptedPayload);
// // //   //       const parsedData = validateJsonData(decryptedString);

// // //   //       const formatDate = (dateValue) => {
// // //   //         if (!dateValue) return "";
// // //   //         const date = new Date(dateValue);
// // //   //         return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
// // //   //       };
        
        
// // //   //       setFormData({
// // //   //         employeeid: parsedData.Employeeid || "",
// // //   //         facultyname: parsedData.Employeename || "",
// // //   //         department: parsedData.Department || "",
// // //   //         designation: parsedData.Designation || "",
// // //   //         visitfrom: formatDate(parsedData.VisitFrom),
// // //   //         visitto: formatDate(parsedData.VisitTo),
// // //   //         natureofparticipation_value: parsedData.NatureOfVisit || "",
// // //   //         country: parsedData.Country?.trim() || "",
// // //   //         city: parsedData.CityTown || "",
// // //   //         claimtype: parsedData.ClaimType || "", 
// // //   //         signingAuthority: "",
// // //   //         toSection: [],
// // //   //         remarks: "",
// // //   //       });
        

// // //   //       const destination = parsedData.Country || "";
// // //   //       let processedSubject = parsedData.Subject || "";
// // //   //       processedSubject = processedSubject.replace(
// // //   //         /\{\{\.Destination\}\}/g,
// // //   //         destination
// // //   //       );

// // //   //       const referenceText = parsedData.Reference || "";

// // //   //       const formatHtmlTable = (htmlString) => {
// // //   //         if (!htmlString || typeof htmlString !== "string") return htmlString;

// // //   //         const tempDiv = document.createElement("div");
// // //   //         tempDiv.innerHTML = htmlString;
// // //   //         const table = tempDiv.querySelector("table");
// // //   //         if (!table) return htmlString;

// // //   //         const rows = Array.from(table.querySelectorAll("tr"));
// // //   //         let bodyRowsHtml = "";

// // //   //         const cleanDate = (str) => {
// // //   //           if (!str) return "";
// // //   //           const match = str.match(/(\d{4}-\d{2}-\d{2})/);
// // //   //           return match ? match[1] : str.trim();
// // //   //         };

// // //   //         const looksLikeDate = (str) => /(\d{4}-\d{2}-\d{2})/.test(str);

// // //   //         let startIndex = 0;
// // //   //         for (let i = 0; i < rows.length; i++) {
// // //   //           const row = rows[i];
// // //   //           const text = row.textContent.trim().toLowerCase();
// // //   //           const cells = Array.from(row.querySelectorAll("td, th"));

// // //   //           const isHeaderText =
// // //   //             (text.includes("leave type") &&
// // //   //               text.includes("from") &&
// // //   //               text.includes("to")) ||
// // //   //             cells.every((cell) => {
// // //   //               const cellText = cell.textContent.trim().toLowerCase();
// // //   //               return (
// // //   //                 cellText === "leave type" ||
// // //   //                 cellText === "from" ||
// // //   //                 cellText === "to"
// // //   //               );
// // //   //             });

// // //   //           if (isHeaderText) {
// // //   //             startIndex = i + 1;
// // //   //             continue;
// // //   //           }

// // //   //           if (cells.length >= 3) {
// // //   //             const hasData = cells.some((cell) => {
// // //   //               const cellText = cell.textContent.trim();
// // //   //               return (
// // //   //                 cellText &&
// // //   //                 !cellText.toLowerCase().includes("leave type") &&
// // //   //                 !cellText.toLowerCase().includes("from") &&
// // //   //                 !cellText.toLowerCase().includes("to")
// // //   //               );
// // //   //             });

// // //   //             if (hasData) {
// // //   //               startIndex = i;
// // //   //               break;
// // //   //             }
// // //   //           }
// // //   //         }

// // //   //         for (let i = startIndex; i < rows.length; i++) {
// // //   //           const cells = Array.from(rows[i].querySelectorAll("td, th"));
// // //   //           if (cells.length < 3) continue;

// // //   //           let leaveType = cells[0]?.textContent.trim() || "";
// // //   //           let fromDate = cleanDate(cells[1]?.textContent.trim() || "");
// // //   //           let toDate = cleanDate(cells[2]?.textContent.trim() || "");

// // //   //           if (
// // //   //             looksLikeDate(leaveType) &&
// // //   //             !looksLikeDate(fromDate) &&
// // //   //             fromDate
// // //   //           ) {
// // //   //             const temp = leaveType;
// // //   //             leaveType = fromDate;
// // //   //             fromDate = cleanDate(temp);
// // //   //           }

// // //   //           if (leaveType || fromDate || toDate) {
// // //   //             bodyRowsHtml += `
// // //   //               <tr>
// // //   //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${leaveType}</td>
// // //   //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${fromDate}</td>
// // //   //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${toDate}</td>
// // //   //               </tr>
// // //   //             `;
// // //   //           }
// // //   //         }

// // //   //         const newTableHtml = `
// // //   //           <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
// // //   //             <thead>
// // //   //               <tr>
// // //   //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">Leave Type</th>
// // //   //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">From</th>
// // //   //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">To</th>
// // //   //               </tr>
// // //   //             </thead>
// // //   //             <tbody>
// // //   //               ${
// // //   //                 bodyRowsHtml ||
// // //   //                 '<tr><td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: center;">-</td></tr>'
// // //   //               }
// // //   //             </tbody>
// // //   //           </table>
// // //   //         `;

// // //   //         table.outerHTML = newTableHtml;
// // //   //         return tempDiv.innerHTML;
// // //   //       };

// // //   //       const formattedBody = formatHtmlTable(parsedData.Body || "");

// // //   //       setBodyData({
// // //   //         referenceNo: parsedData.ReferenceNumber || "",
// // //   //         referenceDate: parsedData.ReferenceDate || "",
// // //   //         subject: stripNonEnglish(processedSubject),
// // //   //         refsubject: referenceText,
// // //   //         body: formattedBody,
// // //   //         header: parsedData.Header || "",
// // //   //         footer: parsedData.Footer || "",
// // //   //         template: stripNonEnglish(parsedData.filled_template || ""),
// // //   //       });
// // //   //       setIsSavedSuccessfully(true);
        
// // //   //       setPreviewCoverPageNo(record.coverpageno);
// // //   //       setSelectedEmployeeId(employeeid);

// // //   //     } catch (err) {
// // //   //       console.error("API Fetch Error:", err);
// // //   //       setError(err.message || "Failed to fetch data");
// // //   //     } finally {
// // //   //       setLoading(false);
// // //   //     }
// // //   //   };
// // //   //   useEffect(() => {
// // //   //     const initializeData = async () => {
// // //   //       if (isInitialLoad && record?.coverpageno && record?.employeeid) {
// // //   //         try {
// // //   //           await fetchAllData(record.coverpageno, record.employeeid);
// // //   //           setIsInitialLoad(false); 
// // //   //         } catch (error) {
// // //   //           console.error("Initialization error:", error);
// // //   //           setError("Failed to initialize form data");
// // //   //           setIsInitialLoad(false); // Ensure loading state is reset even on error
// // //   //         }
// // //   //       }
// // //   //     };

// // //   //     initializeData();
// // //   //   }, [record, sessionId, isInitialLoad]);

// // //   //   const handleChange = (e) => {
// // //   //     const { name, value, type, checked } = e.target;
// // //   //     if (!isInitialLoad) {
// // //   //         setIsSavedSuccessfully(false); 
// // //   //     }

// // //   //     if (type === "checkbox") {
// // //   //       setFormData((prev) => {
// // //   //         const current = Array.isArray(prev.toSection) ? prev.toSection : [];
// // //   //         const updated = checked
// // //   //           ? [...current, value]
// // //   //           : current.filter((v) => v !== value);
// // //   //         return { ...prev, toSection: updated };
// // //   //       });
// // //   //     } else if (
// // //   //       [
// // //   //         "referenceNo",
// // //   //         "referenceDate",
// // //   //         "subject",
// // //   //         "refsubject",
// // //   //         "body",
// // //   //         "header",
// // //   //         "footer",
// // //   //         "template",
// // //   //       ].includes(name)
// // //   //     ) {
// // //   //       setBodyData((prev) => ({ ...prev, [name]: value }));
// // //   //     } else {
// // //   //       setFormData((prev) => ({ ...prev, [name]: value }));
// // //   //     }
// // //   //   };


// // //   //   const validateForm = (isDraft = false) => {
// // //   //     const missingFields = [];
// // //   //     const invalidFields = [];
// // //   //     const requiredFieldsForSubmit = {
// // //   //       natureofparticipation_value: "Nature of Visit",
// // //   //       visitfrom: "Visit From Date",
// // //   //       visitto: "Visit To Date",
// // //   //       country: "Country",
// // //   //       city: "City/Town",
// // //   //       subject: "Subject",
// // //   //       refsubject: "Reference (Ref)",
// // //   //       body: "Body",
// // //   //       signingAuthority: "Signing Authority",
// // //   //       toSection: "To Section",
// // //   //       remarks: "Remarks",
// // //   //     };
// // //   //     const requiredFieldsForDraft = {
// // //   //       natureofparticipation_value: "Nature of Visit",
// // //   //       visitfrom: "Visit From Date",
// // //   //       visitto: "Visit To Date",
// // //   //       country: "Country",
// // //   //       city: "City/Town",
// // //   //     };

// // //   //     const fieldsToValidate = isDraft ? requiredFieldsForDraft : requiredFieldsForSubmit;
// // //   //     for (const [key, label] of Object.entries(fieldsToValidate)) {
// // //   //       let value = formData.hasOwnProperty(key) ? formData[key] : bodyData[key];
// // //   //       if (
// // //   //         value === "" ||
// // //   //         value === null ||
// // //   //         value === undefined ||
// // //   //         (Array.isArray(value) && value.length === 0) ||
// // //   //         (typeof value === "string" && value.trim() === "")
// // //   //       ) {
// // //   //         missingFields.push(label);
// // //   //       }
// // //   //     }
// // //   //     if (formData.visitfrom && formData.visitto) {
// // //   //       const fromDate = new Date(formData.visitfrom);
// // //   //       const toDate = new Date(formData.visitto);
        
// // //   //       if (fromDate > toDate) {
// // //   //         invalidFields.push("Visit To Date must be equal to or after Visit From Date");
// // //   //       }
// // //   //     }
// // //   //     if (!isDraft) {
// // //   //       if (bodyData.subject && bodyData.subject.trim().length < 10) {
// // //   //         invalidFields.push("Subject must be at least 10 characters long");
// // //   //       }
// // //   //       if (bodyData.body) {
// // //   //         const tempDiv = document.createElement("div");
// // //   //         tempDiv.innerHTML = bodyData.body;
// // //   //         const textContent = tempDiv.textContent || tempDiv.innerText || "";
// // //   //         if (textContent.trim().length < 20) {
// // //   //           invalidFields.push("Body must contain at least 20 characters of text");
// // //   //         }
// // //   //       }
// // //   //       if (formData.country && !/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
// // //   //         invalidFields.push("Country must contain only alphabetic characters");
// // //   //       }
// // //   //       if (formData.city && !/^[a-zA-Z\s,.-]+$/.test(formData.city.trim())) {
// // //   //         invalidFields.push("City/Town must contain only alphabetic characters and basic punctuation");
// // //   //       }
// // //   //       if (formData.remarks && formData.remarks.trim().length < 5) {
// // //   //         invalidFields.push("Remarks must be at least 5 characters long");
// // //   //       }
// // //   //       if (bodyData.refsubject && bodyData.refsubject.trim().length < 5) {
// // //   //         invalidFields.push("Reference must be at least 5 characters long");
// // //   //       }
// // //   //     }
// // //   //     const errorMessages = [];
      
// // //   //     if (missingFields.length > 0) {
// // //   //       errorMessages.push(`Missing required fields: ${missingFields.join(", ")}`);
// // //   //     }

// // //   //     if (invalidFields.length > 0) {
// // //   //       errorMessages.push(...invalidFields);
// // //   //     }

// // //   //     if (errorMessages.length > 0) {
// // //   //       const message = errorMessages.join(". ");
// // //   //       setError(message);
        
// // //   //       Swal.fire({
// // //   //         title: "Validation Error",
// // //   //         html: errorMessages.map(msg => `• ${msg}`).join("<br>"),
// // //   //         icon: "warning",
// // //   //       });
        
// // //   //       return false;
// // //   //     }

// // //   //     setError("");
// // //   //     return true;
// // //   //   };
// // //   //   const handleSave = async () => {
// // //   //     try {
// // //   //       setLoading(true);
// // //   //       setError("");
// // //   //       console.log("Save as Draft - Starting...");

// // //   //       const jwtToken = Cookies.get("HRToken");
// // //   //       if (!jwtToken) throw new Error("Authentication token missing.");
// // //   //       const taskStatusId = 6; 

// // //   //       const reqpayload = createPayload("saveasdraft", taskStatusId, userRole); 

// // //   //       const response = await fetch(
// // //   //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// // //   //         {
// // //   //           method: "POST",
// // //   //           headers: {
// // //   //             "Content-Type": "application/json",
// // //   //             Authorization: `Bearer ${jwtToken}`,
// // //   //           },
// // //   //           body: JSON.stringify(reqpayload),
// // //   //         }
// // //   //       );

// // //   //       if (!response.ok) throw new Error("Failed to insert Office Order");
// // //   //       await response.json();

// // //   //       setIsSavedSuccessfully(true); 

// // //   //       await Swal.fire({
// // //   //         title: "Saved!",
// // //   //         text: "The task has been saved as a draft successfully. You may now view the preview.",
// // //   //         icon: "success",
// // //   //         timer: 3000,
// // //   //         showConfirmButton: false,
// // //   //       });

// // //   //     } catch (err) {
// // //   //       console.error("Save as Draft - Error:", err);
// // //   //       setError(err.message || "Failed to insert Office Order");

// // //   //       Swal.fire({
// // //   //         title: "Error",
// // //   //         text: err.message || "Failed to insert Office Order",
// // //   //         icon: "error",
// // //   //       });
// // //   //     } finally {
// // //   //       setLoading(false);
// // //   //     }
// // //   //   };

// // //   //   const handleSubmit = async (e) => {
// // //   //     if (e) e.preventDefault();
// // //   //     if (!validateForm()) return;

// // //   //     try {
// // //   //       setLoading(true);
// // //   //       setError("");

// // //   //       const jwtToken = Cookies.get("HRToken");
// // //   //       if (!jwtToken) throw new Error("Authentication token missing.");
// // //   //       const taskStatusId = 4; 

// // //   //       const requestpayload = createPayload("submit", taskStatusId, userRole); 

// // //   //       const response = await fetch(
// // //   //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// // //   //         {
// // //   //           method: "POST",
// // //   //           headers: {
// // //   //             "Content-Type": "application/json",
// // //   //             Authorization: `Bearer ${jwtToken}`,
// // //   //           },
// // //   //           body: JSON.stringify(requestpayload),
// // //   //         }
// // //   //       );

// // //   //       if (!response.ok) throw new Error("Failed to insert Office Order");

// // //   //       await response.json();

// // //   //       setLoading(false);
// // //   //       setIsSavedSuccessfully(true); 

// // //   //       await Swal.fire({
// // //   //         title: "Submitted!",
// // //   //         text: "The task has been submitted successfully. Returning to previous page.",
// // //   //         icon: "success",
// // //   //         timer: 3000,
// // //   //         showConfirmButton: false,
// // //   //       });
// // //   //       onClose?.(true);
// // //   //     } catch (err) {
// // //   //       console.error("Insert API Error:", err);
// // //   //       setError(err.message || "Failed to insert Office Order");

// // //   //       Swal.fire({
// // //   //         title: "Error",
// // //   //         text: err.message || "Failed to insert Office Order",
// // //   //         icon: "error",
// // //   //       });
// // //   //     } finally {
// // //   //       setLoading(false);
// // //   //     }
// // //   //   };
    
// // //   //   const handlePreview = async () => {
// // //   //     if (!isSavedSuccessfully) {
// // //   //       setError("Please save the draft or submit the form before previewing.");
// // //   //       Swal.fire({
// // //   //         title: "Action Required",
// // //   //         text: "Please save the current changes as a draft or submit the form before generating the preview PDF.",
// // //   //         icon: "info",
// // //   //       });
// // //   //       return;
// // //   //     }
      
// // //   //     if (
// // //   //       !record?.coverpageno ||
// // //   //       !formData.employeeid ||
// // //   //       !formData.signingAuthority
// // //   //     ) {
// // //   //       setError(
// // //   //         "Cannot generate preview: Missing Cover Page Number, Employee ID, or Signing Authority."
// // //   //       );
// // //   //       return;
// // //   //     }
      
// // //   //     setLoading(true);
// // //   //     setError("");

// // //   //     try {
// // //   //       const jwtToken = Cookies.get("HRToken");
// // //   //       if (!jwtToken) throw new Error("Authentication token missing.");
// // //   //       const pdfApiUrl = `https://wftest1.iitm.ac.in:8080/api/officeorder/pdf`;
        
// // //   //       const response = await fetch(pdfApiUrl, {
// // //   //         method: "POST",
// // //   //         headers: {
// // //   //           "Content-Type": "application/json",
// // //   //           Authorization: `Bearer ${jwtToken}`,
// // //   //         },
// // //   //         body: JSON.stringify({
// // //   //           employeeid: formData.employeeid,
// // //   //           coverpageno: record.coverpageno,
// // //   //           templatetype: "draft",
// // //   //           status: "saveandhold",
// // //   //         }),
// // //   //       });

// // //   //       if (!response.ok) {
// // //   //         const errorText = await response.text();
// // //   //         throw new Error(
// // //   //           `Failed to generate PDF. Server responded with: ${
// // //   //             errorText || response.statusText
// // //   //           }`
// // //   //         );
// // //   //       }

// // //   //       const pdfBlob = await response.blob();
// // //   //       const fileURL = URL.createObjectURL(pdfBlob);
        
// // //   //       setPreviewData({
// // //   //         pdfUrl: fileURL,
// // //   //         formData: formData,
// // //   //         bodyData: bodyData,
// // //   //       });
// // //   //       setPreviewCoverPageNo(record.coverpageno);
// // //   //       setSelectedEmployeeId(formData.employeeid);
        
// // //   //       setShowPreview(true); 

// // //   //     } catch (err) {
// // //   //       console.error("Preview Generation Error:", err);
// // //   //       const errorMessage =
// // //   //         err.message ||
// // //   //         "An unexpected error occurred while generating the preview.";
// // //   //       setError(errorMessage);
// // //   //       Swal.fire({
// // //   //         title: "Preview Error",
// // //   //         text: errorMessage,
// // //   //         icon: "error",
// // //   //       });
// // //   //     } finally {
// // //   //       setLoading(false);
// // //   //     }
// // //   //   };

// // //   //   const handleClosePreview = () => {
// // //   //     setShowPreview(false);
// // //   //     if (previewData?.pdfUrl) {
// // //   //       URL.revokeObjectURL(previewData.pdfUrl); 
// // //   //       setPreviewData(null);
// // //   //     }
// // //   //   };

// // //   //   const handleBack = () => onClose?.(false); 

// // //   //   if (loading && isInitialLoad)
// // //   //     return <div style={loadingStyle}>Loading employee data...</div>;

// // //   //   if (showPreview && previewData?.pdfUrl) {
// // //   //     return (
// // //   //       <OfficeOrderPreview
// // //   //         coverpageno={previewCoverPageNo}
// // //   //         employeeid={selectedEmployeeId}
// // //   //         pdfUrl={previewData.pdfUrl} 
// // //   //         formData={previewData.formData}
// // //   //         bodyData={previewData.bodyData}
// // //   //         onBack={handleClosePreview} 
// // //   //         isLocalPreview={false} 
// // //   //         loading={loading}
// // //   //       />
// // //   //     );
// // //   //   }

// // //   //   return (
// // //   //     <div style={containerStyle}>
// // //   //       <div style={cardStyle}>
// // //   //         <button onClick={handleBack} style={backButtonStyle}>
// // //   //           ← Back
// // //   //         </button>
// // //   //         <h2 style={headingStyle}>Permission Cum Relief</h2>
// // //   //         {error && <Alerts type="error" variant="outlined" message={error} />}

// // //   //         <form onSubmit={handleSubmit}>
// // //   //           {/* Employee Info */}
// // //   //           <div style={formSectionStyle}>
// // //   //             <h3 style={sectionHeadingStyle}>
// // //   //               Employee Information
// // //   //             </h3>

// // //             //   {/* Row 1: Employee ID, Name, Dept, Desig */}
// // //             //   <div style={gridRowStyle}>
// // //             //     <TextField
// // //             //       label="Employee ID"
// // //             //       name="employeeid"
// // //             //       value={formData.employeeid}
// // //             //       onChange={handleChange}
// // //             //       InputProps={{ readOnly: true }}
// // //             //       variant="outlined"
// // //             //       fullWidth
// // //             //     />
// // //             //     <TextField
// // //             //       label="Employee Name"
// // //             //       name="facultyname"
// // //             //       value={formData.facultyname}
// // //             //       onChange={handleChange}
// // //             //       InputProps={{ readOnly: true }}
// // //             //       variant="outlined"
// // //             //       fullWidth
// // //             //     />
// // //             //     <TextField
// // //             //       label="Department"
// // //             //       name="department"
// // //             //       value={formData.department}
// // //             //       onChange={handleChange}
// // //             //       InputProps={{ readOnly: true }}
// // //             //       variant="outlined"
// // //             //       fullWidth
// // //             //     />
// // //             //     <TextField
// // //             //       label="Designation"
// // //             //       name="designation"
// // //             //       value={formData.designation}
// // //             //       onChange={handleChange}
// // //             //       InputProps={{ readOnly: true }}
// // //             //       variant="outlined"
// // //             //       fullWidth
// // //             //     />
// // //             //   </div>

// // //             //   {/* Row 2: Nature, Visit From, Visit To, Country */}
// // //             //   <div style={gridRowStyle}>
// // //             //     <TextField
// // //             //       label="Nature of Visit"
// // //             //       name="natureofparticipation_value"
// // //             //       value={formData.natureofparticipation_value}
// // //             //       onChange={handleChange}
// // //             //       variant="outlined"
// // //             //       fullWidth
// // //             //     />
// // //             //     <TextField
// // //             //       type="date"
// // //             //       label="Visit From"
// // //             //       name="visitfrom"
// // //             //       value={formData.visitfrom}
// // //             //       onChange={handleChange}
// // //             //       InputLabelProps={{ shrink: true }}
// // //             //       variant="outlined"
// // //             //       fullWidth
// // //             //     />
// // //             //     <TextField
// // //             //       type="date"
// // //             //       label="Visit To"
// // //             //       name="visitto"
// // //             //       value={formData.visitto}
// // //             //       onChange={handleChange}
// // //             //       InputLabelProps={{ shrink: true }}
// // //             //       variant="outlined"
// // //             //       fullWidth
// // //             //     />
// // //             //     <TextField
// // //             //       label="Country"
// // //             //       name="country"
// // //             //       value={formData.country}
// // //             //       onChange={handleChange}
// // //             //       variant="outlined"
// // //             //       fullWidth
// // //             //     />
// // //             //   </div>

// // //             //   {/* Row 3: City/Town (1 column) */}
// // //             //   <div style={gridRowStyle}>
// // //             //     <TextField
// // //             //       label="City/Town"
// // //             //       name="city"
// // //             //       value={formData.city}
// // //             //       onChange={handleChange}
// // //             //       variant="outlined"
// // //             //       fullWidth
// // //             //     />
// // //             //     {/* Claim Type hidden field */}
// // //             //     <TextField
// // //             //       label="Claim Type"
// // //             //       name="claimtype"
// // //             //       value={formData.claimtype}
// // //             //       onChange={handleChange}
// // //             //       InputProps={{ readOnly: true }}
// // //             //       sx={{ display: "none" }} 
// // //             //     />
// // //             //     <div></div> {/* Filler */}
// // //             //     <div></div> {/* Filler */}
// // //             //     <div></div> {/* Filler */}
// // //             //   </div>
// // //             // </div>

// // //   //           {/* Office Order Details */}
// // //   //           <div style={formSectionStyle}>
// // //   //             <h3 style={sectionHeadingStyle}>
// // //   //               Office Order Details
// // //   //             </h3>

// // //   //             {/* Hidden Header/Footer fields */}
// // //   //             <TextField
// // //   //               label="Header"
// // //   //               name="header"
// // //   //               value={bodyData.header || ""}
// // //   //               variant="outlined"
// // //   //               fullWidth
// // //   //               sx={{ display: "none" }}
// // //   //             />
// // //   //             <TextField
// // //   //               label="Reference Number"
// // //   //               name="referenceNo"
// // //   //               value={bodyData.referenceNo}
// // //   //               onChange={handleChange}
// // //   //               variant="outlined"
// // //   //               fullWidth
// // //   //               sx={{ display: "none" }}
// // //   //             />
// // //   //             <TextField
// // //   //               label="Reference Date"
// // //   //               name="referenceDate"
// // //   //               value={bodyData.referenceDate}
// // //   //               onChange={handleChange}
// // //   //               variant="outlined"
// // //   //               fullWidth
// // //   //               sx={{ display: "none" }}
// // //   //             />

// // //   //             {/* Subject and Ref in one row (2 columns) */}
// // //   //             <div style={gridRowTwoColumnStyles}>
// // //   //               <TextField
// // //   //                 label="Subject"
// // //   //                 name="subject"
// // //   //                 value={bodyData.subject}
// // //   //                 onChange={handleChange}
// // //   //                 variant="outlined"
// // //   //                 fullWidth
// // //   //                 multiline
// // //   //                 rows={2}
// // //   //               />

// // //   //               {/* Using TextField equivalent structure for Ref for consistent height */}
// // //   //               <TextField
// // //   //                 label="Ref"
// // //   //                 name="refsubject"
// // //   //                 value={bodyData.refsubject || ""}
// // //   //                 onChange={handleChange}
// // //   //                 variant="outlined"
// // //   //                 fullWidth
// // //   //                 multiline
// // //   //                 rows={2}
// // //   //               />
// // //   //             </div>

// // //   //             {/* Body (Full width) */}
// // //   //             <div style={{ marginBottom: "16px" }}>
// // //   //               <label style={labelStyle}>Body</label>
// // //   //               <div style={{ border: "1px solid #D1D5DB", borderRadius: "8px", padding: '8px' }}>
// // //   //                 <TextEdit
// // //   //                   value={bodyData.body}
// // //   //                   onChange={(value) => {
// // //   //                     setBodyData((prev) => ({ ...prev, body: value }));
// // //   //                     if (!isInitialLoad) {
// // //   //                       setIsSavedSuccessfully(false);
// // //   //                     }
// // //   //                   }}
// // //   //                 />
// // //   //               </div>
// // //   //             </div>
              
// // //   //             {/* Signing Authority in one column */}
// // //   //             <div style={gridRowStyle}>
// // //   //               <Select
// // //   //                 label="Signing Authority"
// // //   //                 name="signingAuthority"
// // //   //                 value={formData.signingAuthority}
// // //   //                 onChange={handleChange}
// // //   //                 options={[
// // //   //                   { value: "", label: "Select signing authority" },
// // //   //                   { value: "Deputy Registrar", label: "Deputy Registrar" },
// // //   //                   {
// // //   //                     value: "Assistant Registrar",
// // //   //                     label: "Assistant Registrar",
// // //   //                   },
// // //   //                   { value: "Registrar", label: "Registrar" },
// // //   //                 ]}
// // //   //               />
// // //   //               <div></div> {/* Filler */}
// // //   //               <div></div> {/* Filler */}
// // //   //               <div></div> {/* Filler */}
// // //   //             </div>

// // //   //             {/* TO Section (Full width, checkbox grid) */}
// // //   //             <div style={{ marginBottom: "16px" }}>
// // //   //               <label style={labelStyle}>TO Section</label>
// // //   //               <div style={checkboxGridStyle}>
// // //   //                 {toSectionOptions.map((opt) => (
// // //   //                   <div key={opt} style={checkboxItemStyle}>
// // //   //                     <input
// // //   //                       type="checkbox"
// // //   //                       value={opt}
// // //   //                       checked={formData.toSection.includes(opt)}
// // //   //                       onChange={handleChange}
// // //   //                       style={{ marginRight: "8px" }}
// // //   //                     />
// // //   //                     <span style={{ fontSize: "14px" }}>{opt}</span>
// // //   //                   </div>
// // //   //                 ))}
// // //   //               </div>
// // //   //             </div>

// // //   //             {/* Remarks (Full width) */}
// // //   //             <div style={gridRowTwoColumnStyle}>
// // //   //               <TextField
// // //   //                 label="Remarks"
// // //   //                 name="remarks"
// // //   //                 value={formData.remarks}
// // //   //                 onChange={handleChange}
// // //   //                 variant="outlined"
// // //   //                 fullWidth
// // //   //                 multiline
// // //   //                 rows={2}
// // //   //               />
// // //   //             </div>
// // //   //           </div>

// // //   //           {/* Buttons (Right Aligned) */}
// // //   //           <div style={buttonContainerStyle}>
// // //   //             <button
// // //   //               type="button"
// // //   //               onClick={handleSave}
// // //   //               style={{ ...buttonStyle, backgroundColor: "#7C3AED" }}
// // //   //               disabled={loading}
// // //   //             >
// // //   //               Save as Draft
// // //   //             </button>

// // //   //             <button
// // //   //               type="submit"
// // //   //               style={{ ...buttonStyle, backgroundColor: "#10B981" }}
// // //   //               disabled={loading}
// // //   //             >
// // //   //               Submit
// // //   //             </button>

// // //   //             {/* PREVIEW BUTTON: Conditional based on saved state, as requested by 'don't change any logics' */}
// // //   //             {isSavedSuccessfully && (
// // //   //               <button
// // //   //                 type="button"
// // //   //                 onClick={handlePreview}
// // //   //                 style={{ ...buttonStyle, backgroundColor: "#F59E0B" }}
// // //   //                 disabled={loading}
// // //   //               >
// // //   //                 Preview
// // //   //               </button>
// // //   //             )}
// // //   //           </div>
// // //   //         </form>
// // //   //       </div>
// // //   //     </div>
// // //   //   );
// // //   // };

// // //   // /* ---------- STYLES (Refined for Consistency) ---------- */
// // //   // const containerStyle = {
// // //   //   width: "100%",
// // //   //   minHeight: "100vh",
// // //   //   display: "flex",
// // //   //   justifyContent: "center",
// // //   //   alignItems: "flex-start",
// // //   //   padding: "20px",
// // //   //   backgroundColor: "#f9fafb", // Added subtle background
// // //   // };
// // //   // const cardStyle = {
// // //   //   width: "100%",
// // //   //   maxWidth: "1200px",
// // //   //   padding: "32px",
// // //   //   borderRadius: "12px",
// // //   //   boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
// // //   //   backgroundColor: "#fff",
// // //   //   marginTop: "20px",
// // //   // };
// // //   // const headingStyle = {
// // //   //   marginBottom: "24px",
// // //   //   color: "rgb(107, 114, 128)",
// // //   //   fontSize: "24px",
// // //   //   fontWeight: "600",
// // //   // };
// // //   // const sectionHeadingStyle = {
// // //   //   marginBottom: "16px",
// // //   //   fontSize: "18px",
// // //   //   fontWeight: "600",
// // //   //   color: "#374151",
// // //   // }
// // //   // const formSectionStyle = {
// // //   //   marginBottom: "30px",
// // //   //   padding: "20px",
// // //   //   border: "1px solid #0f3d9bff",
// // //   //   borderRadius: "10px",
// // //   //   backgroundColor: "#ffffff",
// // //   // }
// // //   // const labelStyle = {
// // //   //   display: "block",
// // //   //   marginBottom: "6px",
// // //   //   fontWeight: "500",
// // //   //   color: "#374151",
// // //   // };
// // //   // const inputStyle = {
// // //   //   width: "100%",
// // //   //   padding: "10px 12px",
// // //   //   borderRadius: "8px",
// // //   //   border: "1px solid #D1D5DB",
// // //   //   fontSize: "14px",
// // //   //   color: "#374151",
// // //   //   boxSizing: 'border-box', // Ensure padding is inside width
// // //   // };
// // //   // const buttonStyle = {
// // //   //   padding: "10px 20px",
// // //   //   border: "none",
// // //   //   borderRadius: "8px",
// // //   //   color: "#fff",
// // //   //   cursor: "pointer",
// // //   //   fontWeight: "600",
// // //   //   transition: "background-color 0.3s",
// // //   // };
// // //   // const backButtonStyle = {
// // //   //   padding: "8px 16px",
// // //   //   border: "none",
// // //   //   borderRadius: "6px",
// // //   //   backgroundColor: "rgb(37, 99, 235)",
// // //   //   color: "#fff",
// // //   //   cursor: "pointer",
// // //   //   fontWeight: "600",
// // //   //   marginBottom: "20px",
// // //   // };
// // //   // const gridRowStyle = {
// // //   //   display: "grid",
// // //   //   gridTemplateColumns: "repeat(4, 1fr)",
// // //   //   gap: "16px",
// // //   //   marginBottom: "16px",
// // //   // };
// // //   // const gridRowTwoColumnStyle = {
// // //   //   display: "grid",
// // //   //   gridTemplateColumns: "repeat(1, 1fr)",
// // //   //   gap: "16px",
// // //   //   marginBottom: "16px",
// // //   // };

// // //   // const gridRowTwoColumnStyles = {
// // //   //   display: "grid",
// // //   //   gridTemplateColumns: "repeat(2, 1fr)", // Changed to 2fr here for Subject/Ref
// // //   //   gap: "16px",
// // //   //   marginBottom: "16px",
// // //   //   width: "100%",
// // //   // };

// // //   // const checkboxGridStyle = {
// // //   //   display: "grid",
// // //   //   gridTemplateColumns: "repeat(2, 1fr)",
// // //   //   gap: "8px",
// // //   //   marginTop: "8px",
// // //   // };
// // //   // const checkboxItemStyle = {
// // //   //   display: "flex",
// // //   //   alignItems: "center",
// // //   //   marginBottom: "6px",
// // //   // };
// // //   // const loadingStyle = {
// // //   //   display: "flex",
// // //   //   justifyContent: "center",
// // //   //   alignItems: "center",
// // //   //   height: "100vh",
// // //   //   fontSize: "18px",
// // //   //   color: "#6B7280",
// // //   // };
// // //   // const buttonContainerStyle = {
// // //   //     display: "flex", 
// // //   //     gap: "12px", 
// // //   //     marginTop: "20px",
// // //   //     justifyContent: "flex-end", // Right alignment
// // //   // };

// // //   // export default EmployeeVisitForm;

// // //   // Updated EmployeeVisitForm.js


// // // import React, { useState, useEffect } from "react";
// // // import Cookies from "js-cookie";
// // // import TextField from "@mui/material/TextField";
// // // import OfficeOrderPreview from "./OfficeOrderPreview.js";
// // // import {
// // //   decryptData,
// // //   validateJsonData,
// // // } from "src/components/Decryption/Decrypt";
// // // import Alerts from "src/components/ui/Alerts.js";
// // // import TextEdit from "./TextEdit";
// // // import Swal from "sweetalert2";
// // // import { HostName } from "src/assets/host/Host";

// // // const stripNonEnglish = (text) => {
// // //   if (typeof text !== "string") return text;
// // //   return text.replace(/[^\x00-\x7F]/g, ""); // Basic ASCII filter for safety
// // // };
// // // const Select = ({ label, options, ...props }) => {
// // //   const finalLabelStyle = { ...labelStyle, marginBottom: '8px' }; // Refined label style
// // //   const finalInputStyle = { ...inputStyle, height: '56px' }; // Match TextField height

// // //   return (
// // //     <div style={{ width: "100%" }}>
// // //       <label style={finalLabelStyle}>{label}</label>
// // //       <select {...props} style={finalInputStyle}>
// // //         {options.map((opt) => (
// // //           <option key={opt.value} value={opt.value}>
// // //             {opt.label}
// // //           </option>
// // //         ))}
// // //       </select>
// // //     </div>
// // //   );
// // // };
// // // const formatTimestamp = (dateStr, hour = "09:00:00") => {
// // //   if (!dateStr || !dateStr.trim()) return null;
// // //   const date = new Date(`${dateStr}T${hour}`);
// // //   const year = date.getFullYear();
// // //   const month = String(date.getMonth() + 1).padStart(2, "0");
// // //   const day = String(date.getDate()).padStart(2, "0");
// // //   return `${year}-${month}-${day}T${hour}+05:30`;
// // // };
// // // const calculateDuration = (from, to) => {
// // //   if (!from || !to) return 0;
// // //   const diff = new Date(to) - new Date(from);
// // //   return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
// // // };

// // // const EmployeeVisitForm = ({ onClose, record, onSuccess }) => {
// // //   const [formData, setFormData] = useState({
// // //     employeeid: "",
// // //     facultyname: "",
// // //     department: "",
// // //     designation: "",
// // //     visitfrom: "",
// // //     visitto: "",
// // //     natureofparticipation_value: "",
// // //     country: "",
// // //     city: "",
// // //     claimtype: "", 
// // //     signingAuthority: "",
// // //     toSection: [],
// // //     remarks: "",
// // //     leave: "",
// // //   });

// // //   const [bodyData, setBodyData] = useState({
// // //     referenceNo: "",
// // //     referenceDate: "",
// // //     subject: "",
// // //     refsubject: "",
// // //     body: "",
// // //     header: "",
// // //     footer: "",
// // //     template: "",
// // //   });

// // //   const [showPreview, setShowPreview] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false); 
// // //   const [isInitialLoad, setIsInitialLoad] = useState(true); 
// // //   const [previewData, setPreviewData] = useState(null); 
// // //   const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
// // //   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

// // //   const sessionId = Cookies.get("session_id");
// // //   const empId = Cookies.get("EmpId");
// // //   const userRole = Cookies.get("selectedRole"); 

// // //   const toSectionOptions = [
// // //     `The Head of ${formData?.department || ""}`,
// // //     "The Dean (Faculty)",
// // //     "The Dean (Admin)",
// // //     "The Dean (IC&SR)",
// // //     "The Dean (ACR)",
// // //     "The Dean (GE)",
// // //     "The Deputy Registrar (F&A)",
// // //     "Office copy",
// // //     "AR (Paybill)",
// // //     "AR (Bills)",
// // //   ];


// // //   const createPayload = (actionType, taskStatusId, userRole) => {
// // //     let assignedRole;
// // //     let typeofsubmit;
// // //     const currentInitiator = empId || "admin";

// // //     if (actionType === "saveasdraft") {
// // //       typeofsubmit = "draft"; 
// // //       assignedRole = "Reviewer";
// // //     } else if (actionType === "submit") {
// // //       typeofsubmit = "submit"; 
// // //       assignedRole = "Approver"; 
// // //     } else if (actionType === "preview") {
// // //       typeofsubmit = "preview"; 
// // //       assignedRole = "WF_Initiator";
// // //     }
// // //     let toColumnValue = "";
// // //     const signingAuthority = formData.signingAuthority;
// // //     const department = formData.department || "N/A Department"; 
// // //     const facultyName = formData.facultyname || "N/A Name"; 
// // //     if (signingAuthority) {
// // //       toColumnValue = `<p><strong>To</strong><br>${facultyName} (ID No. ${
// // //         formData.employeeid || "N/A"
// // //       })<br>Thro the Head, ${department}</p><p><strong>Sir,</strong></p>`;
// // //     }
// // //     let signatureHtml = "";

// // //     if (actionType === "submit" || actionType === "saveasdraft") {
// // //       signatureHtml = `<p>${signingAuthority || "Authority Not Specified"}</p>`;
// // //     }

// // //     return {
// // //       token: "HRFGVJISOVp1fncC",
// // //       session_id: sessionId,
// // //       typeofsubmit: typeofsubmit, 
// // //       p_cover_page_no: record?.coverpageno || "",
// // //       p_employee_id: formData.employeeid,
// // //       p_employee_name: formData.facultyname,
// // //       p_department: formData.department,
// // //       p_designation: formData.designation,
// // //       p_visit_from: formatTimestamp(formData.visitfrom, "09:00:00"),
// // //       p_visit_to: formatTimestamp(formData.visitto, "17:00:00"),
// // //       p_duration: calculateDuration(formData.visitfrom, formData.visitto),
// // //       p_nature_of_visit: formData.natureofparticipation_value,
// // //       p_claim_type: formData.claimtype, 
// // //       p_city_town: formData.city,
// // //       p_country: formData.country,
// // //       p_header_html: bodyData.header || "",
// // //       p_order_no: bodyData.referenceNo || "",
// // //       p_order_date:
// // //         bodyData.referenceDate || new Date().toISOString().split("T")[0],
// // //       p_to_column: toColumnValue, 
// // //       p_subject: bodyData.subject || "",
// // //       p_reference: bodyData.refsubject || "",
// // //       p_body_html: bodyData.body || "", 
// // //       p_signature_html: signatureHtml, 
// // //       p_cc_to: Array.isArray(formData.toSection)
// // //         ? formData.toSection.join(",")
// // //         : formData.toSection || "",
// // //       p_footer_html: bodyData.footer || "",
// // //       p_assign_to: currentInitiator, 
// // //       p_assigned_role: assignedRole, 
// // //       p_task_status_id: taskStatusId, 
// // //       p_activity_seq_no: actionType === "submit" ? 1 : 0, 
// // //       p_is_task_return: false,
// // //       p_is_task_approved: actionType === "submit", 
// // //       p_initiated_by: currentInitiator,
// // //       p_initiated_on: new Date().toISOString().replace("Z", "+05:30"), 
// // //       p_updated_by: currentInitiator,
// // //       p_updated_on: new Date().toISOString().replace("Z", "+05:30"), 
// // //       p_process_id: 1,
// // //       p_remarks: formData.remarks,
// // //       p_email_flag: false,
// // //       p_reject_flag: 0,
// // //       p_user_role: userRole || "", 
// // //     };
// // //   };
// // //   const fetchAllData = async (coverpageno, employeeid) => {
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const jwtToken = Cookies.get("HRToken");
// // //       if (!jwtToken) throw new Error("Authentication token missing.");
// // //       if (!employeeid) throw new Error("Employee ID missing.");
// // //       if (!coverpageno) throw new Error("Cover page number missing.");

// // //       const apiUrl = `https://wftest1.iitm.ac.in:7000/OfficeOrder_datatemplate`;

// // //       const response = await fetch(apiUrl, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${jwtToken}`,
// // //         },
// // //         body: JSON.stringify({
// // //           employeeid: employeeid,
// // //           coverpageno: coverpageno,
// // //           session_id: sessionId,
// // //           token: "HRFGVJISOVp1fncC",
// // //         }),
// // //       });

// // //       if (!response.ok) throw new Error("Failed to fetch data from API");

// // //       const encryptedData = await response.json();
// // //       const encryptedPayload = encryptedData.Data ?? encryptedData.data;
// // //       if (!encryptedPayload) throw new Error("Encrypted Data missing");

// // //       const decryptedString = await decryptData(encryptedPayload);
// // //       const parsedData = validateJsonData(decryptedString);

// // //       const formatDate = (dateValue) => {
// // //         if (!dateValue) return "";
// // //         const date = new Date(dateValue);
// // //         return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
// // //       };
      
      
// // //       setFormData({
// // //         employeeid: parsedData.Employeeid || "",
// // //         facultyname: parsedData.Employeename || "",
// // //         department: parsedData.Department || "",
// // //         designation: parsedData.Designation || "",
// // //         visitfrom: formatDate(parsedData.VisitFrom),
// // //         visitto: formatDate(parsedData.VisitTo),
// // //         natureofparticipation_value: parsedData.NatureOfVisit || "",
// // //         country: parsedData.Country?.trim() || "",
// // //         city: parsedData.CityTown || "",
// // //         claimtype: parsedData.ClaimType || "", 
// // //         signingAuthority: "",
// // //         toSection: [],
// // //         remarks: "",
// // //       });
      

// // //       const destination = parsedData.Country || "";
// // //       let processedSubject = parsedData.Subject || "";
// // //       processedSubject = processedSubject.replace(
// // //         /\{\{\.Destination\}\}/g,
// // //         destination
// // //       );

// // //       const referenceText = parsedData.Reference || "";

// // //       const formatHtmlTable = (htmlString) => {
// // //         if (!htmlString || typeof htmlString !== "string") return htmlString;

// // //         const tempDiv = document.createElement("div");
// // //         tempDiv.innerHTML = htmlString;
// // //         const table = tempDiv.querySelector("table");
// // //         if (!table) return htmlString;

// // //         const rows = Array.from(table.querySelectorAll("tr"));
// // //         let bodyRowsHtml = "";

// // //         const cleanDate = (str) => {
// // //           if (!str) return "";
// // //           const match = str.match(/(\d{4}-\d{2}-\d{2})/);
// // //           return match ? match[1] : str.trim();
// // //         };

// // //         const looksLikeDate = (str) => /(\d{4}-\d{2}-\d{2})/.test(str);

// // //         let startIndex = 0;
// // //         for (let i = 0; i < rows.length; i++) {
// // //           const row = rows[i];
// // //           const text = row.textContent.trim().toLowerCase();
// // //           const cells = Array.from(row.querySelectorAll("td, th"));

// // //           const isHeaderText =
// // //             (text.includes("leave type") &&
// // //               text.includes("from") &&
// // //               text.includes("to")) ||
// // //             cells.every((cell) => {
// // //               const cellText = cell.textContent.trim().toLowerCase();
// // //               return (
// // //                 cellText === "leave type" ||
// // //                 cellText === "from" ||
// // //                 cellText === "to"
// // //               );
// // //             });

// // //           if (isHeaderText) {
// // //             startIndex = i + 1;
// // //             continue;
// // //           }

// // //           if (cells.length >= 3) {
// // //             const hasData = cells.some((cell) => {
// // //               const cellText = cell.textContent.trim();
// // //               return (
// // //                 cellText &&
// // //                 !cellText.toLowerCase().includes("leave type") &&
// // //                 !cellText.toLowerCase().includes("from") &&
// // //                 !cellText.toLowerCase().includes("to")
// // //               );
// // //             });

// // //             if (hasData) {
// // //               startIndex = i;
// // //               break;
// // //             }
// // //           }
// // //         }

// // //         for (let i = startIndex; i < rows.length; i++) {
// // //           const cells = Array.from(rows[i].querySelectorAll("td, th"));
// // //           if (cells.length < 3) continue;

// // //           let leaveType = cells[0]?.textContent.trim() || "";
// // //           let fromDate = cleanDate(cells[1]?.textContent.trim() || "");
// // //           let toDate = cleanDate(cells[2]?.textContent.trim() || "");

// // //           if (
// // //             looksLikeDate(leaveType) &&
// // //             !looksLikeDate(fromDate) &&
// // //             fromDate
// // //           ) {
// // //             const temp = leaveType;
// // //             leaveType = fromDate;
// // //             fromDate = cleanDate(temp);
// // //           }

// // //           if (leaveType || fromDate || toDate) {
// // //             bodyRowsHtml += `
// // //               <tr>
// // //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${leaveType}</td>
// // //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${fromDate}</td>
// // //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${toDate}</td>
// // //               </tr>
// // //             `;
// // //           }
// // //         }

// // //         const newTableHtml = `
// // //           <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
// // //             <thead>
// // //               <tr>
// // //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">Leave Type</th>
// // //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">From</th>
// // //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">To</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               ${
// // //                 bodyRowsHtml ||
// // //                 '<tr><td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: center;">-</td></tr>'
// // //               }
// // //             </tbody>
// // //           </table>
// // //         `;

// // //         table.outerHTML = newTableHtml;
// // //         return tempDiv.innerHTML;
// // //       };

// // //       const formattedBody = formatHtmlTable(parsedData.Body || "");

// // //       setBodyData({
// // //         referenceNo: parsedData.ReferenceNumber || "",
// // //         referenceDate: parsedData.ReferenceDate || "",
// // //         subject: stripNonEnglish(processedSubject),
// // //         refsubject: referenceText,
// // //         body: formattedBody,
// // //         header: parsedData.Header || "",
// // //         footer: parsedData.Footer || "",
// // //         template: stripNonEnglish(parsedData.filled_template || ""),
// // //       });
// // //       setIsSavedSuccessfully(true);
      
// // //       setPreviewCoverPageNo(record.coverpageno);
// // //       setSelectedEmployeeId(employeeid);

// // //     } catch (err) {
// // //       console.error("API Fetch Error:", err);
// // //       setError(err.message || "Failed to fetch data");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
// // //   useEffect(() => {
// // //     const initializeData = async () => {
// // //       if (isInitialLoad && record?.coverpageno && record?.employeeid) {
// // //         try {
// // //           await fetchAllData(record.coverpageno, record.employeeid);
// // //           setIsInitialLoad(false); 
// // //         } catch (error) {
// // //           console.error("Initialization error:", error);
// // //           setError("Failed to initialize form data");
// // //           setIsInitialLoad(false); // Ensure loading state is reset even on error
// // //         }
// // //       }
// // //     };

// // //     initializeData();
// // //   }, [record, sessionId, isInitialLoad]);

// // //   const handleChange = (e) => {
// // //     const { name, value, type, checked } = e.target;
// // //     if (!isInitialLoad) {
// // //         setIsSavedSuccessfully(false); 
// // //     }

// // //     if (type === "checkbox") {
// // //       setFormData((prev) => {
// // //         const current = Array.isArray(prev.toSection) ? prev.toSection : [];
// // //         const updated = checked
// // //           ? [...current, value]
// // //           : current.filter((v) => v !== value);
// // //         return { ...prev, toSection: updated };
// // //       });
// // //     } else if (
// // //       [
// // //         "referenceNo",
// // //         "referenceDate",
// // //         "subject",
// // //         "refsubject",
// // //         "body",
// // //         "header",
// // //         "footer",
// // //         "template",
// // //       ].includes(name)
// // //     ) {
// // //       setBodyData((prev) => ({ ...prev, [name]: value }));
// // //     } else {
// // //       setFormData((prev) => ({ ...prev, [name]: value }));
// // //     }
// // //   };


// // //   const validateForm = (isDraft = false) => {
// // //     const missingFields = [];
// // //     const invalidFields = [];
// // //     const requiredFieldsForSubmit = {
// // //       natureofparticipation_value: "Nature of Visit",
// // //       visitfrom: "Visit From Date",
// // //       visitto: "Visit To Date",
// // //       country: "Country",
// // //       city: "City/Town",
// // //       subject: "Subject",
// // //       refsubject: "Reference (Ref)",
// // //       body: "Body",
// // //       signingAuthority: "Signing Authority",
// // //       toSection: "To Section",
// // //       remarks: "Remarks",
// // //     };
// // //     const requiredFieldsForDraft = {
// // //       natureofparticipation_value: "Nature of Visit",
// // //       visitfrom: "Visit From Date",
// // //       visitto: "Visit To Date",
// // //       country: "Country",
// // //       city: "City/Town",
// // //     };

// // //     const fieldsToValidate = isDraft ? requiredFieldsForDraft : requiredFieldsForSubmit;
// // //     for (const [key, label] of Object.entries(fieldsToValidate)) {
// // //       let value = formData.hasOwnProperty(key) ? formData[key] : bodyData[key];
// // //       if (
// // //         value === "" ||
// // //         value === null ||
// // //         value === undefined ||
// // //         (Array.isArray(value) && value.length === 0) ||
// // //         (typeof value === "string" && value.trim() === "")
// // //       ) {
// // //         missingFields.push(label);
// // //       }
// // //     }
// // //     if (formData.visitfrom && formData.visitto) {
// // //       const fromDate = new Date(formData.visitfrom);
// // //       const toDate = new Date(formData.visitto);
      
// // //       if (fromDate > toDate) {
// // //         invalidFields.push("Visit To Date must be equal to or after Visit From Date");
// // //       }
// // //     }
// // //     if (!isDraft) {
// // //       if (bodyData.subject && bodyData.subject.trim().length < 10) {
// // //         invalidFields.push("Subject must be at least 10 characters long");
// // //       }
// // //       if (bodyData.body) {
// // //         const tempDiv = document.createElement("div");
// // //         tempDiv.innerHTML = bodyData.body;
// // //         const textContent = tempDiv.textContent || tempDiv.innerText || "";
// // //         if (textContent.trim().length < 20) {
// // //           invalidFields.push("Body must contain at least 20 characters of text");
// // //         }
// // //       }
// // //       if (formData.country && !/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
// // //         invalidFields.push("Country must contain only alphabetic characters");
// // //       }
// // //       if (formData.city && !/^[a-zA-Z\s,.-]+$/.test(formData.city.trim())) {
// // //         invalidFields.push("City/Town must contain only alphabetic characters and basic punctuation");
// // //       }
// // //       if (formData.remarks && formData.remarks.trim().length < 5) {
// // //         invalidFields.push("Remarks must be at least 5 characters long");
// // //       }
// // //       if (bodyData.refsubject && bodyData.refsubject.trim().length < 5) {
// // //         invalidFields.push("Reference must be at least 5 characters long");
// // //       }
// // //     }
// // //     const errorMessages = [];
    
// // //     if (missingFields.length > 0) {
// // //       errorMessages.push(`Missing required fields: ${missingFields.join(", ")}`);
// // //     }

// // //     if (invalidFields.length > 0) {
// // //       errorMessages.push(...invalidFields);
// // //     }

// // //     if (errorMessages.length > 0) {
// // //       const message = errorMessages.join(". ");
// // //       setError(message);
      
// // //       Swal.fire({
// // //         title: "Validation Error",
// // //         html: errorMessages.map(msg => `• ${msg}`).join("<br>"),
// // //         icon: "warning",
// // //       });
      
// // //       return false;
// // //     }

// // //     setError("");
// // //     return true;
// // //   };
// // //   const handleSave = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError("");
// // //       console.log("Save as Draft - Starting...");

// // //       const jwtToken = Cookies.get("HRToken");
// // //       if (!jwtToken) throw new Error("Authentication token missing.");
// // //       const taskStatusId = 6; 

// // //       const reqpayload = createPayload("saveasdraft", taskStatusId, userRole); 

// // //       const response = await fetch(
// // //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// // //         {
// // //           method: "POST",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //             Authorization: `Bearer ${jwtToken}`,
// // //           },
// // //           body: JSON.stringify(reqpayload),
// // //         }
// // //       );

// // //       if (!response.ok) throw new Error("Failed to insert Office Order");
// // //       await response.json();

// // //       setIsSavedSuccessfully(true); 

// // //       await Swal.fire({
// // //         title: "Saved!",
// // //         text: "The task has been saved as a draft successfully. You may now view the preview.",
// // //         icon: "success",
// // //         timer: 3000,
// // //         showConfirmButton: false,
// // //       });

// // //     } catch (err) {
// // //       console.error("Save as Draft - Error:", err);
// // //       setError(err.message || "Failed to insert Office Order");

// // //       Swal.fire({
// // //         title: "Error",
// // //         text: err.message || "Failed to insert Office Order",
// // //         icon: "error",
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     if (e) e.preventDefault();
// // //     if (!validateForm()) return;

// // //     try {
// // //       setLoading(true);
// // //       setError("");

// // //       const jwtToken = Cookies.get("HRToken");
// // //       if (!jwtToken) throw new Error("Authentication token missing.");
// // //       const taskStatusId = 4; 

// // //       const requestpayload = createPayload("submit", taskStatusId, userRole); 

// // //       const response = await fetch(
// // //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// // //         {
// // //           method: "POST",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //             Authorization: `Bearer ${jwtToken}`,
// // //           },
// // //           body: JSON.stringify(requestpayload),
// // //         }
// // //       );

// // //       if (!response.ok) throw new Error("Failed to insert Office Order");

// // //       await response.json();

// // //       setLoading(false);
// // //       setIsSavedSuccessfully(true); 

// // //       await Swal.fire({
// // //         title: "Submitted!",
// // //         text: "The task has been submitted successfully. Returning to previous page.",
// // //         icon: "success",
// // //         timer: 3000,
// // //         showConfirmButton: false,
// // //       });
// // //       onClose?.(true);
// // //     } catch (err) {
// // //       console.error("Insert API Error:", err);
// // //       setError(err.message || "Failed to insert Office Order");

// // //       Swal.fire({
// // //         title: "Error",
// // //         text: err.message || "Failed to insert Office Order",
// // //         icon: "error",
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
  
// // //   const handlePreview = async () => {
// // //     if (!isSavedSuccessfully) {
// // //       setError("Please save the draft or submit the form before previewing.");
// // //       Swal.fire({
// // //         title: "Action Required",
// // //         text: "Please save the current changes as a draft or submit the form before generating the preview PDF.",
// // //         icon: "info",
// // //       });
// // //       return;
// // //     }
    
// // //     if (
// // //       !record?.coverpageno ||
// // //       !formData.employeeid ||
// // //       !formData.signingAuthority
// // //     ) {
// // //       setError(
// // //         "Cannot generate preview: Missing Cover Page Number, Employee ID, or Signing Authority."
// // //       );
// // //       return;
// // //     }
    
// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const jwtToken = Cookies.get("HRToken");
// // //       if (!jwtToken) throw new Error("Authentication token missing.");
// // //       const pdfApiUrl = `https://wftest1.iitm.ac.in:8080/api/officeorder/pdf`;
      
// // //       const response = await fetch(pdfApiUrl, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${jwtToken}`,
// // //         },
// // //         body: JSON.stringify({
// // //           employeeid: formData.employeeid,
// // //           coverpageno: record.coverpageno,
// // //           templatetype: "draft",
// // //           status: "saveandhold",
// // //         }),
// // //       });

// // //       if (!response.ok) {
// // //         const errorText = await response.text();
// // //         throw new Error(
// // //           `Failed to generate PDF. Server responded with: ${
// // //             errorText || response.statusText
// // //           }`
// // //         );
// // //       }

// // //       const pdfBlob = await response.blob();
// // //       const fileURL = URL.createObjectURL(pdfBlob);
      
// // //       setPreviewData({
// // //         pdfUrl: fileURL,
// // //         formData: formData,
// // //         bodyData: bodyData,
// // //       });
// // //       setPreviewCoverPageNo(record.coverpageno);
// // //       setSelectedEmployeeId(formData.employeeid);
      
// // //       setShowPreview(true); 

// // //     } catch (err) {
// // //       console.error("Preview Generation Error:", err);
// // //       const errorMessage =
// // //         err.message ||
// // //         "An unexpected error occurred while generating the preview.";
// // //       setError(errorMessage);
// // //       Swal.fire({
// // //         title: "Preview Error",
// // //         text: errorMessage,
// // //         icon: "error",
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleClosePreview = () => {
// // //     setShowPreview(false);
// // //     if (previewData?.pdfUrl) {
// // //       URL.revokeObjectURL(previewData.pdfUrl); 
// // //       setPreviewData(null);
// // //     }
// // //   };

// // //   const handleBack = () => onClose?.(false); 

// // //   if (loading && isInitialLoad)
// // //     return <div style={loadingStyle}>Loading employee data...</div>;

// // //   if (showPreview && previewData?.pdfUrl) {
// // //     return (
// // //       <OfficeOrderPreview
// // //         coverpageno={previewCoverPageNo}
// // //         employeeid={selectedEmployeeId}
// // //         pdfUrl={previewData.pdfUrl} 
// // //         formData={previewData.formData}
// // //         bodyData={previewData.bodyData}
// // //         onBack={handleClosePreview} 
// // //         isLocalPreview={false} 
// // //         loading={loading}
// // //       />
// // //     );
// // //   }

// // //   return (
// // //     <div style={containerStyle}>
// // //       <div style={cardStyle}>
// // //         <button onClick={handleBack} style={backButtonStyle}>
// // //           ← Back
// // //         </button>
// // //         <h2 style={headingStyle}>Permission Cum Relief</h2>
// // //         {error && <Alerts type="error" variant="outlined" message={error} />}

// // //         <form onSubmit={handleSubmit}>
// // //           {/* Employee Info */}
// // //           <div style={formSectionStyle}>
// // //             <h3 style={sectionHeadingStyle}>
// // //               Employee Information
// // //             </h3>

// // //           {/* Row 1: Employee ID, Name, Dept, Desig */}
// // //               <div style={gridRowStyle}>
// // //                 <TextField
// // //                   label="Employee ID"
// // //                   name="employeeid"
// // //                   value={formData.employeeid}
// // //                   onChange={handleChange}
// // //                   InputProps={{ readOnly: true }}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                 />
// // //                 <TextField
// // //                   label="Employee Name"
// // //                   name="facultyname"
// // //                   value={formData.facultyname}
// // //                   onChange={handleChange}
// // //                   InputProps={{ readOnly: true }}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                 />
// // //                 <TextField
// // //                   label="Department"
// // //                   name="department"
// // //                   value={formData.department}
// // //                   onChange={handleChange}
// // //                   InputProps={{ readOnly: true }}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                 />
// // //                 <TextField
// // //                   label="Designation"
// // //                   name="designation"
// // //                   value={formData.designation}
// // //                   onChange={handleChange}
// // //                   InputProps={{ readOnly: true }}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                 />
// // //               </div>

// // //               {/* Row 2: Nature, Visit From, Visit To, Country */}
// // //               <div style={gridRowStyle}>
// // //                 <TextField
// // //                   label="Nature of Visit"
// // //                   name="natureofparticipation_value"
// // //                   value={formData.natureofparticipation_value}
// // //                   onChange={handleChange}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                 />
// // //                 <TextField
// // //                   type="date"
// // //                   label="Visit From"
// // //                   name="visitfrom"
// // //                   value={formData.visitfrom}
// // //                   onChange={handleChange}
// // //                   InputLabelProps={{ shrink: true }}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                 />
// // //                 <TextField
// // //                   type="date"
// // //                   label="Visit To"
// // //                   name="visitto"
// // //                   value={formData.visitto}
// // //                   onChange={handleChange}
// // //                   InputLabelProps={{ shrink: true }}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                 />
// // //                 <TextField
// // //                   label="Country"
// // //                   name="country"
// // //                   value={formData.country}
// // //                   onChange={handleChange}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                 />
// // //               </div>

// // //               {/* Row 3: City/Town (1 column) */}
// // //               <div style={gridRowStyle}>
// // //                 <TextField
// // //                   label="City/Town"
// // //                   name="city"
// // //                   value={formData.city}
// // //                   onChange={handleChange}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                 />
// // //                 {/* Claim Type hidden field */}
// // //                 <TextField
// // //                   label="Claim Type"
// // //                   name="claimtype"
// // //                   value={formData.claimtype}
// // //                   onChange={handleChange}
// // //                   InputProps={{ readOnly: true }}
// // //                   sx={{ display: "none" }} 
// // //                 />
// // //                 <div></div> {/* Filler */}
// // //                 <div></div> {/* Filler */}
// // //                 <div></div> {/* Filler */}
// // //               </div>
           


// // //             {/* Row 2: Nature, Visit From, Visit To, Country */}
// // //             <div style={gridRowStyle}>
// // //               <TextField
// // //                 label="Nature of Visit"
// // //                 name="natureofparticipation_value"
// // //                 value={formData.natureofparticipation_value}
// // //                 onChange={handleChange}
// // //                 variant="outlined"
// // //                 fullWidth
// // //               />
// // //               <TextField
// // //                 type="date"
// // //                 label="Visit From"
// // //                 name="visitfrom"
// // //                 value={formData.visitfrom}
// // //                 onChange={handleChange}
// // //                 InputLabelProps={{ shrink: true }}
// // //                 variant="outlined"
// // //                 fullWidth
// // //               />
// // //               <TextField
// // //                 type="date"
// // //                 label="Visit To"
// // //                 name="visitto"
// // //                 value={formData.visitto}
// // //                 onChange={handleChange}
// // //                 InputLabelProps={{ shrink: true }}
// // //                 variant="outlined"
// // //                 fullWidth
// // //               />
// // //               <TextField
// // //                 label="Country"
// // //                 name="country"
// // //                 value={formData.country}
// // //                 onChange={handleChange}
// // //                 variant="outlined"
// // //                 fullWidth
// // //               />
// // //             </div>

// // //             {/* Row 3: City/Town (1 column) */}
// // //             <div style={gridRowStyle}>
// // //               <TextField
// // //                 label="City/Town"
// // //                 name="city"
// // //                 value={formData.city}
// // //                 onChange={handleChange}
// // //                 variant="outlined"
// // //                 fullWidth
// // //               />
// // //               {/* Claim Type hidden field */}
// // //               <TextField
// // //                 label="Claim Type"
// // //                 name="claimtype"
// // //                 value={formData.claimtype}
// // //                 onChange={handleChange}
// // //                 InputProps={{ readOnly: true }}
// // //                 sx={{ display: "none" }} 
// // //               />
// // //               <div></div> {/* Filler */}
// // //               <div></div> {/* Filler */}
// // //               <div></div> {/* Filler */}
// // //             </div>
// // //           </div>

// // //           {/* Office Order Details */}
// // //           <div style={formSectionStyle}>
// // //             <h3 style={sectionHeadingStyle}>
// // //               Office Order Details
// // //             </h3>

// // //             {/* Hidden Header/Footer fields */}
// // //             <TextField
// // //               label="Header"
// // //               name="header"
// // //               value={bodyData.header || ""}
// // //               variant="outlined"
// // //               fullWidth
// // //               sx={{ display: "none" }}
// // //             />
// // //             <TextField
// // //               label="Reference Number"
// // //               name="referenceNo"
// // //               value={bodyData.referenceNo}
// // //               onChange={handleChange}
// // //               variant="outlined"
// // //               fullWidth
// // //               sx={{ display: "none" }}
// // //             />
// // //             <TextField
// // //               label="Reference Date"
// // //               name="referenceDate"
// // //               value={bodyData.referenceDate}
// // //               onChange={handleChange}
// // //               variant="outlined"
// // //               fullWidth
// // //               sx={{ display: "none" }}
// // //             />

// // //             {/* Subject and Ref in one row (2 columns) */}
// // //             <div style={gridRowTwoColumnStyles}>
// // //               <TextField
// // //                 label="Subject"
// // //                 name="subject"
// // //                 value={bodyData.subject}
// // //                 onChange={handleChange}
// // //                 variant="outlined"
// // //                 fullWidth
// // //                 multiline
// // //                 rows={2}
// // //               />

// // //               {/* Using TextField equivalent structure for Ref for consistent height */}
// // //               <TextField
// // //                 label="Ref"
// // //                 name="refsubject"
// // //                 value={bodyData.refsubject || ""}
// // //                 onChange={handleChange}
// // //                 variant="outlined"
// // //                 fullWidth
// // //                 multiline
// // //                 rows={2}
// // //               />
// // //             </div>

// // //             {/* Body (Full width) */}
// // //             <div style={{ marginBottom: "16px" }}>
// // //               <label style={labelStyle}>Body</label>
// // //               <div style={{ border: "1px solid #D1D5DB", borderRadius: "8px", padding: '8px' }}>
// // //                 <TextEdit
// // //                   value={bodyData.body}
// // //                   onChange={(value) => {
// // //                     setBodyData((prev) => ({ ...prev, body: value }));
// // //                     if (!isInitialLoad) {
// // //                       setIsSavedSuccessfully(false);
// // //                     }
// // //                   }}
// // //                 />
// // //               </div>
// // //             </div>
            
// // //             {/* Signing Authority in one column */}
// // //             <div style={gridRowStyle}>
// // //               <Select
// // //                 label="Signing Authority"
// // //                 name="signingAuthority"
// // //                 value={formData.signingAuthority}
// // //                 onChange={handleChange}
// // //                 options={[
// // //                   { value: "", label: "Select signing authority" },
// // //                   { value: "Deputy Registrar", label: "Deputy Registrar" },
// // //                   {
// // //                     value: "Assistant Registrar",
// // //                     label: "Assistant Registrar",
// // //                   },
// // //                   { value: "Registrar", label: "Registrar" },
// // //                 ]}
// // //               />
// // //               <div></div> {/* Filler */}
// // //               <div></div> {/* Filler */}
// // //               <div></div> {/* Filler */}
// // //             </div>

// // //             {/* TO Section (Full width, checkbox grid) */}
// // //             <div style={{ marginBottom: "16px" }}>
// // //               <label style={labelStyle}>TO Section</label>
// // //               <div style={checkboxGridStyle}>
// // //                 {toSectionOptions.map((opt) => (
// // //                   <div key={opt} style={checkboxItemStyle}>
// // //                     <input
// // //                       type="checkbox"
// // //                       value={opt}
// // //                       checked={formData.toSection.includes(opt)}
// // //                       onChange={handleChange}
// // //                       style={{ marginRight: "8px" }}
// // //                     />
// // //                     <span style={{ fontSize: "14px" }}>{opt}</span>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             {/* Remarks (Full width) */}
// // //             <div style={gridRowTwoColumnStyle}>
// // //               <TextField
// // //                 label="Remarks"
// // //                 name="remarks"
// // //                 value={formData.remarks}
// // //                 onChange={handleChange}
// // //                 variant="outlined"
// // //                 fullWidth
// // //                 multiline
// // //                 rows={2}
// // //               />
// // //             </div>
// // //           </div>

// // //           {/* Buttons (Right Aligned) */}
// // //           <div style={buttonContainerStyle}>
// // //             <button
// // //               type="button"
// // //               onClick={handleSave}
// // //               style={{ ...buttonStyle, backgroundColor: "#7C3AED" }}
// // //               disabled={loading}
// // //             >
// // //               Save as Draft
// // //             </button>

// // //             <button
// // //               type="submit"
// // //               style={{ ...buttonStyle, backgroundColor: "#10B981" }}
// // //               disabled={loading}
// // //             >
// // //               Submit
// // //             </button>

// // //             {/* PREVIEW BUTTON: Conditional based on saved state, as requested by 'don't change any logics' */}
// // //             {isSavedSuccessfully && (
// // //               <button
// // //                 type="button"
// // //                 onClick={handlePreview}
// // //                 style={{ ...buttonStyle, backgroundColor: "#F59E0B" }}
// // //                 disabled={loading}
// // //               >
// // //                 Preview
// // //               </button>
// // //             )}
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // /* ---------- STYLES (Refined for Consistency) ---------- */
// // // const containerStyle = {
// // //   width: "100%",
// // //   minHeight: "100vh",
// // //   display: "flex",
// // //   justifyContent: "center",
// // //   alignItems: "flex-start",
// // //   padding: "20px",
// // //   backgroundColor: "#f9fafb", // Added subtle background
// // // };
// // // const cardStyle = {
// // //   width: "100%",
// // //   maxWidth: "1200px",
// // //   padding: "32px",
// // //   borderRadius: "12px",
// // //   boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
// // //   backgroundColor: "#fff",
// // //   marginTop: "20px",
// // // };
// // // const headingStyle = {
// // //   marginBottom: "24px",
// // //   color: "rgb(107, 114, 128)",
// // //   fontSize: "24px",
// // //   fontWeight: "600",
// // // };
// // // const sectionHeadingStyle = {
// // //   marginBottom: "16px",
// // //   fontSize: "18px",
// // //   fontWeight: "600",
// // //   color: "#374151",
// // // }
// // // const formSectionStyle = {
// // //   marginBottom: "30px",
// // //   padding: "20px",
// // //   border: "1px solid #e5e7eb",
// // //   borderTop: "4px solid #10B981",
// // //   borderRadius: "10px",
// // //   backgroundColor: "#ffffff",
// // // }
// // // const labelStyle = {
// // //   display: "block",
// // //   marginBottom: "6px",
// // //   fontWeight: "500",
// // //   color: "#374151",
// // // };
// // // const inputStyle = {
// // //   width: "100%",
// // //   padding: "10px 12px",
// // //   borderRadius: "8px",
// // //   border: "1px solid #D1D5DB",
// // //   fontSize: "14px",
// // //   color: "#374151",
// // //   boxSizing: 'border-box', // Ensure padding is inside width
// // // };
// // // const buttonStyle = {
// // //   padding: "10px 20px",
// // //   border: "none",
// // //   borderRadius: "8px",
// // //   color: "#fff",
// // //   cursor: "pointer",
// // //   fontWeight: "600",
// // //   transition: "background-color 0.3s",
// // // };
// // // const backButtonStyle = {
// // //   padding: "8px 16px",
// // //   border: "none",
// // //   borderRadius: "6px",
// // //   backgroundColor: "rgb(37, 99, 235)",
// // //   color: "#fff",
// // //   cursor: "pointer",
// // //   fontWeight: "600",
// // //   marginBottom: "20px",
// // // };
// // // const gridRowStyle = {
// // //   display: "grid",
// // //   gridTemplateColumns: "repeat(4, 1fr)",
// // //   gap: "16px",
// // //   marginBottom: "16px",
// // // };
// // // const gridRowTwoColumnStyle = {
// // //   display: "grid",
// // //   gridTemplateColumns: "repeat(1, 1fr)",
// // //   gap: "16px",
// // //   marginBottom: "16px",
// // // };

// // // const gridRowTwoColumnStyles = {
// // //   display: "grid",
// // //   gridTemplateColumns: "repeat(2, 1fr)", // Changed to 2fr here for Subject/Ref
// // //   gap: "16px",
// // //   marginBottom: "16px",
// // //   width: "100%",
// // // };

// // // const checkboxGridStyle = {
// // //   display: "grid",
// // //   gridTemplateColumns: "repeat(2, 1fr)",
// // //   gap: "8px",
// // //   marginTop: "8px",
// // // };
// // // const checkboxItemStyle = {
// // //   display: "flex",
// // //   alignItems: "center",
// // //   marginBottom: "6px",
// // // };
// // // const loadingStyle = {
// // //   display: "flex",
// // //   justifyContent: "center",
// // //   alignItems: "center",
// // //   height: "100vh",
// // //   fontSize: "18px",
// // //   color: "#6B7280",
// // // };
// // // const buttonContainerStyle = {
// // //     display: "flex", 
// // //     gap: "12px", 
// // //     marginTop: "20px",
// // //     justifyContent: "flex-end", // Right alignment
// // // };

// // // export default EmployeeVisitForm;





// // import React, { useState, useEffect } from "react";
// // import Cookies from "js-cookie";
// // import TextField from "@mui/material/TextField";
// // import OfficeOrderPreview from "./OfficeOrderPreview.js";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import Alerts from "src/components/ui/Alerts.js";
// // import TextEdit from "./TextEdit";
// // import Swal from "sweetalert2";
// // import { HostName } from "src/assets/host/Host";
// // import FormSection from "src/components/ui/TopColorCard.js"; // New import for the FormSection component

// // const stripNonEnglish = (text) => {
// //   if (typeof text !== "string") return text;
// //   return text.replace(/[^\x00-\x7F]/g, ""); // Basic ASCII filter for safety
// // };
// // const Select = ({ label, options, ...props }) => {
// //   const finalLabelStyle = { ...labelStyle, marginBottom: '8px' }; // Refined label style
// //   const finalInputStyle = { ...inputStyle, height: '56px' }; // Match TextField height

// //   return (
// //     <div style={{ width: "100%" }}>
// //       <label style={finalLabelStyle}>{label}</label>
// //       <select {...props} style={finalInputStyle}>
// //         {options.map((opt) => (
// //           <option key={opt.value} value={opt.value}>
// //             {opt.label}
// //           </option>
// //         ))}
// //       </select>
// //     </div>
// //   );
// // };
// // const formatTimestamp = (dateStr, hour = "09:00:00") => {
// //   if (!dateStr || !dateStr.trim()) return null;
// //   const date = new Date(`${dateStr}T${hour}`);
// //   const year = date.getFullYear();
// //   const month = String(date.getMonth() + 1).padStart(2, "0");
// //   const day = String(date.getDate()).padStart(2, "0");
// //   return `${year}-${month}-${day}T${hour}+05:30`;
// // };
// // const calculateDuration = (from, to) => {
// //   if (!from || !to) return 0;
// //   const diff = new Date(to) - new Date(from);
// //   return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
// // };

// // const EmployeeVisitForm = ({ onClose, record, onSuccess }) => {
// //   const [formData, setFormData] = useState({
// //     employeeid: "",
// //     facultyname: "",
// //     department: "",
// //     designation: "",
// //     visitfrom: "",
// //     visitto: "",
// //     natureofparticipation_value: "",
// //     country: "",
// //     city: "",
// //     claimtype: "", 
// //     signingAuthority: "",
// //     toSection: [],
// //     remarks: "",
// //     leave: "",
// //   });

// //   const [bodyData, setBodyData] = useState({
// //     referenceNo: "",
// //     referenceDate: "",
// //     subject: "",
// //     refsubject: "",
// //     body: "",
// //     header: "",
// //     footer: "",
// //     template: "",
// //   });

// //   const [showPreview, setShowPreview] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false); 
// //   const [isInitialLoad, setIsInitialLoad] = useState(true); 
// //   const [previewData, setPreviewData] = useState(null); 
// //   const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
// //   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

// //   const sessionId = Cookies.get("session_id");
// //   const empId = Cookies.get("EmpId");
// //   const userRole = Cookies.get("selectedRole"); 

// //   const toSectionOptions = [
// //     `The Head of ${formData?.department || ""}`,
// //     "The Dean (Faculty)",
// //     "The Dean (Admin)",
// //     "The Dean (IC&SR)",
// //     "The Dean (ACR)",
// //     "The Dean (GE)",
// //     "The Deputy Registrar (F&A)",
// //     "Office copy",
// //     "AR (Paybill)",
// //     "AR (Bills)",
// //   ];


// //   const createPayload = (actionType, taskStatusId, userRole) => {
// //     let assignedRole;
// //     let typeofsubmit;
// //     const currentInitiator = empId || "admin";

// //     if (actionType === "saveasdraft") {
// //       typeofsubmit = "draft"; 
// //       assignedRole = "Reviewer";
// //     } else if (actionType === "submit") {
// //       typeofsubmit = "submit"; 
// //       assignedRole = "Approver"; 
// //     } else if (actionType === "preview") {
// //       typeofsubmit = "preview"; 
// //       assignedRole = "WF_Initiator";
// //     }
// //     let toColumnValue = "";
// //     const signingAuthority = formData.signingAuthority;
// //     const department = formData.department || "N/A Department"; 
// //     const facultyName = formData.facultyname || "N/A Name"; 
// //     if (signingAuthority) {
// //       toColumnValue = `<p><strong>To</strong><br>${facultyName} (ID No. ${
// //         formData.employeeid || "N/A"
// //       })<br>Thro the Head, ${department}</p><p><strong>Sir,</strong></p>`;
// //     }
// //     let signatureHtml = "";

// //     if (actionType === "submit" || actionType === "saveasdraft") {
// //       signatureHtml = `<p>${signingAuthority || "Authority Not Specified"}</p>`;
// //     }

// //     return {
// //       token: "HRFGVJISOVp1fncC",
// //       session_id: sessionId,
// //       typeofsubmit: typeofsubmit, 
// //       p_cover_page_no: record?.coverpageno || "",
// //       p_employee_id: formData.employeeid,
// //       p_employee_name: formData.facultyname,
// //       p_department: formData.department,
// //       p_designation: formData.designation,
// //       p_visit_from: formatTimestamp(formData.visitfrom, "09:00:00"),
// //       p_visit_to: formatTimestamp(formData.visitto, "17:00:00"),
// //       p_duration: calculateDuration(formData.visitfrom, formData.visitto),
// //       p_nature_of_visit: formData.natureofparticipation_value,
// //       p_claim_type: formData.claimtype, 
// //       p_city_town: formData.city,
// //       p_country: formData.country,
// //       p_header_html: bodyData.header || "",
// //       p_order_no: bodyData.referenceNo || "",
// //       p_order_date:
// //         bodyData.referenceDate || new Date().toISOString().split("T")[0],
// //       p_to_column: toColumnValue, 
// //       p_subject: bodyData.subject || "",
// //       p_reference: bodyData.refsubject || "",
// //       p_body_html: bodyData.body || "", 
// //       p_signature_html: signatureHtml, 
// //       p_cc_to: Array.isArray(formData.toSection)
// //         ? formData.toSection.join(",")
// //         : formData.toSection || "",
// //       p_footer_html: bodyData.footer || "",
// //       p_assign_to: currentInitiator, 
// //       p_assigned_role: assignedRole, 
// //       p_task_status_id: taskStatusId, 
// //       p_activity_seq_no: actionType === "submit" ? 1 : 0, 
// //       p_is_task_return: false,
// //       p_is_task_approved: actionType === "submit", 
// //       p_initiated_by: currentInitiator,
// //       p_initiated_on: new Date().toISOString().replace("Z", "+05:30"), 
// //       p_updated_by: currentInitiator,
// //       p_updated_on: new Date().toISOString().replace("Z", "+05:30"), 
// //       p_process_id: 1,
// //       p_remarks: formData.remarks,
// //       p_email_flag: false,
// //       p_reject_flag: 0,
// //       p_user_role: userRole || "", 
// //     };
// //   };
// //   const fetchAllData = async (coverpageno, employeeid) => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       if (!employeeid) throw new Error("Employee ID missing.");
// //       if (!coverpageno) throw new Error("Cover page number missing.");

// //       const apiUrl = `https://wftest1.iitm.ac.in:7000/OfficeOrder_datatemplate`;

// //       const response = await fetch(apiUrl, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify({
// //           employeeid: employeeid,
// //           coverpageno: coverpageno,
// //           session_id: sessionId,
// //           token: "HRFGVJISOVp1fncC",
// //         }),
// //       });

// //       if (!response.ok) throw new Error("Failed to fetch data from API");

// //       const encryptedData = await response.json();
// //       const encryptedPayload = encryptedData.Data ?? encryptedData.data;
// //       if (!encryptedPayload) throw new Error("Encrypted Data missing");

// //       const decryptedString = await decryptData(encryptedPayload);
// //       const parsedData = validateJsonData(decryptedString);

// //       const formatDate = (dateValue) => {
// //         if (!dateValue) return "";
// //         const date = new Date(dateValue);
// //         return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
// //       };
      
      
// //       setFormData({
// //         employeeid: parsedData.Employeeid || "",
// //         facultyname: parsedData.Employeename || "",
// //         department: parsedData.Department || "",
// //         designation: parsedData.Designation || "",
// //         visitfrom: formatDate(parsedData.VisitFrom),
// //         visitto: formatDate(parsedData.VisitTo),
// //         natureofparticipation_value: parsedData.NatureOfVisit || "",
// //         country: parsedData.Country?.trim() || "",
// //         city: parsedData.CityTown || "",
// //         claimtype: parsedData.ClaimType || "", 
// //         signingAuthority: "",
// //         toSection: [],
// //         remarks: "",
// //       });
      

// //       const destination = parsedData.Country || "";
// //       let processedSubject = parsedData.Subject || "";
// //       processedSubject = processedSubject.replace(
// //         /\{\{\.Destination\}\}/g,
// //         destination
// //       );

// //       const referenceText = parsedData.Reference || "";

// //       const formatHtmlTable = (htmlString) => {
// //         if (!htmlString || typeof htmlString !== "string") return htmlString;

// //         const tempDiv = document.createElement("div");
// //         tempDiv.innerHTML = htmlString;
// //         const table = tempDiv.querySelector("table");
// //         if (!table) return htmlString;

// //         const rows = Array.from(table.querySelectorAll("tr"));
// //         let bodyRowsHtml = "";

// //         const cleanDate = (str) => {
// //           if (!str) return "";
// //           const match = str.match(/(\d{4}-\d{2}-\d{2})/);
// //           return match ? match[1] : str.trim();
// //         };

// //         const looksLikeDate = (str) => /(\d{4}-\d{2}-\d{2})/.test(str);

// //         let startIndex = 0;
// //         for (let i = 0; i < rows.length; i++) {
// //           const row = rows[i];
// //           const text = row.textContent.trim().toLowerCase();
// //           const cells = Array.from(row.querySelectorAll("td, th"));

// //           const isHeaderText =
// //             (text.includes("leave type") &&
// //               text.includes("from") &&
// //               text.includes("to")) ||
// //             cells.every((cell) => {
// //               const cellText = cell.textContent.trim().toLowerCase();
// //               return (
// //                 cellText === "leave type" ||
// //                 cellText === "from" ||
// //                 cellText === "to"
// //               );
// //             });

// //           if (isHeaderText) {
// //             startIndex = i + 1;
// //             continue;
// //           }

// //           if (cells.length >= 3) {
// //             const hasData = cells.some((cell) => {
// //               const cellText = cell.textContent.trim();
// //               return (
// //                 cellText &&
// //                 !cellText.toLowerCase().includes("leave type") &&
// //                 !cellText.toLowerCase().includes("from") &&
// //                 !cellText.toLowerCase().includes("to")
// //               );
// //             });

// //             if (hasData) {
// //               startIndex = i;
// //               break;
// //             }
// //           }
// //         }

// //         for (let i = startIndex; i < rows.length; i++) {
// //           const cells = Array.from(rows[i].querySelectorAll("td, th"));
// //           if (cells.length < 3) continue;

// //           let leaveType = cells[0]?.textContent.trim() || "";
// //           let fromDate = cleanDate(cells[1]?.textContent.trim() || "");
// //           let toDate = cleanDate(cells[2]?.textContent.trim() || "");

// //           if (
// //             looksLikeDate(leaveType) &&
// //             !looksLikeDate(fromDate) &&
// //             fromDate
// //           ) {
// //             const temp = leaveType;
// //             leaveType = fromDate;
// //             fromDate = cleanDate(temp);
// //           }

// //           if (leaveType || fromDate || toDate) {
// //             bodyRowsHtml += `
// //               <tr>
// //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${leaveType}</td>
// //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${fromDate}</td>
// //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${toDate}</td>
// //               </tr>
// //             `;
// //           }
// //         }

// //         const newTableHtml = `
// //           <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
// //             <thead>
// //               <tr>
// //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">Leave Type</th>
// //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">From</th>
// //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">To</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               ${
// //                 bodyRowsHtml ||
// //                 '<tr><td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: center;">-</td></tr>'
// //               }
// //             </tbody>
// //           </table>
// //         `;

// //         table.outerHTML = newTableHtml;
// //         return tempDiv.innerHTML;
// //       };

// //       const formattedBody = formatHtmlTable(parsedData.Body || "");

// //       setBodyData({
// //         referenceNo: parsedData.ReferenceNumber || "",
// //         referenceDate: parsedData.ReferenceDate || "",
// //         subject: stripNonEnglish(processedSubject),
// //         refsubject: referenceText,
// //         body: formattedBody,
// //         header: parsedData.Header || "",
// //         footer: parsedData.Footer || "",
// //         template: stripNonEnglish(parsedData.filled_template || ""),
// //       });
// //       setIsSavedSuccessfully(true);
      
// //       setPreviewCoverPageNo(record.coverpageno);
// //       setSelectedEmployeeId(employeeid);

// //     } catch (err) {
// //       console.error("API Fetch Error:", err);
// //       setError(err.message || "Failed to fetch data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   useEffect(() => {
// //     const initializeData = async () => {
// //       if (isInitialLoad && record?.coverpageno && record?.employeeid) {
// //         try {
// //           await fetchAllData(record.coverpageno, record.employeeid);
// //           setIsInitialLoad(false); 
// //         } catch (error) {
// //           console.error("Initialization error:", error);
// //           setError("Failed to initialize form data");
// //           setIsInitialLoad(false); // Ensure loading state is reset even on error
// //         }
// //       }
// //     };

// //     initializeData();
// //   }, [record, sessionId, isInitialLoad]);

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     if (!isInitialLoad) {
// //         setIsSavedSuccessfully(false); 
// //     }

// //     if (type === "checkbox") {
// //       setFormData((prev) => {
// //         const current = Array.isArray(prev.toSection) ? prev.toSection : [];
// //         const updated = checked
// //           ? [...current, value]
// //           : current.filter((v) => v !== value);
// //         return { ...prev, toSection: updated };
// //       });
// //     } else if (
// //       [
// //         "referenceNo",
// //         "referenceDate",
// //         "subject",
// //         "refsubject",
// //         "body",
// //         "header",
// //         "footer",
// //         "template",
// //       ].includes(name)
// //     ) {
// //       setBodyData((prev) => ({ ...prev, [name]: value }));
// //     } else {
// //       setFormData((prev) => ({ ...prev, [name]: value }));
// //     }
// //   };


// //   const validateForm = (isDraft = false) => {
// //     const missingFields = [];
// //     const invalidFields = [];
// //     const requiredFieldsForSubmit = {
// //       natureofparticipation_value: "Nature of Visit",
// //       visitfrom: "Visit From Date",
// //       visitto: "Visit To Date",
// //       country: "Country",
// //       city: "City/Town",
// //       subject: "Subject",
// //       refsubject: "Reference (Ref)",
// //       body: "Body",
// //       signingAuthority: "Signing Authority",
// //       toSection: "To Section",
// //       remarks: "Remarks",
// //     };
// //     const requiredFieldsForDraft = {
// //       natureofparticipation_value: "Nature of Visit",
// //       visitfrom: "Visit From Date",
// //       visitto: "Visit To Date",
// //       country: "Country",
// //       city: "City/Town",
// //     };

// //     const fieldsToValidate = isDraft ? requiredFieldsForDraft : requiredFieldsForSubmit;
// //     for (const [key, label] of Object.entries(fieldsToValidate)) {
// //       let value = formData.hasOwnProperty(key) ? formData[key] : bodyData[key];
// //       if (
// //         value === "" ||
// //         value === null ||
// //         value === undefined ||
// //         (Array.isArray(value) && value.length === 0) ||
// //         (typeof value === "string" && value.trim() === "")
// //       ) {
// //         missingFields.push(label);
// //       }
// //     }
// //     if (formData.visitfrom && formData.visitto) {
// //       const fromDate = new Date(formData.visitfrom);
// //       const toDate = new Date(formData.visitto);
      
// //       if (fromDate > toDate) {
// //         invalidFields.push("Visit To Date must be equal to or after Visit From Date");
// //       }
// //     }
// //     if (!isDraft) {
// //       if (bodyData.subject && bodyData.subject.trim().length < 10) {
// //         invalidFields.push("Subject must be at least 10 characters long");
// //       }
// //       if (bodyData.body) {
// //         const tempDiv = document.createElement("div");
// //         tempDiv.innerHTML = bodyData.body;
// //         const textContent = tempDiv.textContent || tempDiv.innerText || "";
// //         if (textContent.trim().length < 20) {
// //           invalidFields.push("Body must contain at least 20 characters of text");
// //         }
// //       }
// //       if (formData.country && !/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
// //         invalidFields.push("Country must contain only alphabetic characters");
// //       }
// //       if (formData.city && !/^[a-zA-Z\s,.-]+$/.test(formData.city.trim())) {
// //         invalidFields.push("City/Town must contain only alphabetic characters and basic punctuation");
// //       }
     
// //     }
// //     const errorMessages = [];
    
// //     if (missingFields.length > 0) {
// //       errorMessages.push(`Missing required fields: ${missingFields.join(", ")}`);
// //     }

// //     if (invalidFields.length > 0) {
// //       errorMessages.push(...invalidFields);
// //     }

// //     if (errorMessages.length > 0) {
// //       const message = errorMessages.join(". ");
// //       setError(message);
      
// //       Swal.fire({
// //         title: "Validation Error",
// //         html: errorMessages.map(msg => `• ${msg}`).join("<br>"),
// //         icon: "warning",
// //       });
      
// //       return false;
// //     }

// //     setError("");
// //     return true;
// //   };
// //   const handleSave = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");
// //       console.log("Save as Draft - Starting...");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       const taskStatusId = 6; 

// //       const reqpayload = createPayload("saveasdraft", taskStatusId, userRole); 

// //       const response = await fetch(
// //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(reqpayload),
// //         }
// //       );

// //       if (!response.ok) throw new Error("Failed to insert Office Order");
// //       await response.json();

// //       setIsSavedSuccessfully(true); 

// //       await Swal.fire({
// //         title: "Saved!",
// //         text: "The task has been saved as a draft successfully. You may now view the preview.",
// //         icon: "success",
// //         timer: 3000,
// //         showConfirmButton: false,
// //       });

// //     } catch (err) {
// //       console.error("Save as Draft - Error:", err);
// //       setError(err.message || "Failed to insert Office Order");

// //       Swal.fire({
// //         title: "Error",
// //         text: err.message || "Failed to insert Office Order",
// //         icon: "error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     if (e) e.preventDefault();
// //     if (!validateForm()) return;

// //     try {
// //       setLoading(true);
// //       setError("");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       const taskStatusId = 4; 

// //       const requestpayload = createPayload("submit", taskStatusId, userRole); 

// //       const response = await fetch(
// //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(requestpayload),
// //         }
// //       );

// //       if (!response.ok) throw new Error("Failed to insert Office Order");

// //       await response.json();

// //       setLoading(false);
// //       setIsSavedSuccessfully(true); 

// //       await Swal.fire({
// //         title: "Submitted!",
// //         text: "The task has been submitted successfully. Returning to previous page.",
// //         icon: "success",
// //         timer: 3000,
// //         showConfirmButton: false,
// //       });
// //       onClose?.(true);
// //     } catch (err) {
// //       console.error("Insert API Error:", err);
// //       setError(err.message || "Failed to insert Office Order");

// //       Swal.fire({
// //         title: "Error",
// //         text: err.message || "Failed to insert Office Order",
// //         icon: "error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   const handlePreview = async () => {
// //     if (!isSavedSuccessfully) {
// //       setError("Please save the draft or submit the form before previewing.");
// //       Swal.fire({
// //         title: "Action Required",
// //         text: "Please save the current changes as a draft or submit the form before generating the preview PDF.",
// //         icon: "info",
// //       });
// //       return;
// //     }
    
// //     if (
// //       !record?.coverpageno ||
// //       !formData.employeeid ||
// //       !formData.signingAuthority
// //     ) {
// //       setError(
// //         "Cannot generate preview: Missing Cover Page Number, Employee ID, or Signing Authority."
// //       );
// //       return;
// //     }
    
// //     setLoading(true);
// //     setError("");

// //     try {
// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       const pdfApiUrl = `https://wftest1.iitm.ac.in:8080/api/officeorder/pdf`;
      
// //       const response = await fetch(pdfApiUrl, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify({
// //           employeeid: formData.employeeid,
// //           coverpageno: record.coverpageno,
// //           templatetype: "draft",
// //           status: "saveandhold",
// //         }),
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(
// //           `Failed to generate PDF. Server responded with: ${
// //             errorText || response.statusText
// //           }`
// //         );
// //       }

// //       const pdfBlob = await response.blob();
// //       const fileURL = URL.createObjectURL(pdfBlob);
      
// //       setPreviewData({
// //         pdfUrl: fileURL,
// //         formData: formData,
// //         bodyData: bodyData,
// //       });
// //       setPreviewCoverPageNo(record.coverpageno);
// //       setSelectedEmployeeId(formData.employeeid);
      
// //       setShowPreview(true); 

// //     } catch (err) {
// //       console.error("Preview Generation Error:", err);
// //       const errorMessage =
// //         err.message ||
// //         "An unexpected error occurred while generating the preview.";
// //       setError(errorMessage);
// //       Swal.fire({
// //         title: "Preview Error",
// //         text: errorMessage,
// //         icon: "error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleClosePreview = () => {
// //     setShowPreview(false);
// //     if (previewData?.pdfUrl) {
// //       URL.revokeObjectURL(previewData.pdfUrl); 
// //       setPreviewData(null);
// //     }
// //   };

// //   const handleBack = () => onClose?.(false); 

// //   if (loading && isInitialLoad)
// //     return <div style={loadingStyle}>Loading employee data...</div>;

// //   if (showPreview && previewData?.pdfUrl) {
// //     return (
// //       <OfficeOrderPreview
// //         coverpageno={previewCoverPageNo}
// //         employeeid={selectedEmployeeId}
// //         pdfUrl={previewData.pdfUrl} 
// //         formData={previewData.formData}
// //         bodyData={previewData.bodyData}
// //         onBack={handleClosePreview} 
// //         isLocalPreview={false} 
// //         loading={loading}
// //       />
// //     );
// //   }

// //   return (
// //     <div style={containerStyle}>
// //       <div style={cardStyle}>
// //         <button onClick={handleBack} style={backButtonStyle}>
// //           ← Back
// //         </button>
// //         <h2 style={headingStyle}>Permission Cum Relief</h2>
// //         {error && <Alerts type="error" variant="outlined" message={error} />}

// //         <form onSubmit={handleSubmit}>
// //           {/* Employee Info */}
// //           <FormSection>
// //             <h3 style={sectionHeadingStyle}>
// //               Employee Information
// //             </h3>

// //           {/* Row 1: Employee ID, Name, Dept, Desig */}
// //               <div style={gridRowStyle}>
// //                 <TextField
// //                   label="Employee ID"
// //                   name="employeeid"
// //                   value={formData.employeeid}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Employee Name"
// //                   name="facultyname"
// //                   value={formData.facultyname}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Department"
// //                   name="department"
// //                   value={formData.department}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Designation"
// //                   name="designation"
// //                   value={formData.designation}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //               </div>

// //               {/* Row 2: Nature, Visit From, Visit To, Country */}
// //               <div style={gridRowStyle}>
// //                 <TextField
// //                   label="Nature of Visit"
// //                   name="natureofparticipation_value"
// //                   value={formData.natureofparticipation_value}
// //                   onChange={handleChange}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   type="date"
// //                   label="Visit From"
// //                   name="visitfrom"
// //                   value={formData.visitfrom}
// //                   onChange={handleChange}
// //                   InputLabelProps={{ shrink: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   type="date"
// //                   label="Visit To"
// //                   name="visitto"
// //                   value={formData.visitto}
// //                   onChange={handleChange}
// //                   InputLabelProps={{ shrink: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Country"
// //                   name="country"
// //                   value={formData.country}
// //                   onChange={handleChange}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //               </div>

// //               {/* Row 3: City/Town (1 column) */}
// //               <div style={gridRowStyle}>
// //                 <TextField
// //                   label="City/Town"
// //                   name="city"
// //                   value={formData.city}
// //                   onChange={handleChange}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 {/* Claim Type hidden field */}
// //                 <TextField
// //                   label="Claim Type"
// //                   name="claimtype"
// //                   value={formData.claimtype}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   sx={{ display: "none" }} 
// //                 />
// //                 <div></div> {/* Filler */}
// //                 <div></div> {/* Filler */}
// //                 <div></div> {/* Filler */}
// //               </div>
           
// //           </FormSection>

// //           {/* Office Order Details */}
// //           <FormSection>
// //             <h3 style={sectionHeadingStyle}>
// //               Office Order Details
// //             </h3>

// //             {/* Hidden Header/Footer fields */}
// //             <TextField
// //               label="Header"
// //               name="header"
// //               value={bodyData.header || ""}
// //               variant="outlined"
// //               fullWidth
// //               sx={{ display: "none" }}
// //             />
// //             <TextField
// //               label="Reference Number"
// //               name="referenceNo"
// //               value={bodyData.referenceNo}
// //               onChange={handleChange}
// //               variant="outlined"
// //               fullWidth
// //               sx={{ display: "none" }}
// //             />
// //             <TextField
// //               label="Reference Date"
// //               name="referenceDate"
// //               value={bodyData.referenceDate}
// //               onChange={handleChange}
// //               variant="outlined"
// //               fullWidth
// //               sx={{ display: "none" }}
// //             />

// //             {/* Subject and Ref in one row (2 columns) */}
// //             <div style={gridRowTwoColumnStyles}>
// //               <TextField
// //                 label="Subject"
// //                 name="subject"
// //                 value={bodyData.subject}
// //                 onChange={handleChange}
// //                 variant="outlined"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //               />

// //               {/* Using TextField equivalent structure for Ref for consistent height */}
// //               <TextField
// //                 label="Ref"
// //                 name="refsubject"
// //                 value={bodyData.refsubject || ""}
// //                 onChange={handleChange}
// //                 variant="outlined"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //               />
// //             </div>

// //             {/* Body (Full width) */}
// //             <div style={{ marginBottom: "16px" }}>
// //               <label style={labelStyle}>Body</label>
// //               <div style={{ border: "1px solid #D1D5DB", borderRadius: "8px", padding: '8px' }}>
// //                 <TextEdit
// //                   value={bodyData.body}
// //                   onChange={(value) => {
// //                     setBodyData((prev) => ({ ...prev, body: value }));
// //                     if (!isInitialLoad) {
// //                       setIsSavedSuccessfully(false);
// //                     }
// //                   }}
// //                 />
// //               </div>
// //             </div>
            
// //             {/* Signing Authority in one column */}
// //             <div style={gridRowStyle}>
// //               <Select
// //                 label="Signing Authority"
// //                 name="signingAuthority"
// //                 value={formData.signingAuthority}
// //                 onChange={handleChange}
// //                 options={[
// //                   { value: "", label: "Select signing authority" },
// //                   { value: "Deputy Registrar", label: "Deputy Registrar" },
// //                   {
// //                     value: "Assistant Registrar",
// //                     label: "Assistant Registrar",
// //                   },
// //                   { value: "Registrar", label: "Registrar" },
// //                 ]}
// //               />
// //               <div></div> {/* Filler */}
// //               <div></div> {/* Filler */}
// //               <div></div> {/* Filler */}
// //             </div>

// //             {/* TO Section (Full width, checkbox grid) */}
// //             <div style={{ marginBottom: "16px" }}>
// //               <label style={labelStyle}>TO Section</label>
// //               <div style={checkboxGridStyle}>
// //                 {toSectionOptions.map((opt) => (
// //                   <div key={opt} style={checkboxItemStyle}>
// //                     <input
// //                       type="checkbox"
// //                       value={opt}
// //                       checked={formData.toSection.includes(opt)}
// //                       onChange={handleChange}
// //                       style={{ marginRight: "8px" }}
// //                     />
// //                     <span style={{ fontSize: "14px" }}>{opt}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Remarks (Full width) */}
// //             <div style={gridRowTwoColumnStyle}>
// //               <TextField
// //                 label="Remarks"
// //                 name="remarks"
// //                 value={formData.remarks}
// //                 onChange={handleChange}
// //                 variant="outlined"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //               />
// //             </div>
// //           </FormSection>

// //           {/* Buttons (Right Aligned) */}
// //           <div style={buttonContainerStyle}>
// //             <button
// //               type="button"
// //               onClick={handleSave}
// //               style={{ ...buttonStyle, backgroundColor: "#7C3AED" }}
// //               disabled={loading}
// //             >
// //               Save as Draft
// //             </button>

// //             <button
// //               type="submit"
// //               style={{ ...buttonStyle, backgroundColor: "#10B981" }}
// //               disabled={loading}
// //             >
// //               Submit
// //             </button>

// //             {/* PREVIEW BUTTON: Conditional based on saved state, as requested by 'don't change any logics' */}
// //             {isSavedSuccessfully && (
// //               <button
// //                 type="button"
// //                 onClick={handlePreview}
// //                 style={{ ...buttonStyle, backgroundColor: "#F59E0B" }}
// //                 disabled={loading}
// //               >
// //                 Preview
// //               </button>
// //             )}
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // /* ---------- STYLES (Refined for Consistency) ---------- */
// // const containerStyle = {
// //   width: "100%",
// //   minHeight: "100vh",
// //   display: "flex",
// //   justifyContent: "center",
// //   alignItems: "flex-start",
// //   padding: "20px",
// //   backgroundColor: "#f9fafb", // Added subtle background
// // };
// // const cardStyle = {
// //   width: "100%",
// //   maxWidth: "1200px",
// //   padding: "32px",
// //   borderRadius: "12px",
// //   boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
// //   backgroundColor: "#fff",
// //   marginTop: "20px",
// // };
// // const headingStyle = {
// //   marginBottom: "24px",
// //   color: "rgb(107, 114, 128)",
// //   fontSize: "24px",
// //   fontWeight: "600",
// // };
// // const sectionHeadingStyle = {
// //   marginBottom: "16px",
// //   fontSize: "18px",
// //   fontWeight: "600",
// //   color: "#374151",
// // }
// // const labelStyle = {
// //   display: "block",
// //   marginBottom: "6px",
// //   fontWeight: "500",
// //   color: "#374151",
// // };
// // const inputStyle = {
// //   width: "100%",
// //   padding: "10px 12px",
// //   borderRadius: "8px",
// //   border: "1px solid #D1D5DB",
// //   fontSize: "14px",
// //   color: "#374151",
// //   boxSizing: 'border-box', // Ensure padding is inside width
// // };
// // const buttonStyle = {
// //   padding: "10px 20px",
// //   border: "none",
// //   borderRadius: "8px",
// //   color: "#fff",
// //   cursor: "pointer",
// //   fontWeight: "600",
// //   transition: "background-color 0.3s",
// // };
// // const backButtonStyle = {
// //   padding: "8px 16px",
// //   border: "none",
// //   borderRadius: "6px",
// //   backgroundColor: "rgb(37, 99, 235)",
// //   color: "#fff",
// //   cursor: "pointer",
// //   fontWeight: "600",
// //   marginBottom: "20px",
// // };
// // const gridRowStyle = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(4, 1fr)",
// //   gap: "16px",
// //   marginBottom: "16px",
// // };
// // const gridRowTwoColumnStyle = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(1, 1fr)",
// //   gap: "16px",
// //   marginBottom: "16px",
// // };

// // const gridRowTwoColumnStyles = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(2, 1fr)", // Changed to 2fr here for Subject/Ref
// //   gap: "16px",
// //   marginBottom: "16px",
// //   width: "100%",
// // };

// // const checkboxGridStyle = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(2, 1fr)",
// //   gap: "8px",
// //   marginTop: "8px",
// // };
// // const checkboxItemStyle = {
// //   display: "flex",
// //   alignItems: "center",
// //   marginBottom: "6px",
// // };
// // const loadingStyle = {
// //   display: "flex",
// //   justifyContent: "center",
// //   alignItems: "center",
// //   height: "100vh",
// //   fontSize: "18px",
// //   color: "#6B7280",
// // };
// // const buttonContainerStyle = {
// //     display: "flex", 
// //     gap: "12px", 
// //     marginTop: "20px",
// //     justifyContent: "flex-end", // Right alignment
// // };

// // export default EmployeeVisitForm;




// // import React, { useState, useEffect } from "react";
// // import Cookies from "js-cookie";
// // import TextField from "@mui/material/TextField";
// // import OfficeOrderPreview from "./OfficeOrderPreview.js";
// // import DropdownWithCheckboxes from "src/components/ui/DropdownWithCheckBox";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import Alerts from "src/components/ui/Alerts.js";
// // import TextEdit from "./TextEdit";
// // import Swal from "sweetalert2";
// // import { HostName } from "src/assets/host/Host";
// // import FormSection from "src/components/ui/TopColorCard.js"; // New import for the FormSection component

// // const stripNonEnglish = (text) => {
// //   if (typeof text !== "string") return text;
// //   return text.replace(/[^\x00-\x7F]/g, ""); // Basic ASCII filter for safety
// // };
// // const Select = ({ label, options, ...props }) => {
// //   const finalLabelStyle = { ...labelStyle, marginBottom: '8px' }; // Refined label style
// //   const finalInputStyle = { ...inputStyle, height: '56px' }; // Match TextField height

// //   return (
// //     <div style={{ width: "100%" }}>
// //       <label style={finalLabelStyle}>{label}</label>
// //       <select {...props} style={finalInputStyle}>
// //         {options.map((opt) => (
// //           <option key={opt.value} value={opt.value}>
// //             {opt.label}
// //           </option>
// //         ))}
// //       </select>
// //     </div>
// //   );
// // };
// // const formatTimestamp = (dateStr, hour = "09:00:00") => {
// //   if (!dateStr || !dateStr.trim()) return null;
// //   const date = new Date(`${dateStr}T${hour}`);
// //   const year = date.getFullYear();
// //   const month = String(date.getMonth() + 1).padStart(2, "0");
// //   const day = String(date.getDate()).padStart(2, "0");
// //   return `${year}-${month}-${day}T${hour}+05:30`;
// // };
// // const calculateDuration = (from, to) => {
// //   if (!from || !to) return 0;
// //   const diff = new Date(to) - new Date(from);
// //   return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
// // };

// // const EmployeeVisitForm = ({ onClose, record, onSuccess }) => {
// //   const [formData, setFormData] = useState({
// //     employeeid: "",
// //     facultyname: "",
// //     department: "",
// //     designation: "",
// //     visitfrom: "",
// //     visitto: "",
// //     natureofparticipation_value: "",
// //     country: "",
// //     city: "",
// //     claimtype: "", 
// //     signingAuthority: "",
// //     toSection: [],
// //     remarks: "",
// //     leave: "",
// //   });

// //   const [bodyData, setBodyData] = useState({
// //     referenceNo: "",
// //     referenceDate: "",
// //     subject: "",
// //     refsubject: "",
// //     body: "",
// //     header: "",
// //     footer: "",
// //     template: "",
// //   });

// //   const [showPreview, setShowPreview] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false); 
// //   const [isInitialLoad, setIsInitialLoad] = useState(true); 
// //   const [previewData, setPreviewData] = useState(null); 
// //   const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
// //   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

// //   const sessionId = Cookies.get("session_id");
// //   const empId = Cookies.get("EmpId");
// //   const userRole = Cookies.get("selectedRole"); 

// //   const toSectionOptions = [
// //     `The Head of ${formData?.department || ""}`,
// //     "The Dean (Faculty)",
// //     "The Dean (Admin)",
// //     "The Dean (IC&SR)",
// //     "The Dean (ACR)",
// //     "The Dean (GE)",
// //     "The Deputy Registrar (F&A)",
// //     "Office copy",
// //     "AR (Paybill)",
// //     "AR (Bills)",
// //   ];


// //   const createPayload = (actionType, taskStatusId, userRole) => {
// //     let assignedRole;
// //     let typeofsubmit;
// //     const currentInitiator = empId || "admin";

// //     if (actionType === "saveasdraft") {
// //       typeofsubmit = "draft"; 
// //       assignedRole = "Reviewer";
// //     } else if (actionType === "submit") {
// //       typeofsubmit = "submit"; 
// //       assignedRole = "Approver"; 
// //     } else if (actionType === "preview") {
// //       typeofsubmit = "preview"; 
// //       assignedRole = "WF_Initiator";
// //     }
// //     let toColumnValue = "";
// //     const signingAuthority = formData.signingAuthority;
// //     const department = formData.department || "N/A Department"; 
// //     const facultyName = formData.facultyname || "N/A Name"; 
// //     if (signingAuthority) {
// //       toColumnValue = `<p><strong>To</strong><br>${facultyName} (ID No. ${
// //         formData.employeeid || "N/A"
// //       })<br>Thro the Head, ${department}</p><p><strong>Sir,</strong></p>`;
// //     }
// //     let signatureHtml = "";

// //     if (actionType === "submit" || actionType === "saveasdraft") {
// //       signatureHtml = `<p>${signingAuthority || "Authority Not Specified"}</p>`;
// //     }

// //     return {
// //       token: "HRFGVJISOVp1fncC",
// //       session_id: sessionId,
// //       typeofsubmit: typeofsubmit, 
// //       p_cover_page_no: record?.coverpageno || "",
// //       p_employee_id: formData.employeeid,
// //       p_employee_name: formData.facultyname,
// //       p_department: formData.department,
// //       p_designation: formData.designation,
// //       p_visit_from: formatTimestamp(formData.visitfrom, "09:00:00"),
// //       p_visit_to: formatTimestamp(formData.visitto, "17:00:00"),
// //       p_duration: calculateDuration(formData.visitfrom, formData.visitto),
// //       p_nature_of_visit: formData.natureofparticipation_value,
// //       p_claim_type: formData.claimtype, 
// //       p_city_town: formData.city,
// //       p_country: formData.country,
// //       p_header_html: bodyData.header || "",
// //       p_order_no: bodyData.referenceNo || "",
// //       p_order_date:
// //         bodyData.referenceDate || new Date().toISOString().split("T")[0],
// //       p_to_column: toColumnValue, 
// //       p_subject: bodyData.subject || "",
// //       p_reference: bodyData.refsubject || "",
// //       p_body_html: bodyData.body || "", 
// //       p_signature_html: signatureHtml, 
// //       p_cc_to: Array.isArray(formData.toSection)
// //         ? formData.toSection.join(",")
// //         : formData.toSection || "",
// //       p_footer_html: bodyData.footer || "",
// //       p_assign_to: currentInitiator, 
// //       p_assigned_role: assignedRole, 
// //       p_task_status_id: taskStatusId, 
// //       p_activity_seq_no: actionType === "submit" ? 1 : 0, 
// //       p_is_task_return: false,
// //       p_is_task_approved: actionType === "submit", 
// //       p_initiated_by: currentInitiator,
// //       p_initiated_on: new Date().toISOString().replace("Z", "+05:30"), 
// //       p_updated_by: currentInitiator,
// //       p_updated_on: new Date().toISOString().replace("Z", "+05:30"), 
// //       p_process_id: 1,
// //       p_remarks: formData.remarks,
// //       p_email_flag: false,
// //       p_reject_flag: 0,
// //       p_user_role: userRole || "", 
// //     };
// //   };
// //   const fetchAllData = async (coverpageno, employeeid) => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       if (!employeeid) throw new Error("Employee ID missing.");
// //       if (!coverpageno) throw new Error("Cover page number missing.");

// //       const apiUrl = `https://wftest1.iitm.ac.in:7000/OfficeOrder_datatemplate`;

// //       const response = await fetch(apiUrl, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify({
// //           employeeid: employeeid,
// //           coverpageno: coverpageno,
// //           session_id: sessionId,
// //           token: "HRFGVJISOVp1fncC",
// //         }),
// //       });

// //       if (!response.ok) throw new Error("Failed to fetch data from API");

// //       const encryptedData = await response.json();
// //       const encryptedPayload = encryptedData.Data ?? encryptedData.data;
// //       if (!encryptedPayload) throw new Error("Encrypted Data missing");

// //       const decryptedString = await decryptData(encryptedPayload);
// //       const parsedData = validateJsonData(decryptedString);

// //       const formatDate = (dateValue) => {
// //         if (!dateValue) return "";
// //         const date = new Date(dateValue);
// //         return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
// //       };
      
      
// //       setFormData({
// //         employeeid: parsedData.Employeeid || "",
// //         facultyname: parsedData.Employeename || "",
// //         department: parsedData.Department || "",
// //         designation: parsedData.Designation || "",
// //         visitfrom: formatDate(parsedData.VisitFrom),
// //         visitto: formatDate(parsedData.VisitTo),
// //         natureofparticipation_value: parsedData.NatureOfVisit || "",
// //         country: parsedData.Country?.trim() || "",
// //         city: parsedData.CityTown || "",
// //         claimtype: parsedData.ClaimType || "", 
// //         signingAuthority: "",
// //         toSection: [],
// //         remarks: "",
// //       });
      

// //       const destination = parsedData.Country || "";
// //       let processedSubject = parsedData.Subject || "";
// //       processedSubject = processedSubject.replace(
// //         /\{\{\.Destination\}\}/g,
// //         destination
// //       );

// //       const referenceText = parsedData.Reference || "";

// //       const formatHtmlTable = (htmlString) => {
// //         if (!htmlString || typeof htmlString !== "string") return htmlString;

// //         const tempDiv = document.createElement("div");
// //         tempDiv.innerHTML = htmlString;
// //         const table = tempDiv.querySelector("table");
// //         if (!table) return htmlString;

// //         const rows = Array.from(table.querySelectorAll("tr"));
// //         let bodyRowsHtml = "";

// //         const cleanDate = (str) => {
// //           if (!str) return "";
// //           const match = str.match(/(\d{4}-\d{2}-\d{2})/);
// //           return match ? match[1] : str.trim();
// //         };

// //         const looksLikeDate = (str) => /(\d{4}-\d{2}-\d{2})/.test(str);

// //         let startIndex = 0;
// //         for (let i = 0; i < rows.length; i++) {
// //           const row = rows[i];
// //           const text = row.textContent.trim().toLowerCase();
// //           const cells = Array.from(row.querySelectorAll("td, th"));

// //           const isHeaderText =
// //             (text.includes("leave type") &&
// //               text.includes("from") &&
// //               text.includes("to")) ||
// //             cells.every((cell) => {
// //               const cellText = cell.textContent.trim().toLowerCase();
// //               return (
// //                 cellText === "leave type" ||
// //                 cellText === "from" ||
// //                 cellText === "to"
// //               );
// //             });

// //           if (isHeaderText) {
// //             startIndex = i + 1;
// //             continue;
// //           }

// //           if (cells.length >= 3) {
// //             const hasData = cells.some((cell) => {
// //               const cellText = cell.textContent.trim();
// //               return (
// //                 cellText &&
// //                 !cellText.toLowerCase().includes("leave type") &&
// //                 !cellText.toLowerCase().includes("from") &&
// //                 !cellText.toLowerCase().includes("to")
// //               );
// //             });

// //             if (hasData) {
// //               startIndex = i;
// //               break;
// //             }
// //           }
// //         }

// //         for (let i = startIndex; i < rows.length; i++) {
// //           const cells = Array.from(rows[i].querySelectorAll("td, th"));
// //           if (cells.length < 3) continue;

// //           let leaveType = cells[0]?.textContent.trim() || "";
// //           let fromDate = cleanDate(cells[1]?.textContent.trim() || "");
// //           let toDate = cleanDate(cells[2]?.textContent.trim() || "");

// //           if (
// //             looksLikeDate(leaveType) &&
// //             !looksLikeDate(fromDate) &&
// //             fromDate
// //           ) {
// //             const temp = leaveType;
// //             leaveType = fromDate;
// //             fromDate = cleanDate(temp);
// //           }

// //           if (leaveType || fromDate || toDate) {
// //             bodyRowsHtml += `
// //               <tr>
// //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${leaveType}</td>
// //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${fromDate}</td>
// //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${toDate}</td>
// //               </tr>
// //             `;
// //           }
// //         }

// //         const newTableHtml = `
// //           <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
// //             <thead>
// //               <tr>
// //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">Leave Type</th>
// //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">From</th>
// //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">To</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               ${
// //                 bodyRowsHtml ||
// //                 '<tr><td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: center;">-</td></tr>'
// //               }
// //             </tbody>
// //           </table>
// //         `;

// //         table.outerHTML = newTableHtml;
// //         return tempDiv.innerHTML;
// //       };

// //       const formattedBody = formatHtmlTable(parsedData.Body || "");

// //       setBodyData({
// //         referenceNo: parsedData.ReferenceNumber || "",
// //         referenceDate: parsedData.ReferenceDate || "",
// //         subject: stripNonEnglish(processedSubject),
// //         refsubject: referenceText,
// //         body: formattedBody,
// //         header: parsedData.Header || "",
// //         footer: parsedData.Footer || "",
// //         template: stripNonEnglish(parsedData.filled_template || ""),
// //       });
// //       setIsSavedSuccessfully(true);
      
// //       setPreviewCoverPageNo(record.coverpageno);
// //       setSelectedEmployeeId(employeeid);

// //     } catch (err) {
// //       console.error("API Fetch Error:", err);
// //       setError(err.message || "Failed to fetch data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   useEffect(() => {
// //     const initializeData = async () => {
// //       if (isInitialLoad && record?.coverpageno && record?.employeeid) {
// //         try {
// //           await fetchAllData(record.coverpageno, record.employeeid);
// //           setIsInitialLoad(false); 
// //         } catch (error) {
// //           console.error("Initialization error:", error);
// //           setError("Failed to initialize form data");
// //           setIsInitialLoad(false); // Ensure loading state is reset even on error
// //         }
// //       }
// //     };

// //     initializeData();
// //   }, [record, sessionId, isInitialLoad]);

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     if (!isInitialLoad) {
// //         setIsSavedSuccessfully(false); 
// //     }

// //     if (type === "checkbox") {
// //       setFormData((prev) => {
// //         const current = Array.isArray(prev.toSection) ? prev.toSection : [];
// //         const updated = checked
// //           ? [...current, value]
// //           : current.filter((v) => v !== value);
// //         return { ...prev, toSection: updated };
// //       });
// //     } else if (
// //       [
// //         "referenceNo",
// //         "referenceDate",
// //         "subject",
// //         "refsubject",
// //         "body",
// //         "header",
// //         "footer",
// //         "template",
// //       ].includes(name)
// //     ) {
// //       setBodyData((prev) => ({ ...prev, [name]: value }));
// //     } else {
// //       setFormData((prev) => ({ ...prev, [name]: value }));
// //     }
// //   };


// //   const validateForm = (isDraft = false) => {
// //     const missingFields = [];
// //     const invalidFields = [];
// //     const requiredFieldsForSubmit = {
// //       natureofparticipation_value: "Nature of Visit",
// //       visitfrom: "Visit From Date",
// //       visitto: "Visit To Date",
// //       country: "Country",
// //       city: "City/Town",
// //       subject: "Subject",
// //       refsubject: "Reference (Ref)",
// //       body: "Body",
// //       signingAuthority: "Signing Authority",
// //       toSection: "To Section",
// //       remarks: "Remarks",
// //     };
// //     const requiredFieldsForDraft = {
// //       natureofparticipation_value: "Nature of Visit",
// //       visitfrom: "Visit From Date",
// //       visitto: "Visit To Date",
// //       country: "Country",
// //       city: "City/Town",
// //     };

// //     const fieldsToValidate = isDraft ? requiredFieldsForDraft : requiredFieldsForSubmit;
// //     for (const [key, label] of Object.entries(fieldsToValidate)) {
// //       let value = formData.hasOwnProperty(key) ? formData[key] : bodyData[key];
// //       if (
// //         value === "" ||
// //         value === null ||
// //         value === undefined ||
// //         (Array.isArray(value) && value.length === 0) ||
// //         (typeof value === "string" && value.trim() === "")
// //       ) {
// //         missingFields.push(label);
// //       }
// //     }
// //     if (formData.visitfrom && formData.visitto) {
// //       const fromDate = new Date(formData.visitfrom);
// //       const toDate = new Date(formData.visitto);
      
// //       if (fromDate > toDate) {
// //         invalidFields.push("Visit To Date must be equal to or after Visit From Date");
// //       }
// //     }
// //     if (!isDraft) {
// //       if (bodyData.subject && bodyData.subject.trim().length < 10) {
// //         invalidFields.push("Subject must be at least 10 characters long");
// //       }
// //       if (bodyData.body) {
// //         const tempDiv = document.createElement("div");
// //         tempDiv.innerHTML = bodyData.body;
// //         const textContent = tempDiv.textContent || tempDiv.innerText || "";
// //         if (textContent.trim().length < 20) {
// //           invalidFields.push("Body must contain at least 20 characters of text");
// //         }
// //       }
// //       if (formData.country && !/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
// //         invalidFields.push("Country must contain only alphabetic characters");
// //       }
// //       if (formData.city && !/^[a-zA-Z\s,.-]+$/.test(formData.city.trim())) {
// //         invalidFields.push("City/Town must contain only alphabetic characters and basic punctuation");
// //       }
     
// //     }
// //     const errorMessages = [];
    
// //     if (missingFields.length > 0) {
// //       errorMessages.push(`Missing required fields: ${missingFields.join(", ")}`);
// //     }

// //     if (invalidFields.length > 0) {
// //       errorMessages.push(...invalidFields);
// //     }

// //     if (errorMessages.length > 0) {
// //       const message = errorMessages.join(". ");
// //       setError(message);
      
// //       Swal.fire({
// //         title: "Validation Error",
// //         html: errorMessages.map(msg => `• ${msg}`).join("<br>"),
// //         icon: "warning",
// //       });
      
// //       return false;
// //     }

// //     setError("");
// //     return true;
// //   };
// //   const handleSave = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");
// //       console.log("Save as Draft - Starting...");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       const taskStatusId = 6; 

// //       const reqpayload = createPayload("saveasdraft", taskStatusId, userRole); 

// //       const response = await fetch(
// //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(reqpayload),
// //         }
// //       );

// //       if (!response.ok) throw new Error("Failed to insert Office Order");
// //       await response.json();

// //       setIsSavedSuccessfully(true); 

// //       await Swal.fire({
// //         title: "Saved!",
// //         text: "The task has been saved as a draft successfully. You may now view the preview.",
// //         icon: "success",
// //         timer: 3000,
// //         showConfirmButton: false,
// //       });

// //     } catch (err) {
// //       console.error("Save as Draft - Error:", err);
// //       setError(err.message || "Failed to insert Office Order");

// //       Swal.fire({
// //         title: "Error",
// //         text: err.message || "Failed to insert Office Order",
// //         icon: "error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     if (e) e.preventDefault();
// //     if (!validateForm()) return;

// //     try {
// //       setLoading(true);
// //       setError("");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       const taskStatusId = 4; 

// //       const requestpayload = createPayload("submit", taskStatusId, userRole); 

// //       const response = await fetch(
// //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(requestpayload),
// //         }
// //       );

// //       if (!response.ok) throw new Error("Failed to insert Office Order");

// //       await response.json();

// //       setLoading(false);
// //       setIsSavedSuccessfully(true); 

// //       await Swal.fire({
// //         title: "Submitted!",
// //         text: "The task has been submitted successfully. Returning to previous page.",
// //         icon: "success",
// //         timer: 3000,
// //         showConfirmButton: false,
// //       });
// //       onClose?.(true);
// //     } catch (err) {
// //       console.error("Insert API Error:", err);
// //       setError(err.message || "Failed to insert Office Order");

// //       Swal.fire({
// //         title: "Error",
// //         text: err.message || "Failed to insert Office Order",
// //         icon: "error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   const handlePreview = async () => {
// //     if (!isSavedSuccessfully) {
// //       setError("Please save the draft or submit the form before previewing.");
// //       Swal.fire({
// //         title: "Action Required",
// //         text: "Please save the current changes as a draft or submit the form before generating the preview PDF.",
// //         icon: "info",
// //       });
// //       return;
// //     }
    
// //     if (
// //       !record?.coverpageno ||
// //       !formData.employeeid ||
// //       !formData.signingAuthority
// //     ) {
// //       setError(
// //         "Cannot generate preview: Missing Cover Page Number, Employee ID, or Signing Authority."
// //       );
// //       return;
// //     }
    
// //     setLoading(true);
// //     setError("");

// //     try {
// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       const pdfApiUrl = `https://wftest1.iitm.ac.in:8080/api/officeorder/pdf`;
      
// //       const response = await fetch(pdfApiUrl, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify({
// //           employeeid: formData.employeeid,
// //           coverpageno: record.coverpageno,
// //           templatetype: "draft",
// //           status: "saveandhold",
// //         }),
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(
// //           `Failed to generate PDF. Server responded with: ${
// //             errorText || response.statusText
// //           }`
// //         );
// //       }

// //       const pdfBlob = await response.blob();
// //       const fileURL = URL.createObjectURL(pdfBlob);
      
// //       setPreviewData({
// //         pdfUrl: fileURL,
// //         formData: formData,
// //         bodyData: bodyData,
// //       });
// //       setPreviewCoverPageNo(record.coverpageno);
// //       setSelectedEmployeeId(formData.employeeid);
      
// //       setShowPreview(true); 

// //     } catch (err) {
// //       console.error("Preview Generation Error:", err);
// //       const errorMessage =
// //         err.message ||
// //         "An unexpected error occurred while generating the preview.";
// //       setError(errorMessage);
// //       Swal.fire({
// //         title: "Preview Error",
// //         text: errorMessage,
// //         icon: "error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleClosePreview = () => {
// //     setShowPreview(false);
// //     if (previewData?.pdfUrl) {
// //       URL.revokeObjectURL(previewData.pdfUrl); 
// //       setPreviewData(null);
// //     }
// //   };

// //   const handleBack = () => onClose?.(false); 

// //   if (loading && isInitialLoad)
// //     return <div style={loadingStyle}>Loading employee data...</div>;

// //   if (showPreview && previewData?.pdfUrl) {
// //     return (
// //       <OfficeOrderPreview
// //         coverpageno={previewCoverPageNo}
// //         employeeid={selectedEmployeeId}
// //         pdfUrl={previewData.pdfUrl} 
// //         formData={previewData.formData}
// //         bodyData={previewData.bodyData}
// //         onBack={handleClosePreview} 
// //         isLocalPreview={false} 
// //         loading={loading}
// //       />
// //     );
// //   }

// //   return (
// //     <div style={containerStyle}>
// //       <div style={cardStyle}>
// //         <button onClick={handleBack} style={backButtonStyle}>
// //           ← Back
// //         </button>
// //         <h2 style={headingStyle}>Permission Cum Relief</h2>
// //         {error && <Alerts type="error" variant="outlined" message={error} />}

// //         <form onSubmit={handleSubmit}>
// //           {/* Employee Info */}
// //           <FormSection>
// //             <h3 style={sectionHeadingStyle}>
// //               Employee Information
// //             </h3>

// //           {/* Row 1: Employee ID, Name, Dept, Desig */}
// //               <div style={gridRowStyle}>
// //                 <TextField
// //                   label="Employee ID"
// //                   name="employeeid"
// //                   value={formData.employeeid}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Employee Name"
// //                   name="facultyname"
// //                   value={formData.facultyname}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Department"
// //                   name="department"
// //                   value={formData.department}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Designation"
// //                   name="designation"
// //                   value={formData.designation}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //               </div>

// //               {/* Row 2: Nature, Visit From, Visit To, Country */}
// //               <div style={gridRowStyle}>
// //                 <TextField
// //                   label="Nature of Visit"
// //                   name="natureofparticipation_value"
// //                   value={formData.natureofparticipation_value}
// //                   onChange={handleChange}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   type="date"
// //                   label="Visit From"
// //                   name="visitfrom"
// //                   value={formData.visitfrom}
// //                   onChange={handleChange}
// //                   InputLabelProps={{ shrink: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   type="date"
// //                   label="Visit To"
// //                   name="visitto"
// //                   value={formData.visitto}
// //                   onChange={handleChange}
// //                   InputLabelProps={{ shrink: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Country"
// //                   name="country"
// //                   value={formData.country}
// //                   onChange={handleChange}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //               </div>

// //               {/* Row 3: City/Town (1 column) */}
// //               <div style={gridRowStyle}>
// //                 <TextField
// //                   label="City/Town"
// //                   name="city"
// //                   value={formData.city}
// //                   onChange={handleChange}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 {/* Claim Type hidden field */}
// //                 <TextField
// //                   label="Claim Type"
// //                   name="claimtype"
// //                   value={formData.claimtype}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   sx={{ display: "none" }} 
// //                 />
// //                 <div></div> {/* Filler */}
// //                 <div></div> {/* Filler */}
// //                 <div></div> {/* Filler */}
// //               </div>
           
// //           </FormSection>

// //           {/* Office Order Details */}
// //           <FormSection>
// //             <h3 style={sectionHeadingStyle}>
// //               Office Order Details
// //             </h3>

// //             {/* Hidden Header/Footer fields */}
// //             <TextField
// //               label="Header"
// //               name="header"
// //               value={bodyData.header || ""}
// //               variant="outlined"
// //               fullWidth
// //               sx={{ display: "none" }}
// //             />
// //             <TextField
// //               label="Reference Number"
// //               name="referenceNo"
// //               value={bodyData.referenceNo}
// //               onChange={handleChange}
// //               variant="outlined"
// //               fullWidth
// //               sx={{ display: "none" }}
// //             />
// //             <TextField
// //               label="Reference Date"
// //               name="referenceDate"
// //               value={bodyData.referenceDate}
// //               onChange={handleChange}
// //               variant="outlined"
// //               fullWidth
// //               sx={{ display: "none" }}
// //             />

// //             {/* Subject and Ref in one row (2 columns) */}
// //             <div style={gridRowTwoColumnStyles}>
// //               <TextField
// //                 label="Subject"
// //                 name="subject"
// //                 value={bodyData.subject}
// //                 onChange={handleChange}
// //                 variant="outlined"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //               />

// //               {/* Using TextField equivalent structure for Ref for consistent height */}
// //               <TextField
// //                 label="Ref"
// //                 name="refsubject"
// //                 value={bodyData.refsubject || ""}
// //                 onChange={handleChange}
// //                 variant="outlined"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //               />
// //             </div>

// //             {/* Body (Full width) */}
// //             <div style={{ marginBottom: "16px" }}>
// //               <label style={labelStyle}>Body</label>
// //               <div style={{ border: "1px solid #D1D5DB", borderRadius: "8px", padding: '8px' }}>
// //                 <TextEdit
// //                   value={bodyData.body}
// //                   onChange={(value) => {
// //                     setBodyData((prev) => ({ ...prev, body: value }));
// //                     if (!isInitialLoad) {
// //                       setIsSavedSuccessfully(false);
// //                     }
// //                   }}
// //                 />
// //               </div>
// //             </div>
            
// //             {/* Signing Authority in one column */}
// //             <div style={gridRowStyle}>
// //               <Select
// //                 label="Signing Authority"
// //                 name="signingAuthority"
// //                 value={formData.signingAuthority}
// //                 onChange={handleChange}
// //                 options={[
// //                   { value: "", label: "Select Signing Authority" },
// //                   { value: "Deputy Registrar", label: "Deputy Registrar" },
// //                   {
// //                     value: "Assistant Registrar",
// //                     label: "Assistant Registrar",
// //                   },
// //                   { value: "Registrar", label: "Registrar" },
// //                 ]}
// //               />
// //               <div></div> {/* Filler */}
// //               <div></div> {/* Filler */}
// //               <div></div> {/* Filler */}
// //             </div>

// //             {/* TO Section (Full width, multi-select dropdown with checkboxes) */}
// //             <div style={{ marginBottom: "16px" }}>
// //              <DropdownWithCheckboxes
// //   label="TO Section"
// //   options={toSectionOptions.map(opt => ({ value: opt, label: opt }))}
// //   value={formData.toSection}
// //   onChange={(selected) => {
// //     setFormData((prev) => ({ ...prev, toSection: selected }));
// //     if (!isInitialLoad) {
// //       setIsSavedSuccessfully(false);
// //     }
// //   }}
// // />
// //             </div>

// //             {/* Remarks (Full width) */}
// //             <div style={gridRowTwoColumnStyle}>
// //               <TextField
// //                 label="Remarks"
// //                 name="remarks"
// //                 value={formData.remarks}
// //                 onChange={handleChange}
// //                 variant="outlined"
// //                 fullWidth
// //                 multiline
// //                 rows={5}
// //               />
// //             </div>
// //           </FormSection>

// //           {/* Buttons (Right Aligned) */}
// //           <div style={buttonContainerStyle}>
// //             <button
// //               type="button"
// //               onClick={handleSave}
// //               style={{ ...buttonStyle, backgroundColor: "#7C3AED" }}
// //               disabled={loading}
// //             >
// //               Save as Draft
// //             </button>

// //             <button
// //               type="submit"
// //               style={{ ...buttonStyle, backgroundColor: "#10B981" }}
// //               disabled={loading}
// //             >
// //               Submit
// //             </button>

// //             {/* PREVIEW BUTTON: Conditional based on saved state, as requested by 'don't change any logics' */}
// //             {isSavedSuccessfully && (
// //               <button
// //                 type="button"
// //                 onClick={handlePreview}
// //                 style={{ ...buttonStyle, backgroundColor: "#F59E0B" }}
// //                 disabled={loading}
// //               >
// //                 Preview
// //               </button>
// //             )}
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // /* ---------- STYLES (Refined for Consistency) ---------- */
// // const containerStyle = {
// //   width: "100%",
// //   minHeight: "100vh",
// //   display: "flex",
// //   justifyContent: "center",
// //   alignItems: "flex-start",
// //   padding: "20px",
// //   backgroundColor: "#f9fafb", // Added subtle background
// // };
// // const cardStyle = {
// //   width: "100%",
// //   maxWidth: "1200px",
// //   padding: "32px",
// //   borderRadius: "12px",
// //   boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
// //   backgroundColor: "#fff",
// //   marginTop: "20px",
// // };
// // const headingStyle = {
// //   marginBottom: "24px",
// //   color: "rgb(107, 114, 128)",
// //   fontSize: "24px",
// //   fontWeight: "600",
// // };
// // const sectionHeadingStyle = {
// //   marginBottom: "16px",
// //   fontSize: "18px",
// //   fontWeight: "600",
// //   color: "#374151",
// // }
// // const labelStyle = {
// //   display: "block",
// //   marginBottom: "6px",
// //   fontWeight: "500",
// //   color: "#374151",
// // };
// // const inputStyle = {
// //   width: "100%",
// //   padding: "10px 12px",
// //   borderRadius: "8px",
// //   border: "1px solid #D1D5DB",
// //   fontSize: "14px",
// //   color: "#374151",
// //   boxSizing: 'border-box', // Ensure padding is inside width
// // };
// // const buttonStyle = {
// //   padding: "10px 20px",
// //   border: "none",
// //   borderRadius: "8px",
// //   color: "#fff",
// //   cursor: "pointer",
// //   fontWeight: "600",
// //   transition: "background-color 0.3s",
// // };
// // const backButtonStyle = {
// //   padding: "8px 16px",
// //   border: "none",
// //   borderRadius: "6px",
// //   backgroundColor: "rgb(37, 99, 235)",
// //   color: "#fff",
// //   cursor: "pointer",
// //   fontWeight: "600",
// //   marginBottom: "20px",
// // };
// // const gridRowStyle = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(4, 1fr)",
// //   gap: "16px",
// //   marginBottom: "16px",
// // };
// // const gridRowTwoColumnStyle = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(1, 1fr)",
// //   gap: "16px",
// //   marginBottom: "16px",
// // };

// // const gridRowTwoColumnStyles = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(2, 1fr)", // Changed to 2fr here for Subject/Ref
// //   gap: "16px",
// //   marginBottom: "16px",
// //   width: "100%",
// // };

// // const loadingStyle = {
// //   display: "flex",
// //   justifyContent: "center",
// //   alignItems: "center",
// //   height: "100vh",
// //   fontSize: "18px",
// //   color: "#6B7280",
// // };
// // const buttonContainerStyle = {
// //     display: "flex", 
// //     gap: "12px", 
// //     marginTop: "20px",
// //     justifyContent: "flex-end", // Right alignment
// // };

// // export default EmployeeVisitForm;



// // import React, { useState, useEffect } from "react";
// // import Cookies from "js-cookie";
// // import TextField from "@mui/material/TextField";
// // import OfficeOrderPreview from "./OfficeOrderPreview.js";
// // import DropdownWithCheckboxes from "src/components/ui/DropdownWithCheckBox";
// // import Dropdown from "src/components/ui/Dropdown";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import Alerts from "src/components/ui/Alerts.js";
// // import TextEdit from "./TextEdit";
// // import Swal from "sweetalert2";
// // import { HostName } from "src/assets/host/Host";
// // import FormSection from "src/components/ui/TopColorCard.js"; // New import for the FormSection component

// // const stripNonEnglish = (text) => {
// //   if (typeof text !== "string") return text;
// //   return text.replace(/[^\x00-\x7F]/g, ""); // Basic ASCII filter for safety
// // };
// // const formatTimestamp = (dateStr, hour = "09:00:00") => {
// //   if (!dateStr || !dateStr.trim()) return null;
// //   const date = new Date(`${dateStr}T${hour}`);
// //   const year = date.getFullYear();
// //   const month = String(date.getMonth() + 1).padStart(2, "0");
// //   const day = String(date.getDate()).padStart(2, "0");
// //   return `${year}-${month}-${day}T${hour}+05:30`;
// // };
// // const calculateDuration = (from, to) => {
// //   if (!from || !to) return 0;
// //   const diff = new Date(to) - new Date(from);
// //   return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
// // };

// // const EmployeeVisitForm = ({ onClose, record, onSuccess }) => {
// //   const [formData, setFormData] = useState({
// //     employeeid: "",
// //     facultyname: "",
// //     department: "",
// //     designation: "",
// //     visitfrom: "",
// //     visitto: "",
// //     natureofparticipation_value: "",
// //     country: "",
// //     city: "",
// //     claimtype: "", 
// //     signingAuthority: "",
// //     toSection: [],
// //     remarks: "",
// //     leave: "",
// //   });

// //   const [bodyData, setBodyData] = useState({
// //     referenceNo: "",
// //     referenceDate: "",
// //     subject: "",
// //     refsubject: "",
// //     body: "",
// //     header: "",
// //     footer: "",
// //     template: "",
// //   });

// //   const [showPreview, setShowPreview] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false); 
// //   const [isInitialLoad, setIsInitialLoad] = useState(true); 
// //   const [previewData, setPreviewData] = useState(null); 
// //   const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
// //   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

// //   const sessionId = Cookies.get("session_id");
// //   const empId = Cookies.get("EmpId");
// //   const userRole = Cookies.get("selectedRole"); 

// //   const toSectionOptions = [
// //     `The Head of ${formData?.department || ""}`,
// //     "The Dean (Faculty)",
// //     "The Dean (Admin)",
// //     "The Dean (IC&SR)",
// //     "The Dean (ACR)",
// //     "The Dean (GE)",
// //     "The Deputy Registrar (F&A)",
// //     "Office copy",
// //     "AR (Paybill)",
// //     "AR (Bills)",
// //   ];

// //   const signingOptions = [
// //     { value: "Signing Authority", label: "Select Signing Authority" },
// //     { value: "Deputy Registrar", label: "Deputy Registrar" },
// //     { value: "Assistant Registrar", label: "Assistant Registrar" },
// //     { value: "Registrar", label: "Registrar" },
// //   ];

// //   const signingValue = signingOptions.find(opt => opt.value === formData.signingAuthority) || signingOptions[0];

// //   const handleSigningChange = (selectedOption) => {
// //     setFormData(prev => ({ ...prev, signingAuthority: selectedOption.value }));
// //     if (!isInitialLoad) {
// //       setIsSavedSuccessfully(false);
// //     }
// //   };


// //   const createPayload = (actionType, taskStatusId, userRole) => {
// //     let assignedRole;
// //     let typeofsubmit;
// //     const currentInitiator = empId || "admin";

// //     if (actionType === "saveasdraft") {
// //       typeofsubmit = "draft"; 
// //       assignedRole = "Reviewer";
// //     } else if (actionType === "submit") {
// //       typeofsubmit = "submit"; 
// //       assignedRole = "Approver"; 
// //     } else if (actionType === "preview") {
// //       typeofsubmit = "preview"; 
// //       assignedRole = "WF_Initiator";
// //     }
// //     let toColumnValue = "";
// //     const signingAuthority = formData.signingAuthority;
// //     const department = formData.department || "N/A Department"; 
// //     const facultyName = formData.facultyname || "N/A Name"; 
// //     if (signingAuthority) {
// //       toColumnValue = `<p><strong>To</strong><br>${facultyName} (ID No. ${
// //         formData.employeeid || "N/A"
// //       })<br>Thro the Head, ${department}</p><p><strong>Sir,</strong></p>`;
// //     }
// //     let signatureHtml = "";

// //     if (actionType === "submit" || actionType === "saveasdraft") {
// //       signatureHtml = `<p>${signingAuthority || "Authority Not Specified"}</p>`;
// //     }

// //     return {
// //       token: "HRFGVJISOVp1fncC",
// //       session_id: sessionId,
// //       typeofsubmit: typeofsubmit, 
// //       p_cover_page_no: record?.coverpageno || "",
// //       p_employee_id: formData.employeeid,
// //       p_employee_name: formData.facultyname,
// //       p_department: formData.department,
// //       p_designation: formData.designation,
// //       p_visit_from: formatTimestamp(formData.visitfrom, "09:00:00"),
// //       p_visit_to: formatTimestamp(formData.visitto, "17:00:00"),
// //       p_duration: calculateDuration(formData.visitfrom, formData.visitto),
// //       p_nature_of_visit: formData.natureofparticipation_value,
// //       p_claim_type: formData.claimtype, 
// //       p_city_town: formData.city,
// //       p_country: formData.country,
// //       p_header_html: bodyData.header || "",
// //       p_order_no: bodyData.referenceNo || "",
// //       p_order_date:
// //         bodyData.referenceDate || new Date().toISOString().split("T")[0],
// //       p_to_column: toColumnValue, 
// //       p_subject: bodyData.subject || "",
// //       p_reference: bodyData.refsubject || "",
// //       p_body_html: bodyData.body || "", 
// //       p_signature_html: signatureHtml, 
// //       p_cc_to: Array.isArray(formData.toSection)
// //         ? formData.toSection.join(",")
// //         : formData.toSection || "",
// //       p_footer_html: bodyData.footer || "",
// //       p_assign_to: currentInitiator, 
// //       p_assigned_role: assignedRole, 
// //       p_task_status_id: taskStatusId, 
// //       p_activity_seq_no: actionType === "submit" ? 1 : 0, 
// //       p_is_task_return: false,
// //       p_is_task_approved: actionType === "submit", 
// //       p_initiated_by: currentInitiator,
// //       p_initiated_on: new Date().toISOString().replace("Z", "+05:30"), 
// //       p_updated_by: currentInitiator,
// //       p_updated_on: new Date().toISOString().replace("Z", "+05:30"), 
// //       p_process_id: 1,
// //       p_remarks: formData.remarks,
// //       p_email_flag: false,
// //       p_reject_flag: 0,
// //       p_user_role: userRole || "", 
// //     };
// //   };
// //   const fetchAllData = async (coverpageno, employeeid) => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       if (!employeeid) throw new Error("Employee ID missing.");
// //       if (!coverpageno) throw new Error("Cover page number missing.");

// //       const apiUrl = `https://wftest1.iitm.ac.in:7000/OfficeOrder_datatemplate`;

// //       const response = await fetch(apiUrl, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify({
// //           employeeid: employeeid,
// //           coverpageno: coverpageno,
// //           session_id: sessionId,
// //           token: "HRFGVJISOVp1fncC",
// //         }),
// //       });

// //       if (!response.ok) throw new Error("Failed to fetch data from API");

// //       const encryptedData = await response.json();
// //       const encryptedPayload = encryptedData.Data ?? encryptedData.data;
// //       if (!encryptedPayload) throw new Error("Encrypted Data missing");

// //       const decryptedString = await decryptData(encryptedPayload);
// //       const parsedData = validateJsonData(decryptedString);

// //       const formatDate = (dateValue) => {
// //         if (!dateValue) return "";
// //         const date = new Date(dateValue);
// //         return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
// //       };
      
      
// //       setFormData({
// //         employeeid: parsedData.Employeeid || "",
// //         facultyname: parsedData.Employeename || "",
// //         department: parsedData.Department || "",
// //         designation: parsedData.Designation || "",
// //         visitfrom: formatDate(parsedData.VisitFrom),
// //         visitto: formatDate(parsedData.VisitTo),
// //         natureofparticipation_value: parsedData.NatureOfVisit || "",
// //         country: parsedData.Country?.trim() || "",
// //         city: parsedData.CityTown || "",
// //         claimtype: parsedData.ClaimType || "", 
// //         signingAuthority: "",
// //         toSection: [],
// //         remarks: "",
// //       });
      

// //       const destination = parsedData.Country || "";
// //       let processedSubject = parsedData.Subject || "";
// //       processedSubject = processedSubject.replace(
// //         /\{\{\.Destination\}\}/g,
// //         destination
// //       );

// //       const referenceText = parsedData.Reference || "";

// //       const formatHtmlTable = (htmlString) => {
// //         if (!htmlString || typeof htmlString !== "string") return htmlString;

// //         const tempDiv = document.createElement("div");
// //         tempDiv.innerHTML = htmlString;
// //         const table = tempDiv.querySelector("table");
// //         if (!table) return htmlString;

// //         const rows = Array.from(table.querySelectorAll("tr"));
// //         let bodyRowsHtml = "";

// //         const cleanDate = (str) => {
// //           if (!str) return "";
// //           const match = str.match(/(\d{4}-\d{2}-\d{2})/);
// //           return match ? match[1] : str.trim();
// //         };

// //         const looksLikeDate = (str) => /(\d{4}-\d{2}-\d{2})/.test(str);

// //         let startIndex = 0;
// //         for (let i = 0; i < rows.length; i++) {
// //           const row = rows[i];
// //           const text = row.textContent.trim().toLowerCase();
// //           const cells = Array.from(row.querySelectorAll("td, th"));

// //           const isHeaderText =
// //             (text.includes("leave type") &&
// //               text.includes("from") &&
// //               text.includes("to")) ||
// //             cells.every((cell) => {
// //               const cellText = cell.textContent.trim().toLowerCase();
// //               return (
// //                 cellText === "leave type" ||
// //                 cellText === "from" ||
// //                 cellText === "to"
// //               );
// //             });

// //           if (isHeaderText) {
// //             startIndex = i + 1;
// //             continue;
// //           }

// //           if (cells.length >= 3) {
// //             const hasData = cells.some((cell) => {
// //               const cellText = cell.textContent.trim();
// //               return (
// //                 cellText &&
// //                 !cellText.toLowerCase().includes("leave type") &&
// //                 !cellText.toLowerCase().includes("from") &&
// //                 !cellText.toLowerCase().includes("to")
// //               );
// //             });

// //             if (hasData) {
// //               startIndex = i;
// //               break;
// //             }
// //           }
// //         }

// //         for (let i = startIndex; i < rows.length; i++) {
// //           const cells = Array.from(rows[i].querySelectorAll("td, th"));
// //           if (cells.length < 3) continue;

// //           let leaveType = cells[0]?.textContent.trim() || "";
// //           let fromDate = cleanDate(cells[1]?.textContent.trim() || "");
// //           let toDate = cleanDate(cells[2]?.textContent.trim() || "");

// //           if (
// //             looksLikeDate(leaveType) &&
// //             !looksLikeDate(fromDate) &&
// //             fromDate
// //           ) {
// //             const temp = leaveType;
// //             leaveType = fromDate;
// //             fromDate = cleanDate(temp);
// //           }

// //           if (leaveType || fromDate || toDate) {
// //             bodyRowsHtml += `
// //               <tr>
// //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${leaveType}</td>
// //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${fromDate}</td>
// //                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${toDate}</td>
// //               </tr>
// //             `;
// //           }
// //         }

// //         const newTableHtml = `
// //           <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
// //             <thead>
// //               <tr>
// //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">Leave Type</th>
// //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">From</th>
// //                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">To</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               ${
// //                 bodyRowsHtml ||
// //                 '<tr><td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: center;">-</td></tr>'
// //               }
// //             </tbody>
// //           </table>
// //         `;

// //         table.outerHTML = newTableHtml;
// //         return tempDiv.innerHTML;
// //       };

// //       const formattedBody = formatHtmlTable(parsedData.Body || "");

// //       setBodyData({
// //         referenceNo: parsedData.ReferenceNumber || "",
// //         referenceDate: parsedData.ReferenceDate || "",
// //         subject: stripNonEnglish(processedSubject),
// //         refsubject: referenceText,
// //         body: formattedBody,
// //         header: parsedData.Header || "",
// //         footer: parsedData.Footer || "",
// //         template: stripNonEnglish(parsedData.filled_template || ""),
// //       });
// //       setIsSavedSuccessfully(true);
      
// //       setPreviewCoverPageNo(record.coverpageno);
// //       setSelectedEmployeeId(employeeid);

// //     } catch (err) {
// //       console.error("API Fetch Error:", err);
// //       setError(err.message || "Failed to fetch data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   useEffect(() => {
// //     const initializeData = async () => {
// //       if (isInitialLoad && record?.coverpageno && record?.employeeid) {
// //         try {
// //           await fetchAllData(record.coverpageno, record.employeeid);
// //           setIsInitialLoad(false); 
// //         } catch (error) {
// //           console.error("Initialization error:", error);
// //           setError("Failed to initialize form data");
// //           setIsInitialLoad(false); // Ensure loading state is reset even on error
// //         }
// //       }
// //     };

// //     initializeData();
// //   }, [record, sessionId, isInitialLoad]);

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     if (!isInitialLoad) {
// //         setIsSavedSuccessfully(false); 
// //     }

// //     if (type === "checkbox") {
// //       setFormData((prev) => {
// //         const current = Array.isArray(prev.toSection) ? prev.toSection : [];
// //         const updated = checked
// //           ? [...current, value]
// //           : current.filter((v) => v !== value);
// //         return { ...prev, toSection: updated };
// //       });
// //     } else if (
// //       [
// //         "referenceNo",
// //         "referenceDate",
// //         "subject",
// //         "refsubject",
// //         "body",
// //         "header",
// //         "footer",
// //         "template",
// //       ].includes(name)
// //     ) {
// //       setBodyData((prev) => ({ ...prev, [name]: value }));
// //     } else {
// //       setFormData((prev) => ({ ...prev, [name]: value }));
// //     }
// //   };


// //   const validateForm = (isDraft = false) => {
// //     const missingFields = [];
// //     const invalidFields = [];
// //     const requiredFieldsForSubmit = {
// //       natureofparticipation_value: "Nature of Visit",
// //       visitfrom: "Visit From Date",
// //       visitto: "Visit To Date",
// //       country: "Country",
// //       city: "City/Town",
// //       subject: "Subject",
// //       refsubject: "Reference (Ref)",
// //       body: "Body",
// //       signingAuthority: "Signing Authority",
// //       toSection: "To Section",
// //       remarks: "Remarks",
// //     };
// //     const requiredFieldsForDraft = {
// //       natureofparticipation_value: "Nature of Visit",
// //       visitfrom: "Visit From Date",
// //       visitto: "Visit To Date",
// //       country: "Country",
// //       city: "City/Town",
// //     };

// //     const fieldsToValidate = isDraft ? requiredFieldsForDraft : requiredFieldsForSubmit;
// //     for (const [key, label] of Object.entries(fieldsToValidate)) {
// //       let value = formData.hasOwnProperty(key) ? formData[key] : bodyData[key];
// //       if (
// //         value === "" ||
// //         value === null ||
// //         value === undefined ||
// //         (Array.isArray(value) && value.length === 0) ||
// //         (typeof value === "string" && value.trim() === "")
// //       ) {
// //         missingFields.push(label);
// //       }
// //     }
// //     if (formData.visitfrom && formData.visitto) {
// //       const fromDate = new Date(formData.visitfrom);
// //       const toDate = new Date(formData.visitto);
      
// //       if (fromDate > toDate) {
// //         invalidFields.push("Visit To Date must be equal to or after Visit From Date");
// //       }
// //     }
// //     if (!isDraft) {
// //       if (bodyData.subject && bodyData.subject.trim().length < 10) {
// //         invalidFields.push("Subject must be at least 10 characters long");
// //       }
// //       if (bodyData.body) {
// //         const tempDiv = document.createElement("div");
// //         tempDiv.innerHTML = bodyData.body;
// //         const textContent = tempDiv.textContent || tempDiv.innerText || "";
// //         if (textContent.trim().length < 20) {
// //           invalidFields.push("Body must contain at least 20 characters of text");
// //         }
// //       }
// //       if (formData.country && !/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
// //         invalidFields.push("Country must contain only alphabetic characters");
// //       }
// //       if (formData.city && !/^[a-zA-Z\s,.-]+$/.test(formData.city.trim())) {
// //         invalidFields.push("City/Town must contain only alphabetic characters and basic punctuation");
// //       }
     
// //     }
// //     const errorMessages = [];
    
// //     if (missingFields.length > 0) {
// //       errorMessages.push(`Missing required fields: ${missingFields.join(", ")}`);
// //     }

// //     if (invalidFields.length > 0) {
// //       errorMessages.push(...invalidFields);
// //     }

// //     if (errorMessages.length > 0) {
// //       const message = errorMessages.join(". ");
// //       setError(message);
      
// //       Swal.fire({
// //         title: "Validation Error",
// //         html: errorMessages.map(msg => `• ${msg}`).join("<br>"),
// //         icon: "warning",
// //       });
      
// //       return false;
// //     }

// //     setError("");
// //     return true;
// //   };
// //   const handleSave = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");
// //       console.log("Save as Draft - Starting...");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       const taskStatusId = 6; 

// //       const reqpayload = createPayload("saveasdraft", taskStatusId, userRole); 

// //       const response = await fetch(
// //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(reqpayload),
// //         }
// //       );

// //       if (!response.ok) throw new Error("Failed to insert Office Order");
// //       await response.json();

// //       setIsSavedSuccessfully(true); 

// //       await Swal.fire({
// //         title: "Saved!",
// //         text: "The task has been saved as a draft successfully. You may now view the preview.",
// //         icon: "success",
// //         timer: 3000,
// //         showConfirmButton: false,
// //       });

// //     } catch (err) {
// //       console.error("Save as Draft - Error:", err);
// //       setError(err.message || "Failed to insert Office Order");

// //       Swal.fire({
// //         title: "Error",
// //         text: err.message || "Failed to insert Office Order",
// //         icon: "error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     if (e) e.preventDefault();
// //     if (!validateForm()) return;

// //     try {
// //       setLoading(true);
// //       setError("");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       const taskStatusId = 4; 

// //       const requestpayload = createPayload("submit", taskStatusId, userRole); 

// //       const response = await fetch(
// //         `${HostName}/OfficeOrder_InsertOfficedetails`, 
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(requestpayload),
// //         }
// //       );

// //       if (!response.ok) throw new Error("Failed to insert Office Order");

// //       await response.json();

// //       setLoading(false);
// //       setIsSavedSuccessfully(true); 

// //       await Swal.fire({
// //         title: "Submitted!",
// //         text: "The task has been submitted successfully. Returning to previous page.",
// //         icon: "success",
// //         timer: 3000,
// //         showConfirmButton: false,
// //       });
// //       onClose?.(true);
// //     } catch (err) {
// //       console.error("Insert API Error:", err);
// //       setError(err.message || "Failed to insert Office Order");

// //       Swal.fire({
// //         title: "Error",
// //         text: err.message || "Failed to insert Office Order",
// //         icon: "error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   const handlePreview = async () => {
// //     if (!isSavedSuccessfully) {
// //       setError("Please save the draft or submit the form before previewing.");
// //       Swal.fire({
// //         title: "Action Required",
// //         text: "Please save the current changes as a draft or submit the form before generating the preview PDF.",
// //         icon: "info",
// //       });
// //       return;
// //     }
    
// //     if (
// //       !record?.coverpageno ||
// //       !formData.employeeid ||
// //       !formData.signingAuthority
// //     ) {
// //       setError(
// //         "Cannot generate preview: Missing Cover Page Number, Employee ID, or Signing Authority."
// //       );
// //       return;
// //     }
    
// //     setLoading(true);
// //     setError("");

// //     try {
// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       const pdfApiUrl = `https://wftest1.iitm.ac.in:8080/api/officeorder/pdf`;
      
// //       const response = await fetch(pdfApiUrl, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify({
// //           employeeid: formData.employeeid,
// //           coverpageno: record.coverpageno,
// //           templatetype: "draft",
// //           status: "saveandhold",
// //         }),
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(
// //           `Failed to generate PDF. Server responded with: ${
// //             errorText || response.statusText
// //           }`
// //         );
// //       }

// //       const pdfBlob = await response.blob();
// //       const fileURL = URL.createObjectURL(pdfBlob);
      
// //       setPreviewData({
// //         pdfUrl: fileURL,
// //         formData: formData,
// //         bodyData: bodyData,
// //       });
// //       setPreviewCoverPageNo(record.coverpageno);
// //       setSelectedEmployeeId(formData.employeeid);
      
// //       setShowPreview(true); 

// //     } catch (err) {
// //       console.error("Preview Generation Error:", err);
// //       const errorMessage =
// //         err.message ||
// //         "An unexpected error occurred while generating the preview.";
// //       setError(errorMessage);
// //       Swal.fire({
// //         title: "Preview Error",
// //         text: errorMessage,
// //         icon: "error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleClosePreview = () => {
// //     setShowPreview(false);
// //     if (previewData?.pdfUrl) {
// //       URL.revokeObjectURL(previewData.pdfUrl); 
// //       setPreviewData(null);
// //     }
// //   };

// //   const handleBack = () => onClose?.(false); 

// //   if (loading && isInitialLoad)
// //     return <div style={loadingStyle}>Loading employee data...</div>;

// //   if (showPreview && previewData?.pdfUrl) {
// //     return (
// //       <OfficeOrderPreview
// //         coverpageno={previewCoverPageNo}
// //         employeeid={selectedEmployeeId}
// //         pdfUrl={previewData.pdfUrl} 
// //         formData={previewData.formData}
// //         bodyData={previewData.bodyData}
// //         onBack={handleClosePreview} 
// //         isLocalPreview={false} 
// //         loading={loading}
// //       />
// //     );
// //   }

// //   return (
// //       <div style={cardStyle}>
// //         <button onClick={handleBack} style={backButtonStyle}>
// //           ← Back
// //         </button>
// //         <h2 style={headingStyle}>Permission Cum Relief</h2>
// //         {error && <Alerts type="error" variant="outlined" message={error} />}

// //         <form onSubmit={handleSubmit}>
// //           {/* Employee Info */}
// //           <FormSection>
// //             <h3 style={sectionHeadingStyle}>
// //               Employee Information
// //             </h3>

// //           {/* Row 1: Employee ID, Name, Dept, Desig */}
// //               <div style={gridRowStyle}>
// //                 <TextField
// //                   label="Employee ID"
// //                   name="employeeid"
// //                   value={formData.employeeid}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Employee Name"
// //                   name="facultyname"
// //                   value={formData.facultyname}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Department"
// //                   name="department"
// //                   value={formData.department}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Designation"
// //                   name="designation"
// //                   value={formData.designation}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //               </div>

// //               {/* Row 2: Nature, Visit From, Visit To, Country */}
// //               <div style={gridRowStyle}>
// //                 <TextField
// //                   label="Nature of Visit"
// //                   name="natureofparticipation_value"
// //                   value={formData.natureofparticipation_value}
// //                   onChange={handleChange}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   type="date"
// //                   label="Visit From"
// //                   name="visitfrom"
// //                   value={formData.visitfrom}
// //                   onChange={handleChange}
// //                   InputLabelProps={{ shrink: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   type="date"
// //                   label="Visit To"
// //                   name="visitto"
// //                   value={formData.visitto}
// //                   onChange={handleChange}
// //                   InputLabelProps={{ shrink: true }}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 <TextField
// //                   label="Country"
// //                   name="country"
// //                   value={formData.country}
// //                   onChange={handleChange}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //               </div>

// //               {/* Row 3: City/Town (1 column) */}
// //               <div style={gridRowStyle}>
// //                 <TextField
// //                   label="City/Town"
// //                   name="city"
// //                   value={formData.city}
// //                   onChange={handleChange}
// //                   variant="outlined"
// //                   fullWidth
// //                 />
// //                 {/* Claim Type hidden field */}
// //                 <TextField
// //                   label="Claim Type"
// //                   name="claimtype"
// //                   value={formData.claimtype}
// //                   onChange={handleChange}
// //                   InputProps={{ readOnly: true }}
// //                   sx={{ display: "none" }} 
// //                 />
// //                 <div></div> {/* Filler */}
// //                 <div></div> {/* Filler */}
// //                 <div></div> {/* Filler */}
// //               </div>
           
// //           </FormSection>

// //           {/* Office Order Details */}
// //           <FormSection>
// //             <h3 style={sectionHeadingStyle}>
// //               Office Order Details
// //             </h3>

// //             {/* Hidden Header/Footer fields */}
// //             <TextField
// //               label="Header"
// //               name="header"
// //               value={bodyData.header || ""}
// //               variant="outlined"
// //               fullWidth
// //               sx={{ display: "none" }}
// //             />
// //             <TextField
// //               label="Reference Number"
// //               name="referenceNo"
// //               value={bodyData.referenceNo}
// //               onChange={handleChange}
// //               variant="outlined"
// //               fullWidth
// //               sx={{ display: "none" }}
// //             />
// //             <TextField
// //               label="Reference Date"
// //               name="referenceDate"
// //               value={bodyData.referenceDate}
// //               onChange={handleChange}
// //               variant="outlined"
// //               fullWidth
// //               sx={{ display: "none" }}
// //             />

// //             {/* Subject and Ref in one row (2 columns) */}
// //             <div style={gridRowTwoColumnStyles}>
// //               <TextField
// //                 label="Subject"
// //                 name="subject"
// //                 value={bodyData.subject}
// //                 onChange={handleChange}
// //                 variant="outlined"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //               />

// //               {/* Using TextField equivalent structure for Ref for consistent height */}
// //               <TextField
// //                 label="Ref"
// //                 name="refsubject"
// //                 value={bodyData.refsubject || ""}
// //                 onChange={handleChange}
// //                 variant="outlined"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //               />
// //             </div>

// //             {/* Body (Full width) */}
// //             <div style={{ marginBottom: "16px" }}>
// //               <label style={labelStyle}>Body</label>
// //                 <TextEdit
// //                   value={bodyData.body}
// //                   onChange={(value) => {
// //                     setBodyData((prev) => ({ ...prev, body: value }));
// //                     if (!isInitialLoad) {
// //                       setIsSavedSuccessfully(false);
// //                     }
// //                   }}
// //                 />
// //             </div>

// //             <br />
            
// //             {/* Signing Authority and TO Section side by side */}
// //             <div style={gridRowTwoColumnStyles}>
// //               <div>
// //                 <Dropdown
// //                 label="Signing Authority"
// //                   options={signingOptions}
// //                   value={signingValue}
// //                   onChange={handleSigningChange}
// //                 />
// //               </div>
// //               <div>

// //                 <DropdownWithCheckboxes
// //                   label="To Section"
// //                   options={toSectionOptions.map(opt => ({ value: opt, label: opt }))}
// //                   value={formData.toSection}
// //                   onChange={(selected) => {
// //                     setFormData((prev) => ({ ...prev, toSection: selected }));
// //                     if (!isInitialLoad) {
// //                       setIsSavedSuccessfully(false);
// //                     }
// //                   }}
// //                 />
// //               </div>
// //             </div>

// //             <br />

// //             {/* Remarks (Full width) */}
// //             <div style={gridRowTwoColumnStyle}>
// //               <TextField
// //                 label="Remarks"
// //                 name="remarks"
// //                 value={formData.remarks}
// //                 onChange={handleChange}
// //                 variant="outlined"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //               />
// //             </div>
// //           </FormSection>

// //           {/* Buttons (Right Aligned) */}
// //           <div style={buttonContainerStyle}>
// //             <button
// //               type="button"
// //               onClick={handleSave}
// //               style={{ ...buttonStyle, backgroundColor: "#7C3AED" }}
// //               disabled={loading}
// //             >
// //               Save as Draft
// //             </button>

// //             <button
// //               type="submit"
// //               style={{ ...buttonStyle, backgroundColor: "#10B981" }}
// //               disabled={loading}
// //             >
// //               Submit
// //             </button>

// //             {/* PREVIEW BUTTON: Conditional based on saved state, as requested by 'don't change any logics' */}
// //             {isSavedSuccessfully && (
// //               <button
// //                 type="button"
// //                 onClick={handlePreview}
// //                 style={{ ...buttonStyle, backgroundColor: "#F59E0B" }}
// //                 disabled={loading}
// //               >
// //                 Preview
// //               </button>
// //             )}
// //           </div>
// //         </form>
// //       </div>
   
// //   );
// // };

// // /* ---------- STYLES (Refined for Consistency) ---------- */

// // const cardStyle = {
// //   width: "100%",
// //   maxWidth: "2000px",
// //   padding: "32px",
// //   borderRadius: "12px",
// //   boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
// //   backgroundColor: "#fff",
// //   marginTop: "20px",
// // };
// // const headingStyle = {
// //   marginBottom: "24px",
// //   color: "rgb(107, 114, 128)",
// //   fontSize: "24px",
// //   fontWeight: "600",
// // };
// // const sectionHeadingStyle = {
// //   marginBottom: "16px",
// //   fontSize: "18px",
// //   fontWeight: "600",
// //   color: "#374151",
// // }
// // const labelStyle = {
// //   display: "block",
// //   marginBottom: "6px",
// //   fontWeight: "500",
// //   color: "#374151",
// // };
// // const buttonStyle = {
// //   padding: "10px 20px",
// //   border: "none",
// //   borderRadius: "8px",
// //   color: "#fff",
// //   cursor: "pointer",
// //   fontWeight: "600",
// //   transition: "background-color 0.3s",
// // };
// // const backButtonStyle = {
// //   padding: "8px 16px",
// //   border: "none",
// //   borderRadius: "6px",
// //   backgroundColor: "rgb(37, 99, 235)",
// //   color: "#fff",
// //   cursor: "pointer",
// //   fontWeight: "600",
// //   marginBottom: "20px",
// // };
// // const gridRowStyle = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(4, 1fr)",
// //   gap: "16px",
// //   marginBottom: "16px",
// // };
// // const gridRowTwoColumnStyle = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(1, 1fr)",
// //   gap: "16px",
// //   marginBottom: "16px",
// // };

// // const gridRowTwoColumnStyles = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(2, 1fr)", // Changed to 2fr here for Subject/Ref
// //   gap: "16px",
// //   marginBottom: "16px",
// //   width: "100%",
// // };

// // const loadingStyle = {
// //   display: "flex",
// //   justifyContent: "center",
// //   alignItems: "center",
// //   height: "100vh",
// //   fontSize: "18px",
// //   color: "#6B7280",
// // };
// // const buttonContainerStyle = {
// //     display: "flex", 
// //     gap: "12px", 
// //     marginTop: "20px",
// //     justifyContent: "flex-end", // Right alignment
// // };

// // export default EmployeeVisitForm;



// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import TextField from "@mui/material/TextField";
// import OfficeOrderPreview from "./OfficeOrderPreview.js";
// import DropdownWithCheckboxes from "src/components/ui/DropdownWithCheckBox";
// import Dropdown from "src/components/ui/Dropdown";
// import {
//   decryptData,
//   validateJsonData,
// } from "src/components/Decryption/Decrypt";
// import Alerts from "src/components/ui/Alerts.js";
// import TextEdit from "./TextEdit";
// import Swal from "sweetalert2";
// import { HostName } from "src/assets/host/Host";
// import FormSection from "src/components/ui/TopColorCard.js"; // New import for the FormSection component
// import { SaveButton,SubmitButton,FavoriteButton, BackButton } from "src/components/ui/Button.js";

// const stripNonEnglish = (text) => {
//   if (typeof text !== "string") return text;
//   return text.replace(/[^\x00-\x7F]/g, ""); // Basic ASCII filter for safety
// };
// const formatTimestamp = (dateStr, hour = "09:00:00") => {
//   if (!dateStr || !dateStr.trim()) return null;
//   const date = new Date(`${dateStr}T${hour}`);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}T${hour}+05:30`;
// };
// const calculateDuration = (from, to) => {
//   if (!from || !to) return 0;
//   const diff = new Date(to) - new Date(from);
//   return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
// };

// const EmployeeVisitForm = ({ onClose, record, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     employeeid: "",
//     facultyname: "",
//     department: "",
//     designation: "",
//     visitfrom: "",
//     visitto: "",
//     natureofparticipation_value: "",
//     country: "",
//     city: "",
//     claimtype: "", 
//     signingAuthority: "",
//     toSection: [],
//     remarks: "",
//     leave: "",
//   });

//   const [bodyData, setBodyData] = useState({
//     referenceNo: "",
//     referenceDate: "",
//     subject: "",
//     refsubject: "",
//     body: "",
//     header: "",
//     footer: "",
//     template: "",
//   });

//   const [showPreview, setShowPreview] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false); 
//   const [isInitialLoad, setIsInitialLoad] = useState(true); 
//   const [previewData, setPreviewData] = useState(null); 
//   const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

//   const sessionId = Cookies.get("session_id");
//   const empId = Cookies.get("EmpId");
//   const userRole = Cookies.get("selectedRole"); 

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

//   const signingOptions = [
//     { value: "Signing Authority", label: "Select Signing Authority" },
//     { value: "Deputy Registrar", label: "Deputy Registrar" },
//     { value: "Assistant Registrar", label: "Assistant Registrar" },
//     { value: "Registrar", label: "Registrar" },
//   ];

//   const signingValue = signingOptions.find(opt => opt.value === formData.signingAuthority) || signingOptions[0];

//   const handleSigningChange = (selectedOption) => {
//     setFormData(prev => ({ ...prev, signingAuthority: selectedOption.value }));
//     if (!isInitialLoad) {
//       setIsSavedSuccessfully(false);
//     }
//   };


//   const createPayload = (actionType, taskStatusId, userRole) => {
//     let assignedRole;
//     let typeofsubmit;
//     const currentInitiator = empId || "admin";

//     if (actionType === "saveasdraft") {
//       typeofsubmit = "draft"; 
//       assignedRole = "Reviewer";
//     } else if (actionType === "submit") {
//       typeofsubmit = "submit"; 
//       assignedRole = "Approver"; 
//     } else if (actionType === "preview") {
//       typeofsubmit = "preview"; 
//       assignedRole = "WF_Initiator";
//     }
//     let toColumnValue = "";
//     const signingAuthority = formData.signingAuthority;
//     const department = formData.department || "N/A Department"; 
//     const facultyName = formData.facultyname || "N/A Name"; 
//     if (signingAuthority) {
//       toColumnValue = `<p><strong>To</strong><br>${facultyName} (ID No. ${
//         formData.employeeid || "N/A"
//       })<br>Thro the Head, ${department}</p><p><strong>Sir,</strong></p>`;
//     }
//     let signatureHtml = "";

//     if (actionType === "submit" || actionType === "saveasdraft") {
//       signatureHtml = `<p>${signingAuthority || "Authority Not Specified"}</p>`;
//     }

//     return {
//       token: "HRFGVJISOVp1fncC",
//       session_id: sessionId,
//       typeofsubmit: typeofsubmit, 
//       p_cover_page_no: record?.coverpageno || "",
//       p_employee_id: formData.employeeid,
//       p_employee_name: formData.facultyname,
//       p_department: formData.department,
//       p_designation: formData.designation,
//       p_visit_from: formatTimestamp(formData.visitfrom, "09:00:00"),
//       p_visit_to: formatTimestamp(formData.visitto, "17:00:00"),
//       p_duration: calculateDuration(formData.visitfrom, formData.visitto),
//       p_nature_of_visit: formData.natureofparticipation_value,
//       p_claim_type: formData.claimtype, 
//       p_city_town: formData.city,
//       p_country: formData.country,
//       p_header_html: bodyData.header || "",
//       p_order_no: bodyData.referenceNo || "",
//       p_order_date:
//         bodyData.referenceDate || new Date().toISOString().split("T")[0],
//       p_to_column: toColumnValue, 
//       p_subject: bodyData.subject || "",
//       p_reference: bodyData.refsubject || "",
//       p_body_html: bodyData.body || "", 
//       p_signature_html: signatureHtml, 
//       p_cc_to: Array.isArray(formData.toSection)
//         ? formData.toSection.join(",")
//         : formData.toSection || "",
//       p_footer_html: bodyData.footer || "",
//       p_assign_to: currentInitiator, 
//       p_assigned_role: assignedRole, 
//       p_task_status_id: taskStatusId, 
//       p_activity_seq_no: actionType === "submit" ? 1 : 0, 
//       p_is_task_return: false,
//       p_is_task_approved: actionType === "submit", 
//       p_initiated_by: currentInitiator,
//       p_initiated_on: new Date().toISOString().replace("Z", "+05:30"), 
//       p_updated_by: currentInitiator,
//       p_updated_on: new Date().toISOString().replace("Z", "+05:30"), 
//       p_process_id: 1,
//       p_remarks: formData.remarks,
//       p_email_flag: false,
//       p_reject_flag: 0,
//       p_user_role: userRole || "", 
//     };
//   };
//   const fetchAllData = async (coverpageno, employeeid) => {
//     setLoading(true);
//     setError("");
//     try {
//       const jwtToken = Cookies.get("HRToken");
//       if (!jwtToken) throw new Error("Authentication token missing.");
//       if (!employeeid) throw new Error("Employee ID missing.");
//       if (!coverpageno) throw new Error("Cover page number missing.");

//       const apiUrl = `https://wftest1.iitm.ac.in:7000/OfficeOrder_datatemplate`;

//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${jwtToken}`,
//         },
//         body: JSON.stringify({
//           employeeid: employeeid,
//           coverpageno: coverpageno,
//           session_id: sessionId,
//           token: "HRFGVJISOVp1fncC",
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to fetch data from API");

//       const encryptedData = await response.json();
//       const encryptedPayload = encryptedData.Data ?? encryptedData.data;
//       if (!encryptedPayload) throw new Error("Encrypted Data missing");

//       const decryptedString = await decryptData(encryptedPayload);
//       const parsedData = validateJsonData(decryptedString);

//       const formatDate = (dateValue) => {
//         if (!dateValue) return "";
//         const date = new Date(dateValue);
//         return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
//       };
      
      
//       setFormData({
//         employeeid: parsedData.Employeeid || "",
//         facultyname: parsedData.Employeename || "",
//         department: parsedData.Department || "",
//         designation: parsedData.Designation || "",
//         visitfrom: formatDate(parsedData.VisitFrom),
//         visitto: formatDate(parsedData.VisitTo),
//         natureofparticipation_value: parsedData.NatureOfVisit || "",
//         country: parsedData.Country?.trim() || "",
//         city: parsedData.CityTown || "",
//         claimtype: parsedData.ClaimType || "", 
//         signingAuthority: "",
//         toSection: [],
//         remarks: "",
//       });
      

//       const destination = parsedData.Country || "";
//       let processedSubject = parsedData.Subject || "";
//       processedSubject = processedSubject.replace(
//         /\{\{\.Destination\}\}/g,
//         destination
//       );

//       const referenceText = parsedData.Reference || "";

//       const formatHtmlTable = (htmlString) => {
//         if (!htmlString || typeof htmlString !== "string") return htmlString;

//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = htmlString;
//         const table = tempDiv.querySelector("table");
//         if (!table) return htmlString;

//         const rows = Array.from(table.querySelectorAll("tr"));
//         let bodyRowsHtml = "";

//         const cleanDate = (str) => {
//           if (!str) return "";
//           const match = str.match(/(\d{4}-\d{2}-\d{2})/);
//           return match ? match[1] : str.trim();
//         };

//         const looksLikeDate = (str) => /(\d{4}-\d{2}-\d{2})/.test(str);

//         let startIndex = 0;
//         for (let i = 0; i < rows.length; i++) {
//           const row = rows[i];
//           const text = row.textContent.trim().toLowerCase();
//           const cells = Array.from(row.querySelectorAll("td, th"));

//           const isHeaderText =
//             (text.includes("leave type") &&
//               text.includes("from") &&
//               text.includes("to")) ||
//             cells.every((cell) => {
//               const cellText = cell.textContent.trim().toLowerCase();
//               return (
//                 cellText === "leave type" ||
//                 cellText === "from" ||
//                 cellText === "to"
//               );
//             });

//           if (isHeaderText) {
//             startIndex = i + 1;
//             continue;
//           }

//           if (cells.length >= 3) {
//             const hasData = cells.some((cell) => {
//               const cellText = cell.textContent.trim();
//               return (
//                 cellText &&
//                 !cellText.toLowerCase().includes("leave type") &&
//                 !cellText.toLowerCase().includes("from") &&
//                 !cellText.toLowerCase().includes("to")
//               );
//             });

//             if (hasData) {
//               startIndex = i;
//               break;
//             }
//           }
//         }

//         for (let i = startIndex; i < rows.length; i++) {
//           const cells = Array.from(rows[i].querySelectorAll("td, th"));
//           if (cells.length < 3) continue;

//           let leaveType = cells[0]?.textContent.trim() || "";
//           let fromDate = cleanDate(cells[1]?.textContent.trim() || "");
//           let toDate = cleanDate(cells[2]?.textContent.trim() || "");

//           if (
//             looksLikeDate(leaveType) &&
//             !looksLikeDate(fromDate) &&
//             fromDate
//           ) {
//             const temp = leaveType;
//             leaveType = fromDate;
//             fromDate = cleanDate(temp);
//           }

//           if (leaveType || fromDate || toDate) {
//             bodyRowsHtml += `
//               <tr>
//                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${leaveType}</td>
//                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${fromDate}</td>
//                 <td style="border: 1px solid #000; padding: 8px; text-align: center;">${toDate}</td>
//               </tr>
//             `;
//           }
//         }

//         const newTableHtml = `
//           <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
//             <thead>
//               <tr>
//                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">Leave Type</th>
//                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">From</th>
//                 <th style="border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2; font-weight: bold;">To</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${
//                 bodyRowsHtml ||
//                 '<tr><td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: center;">-</td></tr>'
//               }
//             </tbody>
//           </table>
//         `;

//         table.outerHTML = newTableHtml;
//         return tempDiv.innerHTML;
//       };

//       const formattedBody = formatHtmlTable(parsedData.Body || "");

//       setBodyData({
//         referenceNo: parsedData.ReferenceNumber || "",
//         referenceDate: parsedData.ReferenceDate || "",
//         subject: stripNonEnglish(processedSubject),
//         refsubject: referenceText,
//         body: formattedBody,
//         header: parsedData.Header || "",
//         footer: parsedData.Footer || "",
//         template: stripNonEnglish(parsedData.filled_template || ""),
//       });
//       setIsSavedSuccessfully(true);
      
//       setPreviewCoverPageNo(record.coverpageno);
//       setSelectedEmployeeId(employeeid);

//     } catch (err) {
//       console.error("API Fetch Error:", err);
//       setError(err.message || "Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     const initializeData = async () => {
//       if (isInitialLoad && record?.coverpageno && record?.employeeid) {
//         try {
//           await fetchAllData(record.coverpageno, record.employeeid);
//           setIsInitialLoad(false); 
//         } catch (error) {
//           console.error("Initialization error:", error);
//           setError("Failed to initialize form data");
//           setIsInitialLoad(false); // Ensure loading state is reset even on error
//         }
//       }
//     };

//     initializeData();
//   }, [record, sessionId, isInitialLoad]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (!isInitialLoad) {
//         setIsSavedSuccessfully(false); 
//     }

//     if (type === "checkbox") {
//       setFormData((prev) => {
//         const current = Array.isArray(prev.toSection) ? prev.toSection : [];
//         const updated = checked
//           ? [...current, value]
//           : current.filter((v) => v !== value);
//         return { ...prev, toSection: updated };
//       });
//     } else if (
//       [
//         "referenceNo",
//         "referenceDate",
//         "subject",
//         "refsubject",
//         "body",
//         "header",
//         "footer",
//         "template",
//       ].includes(name)
//     ) {
//       setBodyData((prev) => ({ ...prev, [name]: value }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };


//   const validateForm = (isDraft = false) => {
//     const missingFields = [];
//     const invalidFields = [];
//     const requiredFieldsForSubmit = {
//       natureofparticipation_value: "Nature of Visit",
//       visitfrom: "Visit From Date",
//       visitto: "Visit To Date",
//       country: "Country",
//       city: "City/Town",
//       subject: "Subject",
//       refsubject: "Reference (Ref)",
//       body: "Body",
//       signingAuthority: "Signing Authority",
//       toSection: "To Section",
//       remarks: "Remarks",
//     };
//     const requiredFieldsForDraft = {
//       natureofparticipation_value: "Nature of Visit",
//       visitfrom: "Visit From Date",
//       visitto: "Visit To Date",
//       country: "Country",
//       city: "City/Town",
//     };

//     const fieldsToValidate = isDraft ? requiredFieldsForDraft : requiredFieldsForSubmit;
//     for (const [key, label] of Object.entries(fieldsToValidate)) {
//       let value = formData.hasOwnProperty(key) ? formData[key] : bodyData[key];
//       if (
//         value === "" ||
//         value === null ||
//         value === undefined ||
//         (Array.isArray(value) && value.length === 0) ||
//         (typeof value === "string" && value.trim() === "")
//       ) {
//         missingFields.push(label);
//       }
//     }
//     if (formData.visitfrom && formData.visitto) {
//       const fromDate = new Date(formData.visitfrom);
//       const toDate = new Date(formData.visitto);
      
//       if (fromDate > toDate) {
//         invalidFields.push("Visit To Date must be equal to or after Visit From Date");
//       }
//     }
//     if (!isDraft) {
//       if (bodyData.subject && bodyData.subject.trim().length < 10) {
//         invalidFields.push("Subject must be at least 10 characters long");
//       }
//       if (bodyData.body) {
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = bodyData.body;
//         const textContent = tempDiv.textContent || tempDiv.innerText || "";
//         if (textContent.trim().length < 20) {
//           invalidFields.push("Body must contain at least 20 characters of text");
//         }
//       }
//       if (formData.country && !/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
//         invalidFields.push("Country must contain only alphabetic characters");
//       }
//       if (formData.city && !/^[a-zA-Z\s,.-]+$/.test(formData.city.trim())) {
//         invalidFields.push("City/Town must contain only alphabetic characters and basic punctuation");
//       }
     
//     }
//     const errorMessages = [];
    
//     if (missingFields.length > 0) {
//       errorMessages.push(`Missing required fields: ${missingFields.join(", ")}`);
//     }

//     if (invalidFields.length > 0) {
//       errorMessages.push(...invalidFields);
//     }

//     if (errorMessages.length > 0) {
//       const message = errorMessages.join(". ");
//       setError(message);
      
//       Swal.fire({
//         title: "Validation Error",
//         html: errorMessages.map(msg => `• ${msg}`).join("<br>"),
//         icon: "warning",
//       });
      
//       return false;
//     }

//     setError("");
//     return true;
//   };
//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       console.log("Save as Draft - Starting...");

//       const jwtToken = Cookies.get("HRToken");
//       if (!jwtToken) throw new Error("Authentication token missing.");
//       const taskStatusId = 6; 

//       const reqpayload = createPayload("saveasdraft", taskStatusId, userRole); 

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

//       if (!response.ok) throw new Error("Failed to insert Office Order");
//       await response.json();

//       setIsSavedSuccessfully(true); 

//       await Swal.fire({
//         title: "Saved!",
//         text: "The task has been saved as a draft successfully. You may now view the preview.",
//         icon: "success",
//         timer: 3000,
//         showConfirmButton: false,
//       });

//     } catch (err) {
//       console.error("Save as Draft - Error:", err);
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

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       setError("");

//       const jwtToken = Cookies.get("HRToken");
//       if (!jwtToken) throw new Error("Authentication token missing.");
//       const taskStatusId = 4; 

//       const requestpayload = createPayload("submit", taskStatusId, userRole); 

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

//       if (!response.ok) throw new Error("Failed to insert Office Order");

//       await response.json();

//       setLoading(false);
//       setIsSavedSuccessfully(true); 

//       await Swal.fire({
//         title: "Submitted!",
//         text: "The task has been submitted successfully. Returning to previous page.",
//         icon: "success",
//         timer: 3000,
//         showConfirmButton: false,
//       });
//       onClose?.(true);
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
  
//   const handlePreview = async () => {
//     if (!isSavedSuccessfully) {
//       setError("Please save the draft or submit the form before previewing.");
//       Swal.fire({
//         title: "Action Required",
//         text: "Please save the current changes as a draft or submit the form before generating the preview PDF.",
//         icon: "info",
//       });
//       return;
//     }
    
//     if (
//       !record?.coverpageno ||
//       !formData.employeeid ||
//       !formData.signingAuthority
//     ) {
//       setError(
//         "Cannot generate preview: Missing Cover Page Number, Employee ID, or Signing Authority."
//       );
//       return;
//     }
    
//     setLoading(true);
//     setError("");

//     try {
//       const jwtToken = Cookies.get("HRToken");
//       if (!jwtToken) throw new Error("Authentication token missing.");
//       const pdfApiUrl = `https://wftest1.iitm.ac.in:8080/api/officeorder/pdf`;
      
//       const response = await fetch(pdfApiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${jwtToken}`,
//         },
//         body: JSON.stringify({
//           employeeid: formData.employeeid,
//           coverpageno: record.coverpageno,
//           templatetype: "draft",
//           status: "saveandhold",
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Failed to generate PDF. Server responded with: ${
//             errorText || response.statusText
//           }`
//         );
//       }

//       const pdfBlob = await response.blob();
//       const fileURL = URL.createObjectURL(pdfBlob);
      
//       setPreviewData({
//         pdfUrl: fileURL,
//         formData: formData,
//         bodyData: bodyData,
//       });
//       setPreviewCoverPageNo(record.coverpageno);
//       setSelectedEmployeeId(formData.employeeid);
      
//       setShowPreview(true); 

//     } catch (err) {
//       console.error("Preview Generation Error:", err);
//       const errorMessage =
//         err.message ||
//         "An unexpected error occurred while generating the preview.";
//       setError(errorMessage);
//       Swal.fire({
//         title: "Preview Error",
//         text: errorMessage,
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClosePreview = () => {
//     setShowPreview(false);
//     if (previewData?.pdfUrl) {
//       URL.revokeObjectURL(previewData.pdfUrl); 
//       setPreviewData(null);
//     }
//   };

//   const handleBack = () => onClose?.(false); 

//   if (loading && isInitialLoad)
//     return <div style={loadingStyle}>Loading employee data...</div>;

//   if (showPreview && previewData?.pdfUrl) {
//     return (
//       <OfficeOrderPreview
//         coverpageno={previewCoverPageNo}
//         employeeid={selectedEmployeeId}
//         pdfUrl={previewData.pdfUrl} 
//         formData={previewData.formData}
//         bodyData={previewData.bodyData}
//         onBack={handleClosePreview} 
//         isLocalPreview={false} 
//         loading={loading}
//       />
//     );
//   }

//   return (
//       <div style={cardStyle}>
//         <BackButton onClick={handleBack} />
//         <h2 style={headingStyle}>Permission Cum Relief</h2>
//         {error && <Alerts type="error" variant="outlined" message={error} />}

//         <form onSubmit={handleSubmit}>
//           {/* Employee Info */}
//           <FormSection>
//             <h3 style={sectionHeadingStyle}>
//               Employee Information
//             </h3>

//           {/* Row 1: Employee ID, Name, Dept, Desig */}
//               <div style={gridRowStyle}>
//                 <TextField
//                   label="Employee ID"
//                   name="employeeid"
//                   value={formData.employeeid}
//                   onChange={handleChange}
//                   InputProps={{ readOnly: true }}
//                   variant="outlined"
//                   fullWidth
//                 />
//                 <TextField
//                   label="Employee Name"
//                   name="facultyname"
//                   value={formData.facultyname}
//                   onChange={handleChange}
//                   InputProps={{ readOnly: true }}
//                   variant="outlined"
//                   fullWidth
//                 />
//                 <TextField
//                   label="Department"
//                   name="department"
//                   value={formData.department}
//                   onChange={handleChange}
//                   InputProps={{ readOnly: true }}
//                   variant="outlined"
//                   fullWidth
//                 />
//                 <TextField
//                   label="Designation"
//                   name="designation"
//                   value={formData.designation}
//                   onChange={handleChange}
//                   InputProps={{ readOnly: true }}
//                   variant="outlined"
//                   fullWidth
//                 />
//               </div>

//               {/* Row 2: Nature, Visit From, Visit To, Country */}
//               <div style={gridRowStyle}>
//                 <TextField
//                   label="Nature of Visit"
//                   name="natureofparticipation_value"
//                   value={formData.natureofparticipation_value}
//                   onChange={handleChange}
//                   variant="outlined"
//                   fullWidth
//                 />
//                 <TextField
//                   type="date"
//                   label="Visit From"
//                   name="visitfrom"
//                   value={formData.visitfrom}
//                   onChange={handleChange}
//                   InputLabelProps={{ shrink: true }}
//                   variant="outlined"
//                   fullWidth
//                 />
//                 <TextField
//                   type="date"
//                   label="Visit To"
//                   name="visitto"
//                   value={formData.visitto}
//                   onChange={handleChange}
//                   InputLabelProps={{ shrink: true }}
//                   variant="outlined"
//                   fullWidth
//                 />
//                 <TextField
//                   label="Country"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   variant="outlined"
//                   fullWidth
//                 />
//               </div>

//               {/* Row 3: City/Town (1 column) */}
//               <div style={gridRowStyle}>
//                 <TextField
//                   label="City/Town"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   variant="outlined"
//                   fullWidth
//                 />
//                 {/* Claim Type hidden field */}
//                 <TextField
//                   label="Claim Type"
//                   name="claimtype"
//                   value={formData.claimtype}
//                   onChange={handleChange}
//                   InputProps={{ readOnly: true }}
//                   sx={{ display: "none" }} 
//                 />
//                 <div></div> {/* Filler */}
//                 <div></div> {/* Filler */}
//                 <div></div> {/* Filler */}
//               </div>
           
//           </FormSection>

//           {/* Office Order Details */}
//           <FormSection>
//             <h3 style={sectionHeadingStyle}>
//               Office Order Details
//             </h3>

//             {/* Hidden Header/Footer fields */}
//             <TextField
//               label="Header"
//               name="header"
//               value={bodyData.header || ""}
//               variant="outlined"
//               fullWidth
//               sx={{ display: "none" }}
//             />
//             <TextField
//               label="Reference Number"
//               name="referenceNo"
//               value={bodyData.referenceNo}
//               onChange={handleChange}
//               variant="outlined"
//               fullWidth
//               sx={{ display: "none" }}
//             />
//             <TextField
//               label="Reference Date"
//               name="referenceDate"
//               value={bodyData.referenceDate}
//               onChange={handleChange}
//               variant="outlined"
//               fullWidth
//               sx={{ display: "none" }}
//             />

//             {/* Subject and Ref in one row (2 columns) */}
//             <div style={gridRowTwoColumnStyles}>
//               <TextField
//                 label="Subject"
//                 name="subject"
//                 value={bodyData.subject}
//                 onChange={handleChange}
//                 variant="outlined"
//                 fullWidth
//                 multiline
//                 rows={2}
//               />

//               {/* Using TextField equivalent structure for Ref for consistent height */}
//               <TextField
//                 label="Ref"
//                 name="refsubject"
//                 value={bodyData.refsubject || ""}
//                 onChange={handleChange}
//                 variant="outlined"
//                 fullWidth
//                 multiline
//                 rows={2}
//               />
//             </div>

//             {/* Body (Full width) */}
//             <div style={{ marginBottom: "16px" }}>
//               <label style={labelStyle}>Body</label>
//                 <TextEdit
//                   value={bodyData.body}
//                   onChange={(value) => {
//                     setBodyData((prev) => ({ ...prev, body: value }));
//                     if (!isInitialLoad) {
//                       setIsSavedSuccessfully(false);
//                     }
//                   }}
//                 />
//             </div>

//             <br />
            
//             {/* Signing Authority and TO Section side by side */}
//             <div style={gridRowTwoColumnStyles}>
//               <div>
//                 <Dropdown
//                 label="Signing Authority"
//                   options={signingOptions}
//                   value={signingValue}
//                   onChange={handleSigningChange}
//                 />
//               </div>
//               <div>

//                 <DropdownWithCheckboxes
//                   label="To Section"
//                   options={toSectionOptions.map(opt => ({ value: opt, label: opt }))}
//                   value={formData.toSection}
//                   onChange={(selected) => {
//                     setFormData((prev) => ({ ...prev, toSection: selected }));
//                     if (!isInitialLoad) {
//                       setIsSavedSuccessfully(false);
//                     }
//                   }}
//                 />
//               </div>
//             </div>

//             <br />

//             {/* Remarks (Full width) */}
//             <div style={gridRowTwoColumnStyle}>
//               <TextField
//                 label="Remarks"
//                 name="remarks"
//                 value={formData.remarks}
//                 onChange={handleChange}
//                 variant="outlined"
//                 fullWidth
//                 multiline
//                 rows={2}
//               />
//             </div>
//           </FormSection>

//           {/* Buttons (Right Aligned) */}
//           <div style={buttonContainerStyle}>
//             <SaveButton
//               variant="primary"
//               styleType="gradient"
//               onClick={handleSave}
//               disabled={loading}
//             >
//               Save as Draft
//             </SaveButton>

//             <SubmitButton
//               type="submit"
//               variant="success"
//               styleType="filled"
//               disabled={loading}
//             >
//               Submit
//             </SubmitButton>

//             {/* PREVIEW BUTTON: Conditional based on saved state, as requested by 'don't change any logics' */}
//             {isSavedSuccessfully && (
//               <FavoriteButton
//                 onClick={handlePreview}
//                 variant="warning"
//                 styleType="filled"
//                 disabled={loading}
//               >
//                 Preview
//               </FavoriteButton>
//             )}
//           </div>
//         </form>
//       </div>
   
//   );
// };

// /* ---------- STYLES (Refined for Consistency) ---------- */

// const cardStyle = {
//   width: "100%",
//   maxWidth: "2000px",
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
// const sectionHeadingStyle = {
//   marginBottom: "16px",
//   fontSize: "18px",
//   fontWeight: "600",
//   color: "#374151",
// }
// const labelStyle = {
//   display: "block",
//   marginBottom: "6px",
//   fontWeight: "500",
//   color: "#374151",
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
//   gridTemplateColumns: "repeat(2, 1fr)", // Changed to 2fr here for Subject/Ref
//   gap: "16px",
//   marginBottom: "16px",
//   width: "100%",
// };

// const loadingStyle = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100vh",
//   fontSize: "18px",
//   color: "#6B7280",
// };
// const buttonContainerStyle = {
//     display: "flex", 
//     gap: "12px", 
//     marginTop: "20px",
//     justifyContent: "flex-end", // Right alignment
// };

// export default EmployeeVisitForm;



/**
 * @fileoverview Employee Visit Form component for handling permission cum relief requests.
 * Manages form data, validation, API interactions for saving drafts, submitting,
 * and generating previews for office orders related to employee visits.
 * @module EmployeeVisitForm
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 */

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import OfficeOrderPreview from "./OfficeOrderPreview.js";
import DropdownWithCheckboxes from "src/components/ui/DropdownWithCheckBox";
import Dropdown from "src/components/ui/Dropdown";
import {
  decryptData,
  validateJsonData,
} from "src/components/Decryption/Decrypt";
import Alerts from "src/components/ui/Alerts.js";
import TextEdit from "./TextEdit";
import Swal from "sweetalert2";
import { HostName } from "src/assets/host/Host";
import FormSection from "src/components/ui/TopColorCard.js"; // New import for the FormSection component
import { SaveButton,SubmitButton,FavoriteButton, BackButton } from "src/components/ui/Button.js";

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
  });

  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false); 
  const [isInitialLoad, setIsInitialLoad] = useState(true); 
  const [previewData, setPreviewData] = useState(null); 
  const [previewCoverPageNo, setPreviewCoverPageNo] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const sessionId = Cookies.get("session_id");
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

  const signingOptions = [
    { value: "Signing Authority", label: "Select Signing Authority" },
    { value: "Deputy Registrar", label: "Deputy Registrar" },
    { value: "Assistant Registrar", label: "Assistant Registrar" },
    { value: "Registrar", label: "Registrar" },
  ];

  const signingValue = signingOptions.find(opt => opt.value === formData.signingAuthority) || signingOptions[0];

  /**
   * Handles changes to the signing authority dropdown selection.
   * @param {Object} selectedOption - The newly selected option object.
   */
  const handleSigningChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, signingAuthority: selectedOption.value }));
    if (!isInitialLoad) {
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
    let assignedRole;
    let typeofsubmit;
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
    let toColumnValue = "";
    const signingAuthority = formData.signingAuthority;
    const department = formData.department || "N/A Department"; 
    const facultyName = formData.facultyname || "N/A Name"; 
    if (signingAuthority) {
      toColumnValue = `<p><strong>To</strong><br>${facultyName} (ID No. ${
        formData.employeeid || "N/A"
      })<br>Thro the Head, ${department}</p><p><strong>Sir,</strong></p>`;
    }
    let signatureHtml = "";

    if (actionType === "submit" || actionType === "saveasdraft") {
      signatureHtml = `<p>${signingAuthority || "Authority Not Specified"}</p>`;
    }

    return {
      token: "HRFGVJISOVp1fncC",
      session_id: sessionId,
      typeofsubmit: typeofsubmit, 
      p_cover_page_no: record?.coverpageno || "",
      p_employee_id: formData.employeeid,
      p_employee_name: formData.facultyname,
      p_department: formData.department,
      p_designation: formData.designation,
      p_visit_from: formatTimestamp(formData.visitfrom, "09:00:00"),
      p_visit_to: formatTimestamp(formData.visitto, "17:00:00"),
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
      p_signature_html: signatureHtml, 
      p_cc_to: Array.isArray(formData.toSection)
        ? formData.toSection.join(",")
        : formData.toSection || "",
      p_footer_html: bodyData.footer || "",
      // p_assign_to: "", 
      // p_assigned_role: "assignedRole", 
      p_task_status_id: taskStatusId, 
      p_activity_seq_no: 1, 
      p_is_task_return: false,
      p_is_task_approved: actionType === "submit", 
      p_initiated_by: currentInitiator,
      p_initiated_on: new Date().toISOString().replace("Z", "+05:30"), 
      p_updated_by: currentInitiator,
      p_updated_on: new Date().toISOString().replace("Z", "+05:30"), 
      p_process_id: 1,
      p_remarks: formData.remarks,
      p_email_flag: false,
      p_reject_flag: 0,
      p_user_role: userRole, 
    };
  };

  /**
   * Fetches and decrypts all required data for the form from the API.
   * Populates form and body data states, processes HTML tables for leave details.
   * @param {string} coverpageno - The cover page number for the record.
   * @param {string} employeeid - The employee ID to fetch data for.
   */
  const fetchAllData = async (coverpageno, employeeid) => {
    setLoading(true);
    setError("");
    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!employeeid) throw new Error("Employee ID missing.");
      if (!coverpageno) throw new Error("Cover page number missing.");

      const apiUrl = `https://wftest1.iitm.ac.in:7000/OfficeOrder_datatemplate`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          employeeid: employeeid,
          coverpageno: coverpageno,
          session_id: sessionId,
          token: "HRFGVJISOVp1fncC",
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch data from API");

      const encryptedData = await response.json();
      const encryptedPayload = encryptedData.Data ?? encryptedData.data;
      if (!encryptedPayload) throw new Error("Encrypted Data missing");

      const decryptedString = await decryptData(encryptedPayload);
      const parsedData = validateJsonData(decryptedString);

      const formatDate = (dateValue) => {
        if (!dateValue) return "";
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
      };
      
      
      setFormData({
        employeeid: parsedData.Employeeid || "",
        facultyname: parsedData.Employeename || "",
        department: parsedData.Department || "",
        designation: parsedData.Designation || "",
        visitfrom: formatDate(parsedData.VisitFrom),
        visitto: formatDate(parsedData.VisitTo),
        natureofparticipation_value: parsedData.NatureOfVisit || "",
        country: parsedData.Country?.trim() || "",
        city: parsedData.CityTown || "",
        claimtype: parsedData.ClaimType || "", 
        signingAuthority: "",
        toSection: [],
        remarks: "",
      });
      

      const destination = parsedData.Country || "";
      let processedSubject = parsedData.Subject || "";
      processedSubject = processedSubject.replace(
        /\{\{\.Destination\}\}/g,
        destination
      );

      const referenceText = parsedData.Reference || "";

      /**
       * Formats an HTML table string for leave details, extracting and restructuring rows.
       * @param {string} htmlString - The raw HTML table string.
       * @returns {string} The reformatted HTML table string.
       */
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

      const formattedBody = formatHtmlTable(parsedData.Body || "");

      setBodyData({
        referenceNo: parsedData.ReferenceNumber || "",
        referenceDate: parsedData.ReferenceDate || "",
        subject: stripNonEnglish(processedSubject),
        refsubject: referenceText,
        body: formattedBody,
        header: parsedData.Header || "",
        footer: parsedData.Footer || "",
        template: stripNonEnglish(parsedData.filled_template || ""),
      });
      setIsSavedSuccessfully(true);
      
      setPreviewCoverPageNo(record.coverpageno);
      setSelectedEmployeeId(employeeid);

    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect hook to initialize form data on component mount if record is provided.
   * Triggers data fetching and sets initial load flag.
   */
  useEffect(() => {
    const initializeData = async () => {
      if (isInitialLoad && record?.coverpageno && record?.employeeid) {
        try {
          await fetchAllData(record.coverpageno, record.employeeid);
          setIsInitialLoad(false); 
        } catch (error) {
          console.error("Initialization error:", error);
          setError("Failed to initialize form data");
          setIsInitialLoad(false); // Ensure loading state is reset even on error
        }
      }
    };

    initializeData();
  }, [record, sessionId, isInitialLoad]);

  /**
   * Handles changes to form inputs, updating state accordingly.
   * Supports checkboxes, body data fields, and general form fields.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (!isInitialLoad) {
        setIsSavedSuccessfully(false); 
    }

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
    }
  };

  /**
   * Validates the form fields based on draft or submit mode.
   * Checks for required fields, date logic, and content length/format.
   * @param {boolean} [isDraft=false] - Whether to validate for draft (lenient) or full submit.
   * @returns {boolean} True if validation passes, false otherwise.
   */
  const validateForm = (isDraft = false) => {
    const missingFields = [];
    const invalidFields = [];
    const requiredFieldsForSubmit = {
      natureofparticipation_value: "Nature of Visit",
      visitfrom: "Visit From Date",
      visitto: "Visit To Date",
      country: "Country",
      city: "City/Town",
      subject: "Subject",
      refsubject: "Reference (Ref)",
      body: "Body",
      signingAuthority: "Signing Authority",
      toSection: "To Section",
      remarks: "Remarks",
    };
    const requiredFieldsForDraft = {
      natureofparticipation_value: "Nature of Visit",
      visitfrom: "Visit From Date",
      visitto: "Visit To Date",
      country: "Country",
      city: "City/Town",
    };

    const fieldsToValidate = isDraft ? requiredFieldsForDraft : requiredFieldsForSubmit;
    for (const [key, label] of Object.entries(fieldsToValidate)) {
      let value = formData.hasOwnProperty(key) ? formData[key] : bodyData[key];
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.trim() === "")
      ) {
        missingFields.push(label);
      }
    }
    if (formData.visitfrom && formData.visitto) {
      const fromDate = new Date(formData.visitfrom);
      const toDate = new Date(formData.visitto);
      
      if (fromDate > toDate) {
        invalidFields.push("Visit To Date must be equal to or after Visit From Date");
      }
    }
    if (!isDraft) {
      if (bodyData.subject && bodyData.subject.trim().length < 10) {
        invalidFields.push("Subject must be at least 10 characters long");
      }
      if (bodyData.body) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = bodyData.body;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        if (textContent.trim().length < 20) {
          invalidFields.push("Body must contain at least 20 characters of text");
        }
      }
      if (formData.country && !/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
        invalidFields.push("Country must contain only alphabetic characters");
      }
      if (formData.city && !/^[a-zA-Z\s,.-]+$/.test(formData.city.trim())) {
        invalidFields.push("City/Town must contain only alphabetic characters and basic punctuation");
      }
     
    }
    const errorMessages = [];
    
    if (missingFields.length > 0) {
      errorMessages.push(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (invalidFields.length > 0) {
      errorMessages.push(...invalidFields);
    }

    if (errorMessages.length > 0) {
      const message = errorMessages.join(". ");
      setError(message);
      
      Swal.fire({
        title: "Validation Error",
        html: errorMessages.map(msg => `• ${msg}`).join("<br>"),
        icon: "warning",
      });
      
      return false;
    }

    setError("");
    return true;
  };

  /**
   * Handles saving the form as a draft via API.
   * Updates success state and shows confirmation.
   */
  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Save as Draft - Starting...");

      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");
      const taskStatusId = 6; 

      const reqpayload = createPayload("saveasdraft", taskStatusId, userRole); 

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

      setIsSavedSuccessfully(true); 

      await Swal.fire({
        title: "Saved!",
        text: "The task has been saved as a draft successfully. You may now view the preview.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error("Save as Draft - Error:", err);
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
   * Handles form submission after validation.
   * Submits to API and closes the form on success.
   * @param {Object} [e] - Optional event object to prevent default.
   */
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");
      const taskStatusId = 4; 

      const requestpayload = createPayload("submit", taskStatusId, userRole); 

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

  /**
   * Handles preview generation after ensuring a draft is saved.
   * Fetches PDF blob from API and opens preview modal.
   */
  const handlePreview = async () => {
    if (!isSavedSuccessfully) {
      setError("Please save the draft or submit the form before previewing.");
      Swal.fire({
        title: "Action Required",
        text: "Please save the current changes as a draft or submit the form before generating the preview PDF.",
        icon: "info",
      });
      return;
    }
    
    if (
      !record?.coverpageno ||
      !formData.employeeid ||
      !formData.signingAuthority
    ) {
      setError(
        "Cannot generate preview: Missing Cover Page Number, Employee ID, or Signing Authority."
      );
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");
      const pdfApiUrl = `https://wftest1.iitm.ac.in:8080/api/officeorder/pdf`;
      
      const response = await fetch(pdfApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          employeeid: formData.employeeid,
          coverpageno: record.coverpageno,
          templatetype: "draft",
          status: "saveandhold",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to generate PDF. Server responded with: ${
            errorText || response.statusText
          }`
        );
      }

      const pdfBlob = await response.blob();
      const fileURL = URL.createObjectURL(pdfBlob);
      
      setPreviewData({
        pdfUrl: fileURL,
        formData: formData,
        bodyData: bodyData,
      });
      setPreviewCoverPageNo(record.coverpageno);
      setSelectedEmployeeId(formData.employeeid);
      
      setShowPreview(true); 

    } catch (err) {
      console.error("Preview Generation Error:", err);
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
   * Closes the preview modal and revokes the PDF URL to free memory.
   */
  const handleClosePreview = () => {
    setShowPreview(false);
    if (previewData?.pdfUrl) {
      URL.revokeObjectURL(previewData.pdfUrl); 
      setPreviewData(null);
    }
  };

  /**
   * Handles back navigation by calling the onClose callback.
   */
  const handleBack = () => onClose?.(false); 

  if (loading && isInitialLoad)
    return <div style={loadingStyle}>Loading employee data...</div>;

  if (showPreview && previewData?.pdfUrl) {
    return (
      <OfficeOrderPreview
        coverpageno={previewCoverPageNo}
        employeeid={selectedEmployeeId}
        pdfUrl={previewData.pdfUrl} 
        formData={previewData.formData}
        bodyData={previewData.bodyData}
        onBack={handleClosePreview} 
        isLocalPreview={false} 
        loading={loading}
      />
    );
  }

  return (
      <div style={cardStyle}>
        <BackButton onClick={handleBack} />
        <h2 style={headingStyle}>Permission Cum Relief</h2>
        {error && <Alerts type="error" variant="outlined" message={error} />}

        <form onSubmit={handleSubmit}>
          {/* Employee Info */}
          <FormSection>
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
            <h3 style={sectionHeadingStyle}>
              Office Order Details
            </h3>

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
              variant="outlined"
              fullWidth
              sx={{ display: "none" }}
            />
            <TextField
              label="Reference Date"
              name="referenceDate"
              value={bodyData.referenceDate}
              onChange={handleChange}
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
                variant="outlined"
                fullWidth
                multiline
                rows={2}
              />

              {/* Using TextField equivalent structure for Ref for consistent height */}
              <TextField
                label="Ref"
                name="refsubject"
                value={bodyData.refsubject || ""}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                multiline
                rows={2}
              />
            </div>

            {/* Body (Full width) */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Body</label>
                <TextEdit
                  value={bodyData.body}
                  onChange={(value) => {
                    setBodyData((prev) => ({ ...prev, body: value }));
                    if (!isInitialLoad) {
                      setIsSavedSuccessfully(false);
                    }
                  }}
                />
            </div>

            <br />
            
            {/* Signing Authority and TO Section side by side */}
            <div style={gridRowTwoColumnStyles}>
              <div>
                <Dropdown
                label="Signing Authority"
                  options={signingOptions}
                  value={signingValue}
                  onChange={handleSigningChange}
                />
              </div>
              <div>

                <DropdownWithCheckboxes
                  label="To Section"
                  options={toSectionOptions.map(opt => ({ value: opt, label: opt }))}
                  value={formData.toSection}
                  onChange={(selected) => {
                    setFormData((prev) => ({ ...prev, toSection: selected }));
                    if (!isInitialLoad) {
                      setIsSavedSuccessfully(false);
                    }
                  }}
                />
              </div>
            </div>

            <br />

            {/* Remarks (Full width) */}
            <div style={gridRowTwoColumnStyle}>
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
          </FormSection>

          {/* Buttons (Right Aligned) */}
          <div style={buttonContainerStyle}>
            <SaveButton
              variant="primary"
              styleType="gradient"
              onClick={handleSave}
              disabled={loading}
            >
              Save as Draft
            </SaveButton>

            <SubmitButton
              type="submit"
              variant="success"
              styleType="filled"
              disabled={loading}
            >
              Submit
            </SubmitButton>

            {/* PREVIEW BUTTON: Conditional based on saved state, as requested by 'don't change any logics' */}
            {isSavedSuccessfully && (
              <FavoriteButton
                onClick={handlePreview}
                variant="warning"
                styleType="filled"
                disabled={loading}
              >
                Preview
              </FavoriteButton>
            )}
          </div>
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
}
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
const buttonContainerStyle = {
    display: "flex", 
    gap: "12px", 
    marginTop: "20px",
    justifyContent: "flex-end", // Right alignment
};

export default EmployeeVisitForm;