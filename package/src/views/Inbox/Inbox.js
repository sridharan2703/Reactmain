// // import React, { useState, useEffect } from "react";
// // import InboxTable from "./InboxTable";
// // import Cookies from "js-cookie";
// // import {
// //   decryptData,
// //   validateJsonData,
// //   isWebCryptoSupported,
// // } from "src/components/Decryption/Decrypt";

// // /**
// //  * @fileoverview Task Inbox Interface
// //  * A comprehensive task inbox component with advanced UI elements,
// //  * interactive features, and enhanced visual design.
// //  *
// //  * @author Rakshana
// //  * @version 2.0.0
// //  * @since 21 August, 2025
// //  */

// // /**
// //  * @typedef {Object} Task
// //  * @property {number} id - Unique task identifier
// //  * @property {string} coverPageNo - Cover page number
// //  * @property {string} processName - Process name
// //  * @property {string} initiator - Initiator name
// //  * @property {string} status - Current task status
// //  * @property {string} statusColor - Color code for status indicator
// //  * @property {string|null} priority - Task priority level
// //  * @property {string|null} priorityColor - Color code for priority indicator
// //  * @property {string} updatedOn - Last updated date
// //  * @property {number} progress - Progress percentage (0-100)
// //  * @property {boolean} completed - Task completion status
// //  * @property {boolean} favorite - Favorite status
// //  * @property {string} badge - Badge status
// //  */

// // /**
// //  * @typedef {Object} TabItem
// //  * @property {string} name - Tab display name
// //  * @property {string} icon - Tab icon (emoji/unicode)
// //  * @property {number} count - Item count for the tab
// //  */

// // const PageContainer = ({ title, description, children }) => (
// //   <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
// //     {children}
// //   </div>
// // );

// // /**
// //  * Main Task Inbox Component
// //  * Displays a modern, feature-rich task management interface with
// //  * enhanced visual elements, animations, and interactive components.
// //  *
// //  * @component
// //  * @returns {React.ReactElement} The Task Inbox interface
// //  */
// // const Inbox = () => {
// //   /** Active tab state */
// //   const [activeTab, setActiveTab] = useState(0);

// //   /** Expanded groups state */
// //   const [expandedGroups, setExpandedGroups] = useState({ "front-end": true });

// //   /** View mode state */
// //   const [viewMode, setViewMode] = useState("table");

// //   /** Selected tasks state */
// //   const [selectedTasks, setSelectedTasks] = useState(new Set());

// //   /** Mobile menu state */
// //   const [showMobileMenu, setShowMobileMenu] = useState(false);

// //   /** Pagination state */
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [tasksPerPage, setTasksPerPage] = useState(10);

// //   /** Tasks state for dynamic updates */
// //   const [tasks, setTasks] = useState([]);

// //   /** Loading and error states */
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //     const tabs = [
// //     { name: "All task", icon: "📋", count: 7 },
// //     { name: "MM FACGROUP", icon: "👥", count: 12 },
// //     { name: "IITM FOW", icon: "⚙️", count: 3 },
// //     { name: "IITM PRB", icon: "📊", count: 0 },
// //     { name: "IITM CCCOM", icon: "💬", count: 5 },
// //     { name: "IITM EMPLOYEES", icon: "👤", count: 24 },
// //   ];
// //   /**
// //    * Fetch tasks from API
// //    */
// // /**
// //  * Fetch tasks from API with improved error handling and data parsing
// //  */
// // const fetchTasks = async () => {
// //   try {
// //     setLoading(true);
// //     setError(null);
// //     if (!isWebCryptoSupported()) {
// //       throw new Error("Web Crypto API is not supported in this browser.");
// //     }

// //     const headers = await getAuthHeaders();
// //     const API_BASE_URL = "https://wftest1.iitm.ac.in:5000"; // Make sure this matches your actual API URL
// //     const API_TOKEN = "HRFGVJISOVp1fncC"; // Make sure this matches your actual token

// //     console.log("Making API request with:", {
// //       url: `${API_BASE_URL}/TaskInbox`,
// //       empid: Cookies.get("EmpId"),
// //     });

