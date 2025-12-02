// // /*******************************************09.10.2025*************************************************/

// // /**
// //  * @fileoverview Office Order Table screen.
// //  *
// //  * This component shows a list of employee visit details (office orders).
// //  * It connects to the backend API, fetches encrypted data, and then decrypts it
// //  * before showing it in a table. It provides:
// //  * - Table columns (Id, Applicant, Department, Purpose, Date, etc.)
// //  * - Filters (by status and template type)
// //  * - Pagination (10 records per page)
// //  * - Status labels with color coding
// //  * - A dropdown to choose template type (Generate, Amendment, Cancellation)
// //  * - A back button to return to the previous screen
// //  * - Ability to open a visit form for a selected record
// //  * - Confirmation popup for "New Order" in saveandhold filter
// //  *
// //  * @module src/components/officeOrder/OfficeOrderTable
// //  * @date 22/07/2025
// //  * @since 2.0.0
// //  */

// // // import React, { useState, useEffect } from "react";
// // // import GenericTableGrid from "src/components/ui/TableGrid";
// // // import EmployeeVisitForm from "./EmployeeVisitForm.js";
// // // import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
// // // import Cookies from "js-cookie";
// // // import {
// // //   decryptData,
// // //   validateJsonData,
// // // } from "src/components/Decryption/Decrypt";
// // // import FancyCircularLoader from "src/components/ui/Loader";
// // // import { HostName } from "src/assets/host/Host";
// // // import Swal from "sweetalert2";

// // // const OfficeOrderTable = ({ onBack, order, filter }) => {
// // //   const palette = {
// // //     primary: "#20639B",
// // //     darkBlue: "#173F5F",
// // //     teal: "#3CAEA3",
// // //     yellow: "#F6D55C",
// // //     coral: "#ED553B",
// // //     success: "#3CAEA3",
// // //     warning: "#F6D55C",
// // //     border: "#E2E8F0",
// // //     hover: "#F9FAFB",
// // //     white: "#FFFFFF",
// // //     text: { primary: "#1E293B", secondary: "#64748B" },
// // //   };

// // //   const [records, setRecords] = useState([]);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [selectedRecord, setSelectedRecord] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [progress, setProgress] = useState(0);
// // //   const [dropdownOptions, setDropdownOptions] = useState({});
// // //   const recordsPerPage = 10;
// // //   const [error, setError] = useState("");

// // //   const [refreshTrigger, setRefreshTrigger] = useState(0);

// // //   const sessionId = Cookies.get("session_id");
// // //   const jwtToken = Cookies.get("HRToken");

// // // const refreshTable = () => {
// // //   setRefreshTrigger(prev => prev + 1);
// // // };

// // //   const columns = [
// // //     {
// // //       key: "id",
// // //       label: "Id",
// // //       width: "80px",
// // //       sortable: true,
// // //       type: "number",
// // //       align: "left",
// // //       render: (item) => (
// // //         <div style={{ fontWeight: "600", color: palette.primary }}>
// // //           {item.id}
// // //         </div>
// // //       ),
// // //     },
// // //     { key: "employeeid", label: "Emp Id", width: "200px", sortable: true, align: "center" },
// // //     { key: "coverpageno", label: "CoverPageNo", width: "200px", sortable: true, align: "center" },
// // //     {
// // //       key: "applicant",
// // //       label: "Applicant",
// // //       width: "200px",
// // //       sortable: true,
// // //       align: "left",
// // //       render: (item) => {
// // //         const parts = (item.applicant || "").split(" / ");
// // //         const name = parts[0] || "--";
// // //         const designation = parts[2] || "";
// // //         return (
// // //           <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
// // //             <div style={{ fontWeight: "600" }}>{name}</div>
// // //             {designation && (
// // //               <div style={{ fontSize: "12px", color: palette.text.secondary }}>
// // //                 {designation}
// // //               </div>
// // //             )}
// // //           </div>
// // //         );
// // //       },
// // //     },
// // //     { key: "department", label: "Department", width: "200px", sortable: true, align: "center" },

// // //     {
// // //       key: "status",
// // //       label: "Status",
// // //       width: "120px",
// // //       sortable: true,
// // //       align: "center",
// // //       render: (item) => (
// // //         <span
// // //           style={{
// // //             padding: "4px 10px",
// // //             borderRadius: "6px",
// // //             fontWeight: "500",
// // //             fontSize: "13px",
// // //             backgroundColor:
// // //               item.status === "Approved"
// // //                 ? "#D1FAE5"
// // //                 : item.status === "Pending"
// // //                 ? "#FEF3C7"
// // //                 : "#F3F4F6",
// // //             color:
// // //               item.status === "Approved"
// // //                 ? palette.success
// // //                 : item.status === "Pending"
// // //                 ? "#D97706"
// // //                 : "#6B7280",
// // //           }}
// // //         >
// // //           {item.status}
// // //         </span>
// // //       ),
// // //     },
// // //     {
// // //       key: "templateType",
// // //       label: "Template Type",
// // //       width: "160px",
// // //       sortable: true,
// // //       align: "left",
// // //       render: (item) => (
// // //         <select
// // //           value={item.templateType}
// // //           onChange={(e) => {
// // //             const selectedValue = e.target.value;
// // //             handleTemplateChange(item.id, selectedValue);
// // //           }}
// // //           onClick={async (e) => {
// // //             e.stopPropagation();
// // //             if (dropdownOptions[item.id]) return;

// // //             try {
// // //               const body = {
// // //                 employeeid: item.employeeid,
// // //                 coverpageno: item.coverpageno,
// // //                 token: "HRFGVJISOVp1fncC",
// // //                 session_id: sessionId,
// // //               };

// // //               const resp = await fetch(`${HostName}/OfficeOrder_DropdownValuesHandler`, {
// // //                 method: "POST",
// // //                 headers: {
// // //                   "Content-Type": "application/json",
// // //                   Authorization: `Bearer ${jwtToken}`,
// // //                 },
// // //                 body: JSON.stringify(body),
// // //               });

// // //               const encData = await resp.json();
// // //               const decrypted = await decryptData(encData.Data ?? encData.data);
// // //               const parsed = validateJsonData(decrypted);

// // //               const options =
// // //                 parsed?.Data?.Records?.map((rec) => ({
// // //                   Id: rec.Id,
// // //                   value: rec.dropdown_value,
// // //                   label: rec.dropdown_value,
// // //                 })) || [];

// // //               setDropdownOptions((prev) => ({
// // //                 ...prev,
// // //                 [item.id]: options,
// // //               }));
// // //             } catch (err) {
// // //               console.error("Dropdown fetch error:", err);
// // //             }
// // //           }}
// // //           style={{
// // //             width: "100%",
// // //             padding: "6px",
// // //             borderRadius: "6px",
// // //             border: `1px solid ${palette.border}`,
// // //             fontSize: "13px",
// // //           }}
// // //         >
// // //           <option value="">Select</option>
// // //           {(dropdownOptions[item.id] || []).map((opt, idx) => (
// // //             <option key={idx} value={opt.value}>
// // //               {opt.label}
// // //             </option>
// // //           ))}
// // //         </select>
// // //       ),
// // //     },
// // //     {
// // //       key: "generatedtemplate",
// // //       label: "Generated Template",
// // //       width: "160px",
// // //       sortable: false,
// // //       align: "center",
// // //       render: () => "--",
// // //     },
// // //   ];

// // //   const filters = [
// // //     {
// // //       key: "status",
// // //       label: "All Status",
// // //       options: [
// // //         { value: "Approved", label: "Approved" },
// // //         { value: "Pending", label: "Pending" },
// // //         { value: "Rejected", label: "Rejected" },
// // //       ],
// // //     },
// // //   ];

// // // useEffect(() => {
// // //   const fetchOfficeOrderDetails = async () => {
// // //     if (!jwtToken) return;

// // //     setLoading(true);
// // //     setProgress(0);

// // //     try {
// // //       // ---------- 1️⃣ Fetch OfficeOrder_visitdetails ----------
// // //       const visitDetailsBody = {
// // //         employeeid: Cookies.get("EmpId"),
// // //         token: "HRFGVJISOVp1fncC",
// // //         session_id: sessionId,
// // //       };

// // //       const visitRes = await fetch(`${HostName}/OfficeOrder_visitdetails`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${jwtToken}`,
// // //         },
// // //         body: JSON.stringify(visitDetailsBody),
// // //       });

// // //       const visitData = await visitRes.json();
// // //       const decryptedVisit = await decryptData(visitData.Data ?? visitData.data);
// // //       const parsedVisit = validateJsonData(decryptedVisit);
// // //       const visitRecords = parsedVisit?.Data?.Records ?? [];

// // //       const formattedVisit = visitRecords.map((item, idx) => ({
// // //          id: item.visit_id || `${idx + 1}`,
// // //             employeeid: item.employeeid || "--",
// // //             coverpageno: item.coverpageno || "--",
// // //             applicant: item.facultyname || item.facultydetails || "--",
// // //             designation: item.designation || "--",
// // //             department: item.department || "--",
// // //             destination: `${item.citytown || ""}, ${item.country || ""}`,
// // //             status: item.claimtype || "Pending",
// // //             claimtype: item.claimtype || "",
// // //             leaveDetails: item.leavedetails || [],
// // //             templateType: "",
// // //             visitfrom:item.visitfrom,
// // //             visitto:item.visitto,
// // //             natureOfvisit:item.natureofparticipation_value,
// // //             country:item.country,
// // //             city:item.citytown,
// // //       }));

// // //       setRecords(formattedVisit);
// // //       setProgress(50);

// // //       // ---------- 2️⃣ Fetch OfficeOrder_taskvisitdetails (if filter applies) ----------
// // //       if (["saveandhold", "ongoing", "complete"].includes(filter)) {
// // //         const taskBody = {
// // //           employeeid: Cookies.get("EmpId"),
// // //           token: "HRFGVJISOVp1fncC",
// // //           session_id: sessionId,
// // //           status: filter,
// // //         };

// // //         const taskRes = await fetch(`${HostName}/OfficeOrder_taskvisitdetails`, {
// // //           method: "POST",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //             Authorization: `Bearer ${jwtToken}`,
// // //           },
// // //           body: JSON.stringify(taskBody),
// // //         });

// // //         const taskData = await taskRes.json();
// // //         const decryptedTask = await decryptData(taskData.Data ?? taskData.data);
// // //         const parsedTask = validateJsonData(decryptedTask);
// // //         const taskRecords = parsedTask?.Data?.Records ?? [];

// // //         const formattedTask = taskRecords.map((item, idx) => ({
// // //             id: item.visit_id || `${idx + 1}`,
// // //             employeeid: item.employeeid || "--",
// // //             coverpageno: item.coverpageno || "--",
// // //             applicant: item.facultyname || item.facultydetails || "--",
// // //             designation: item.designation || "--",
// // //             department: item.department || "--",
// // //             destination: `${item.citytown || ""}, ${item.country || ""}`,
// // //             status: item.claimtype || "Pending",
// // //             claimtype: item.claimtype || "",
// // //             leaveDetails: item.leavedetails || [],
// // //             templateType: "",
// // //             visitfrom: item.visitfrom,
// // //             visitto: item.visitto,
// // //             natureOfvisit: item.natureofparticipation,
// // //             country: item.country,
// // //             city: item.citytown,
// // //             assignedto:item.assignto,
// // //             signingauthority:item.signingauthority,

// // //                   }));

// // //         setRecords(formattedTask);
// // //       }

// // //       setProgress(100);
// // //     } catch (error) {
// // //       console.error("❌ Error fetching/decrypting:", error);
// // //       setRecords([]);
// // //       setProgress(100);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   fetchOfficeOrderDetails();
// // // }, [jwtToken, sessionId, filter,refreshTrigger]);

// // //   const handleTemplateChange = (id, value) => {
// // //     const record = records.find((r) => r.id === id);
// // //     const selectedOption = dropdownOptions[id]?.find(opt => opt.value === value);

// // //     // Check if this is "New Order" (Id: "2") in saveandhold filter
// // //       if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
// // //     Swal.fire({
// // //       title: "Are you sure?",
// // //       text: "The existing data will be deleted. Do you want to proceed?",
// // //       icon: "warning",
// // //       showCancelButton: true,
// // //       confirmButtonColor: "#ED553B",
// // //       cancelButtonColor: "#6B7280",
// // //       confirmButtonText: "Yes, Delete",
// // //       cancelButtonText: "No",
// // //     }).then((result) => {
// // //       if (result.isConfirmed) {
// // //         handleConfirmYes(id, value, record);
// // //       } else {
// // //         handleConfirmNo(id, record);
// // //       }
// // //     });
// // //     return;
// // //   }
// // //     // For all other cases, proceed normally
// // //     setRecords((prev) =>
// // //       prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
// // //     );

// // //     if (value) {
// // //       setSelectedRecord({ ...record, templateType: value });
// // //     }
// // //   };

// // // // const handleConfirmYes = async (id, value, record) => {
// // // //   try {
// // // //     setLoading(true);
// // // //     setError("");

// // // //     const jwtToken = Cookies.get("HRToken");
// // // //     if (!jwtToken) throw new Error("Authentication token missing.");
// // // //     if (!sessionId) throw new Error("Session ID missing.");

// // // //     // 1️⃣ Get Deleted status ID
// // // //     const statusResponse = await fetch(
// // // //       "https://wftest1.iitm.ac.in:7000/Statusmasternew",
// // // //       {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${jwtToken}`,
// // // //         },
// // // //         body: JSON.stringify({
// // // //           statusdescription: "Deleted",
// // // //           token: "HRFGVJISOVp1fncC",
// // // //           session_id: sessionId,
// // // //         }),
// // // //       }
// // // //     );

// // // //     if (!statusResponse.ok) throw new Error("Failed to fetch status");

// // // //     const encryptedStatus = await statusResponse.json();
// // // //     const decryptedString = await decryptData(
// // // //       encryptedStatus.Data ?? encryptedStatus.data
// // // //     );
// // // //     const validStatusData = validateJsonData(decryptedString);

// // // //     const deletedStatusId =
// // // //       validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

// // // //     // 2️⃣ Build payload
// // // //     const reqpayload = {
// // // //       token: "HRFGVJISOVp1fncC",
// // // //       session_id: sessionId,
// // // //       p_coverpageno: record.coverpageno,
// // // //       p_employeeid: record.employeeid,
// // // //       p_taskstatusid: String(deletedStatusId),
// // // //       p_updatedby: "DELETEBYUSER",
// // // //       p_updatedon: new Date().toISOString(),
// // // //     };

// // // //     // 3️⃣ Call status update API
// // // //     const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
// // // //       method: "POST",
// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //         Authorization: `Bearer ${jwtToken}`,
// // // //       },
// // // //       body: JSON.stringify(reqpayload),
// // // //     });

// // // //     if (!response.ok) throw new Error("Failed to update Office Order");

// // // //     const result = await response.json();

// // // //     // 4️⃣ Update UI
// // // //     setRecords((prev) =>
// // // //       prev.map((rec) =>
// // // //         rec.id === id ? { ...rec, templateType: value } : rec
// // // //       )
// // // //     );

// // // //     // 🔹 NEW: Clear selectedRecord to go back to table
// // // //     setSelectedRecord(null);

// // // //     Swal.fire({
// // // //       icon: "success",
// // // //       title: "Deleted!",
// // // //       text: "Previous data has been removed.",
// // // //       timer: 1500,
// // // //       showConfirmButton: false,
// // // //     });

// // // //     // 🔹 Optionally, refresh the table to fetch latest data
// // // //     refreshTable();

// // // //   } catch (error) {
// // // //     console.error("Error in confirm YES:", error);
// // // //     Swal.fire("Error", "Something went wrong!", "error");
// // // //   } finally {
// // // //     setLoading(false);
// // // //   }
// // // // };

// // // const handleConfirmYes = async (id, value, record) => {
// // //   try {
// // //     setLoading(true);
// // //     setError("");

// // //     const jwtToken = Cookies.get("HRToken");
// // //     if (!jwtToken) throw new Error("Authentication token missing.");
// // //     if (!sessionId) throw new Error("Session ID missing.");

// // //     // 1️⃣ Get Deleted status ID
// // //     const statusResponse = await fetch(
// // //       "https://wftest1.iitm.ac.in:7000/Statusmasternew",
// // //       {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${jwtToken}`,
// // //         },
// // //         body: JSON.stringify({
// // //           statusdescription: "Deleted",
// // //           token: "HRFGVJISOVp1fncC",
// // //           session_id: sessionId,
// // //         }),
// // //       }
// // //     );

// // //     if (!statusResponse.ok) throw new Error("Failed to fetch status");

// // //     const encryptedStatus = await statusResponse.json();
// // //     const decryptedString = await decryptData(
// // //       encryptedStatus.Data ?? encryptedStatus.data
// // //     );
// // //     const validStatusData = validateJsonData(decryptedString);

// // //     const deletedStatusId =
// // //       validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

// // //     // 2️⃣ Build payload
// // //     const reqpayload = {
// // //       token: "HRFGVJISOVp1fncC",
// // //       session_id: sessionId,
// // //       p_coverpageno: record.coverpageno,
// // //       p_employeeid: record.employeeid,
// // //       p_taskstatusid: String(deletedStatusId),
// // //       p_updatedby: "DELETEBYUSER",
// // //       p_updatedon: new Date().toISOString(),
// // //     };

// // //     // 3️⃣ Call status update API
// // //     const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
// // //       method: "POST",
// // //       headers: {
// // //         "Content-Type": "application/json",
// // //         Authorization: `Bearer ${jwtToken}`,
// // //       },
// // //       body: JSON.stringify(reqpayload),
// // //     });

// // //     if (!response.ok) throw new Error("Failed to update Office Order");

// // //     const result = await response.json();

// // //     // ✅ Show success first
// // //     Swal.fire({
// // //       icon: "success",
// // //       title: "Deleted!",
// // //       text: "Previous data has been removed. Opening a new form...",
// // //       timer: 1500,
// // //       showConfirmButton: false,
// // //     });

// // //     // ✅ Refresh table (re-fetch data)
// // //     refreshTable();

// // //     // ✅ Open EmployeeVisitForm after small delay to allow refresh
// // //     setTimeout(() => {
// // //       setSelectedRecord({ ...record, templateType: value });
// // //     }, 1500);

// // //   } catch (error) {
// // //     console.error("Error in confirm YES:", error);
// // //     Swal.fire("Error", "Something went wrong!", "error");
// // //   } finally {
// // //     setLoading(false);
// // //   }
// // // };

// // // const handleConfirmNo = (id, record) => {
// // //   setRecords(prev =>
// // //     prev.map(rec =>
// // //       rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
// // //     )
// // //   );
// // //   setSelectedRecord({ ...record, templateType: "Continue Editing" });

// // //   Swal.fire({
// // //     icon: "info",
// // //     title: "Cancelled",
// // //     text: "You can continue editing your existing data.",
// // //     timer: 1500,
// // //     showConfirmButton: false,
// // //   });
// // // };

// // //   const indexOfLast = currentPage * recordsPerPage;
// // //   const indexOfFirst = indexOfLast - recordsPerPage;
// // //   const currentRecords = records.slice(indexOfFirst, indexOfLast);
// // //   const totalPages = Math.ceil(records.length / recordsPerPage);

// // //   return (
// // //     <div>
// // //       {loading ? (
// // //         <div
// // //           style={{
// // //             display: "flex",
// // //             flexDirection: "column",
// // //             justifyContent: "center",
// // //             alignItems: "center",
// // //             height: "400px",
// // //             gap: "20px",
// // //             color: palette.primary,
// // //             fontSize: "18px",
// // //           }}
// // //         >
// // //           <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
// // //         </div>
// // //       ) : selectedRecord ? (
// // //         selectedRecord.templateType === "Continue Editing" ? (
// // //           <SaveandHold
// // //             record={selectedRecord}
// // //             onClose={() => {
// // //               setRecords((prev) =>
// // //                 prev.map((rec) =>
// // //                   rec.id === selectedRecord.id ? { ...rec, templateType: "" } : rec
// // //                 )
// // //               );
// // //               setSelectedRecord(null);
// // //             }}
// // //              onSuccess={refreshTable} // Add this prop
// // //           />
// // //         ) : (
// // //           <EmployeeVisitForm
// // //             record={selectedRecord}
// // //             onClose={() => {
// // //               setRecords((prev) =>
// // //                 prev.map((rec) =>
// // //                   rec.id === selectedRecord.id ? { ...rec, templateType: "" } : rec
// // //                 )
// // //               );
// // //               setSelectedRecord(null);
// // //             }}
// // //              onSuccess={refreshTable} // Add this prop
// // //           />
// // //         )
// // //       ) : (
// // //         <>
// // //           <div style={{ marginBottom: "20px" }}>
// // //             <button
// // //               onClick={onBack}
// // //               style={{
// // //                 padding: "10px 20px",
// // //                 background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// // //                 color: palette.white,
// // //                 borderRadius: "8px",
// // //                 border: "none",
// // //                 cursor: "pointer",
// // //                 fontWeight: "600",
// // //                 fontSize: "14px",
// // //                 display: "inline-flex",
// // //                 alignItems: "center",
// // //                 gap: "8px",
// // //                 boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
// // //                 transition: "all 0.3s ease",
// // //                 position: "relative",
// // //                 overflow: "hidden",
// // //               }}
// // //               onMouseEnter={(e) => {
// // //                 e.currentTarget.style.transform = "translateY(-2px)";
// // //                 e.currentTarget.style.boxShadow = "0 4px 12px rgba(32, 99, 155, 0.3)";
// // //               }}
// // //               onMouseLeave={(e) => {
// // //                 e.currentTarget.style.transform = "translateY(0)";
// // //                 e.currentTarget.style.boxShadow = "0 2px 8px rgba(32, 99, 155, 0.2)";
// // //               }}
// // //             >
// // //               <span style={{ fontSize: "16px" }}>←</span>
// // //               <span>Back to Previous</span>
// // //             </button>
// // //           </div>

// // //           <GenericTableGrid
// // //             data={currentRecords}
// // //             columns={columns}
// // //             filters={filters}
// // //             palette={palette}
// // //             emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
// // //           />