// //     const taskResponse = await fetch(`${API_BASE_URL}/TaskInbox`, {
// //       method: "POST",
// //       headers,
// //       body: JSON.stringify({
// //         token: API_TOKEN,
// //         empid: Cookies.get("EmpId"),
// //         assignedrole: null,
// //       }),
// //     });

// //     if (!taskResponse.ok) {
// //       throw new Error(`HTTP error! status: ${taskResponse.status} - ${taskResponse.statusText}`);
// //     }

// //     const taskData = await taskResponse.json();
// //     console.log("Raw API Response:", taskData);

// //     if (!taskData.Data) {
// //       console.warn("No Data field in API response:", taskData);
// //       setTasks([]);
// //       return;
// //     }
// //     const decryptedTaskData = await decryptData(taskData.Data);
// //     console.log("Decrypted Task Data:", decryptedTaskData);
// //     const isValid = validateJsonData(decryptedTaskData);
// //     console.log("Validation Result:", isValid);

// //     if (!isValid) {
// //       console.warn("Data validation failed:", decryptedTaskData);
// //       setTasks([]);
// //       return;
// //     }
// //     const taskRecords = safeDataAccess(decryptedTaskData);
// //     console.log("Task Records:", taskRecords);
// //     console.log("Task Records Length:", taskRecords.length);

// //     if (!Array.isArray(taskRecords) || taskRecords.length === 0) {
// //       console.warn("No valid task records found");
// //       setTasks([]);
// //       return;
// //     }
// //     if (taskRecords.length > 0) {
// //       console.log("First record structure:", taskRecords[0]);
// //     }
// //     const mappedTasks = taskRecords.map((item, index) => {
// //       console.log(`Mapping task ${index}:`, item);

// //       const mappedTask = {
// //         id: item.taskid || item.id || index,
// //         coverPageNo: item.coverpageno || item.coverPageNo || '',
// //         trackId: generateTrackId(item, index),
// //         processName: item.processname || item.processName || 'Unknown Process',
// //         initiator: item.updatedby || item.initiator || item.createdby || "Unknown User",
// //         status: item.status || "In Progress",
// //         statusColor: "#F59E0B", // You can create a status color mapping function similar to priority
// //         priority: getPriorityFromValue(item.priority),
// //         priorityColor: "#F59E0B", // You can create a priority color mapping function
// //         updated: formatDate(item.updatedon || item.updatedOn),
// //         updatedOn: item.updatedon || item.updatedOn || new Date().toISOString(),
// //         progress: item.progress || Math.floor(Math.random() * 100),
// //         completed: item.completed === "1" || item.completed === 1 || item.completed === true || false,
// //         favorite: item.starred === "1" || item.starred === 1 || item.favorite === true || false,
// //         badge: getBadgeFromValue(item.badge || item.status),
// //       };

// //       console.log(`Mapped task ${index}:`, mappedTask);
// //       return mappedTask;
// //     });

// //     console.log("Final Mapped Tasks:", mappedTasks);
// //     setTasks(mappedTasks);

// //   } catch (err) {
// //     console.error("Error fetching tasks:", err);
// //     setError(`Failed to fetch tasks: ${err.message}`);
// //     setTasks([]); // Ensure tasks is always an array
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// // const getStatusColor = (status) => {
// //   const statusColors = {
// //     "In Progress": "#F59E0B",
// //     "Completed": "#10B981",
// //     "Pending": "#EF4444",
// //     "On Hold": "#6B7280",
// //   };
// //   return statusColors[status] || "#F59E0B";
// // };

// // const getPriorityText = (priority) => {
// //   const priorityMap = {
// //     "1": "Low",
// //     "2": "Medium",
// //     "3": "High",
// //     "17": "Medium", // Based on your data
// //   };
// //   return priorityMap[String(priority)] || "Medium";
// // };

// // const getPriorityColor = (priority) => {
// //   const priorityColors = {
// //     "1": "#10B981", // Low - Green
// //     "2": "#F59E0B", // Medium - Yellow
// //     "3": "#EF4444", // High - Red
// //     "17": "#F59E0B", // Medium - Yellow
// //   };
// //   return priorityColors[String(priority)] || "#F59E0B";
// // };

// // const getBadgeText = (badge) => {
// //   const badgeMap = {
// //     "11": "Later",
// //     "1": "Urgent",
// //     "2": "Normal",
// //   };
// //   return badgeMap[String(badge)] || "Later";
// // };

// // const formatDate = (dateString) => {
// //   if (!dateString) return new Date().toLocaleDateString("en-US", {
// //     month: "short",
// //     day: "numeric",
// //     year: "numeric",
// //   });

// //   try {
// //     return new Date(dateString).toLocaleDateString("en-US", {
// //       month: "short",
// //       day: "numeric",
// //       year: "numeric",
// //     });
// //   } catch (error) {
// //     console.warn("Invalid date format:", dateString);
// //     return "Invalid Date";
// //   }
// // };

// //   useEffect(() => {
// //     fetchTasks();
// //   }, []);

// //   /**
// //    * Toggle group expansion state
// //    * @param {string} groupName - Name of the group to toggle
// //    */
// //   const toggleGroup = (groupName) => {
// //     setExpandedGroups((prev) => ({
// //       ...prev,
// //       [groupName]: !prev[groupName],
// //     }));
// //   };

// //   /**
// //    * Toggle task selection
// //    * @param {number} taskId - ID of the task to toggle
// //    */
// //   const toggleTaskSelection = (taskId) => {
// //     setSelectedTasks((prev) => {
// //       const newSet = new Set(prev);
// //       if (newSet.has(taskId)) {
// //         newSet.delete(taskId);
// //       } else {
// //         newSet.add(taskId);
// //       }
// //       return newSet;
// //     });
// //   };

// //   /**
// //    * Toggle task favorite status
// //    * @param {number} taskId - ID of the task to toggle favorite
// //    */
// //   const toggleFavorite = (taskId) => {
// //     setTasks((prev) =>
// //       prev.map((task) =>
// //         task.id === taskId ? { ...task, favorite: !task.favorite } : task
// //       )
// //     );
// //   };

// //   /**
// //    * Change task badge
// //    * @param {number} taskId - ID of the task
// //    * @param {string} newBadge - New badge value
// //    */
// //   const changeBadge = (taskId, newBadge) => {
// //     setTasks((prev) =>
// //       prev.map((task) =>
// //         task.id === taskId ? { ...task, badge: newBadge } : task
// //       )
// //     );
// //   };

// //   /**
// //    * Handle page change for pagination
// //    * @param {number} pageNumber - New page number
// //    */
// //   const handlePageChange = (pageNumber) => {
// //     setCurrentPage(pageNumber);
// //   };

// //   /**
// //    * Handle tasks per page change
// //    * @param {number} newTasksPerPage - New tasks per page value
// //    */
// //   const handleTasksPerPageChange = (newTasksPerPage) => {
// //     setTasksPerPage(newTasksPerPage);
// //     setCurrentPage(1);
// //   };

// //   /**
// //    * Modern button styles configuration
// //    */
// //   const buttonStyles = {
// //     primary: {
// //       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //       color: "white",
// //       border: "none",
// //       padding: "10px 16px",
// //       borderRadius: "10px",
// //       cursor: "pointer",
// //       display: "flex",
// //       alignItems: "center",
// //       gap: "6px",
// //       fontSize: "12px",
// //       fontWeight: "600",
// //       transition: "all 0.3s ease",
// //       minHeight: "40px",
// //     },
// //     secondary: {
// //       background: "rgba(255, 255, 255, 0.9)",
// //       color: "#6B7280",
// //       border: "1px solid #E5E7EB",
// //       padding: "8px 14px",
// //       borderRadius: "10px",
// //       cursor: "pointer",
// //       display: "flex",
// //       alignItems: "center",
// //       gap: "6px",
// //       fontSize: "12px",
// //       fontWeight: "500",
// //       transition: "all 0.3s ease",
// //       minHeight: "40px",
// //     },
// //     chip: {
// //       background: "rgba(255, 255, 255, 0.8)",
// //       color: "#4B5563",
// //       border: "1px solid #D1D5DB",
// //       padding: "6px 12px",
// //       borderRadius: "16px",
// //       fontSize: "11px",
// //       fontWeight: "500",
// //       transition: "all 0.2s ease",
// //       whiteSpace: "nowrap",
// //     },
// //   };