// // //           <div
// // //             style={{
// // //               display: "flex",
// // //               justifyContent: "space-between",
// // //               alignItems: "center",
// // //               padding: "12px 20px",
// // //               fontSize: "14px",
// // //               color: palette.text.secondary,
// // //               borderTop: `1px solid ${palette.border}`,
// // //               marginTop: "16px",
// // //             }}
// // //           >
// // //             <div>
// // //               Showing {indexOfFirst + 1}–{Math.min(indexOfLast, records.length)} of {records.length}
// // //             </div>
// // //             <div style={{ display: "flex", gap: "8px" }}>
// // //               <button
// // //                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
// // //                 disabled={currentPage === 1}
// // //                 style={{
// // //                   padding: "6px 12px",
// // //                   border: `1px solid ${palette.border}`,
// // //                   borderRadius: "6px",
// // //                   background: currentPage === 1 ? "#F3F4F6" : palette.white,
// // //                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
// // //                 }}
// // //               >
// // //                 ‹
// // //               </button>
// // //               <button
// // //                 style={{
// // //                   padding: "6px 12px",
// // //                   border: `1px solid ${palette.primary}`,
// // //                   borderRadius: "6px",
// // //                   background: palette.primary,
// // //                   color: palette.white,
// // //                   fontWeight: "600",
// // //                 }}
// // //               >
// // //                 {currentPage}
// // //               </button>
// // //               <button
// // //                 onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
// // //                 disabled={currentPage === totalPages}
// // //                 style={{
// // //                   padding: "6px 12px",
// // //                   border: `1px solid ${palette.border}`,
// // //                   borderRadius: "6px",
// // //                   background: currentPage === totalPages ? "#F3F4F6" : palette.white,
// // //                   cursor: currentPage === totalPages ? "not-allowed" : "pointer",
// // //                 }}
// // //               >
// // //                 ›
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default OfficeOrderTable;

// // import React, { useState, useEffect } from "react";
// // import GenericTableGrid from "src/components/ui/TableGrid";
// // import EmployeeVisitForm from "./EmployeeVisitForm.js";
// // import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
// // import Cookies from "js-cookie";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import FancyCircularLoader from "src/components/ui/Loader";
// // import { HostName } from "src/assets/host/Host";
// // import Swal from "sweetalert2";

// // const OfficeOrderTable = ({ onBack, order, filter }) => {
// //   const palette = {
// //     primary: "#20639B",
// //     darkBlue: "#173F5F",
// //     teal: "#3CAEA3",
// //     yellow: "#F6D55C",
// //     coral: "#ED553B",
// //     success: "#3CAEA3",
// //     warning: "#F6D55C",
// //     border: "#E2E8F0",
// //     hover: "#F9FAFB",
// //     white: "#FFFFFF",
// //     text: { primary: "#1E293B", secondary: "#64748B" },
// //   };

// //   const [records, setRecords] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [progress, setProgress] = useState(0);
// //   const [dropdownOptions, setDropdownOptions] = useState({});
// //   const [error, setError] = useState("");
// //   const [refreshTrigger, setRefreshTrigger] = useState(0);

// //   const recordsPerPage = 10;

// //   const sessionId = Cookies.get("session_id");
// //   const jwtToken = Cookies.get("HRToken");

// //   const refreshTable = () => {
// //     setRefreshTrigger((prev) => prev + 1);
// //   };

// //   // 🔹 Base table columns
// //   let columns = [
// //     {
// //       key: "id",
// //       label: "Id",
// //       width: "80px",
// //       sortable: true,
// //       type: "number",
// //       align: "left",
// //       render: (item) => (
// //         <div style={{ fontWeight: "600", color: palette.primary }}>
// //           {item.id}
// //         </div>
// //       ),
// //     },
// //     {
// //       key: "employeeid",
// //       label: "Emp Id",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "coverpageno",
// //       label: "CoverPageNo",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "applicant",
// //       label: "Applicant",
// //       width: "200px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => {
// //         const parts = (item.applicant || "").split(" / ");
// //         const name = parts[0] || "--";
// //         const designation = parts[2] || "";
// //         return (
// //           <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
// //             <div style={{ fontWeight: "600" }}>{name}</div>
// //             {designation && (
// //               <div style={{ fontSize: "12px", color: palette.text.secondary }}>
// //                 {designation}
// //               </div>
// //             )}
// //           </div>
// //         );
// //       },
// //     },
// //     {
// //       key: "department",
// //       label: "Department",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //      {
// //       key: "claimtype",
// //       label: "ClaimType",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "status",
// //       label: "Status",
// //       width: "120px",
// //       sortable: true,
// //       align: "center",
     
// //     },
// //   ];

// //   // 🔹 Conditionally add Template Type OR Pending With
// //   if (filter === "ongoing") {
// //     columns.push({
// //       key: "pendingwith",
// //       label: "Pending",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //       render: (item) =>
// //         item.assignedto
// //           ? item.assignedto
// //           : "--",
// //     });
// //   } else {
// //     columns.push({
// //       key: "templateType",
// //       label: "Template Type",
// //       width: "160px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => (
// //         <select
// //           value={item.templateType}
// //           onChange={(e) => {
// //             const selectedValue = e.target.value;
// //             handleTemplateChange(item.id, selectedValue);
// //           }}
// //           onClick={async (e) => {
// //             e.stopPropagation();
// //             if (dropdownOptions[item.id]) return;

// //             try {
// //               const body = {
// //                 employeeid: item.employeeid,
// //                 coverpageno: item.coverpageno,
// //                 token: "HRFGVJISOVp1fncC",
// //                 session_id: sessionId,
// //               };

// //               const resp = await fetch(
// //                 `${HostName}/OfficeOrder_DropdownValuesHandler`,
// //                 {
// //                   method: "POST",
// //                   headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${jwtToken}`,
// //                   },
// //                   body: JSON.stringify(body),
// //                 }
// //               );

// //               const encData = await resp.json();
// //               const decrypted = await decryptData(encData.Data ?? encData.data);
// //               const parsed = validateJsonData(decrypted);

// //               const options =
// //                 parsed?.Data?.Records?.map((rec) => ({
// //                   Id: rec.Id,
// //                   value: rec.dropdown_value,
// //                   label: rec.dropdown_value,
// //                 })) || [];

// //               setDropdownOptions((prev) => ({
// //                 ...prev,
// //                 [item.id]: options,
// //               }));
// //             } catch (err) {
// //               console.error("Dropdown fetch error:", err);
// //             }
// //           }}
// //           style={{
// //             width: "100%",
// //             padding: "6px",
// //             borderRadius: "6px",
// //             border: `1px solid ${palette.border}`,
// //             fontSize: "13px",
// //           }}
// //         >
// //           <option value="">Select</option>
// //           {(dropdownOptions[item.id] || []).map((opt, idx) => (
// //             <option key={idx} value={opt.value}>
// //               {opt.label}
// //             </option>
// //           ))}
// //         </select>
// //       ),
// //     });
// //   }

// //   // 🔹 Always add "Generated Template"
// //   columns.push({
// //     key: "generatedtemplate",
// //     label: "Generated Template",
// //     width: "160px",
// //     sortable: false,
// //     align: "center",
// //     render: () => "--",
// //   });

// //   const filters = [
// //     {
// //       key: "status",
// //       label: "All Status",
// //       options: [
// //         { value: "Approved", label: "Approved" },
// //         { value: "Pending", label: "Pending" },
// //         { value: "Rejected", label: "Rejected" },
// //       ],
// //     },
// //   ];

// //   // 🔹 Fetch Data
// //   useEffect(() => {
// //     const fetchOfficeOrderDetails = async () => {
// //       if (!jwtToken) return;

// //       setLoading(true);
// //       setProgress(0);

// //       try {
// //         const visitDetailsBody = {
// //           employeeid: Cookies.get("EmpId"),
// //           token: "HRFGVJISOVp1fncC",
// //           session_id: sessionId,
// //         };

// //         const visitRes = await fetch(`${HostName}/OfficeOrder_visitdetails`, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(visitDetailsBody),
// //         });

// //         const visitData = await visitRes.json();
// //         const decryptedVisit = await decryptData(
// //           visitData.Data ?? visitData.data
// //         );
// //         const parsedVisit = validateJsonData(decryptedVisit);
// //         const visitRecords = parsedVisit?.Data?.Records ?? [];

// //         const formattedVisit = visitRecords.map((item, idx) => ({
// //           id: item.visit_id || `${idx + 1}`,
// //           employeeid: item.employeeid || "--",
// //           coverpageno: item.coverpageno || "--",
// //           applicant: item.facultyname || item.facultydetails || "--",
// //           designation: item.designation || "--",
// //           department: item.department || "--",
// //           destination: `${item.citytown || ""}, ${item.country || ""}`,
// //           status:  "",
// //           claimtype: item.claimtype || "",
// //           leaveDetails: item.leavedetails || [],
// //           templateType: "",
// //           visitfrom: item.visitfrom,
// //           visitto: item.visitto,
// //           natureOfvisit: item.natureofparticipation_value,
// //           country: item.country,
// //           city: item.citytown,
// //         }));

// //         setRecords(formattedVisit);
// //         setProgress(50);

// //         // If filter applies
// //         if (["saveandhold", "ongoing", "complete"].includes(filter)) {
// //           const taskBody = {
// //             employeeid: Cookies.get("EmpId"),
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //             status: filter,
// //           };

// //           const taskRes = await fetch(
// //             `${HostName}/OfficeOrder_taskvisitdetails`,
// //             {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${jwtToken}`,
// //               },
// //               body: JSON.stringify(taskBody),
// //             }
// //           );

// //           const taskData = await taskRes.json();
// //           const decryptedTask = await decryptData(
// //             taskData.Data ?? taskData.data
// //           );
// //           const parsedTask = validateJsonData(decryptedTask);
// //           const taskRecords = parsedTask?.Data?.Records ?? [];

// //           const formattedTask = taskRecords.map((item, idx) => ({
// //             id: item.visit_id || `${idx + 1}`,
// //             employeeid: item.employeeid || "--",
// //             coverpageno: item.coverpageno || "--",
// //             applicant: item.facultyname || item.facultydetails || "--",
// //             designation: item.designation || "--",
// //             department: item.department || "--",
// //             destination: `${item.citytown || ""}, ${item.country || ""}`,
// //             status:  "",
// //             claimtype: item.claimtype || "",
// //             leaveDetails: item.leavedetails || [],
// //             templateType: "",
// //             visitfrom: item.visitfrom,
// //             visitto: item.visitto,
// //             natureOfvisit: item.natureofparticipation,
// //             country: item.country,
// //             city: item.citytown,
// //             assignedto: item.assignto,
// //             signingauthority: item.signingauthority,
// //           }));

// //           setRecords(formattedTask);
// //         }

// //         setProgress(100);
// //       } catch (error) {
// //         console.error("❌ Error fetching/decrypting:", error);
// //         setRecords([]);
// //         setProgress(100);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOfficeOrderDetails();
// //   }, [jwtToken, sessionId, filter, refreshTrigger]);

// //   // 🔹 Handle Template Type change
// //   const handleTemplateChange = (id, value) => {
// //     const record = records.find((r) => r.id === id);
// //     const selectedOption = dropdownOptions[id]?.find(
// //       (opt) => opt.value === value
// //     );

// //     if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
// //       Swal.fire({
// //         title: "Are you sure?",
// //         text: "The existing data will be deleted. Do you want to proceed?",
// //         icon: "warning",
// //         showCancelButton: true,
// //         confirmButtonColor: "#ED553B",
// //         cancelButtonColor: "#6B7280",
// //         confirmButtonText: "Yes, Delete",
// //         cancelButtonText: "No",
// //       }).then((result) => {
// //         if (result.isConfirmed) {
// //           handleConfirmYes(id, value, record);
// //         } else {
// //           handleConfirmNo(id, record);
// //         }
// //       });
// //       return;
// //     }

// //     setRecords((prev) =>
// //       prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
// //     );

// //     if (value) {
// //       setSelectedRecord({ ...record, templateType: value });
// //     }
// //   };

// //   const handleConfirmYes = async (id, value, record) => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       if (!sessionId) throw new Error("Session ID missing.");

// //       const statusResponse = await fetch(
// //         "https://wftest1.iitm.ac.in:7000/Statusmasternew",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify({
// //             statusdescription: "Deleted",
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //           }),
// //         }
// //       );

// //       if (!statusResponse.ok) throw new Error("Failed to fetch status");

// //       const encryptedStatus = await statusResponse.json();
// //       const decryptedString = await decryptData(
// //         encryptedStatus.Data ?? encryptedStatus.data
// //       );
// //       const validStatusData = validateJsonData(decryptedString);

// //       const deletedStatusId =
// //         validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

// //       const reqpayload = {
// //         token: "HRFGVJISOVp1fncC",
// //         session_id: sessionId,
// //         p_coverpageno: record.coverpageno,
// //         p_employeeid: record.employeeid,
// //         p_taskstatusid: String(deletedStatusId),
// //         p_updatedby: "DELETEBYUSER",
// //         p_updatedon: new Date().toISOString(),
// //       };

// //       const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify(reqpayload),
// //       });

// //       if (!response.ok) throw new Error("Failed to update Office Order");

// //       await response.json();

// //       Swal.fire({
// //         icon: "success",
// //         title: "Deleted!",
// //         text: "Previous data has been removed. Opening a new form...",
// //         timer: 1500,
// //         showConfirmButton: false,
// //       });

// //       refreshTable();

// //       setTimeout(() => {
// //         setSelectedRecord({ ...record, templateType: value });
// //       }, 1500);
// //     } catch (error) {
// //       console.error("Error in confirm YES:", error);
// //       Swal.fire("Error", "Something went wrong!", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleConfirmNo = (id, record) => {
// //     setRecords((prev) =>
// //       prev.map((rec) =>
// //         rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
// //       )
// //     );
// //     setSelectedRecord({ ...record, templateType: "Continue Editing" });

// //     Swal.fire({
// //       icon: "info",
// //       title: "Cancelled",
// //       text: "You can continue editing your existing data.",
// //       timer: 1500,
// //       showConfirmButton: false,
// //     });
// //   };

// //   const indexOfLast = currentPage * recordsPerPage;
// //   const indexOfFirst = indexOfLast - recordsPerPage;
// //   const currentRecords = records.slice(indexOfFirst, indexOfLast);
// //   const totalPages = Math.ceil(records.length / recordsPerPage);

// //   return (
// //     <div>
// //       {loading ? (
// //         <div
// //           style={{
// //             display: "flex",
// //             flexDirection: "column",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             height: "400px",
// //             gap: "20px",
// //             color: palette.primary,
// //             fontSize: "18px",
// //           }}
// //         >
// //           <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
// //         </div>
// //       ) : selectedRecord ? (
// //         selectedRecord.templateType === "Continue Editing" ? (
// //           <SaveandHold
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         ) : (
// //           <EmployeeVisitForm
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         )
// //       ) : (
// //         <>
// //           <div style={{ marginBottom: "20px" }}>
// //             <button
// //               onClick={onBack}
// //               style={{
// //                 padding: "10px 20px",
// //                 background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// //                 color: palette.white,
// //                 borderRadius: "8px",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 fontWeight: "600",
// //                 fontSize: "14px",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "8px",
// //                 boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
// //                 transition: "all 0.3s ease",
// //               }}
// //             >
// //               <span style={{ fontSize: "16px" }}>←</span>
// //               <span>Back to Previous</span>
// //             </button>
// //           </div>

// //           <GenericTableGrid
// //             data={currentRecords}
// //             columns={columns}
// //             filters={filters}
// //             palette={palette}
// //             emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
// //           />

// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               padding: "12px 20px",
// //               fontSize: "14px",
// //               color: palette.text.secondary,
// //               borderTop: `1px solid ${palette.border}`,
// //               background: palette.white,
// //               marginTop: "10px",
// //               borderRadius: "0 0 12px 12px",
// //             }}
// //           >
// //             <span>
// //               Showing {indexOfFirst + 1}–{Math.min(indexOfLast, records.length)}{" "}
// //               of {records.length}
// //             </span>
// //             <div style={{ display: "flex", gap: "8px" }}>
// //               <button
// //                 disabled={currentPage === 1}
// //                 onClick={() => setCurrentPage((p) => p - 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
// //                   opacity: currentPage === 1 ? 0.5 : 1,
// //                 }}
// //               >
// //                 Prev
// //               </button>
// //               <span>
// //                 Page {currentPage} / {totalPages}
// //               </span>
// //               <button
// //                 disabled={currentPage === totalPages}
// //                 onClick={() => setCurrentPage((p) => p + 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor:
// //                     currentPage === totalPages ? "not-allowed" : "pointer",
// //                   opacity: currentPage === totalPages ? 0.5 : 1,
// //                 }}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default OfficeOrderTable;




// // 15/10/2025


// // import React, { useState, useEffect } from "react";
// // import GenericTableGrid from "src/components/ui/TableGrid";
// // import EmployeeVisitForm from "./EmployeeVisitForm.js";
// // import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
// // import Cookies from "js-cookie";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import FancyCircularLoader from "src/components/ui/Loader";
// // import { HostName } from "src/assets/host/Host";
// // import Swal from "sweetalert2";

// // const OfficeOrderTable = ({ onBack, order, filter }) => {
// //   const palette = {
// //     primary: "#20639B",
// //     darkBlue: "#173F5F",
// //     teal: "#3CAEA3",
// //     yellow: "#F6D55C",
// //     coral: "#ED553B",
// //     success: "#3CAEA3",
// //     warning: "#F6D55C",
// //     border: "#E2E8F0",
// //     hover: "#F9FAFB",
// //     white: "#FFFFFF",
// //     text: { primary: "#1E293B", secondary: "#64748B" },
// //   };

// //   const [records, setRecords] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [progress, setProgress] = useState(0);
// //   const [dropdownOptions, setDropdownOptions] = useState({});
// //   const [error, setError] = useState("");
// //   const [refreshTrigger, setRefreshTrigger] = useState(0);

// //   const recordsPerPage = 10;

// //   const sessionId = Cookies.get("session_id");
// //   const jwtToken = Cookies.get("HRToken");

// //   const refreshTable = () => {
// //     setRefreshTrigger((prev) => prev + 1);
// //   };

// //   // 🔹 Base table columns
// //   let columns = [
// //     {
// //       key: "id",
// //       label: "Id",
// //       width: "80px",
// //       sortable: true,
// //       type: "number",
// //       align: "left",
// //       render: (item) => (
// //         <div style={{ fontWeight: "600", color: palette.primary }}>
// //           {item.id}
// //         </div>
// //       ),
// //     },
// //     {
// //       key: "employeeid",
// //       label: "Emp Id",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "coverpageno",
// //       label: "CoverPageNo",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "applicant",
// //       label: "Applicant",
// //       width: "200px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => {
// //         const parts = (item.applicant || "").split(" / ");
// //         const name = parts[0] || "--";
// //         const designation = parts[2] || "";
// //         return (
// //           <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
// //             <div style={{ fontWeight: "600" }}>{name}</div>
// //             {designation && (
// //               <div style={{ fontSize: "12px", color: palette.text.secondary }}>
// //                 {designation}
// //               </div>
// //             )}
// //           </div>
// //         );
// //       },
// //     },
// //     {
// //       key: "department",
// //       label: "Department",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //      {
// //       key: "claimtype",
// //       label: "ClaimType",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "status",
// //       label: "Status",
// //       width: "120px",
// //       sortable: true,
// //       align: "center",
     
// //     },
// //   ];

// //   // 🔹 Conditionally add Template Type OR Pending With
// //   if (filter === "ongoing") {
// //     columns.push({
// //       key: "pendingwith",
// //       label: "Pending",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //       render: (item) =>
// //         item.assignedto
// //           ? item.assignedto
// //           : "--",
// //     });
// //   } else {
// //     columns.push({
// //       key: "templateType",
// //       label: "Template Type",
// //       width: "160px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => (
// //         <select
// //           value={item.templateType}
// //           onChange={(e) => {
// //             const selectedValue = e.target.value;
// //             handleTemplateChange(item.id, selectedValue);
// //           }}
// //           onClick={async (e) => {
// //             e.stopPropagation();
// //             if (dropdownOptions[item.id]) return;

// //             try {
// //               const body = {
// //                 employeeid: item.employeeid,
// //                 coverpageno: item.coverpageno,
// //                 token: "HRFGVJISOVp1fncC",
// //                 session_id: sessionId,
// //               };

// //               const resp = await fetch(
// //                 `${HostName}/OfficeOrder_DropdownValuesHandler`,
// //                 {
// //                   method: "POST",
// //                   headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${jwtToken}`,
// //                   },
// //                   body: JSON.stringify(body),
// //                 }
// //               );

// //               const encData = await resp.json();
// //               const decrypted = await decryptData(encData.Data ?? encData.data);
// //               const parsed = validateJsonData(decrypted);

// //               const options =
// //                 parsed?.Data?.Records?.map((rec) => ({
// //                   Id: rec.Id,
// //                   value: rec.dropdown_value,
// //                   label: rec.dropdown_value,
// //                 })) || [];

// //               setDropdownOptions((prev) => ({
// //                 ...prev,
// //                 [item.id]: options,
// //               }));
// //             } catch (err) {
// //               console.error("Dropdown fetch error:", err);
// //             }
// //           }}
// //           style={{
// //             width: "100%",
// //             padding: "6px",
// //             borderRadius: "6px",
// //             border: `1px solid ${palette.border}`,
// //             fontSize: "13px",
// //           }}
// //         >
// //           <option value="">Select</option>
// //           {(dropdownOptions[item.id] || []).map((opt, idx) => (
// //             <option key={idx} value={opt.value}>
// //               {opt.label}
// //             </option>
// //           ))}
// //         </select>
// //       ),
// //     });
// //   }

// //   // 🔹 Always add "Generated Template"
// //   columns.push({
// //     key: "generatedtemplate",
// //     label: "Generated Template",
// //     width: "160px",
// //     sortable: false,
// //     align: "center",
// //     render: () => "--",
// //   });

// //   const filters = [
// //     {
// //       key: "status",
// //       label: "All Status",
// //       options: [
// //         { value: "Approved", label: "Approved" },
// //         { value: "Pending", label: "Pending" },
// //         { value: "Rejected", label: "Rejected" },
// //       ],
// //     },
// //   ];

// //   // 🔹 Fetch Data
// //   useEffect(() => {
// //     const fetchOfficeOrderDetails = async () => {
// //       if (!jwtToken) return;

// //       setLoading(true);
// //       setProgress(0);

// //       try {
// //         const visitDetailsBody = {
// //           employeeid: Cookies.get("EmpId"),
// //           token: "HRFGVJISOVp1fncC",
// //           session_id: sessionId,
// //         };