// //   const isMobile = window.innerWidth <= 768;

// //   return (
// //     <PageContainer title="Task Inbox" description="Modern Task Management Interface">
// //       <div
// //         style={{
// //           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //           height: "90vh",
// //           padding: 0,
// //           margin: 0,
// //           display: "flex",
// //           flexDirection: "column",
// //         }}
// //       >
// //         {/* Main Container */}
// //         <div
// //           style={{
// //             background: "rgba(255, 255, 255, 0.95)",
// //             height: "100vh",
// //             display: "flex",
// //             flexDirection: "column",
// //           }}
// //         >
// //           {/* Header Section */}
// //           <div
// //             style={{
// //               background: "white",
// //               borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
// //               padding: "0 16px",
// //               flexShrink: 0,
// //             }}
// //           >
// //             {/* Mobile Header */}
// //             {isMobile && (
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "space-between",
// //                   alignItems: "center",
// //                   padding: "12px 0",
// //                 }}
// //               >
// //                 <button
// //                   onClick={() => setShowMobileMenu(!showMobileMenu)}
// //                   style={{
// //                     background: "none",
// //                     border: "none",
// //                     fontSize: "20px",
// //                     cursor: "pointer",
// //                   }}
// //                 >
// //                   {showMobileMenu ? "✕" : "☰"}
// //                 </button>
// //               </div>
// //             )}

// //             {/* Navigation Tabs */}
// //             <div
// //               style={{
// //                 display: "flex",
// //                 gap: "0",
// //                 overflowX: "auto",
// //                 ...(isMobile && showMobileMenu
// //                   ? {
// //                       flexDirection: "column",
// //                       position: "absolute",
// //                       top: "100%",
// //                       left: 0,
// //                       right: 0,
// //                       background: "white",
// //                       zIndex: 100,
// //                     }
// //                   : {}),
// //               }}
// //             >
// //               {tabs.map((tab, index) => (
// //                 <button
// //                   key={index}
// //                   onClick={() => {
// //                     setActiveTab(index);
// //                     if (isMobile) setShowMobileMenu(false);
// //                   }}
// //                   style={{
// //                     background: "none",
// //                     border: "none",
// //                     padding: isMobile ? "16px 20px" : "12px 16px",
// //                     fontSize: "14px",
// //                     fontWeight: "600",
// //                     cursor: "pointer",
// //                     borderBottom:
// //                       activeTab === index
// //                         ? "3px solid #667eea"
// //                         : "3px solid transparent",
// //                     color: activeTab === index ? "#667eea" : "#6B7280",
// //                     transition: "all 0.3s ease",
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: "6px",
// //                     position: "relative",
// //                     whiteSpace: "nowrap",
// //                     minWidth: isMobile ? "100%" : "auto",
// //                     justifyContent: isMobile ? "flex-start" : "center",
// //                   }}
// //                   onMouseEnter={(e) => {
// //                     if (activeTab !== index && !isMobile) {
// //                       e.target.style.color = "#4B5563";
// //                       e.target.style.background = "rgba(102, 126, 234, 0.05)";
// //                     }
// //                   }}
// //                   onMouseLeave={(e) => {
// //                     if (activeTab !== index && !isMobile) {
// //                       e.target.style.color = "#6B7280";
// //                       e.target.style.background = "none";
// //                     }
// //                   }}
// //                 >
// //                   <span style={{ fontSize: "16px" }}>{tab.icon}</span>
// //                   {tab.name}
// //                   {tab.count > 0 && (
// //                     <span
// //                       style={{
// //                         background:
// //                           activeTab === index
// //                             ? "linear-gradient(135deg, #667eea, #764ba2)"
// //                             : "#9CA3AF",
// //                         color: "white",
// //                         fontSize: "10px",
// //                         fontWeight: "700",
// //                         padding: "2px 6px",
// //                         borderRadius: "10px",
// //                         minWidth: "16px",
// //                         textAlign: "center",
// //                       }}
// //                     >
// //                       {tab.count}
// //                     </span>
// //                   )}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Action Bar */}
// //           <div
// //             style={{
// //               display: "flex",
// //               flexDirection: isMobile ? "column" : "row",
// //               alignItems: isMobile ? "stretch" : "center",
// //               justifyContent: "space-between",
// //               padding: isMobile ? "12px" : "16px 24px",
// //               background: "rgba(249, 250, 251, 0.8)",
// //               borderBottom: "1px solid rgba(229, 231, 235, 0.6)",
// //               gap: isMobile ? "8px" : "0",
// //               flexShrink: 0,
// //             }}
// //           >
// //             <div
// //               style={{
// //                 display: "flex",
// //                 gap: "8px",
// //                 alignItems: "center",
// //                 justifyContent: isMobile ? "center" : "flex-start",
// //                 flexWrap: "wrap",
// //               }}
// //             >
// //               <input
// //                 type="text"
// //                 placeholder="Search tasks..."
// //                 style={{
// //                   padding: "8px 12px",
// //                   border: "1px solid #E5E7EB",
// //                   borderRadius: "8px",
// //                   fontSize: "14px",
// //                   minWidth: "200px",
// //                 }}
// //               />
// //             </div>

// //             <div
// //               style={{
// //                 display: "flex",
// //                 alignItems: "center",
// //                 gap: "8px",
// //                 justifyContent: isMobile ? "center" : "flex-end",
// //                 flexWrap: "wrap",
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   gap: "6px",
// //                   flexWrap: "wrap",
// //                   justifyContent: "center",
// //                 }}
// //               >
// //                 {["Task List", "Priority"].map((filter) => (
// //                   <span
// //                     key={filter}
// //                     style={{
// //                       ...buttonStyles.chip,
// //                       cursor: "pointer",
// //                       fontSize: isMobile ? "10px" : "11px",
// //                       padding: isMobile ? "4px 8px" : "6px 12px",
// //                     }}
// //                     onMouseEnter={(e) => {
// //                       if (!isMobile) {
// //                         e.target.style.background = "rgba(102, 126, 234, 0.1)";
// //                         e.target.style.borderColor = "#667eea";
// //                         e.target.style.color = "#667eea";
// //                       }
// //                     }}
// //                     onMouseLeave={(e) => {
// //                       if (!isMobile) {
// //                         e.target.style.background = "rgba(255, 255, 255, 0.8)";
// //                         e.target.style.borderColor = "#D1D5DB";
// //                         e.target.style.color = "#4B5563";
// //                       }
// //                     }}
// //                   >
// //                     {filter}
// //                   </span>
// //                 ))}
// //               </div>

// //               <div style={{ display: "flex", gap: "8px" }}>
// //                 <button
// //                   style={{
// //                     ...buttonStyles.secondary,
// //                     padding: "8px",
// //                   }}
// //                   onMouseEnter={(e) => {
// //                     if (!isMobile) {
// //                       e.target.style.borderColor = "#667eea";
// //                       e.target.style.color = "#667eea";
// //                     }
// //                   }}
// //                   onMouseLeave={(e) => {
// //                     if (!isMobile) {
// //                       e.target.style.borderColor = "#E5E7EB";
// //                       e.target.style.color = "#6B7280";
// //                     }
// //                   }}
// //                 >
// //                   ⋯
// //                 </button>