// //         const visitRes = await fetch(`${HostName}/OfficeOrder_visitdetails`, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(visitDetailsBody),
// //         });

// //         const visitData = await visitRes.json();
// //         const decryptedVisit = await decryptData(
// //           visitData.Data ?? visitData.data
// //         );
// //         const parsedVisit = validateJsonData(decryptedVisit);
// //         const visitRecords = parsedVisit?.Data?.Records ?? [];

// //         const formattedVisit = visitRecords.map((item, idx) => ({
// //           id: item.visit_id || `${idx + 1}`,
// //           employeeid: item.employeeid || "--",
// //           coverpageno: item.coverpageno || "--",
// //           applicant: item.facultyname || item.facultydetails || "--",
// //           designation: item.designation || "--",
// //           department: item.department || "--",
// //           destination: `${item.citytown || ""}, ${item.country || ""}`,
// //           status:  "",
// //           claimtype: item.claimtype || "",
// //           leaveDetails: item.leavedetails || [],
// //           templateType: "",
// //           visitfrom: item.visitfrom,
// //           visitto: item.visitto,
// //           natureOfvisit: item.natureofparticipation_value,
// //           country: item.country,
// //           city: item.citytown,
// //         }));

// //         setRecords(formattedVisit);
// //         setProgress(50);

// //         // If filter applies
// //         if (["saveandhold", "ongoing", "complete"].includes(filter)) {
// //           const taskBody = {
// //             employeeid: Cookies.get("EmpId"),
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //             status: filter,
// //           };

// //           const taskRes = await fetch(
// //             `${HostName}/OfficeOrder_taskvisitdetails`,
// //             {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${jwtToken}`,
// //               },
// //               body: JSON.stringify(taskBody),
// //             }
// //           );

// //           const taskData = await taskRes.json();
// //           const decryptedTask = await decryptData(
// //             taskData.Data ?? taskData.data
// //           );
// //           const parsedTask = validateJsonData(decryptedTask);
// //           const taskRecords = parsedTask?.Data?.Records ?? [];

// //           const formattedTask = taskRecords.map((item, idx) => ({
// //             id: item.visit_id || `${idx + 1}`,
// //             employeeid: item.employeeid || "--",
// //             coverpageno: item.coverpageno || "--",
// //             applicant: item.facultyname || item.facultydetails || "--",
// //             designation: item.designation || "--",
// //             department: item.department || "--",
// //             destination: `${item.citytown || ""}, ${item.country || ""}`,
// //             status:  "",
// //             claimtype: item.claimtype || "",
// //             leaveDetails: item.leavedetails || [],
// //             templateType: "",
// //             visitfrom: item.visitfrom,
// //             visitto: item.visitto,
// //             natureOfvisit: item.natureofparticipation,
// //             country: item.country,
// //             city: item.citytown,
// //             assignedto: item.assignto,
// //             signingauthority: item.signingauthority,
// //           }));

// //           setRecords(formattedTask);
// //         }

// //         setProgress(100);
// //       } catch (error) {
// //         console.error("❌ Error fetching/decrypting:", error);
// //         setRecords([]);
// //         setProgress(100);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOfficeOrderDetails();
// //   }, [jwtToken, sessionId, filter, refreshTrigger]);

// //   // 🔹 Handle Template Type change
// //   const handleTemplateChange = (id, value) => {
// //     const record = records.find((r) => r.id === id);
// //     const selectedOption = dropdownOptions[id]?.find(
// //       (opt) => opt.value === value
// //     );

// //     if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
// //       Swal.fire({
// //         title: "Are you sure?",
// //         text: "The existing data will be deleted. Do you want to proceed?",
// //         icon: "warning",
// //         showCancelButton: true,
// //         confirmButtonColor: "#ED553B",
// //         cancelButtonColor: "#6B7280",
// //         confirmButtonText: "Yes, Delete",
// //         cancelButtonText: "No",
// //       }).then((result) => {
// //         if (result.isConfirmed) {
// //           handleConfirmYes(id, value, record);
// //         } else {
// //           handleConfirmNo(id, record);
// //         }
// //       });
// //       return;
// //     }

// //     setRecords((prev) =>
// //       prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
// //     );

// //     if (value) {
// //       setSelectedRecord({ ...record, templateType: value });
// //     }
// //   };

// //   const handleConfirmYes = async (id, value, record) => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       if (!sessionId) throw new Error("Session ID missing.");

// //       const statusResponse = await fetch(
// //         "https://wftest1.iitm.ac.in:7000/Statusmasternew",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify({
// //             statusdescription: "Deleted",
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //           }),
// //         }
// //       );

// //       if (!statusResponse.ok) throw new Error("Failed to fetch status");

// //       const encryptedStatus = await statusResponse.json();
// //       const decryptedString = await decryptData(
// //         encryptedStatus.Data ?? encryptedStatus.data
// //       );
// //       const validStatusData = validateJsonData(decryptedString);

// //       const deletedStatusId =
// //         validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

// //       const reqpayload = {
// //         token: "HRFGVJISOVp1fncC",
// //         session_id: sessionId,
// //         p_coverpageno: record.coverpageno,
// //         p_employeeid: record.employeeid,
// //         p_taskstatusid: String(deletedStatusId),
// //         p_updatedby: "DELETEBYUSER",
// //         p_updatedon: new Date().toISOString(),
// //       };

// //       const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify(reqpayload),
// //       });

// //       if (!response.ok) throw new Error("Failed to update Office Order");

// //       await response.json();

// //       Swal.fire({
// //         icon: "success",
// //         title: "Deleted!",
// //         text: "Previous data has been removed. Opening a new form...",
// //         timer: 1500,
// //         showConfirmButton: false,
// //       });

// //       refreshTable();

// //       setTimeout(() => {
// //         setSelectedRecord({ ...record, templateType: value });
// //       }, 1500);
// //     } catch (error) {
// //       console.error("Error in confirm YES:", error);
// //       Swal.fire("Error", "Something went wrong!", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleConfirmNo = (id, record) => {
// //     setRecords((prev) =>
// //       prev.map((rec) =>
// //         rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
// //       )
// //     );
// //     setSelectedRecord({ ...record, templateType: "Continue Editing" });

// //     Swal.fire({
// //       icon: "info",
// //       title: "Cancelled",
// //       text: "You can continue editing your existing data.",
// //       timer: 1500,
// //       showConfirmButton: false,
// //     });
// //   };

// //   const indexOfLast = currentPage * recordsPerPage;
// //   const indexOfFirst = indexOfLast - recordsPerPage;
// //   const currentRecords = records.slice(indexOfFirst, indexOfLast);
// //   const totalPages = Math.ceil(records.length / recordsPerPage);

// //   return (
// //     <div style={{ width: "100%" }}> {/* The main container of the component, should be 100% of its parent */}
// //       {loading ? (
// //         <div
// //           style={{
// //             display: "flex",
// //             flexDirection: "column",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             height: "400px",
// //             gap: "20px",
// //             color: palette.primary,
// //             fontSize: "18px",
// //           }}
// //         >
// //           <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
// //         </div>
// //       ) : selectedRecord ? (
// //         selectedRecord.templateType === "Continue Editing" ? (
// //           <SaveandHold
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         ) : (
// //           <EmployeeVisitForm
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         )
// //       ) : (
// //         // The container for the table view (back button, GenericTableGrid, pagination)
// //         <div style={{ width: '100%', minWidth: '1400px' }}> {/* MODIFIED: Ensures a minimum width of 1400px */}
// //           <div style={{ marginBottom: "20px" }}>
// //             <button
// //               onClick={onBack}
// //               style={{
// //                 padding: "10px 20px",
// //                 background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// //                 color: palette.white,
// //                 borderRadius: "8px",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 fontWeight: "600",
// //                 fontSize: "14px",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "8px",
// //                 boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
// //                 transition: "all 0.3s ease",
// //               }}
// //             >
// //               <span style={{ fontSize: "16px" }}>←</span>
// //               <span>Back to Previous</span>
// //             </button>
// //           </div>

// //           <GenericTableGrid
// //             data={currentRecords}
// //             columns={columns}
// //             filters={filters}
// //             palette={palette}
// //             emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
// //           />

// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               padding: "12px 20px",
// //               fontSize: "14px",
// //               color: palette.text.secondary,
// //               borderTop: `1px solid ${palette.border}`,
// //               background: palette.white,
// //               marginTop: "10px",
// //               borderRadius: "0 0 12px 12px",
// //             }}
// //           >
// //             <span>
// //               Showing {indexOfFirst + 1}–{Math.min(indexOfLast, records.length)}{" "}
// //               of {records.length}
// //             </span>
// //             <div style={{ display: "flex", gap: "8px" }}>
// //               <button
// //                 disabled={currentPage === 1}
// //                 onClick={() => setCurrentPage((p) => p - 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
// //                   opacity: currentPage === 1 ? 0.5 : 1,
// //                 }}
// //               >
// //                 Prev
// //               </button>
// //               <span>
// //                 Page {currentPage} / {totalPages}
// //               </span>
// //               <button
// //                 disabled={currentPage === totalPages}
// //                 onClick={() => setCurrentPage((p) => p + 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor:
// //                     currentPage === totalPages ? "not-allowed" : "pointer",
// //                   opacity: currentPage === totalPages ? 0.5 : 1,
// //                 }}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OfficeOrderTable;


// // import React, { useState, useEffect } from "react";
// // import GenericTableGrid from "src/components/ui/TableGrid";
// // import EmployeeVisitForm from "./EmployeeVisitForm.js";
// // import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
// // import Cookies from "js-cookie";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import FancyCircularLoader from "src/components/ui/Loader";
// // import { HostName } from "src/assets/host/Host";
// // import Swal from "sweetalert2";

// // const OfficeOrderTable = ({ onBack, order, filter }) => {
// //   const palette = {
// //     primary: "#20639B",
// //     darkBlue: "#173F5F",
// //     teal: "#3CAEA3",
// //     yellow: "#F6D55C",
// //     coral: "#ED553B",
// //     success: "#3CAEA3",
// //     warning: "#F6D55C",
// //     border: "#E2E8F0",
// //     hover: "#F9FAFB",
// //     white: "#FFFFFF",
// //     text: { primary: "#1E293B", secondary: "#64748B" },
// //   };

// //   const [records, setRecords] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [progress, setProgress] = useState(0);
// //   const [dropdownOptions, setDropdownOptions] = useState({});
// //   const [error, setError] = useState("");
// //   const [refreshTrigger, setRefreshTrigger] = useState(0);
  
// //   // 🔹 NEW STATE FOR PDF VIEWER
// //   const [pdfUrl, setPdfUrl] = useState(null);
// //   const [generating, setGenerating] = useState(false);

// //   const recordsPerPage = 10;

// //   const sessionId = Cookies.get("session_id");
// //   const jwtToken = Cookies.get("HRToken");

// //   const refreshTable = () => {
// //     setRefreshTrigger((prev) => prev + 1);
// //   };

// //   // 🔹 Helper function to convert base64 to Blob
// //   const base64ToBlob = (base64, mimeType) => {
// //     const byteCharacters = atob(base64);
// //     const byteNumbers = new Array(byteCharacters.length);
// //     for (let i = 0; i < byteCharacters.length; i++) {
// //       byteNumbers[i] = byteCharacters.charCodeAt(i);
// //     }
// //     const byteArray = new Uint8Array(byteNumbers);
// //     return new Blob([byteArray], { type: mimeType });
// //   };

// //   // 🔹 Function to fetch and display PDF
// //   const handleViewPDF = async (employeeid, coverpageno, templatetype) => {
// //     try {
// //       setGenerating(true);
// //       setError("");
// //       setPdfUrl(null);

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");

// //       // ✅ Request body uses correct templatetype
// //       const requestBody = {
// //         employeeid: employeeid,
// //         coverpageno: coverpageno,
// //         templatetype: templatetype,
// //       };

// //       const response = await fetch(
// //         "https://wftest1.iitm.ac.in:8080/api/officeorder/pdf",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(requestBody),
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(
// //           `Failed to fetch PDF: ${response.status} ${response.statusText}`
// //         );
// //       }

// //       const contentType = response.headers.get("content-type");
// //       let pdfObjectUrl = null;

// //       if (contentType && contentType.includes("application/pdf")) {
// //         const pdfBlob = await response.blob();
// //         if (pdfBlob.size === 0) {
// //           throw new Error("No PDF found.");
// //         }
// //         pdfObjectUrl = URL.createObjectURL(pdfBlob);
// //       } else if (contentType && contentType.includes("application/json")) {
// //         const responseData = await response.json();

// //         if (responseData.pdf_data || responseData.pdf_base64) {
// //           const pdfBase64 = responseData.pdf_data || responseData.pdf_base64;
// //           const base64Data = pdfBase64.replace(
// //             /^data:application\/pdf;base64,/,
// //             ""
// //           );

// //           if (!base64Data || base64Data.trim() === "") {
// //             throw new Error("No PDF found.");
// //           }

// //           const pdfBlob = base64ToBlob(base64Data, "application/pdf");
// //           pdfObjectUrl = URL.createObjectURL(pdfBlob);
// //         } else {
// //           throw new Error("No PDF found.");
// //         }
// //       } else {
// //         throw new Error("No PDF found. Received content type: " + contentType);
// //       }

// //       if (pdfObjectUrl) {
// //         setPdfUrl(pdfObjectUrl);
// //       } else {
// //         throw new Error("Failed to generate PDF URL.");
// //       }
// //     } catch (err) {
// //       console.error("PDF fetch error:", err);
// //       Swal.fire({
// //         icon: "error",
// //         title: "PDF Error",
// //         text: err.message || "Failed to load PDF.",
// //       });
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   // 🔹 Base table columns
// //   let columns = [
// //     {
// //       key: "id",
// //       label: "Id",
// //       width: "80px",
// //       sortable: true,
// //       type: "number",
// //       align: "left",
// //       render: (item) => (
// //         <div style={{ fontWeight: "600", color: palette.primary }}>
// //           {item.id}
// //         </div>
// //       ),
// //     },
// //     {
// //       key: "employeeid",
// //       label: "Emp Id",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "coverpageno",
// //       label: "CoverPageNo",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "applicant",
// //       label: "Applicant",
// //       width: "200px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => {
// //         const parts = (item.applicant || "").split(" / ");
// //         const name = parts[0] || "--";
// //         const designation = parts[2] || "";
// //         return (
// //           <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
// //             <div style={{ fontWeight: "600" }}>{name}</div>
// //             {designation && (
// //               <div style={{ fontSize: "12px", color: palette.text.secondary }}>
// //                 {designation}
// //               </div>
// //             )}
// //           </div>
// //         );
// //       },
// //     },
// //     {
// //       key: "department",
// //       label: "Department",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //      {
// //       key: "claimtype",
// //       label: "ClaimType",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "status",
// //       label: "Status",
// //       width: "120px",
// //       sortable: true,
// //       align: "center",
     
// //     },
// //   ];

// //   // 🔹 Conditionally add Template Type OR Pending With
// //   if (filter === "ongoing") {
// //     columns.push({
// //       key: "pendingwith",
// //       label: "Pending",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //       render: (item) =>
// //         item.assignedto
// //           ? item.assignedto
// //           : "--",
// //     });
// //   } else {
// //     columns.push({
// //       key: "templateType",
// //       label: "Template Type",
// //       width: "160px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => (
// //         <select
// //           value={item.templateType}
// //           onChange={(e) => {
// //             const selectedValue = e.target.value;
// //             handleTemplateChange(item.id, selectedValue);
// //           }}
// //           onClick={async (e) => {
// //             e.stopPropagation();
// //             if (dropdownOptions[item.id]) return;

// //             try {
// //               const body = {
// //                 employeeid: item.employeeid,
// //                 coverpageno: item.coverpageno,
// //                 token: "HRFGVJISOVp1fncC",
// //                 session_id: sessionId,
// //               };

// //               const resp = await fetch(
// //                 `${HostName}/OfficeOrder_DropdownValuesHandler`,
// //                 {
// //                   method: "POST",
// //                   headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${jwtToken}`,
// //                   },
// //                   body: JSON.stringify(body),
// //                 }
// //               );

// //               const encData = await resp.json();
// //               const decrypted = await decryptData(encData.Data ?? encData.data);
// //               const parsed = validateJsonData(decrypted);

// //               const options =
// //                 parsed?.Data?.Records?.map((rec) => ({
// //                   Id: rec.Id,
// //                   value: rec.dropdown_value,
// //                   label: rec.dropdown_value,
// //                 })) || [];

// //               setDropdownOptions((prev) => ({
// //                 ...prev,
// //                 [item.id]: options,
// //               }));
// //             } catch (err) {
// //               console.error("Dropdown fetch error:", err);
// //             }
// //           }}
// //           style={{
// //             width: "100%",
// //             padding: "6px",
// //             borderRadius: "6px",
// //             border: `1px solid ${palette.border}`,
// //             fontSize: "13px",
// //           }}
// //         >
// //           <option value="">Select</option>
// //           {(dropdownOptions[item.id] || []).map((opt, idx) => (
// //             <option key={idx} value={opt.value}>
// //               {opt.label}
// //             </option>
// //           ))}
// //         </select>
// //       ),
// //     });
// //   }

// //   // 🔹 Update: Always add "Generated Template" with conditional rendering for 'complete' filter
// //   columns.push({
// //     key: "generatedtemplate",
// //     label: "Generated Template",
// //     width: "160px",
// //     sortable: false,
// //     align: "center",
// //     render: (item) => {
// //       if (filter === "complete") {
// //         return (
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "center",
// //               gap: "15px",
// //               alignItems: "center",
// //             }}
// //           >
// //             {/* Office Order Icon */}
// //             <button
// //               onClick={() =>
// //                 handleViewPDF(
// //                   item.employeeid,
// //                   item.coverpageno,
// //                   "officecopy" // Payload value for Office Order
// //                 )
// //               }
// //               style={{
// //                 background: "none",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 padding: "5px",
// //                 color: palette.primary,
// //                 display: "flex",
// //                 alignItems: "center",
// //                 gap: "4px",
// //                 fontSize: "18px",
// //                 opacity: generating ? 0.6 : 1,
// //               }}
// //               title="View Office Order Copy"
// //               disabled={generating}
// //             >
// //               📄 <span style={{ fontSize: "12px" }}>OO</span>
// //             </button>
// //             {/* User Order Icon */}
// //             <button
// //               onClick={() =>
// //                 handleViewPDF(item.employeeid, item.coverpageno, "usercopy") // Payload value for User Order
// //               }
// //               style={{
// //                 background: "none",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 padding: "5px",
// //                 color: palette.teal,
// //                 display: "flex",
// //                 alignItems: "center",
// //                 gap: "4px",
// //                 fontSize: "18px",
// //                 opacity: generating ? 0.6 : 1,
// //               }}
// //               title="View User Copy"
// //               disabled={generating}
// //             >
// //               👤 <span style={{ fontSize: "12px" }}>UC</span>
// //             </button>
// //             {generating && (
// //                 <span style={{ fontSize: "12px", color: palette.text.secondary }}>
// //                   Loading...
// //                 </span>
// //             )}
// //           </div>
// //         );
// //       }
// //       return "--";
// //     },
// //   });

// //   const filters = [
// //     {
// //       key: "status",
// //       label: "All Status",
// //       options: [
// //         { value: "Approved", label: "Approved" },
// //         { value: "Pending", label: "Pending" },
// //         { value: "Rejected", label: "Rejected" },
// //       ],
// //     },
// //   ];

// //   // 🔹 Fetch Data (omitted for brevity, as it was not modified significantly)
// //   useEffect(() => {
// //     // ... (Keep the existing useEffect logic)
// //     const fetchOfficeOrderDetails = async () => {
// //       if (!jwtToken) return;

// //       setLoading(true);
// //       setProgress(0);

// //       try {
// //         const visitDetailsBody = {
// //           employeeid: Cookies.get("EmpId"),
// //           token: "HRFGVJISOVp1fncC",
// //           session_id: sessionId,
// //         };

// //         // --- Fetch visit details
// //         const visitRes = await fetch(`${HostName}/OfficeOrder_visitdetails`, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(visitDetailsBody),
// //         });

// //         const visitData = await visitRes.json();
// //         const decryptedVisit = await decryptData(
// //           visitData.Data ?? visitData.data
// //         );
// //         const parsedVisit = validateJsonData(decryptedVisit);
// //         const visitRecords = parsedVisit?.Data?.Records ?? [];

// //         const formattedVisit = visitRecords.map((item, idx) => ({
// //           id: item.visit_id || `${idx + 1}`,
// //           employeeid: item.employeeid || "--",
// //           coverpageno: item.coverpageno || "--",
// //           applicant: item.facultyname || item.facultydetails || "--",
// //           designation: item.designation || "--",
// //           department: item.department || "--",
// //           destination: `${item.citytown || ""}, ${item.country || ""}`,
// //           status:  "",
// //           claimtype: item.claimtype || "",
// //           leaveDetails: item.leavedetails || [],
// //           templateType: "",
// //           visitfrom: item.visitfrom,
// //           visitto: item.visitto,
// //           natureOfvisit: item.natureofparticipation_value,
// //           country: item.country,
// //           city: item.citytown,
// //         }));

// //         setRecords(formattedVisit);
// //         setProgress(50);

// //         // --- If filter applies (saveandhold, ongoing, complete)
// //         if (["saveandhold", "ongoing", "complete"].includes(filter)) {
// //           const taskBody = {
// //             employeeid: Cookies.get("EmpId"),
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //             status: filter,
// //           };

// //           const taskRes = await fetch(
// //             `${HostName}/OfficeOrder_taskvisitdetails`,
// //             {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${jwtToken}`,
// //               },
// //               body: JSON.stringify(taskBody),
// //             }
// //           );

// //           const taskData = await taskRes.json();
// //           const decryptedTask = await decryptData(
// //             taskData.Data ?? taskData.data
// //           );
// //           const parsedTask = validateJsonData(decryptedTask);
// //           const taskRecords = parsedTask?.Data?.Records ?? [];

// //           const formattedTask = taskRecords.map((item, idx) => ({
// //             id: item.visit_id || `${idx + 1}`,
// //             employeeid: item.employeeid || "--",
// //             coverpageno: item.coverpageno || "--",
// //             applicant: item.facultyname || item.facultydetails || "--",
// //             designation: item.designation || "--",
// //             department: item.department || "--",
// //             destination: `${item.citytown || ""}, ${item.country || ""}`,
// //             status:  "",
// //             claimtype: item.claimtype || "",
// //             leaveDetails: item.leavedetails || [],
// //             templateType: "",
// //             visitfrom: item.visitfrom,
// //             visitto: item.visitto,
// //             natureOfvisit: item.natureofparticipation,
// //             country: item.country,
// //             city: item.citytown,
// //             assignedto: item.assignto,
// //             signingauthority: item.signingauthority,
// //           }));

// //           setRecords(formattedTask);
// //         }

// //         setProgress(100);
// //       } catch (error) {
// //         console.error("❌ Error fetching/decrypting:", error);
// //         setRecords([]);
// //         setProgress(100);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOfficeOrderDetails();
// //   }, [jwtToken, sessionId, filter, refreshTrigger]);
// //   // 🔹 End of useEffect

// //   // 🔹 Handle Template Type change (omitted for brevity)
// //   const handleTemplateChange = (id, value) => {
// //     const record = records.find((r) => r.id === id);
// //     const selectedOption = dropdownOptions[id]?.find(
// //       (opt) => opt.value === value
// //     );

// //     if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
// //       Swal.fire({
// //         title: "Are you sure?",
// //         text: "The existing data will be deleted. Do you want to proceed?",
// //         icon: "warning",
// //         showCancelButton: true,
// //         confirmButtonColor: "#ED553B",
// //         cancelButtonColor: "#6B7280",
// //         confirmButtonText: "Yes, Delete",
// //         cancelButtonText: "No",
// //       }).then((result) => {
// //         if (result.isConfirmed) {
// //           handleConfirmYes(id, value, record);
// //         } else {
// //           handleConfirmNo(id, record);
// //         }
// //       });
// //       return;
// //     }

// //     setRecords((prev) =>
// //       prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
// //     );

// //     if (value) {
// //       setSelectedRecord({ ...record, templateType: value });
// //     }
// //   };

// //   const handleConfirmYes = async (id, value, record) => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       if (!sessionId) throw new Error("Session ID missing.");

// //       const statusResponse = await fetch(
// //         "https://wftest1.iitm.ac.in:7000/Statusmasternew",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify({
// //             statusdescription: "Deleted",
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //           }),
// //         }
// //       );

// //       if (!statusResponse.ok) throw new Error("Failed to fetch status");

// //       const encryptedStatus = await statusResponse.json();
// //       const decryptedString = await decryptData(
// //         encryptedStatus.Data ?? encryptedStatus.data
// //       );
// //       const validStatusData = validateJsonData(decryptedString);

// //       const deletedStatusId =
// //         validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

// //       const reqpayload = {
// //         token: "HRFGVJISOVp1fncC",
// //         session_id: sessionId,
// //         p_coverpageno: record.coverpageno,
// //         p_employeeid: record.employeeid,
// //         p_taskstatusid: String(deletedStatusId),
// //         p_updatedby: "DELETEBYUSER",
// //         p_updatedon: new Date().toISOString(),
// //       };

// //       const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify(reqpayload),
// //       });

// //       if (!response.ok) throw new Error("Failed to update Office Order");

// //       await response.json();

// //       Swal.fire({
// //         icon: "success",
// //         title: "Deleted!",
// //         text: "Previous data has been removed. Opening a new form...",
// //         timer: 1500,
// //         showConfirmButton: false,
// //       });

// //       refreshTable();

// //       setTimeout(() => {
// //         setSelectedRecord({ ...record, templateType: value });
// //       }, 1500);
// //     } catch (error) {
// //       console.error("Error in confirm YES:", error);
// //       Swal.fire("Error", "Something went wrong!", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleConfirmNo = (id, record) => {
// //     setRecords((prev) =>
// //       prev.map((rec) =>
// //         rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
// //       )
// //     );
// //     setSelectedRecord({ ...record, templateType: "Continue Editing" });

// //     Swal.fire({
// //       icon: "info",
// //       title: "Cancelled",
// //       text: "You can continue editing your existing data.",
// //       timer: 1500,
// //       showConfirmButton: false,
// //     });
// //   };
// //   // 🔹 End of handlers

// //   const indexOfLast = currentPage * recordsPerPage;
// //   const indexOfFirst = indexOfLast - recordsPerPage;
// //   const currentRecords = records.slice(indexOfFirst, indexOfLast);
// //   const totalPages = Math.ceil(records.length / recordsPerPage);

// //   return (
// //     <div style={{ width: "100%" }}>
// //       {/* 🔹 PDF Viewer Modal */}
// //       {pdfUrl && (
// //         <div
// //           style={{
// //             position: 'fixed',
// //             top: 0,
// //             left: 0,
// //             right: 0,
// //             bottom: 0,
// //             backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //             zIndex: 1000,
// //             display: 'flex',
// //             justifyContent: 'center',
// //             alignItems: 'center',
// //           }}
// //         >
// //           <div
// //             style={{
// //               width: '90%',
// //               height: '90%',
// //               backgroundColor: palette.white,
// //               borderRadius: '8px',
// //               display: 'flex',
// //               flexDirection: 'column',
// //               overflow: 'hidden',
// //               boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
// //             }}
// //           >
// //             <div
// //               style={{
// //                 padding: '10px 20px',
// //                 background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// //                 color: palette.white,
// //                 display: 'flex',
// //                 justifyContent: 'space-between',
// //                 alignItems: 'center',
// //               }}
// //             >
// //               <h3 style={{ margin: 0 }}>Generated Office Order Document</h3>
// //               <button
// //                 onClick={() => {
// //                   URL.revokeObjectURL(pdfUrl); // Clean up the object URL
// //                   setPdfUrl(null);
// //                 }}
// //                 style={{
// //                   background: 'none',
// //                   border: 'none',
// //                   color: palette.white,
// //                   fontSize: '24px',
// //                   cursor: 'pointer',
// //                   lineHeight: 1,
// //                 }}
// //               >
// //                 &times;
// //               </button>
// //             </div>
// //             {/* PDF Viewer */}
// //             <iframe
// //               src={pdfUrl}
// //               title="Generated PDF"
// //               style={{ flexGrow: 1, border: 'none', minHeight: 0 }}
// //               frameBorder="0"
// //             />
// //           </div>
// //         </div>
// //       )}
// //       {/* 🔹 End of PDF Viewer Modal */}
      
// //       {loading ? (
// //         <div
// //           style={{
// //             display: "flex",
// //             flexDirection: "column",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             height: "400px",
// //             gap: "20px",
// //             color: palette.primary,
// //             fontSize: "18px",
// //           }}
// //         >
// //           <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
// //         </div>
// //       ) : selectedRecord ? (
// //         selectedRecord.templateType === "Continue Editing" ? (
// //           <SaveandHold
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         ) : (
// //           <EmployeeVisitForm
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         )
// //       ) : (
// //         // The container for the table view (back button, GenericTableGrid, pagination)
// //         <div style={{ width: '100%', minWidth: '1400px' }}>
// //           <div style={{ marginBottom: "20px" }}>
// //             <button
// //               onClick={onBack}
// //               style={{
// //                 padding: "10px 20px",
// //                 background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// //                 color: palette.white,
// //                 borderRadius: "8px",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 fontWeight: "600",
// //                 fontSize: "14px",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "8px",
// //                 boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
// //                 transition: "all 0.3s ease",
// //               }}
// //             >
// //               <span style={{ fontSize: "16px" }}>←</span>
// //               <span>Back to Previous</span>
// //             </button>
// //           </div>

// //           <GenericTableGrid
// //             data={currentRecords}
// //             columns={columns}
// //             filters={filters}
// //             palette={palette}
// //             emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
// //           />

// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               padding: "12px 20px",
// //               fontSize: "14px",
// //               color: palette.text.secondary,
// //               borderTop: `1px solid ${palette.border}`,
// //               background: palette.white,
// //               marginTop: "10px",
// //               borderRadius: "0 0 12px 12px",
// //             }}
// //           >
// //             <span>
// //               Showing {indexOfFirst + 1}–{Math.min(indexOfLast, records.length)}{" "}
// //               of {records.length}
// //             </span>
// //             <div style={{ display: "flex", gap: "8px" }}>
// //               <button
// //                 disabled={currentPage === 1}
// //                 onClick={() => setCurrentPage((p) => p - 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
// //                   opacity: currentPage === 1 ? 0.5 : 1,
// //                 }}
// //               >
// //                 Prev
// //               </button>
// //               <span>
// //                 Page {currentPage} / {totalPages}
// //               </span>
// //               <button
// //                 disabled={currentPage === totalPages}
// //                 onClick={() => setCurrentPage((p) => p + 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor:
// //                     currentPage === totalPages ? "not-allowed" : "pointer",
// //                   opacity: currentPage === totalPages ? 0.5 : 1,
// //                 }}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OfficeOrderTable;


// // import React, { useState, useEffect } from "react";
// // import GenericTableGrid from "src/components/ui/TableGrid";
// // import EmployeeVisitForm from "./EmployeeVisitForm.js";
// // import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
// // import Cookies from "js-cookie";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import FancyCircularLoader from "src/components/ui/Loader";
// // import { HostName } from "src/assets/host/Host";
// // import Swal from "sweetalert2";

// // const OfficeOrderTable = ({ onBack, order, filter }) => {
// //   const palette = {
// //     primary: "#20639B",
// //     darkBlue: "#173F5F",
// //     teal: "#3CAEA3",
// //     yellow: "#F6D55C",
// //     coral: "#ED553B",
// //     success: "#3CAEA3",
// //     warning: "#F6D55C",
// //     border: "#E2E8F0",
// //     hover: "#F9FAFB",
// //     white: "#FFFFFF",
// //     text: { primary: "#1E293B", secondary: "#64748B" },
// //   };

// //   const [records, setRecords] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [progress, setProgress] = useState(0);
// //   const [dropdownOptions, setDropdownOptions] = useState({});
// //   const [error, setError] = useState("");
// //   const [refreshTrigger, setRefreshTrigger] = useState(0);
  
// //   // 🔹 NEW STATE FOR PDF VIEWER
// //   const [pdfUrl, setPdfUrl] = useState(null);
// //   const [generating, setGenerating] = useState(false);

// //   const recordsPerPage = 10;

// //   const sessionId = Cookies.get("session_id");
// //   const jwtToken = Cookies.get("HRToken");

// //   const refreshTable = () => {
// //     setRefreshTrigger((prev) => prev + 1);
// //   };

// //   // 🔹 Effect for closing PDF on Escape key
// //   useEffect(() => {
// //     const closeOnEscape = (e) => {
// //       if (e.key === 'Escape' && pdfUrl) {
// //         URL.revokeObjectURL(pdfUrl);
// //         setPdfUrl(null);
// //       }
// //     };

// //     document.addEventListener('keydown', closeOnEscape);
// //     return () => document.removeEventListener('keydown', closeOnEscape);
// //   }, [pdfUrl]);


// //   // 🔹 Helper function to convert base64 to Blob
// //   const base64ToBlob = (base64, mimeType) => {
// //     const byteCharacters = atob(base64);
// //     const byteNumbers = new Array(byteCharacters.length);
// //     for (let i = 0; i < byteCharacters.length; i++) {
// //       byteNumbers[i] = byteCharacters.charCodeAt(i);
// //     }
// //     const byteArray = new Uint8Array(byteNumbers);
// //     return new Blob([byteArray], { type: mimeType });
// //   };

// //   // 🔹 Function to fetch and display PDF
// //   const handleViewPDF = async (employeeid, coverpageno, templatetype) => {
// //     try {
// //       setGenerating(true);
// //       setError("");
// //       setPdfUrl(null);

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");

// //       // ✅ Request body uses correct templatetype
// //       const requestBody = {
// //         employeeid: employeeid,
// //         coverpageno: coverpageno,
// //         templatetype: templatetype,
// //       };

// //       const response = await fetch(
// //         "https://wftest1.iitm.ac.in:8080/api/officeorder/pdf",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(requestBody),
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(
// //           `Failed to fetch PDF: ${response.status} ${response.statusText}`
// //         );
// //       }

// //       const contentType = response.headers.get("content-type");
// //       let pdfObjectUrl = null;

// //       if (contentType && contentType.includes("application/pdf")) {
// //         const pdfBlob = await response.blob();
// //         if (pdfBlob.size === 0) {
// //           throw new Error("No PDF found.");
// //         }
// //         pdfObjectUrl = URL.createObjectURL(pdfBlob);
// //       } else if (contentType && contentType.includes("application/json")) {
// //         const responseData = await response.json();

// //         if (responseData.pdf_data || responseData.pdf_base64) {
// //           const pdfBase64 = responseData.pdf_data || responseData.pdf_base64;
// //           const base64Data = pdfBase64.replace(
// //             /^data:application\/pdf;base64,/,
// //             ""
// //           );

// //           if (!base64Data || base64Data.trim() === "") {
// //             throw new Error("No PDF found.");
// //           }

// //           const pdfBlob = base64ToBlob(base64Data, "application/pdf");
// //           pdfObjectUrl = URL.createObjectURL(pdfBlob);
// //         } else {
// //           throw new Error("No PDF found.");
// //         }
// //       } else {
// //         throw new Error("No PDF found. Received content type: " + contentType);
// //       }

// //       if (pdfObjectUrl) {
// //         setPdfUrl(pdfObjectUrl);
// //       } else {
// //         throw new Error("Failed to generate PDF URL.");
// //       }
// //     } catch (err) {
// //       console.error("PDF fetch error:", err);
// //       Swal.fire({
// //         icon: "error",
// //         title: "PDF Error",
// //         text: err.message || "Failed to load PDF.",
// //       });
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   // 🔹 Base table columns
// //   let columns = [
// //     {
// //       key: "id",
// //       label: "Id",
// //       width: "80px",
// //       sortable: true,
// //       type: "number",
// //       align: "left",
// //       render: (item) => (
// //         <div style={{ fontWeight: "600", color: palette.primary }}>
// //           {item.id}
// //         </div>
// //       ),
// //     },
// //     {
// //       key: "employeeid",
// //       label: "Emp Id",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "coverpageno",
// //       label: "CoverPageNo",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "applicant",
// //       label: "Applicant",
// //       width: "200px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => {
// //         const parts = (item.applicant || "").split(" / ");
// //         const name = parts[0] || "--";
// //         const designation = parts[2] || "";
// //         return (
// //           <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
// //             <div style={{ fontWeight: "600" }}>{name}</div>
// //             {designation && (
// //               <div style={{ fontSize: "12px", color: palette.text.secondary }}>
// //                 {designation}
// //               </div>
// //             )}
// //           </div>
// //         );
// //       },
// //     },
// //     {
// //       key: "department",
// //       label: "Department",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //      {
// //       key: "claimtype",
// //       label: "ClaimType",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "status",
// //       label: "Status",
// //       width: "120px",
// //       sortable: true,
// //       align: "center",
     
// //     },
// //   ];

// //   // 🔹 Conditionally add Template Type OR Pending With
// //   if (filter === "ongoing") {
// //     columns.push({
// //       key: "pendingwith",
// //       label: "Pending",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //       render: (item) =>
// //         item.assignedto
// //           ? item.assignedto
// //           : "--",
// //     });
// //   } else {
// //     columns.push({
// //       key: "templateType",
// //       label: "Template Type",
// //       width: "160px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => (
// //         <select
// //           value={item.templateType}
// //           onChange={(e) => {
// //             const selectedValue = e.target.value;
// //             handleTemplateChange(item.id, selectedValue);
// //           }}
// //           onClick={async (e) => {
// //             e.stopPropagation();
// //             if (dropdownOptions[item.id]) return;

// //             try {
// //               const body = {
// //                 employeeid: item.employeeid,
// //                 coverpageno: item.coverpageno,
// //                 token: "HRFGVJISOVp1fncC",
// //                 session_id: sessionId,
// //               };

// //               const resp = await fetch(
// //                 `${HostName}/OfficeOrder_DropdownValuesHandler`,
// //                 {
// //                   method: "POST",
// //                   headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${jwtToken}`,
// //                   },
// //                   body: JSON.stringify(body),
// //                 }
// //               );

// //               const encData = await resp.json();
// //               const decrypted = await decryptData(encData.Data ?? encData.data);
// //               const parsed = validateJsonData(decrypted);

// //               const options =
// //                 parsed?.Data?.Records?.map((rec) => ({
// //                   Id: rec.Id,
// //                   value: rec.dropdown_value,
// //                   label: rec.dropdown_value,
// //                 })) || [];

// //               setDropdownOptions((prev) => ({
// //                 ...prev,
// //                 [item.id]: options,
// //               }));
// //             } catch (err) {
// //               console.error("Dropdown fetch error:", err);
// //             }
// //           }}
// //           style={{
// //             width: "100%",
// //             padding: "6px",
// //             borderRadius: "6px",
// //             border: `1px solid ${palette.border}`,
// //             fontSize: "13px",
// //           }}
// //         >
// //           <option value="">Select</option>
// //           {(dropdownOptions[item.id] || []).map((opt, idx) => (
// //             <option key={idx} value={opt.value}>
// //               {opt.label}
// //             </option>
// //           ))}
// //         </select>
// //       ),
// //     });
// //   }

// //   // 🔹 Update: Always add "Generated Template" with conditional rendering for 'complete' filter
// //   columns.push({
// //     key: "generatedtemplate",
// //     label: "Generated Template",
// //     width: "160px",
// //     sortable: false,
// //     align: "center",
// //     render: (item) => {
// //       if (filter === "complete") {
// //         return (
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "center",
// //               gap: "15px",
// //               alignItems: "center",
// //             }}
// //           >
// //             {/* Office Order Icon (Enhanced) */}
// //             <button
// //               onClick={() =>
// //                 handleViewPDF(
// //                   item.employeeid,
// //                   item.coverpageno,
// //                   "officecopy" // Payload value for Office Order
// //                 )
// //               }
// //               style={{
// //                 backgroundColor: palette.primary,
// //                 color: palette.white,
// //                 border: `1px solid ${palette.primary}`,
// //                 borderRadius: "6px",
// //                 cursor: generating ? "wait" : "pointer",
// //                 padding: "6px 10px",
// //                 fontSize: "14px",
// //                 fontWeight: "600",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "6px",
// //                 boxShadow: "0 2px 5px rgba(32, 99, 155, 0.3)",
// //                 transition: "all 0.3s ease",
// //                 opacity: generating ? 0.6 : 1,
// //               }}
// //               title="View Office Order Copy"
// //               disabled={generating}
// //             >
// //               📜 OO
// //             </button>
// //             {/* User Order Icon (Enhanced) */}
// //             <button
// //               onClick={() =>
// //                 handleViewPDF(item.employeeid, item.coverpageno, "usercopy") // Payload value for User Order
// //               }
// //               style={{
// //                 backgroundColor: palette.teal,
// //                 color: palette.white,
// //                 border: `1px solid ${palette.teal}`,
// //                 borderRadius: "6px",
// //                 cursor: generating ? "wait" : "pointer",
// //                 padding: "6px 10px",
// //                 fontSize: "14px",
// //                 fontWeight: "600",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "6px",
// //                 boxShadow: "0 2px 5px rgba(60, 190, 163, 0.3)",
// //                 transition: "all 0.3s ease",
// //                 opacity: generating ? 0.6 : 1,
// //               }}
// //               title="View User Copy"
// //               disabled={generating}
// //             >
// //               🧍 UC
// //             </button>
// //             {generating && (
// //                 <span style={{ fontSize: "12px", color: palette.text.secondary }}>
// //                   Loading...
// //                 </span>
// //             )}
// //           </div>
// //         );
// //       }
// //       return "--";
// //     },
// //   });

// //   const filters = [
// //     {
// //       key: "status",
// //       label: "All Status",
// //       options: [
// //         { value: "Approved", label: "Approved" },
// //         { value: "Pending", label: "Pending" },
// //         { value: "Rejected", label: "Rejected" },
// //       ],
// //     },
// //   ];

// //   // 🔹 Fetch Data (omitted for brevity, as it was not modified significantly)
// //   useEffect(() => {
// //     // ... (Keep the existing useEffect logic)
// //     const fetchOfficeOrderDetails = async () => {
// //       if (!jwtToken) return;

// //       setLoading(true);
// //       setProgress(0);

// //       try {
// //         const visitDetailsBody = {
// //           employeeid: Cookies.get("EmpId"),
// //           token: "HRFGVJISOVp1fncC",
// //           session_id: sessionId,
// //         };

// //         // --- Fetch visit details
// //         const visitRes = await fetch(`${HostName}/OfficeOrder_visitdetails`, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(visitDetailsBody),
// //         });

// //         const visitData = await visitRes.json();
// //         const decryptedVisit = await decryptData(
// //           visitData.Data ?? visitData.data
// //         );
// //         const parsedVisit = validateJsonData(decryptedVisit);
// //         const visitRecords = parsedVisit?.Data?.Records ?? [];

// //         const formattedVisit = visitRecords.map((item, idx) => ({
// //           id: item.visit_id || `${idx + 1}`,
// //           employeeid: item.employeeid || "--",
// //           coverpageno: item.coverpageno || "--",
// //           applicant: item.facultyname || item.facultydetails || "--",
// //           designation: item.designation || "--",
// //           department: item.department || "--",
// //           destination: `${item.citytown || ""}, ${item.country || ""}`,
// //           status:  "",
// //           claimtype: item.claimtype || "",
// //           leaveDetails: item.leavedetails || [],
// //           templateType: "",
// //           visitfrom: item.visitfrom,
// //           visitto: item.visitto,
// //           natureOfvisit: item.natureofparticipation_value,
// //           country: item.country,
// //           city: item.citytown,
// //         }));

// //         setRecords(formattedVisit);
// //         setProgress(50);

// //         // --- If filter applies (saveandhold, ongoing, complete)
// //         if (["saveandhold", "ongoing", "complete"].includes(filter)) {
// //           const taskBody = {
// //             employeeid: Cookies.get("EmpId"),
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //             status: filter,
// //           };

// //           const taskRes = await fetch(
// //             `${HostName}/OfficeOrder_taskvisitdetails`,
// //             {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${jwtToken}`,
// //               },
// //               body: JSON.stringify(taskBody),
// //             }
// //           );

// //           const taskData = await taskRes.json();
// //           const decryptedTask = await decryptData(
// //             taskData.Data ?? taskData.data
// //           );
// //           const parsedTask = validateJsonData(decryptedTask);
// //           const taskRecords = parsedTask?.Data?.Records ?? [];

// //           const formattedTask = taskRecords.map((item, idx) => ({
// //             id: item.visit_id || `${idx + 1}`,
// //             employeeid: item.employeeid || "--",
// //             coverpageno: item.coverpageno || "--",
// //             applicant: item.facultyname || item.facultydetails || "--",
// //             designation: item.designation || "--",
// //             department: item.department || "--",
// //             destination: `${item.citytown || ""}, ${item.country || ""}`,
// //             status:  "",
// //             claimtype: item.claimtype || "",
// //             leaveDetails: item.leavedetails || [],
// //             templateType: "",
// //             visitfrom: item.visitfrom,
// //             visitto: item.visitto,
// //             natureOfvisit: item.natureofparticipation,
// //             country: item.country,
// //             city: item.citytown,
// //             assignedto: item.assignto,
// //             signingauthority: item.signingauthority,
// //           }));

// //           setRecords(formattedTask);
// //         }

// //         setProgress(100);
// //       } catch (error) {
// //         console.error("❌ Error fetching/decrypting:", error);
// //         setRecords([]);
// //         setProgress(100);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOfficeOrderDetails();
// //   }, [jwtToken, sessionId, filter, refreshTrigger]);
// //   // 🔹 End of useEffect

// //   // 🔹 Handle Template Type change (omitted for brevity)
// //   const handleTemplateChange = (id, value) => {
// //     const record = records.find((r) => r.id === id);
// //     const selectedOption = dropdownOptions[id]?.find(
// //       (opt) => opt.value === value
// //     );

// //     if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
// //       Swal.fire({
// //         title: "Are you sure?",
// //         text: "The existing data will be deleted. Do you want to proceed?",
// //         icon: "warning",
// //         showCancelButton: true,
// //         confirmButtonColor: "#ED553B",
// //         cancelButtonColor: "#6B7280",
// //         confirmButtonText: "Yes, Delete",
// //         cancelButtonText: "No",
// //       }).then((result) => {
// //         if (result.isConfirmed) {
// //           handleConfirmYes(id, value, record);
// //         } else {
// //           handleConfirmNo(id, record);
// //         }
// //       });
// //       return;
// //     }

// //     setRecords((prev) =>
// //       prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
// //     );

// //     if (value) {
// //       setSelectedRecord({ ...record, templateType: value });
// //     }
// //   };

// //   const handleConfirmYes = async (id, value, record) => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       if (!sessionId) throw new Error("Session ID missing.");

// //       const statusResponse = await fetch(
// //         "https://wftest1.iitm.ac.in:7000/Statusmasternew",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify({
// //             statusdescription: "Deleted",
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //           }),
// //         }
// //       );

// //       if (!statusResponse.ok) throw new Error("Failed to fetch status");

// //       const encryptedStatus = await statusResponse.json();
// //       const decryptedString = await decryptData(
// //         encryptedStatus.Data ?? encryptedStatus.data
// //       );
// //       const validStatusData = validateJsonData(decryptedString);

// //       const deletedStatusId =
// //         validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

// //       const reqpayload = {
// //         token: "HRFGVJISOVp1fncC",
// //         session_id: sessionId,
// //         p_coverpageno: record.coverpageno,
// //         p_employeeid: record.employeeid,
// //         p_taskstatusid: String(deletedStatusId),
// //         p_updatedby: "DELETEBYUSER",
// //         p_updatedon: new Date().toISOString(),
// //       };

// //       const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify(reqpayload),
// //       });

// //       if (!response.ok) throw new Error("Failed to update Office Order");

// //       await response.json();

// //       Swal.fire({
// //         icon: "success",
// //         title: "Deleted!",
// //         text: "Previous data has been removed. Opening a new form...",
// //         timer: 1500,
// //         showConfirmButton: false,
// //       });

// //       refreshTable();

// //       setTimeout(() => {
// //         setSelectedRecord({ ...record, templateType: value });
// //       }, 1500);
// //     } catch (error) {
// //       console.error("Error in confirm YES:", error);
// //       Swal.fire("Error", "Something went wrong!", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleConfirmNo = (id, record) => {
// //     setRecords((prev) =>
// //       prev.map((rec) =>
// //         rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
// //       )
// //     );
// //     setSelectedRecord({ ...record, templateType: "Continue Editing" });

// //     Swal.fire({
// //       icon: "info",
// //       title: "Cancelled",
// //       text: "You can continue editing your existing data.",
// //       timer: 1500,
// //       showConfirmButton: false,
// //     });
// //   };
// //   // 🔹 End of handlers

// //   const indexOfLast = currentPage * recordsPerPage;
// //   const indexOfFirst = indexOfLast - recordsPerPage;
// //   const currentRecords = records.slice(indexOfFirst, indexOfLast);
// //   const totalPages = Math.ceil(records.length / recordsPerPage);

// //   return (
// //     <div style={{ width: "100%" }}>
// //       {/* 🔹 PDF Viewer Modal */}
// //       {pdfUrl && (
// //         <div
// //           style={{
// //             position: 'fixed',
// //             top: 0,
// //             left: 0,
// //             right: 0,
// //             bottom: 0,
// //             backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //             zIndex: 1000,
// //             display: 'flex',
// //             justifyContent: 'center',
// //             alignItems: 'center',
// //           }}
// //           // ✅ Close on overlay click
// //           onClick={(e) => {
// //             if (e.target === e.currentTarget) {
// //               URL.revokeObjectURL(pdfUrl);
// //               setPdfUrl(null);
// //             }
// //           }}
// //         >
// //           <div
// //             style={{
// //               width: '90%',
// //               height: '70%',
// //               maxWidth: '1000px', // Set a max-width for better display on large screens
// //               backgroundColor: palette.white,
// //               borderRadius: '12px',
// //               display: 'flex',
// //               flexDirection: 'column',
// //               overflow: 'hidden',
// //               boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
// //               transform: pdfUrl ? 'scale(1)' : 'scale(0.9)',
// //               transition: 'transform 0.3s ease-out',
// //             }}
// //           >
// //             <div
// //               style={{
// //                 padding: '10px 20px',
// //                 background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// //                 color: palette.white,
// //                 display: 'flex',
// //                 justifyContent: 'space-between',
// //                 alignItems: 'center',
// //               }}
// //             >
// //               <h3 style={{ margin: 0 }}>Generated Office Order Document</h3>
// //               {/* ✅ Improved Close Button */}
// //               <button
// //                 onClick={() => {
// //                   URL.revokeObjectURL(pdfUrl); // Clean up the object URL
// //                   setPdfUrl(null);
// //                 }}
// //                 style={{
// //                   background: palette.coral, 
// //                   border: 'none',
// //                   color: palette.white,
// //                   fontSize: '20px',
// //                   cursor: 'pointer',
// //                   lineHeight: 1,
// //                   width: '30px',
// //                   height: '30px',
// //                   borderRadius: '50%', 
// //                   fontWeight: 'bold',
// //                   display: 'flex',
// //                   justifyContent: 'center',
// //                   alignItems: 'center',
// //                   boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
// //                   transition: 'background-color 0.2s',
// //                 }}
// //                 title="Close Viewer"
// //               >
// //                 &times;
// //               </button>
// //             </div>
// //             {/* PDF Viewer */}
// //             <iframe
// //               src={pdfUrl}
// //               title="Generated PDF"
// //               style={{ flexGrow: 1, border: 'none', minHeight: 0 }}
// //               frameBorder="0"
// //             />
// //           </div>
// //         </div>
// //       )}
// //       {/* 🔹 End of PDF Viewer Modal */}
      
// //       {loading ? (
// //         <div
// //           style={{
// //             display: "flex",
// //             flexDirection: "column",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             height: "400px",
// //             gap: "20px",
// //             color: palette.primary,
// //             fontSize: "18px",
// //           }}
// //         >
// //           <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
// //         </div>
// //       ) : selectedRecord ? (
// //         selectedRecord.templateType === "Continue Editing" ? (
// //           <SaveandHold
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         ) : (
// //           <EmployeeVisitForm
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         )
// //       ) : (
// //         // The container for the table view (back button, GenericTableGrid, pagination)
// //         <div style={{ width: '100%', minWidth: '1400px' }}>
// //           <div style={{ marginBottom: "20px" }}>
// //             <button
// //               onClick={onBack}
// //               style={{
// //                 padding: "10px 20px",
// //                 background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// //                 color: palette.white,
// //                 borderRadius: "8px",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 fontWeight: "600",
// //                 fontSize: "14px",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "8px",
// //                 boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
// //                 transition: "all 0.3s ease",
// //               }}
// //             >
// //               <span style={{ fontSize: "16px" }}>←</span>
// //               <span>Back to Previous</span>
// //             </button>
// //           </div>