// //                 <button
// //                   style={buttonStyles.secondary}
// //                   onMouseEnter={(e) => {
// //                     if (!isMobile) {
// //                       e.target.style.borderColor = "#667eea";
// //                       e.target.style.color = "#667eea";
// //                     }
// //                   }}
// //                   onMouseLeave={(e) => {
// //                     if (!isMobile) {
// //                       e.target.style.borderColor = "#E5E7EB";
// //                       e.target.style.color = "#6B7280";
// //                     }
// //                   }}
// //                 >
// //                   <span>🗃️</span>
// //                   {!isMobile && "Export"}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Task Table Component */}
// //           <InboxTable
// //             tasks={tasks}
// //             onToggleFavorite={toggleFavorite}
// //             onBadgeChange={changeBadge}
// //             selectedTasks={selectedTasks}
// //             onToggleTaskSelection={toggleTaskSelection}
// //             expandedGroups={expandedGroups}
// //             currentPage={currentPage}
// //             tasksPerPage={tasksPerPage}
// //             onPageChange={handlePageChange}
// //             onTasksPerPageChange={handleTasksPerPageChange}
// //             loading={loading}
// //             error={error}
// //           />
// //         </div>
// //       </div>
// //     </PageContainer>
// //   );
// // };

// // export default Inbox;

// import React, { useState } from "react";
// import InboxTable from "./InboxTable";

// /**
//  * @fileoverview Task Inbox Interface
//  * Wrapper around InboxTable, responsible only for layout and navigation.
//  */

// const PageContainer = ({ children }) => (
//   <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
//     {children}
//   </div>
// );

// const Inbox = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   const tabs = [
//     { name: "All task", icon: "📋", count: 7 },
//     { name: "MM FACGROUP", icon: "👥", count: 12 },
//     { name: "IITM FOW", icon: "⚙️", count: 3 },
//     { name: "IITM PRB", icon: "📊", count: 0 },
//     { name: "IITM CCCOM", icon: "💬", count: 5 },
//     { name: "IITM EMPLOYEES", icon: "👤", count: 24 },
//   ];

//   const isMobile = window.innerWidth <= 768;

//   return (
//     <PageContainer>
//       <div
//         style={{
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           height: "90vh",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <div
//           style={{
//             background: "rgba(255, 255, 255, 0.95)",
//             height: "100vh",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* Header Section */}
//           <div
//             style={{
//               background: "white",
//               borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
//               padding: "0 16px",
//               flexShrink: 0,
//             }}
//           >
//             {/* Mobile Header */}
//             {isMobile && (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   padding: "12px 0",
//                 }}
//               >
//                 <button
//                   onClick={() => setShowMobileMenu(!showMobileMenu)}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     fontSize: "20px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {showMobileMenu ? "✕" : "☰"}
//                 </button>
//               </div>
//             )}

//             {/* Navigation Tabs */}
//             <div
//               style={{
//                 display: "flex",
//                 overflowX: "auto",
//                 ...(isMobile && showMobileMenu
//                   ? {
//                       flexDirection: "column",
//                       position: "absolute",
//                       top: "100%",
//                       left: 0,
//                       right: 0,
//                       background: "white",
//                       zIndex: 100,
//                     }
//                   : {}),
//               }}
//             >
//               {tabs.map((tab, index) => (
//                 <button
//                   key={index}
//                   onClick={() => {
//                     setActiveTab(index);
//                     if (isMobile) setShowMobileMenu(false);
//                   }}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     padding: isMobile ? "16px 20px" : "12px 16px",
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     cursor: "pointer",
//                     borderBottom:
//                       activeTab === index
//                         ? "3px solid #667eea"
//                         : "3px solid transparent",
//                     color: activeTab === index ? "#667eea" : "#6B7280",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   <span style={{ fontSize: "16px" }}>{tab.icon}</span>
//                   {tab.name}
//                   {tab.count > 0 && (
//                     <span
//                       style={{
//                         background:
//                           activeTab === index
//                             ? "linear-gradient(135deg, #667eea, #764ba2)"
//                             : "#9CA3AF",
//                         color: "white",
//                         fontSize: "10px",
//                         fontWeight: "700",
//                         padding: "2px 6px",
//                         borderRadius: "10px",
//                         minWidth: "16px",
//                         textAlign: "center",
//                       }}
//                     >
//                       {tab.count}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Task Table lives fully inside InboxTable */}
//           <InboxTable />
//         </div>
//       </div>
//     </PageContainer>
//   );
// };