// //           <GenericTableGrid
// //             data={currentRecords}
// //             columns={columns}
// //             filters={filters}
// //             palette={palette}
// //             emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
// //           />

// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               padding: "12px 20px",
// //               fontSize: "14px",
// //               color: palette.text.secondary,
// //               borderTop: `1px solid ${palette.border}`,
// //               background: palette.white,
// //               marginTop: "10px",
// //               borderRadius: "0 0 12px 12px",
// //             }}
// //           >
// //             <span>
// //               Showing {indexOfFirst + 1}–{Math.min(indexOfLast, records.length)}{" "}
// //               of {records.length}
// //             </span>
// //             <div style={{ display: "flex", gap: "8px" }}>
// //               <button
// //                 disabled={currentPage === 1}
// //                 onClick={() => setCurrentPage((p) => p - 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
// //                   opacity: currentPage === 1 ? 0.5 : 1,
// //                 }}
// //               >
// //                 Prev
// //               </button>
// //               <span>
// //                 Page {currentPage} / {totalPages}
// //               </span>
// //               <button
// //                 disabled={currentPage === totalPages}
// //                 onClick={() => setCurrentPage((p) => p + 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor:
// //                     currentPage === totalPages ? "not-allowed" : "pointer",
// //                   opacity: currentPage === totalPages ? 0.5 : 1,
// //                 }}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OfficeOrderTable;




// // import React, { useState, useEffect } from "react";
// // import GenericTableGrid from "src/components/ui/TableGrid";
// // import EmployeeVisitForm from "./EmployeeVisitForm.js";
// // import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
// // import Cookies from "js-cookie";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import FancyCircularLoader from "src/components/ui/Loader";
// // import { HostName } from "src/assets/host/Host";
// // import Swal from "sweetalert2";

// // const OfficeOrderTable = ({ onBack, order, filter }) => {
// //   const palette = {
// //     primary: "#20639B",
// //     darkBlue: "#173F5F",
// //     teal: "#3CAEA3",
// //     yellow: "#F6D55C",
// //     coral: "#ED553B",
// //     success: "#3CAEA3",
// //     warning: "#F6D55C",
// //     border: "#E2E8F0",
// //     hover: "#F9FAFB",
// //     white: "#FFFFFF",
// //     text: { primary: "#1E293B", secondary: "#64748B" },
// //   };

// //   const [records, setRecords] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [progress, setProgress] = useState(0);
// //   const [dropdownOptions, setDropdownOptions] = useState({});
// //   const [error, setError] = useState("");
// //   const [refreshTrigger, setRefreshTrigger] = useState(0);

// //   // 🔹 NEW STATE FOR PDF VIEWER
// //   const [pdfUrl, setPdfUrl] = useState(null);
// //   const [generating, setGenerating] = useState(false);
// //   const [pdfType, setPdfType] = useState(null); // To dynamically set modal title

// //   const recordsPerPage = 10;

// //   const sessionId = Cookies.get("session_id");
// //   const jwtToken = Cookies.get("HRToken");

// //   const refreshTable = () => {
// //     setRefreshTrigger((prev) => prev + 1);
// //   };

// //   const closePdfViewer = () => {
// //     if (pdfUrl) {
// //       URL.revokeObjectURL(pdfUrl);
// //       setPdfUrl(null);
// //       setPdfType(null);
// //     }
// //   };

// //   // 🔹 Effect for closing PDF on Escape key and controlling body scroll (FIX)
// //   useEffect(() => {
// //     const closeOnEscape = (e) => {
// //       if (e.key === 'Escape' && pdfUrl) {
// //         closePdfViewer();
// //       }
// //     };

// //     document.addEventListener('keydown', closeOnEscape);

// //     // FIX: Toggle body overflow when modal is open
// //     if (pdfUrl) {
// //         document.body.style.overflow = 'hidden';
// //     } else {
// //         document.body.style.overflow = ''; // Restore default
// //     }

// //     return () => {
// //       document.removeEventListener('keydown', closeOnEscape);
// //       document.body.style.overflow = ''; // Cleanup on unmount/re-render
// //     };
// //   }, [pdfUrl]);


// //   // 🔹 Helper function to convert base64 to Blob
// //   const base64ToBlob = (base64, mimeType) => {
// //     const byteCharacters = atob(base64);
// //     const byteNumbers = new Array(byteCharacters.length);
// //     for (let i = 0; i < byteCharacters.length; i++) {
// //       byteNumbers[i] = byteCharacters.charCodeAt(i);
// //     }
// //     const byteArray = new Uint8Array(byteNumbers);
// //     return new Blob([byteArray], { type: mimeType });
// //   };

// //   // 🔹 Function to fetch and display PDF
// //   const handleViewPDF = async (employeeid, coverpageno, templatetype) => {
// //     try {
// //       setGenerating(true);
// //       setError("");
// //       setPdfUrl(null);
// //       setPdfType(null);

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");

// //       // ✅ Request body uses correct templatetype
// //       const requestBody = {
// //         employeeid: employeeid,
// //         coverpageno: coverpageno,
// //         templatetype: templatetype,
// //       };

// //       const response = await fetch(
// //         "https://wftest1.iitm.ac.in:8080/api/officeorder/pdf",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(requestBody),
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(
// //           `Failed to fetch PDF: ${response.status} ${response.statusText}`
// //         );
// //       }

// //       const contentType = response.headers.get("content-type");
// //       let pdfObjectUrl = null;

// //       if (contentType && contentType.includes("application/pdf")) {
// //         const pdfBlob = await response.blob();
// //         if (pdfBlob.size === 0) {
// //           throw new Error("No PDF found.");
// //         }
// //         pdfObjectUrl = URL.createObjectURL(pdfBlob);
// //       } else if (contentType && contentType.includes("application/json")) {
// //         const responseData = await response.json();

// //         if (responseData.pdf_data || responseData.pdf_base64) {
// //           const pdfBase64 = responseData.pdf_data || responseData.pdf_base64;
// //           const base64Data = pdfBase64.replace(
// //             /^data:application\/pdf;base64,/,
// //             ""
// //           );

// //           if (!base64Data || base64Data.trim() === "") {
// //             throw new Error("No PDF found.");
// //           }

// //           const pdfBlob = base64ToBlob(base64Data, "application/pdf");
// //           pdfObjectUrl = URL.createObjectURL(pdfBlob);
// //         } else {
// //           throw new Error("No PDF found.");
// //         }
// //       } else {
// //         throw new Error("No PDF found. Received content type: " + contentType);
// //       }

// //       if (pdfObjectUrl) {
// //         setPdfUrl(pdfObjectUrl);
// //         setPdfType(templatetype === 'officecopy' ? 'Official Copy' : 'User Copy');
// //       } else {
// //         throw new Error("Failed to generate PDF URL.");
// //       }
// //     } catch (err) {
// //       console.error("PDF fetch error:", err);
// //       Swal.fire({
// //         icon: "error",
// //         title: "PDF Error",
// //         text: err.message || "Failed to load PDF.",
// //       });
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   // 🔹 MODAL STYLES
// //   const styles = {
// //     modalOverlay: {
// //       position: 'fixed',
// //       top: 0,
// //       left: 0,
// //       right: 0,
// //       bottom: 0,
// //       backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //       zIndex: 1000,
// //       display: 'flex',
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       backdropFilter: 'blur(3px)',
// //     },
// //     modalContent: {
// //       width: '90%',
// //       height: '90%',
// //       maxWidth: '1000px',
// //       backgroundColor: palette.white,
// //       borderRadius: '12px',
// //       display: 'flex',
// //       flexDirection: 'column',
// //       overflow: 'hidden',
// //       boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
// //       transform: pdfUrl ? 'scale(1)' : 'scale(0.9)',
// //       transition: 'transform 0.3s ease-out',
// //     },
// //     modalHeader: {
// //       padding: '12px 20px',
// //       background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// //       color: palette.white,
// //       display: 'flex',
// //       justifyContent: 'space-between',
// //       alignItems: 'center',
// //       borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
// //     },
// //     modalTitle: {
// //       margin: 0,
// //       fontSize: '18px',
// //       fontWeight: '600',
// //     },
// //     modalActions: {
// //       display: 'flex',
// //       gap: '10px',
// //     },
// //     closeButton: {
// //       background: 'none',
// //       border: '1px solid rgba(255, 255, 255, 0.6)',
// //       color: palette.white,
// //       padding: '6px 15px',
// //       borderRadius: '20px',
// //       cursor: 'pointer',
// //       fontWeight: '500',
// //       fontSize: '14px',
// //       transition: 'all 0.2s ease',
// //       // Note: Pseudo-classes like :hover cannot be directly styled in plain React inline styles
// //       // but can be achieved with libraries or actual CSS/Styled Components.
// //     },
// //     modalBody: {
// //       flexGrow: 1,
// //       overflow: 'auto', // Keep this so PDF content can scroll if needed
// //       minHeight: 0,
// //     },
// //     iframe: {
// //       width: '100%',
// //       height: '100%',
// //       border: 'none',
// //     }
// //   };

// //   // 🔹 PDF Viewer Modal Component
// //   const PDFViewerModal = ({ pdfUrl, title, onClose }) => {
// //     const renderContent = () => (
// //       <iframe
// //         src={pdfUrl}
// //         title={title}
// //         style={styles.iframe}
// //         frameBorder="0"
// //         allowFullScreen
// //       />
// //     );

// //     return (
// //       <div style={styles.modalOverlay} onClick={onClose}>
// //         <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
// //           <div style={styles.modalHeader}>
// //             <h3 style={styles.modalTitle}>Office Order Preview ({title})</h3>
// //             <div style={styles.modalActions}>
// //               <button onClick={onClose} style={styles.closeButton}>
// //                 ✕ Close
// //               </button>
// //             </div>
// //           </div>
// //           <div style={styles.modalBody}>{renderContent()}</div>
// //         </div>
// //       </div>
// //     );
// //   };


// //   // 🔹 Base table columns
// //   let columns = [
// //     {
// //       key: "id",
// //       label: "Id",
// //       width: "80px",
// //       sortable: true,
// //       type: "number",
// //       align: "left",
// //       render: (item) => (
// //         <div style={{ fontWeight: "600", color: palette.primary }}>
// //           {item.id}
// //         </div>
// //       ),
// //     },
// //     {
// //       key: "employeeid",
// //       label: "Emp Id",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "coverpageno",
// //       label: "CoverPageNo",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "applicant",
// //       label: "Applicant",
// //       width: "200px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => {
// //         const parts = (item.applicant || "").split(" / ");
// //         const name = parts[0] || "--";
// //         const designation = parts[2] || "";
// //         return (
// //           <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
// //             <div style={{ fontWeight: "600" }}>{name}</div>
// //             {designation && (
// //               <div style={{ fontSize: "12px", color: palette.text.secondary }}>
// //                 {designation}
// //               </div>
// //             )}
// //           </div>
// //         );
// //       },
// //     },
// //     {
// //       key: "department",
// //       label: "Department",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //      {
// //       key: "claimtype",
// //       label: "ClaimType",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "status",
// //       label: "Status",
// //       width: "120px",
// //       sortable: true,
// //       align: "center",
     
// //     },
// //   ];

// //   // 🔹 Conditionally add Template Type OR Pending With
// //   if (filter === "ongoing") {
// //     columns.push({
// //       key: "pendingwith",
// //       label: "Pending",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //       render: (item) =>
// //         item.assignedto
// //           ? item.assignedto
// //           : "--",
// //     });
// //   } else {
// //     columns.push({
// //       key: "templateType",
// //       label: "Template Type",
// //       width: "160px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => (
// //         <select
// //           value={item.templateType}
// //           onChange={(e) => {
// //             const selectedValue = e.target.value;
// //             handleTemplateChange(item.id, selectedValue);
// //           }}
// //           onClick={async (e) => {
// //             e.stopPropagation();
// //             if (dropdownOptions[item.id]) return;

// //             try {
// //               const body = {
// //                 employeeid: item.employeeid,
// //                 coverpageno: item.coverpageno,
// //                 token: "HRFGVJISOVp1fncC",
// //                 session_id: sessionId,
// //               };

// //               const resp = await fetch(
// //                 `${HostName}/OfficeOrder_DropdownValuesHandler`,
// //                 {
// //                   method: "POST",
// //                   headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${jwtToken}`,
// //                   },
// //                   body: JSON.stringify(body),
// //                 }
// //               );

// //               const encData = await resp.json();
// //               const decrypted = await decryptData(encData.Data ?? encData.data);
// //               const parsed = validateJsonData(decrypted);

// //               const options =
// //                 parsed?.Data?.Records?.map((rec) => ({
// //                   Id: rec.Id,
// //                   value: rec.dropdown_value,
// //                   label: rec.dropdown_value,
// //                 })) || [];

// //               setDropdownOptions((prev) => ({
// //                 ...prev,
// //                 [item.id]: options,
// //               }));
// //             } catch (err) {
// //               console.error("Dropdown fetch error:", err);
// //             }
// //           }}
// //           style={{
// //             width: "100%",
// //             padding: "6px",
// //             borderRadius: "6px",
// //             border: `1px solid ${palette.border}`,
// //             fontSize: "13px",
// //           }}
// //         >
// //           <option value="">Select</option>
// //           {(dropdownOptions[item.id] || []).map((opt, idx) => (
// //             <option key={idx} value={opt.value}>
// //               {opt.label}
// //             </option>
// //           ))}
// //         </select>
// //       ),
// //     });
// //   }

// //   // 🔹 Update: Always add "Generated Template" with conditional rendering for 'complete' filter
// //   columns.push({
// //     key: "generatedtemplate",
// //     label: "Generated Template",
// //     width: "160px",
// //     sortable: false,
// //     align: "center",
// //     render: (item) => {
// //       if (filter === "complete") {
// //         return (
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "center",
// //               gap: "15px",
// //               alignItems: "center",
// //             }}
// //           >
// //             {/* Office Order Icon (Enhanced) */}
// //             <button
// //               onClick={() =>
// //                 handleViewPDF(
// //                   item.employeeid,
// //                   item.coverpageno,
// //                   "officecopy" // Payload value for Office Order
// //                 )
// //               }
// //               style={{
// //                 backgroundColor: palette.primary,
// //                 color: palette.white,
// //                 border: `1px solid ${palette.primary}`,
// //                 borderRadius: "6px",
// //                 cursor: generating ? "wait" : "pointer",
// //                 padding: "6px 10px",
// //                 fontSize: "14px",
// //                 fontWeight: "600",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "6px",
// //                 boxShadow: "0 2px 5px rgba(32, 99, 155, 0.3)",
// //                 transition: "all 0.3s ease",
// //                 opacity: generating ? 0.6 : 1,
// //               }}
// //               title="View Office Order Copy"
// //               disabled={generating}
// //             >
// //               📜 OO
// //             </button>
// //             {/* User Order Icon (Enhanced) */}
// //             <button
// //               onClick={() =>
// //                 handleViewPDF(item.employeeid, item.coverpageno, "usercopy") // Payload value for User Order
// //               }
// //               style={{
// //                 backgroundColor: palette.teal,
// //                 color: palette.white,
// //                 border: `1px solid ${palette.teal}`,
// //                 borderRadius: "6px",
// //                 cursor: generating ? "wait" : "pointer",
// //                 padding: "6px 10px",
// //                 fontSize: "14px",
// //                 fontWeight: "600",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "6px",
// //                 boxShadow: "0 2px 5px rgba(60, 190, 163, 0.3)",
// //                 transition: "all 0.3s ease",
// //                 opacity: generating ? 0.6 : 1,
// //               }}
// //               title="View User Copy"
// //               disabled={generating}
// //             >
// //               🧍 UC
// //             </button>
// //             {generating && (
// //                 <span style={{ fontSize: "12px", color: palette.text.secondary }}>
// //                   Loading...
// //                 </span>
// //             )}
// //           </div>
// //         );
// //       }
// //       return "--";
// //     },
// //   });

// //   const filters = [
// //     {
// //       key: "status",
// //       label: "All Status",
// //       options: [
// //         { value: "Approved", label: "Approved" },
// //         { value: "Pending", label: "Pending" },
// //         { value: "Rejected", label: "Rejected" },
// //       ],
// //     },
// //   ];

// //   // 🔹 Fetch Data (omitted for brevity, as it was not modified significantly)
// //   useEffect(() => {
// //     const fetchOfficeOrderDetails = async () => {
// //       if (!jwtToken) return;

// //       setLoading(true);
// //       setProgress(0);

// //       try {
// //         const visitDetailsBody = {
// //           employeeid: Cookies.get("EmpId"),
// //           token: "HRFGVJISOVp1fncC",
// //           session_id: sessionId,
// //         };

// //         // --- Fetch visit details
// //         const visitRes = await fetch(`${HostName}/OfficeOrder_visitdetails`, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(visitDetailsBody),
// //         });

// //         const visitData = await visitRes.json();
// //         const decryptedVisit = await decryptData(
// //           visitData.Data ?? visitData.data
// //         );
// //         const parsedVisit = validateJsonData(decryptedVisit);
// //         const visitRecords = parsedVisit?.Data?.Records ?? [];

// //         const formattedVisit = visitRecords.map((item, idx) => ({
// //           id: item.visit_id || `${idx + 1}`,
// //           employeeid: item.employeeid || "--",
// //           coverpageno: item.coverpageno || "--",
// //           applicant: item.facultyname || item.facultydetails || "--",
// //           designation: item.designation || "--",
// //           department: item.department || "--",
// //           destination: `${item.citytown || ""}, ${item.country || ""}`,
// //           status:  "",
// //           claimtype: item.claimtype || "",
// //           leaveDetails: item.leavedetails || [],
// //           templateType: "",
// //           visitfrom: item.visitfrom,
// //           visitto: item.visitto,
// //           natureOfvisit: item.natureofparticipation_value,
// //           country: item.country,
// //           city: item.citytown,
// //         }));

// //         setRecords(formattedVisit);
// //         setProgress(50);

// //         // --- If filter applies (saveandhold, ongoing, complete)
// //         if (["saveandhold", "ongoing", "complete"].includes(filter)) {
// //           const taskBody = {
// //             employeeid: Cookies.get("EmpId"),
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //             status: filter,
// //           };

// //           const taskRes = await fetch(
// //             `${HostName}/OfficeOrder_taskvisitdetails`,
// //             {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${jwtToken}`,
// //               },
// //               body: JSON.stringify(taskBody),
// //             }
// //           );

// //           const taskData = await taskRes.json();
// //           const decryptedTask = await decryptData(
// //             taskData.Data ?? taskData.data
// //           );
// //           const parsedTask = validateJsonData(decryptedTask);
// //           const taskRecords = parsedTask?.Data?.Records ?? [];

// //           const formattedTask = taskRecords.map((item, idx) => ({
// //             id: item.visit_id || `${idx + 1}`,
// //             employeeid: item.employeeid || "--",
// //             coverpageno: item.coverpageno || "--",
// //             applicant: item.facultyname || item.facultydetails || "--",
// //             designation: item.designation || "--",
// //             department: item.department || "--",
// //             destination: `${item.citytown || ""}, ${item.country || ""}`,
// //             status:  "",
// //             claimtype: item.claimtype || "",
// //             leaveDetails: item.leavedetails || [],
// //             templateType: "",
// //             visitfrom: item.visitfrom,
// //             visitto: item.visitto,
// //             natureOfvisit: item.natureofparticipation,
// //             country: item.country,
// //             city: item.citytown,
// //             assignedto: item.assignto,
// //             signingauthority: item.signingauthority,
// //           }));

// //           setRecords(formattedTask);
// //         }

// //         setProgress(100);
// //       } catch (error) {
// //         console.error("❌ Error fetching/decrypting:", error);
// //         setRecords([]);
// //         setProgress(100);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOfficeOrderDetails();
// //   }, [jwtToken, sessionId, filter, refreshTrigger]);
// //   // 🔹 End of useEffect

// //   // 🔹 Handle Template Type change (omitted for brevity)
// //   const handleTemplateChange = (id, value) => {
// //     const record = records.find((r) => r.id === id);
// //     const selectedOption = dropdownOptions[id]?.find(
// //       (opt) => opt.value === value
// //     );

// //     if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
// //       Swal.fire({
// //         title: "Are you sure?",
// //         text: "The existing data will be deleted. Do you want to proceed?",
// //         icon: "warning",
// //         showCancelButton: true,
// //         confirmButtonColor: "#ED553B",
// //         cancelButtonColor: "#6B7280",
// //         confirmButtonText: "Yes, Delete",
// //         cancelButtonText: "No",
// //       }).then((result) => {
// //         if (result.isConfirmed) {
// //           handleConfirmYes(id, value, record);
// //         } else {
// //           handleConfirmNo(id, record);
// //         }
// //       });
// //       return;
// //     }

// //     setRecords((prev) =>
// //       prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
// //     );

// //     if (value) {
// //       setSelectedRecord({ ...record, templateType: value });
// //     }
// //   };

// //   const handleConfirmYes = async (id, value, record) => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       if (!sessionId) throw new Error("Session ID missing.");

// //       const statusResponse = await fetch(
// //         "https://wftest1.iitm.ac.in:7000/Statusmasternew",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify({
// //             statusdescription: "Deleted",
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //           }),
// //         }
// //       );

// //       if (!statusResponse.ok) throw new Error("Failed to fetch status");

// //       const encryptedStatus = await statusResponse.json();
// //       const decryptedString = await decryptData(
// //         encryptedStatus.Data ?? encryptedStatus.data
// //       );
// //       const validStatusData = validateJsonData(decryptedString);

// //       const deletedStatusId =
// //         validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

// //       const reqpayload = {
// //         token: "HRFGVJISOVp1fncC",
// //         session_id: sessionId,
// //         p_coverpageno: record.coverpageno,
// //         p_employeeid: record.employeeid,
// //         p_taskstatusid: String(deletedStatusId),
// //         p_updatedby: "DELETEBYUSER",
// //         p_updatedon: new Date().toISOString(),
// //       };

// //       const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify(reqpayload),
// //       });

// //       if (!response.ok) throw new Error("Failed to update Office Order");

// //       await response.json();

// //       Swal.fire({
// //         icon: "success",
// //         title: "Deleted!",
// //         text: "Previous data has been removed. Opening a new form...",
// //         timer: 1500,
// //         showConfirmButton: false,
// //       });

// //       refreshTable();

// //       setTimeout(() => {
// //         setSelectedRecord({ ...record, templateType: value });
// //       }, 1500);
// //     } catch (error) {
// //       console.error("Error in confirm YES:", error);
// //       Swal.fire("Error", "Something went wrong!", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleConfirmNo = (id, record) => {
// //     setRecords((prev) =>
// //       prev.map((rec) =>
// //         rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
// //       )
// //     );
// //     setSelectedRecord({ ...record, templateType: "Continue Editing" });

// //     Swal.fire({
// //       icon: "info",
// //       title: "Cancelled",
// //       text: "You can continue editing your existing data.",
// //       timer: 1500,
// //       showConfirmButton: false,
// //     });
// //   };
// //   // 🔹 End of handlers

// //   const indexOfLast = currentPage * recordsPerPage;
// //   const indexOfFirst = indexOfLast - recordsPerPage;
// //   const currentRecords = records.slice(indexOfFirst, indexOfLast);
// //   const totalPages = Math.ceil(records.length / recordsPerPage);

// //   return (
// //     <div style={{ width: "100%" }}>
// //       {/* 🔹 PDF Viewer Modal */}
// //       {pdfUrl && <PDFViewerModal pdfUrl={pdfUrl} title={pdfType} onClose={closePdfViewer} />}
// //       {/* 🔹 End of PDF Viewer Modal */}

// //       {loading ? (
// //         <div
// //           style={{
// //             display: "flex",
// //             flexDirection: "column",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             height: "400px",
// //             gap: "20px",
// //             color: palette.primary,
// //             fontSize: "18px",
// //           }}
// //         >
// //           <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
// //         </div>
// //       ) : selectedRecord ? (
// //         selectedRecord.templateType === "Continue Editing" ? (
// //           <SaveandHold
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         ) : (
// //           <EmployeeVisitForm
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         )
// //       ) : (
// //         // The container for the table view (back button, GenericTableGrid, pagination)
// //         <div style={{ width: '100%', minWidth: '1400px' }}>
// //           <div style={{ marginBottom: "20px" }}>
// //             <button
// //               onClick={onBack}
// //               style={{
// //                 padding: "10px 20px",
// //                 background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// //                 color: palette.white,
// //                 borderRadius: "8px",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 fontWeight: "600",
// //                 fontSize: "14px",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "8px",
// //                 boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
// //                 transition: "all 0.3s ease",
// //               }}
// //             >
// //               <span style={{ fontSize: "16px" }}>←</span>
// //               <span>Back to Previous</span>
// //             </button>
// //           </div>

// //           <GenericTableGrid
// //             data={currentRecords}
// //             columns={columns}
// //             filters={filters}
// //             palette={palette}
// //             emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
// //           />

// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               padding: "12px 20px",
// //               fontSize: "14px",
// //               color: palette.text.secondary,
// //               borderTop: `1px solid ${palette.border}`,
// //               background: palette.white,
// //               marginTop: "10px",
// //               borderRadius: "0 0 12px 12px",
// //             }}
// //           >
// //             <span>
// //               Showing {indexOfFirst + 1}–{Math.min(indexOfLast, records.length)}{" "}
// //               of {records.length}
// //             </span>
// //             <div style={{ display: "flex", gap: "8px" }}>
// //               <button
// //                 disabled={currentPage === 1}
// //                 onClick={() => setCurrentPage((p) => p - 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
// //                   opacity: currentPage === 1 ? 0.5 : 1,
// //                 }}
// //               >
// //                 Prev
// //               </button>
// //               <span>
// //                 Page {currentPage} / {totalPages}
// //               </span>
// //               <button
// //                 disabled={currentPage === totalPages}
// //                 onClick={() => setCurrentPage((p) => p + 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor:
// //                     currentPage === totalPages ? "not-allowed" : "pointer",
// //                   opacity: currentPage === totalPages ? 0.5 : 1,
// //                 }}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OfficeOrderTable;



// // import React, { useState, useEffect } from "react";
// // import GenericTableGrid from "src/components/ui/TableGrid";
// // import EmployeeVisitForm from "./EmployeeVisitForm.js";
// // import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
// // import Cookies from "js-cookie";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import FancyCircularLoader from "src/components/ui/Loader";
// // import { HostName } from "src/assets/host/Host";
// // import Swal from "sweetalert2";

// // const OfficeOrderTable = ({ onBack, order, filter }) => {
// //   const palette = {
// //     primary: "#20639B",
// //     darkBlue: "#173F5F",
// //     teal: "#3CAEA3",
// //     yellow: "#F6D55C",
// //     coral: "#ED553B",
// //     success: "#3CAEA3",
// //     warning: "#F6D55C",
// //     border: "#E2E8F0",
// //     hover: "#F9FAFB",
// //     white: "#FFFFFF",
// //     text: { primary: "#1E293B", secondary: "#64748B" },
// //   };

// //   const [records, setRecords] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [progress, setProgress] = useState(0);
// //   const [dropdownOptions, setDropdownOptions] = useState({});
// //   const [error, setError] = useState("");
// //   const [refreshTrigger, setRefreshTrigger] = useState(0);

// //   const recordsPerPage = 10;

// //   const sessionId = Cookies.get("session_id");
// //   const jwtToken = Cookies.get("HRToken");

// //   const refreshTable = () => {
// //     setRefreshTrigger((prev) => prev + 1);
// //   };

// //   // 🔹 Base table columns
// //   let columns = [
// //     {
// //       key: "id",
// //       label: "Id",
// //       width: "80px",
// //       sortable: true,
// //       type: "number",
// //       align: "left",
// //       render: (item) => (
// //         <div style={{ fontWeight: "600", color: palette.primary }}>
// //           {item.id}
// //         </div>
// //       ),
// //     },
// //     {
// //       key: "employeeid",
// //       label: "Emp Id",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "coverpageno",
// //       label: "CoverPageNo",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "applicant",
// //       label: "Applicant",
// //       width: "200px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => {
// //         const parts = (item.applicant || "").split(" / ");
// //         const name = parts[0] || "--";
// //         const designation = parts[2] || "";
// //         return (
// //           <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
// //             <div style={{ fontWeight: "600" }}>{name}</div>
// //             {designation && (
// //               <div style={{ fontSize: "12px", color: palette.text.secondary }}>
// //                 {designation}
// //               </div>
// //             )}
// //           </div>
// //         );
// //       },
// //     },
// //     {
// //       key: "department",
// //       label: "Department",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //      {
// //       key: "claimtype",
// //       label: "ClaimType",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //     },
// //     {
// //       key: "status",
// //       label: "Status",
// //       width: "120px",
// //       sortable: true,
// //       align: "center",
     
// //     },
// //   ];

// //   // 🔹 Conditionally add Template Type OR Pending With
// //   if (filter === "ongoing") {
// //     columns.push({
// //       key: "pendingwith",
// //       label: "Pending",
// //       width: "200px",
// //       sortable: true,
// //       align: "center",
// //       render: (item) =>
// //         item.assignedto
// //           ? item.assignedto
// //           : "--",
// //     });
// //   } else {
// //     columns.push({
// //       key: "templateType",
// //       label: "Template Type",
// //       width: "160px",
// //       sortable: true,
// //       align: "left",
// //       render: (item) => (
// //         <select
// //           value={item.templateType}
// //           onChange={(e) => {
// //             const selectedValue = e.target.value;
// //             handleTemplateChange(item.id, selectedValue);
// //           }}
// //           onClick={async (e) => {
// //             e.stopPropagation();
// //             if (dropdownOptions[item.id]) return;

// //             try {
// //               const body = {
// //                 employeeid: item.employeeid,
// //                 coverpageno: item.coverpageno,
// //                 token: "HRFGVJISOVp1fncC",
// //                 session_id: sessionId,
// //               };

// //               const resp = await fetch(
// //                 `${HostName}/OfficeOrder_DropdownValuesHandler`,
// //                 {
// //                   method: "POST",
// //                   headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${jwtToken}`,
// //                   },
// //                   body: JSON.stringify(body),
// //                 }
// //               );

// //               const encData = await resp.json();
// //               const decrypted = await decryptData(encData.Data ?? encData.data);
// //               const parsed = validateJsonData(decrypted);

// //               const options =
// //                 parsed?.Data?.Records?.map((rec) => ({
// //                   Id: rec.Id,
// //                   value: rec.dropdown_value,
// //                   label: rec.dropdown_value,
// //                 })) || [];

// //               setDropdownOptions((prev) => ({
// //                 ...prev,
// //                 [item.id]: options,
// //               }));
// //             } catch (err) {
// //               console.error("Dropdown fetch error:", err);
// //             }
// //           }}
// //           style={{
// //             width: "100%",
// //             padding: "6px",
// //             borderRadius: "6px",
// //             border: `1px solid ${palette.border}`,
// //             fontSize: "13px",
// //           }}
// //         >
// //           <option value="">Select</option>
// //           {(dropdownOptions[item.id] || []).map((opt, idx) => (
// //             <option key={idx} value={opt.value}>
// //               {opt.label}
// //             </option>
// //           ))}
// //         </select>
// //       ),
// //     });
// //   }

// //   // 🔹 Always add "Generated Template"
// //   columns.push({
// //     key: "generatedtemplate",
// //     label: "Generated Template",
// //     width: "160px",
// //     sortable: false,
// //     align: "center",
// //     render: () => "--",
// //   });

// //   const filters = [
// //     {
// //       key: "status",
// //       label: "All Status",
// //       options: [
// //         { value: "Approved", label: "Approved" },
// //         { value: "Pending", label: "Pending" },
// //         { value: "Rejected", label: "Rejected" },
// //       ],
// //     },
// //   ];

// //   // 🔹 Fetch Data - UPDATED useEffect
// //   useEffect(() => {
// //     const fetchOfficeOrderDetails = async () => {
// //       if (!jwtToken) return;

// //       setLoading(true);
// //       setProgress(0);

// //       try {
// //         // Check if filter is one of the specific values
// //         const isTaskFilter = ["saveandhold", "ongoing", "complete"].includes(filter);

// //         if (isTaskFilter) {
// //           // Only call OfficeOrder_taskvisitdetails for these filters
// //           const taskBody = {
// //             employeeid: Cookies.get("EmpId"),
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //             status: filter,
// //           };

// //           const taskRes = await fetch(
// //             `${HostName}/OfficeOrder_taskvisitdetails`,
// //             {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${jwtToken}`,
// //               },
// //               body: JSON.stringify(taskBody),
// //             }
// //           );

// //           const taskData = await taskRes.json();
// //           const decryptedTask = await decryptData(
// //             taskData.Data ?? taskData.data
// //           );
// //           const parsedTask = validateJsonData(decryptedTask);
// //           const taskRecords = parsedTask?.Data?.Records ?? [];

// //           const formattedTask = taskRecords.map((item, idx) => ({
// //             id: item.visit_id || `${idx + 1}`,
// //             employeeid: item.employeeid || "--",
// //             coverpageno: item.coverpageno || "--",
// //             applicant: item.facultyname || item.facultydetails || "--",
// //             designation: item.designation || "--",
// //             department: item.department || "--",
// //             destination: `${item.citytown || ""}, ${item.country || ""}`,
// //             status:  "",
// //             claimtype: item.claimtype || "",
// //             leaveDetails: item.leavedetails || [],
// //             templateType: "",
// //             visitfrom: item.visitfrom,
// //             visitto: item.visitto,
// //             natureOfvisit: item.natureofparticipation,
// //             country: item.country,
// //             city: item.citytown,
// //             assignedto: item.assignto,
// //             signingauthority: item.signingauthority,
// //           }));

// //           setRecords(formattedTask);
// //           setProgress(100);
// //         } else {
// //           // For other filters, call the original API
// //           const visitDetailsBody = {
// //             employeeid: Cookies.get("EmpId"),
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //           };

// //           const visitRes = await fetch(`${HostName}/OfficeOrder_visitdetails`, {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Bearer ${jwtToken}`,
// //             },
// //             body: JSON.stringify(visitDetailsBody),
// //           });

// //           const visitData = await visitRes.json();
// //           const decryptedVisit = await decryptData(
// //             visitData.Data ?? visitData.data
// //           );
// //           const parsedVisit = validateJsonData(decryptedVisit);
// //           const visitRecords = parsedVisit?.Data?.Records ?? [];

// //           const formattedVisit = visitRecords.map((item, idx) => ({
// //             id: item.visit_id || `${idx + 1}`,
// //             employeeid: item.employeeid || "--",
// //             coverpageno: item.coverpageno || "--",
// //             applicant: item.facultyname || item.facultydetails || "--",
// //             designation: item.designation || "--",
// //             department: item.department || "--",
// //             destination: `${item.citytown || ""}, ${item.country || ""}`,
// //             status:  "",
// //             claimtype: item.claimtype || "",
// //             leaveDetails: item.leavedetails || [],
// //             templateType: "",
// //             visitfrom: item.visitfrom,
// //             visitto: item.visitto,
// //             natureOfvisit: item.natureofparticipation_value,
// //             country: item.country,
// //             city: item.citytown,
// //           }));

// //           setRecords(formattedVisit);
// //           setProgress(100);
// //         }
// //       } catch (error) {
// //         console.error("❌ Error fetching/decrypting:", error);
// //         setRecords([]);
// //         setProgress(100);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOfficeOrderDetails();
// //   }, [jwtToken, sessionId, filter, refreshTrigger]);

// //   // 🔹 Handle Template Type change
// //   const handleTemplateChange = (id, value) => {
// //     const record = records.find((r) => r.id === id);
// //     const selectedOption = dropdownOptions[id]?.find(
// //       (opt) => opt.value === value
// //     );

// //     if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
// //       Swal.fire({
// //         title: "Are you sure?",
// //         text: "The existing data will be deleted. Do you want to proceed?",
// //         icon: "warning",
// //         showCancelButton: true,
// //         confirmButtonColor: "#ED553B",
// //         cancelButtonColor: "#6B7280",
// //         confirmButtonText: "Yes, Delete",
// //         cancelButtonText: "No",
// //       }).then((result) => {
// //         if (result.isConfirmed) {
// //           handleConfirmYes(id, value, record);
// //         } else {
// //           handleConfirmNo(id, record);
// //         }
// //       });
// //       return;
// //     }