// export default Inbox;

import React, { useState, useEffect, useCallback } from "react";
import InboxTable from "./InboxTable";
import Cookies from 'js-cookie';
import {
  decryptData,
  validateJsonData,

} from 'src/components/Decryption/Decrypt';

const API_BASE_URL = "https://wftest1.iitm.ac.in:5000";
const API_TOKEN = "HRFGVJISOVp1fncC";

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };


const getLoginName = () => {
  const loginName =
    sessionStorage.getItem("username") ||
    localStorage.getItem("username") ||
    getCookie("username");
  return loginName;
};


const getAuthHeaders = async () => {
  const encryptedToken = Cookies.get('HRToken');
     
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${encryptedToken}`,
  };
};

const PageContainer = ({ children }) => (
  <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
    {children}
  </div>
);

const Inbox = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMobile = window.innerWidth <= 768;

  const fetchRoleData = useCallback(async () => {
    if (!crypto?.subtle) {
      setError("Web Crypto API not supported in this browser");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loginName = getLoginName();
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Defaultrole`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          token: API_TOKEN,
          UserName: loginName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const encryptedData = await response.json();

      if (!encryptedData.Data) {
        throw new Error("No encrypted data received from API");
      }

      const decryptedData = await decryptData(encryptedData.Data);
      const parsedData = validateJsonData(decryptedData);

      if (parsedData.Status === 200 && parsedData.Data) {
        const activeRoles = parsedData.Data.Records.filter(
          (role) => role.IsActive === "true"
        );
        setRoleData(activeRoles);

        const savedRole = getCookie("selectedRole");
        if (
          savedRole &&
          activeRoles.some((role) => role.RoleName === savedRole)
        ) {
          setActiveTab(
            activeRoles.findIndex((role) => role.RoleName === savedRole)
          );
        } else if (activeRoles.length > 0) {
          const defaultRole = activeRoles[0].RoleName;
          setActiveTab(0);
          setCookie("selectedRole", defaultRole);
        }
      } else {
        throw new Error(parsedData.message || "Failed to fetch role data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoleData();
  }, [fetchRoleData]);

  // Map API data to tab structure
  const tabs = roleData.map((role, index) => ({
    name: role.RoleName,
    icon: role.Icon || "📋", // Use role-specific icon if available, fallback to default
    count: role.Count || 0, // Use count from API if available, fallback to 0
  }));

  return (
    <PageContainer>
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              background: "white",
              borderBottom: "1px solid rgba(229, 231, 235, 0.8Wet )",
              padding: "0 16px",
              flexShrink: 0,
            }}
          >
            {/* Mobile Header */}
            {isMobile && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                }}
              >
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  {showMobileMenu ? "✕" : "☰"}
                </button>
              </div>
            )}

            {/* Navigation Tabs */}
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div style={{ color: "red", padding: "12px" }}>{error}</div>
            ) : (
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  ...(isMobile && showMobileMenu
                    ? {
                        flexDirection: "column",
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "white",
                        zIndex: 100,
                      }
                    : {}),
                }}
              >
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTab(index);
                      if (isMobile) setShowMobileMenu(false);
                      setCookie("selectedRole", tab.name);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: isMobile ? "16px 20px" : "12px 16px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      borderBottom:
                        activeTab === index
                          ? "3px solid #667eea"
                          : "3px solid transparent",
                      color: activeTab === index ? "#667eea" : "#6B7280",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{tab.icon}</span>
                    {tab.name}
                    {tab.count > 0 && (
                      <span
                        style={{
                          background:
                            activeTab === index
                              ? "linear-gradient(135deg, #667eea, #764ba2)"
                              : "#9CA3AF",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          minWidth: "16px",
                          textAlign: "center",
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Task Table lives fully inside InboxTable */}
          {!loading && !error && (
            <InboxTable activeRole={tabs[activeTab]?.name} />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Inbox;