// //     setRecords((prev) =>
// //       prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
// //     );

// //     if (value) {
// //       setSelectedRecord({ ...record, templateType: value });
// //     }
// //   };

// //   const handleConfirmYes = async (id, value, record) => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");
// //       if (!sessionId) throw new Error("Session ID missing.");

// //       const statusResponse = await fetch(
// //         "https://wftest1.iitm.ac.in:7000/Statusmasternew",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify({
// //             statusdescription: "Deleted",
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //           }),
// //         }
// //       );

// //       if (!statusResponse.ok) throw new Error("Failed to fetch status");

// //       const encryptedStatus = await statusResponse.json();
// //       const decryptedString = await decryptData(
// //         encryptedStatus.Data ?? encryptedStatus.data
// //       );
// //       const validStatusData = validateJsonData(decryptedString);

// //       const deletedStatusId =
// //         validStatusData?.Data?.Records?.[0]?.statusid ?? 8;

// //       const reqpayload = {
// //         token: "HRFGVJISOVp1fncC",
// //         session_id: sessionId,
// //         p_coverpageno: record.coverpageno,
// //         p_employeeid: record.employeeid,
// //         p_taskstatusid: String(deletedStatusId),
// //         p_updatedby: "DELETEBYUSER",
// //         p_updatedon: new Date().toISOString(),
// //       };

// //       const response = await fetch(`${HostName}/OfficeOrder_statusupdate`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${jwtToken}`,
// //         },
// //         body: JSON.stringify(reqpayload),
// //       });

// //       if (!response.ok) throw new Error("Failed to update Office Order");

// //       await response.json();

// //       Swal.fire({
// //         icon: "success",
// //         title: "Deleted!",
// //         text: "Previous data has been removed. Opening a new form...",
// //         timer: 1500,
// //         showConfirmButton: false,
// //       });

// //       refreshTable();

// //       setTimeout(() => {
// //         setSelectedRecord({ ...record, templateType: value });
// //       }, 1500);
// //     } catch (error) {
// //       console.error("Error in confirm YES:", error);
// //       Swal.fire("Error", "Something went wrong!", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleConfirmNo = (id, record) => {
// //     setRecords((prev) =>
// //       prev.map((rec) =>
// //         rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
// //       )
// //     );
// //     setSelectedRecord({ ...record, templateType: "Continue Editing" });

// //     Swal.fire({
// //       icon: "info",
// //       title: "Cancelled",
// //       text: "You can continue editing your existing data.",
// //       timer: 1500,
// //       showConfirmButton: false,
// //     });
// //   };

// //   const indexOfLast = currentPage * recordsPerPage;
// //   const indexOfFirst = indexOfLast - recordsPerPage;
// //   const currentRecords = records.slice(indexOfFirst, indexOfLast);
// //   const totalPages = Math.ceil(records.length / recordsPerPage);

// //   return (
// //     <div>
// //       {loading ? (
// //         <div
// //           style={{
// //             display: "flex",
// //             flexDirection: "column",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             height: "400px",
// //             gap: "20px",
// //             color: palette.primary,
// //             fontSize: "18px",
// //           }}
// //         >
// //           <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
// //         </div>
// //       ) : selectedRecord ? (
// //         selectedRecord.templateType === "Continue Editing" ? (
// //           <SaveandHold
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         ) : (
// //           <EmployeeVisitForm
// //             record={selectedRecord}
// //             onClose={() => {
// //               setRecords((prev) =>
// //                 prev.map((rec) =>
// //                   rec.id === selectedRecord.id
// //                     ? { ...rec, templateType: "" }
// //                     : rec
// //                 )
// //               );
// //               setSelectedRecord(null);
// //             }}
// //             onSuccess={refreshTable}
// //           />
// //         )
// //       ) : (
// //         <>
// //           <div style={{ marginBottom: "20px" }}>
// //             <button
// //               onClick={onBack}
// //               style={{
// //                 padding: "10px 20px",
// //                 background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
// //                 color: palette.white,
// //                 borderRadius: "8px",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 fontWeight: "600",
// //                 fontSize: "14px",
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "8px",
// //                 boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
// //                 transition: "all 0.3s ease",
// //               }}
// //             >
// //               <span style={{ fontSize: "16px" }}>←</span>
// //               <span>Back to Previous</span>
// //             </button>
// //           </div>

// //           <GenericTableGrid
// //             data={currentRecords}
// //             columns={columns}
// //             filters={filters}
// //             palette={palette}
// //             emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
// //           />

// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               padding: "12px 20px",
// //               fontSize: "14px",
// //               color: palette.text.secondary,
// //               borderTop: `1px solid ${palette.border}`,
// //               background: palette.white,
// //               marginTop: "10px",
// //               borderRadius: "0 0 12px 12px",
// //             }}
// //           >
// //             <span>
// //               Showing {indexOfFirst + 1}–{Math.min(indexOfLast, records.length)}{" "}
// //               of {records.length}
// //             </span>
// //             <div style={{ display: "flex", gap: "8px" }}>
// //               <button
// //                 disabled={currentPage === 1}
// //                 onClick={() => setCurrentPage((p) => p - 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
// //                   opacity: currentPage === 1 ? 0.5 : 1,
// //                 }}
// //               >
// //                 Prev
// //               </button>
// //               <span>
// //                 Page {currentPage} / {totalPages}
// //               </span>
// //               <button
// //                 disabled={currentPage === totalPages}
// //                 onClick={() => setCurrentPage((p) => p + 1)}
// //                 style={{
// //                   padding: "6px 12px",
// //                   background: palette.white,
// //                   border: `1px solid ${palette.border}`,
// //                   borderRadius: "6px",
// //                   cursor:
// //                     currentPage === totalPages ? "not-allowed" : "pointer",
// //                   opacity: currentPage === totalPages ? 0.5 : 1,
// //                 }}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default OfficeOrderTable;


// import React, { useState, useEffect } from "react";
// import GenericTableGrid from "src/components/ui/TableGrid";
// import EmployeeVisitForm from "./EmployeeVisitForm.js";
// import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
// import Cookies from "js-cookie";
// import {
//   decryptData,
//   validateJsonData,
// } from "src/components/Decryption/Decrypt";
// import FancyCircularLoader from "src/components/ui/Loader";
// import { HostName } from "src/assets/host/Host";
// import Swal from "sweetalert2";

// const OfficeOrderTable = ({ onBack, order, filter }) => {
//   const palette = {
//     primary: "#20639B",
//     darkBlue: "#173F5F",
//     teal: "#3CAEA3",
//     yellow: "#F6D55C",
//     coral: "#ED553B",
//     success: "#3CAEA3",
//     warning: "#F6D55C",
//     border: "#E2E8F0",
//     hover: "#F9FAFB",
//     white: "#FFFFFF",
//     text: { primary: "#1E293B", secondary: "#64748B" },
//   };

//   const [records, setRecords] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const [dropdownOptions, setDropdownOptions] = useState({});
//   const [error, setError] = useState("");
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   // 🔹 PDF VIEWER STATES
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [generating, setGenerating] = useState(false);
//   const [pdfType, setPdfType] = useState(null); // To dynamically set modal title

//   const recordsPerPage = 10;

//   const sessionId = Cookies.get("session_id");
//   const jwtToken = Cookies.get("HRToken");

//   const refreshTable = () => {
//     setRefreshTrigger((prev) => prev + 1);
//   };

//   // 🔹 PDF Viewer Close Logic
//   const closePdfViewer = () => {
//     if (pdfUrl) {
//       URL.revokeObjectURL(pdfUrl);
//       setPdfUrl(null);
//       setPdfType(null);
//     }
//   };

//   // 🔹 Effect for closing PDF on Escape key and controlling body scroll (FIX)
//   useEffect(() => {
//     const closeOnEscape = (e) => {
//       if (e.key === 'Escape' && pdfUrl) {
//         closePdfViewer();
//       }
//     };

//     document.addEventListener('keydown', closeOnEscape);

//     // FIX: Toggle body overflow when modal is open
//     if (pdfUrl) {
//         document.body.style.overflow = 'hidden';
//     } else {
//         document.body.style.overflow = ''; // Restore default
//     }

//     return () => {
//       document.removeEventListener('keydown', closeOnEscape);
//       document.body.style.overflow = ''; // Cleanup on unmount/re-render
//     };
//   }, [pdfUrl]);


//   // 🔹 Helper function to convert base64 to Blob
//   const base64ToBlob = (base64, mimeType) => {
//     const byteCharacters = atob(base64);
//     const byteNumbers = new Array(byteCharacters.length);
//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     return new Blob([byteArray], { type: mimeType });
//   };

//   // 🔹 Function to fetch and display PDF
//   const handleViewPDF = async (employeeid, coverpageno, templatetype) => {
//     try {
//       setGenerating(true);
//       setError("");
//       setPdfUrl(null);
//       setPdfType(null);

//       const jwtToken = Cookies.get("HRToken");
//       if (!jwtToken) throw new Error("Authentication token missing.");

//       // ✅ Request body uses correct templatetype
//       const requestBody = {
//         employeeid: employeeid,
//         coverpageno: coverpageno,
//         templatetype: templatetype,
//       };

//       const response = await fetch(
//         "https://wftest1.iitm.ac.in:8080/api/officeorder/pdf",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch PDF: ${response.status} ${response.statusText}`
//         );
//       }

//       const contentType = response.headers.get("content-type");
//       let pdfObjectUrl = null;

//       if (contentType && contentType.includes("application/pdf")) {
//         const pdfBlob = await response.blob();
//         if (pdfBlob.size === 0) {
//           throw new Error("No PDF found.");
//         }
//         pdfObjectUrl = URL.createObjectURL(pdfBlob);
//       } else if (contentType && contentType.includes("application/json")) {
//         const responseData = await response.json();

//         if (responseData.pdf_data || responseData.pdf_base64) {
//           const pdfBase64 = responseData.pdf_data || responseData.pdf_base64;
//           const base64Data = pdfBase64.replace(
//             /^data:application\/pdf;base64,/,
//             ""
//           );

//           if (!base64Data || base64Data.trim() === "") {
//             throw new Error("No PDF found.");
//           }

//           const pdfBlob = base64ToBlob(base64Data, "application/pdf");
//           pdfObjectUrl = URL.createObjectURL(pdfBlob);
//         } else {
//           throw new Error("No PDF found.");
//         }
//       } else {
//         throw new Error("No PDF found. Received content type: " + contentType);
//       }

//       if (pdfObjectUrl) {
//         setPdfUrl(pdfObjectUrl);
//         setPdfType(templatetype === 'officecopy' ? 'Official Copy' : 'User Copy');
//       } else {
//         throw new Error("Failed to generate PDF URL.");
//       }
//     } catch (err) {
//       console.error("PDF fetch error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "PDF Error",
//         text: err.message || "Failed to load PDF.",
//       });
//     } finally {
//       setGenerating(false);
//     }
//   };

//   // 🔹 MODAL STYLES
//   const styles = {
//     modalOverlay: {
//       position: 'fixed',
//       top: 50,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.7)',
//       zIndex: 1000,
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       backdropFilter: 'blur(3px)',
//     },
//     modalContent: {
//       width: '90%',
//       height: '85%',
//       maxWidth: '1200px',
//       backgroundColor: palette.white,
//       borderRadius: '12px',
//       display: 'flex',
//       flexDirection: 'column',
//       overflow: 'hidden',
//       boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
//       transform: pdfUrl ? 'scale(1)' : 'scale(0.9)',
//       transition: 'transform 0.3s ease-out',
//     },
//   modalHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "20px 28px",
//     borderBottom: "1px solid #e5e7eb",
//   },
//     modalTitle: {
//       margin: 0,
//       fontSize: '18px',
//       fontWeight: '600',
//     },
//     modalActions: {
//       display: 'flex',
//       gap: '10px',
//     },
//      closeButton: {
//     padding: "8px 16px",
//     border: "none",
//     borderRadius: "6px",
//     background: "#ef4444",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "bold",
//   },
//   modalBody: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "0",
//     background: "#f9fafb",
//   },
//     iframe: {
//       width: '100%',
//       height: '100%',
//       border: 'none',
//     }
//   };

//   // 🔹 PDF Viewer Modal Component
//   const PDFViewerModal = ({ pdfUrl, title, onClose }) => {
//     const renderContent = () => (
//       <iframe
//         src={pdfUrl}
//         title={title}
//         style={styles.iframe}
//         frameBorder="0"
//         allowFullScreen
//       />
//     );

//     return (
//       <div style={styles.modalOverlay} onClick={onClose}>
//         <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//           <div style={styles.modalHeader}>
//             <h3 style={styles.modalTitle}>Office Order Preview ({title})</h3>
//             <div style={styles.modalActions}>
//               <button onClick={onClose} style={styles.closeButton}>
//                 ✕ Close
//               </button>
//             </div>
//           </div>
//           <div style={styles.modalBody}>{renderContent()}</div>
//         </div>
//       </div>
//     );
//   };

//   // 🔹 Base table columns
//   let columns = [
//     {
//       key: "id",
//       label: "Id",
//       width: "80px",
//       sortable: true,
//       type: "number",
//       align: "left",
//       render: (item) => (
//         <div style={{ fontWeight: "600", color: palette.primary }}>
//           {item.id}
//         </div>
//       ),
//     },
//     {
//       key: "employeeid",
//       label: "Emp Id",
//       width: "200px",
//       sortable: true,
//       align: "center",
//     },
//     {
//       key: "coverpageno",
//       label: "CoverPageNo",
//       width: "200px",
//       sortable: true,
//       align: "center",
//     },
//     {
//       key: "applicant",
//       label: "Applicant",
//       width: "200px",
//       sortable: true,
//       align: "left",
//       render: (item) => {
//         const parts = (item.applicant || "").split(" / ");
//         const name = parts[0] || "--";
//         const designation = parts[2] || "";
//         return (
//           <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
//             <div style={{ fontWeight: "600" }}>{name}</div>
//             {designation && (
//               <div style={{ fontSize: "12px", color: palette.text.secondary }}>
//                 {designation}
//               </div>
//             )}
//           </div>
//         );
//       },
//     },
//     {
//       key: "department",
//       label: "Department",
//       width: "200px",
//       sortable: true,
//       align: "center",
//     },
//      {
//       key: "claimtype",
//       label: "ClaimType",
//       width: "200px",
//       sortable: true,
//       align: "center",
//     },
//     {
//       key: "status",
//       label: "Status",
//       width: "120px",
//       sortable: true,
//       align: "center",
     
//     },
//   ];

//   // 🔹 Conditionally add Template Type OR Pending With
//   if (filter === "ongoing") {
//     columns.push({
//       key: "pendingwith",
//       label: "Pending",
//       width: "200px",
//       sortable: true,
//       align: "center",
//       render: (item) =>
//         item.assignedto
//           ? item.assignedto
//           : "--",
//     });
//   } else {
//     columns.push({
//       key: "templateType",
//       label: "Template Type",
//       width: "160px",
//       sortable: true,
//       align: "left",
//       render: (item) => (
//         <select
//           value={item.templateType}
//           onChange={(e) => {
//             const selectedValue = e.target.value;
//             handleTemplateChange(item.id, selectedValue);
//           }}
//           onClick={async (e) => {
//             e.stopPropagation();
//             if (dropdownOptions[item.id]) return;

//             try {
//               const body = {
//                 employeeid: item.employeeid,
//                 coverpageno: item.coverpageno,
//                 token: "HRFGVJISOVp1fncC",
//                 session_id: sessionId,
//               };

//               const resp = await fetch(
//                 `${HostName}/OfficeOrder_DropdownValuesHandler`,
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${jwtToken}`,
//                   },
//                   body: JSON.stringify(body),
//                 }
//               );

//               const encData = await resp.json();
//               const decrypted = await decryptData(encData.Data ?? encData.data);
//               const parsed = validateJsonData(decrypted);

//               const options =
//                 parsed?.Data?.Records?.map((rec) => ({
//                   Id: rec.Id,
//                   value: rec.dropdown_value,
//                   label: rec.dropdown_value,
//                 })) || [];

//               setDropdownOptions((prev) => ({
//                 ...prev,
//                 [item.id]: options,
//               }));
//             } catch (err) {
//               console.error("Dropdown fetch error:", err);
//             }
//           }}
//           style={{
//             width: "100%",
//             padding: "6px",
//             borderRadius: "6px",
//             border: `1px solid ${palette.border}`,
//             fontSize: "13px",
//           }}
//         >
//           <option value="">Select</option>
//           {(dropdownOptions[item.id] || []).map((opt, idx) => (
//             <option key={idx} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//       ),
//     });
//   }

//   // 🔹 Always add "Generated Template"
//   columns.push({
//     key: "generatedtemplate",
//     label: "Generated Template",
//     width: "160px",
//     sortable: false,
//     align: "center",
//     render: (item) => {
//       if (filter === "complete") {
//         return (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               gap: "15px",
//               alignItems: "center",
//             }}
//           >
//             {/* Office Order Icon (Enhanced) */}
//             <button
//               onClick={() =>
//                 handleViewPDF(
//                   item.employeeid,
//                   item.coverpageno,
//                   "officecopy" // Payload value for Office Order
//                 )
//               }
//               style={{
//                 backgroundColor: palette.primary,
//                 color: palette.white,
//                 border: `1px solid ${palette.primary}`,
//                 borderRadius: "6px",
//                 cursor: generating ? "wait" : "pointer",
//                 padding: "6px 10px",
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 boxShadow: "0 2px 5px rgba(32, 99, 155, 0.3)",
//                 transition: "all 0.3s ease",
//                 opacity: generating ? 0.6 : 1,
//               }}
//               title="View Office Order Copy"
//               disabled={generating}
//             >
//               📜
//             </button>
//             {/* User Order Icon (Enhanced) */}
//             <button
//               onClick={() =>
//                 handleViewPDF(item.employeeid, item.coverpageno, "usercopy") // Payload value for User Order
//               }
//               style={{
//                 backgroundColor: palette.teal,
//                 color: palette.white,
//                 border: `1px solid ${palette.teal}`,
//                 borderRadius: "6px",
//                 cursor: generating ? "wait" : "pointer",
//                 padding: "6px 10px",
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 boxShadow: "0 2px 5px rgba(60, 190, 163, 0.3)",
//                 transition: "all 0.3s ease",
//                 opacity: generating ? 0.6 : 1,
//               }}
//               title="View User Copy"
//               disabled={generating}
//             >
//               📄
//             </button>
          
//           </div>
//         );
//       }
//       return "--";
//     },
//   });

//   const filters = [
//     {
//       key: "status",
//       label: "All Status",
//       options: [
//         { value: "Approved", label: "Approved" },
//         { value: "Pending", label: "Pending" },
//         { value: "Rejected", label: "Rejected" },
//       ],
//     },
//   ];

//   // 🔹 Fetch Data
//   useEffect(() => {
//     const fetchOfficeOrderDetails = async () => {
//       if (!jwtToken) return;

//       setLoading(true);
//       setProgress(0);

//       try {
//         // Check if filter is one of the specific values
//         const isTaskFilter = ["saveandhold", "ongoing", "complete"].includes(filter);

//         if (isTaskFilter) {
//           // Only call OfficeOrder_taskvisitdetails for these filters
//           const taskBody = {
//             employeeid: Cookies.get("EmpId"),
//             token: "HRFGVJISOVp1fncC",
//             session_id: sessionId,
//             status: filter,
//           };

//           const taskRes = await fetch(
//             `${HostName}/OfficeOrder_taskvisitdetails`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${jwtToken}`,
//               },
//               body: JSON.stringify(taskBody),
//             }
//           );

//           const taskData = await taskRes.json();
//           const decryptedTask = await decryptData(
//             taskData.Data ?? taskData.data
//           );
//           const parsedTask = validateJsonData(decryptedTask);
//           const taskRecords = parsedTask?.Data?.Records ?? [];

//           const formattedTask = taskRecords.map((item, idx) => ({
//             id: item.visit_id || `${idx + 1}`,
//             employeeid: item.employeeid || "--",
//             coverpageno: item.coverpageno || "--",
//             applicant: item.facultyname || item.facultydetails || "--",
//             designation: item.designation || "--",
//             department: item.department || "--",
//             destination: `${item.citytown || ""}, ${item.country || ""}`,
//             status:  "",
//             claimtype: item.claimtype || "",
//             leaveDetails: item.leavedetails || [],
//             templateType: "",
//             visitfrom: item.visitfrom,
//             visitto: item.visitto,
//             natureOfvisit: item.natureofparticipation,
//             country: item.country,
//             city: item.citytown,
//             assignedto: item.assignto,
//             signingauthority: item.signingauthority,
//           }));

//           setRecords(formattedTask);
//           setProgress(100);
//         } else {
//           // For other filters, call the original API
//           const visitDetailsBody = {
//             employeeid: Cookies.get("EmpId"),
//             token: "HRFGVJISOVp1fncC",
//             session_id: sessionId,
//           };

//           const visitRes = await fetch(`${HostName}/OfficeOrder_visitdetails`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${jwtToken}`,
//             },
//             body: JSON.stringify(visitDetailsBody),
//           });

//           const visitData = await visitRes.json();
//           const decryptedVisit = await decryptData(
//             visitData.Data ?? visitData.data
//           );
//           const parsedVisit = validateJsonData(decryptedVisit);
//           const visitRecords = parsedVisit?.Data?.Records ?? [];

//           const formattedVisit = visitRecords.map((item, idx) => ({
//             id: item.visit_id || `${idx + 1}`,
//             employeeid: item.employeeid || "--",
//             coverpageno: item.coverpageno || "--",
//             applicant: item.facultyname || item.facultydetails || "--",
//             designation: item.designation || "--",
//             department: item.department || "--",
//             destination: `${item.citytown || ""}, ${item.country || ""}`,
//             status:  "",
//             claimtype: item.claimtype || "",
//             leaveDetails: item.leavedetails || [],
//             templateType: "",
//             visitfrom: item.visitfrom,
//             visitto: item.visitto,
//             natureOfvisit: item.natureofparticipation_value,
//             country: item.country,
//             city: item.citytown,
//           }));

//           setRecords(formattedVisit);
//           setProgress(50);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching/decrypting:", error);
//         setRecords([]);
//         setProgress(50);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOfficeOrderDetails();
//   }, [jwtToken, sessionId, filter, refreshTrigger]);

//   // 🔹 Handle Template Type change
//   const handleTemplateChange = (id, value) => {
//     const record = records.find((r) => r.id === id);
//     const selectedOption = dropdownOptions[id]?.find(
//       (opt) => opt.value === value
//     );

//     if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
//       Swal.fire({
//         title: "Are you sure?",
//         text: "The existing data will be deleted. Do you want to proceed?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#ED553B",
//         cancelButtonColor: "#6B7280",
//         confirmButtonText: "Yes, Delete",
//         cancelButtonText: "No",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           handleConfirmYes(id, value, record);
//         } else {
//           handleConfirmNo(id, record);
//         }
//       });
//       return;
//     }

//     setRecords((prev) =>
//       prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
//     );

//     if (value) {
//       setSelectedRecord({ ...record, templateType: value });
//     }
//   };

//   const handleConfirmYes = async (id, value, record) => {
//     try {
//       setLoading(true);
//       setError("");

//       const jwtToken = Cookies.get("HRToken");
//       if (!jwtToken) throw new Error("Authentication token missing.");
//       if (!sessionId) throw new Error("Session ID missing.");

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

//       await response.json();

//       Swal.fire({
//         icon: "success",
//         title: "Deleted!",
//         text: "Previous data has been removed. Opening a new form...",
//         timer: 100,
//         showConfirmButton: false,
//       });

//       refreshTable();

//       setTimeout(() => {
//         setSelectedRecord({ ...record, templateType: value });
//       }, 100);
//     } catch (error) {
//       console.error("Error in confirm YES:", error);
//       Swal.fire("Error", "Something went wrong!", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmNo = (id, record) => {
//     setRecords((prev) =>
//       prev.map((rec) =>
//         rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
//       )
//     );
//     setSelectedRecord({ ...record, templateType: "Continue Editing" });

//     Swal.fire({
//       icon: "info",
//       title: "Cancelled",
//       text: "You can continue editing your existing data.",
//       timer: 1500,
//       showConfirmButton: false,
//     });
//   };

//   const indexOfLast = currentPage * recordsPerPage;
//   const indexOfFirst = indexOfLast - recordsPerPage;
//   const currentRecords = records.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(records.length / recordsPerPage);

//   return (
//     <div style={{ width: "100%" }}>
//       {/* 🔹 PDF Viewer Modal */}
//       {pdfUrl && <PDFViewerModal pdfUrl={pdfUrl} title={pdfType} onClose={closePdfViewer} />}
//       {/* 🔹 End of PDF Viewer Modal */}

//       {loading ? (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "400px",
//             gap: "20px",
//             color: palette.primary,
//             fontSize: "18px",
//           }}
//         >
//           <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
//         </div>
//       ) : selectedRecord ? (
//         selectedRecord.templateType === "Continue Editing" ? (
//           <SaveandHold
//             record={selectedRecord}
//             onClose={() => {
//               setRecords((prev) =>
//                 prev.map((rec) =>
//                   rec.id === selectedRecord.id
//                     ? { ...rec, templateType: "" }
//                     : rec
//                 )
//               );
//               setSelectedRecord(null);
//             }}
//             onSuccess={refreshTable}
//           />
//         ) : (
//           <EmployeeVisitForm
//             record={selectedRecord}
//             onClose={() => {
//               setRecords((prev) =>
//                 prev.map((rec) =>
//                   rec.id === selectedRecord.id
//                     ? { ...rec, templateType: "" }
//                     : rec
//                 )
//               );
//               setSelectedRecord(null);
//             }}
//             onSuccess={refreshTable}
//           />
//         )
//       ) : (
//         // The container for the table view (back button, GenericTableGrid, pagination)
//         <div style={{ width: '100%', minWidth: '1400px' }}>
//           <div style={{ marginBottom: "20px" }}>
//             <button
//               onClick={onBack}
//               style={{
//                 padding: "10px 20px",
//                 background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
//                 color: palette.white,
//                 borderRadius: "8px",
//                 border: "none",
//                 cursor: "pointer",
//                 fontWeight: "600",
//                 fontSize: "14px",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <span style={{ fontSize: "16px" }}>←</span>
//               <span>Back to Previous</span>
//             </button>
//           </div>

//           <GenericTableGrid
//             data={currentRecords}
//             columns={columns}
//             filters={filters}
//             palette={palette}
//             emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
//           />

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: "12px 20px",
//               fontSize: "14px",
//               color: palette.text.secondary,
//               borderTop: `1px solid ${palette.border}`,
//               background: palette.white,
//               marginTop: "10px",
//               borderRadius: "0 0 12px 12px",
//             }}
//           >
//             <span>
//               Showing {indexOfFirst + 1}–{Math.min(indexOfLast, records.length)}{" "}
//               of {records.length}
//             </span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 style={{
//                   padding: "6px 12px",
//                   background: palette.white,
//                   border: `1px solid ${palette.border}`,
//                   borderRadius: "6px",
//                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                   opacity: currentPage === 1 ? 0.5 : 1,
//                 }}
//               >
//                 Prev
//               </button>
//               <span>
//                 Page {currentPage} / {totalPages}
//               </span>
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 style={{
//                   padding: "6px 12px",
//                   background: palette.white,
//                   border: `1px solid ${palette.border}`,
//                   borderRadius: "6px",
//                   cursor:
//                     currentPage === totalPages ? "not-allowed" : "pointer",
//                   opacity: currentPage === totalPages ? 0.5 : 1,
//                 }}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OfficeOrderTable;


import React, { useState, useEffect } from "react";
import GenericTableGrid from "src/components/ui/TableGrid";
import EmployeeVisitForm from "./EmployeeVisitForm.js";
import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
import Cookies from "js-cookie";
import {
  decryptData,
  validateJsonData,
} from "src/components/Decryption/Decrypt";
import FancyCircularLoader from "src/components/ui/Loader";
import { HostName } from "src/assets/host/Host";
import Swal from "sweetalert2";

const OfficeOrderTable = ({ onBack, order, filter }) => {
  const palette = {
    primary: "#20639B",
    darkBlue: "#173F5F",
    teal: "#3CAEA3",
    yellow: "#F6D55C",
    coral: "#ED553B",
    success: "#3CAEA3",
    warning: "#F6D55C",
    border: "#E2E8F0",
    hover: "#F9FAFB",
    white: "#FFFFFF",
    text: { primary: "#1E293B", secondary: "#64748B" },
  };

  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 🔹 PDF VIEWER STATES
  const [pdfUrl, setPdfUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [pdfType, setPdfType] = useState(null); // To dynamically set modal title

  const recordsPerPage = 10;

  const sessionId = Cookies.get("session_id");
  const jwtToken = Cookies.get("HRToken");

  const refreshTable = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // 🔹 PDF Viewer Close Logic
  const closePdfViewer = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      setPdfType(null);
    }
  };

  // 🔹 Effect for closing PDF on Escape key and controlling body scroll (FIX)
  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === 'Escape' && pdfUrl) {
        closePdfViewer();
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    // FIX: Toggle body overflow when modal is open
    if (pdfUrl) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = ''; // Restore default
    }

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = ''; // Cleanup on unmount/re-render
    };
  }, [pdfUrl]);


  // 🔹 Helper function to convert base64 to Blob
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // 🔹 Function to fetch and display PDF
  const handleViewPDF = async (employeeid, coverpageno, templatetype) => {
    try {
      setGenerating(true);
      setError("");
      setPdfUrl(null);
      setPdfType(null);

      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");

      // ✅ Request body uses correct templatetype
      const requestBody = {
        employeeid: employeeid,
        coverpageno: coverpageno,
        templatetype: templatetype,
      };

      const response = await fetch(
        "https://wftest1.iitm.ac.in:8080/api/officeorder/pdf",
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
        throw new Error(
          `Failed to fetch PDF: ${response.status} ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      let pdfObjectUrl = null;

      if (contentType && contentType.includes("application/pdf")) {
        const pdfBlob = await response.blob();
        if (pdfBlob.size === 0) {
          throw new Error("No PDF found.");
        }
        pdfObjectUrl = URL.createObjectURL(pdfBlob);
      } else if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();

        if (responseData.pdf_data || responseData.pdf_base64) {
          const pdfBase64 = responseData.pdf_data || responseData.pdf_base64;
          const base64Data = pdfBase64.replace(
            /^data:application\/pdf;base64,/,
            ""
          );

          if (!base64Data || base64Data.trim() === "") {
            throw new Error("No PDF found.");
          }

          const pdfBlob = base64ToBlob(base64Data, "application/pdf");
          pdfObjectUrl = URL.createObjectURL(pdfBlob);
        } else {
          throw new Error("No PDF found.");
        }
      } else {
        throw new Error("No PDF found. Received content type: " + contentType);
      }

      if (pdfObjectUrl) {
        setPdfUrl(pdfObjectUrl);
        setPdfType(templatetype === 'officecopy' ? 'Official Copy' : 'User Copy');
      } else {
        throw new Error("Failed to generate PDF URL.");
      }
    } catch (err) {
      console.error("PDF fetch error:", err);
      Swal.fire({
        icon: "error",
        title: "PDF Error",
        text: err.message || "Failed to load PDF.",
      });
    } finally {
      setGenerating(false);
    }
  };

  // 🔹 MODAL STYLES (Omitted for brevity, see previous block)
  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 50,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(3px)',
    },
    modalContent: {
      width: '90%',
      height: '85%',
      maxWidth: '1200px',
      backgroundColor: palette.white,
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
      transform: pdfUrl ? 'scale(1)' : 'scale(0.9)',
      transition: 'transform 0.3s ease-out',
    },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 28px",
    borderBottom: "1px solid #e5e7eb",
  },
    modalTitle: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '600',
    },
    modalActions: {
      display: 'flex',
      gap: '10px',
    },
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
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
    }
  };

  // 🔹 PDF Viewer Modal Component
  const PDFViewerModal = ({ pdfUrl, title, onClose }) => {
    const renderContent = () => (
      <iframe
        src={pdfUrl}
        title={title}
        style={styles.iframe}
        frameBorder="0"
        allowFullScreen
      />
    );

    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Office Order Preview ({title})</h3>
            <div style={styles.modalActions}>
              <button onClick={onClose} style={styles.closeButton}>
                ✕ Close
              </button>
            </div>
          </div>
          <div style={styles.modalBody}>{renderContent()}</div>
        </div>
      </div>
    );
  };

  // 🔹 Base table columns
  let columns = [
    {
      key: "id",
      label: "Id",
      width: "80px",
      sortable: true,
      type: "number",
      align: "left",
      render: (item) => (
        <div style={{ fontWeight: "600", color: palette.primary }}>
          {item.id}
        </div>
      ),
    },
    {
      key: "employeeid",
      label: "Emp Id",
      width: "200px",
      sortable: true,
      align: "center",
    },
    {
      key: "coverpageno",
      label: "CoverPageNo",
      width: "200px",
      sortable: true,
      align: "center",
    },
    {
      key: "applicant",
      label: "Applicant",
      width: "200px",
      sortable: true,
      align: "left",
      render: (item) => {
        const parts = (item.applicant || "").split(" / ");
        const name = parts[0] || "--";
        const designation = parts[2] || "";
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontWeight: "600" }}>{name}</div>
            {designation && (
              <div style={{ fontSize: "12px", color: palette.text.secondary }}>
                {designation}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "department",
      label: "Department",
      width: "200px",
      sortable: true,
      align: "center",
    },
     {
      key: "claimtype",
      label: "ClaimType",
      width: "200px",
      sortable: true,
      align: "center",
    },
    {
      key: "status",
      label: "Status",
      width: "120px",
      sortable: true,
      align: "center",
     
    },
  ];

  // 🔹 Conditionally add Template Type OR Pending With
  if (filter === "ongoing") {
    columns.push({
      key: "pendingwith",
      label: "Pending",
      width: "200px",
      sortable: true,
      align: "center",
      render: (item) =>
        item.assignedto
          ? item.assignedto
          : "--",
    });
  } else {
    columns.push({
      key: "templateType",
      label: "Template Type",
      width: "160px",
      sortable: true,
      align: "left",
      render: (item) => (
        <select
          value={item.templateType}
          onChange={(e) => {
            const selectedValue = e.target.value;
            handleTemplateChange(item.id, selectedValue);
          }}
          onClick={async (e) => {
            e.stopPropagation();
            if (dropdownOptions[item.id]) return;

            try {
              const body = {
                employeeid: item.employeeid,
                coverpageno: item.coverpageno,
                token: "HRFGVJISOVp1fncC",
                session_id: sessionId,
              };

              const resp = await fetch(
                `${HostName}/OfficeOrder_DropdownValuesHandler`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                  },
                  body: JSON.stringify(body),
                }
              );

              const encData = await resp.json();
              const decrypted = await decryptData(encData.Data ?? encData.data);
              const parsed = validateJsonData(decrypted);

              const options =
                parsed?.Data?.Records?.map((rec) => ({
                  Id: rec.Id,
                  value: rec.dropdown_value,
                  label: rec.dropdown_value,
                })) || [];

              setDropdownOptions((prev) => ({
                ...prev,
                [item.id]: options,
              }));
            } catch (err) {
              console.error("Dropdown fetch error:", err);
            }
          }}
          style={{
            width: "100%",
            padding: "6px",
            borderRadius: "6px",
            border: `1px solid ${palette.border}`,
            fontSize: "13px",
          }}
        >
          <option value="">Select</option>
          {(dropdownOptions[item.id] || []).map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ),
    });
  }

  // 🔹 Always add "Generated Template"
  columns.push({
    key: "generatedtemplate",
    label: "Generated Template",
    width: "160px",
    sortable: false,
    align: "center",
    render: (item) => {
      if (filter === "complete") {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              alignItems: "center",
            }}
          >
            {/* Office Order Icon (Enhanced) */}
            <button
              onClick={() =>
                handleViewPDF(
                  item.employeeid,
                  item.coverpageno,
                  "officecopy" // Payload value for Office Order
                )
              }
              style={{
                backgroundColor: palette.primary,
                color: palette.white,
                border: `1px solid ${palette.primary}`,
                borderRadius: "6px",
                cursor: generating ? "wait" : "pointer",
                padding: "6px 10px",
                fontSize: "14px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 5px rgba(32, 99, 155, 0.3)",
                transition: "all 0.3s ease",
                opacity: generating ? 0.6 : 1,
              }}
              title="View Office Order Copy"
              disabled={generating}
            >
              📜
            </button>
            {/* User Order Icon (Enhanced) */}
            <button
              onClick={() =>
                handleViewPDF(item.employeeid, item.coverpageno, "usercopy") // Payload value for User Order
              }
              style={{
                backgroundColor: palette.teal,
                color: palette.white,
                border: `1px solid ${palette.teal}`,
                borderRadius: "6px",
                cursor: generating ? "wait" : "pointer",
                padding: "6px 10px",
                fontSize: "14px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 5px rgba(60, 190, 163, 0.3)",
                transition: "all 0.3s ease",
                opacity: generating ? 0.6 : 1,
              }}
              title="View User Copy"
              disabled={generating}
            >
              📄
            </button>
          
          </div>
        );
      }
      return "--";
    },
  });

  const filters = [
    {
      key: "status",
      label: "All Status",
      options: [
        { value: "Approved", label: "Approved" },
        { value: "Pending", label: "Pending" },
        { value: "Rejected", label: "Rejected" },
      ],
    },
  ];

  // 🔹 Fetch Data
  useEffect(() => {
    const fetchOfficeOrderDetails = async () => {
      if (!jwtToken) return;

      setLoading(true);
      setProgress(0);

      try {
        // Check if filter is one of the specific values
        const isTaskFilter = ["saveandhold", "ongoing", "complete"].includes(filter);

        if (isTaskFilter) {
          // Only call OfficeOrder_taskvisitdetails for these filters
          const taskBody = {
            employeeid: Cookies.get("EmpId"),
            token: "HRFGVJISOVp1fncC",
            session_id: sessionId,
            status: filter,
          };

          const taskRes = await fetch(
            `${HostName}/OfficeOrder_taskvisitdetails`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
              },
              body: JSON.stringify(taskBody),
            }
          );

          const taskData = await taskRes.json();
          const decryptedTask = await decryptData(
            taskData.Data ?? taskData.data
          );
          const parsedTask = validateJsonData(decryptedTask);
          const taskRecords = parsedTask?.Data?.Records ?? [];

          const formattedTask = taskRecords.map((item, idx) => ({
            id: item.visit_id || `${idx + 1}`,
            employeeid: item.employee_id || "--",
            coverpageno: item.cover_page_no || "--",
            applicant: item.employee_name,
            designation: item.designation || "--",
            department: item.department || "--",
            destination: `${item.citytown || ""}, ${item.country || ""}`,
            status:  "",
            claimtype: item.claim_type || "",
            visitfrom: item.visit_from,
            visitto: item.visit_to,
            natureOfvisit: item.nature_of_visit,
            country: item.country,
            city: item.city_town,
            assignedto: item.assign_to,
            signingauthority: item.to_column,
          }));

          setRecords(formattedTask);
          setProgress(100);
        } else {
          // For other filters, call the original API
          const visitDetailsBody = {
            employeeid: Cookies.get("EmpId"),
            token: "HRFGVJISOVp1fncC",
            session_id: sessionId,
          };

          const visitRes = await fetch(`${HostName}/OfficeOrder_visitdetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(visitDetailsBody),
          });

          const visitData = await visitRes.json();
          const decryptedVisit = await decryptData(
            visitData.Data ?? visitData.data
          );
          const parsedVisit = validateJsonData(decryptedVisit);
          const visitRecords = parsedVisit?.Data?.Records ?? [];

          const formattedVisit = visitRecords.map((item, idx) => ({
            id: item.visit_id || `${idx + 1}`,
            employeeid: item.employeeid || "--",
            coverpageno: item.coverpageno || "--",
            applicant: item.facultyname || item.facultydetails || "--",
            designation: item.designation || "--",
            department: item.department || "--",
            destination: `${item.citytown || ""}, ${item.country || ""}`,
            status:  "",
            claimtype: item.claimtype || "",
            leaveDetails: item.leavedetails || [],
            templateType: "",
            visitfrom: item.visitfrom,
            visitto: item.visitto,
            natureOfvisit: item.natureofparticipation_value,
            country: item.country,
            city: item.citytown,
          }));

          setRecords(formattedVisit);
          setProgress(50);
        }
      } catch (error) {
        console.error("❌ Error fetching/decrypting:", error);
        setRecords([]);
        setProgress(50);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeOrderDetails();
  }, [jwtToken, sessionId, filter, refreshTrigger]);

  // 🔹 Handle Template Type change
  const handleTemplateChange = (id, value) => {
    const record = records.find((r) => r.id === id);
    const selectedOption = dropdownOptions[id]?.find(
      (opt) => opt.value === value
    );

    if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
      Swal.fire({
        title: "Are you sure?",
        text: "The existing data will be deleted. Do you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ED553B",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          handleConfirmYes(id, value, record);
        } else {
          handleConfirmNo(id, record);
        }
      });
      return;
    }

    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
    );

    if (value) {
      setSelectedRecord({ ...record, templateType: value });
    }
  };

  const handleConfirmYes = async (id, value, record) => {
    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!sessionId) throw new Error("Session ID missing.");

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

      await response.json();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Previous data has been removed. Opening a new form...",
        timer: 100,
        showConfirmButton: false,
      });

      refreshTable();

      setTimeout(() => {
        setSelectedRecord({ ...record, templateType: value });
      }, 100);
    } catch (error) {
      console.error("Error in confirm YES:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmNo = (id, record) => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
      )
    );
    setSelectedRecord({ ...record, templateType: "Continue Editing" });

    Swal.fire({
      icon: "info",
      title: "Cancelled",
      text: "You can continue editing your existing data.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  // --- CORRECTED CLOSURE HANDLER ---
  const handleCloseForm = (shouldRefresh) => {
    // 1. Reset form state tracking
    setRecords((prev) =>
        prev.map((rec) =>
        rec.id === selectedRecord?.id
            ? { ...rec, templateType: "" }
            : rec
        )
    );
    
    // 2. Check the return value and refresh if true (from Submit)
    if (shouldRefresh === true) {
        console.log("Form submitted successfully. Refreshing table data via onClose(true).");
        refreshTable();
    }
    
    // 3. Close the form/modal
    setSelectedRecord(null);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* 🔹 PDF Viewer Modal */}
      {pdfUrl && <PDFViewerModal pdfUrl={pdfUrl} title={pdfType} onClose={closePdfViewer} />}
      {/* 🔹 End of PDF Viewer Modal */}

      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
            gap: "20px",
            color: palette.primary,
            fontSize: "18px",
          }}
        >
          <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
        </div>
      ) : selectedRecord ? (
        selectedRecord.templateType === "Continue Editing" ? (
          <SaveandHold
            record={selectedRecord}
            onClose={handleCloseForm} // Use the handler here
            onSuccess={refreshTable}
          />
        ) : (
          <EmployeeVisitForm
            record={selectedRecord}
            onClose={handleCloseForm} // Use the handler here
            onSuccess={refreshTable}
          />
        )
      ) : (
        // The container for the table view (back button, GenericTableGrid, pagination)
        <div style={{ width: '100%', minWidth: '1400px' }}>
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={onBack}
              style={{
                padding: "10px 20px",
                background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
                color: palette.white,
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ fontSize: "16px" }}>←</span>
              <span>Back to Previous</span>
            </button>
          </div>

          <GenericTableGrid
            data={currentRecords}
            columns={columns}
            filters={filters}
            palette={palette}
            emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 20px",
              fontSize: "14px",
              color: palette.text.secondary,
              borderTop: `1px solid ${palette.border}`,
              background: palette.white,
              marginTop: "10px",
              borderRadius: "0 0 12px 12px",
            }}
          >
            <span>
              Showing {indexOfFirst + 1}–{Math.min(indexOfLast, records.length)}{" "}
              of {records.length}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                style={{
                  padding: "6px 12px",
                  background: palette.white,
                  border: `1px solid ${palette.border}`,
                  borderRadius: "6px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                Prev
              </button>
              <span>
                Page {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                style={{
                  padding: "6px 12px",
                  background: palette.white,
                  border: `1px solid ${palette.border}`,
                  borderRadius: "6px",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeOrderTable;