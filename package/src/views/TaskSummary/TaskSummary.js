/**
 * @fileoverview Compact TaskSummary component with API Integration
 * @module components/TaskSummary
 * @author Elakiya
 * @date 24/08/2025
 */

import React, { useState, useEffect } from 'react';
import { Search, X, ListChecks , CircleUser , SquarePen , Trash2, AlertTriangle , Flag, CircleCheck , RotateCcw, BadgeCheck , Filter, ArrowUpDown,Award  } from 'lucide-react';
import TaskDialog from './TaskDialog';

// =========================================================================
// !!! WARNING: REPLACE WITH ACTUAL PROJECT IMPORTS !!!
// These imports assume the project structure and dependencies exist.
// =========================================================================
import Cookies from "js-cookie"; // External library for cookie access
import { HostName } from "src/assets/host/Host"; // Hostname from project config
import { 
    decryptData, 
    encryptPayloadForGo,
} from "src/components/Encryption/EncryptionKey"; // The user's provided encryption module

// =========================================================================

// --- API Endpoints ---
const TASK_SUMMARY_ENDPOINT = '/TaskSummary';
const TASK_DETAIL_ENDPOINT = '/OfficeOrder_Tasksummary'; // Detail endpoint for the dialog


// --- API Filter ID Mappings (Based on user request) ---
const STATUS_TO_API_ID = {
  'Completed': 3,
  'On Going': 4,
  'Saved as Draft': 6,
  'Deleted': 1, 
  'Pending': 5, 
  'all': null
};

const PRIORITY_TO_API_ID = {
    'normal': 17,
    'high': 18,
    'critical': 19,
    'all': null
}

// --- Helper for Auth Headers ---
const getAuthHeaders = () => {
  const token = Cookies.get("HRToken");
  if (!token) {
    const error = new Error("No authentication token found");
    error.userMessage = "Your session has expired. Please log in again.";
    throw error;
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// --- Dynamic ID Retrieval Functions (Use `Cookies.get` now) ---
const getSessionId = () => {
    return Cookies.get('session_id');
};

const getEmployeeId = () => {
    return Cookies.get('EmpId');
};


// Color mapping for status
const statusColorMap = {
    'Completed': '#10b981',
    'On Going': '#3b82f6',
    'Saved as Draft': '#6b7280',
    'Deleted': '#CD2C58',
    'Cancelled': '#CD2C58', 
    'Pending': '#f59e0b', 
    'ongoing': '#3b82f6', 
};

// Helper function to create Assignee/Initiator object
const createAssignee = (name, role, department = 'N/A') => ({
    name: name || 'N/A',
    role: role || 'N/A',
    department: department || 'N/A',
});

/**
 * Transforms a single API task object into the structure expected by TaskCard.
 */

const mapApiTaskToTaskCard = (apiTask) => {
    const statusDesc = apiTask.task_status_desc;
    const priorityDesc = (apiTask.priority_desc || 'normal').toLowerCase(); 
    const statusColor = statusColorMap[statusDesc] || statusColorMap[statusDesc.toLowerCase()] || '#6b7280'; 
    
    // FIX 1: Use 'pending' field for assignee name, default role to 'N/A'
    const assigneeName = apiTask.pending;
    
    // FIX 2: Use 'elapsed_days' field for elapsed time display. Format it.
    const elapsedDays = apiTask.elapsed_days !== undefined && apiTask.elapsed_days !== null 
                        ? `${apiTask.elapsed_days} Days` 
                        : 'N/A';
    
    // FIX 3: Map 'updated_on' to both completedDate and deletedDate.
    // The TaskCard component will handle which one to display based on status.
    const lastUpdateDate = apiTask.updated_on || undefined;


    return {
        // Essential fields for API detail call
        process_id: apiTask.process_id,
        task_id: apiTask.task_id, 
        
        // FIX: Robust mapping for order_no from summary API
        // This will now be overwritten by the detail API call in fetchTasksFromApi
        order_no: apiTask.order_no || apiTask.OfficeOrderNo || apiTask.reference_no || null,
        
        // Fields for Card Display
        id: apiTask.task_id,
        title: apiTask.process_name,
        priority: priorityDesc, 
        status: statusDesc, // Keep the original casing from API for display
        statusColor: statusColor,
        bgColor: `${statusColor}15`, 
        borderColor: statusColor,
        initiated: apiTask.initiated_on,
        
        // FIXED: Map updated_on directly. The TaskCard decides if the status matches.
        completedDate: lastUpdateDate, 
        deletedDate: lastUpdateDate, 
        
        employeeId: apiTask.employee_id,
        dateOfAppointment: apiTask.date_of_appointment,
        
        // Correctly populated assignee object for "Pending With"
        assignee: createAssignee(assigneeName, 'N/A'), // Role is N/A from summary API for 'pending' field
        initiator: createAssignee(apiTask.initiated_name, 'Initiator', 'N/A'),
        
        // FIXED: Populated from API
        elapsed: elapsedDays, 
        rating: 5, 
    };
};
// [Tooltip Component - Unchanged]
const Tooltip = ({ children, text }) => { 
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          pointerEvents: 'none',
        }}>
          {text}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid #1f2937',
          }} />
        </div>
      )}
    </div>
  );
};
// [TaskCard Component - MODIFIED for correct order_no display]
const TaskCard = ({ task, getPriorityStyles, openDialog }) => {
  const priorityStyles = getPriorityStyles(task.priority);
  const cardStyles = {
    card: {
      backgroundColor: priorityStyles.backgroundColor,
      borderRadius: '8px',
      padding: '14px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      backdropFilter: 'blur(10px)',
      minHeight: '250px',
      display: 'flex',
      flexDirection: 'column',
    },
    cardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
      border: `1px solid ${priorityStyles.color}`,
    },
    priorityBadge: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      padding: '3px 8px',
      borderRadius: '16px',
      fontSize: '10px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      ...priorityStyles,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    statusBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, ${priorityStyles.color}, ${priorityStyles.color}80)`,
    },
    title: { 
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      // FIX: Set margin-bottom to a clear value to allow the contentArea border to stand out
      marginBottom: '10px', 
      marginTop: '0',
      paddingRight: '50px',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      minHeight: '40px',
    },
    contentArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    infoRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      fontSize: '13px',
      color: '#6b7280',
    },
    infoLabel: {
      fontWeight: '600',
      color: '#374151',
      minWidth: '85px',
      flexShrink: 0,
      paddingTop: '2px',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 8px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      backgroundColor: task.bgColor || `${task.statusColor}15`,
      color: task.statusColor,
      border: `1px solid ${task.statusColor}20`,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    avatar: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: '#4F86ED',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '10px',
      flexShrink: 0,
      boxShadow: '0 2px 6px rgba(79, 134, 237, 0.25)',
    },
    assigneeInfo: {
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    assigneeName: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#111827',
      lineHeight: '1.3',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    assigneeRole: {
      fontSize: '10px',
      color: '#9ca3af',
      lineHeight: '1.3',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: '3px',
      paddingTop: '3px',
      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    },
    rating: {
      display: 'flex',
      gap: '2px',
    },
  };

  const [isHovered, setIsHovered] = useState(false);
  const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('');

  const renderRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          fontSize: '15px',
          color: rating >= i + 1 ? '#fbbf24' : '#d1d5db',
        }}
      >
        {rating >= i + 1 ? '★' : '☆'}
      </span>
    ));
  };

  // Helper function to render Assignee/Initiator objects
  const renderAssigneeLabel = (assignee) => {
    // Only handles the assignee/initiator object structure
    if (!assignee || !assignee.name) return <span style={{ color: '#CD2C58', fontSize: '13px', paddingTop: '2px' }}>N/A</span>;
    
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div style={cardStyles.avatar}>
                {getInitials(assignee.name)}
            </div>
            <div style={cardStyles.assigneeInfo}>
                <div style={cardStyles.assigneeName}>{assignee.name}</div>
                {/* FIX: Re-added the role/department display to complete the assignee/initiator info */}
                {assignee.role !== 'N/A' || assignee.department !== 'N/A' ? (
                  <div style={cardStyles.assigneeRole}>{assignee.role} • {assignee.department}</div>
                ) : null}
            </div>
        </div>
    );
  };

  // NEW: Normalize the status for case-insensitive checks
  const currentStatus = task.status ? task.status.toLowerCase() : '';

  return (
    <div
      style={{
        ...cardStyles.card,
        ...(isHovered ? cardStyles.cardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openDialog(task)}
    >
      <div style={cardStyles.statusBar} />
      <div style={cardStyles.priorityBadge}>{task.priority.toUpperCase()}</div> 
      
      {/* 1. TITLE */}
      <h3 style={cardStyles.title}>{task.title}</h3>
     
      {/* 
        3. DETAILS (Content Area)
      */}
      <div style={cardStyles.contentArea}>
        <div style={cardStyles.infoRow}>
          <span style={cardStyles.infoLabel}>Status:</span>
          <div style={cardStyles.statusBadge}>
            <span>{task.status}</span>
          </div>
        </div>

         <div style={cardStyles.infoRow}>
          <span style={cardStyles.infoLabel}>Order No:</span>
          <span style={{ 
              fontSize: '13px', 
              color: task.order_no ? '#374151' : '#CD2C58', // Standard text color or error color
              fontWeight: '500', 
              paddingTop: '2px' 
          }}>
              {task.order_no || 'N/A'} 
          </span>
        </div>

        <div style={cardStyles.infoRow}>
          <span style={cardStyles.infoLabel}>Initiated By:</span>
          {renderAssigneeLabel(task.initiator)}
        </div>
        
        {/* CORRECTED CONDITION: Changed 'on going' to 'ongoing' for robust status check */}
        {(currentStatus.includes('ongoing') || currentStatus.includes('pending')) && (
          <>
            <div style={cardStyles.infoRow}>
              <span style={cardStyles.infoLabel}>Pending With:</span>
              {/* This will render the assignee data populated from mapApiTaskToTaskCard */}
              {renderAssigneeLabel(task.assignee)} 
            </div>
            <div style={cardStyles.infoRow}>
              <span style={cardStyles.infoLabel}>Elapsed:</span>
              {/* FIXED: Using task.elapsed now populated with elapsed_days data */}
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', paddingTop: '2px' }}>{task.elapsed}</span>
            </div>
          </>
        )}

        {/* MODIFIED: Check against lowercase 'saved as draft' */}
        {currentStatus.includes('saved as draft') && (
          <div style={cardStyles.infoRow}>
            <span style={cardStyles.infoLabel}>Days Elapsed:</span>
            {/* FIXED: Using task.elapsed now populated with elapsed_days data */}
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', paddingTop: '2px' }}>{task.elapsed}</span>
          </div>
        )}

        {/* MODIFIED: Check against lowercase 'deleted' or 'cancelled' */}
        {(currentStatus.includes('deleted') || currentStatus.includes('cancelled')) && (
          <div style={cardStyles.infoRow}>
            <span style={cardStyles.infoLabel}>Deleted On:</span>
            <span style={{ fontSize: '13px', color: '#CD2C58', fontWeight: '500', paddingTop: '2px'  }}>{task.deletedDate}</span>
          </div>
        )}

        {/* MODIFIED: Check against lowercase 'completed' */}
       {currentStatus.includes('complete') && ( // This correctly checks for 'Completed', 'complete', etc.
          <div style={cardStyles.infoRow}>
            <span style={cardStyles.infoLabel}>Completed On:</span>
            <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '500', paddingTop: '2px' }}>{task.completedDate}</span>
          </div>
        )}
      </div>

      <div style={cardStyles.footer}>
        <div style={cardStyles.rating}>
          {renderRatingStars(task.rating)}
        </div>
      </div>
    </div>
  );
};
// [Pagination Component - Unchanged]
const Pagination = ({ filteredTasks, totalPages, currentPage, setCurrentPage }) => {
    const paginationStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      justifyContent: 'center',
    },
    button: {
      padding: '6px 10px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      color: '#374151',
      fontWeight: '600',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    pageButton: {
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      color: '#374151',
      fontWeight: '600',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    pageButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      borderColor: 'transparent',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    },
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div style={paginationStyles.container}>
      <button
        style={{
          ...paginationStyles.button,
          ...(currentPage === 1 ? paginationStyles.buttonDisabled : {}),
        }}
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        ← Prev
      </button>

      {getPageNumbers().map((page, idx) => (
        page === '...' ? (
          <span key={`ellipsis-${idx}`} style={{ color: '#9ca3af', padding: '0 4px' }}>...</span>
        ) : (
          <button
            key={page}
            style={{
              ...paginationStyles.pageButton,
              ...(currentPage === page ? paginationStyles.pageButtonActive : {}),
            }}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        )
      ))}

      <button
        style={{
          ...paginationStyles.button,
          ...(currentPage === totalPages ? paginationStyles.buttonDisabled : {}),
        }}
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
};


const TaskSummaryPage = () => {
  const [tasks, setTasks] = useState([]); 
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [dialogLoading, setDialogLoading] = useState(false); // New state for dialog loading
  const [dialogError, setDialogError] = useState(null); // New state for dialog error
  const [filters, setFilters] = useState({
    search: '',
    status: 'all', 
    priority: 'all' 
  });
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
    
  // --- NEW: Helper to fetch single task detail for order_no ---
  const fetchSingleTaskDetailForOrderNo = async (task) => {
      const rawRequestBody = {
          "P_id": getSessionId(),
          "process_id": task.process_id,
          "task_id": task.task_id,
          "token": "HRFGVJISOVp1fncC"
      };
      
      if (!rawRequestBody.P_id || !rawRequestBody.task_id) {
         
          return { task_id: task.task_id, order_no: null };
      }
      
      try {
          const encryptedPayload = await encryptPayloadForGo(rawRequestBody);
          const headers = getAuthHeaders(); 
          
          const response = await fetch(`${HostName}${TASK_DETAIL_ENDPOINT}`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ Data: encryptedPayload }),
          });
          
          if (!response.ok) {
       
              return { task_id: task.task_id, order_no: null };
          }

          const encryptedResponse = await response.json();
          if (!encryptedResponse.Data) {
          
              return { task_id: task.task_id, order_no: null };
          }

          const decryptedResponse = await decryptData(encryptedResponse.Data);
          
          let detailRecord = null;
          if (decryptedResponse.Data && Array.isArray(decryptedResponse.Data.Records) && decryptedResponse.Data.Records.length > 0) {
              detailRecord = decryptedResponse.Data.Records[0];
          } else if (Array.isArray(decryptedResponse) && decryptedResponse.length > 0) {
              detailRecord = decryptedResponse[0];
          } else if (decryptedResponse.task_id) {
              detailRecord = decryptedResponse;
          }
          
          const orderNo = (detailRecord && (detailRecord.OfficeOrderNo || detailRecord.order_no)) || null;

          return { task_id: task.task_id, order_no: orderNo };
          
      } catch (e) {
        
          return { task_id: task.task_id, order_no: null };
      }
  };


  // --- API Fetching Effect for Summary Grid (NOW INCLUDES PARALLEL DETAIL FETCH) ---
  // Runs when status or priority filter changes.
  useEffect(() => {
    let active = true;

    const fetchTasksFromApi = async () => {
        // 1. Determine the API IDs based on the current string filters
        const apiStatusId = STATUS_TO_API_ID[filters.status];
        const apiPriorityId = PRIORITY_TO_API_ID[filters.priority];
        
        // 2. Build the raw request body
        const rawRequestBody = {
            "P_id": getSessionId(), 
            "token": "HRFGVJISOVp1fncC", 
            "employee_id": getEmployeeId(), 
            "task_status_id": apiStatusId, // Dynamic API status ID (null for all)
            "priority": apiPriorityId // Dynamic API priority ID (null for all)
        };

        if (!rawRequestBody.P_id || !rawRequestBody.employee_id) {
            setError("Session ID or Employee ID not found in cookies. Cannot fetch tasks.");
            return;
        }
          
        setLoading(true);
        setError(null);
        let taskArray = [];

        try {
            // Check for critical data before calling encryption
            if (!rawRequestBody.P_id) {
                 throw new Error("Missing P_id (Session ID). Cannot encrypt payload.");
            }
            
            // 3. Encrypt the raw request body
            const encryptedPayload = await encryptPayloadForGo(rawRequestBody);
            
            // 4. Prepare headers
            const headers = getAuthHeaders(); 

            // 5. Send the encrypted request (Summary API)
            const response = await fetch(`${HostName}${TASK_SUMMARY_ENDPOINT}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ Data: encryptedPayload }),
            });

            if (!response.ok) {
                throw new Error(`Summary API request failed with status: ${response.status}`);
            }

            const encryptedResponse = await response.json();
            
            if (!encryptedResponse.Data) {
                throw new Error("Encrypted response data missing from server.");
            }

            // 6. Decrypt the response payload
            const decryptedResponse = await decryptData(encryptedResponse.Data);
            
            // 7. Extract and map task records from Summary API
            if (decryptedResponse.Data && Array.isArray(decryptedResponse.Data.Records)) {
                taskArray = decryptedResponse.Data.Records;
            } else if (Array.isArray(decryptedResponse)) {
                 taskArray = decryptedResponse;
            } else if (decryptedResponse.Records && Array.isArray(decryptedResponse.Records)) {
                taskArray = decryptedResponse.Records;
            } else {
                taskArray = decryptedResponse.task_id ? [decryptedResponse] : [];
            }
            
            let mappedTasks = taskArray.map(mapApiTaskToTaskCard);

            // --- BEGIN: Detail Fetch for Order No (To satisfy user request) ---
            
            if (mappedTasks.length > 0) {
                

                const detailPromises = mappedTasks.map(fetchSingleTaskDetailForOrderNo);
                const detailResults = await Promise.all(detailPromises);
                
                // Merge the order_no results back into the mapped tasks
                const orderNoMap = detailResults.reduce((acc, result) => {
                    if (result.order_no) {
                        acc[result.task_id] = result.order_no;
                    }
                    return acc;
                }, {});
                
                mappedTasks = mappedTasks.map(task => {
                    const detailOrderNo = orderNoMap[task.task_id];
                    // Prioritize the order_no from the detail API
                    if (detailOrderNo) {
                        return { ...task, order_no: detailOrderNo };
                    }
                    return task;
                });
            }
            
            if (active) {
                 setTasks(mappedTasks); // Set the new base array with corrected order_no
            }

        } catch (e) {
             if (active) {
                let userMessage = e.userMessage || "Failed to load tasks. Please check your session and try again.";
                
                // Provide specific feedback for the encryption error
                if (e.message.includes("encrypt payload") || e.message.includes("Invalid key structure")) {
                     userMessage = "Secure communication failed. Please ensure the encryption module (EncryptionKey.js) is correctly configured for key/IV handling.";
                }

                setError(userMessage);
             }
        } finally {
             if (active) {
                setLoading(false);
             }
        }
    };
    
    fetchTasksFromApi();
    
    // Cleanup function
    return () => { active = false; };
    
  }, [filters.status, filters.priority]); // Re-fetch when status OR priority filter changes

  // --- Local Filtering/Sorting Effect (Unchanged) ---
  useEffect(() => {
    let filtered = [...tasks];
    
    // 1. Search Filter (Local)
    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.employeeId.includes(filters.search) ||
        (task.order_no && task.order_no.includes(filters.search)) // ADDED: Search by order_no
      );
    }
    
    // 2. Sort by rating (Local)
    filtered.sort((a, b) => {
      return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
    });

    setFilteredTasks(filtered);
    setCurrentPage(1);
  }, [tasks, filters.search, sortOrder]); 
  
  // --- Task Detail Fetching Logic (Unchanged - used only for dialog) ---
  const fetchTaskDetails = async (task) => {
      setDialogLoading(true);
      setDialogError(null);
      
      const rawRequestBody = {
        "P_id": getSessionId(),
        "process_id": task.process_id, // Assuming process_id is in the base task
        "task_id": task.task_id,
        "token": "HRFGVJISOVp1fncC"
      };

      if (!rawRequestBody.P_id || !rawRequestBody.task_id) {
          setDialogError("Missing Session or Task ID. Cannot load details.");
          setDialogLoading(false);
          return;
      }
      
      try {
          // Check before encryption for key data
          if (!rawRequestBody.P_id) {
             throw new Error("Missing P_id (Session ID). Cannot encrypt payload.");
          }

          // 1. Encrypt the detail request body
          const encryptedPayload = await encryptPayloadForGo(rawRequestBody);
          const headers = getAuthHeaders(); 

          // 2. Send the encrypted request to the detail endpoint
          const response = await fetch(`${HostName}${TASK_DETAIL_ENDPOINT}`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ Data: encryptedPayload }),
          });

          if (!response.ok) {
              throw new Error(`Detail API failed with status: ${response.status}`);
          }

          const encryptedResponse = await response.json();
          if (!encryptedResponse.Data) {
              throw new Error("Detail encrypted data missing from server.");
          }

          // 3. Decrypt the response payload
          const decryptedResponse = await decryptData(encryptedResponse.Data);
          
          // 4. Extract and normalize the detail record
          let detailRecord = null;
          if (decryptedResponse.Data && Array.isArray(decryptedResponse.Data.Records) && decryptedResponse.Data.Records.length > 0) {
              detailRecord = decryptedResponse.Data.Records[0];
          } else if (Array.isArray(decryptedResponse) && decryptedResponse.length > 0) {
              detailRecord = decryptedResponse[0];
          } else if (decryptedResponse.task_id) {
              detailRecord = decryptedResponse;
          }
          
          // 5. Merge base task data with new detail data for the dialog
          const updatedTask = {
              ...task,
              ...detailRecord 
          };
          
          // Ensure order_no from detail is merged if the summary one was missing/null
          if(detailRecord.OfficeOrderNo && detailRecord.OfficeOrderNo.trim()) {
              updatedTask.order_no = detailRecord.OfficeOrderNo;
          } else if (detailRecord.order_no && detailRecord.order_no.trim()) {
               updatedTask.order_no = detailRecord.order_no;
          }


          setSelectedTask(updatedTask);
          // Dialog is already open from openTaskDetailDialog

      } catch (e) {
          let userMessage = e.userMessage || "Failed to load task details. Please check your session and API.";

          if (e.message.includes("encrypt payload") || e.message.includes("Invalid key structure")) {
             userMessage = "Secure communication failed for details. Encryption module error (Invalid key structure).";
          }

          setDialogError(userMessage);
      } finally {
          setDialogLoading(false);
      }
  };


  // --- Task Detail Dialog Opener (Unchanged) ---
  const openTaskDetailDialog = (task) => {
      // First, set the task immediately (for the basic header) and open dialog
      setSelectedTask(task); 
      setIsDialogOpen(true);
      
      // Then, fetch the rich details asynchronously
      fetchTaskDetails(task);
  };

  const closeTaskDetailDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
    setDialogError(null); // Clear dialog errors on close
    setDialogLoading(false); // Clear dialog loading state on close
  };


  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all'
    });
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const getPriorityStyles = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return { color: '#dc2626', backgroundColor: '#fef2f265' };
      case 'high':
      case 'medium': // Assuming 'medium' maps to 'high' for color
        return { color: '#ea580c', backgroundColor: '#fff7ed44' };
      case 'normal':
      case 'low': // Assuming 'low' maps to 'normal' for color
        return { color: '#2563eb', backgroundColor: '#eff6ff2d' };
      default:
        return { color: '#6b7280', backgroundColor: '#f3f4f63b' };
    }
  };

  const TASKS_PER_PAGE = 12;

  const indexOfLastTask = currentPage * TASKS_PER_PAGE;
  const indexOfFirstTask = indexOfLastTask - TASKS_PER_PAGE;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);

  const pageStyles = {
    // ... (rest of pageStyles definition - Unchanged) ...
    container: {
      maxWidth: '1800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    filtersBarWrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    filtersBar: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.95) 100%)',
      backdropFilter: 'blur(20px)',
      padding: '14px 20px',
      borderRadius: '16px',
      boxShadow: '0 2px 16px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.03)',
      marginBottom: '32px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      flexWrap: 'nowrap',
    },
    searchContainer: {
      position: 'relative',
      minWidth: '200px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    searchInput: {
      width: '100%',
      padding: '10px 40px 10px 40px',
      border: '1.5px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '13px',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      fontWeight: '500',
      color: '#111827',
    },
    searchInputFocused: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      pointerEvents: 'none',
    },
    clearSearchIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    divider: {
      width: '1px',
      height: '32px',
      backgroundColor: '#e5e7eb',
      margin: '0 4px',
      flexShrink: 0,
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '10px',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      flexShrink: 0,
    },
    filterLabel: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap',
    },
    iconButton: {
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1.5px solid transparent',
      backgroundColor: '#ffffff',
      color: '#6b7280',
      position: 'relative',
      flexShrink: 0,
    },
    iconButtonHover: {
      backgroundColor: '#f9fafb',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    iconButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      borderColor: 'transparent',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    sortButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      border: '1.5px solid #e5e7eb',
      backgroundColor: '#ffffff',
      color: '#374151',
      fontWeight: '600',
      fontSize: '12px',
      flexShrink: 0,
    },
    resetButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '10px',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.25)',
      flexShrink: 0,
    },
    resultsInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      borderRadius: '10px',
      border: '1.5px solid rgba(102, 126, 234, 0.2)',
      color: '#667eea',
      fontWeight: '700',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '16px',
      marginBottom: '40px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 16px',
      color: '#9ca3af',
    },
    emptyStateIcon: {
      fontSize: '48px',
      marginBottom: '12px',
      opacity: 0.5,
    },
    emptyStateText: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#6b7280',
      marginBottom: '6px',
    },
    emptyStateSubtext: {
      fontSize: '13px',
      color: '#9ca3af',
    },
    loadingOverlay: { 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        color: '#667eea',
        fontSize: '18px',
        fontWeight: '600',
    },
    errorBox: {
        padding: '20px',
        backgroundColor: '#fef2f2',
        border: '1px solid #f87171',
        color: '#b91c1c',
        borderRadius: '8px',
        textAlign: 'center',
        marginTop: '30px',
        fontWeight: '600',
    }
  };

  // Color mapping for priority
  const priorityColorMap = {
    'critical': '#dc2626',
    'high': '#ea580c',
    'normal': '#2563eb',
  };

  const IconButtonComponent = ({ icon: Icon, tooltip, isActive, onClick, color }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Tooltip text={tooltip}>
        <div
          style={{
            ...pageStyles.iconButton,
            ...(isActive ? {
              backgroundColor: color ? `${color}15` : 'transparent',
              color: color || '#667eea',
              borderColor: color ? `${color}40` : 'transparent',
              boxShadow: color ? `0 2px 8px ${color}30` : '0 4px 12px rgba(102, 126, 234, 0.3)',
            } : {}),
            ...(isHovered && !isActive ? pageStyles.iconButtonHover : {}),
          }}
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </Tooltip>
    );
  };
  
  if (loading) {
    return (
      <div style={pageStyles.container}>
        <div style={pageStyles.loadingOverlay}>
          <RotateCcw size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '10px' }}>Loading Tasks...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyles.container}>
        <div style={pageStyles.errorBox}>
          <AlertTriangle size={20} style={{ marginRight: '8px' }} />
          {error}
        </div>
      </div>
    );
  }


  return (
    <div style={pageStyles.container}>
      <TaskDialog
        open={isDialogOpen}
        onClose={closeTaskDetailDialog}
        task={selectedTask}
        isLoading={dialogLoading} // Pass loading state to the dialog
        isError={dialogError} // Pass error state to the dialog
      />

      <div style={pageStyles.filtersBarWrapper}>
        <div style={pageStyles.filtersBar}>
          {/* Search */}
          <div style={pageStyles.searchContainer}>
            <Search size={16} style={pageStyles.searchIcon} />
            <input
              type="text"
              placeholder="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                ...pageStyles.searchInput,
                ...(searchFocused ? pageStyles.searchInputFocused : {}),
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {filters.search && (
              <div
                style={pageStyles.clearSearchIcon}
                onClick={() => handleFilterChange('search', '')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                <X size={14} />
              </div>
            )}
          </div>

          <div style={pageStyles.divider} />

          {/* Status Filters */}
          <div style={pageStyles.filterGroup}>
            <div style={pageStyles.filterLabel}>
              <Filter size={12} />
              Status
            </div>
            {/* All Status - ListChecks */}
            <IconButtonComponent
              icon={ListChecks }
              tooltip="All Status"
              isActive={filters.status === 'all'}
              onClick={() => handleFilterChange('status', 'all')}
            />
            {/* Completed - BadgeCheck - ID 3 */}
            <IconButtonComponent
              icon={BadgeCheck }
              tooltip="Completed"
              isActive={filters.status === 'Completed'}
              onClick={() => handleFilterChange('status', 'Completed')}
              color={statusColorMap['Completed']}
            />
            {/* On Going - CircleUser - ID 4 */}
            <IconButtonComponent
              icon={CircleUser }
              tooltip="On Going"
              isActive={filters.status === 'On Going'}
              onClick={() => handleFilterChange('status', 'On Going')}
              color={statusColorMap['On Going']}
            />
            {/* Pending - Award - ID 5 */}
            <IconButtonComponent
              icon={Award}
              tooltip="Pending"
              isActive={filters.status === 'Pending'}
              onClick={() => handleFilterChange('status', 'Pending')}
              color={statusColorMap['Pending']}
            />
            {/* Saved as Draft - SquarePen - ID 6 */}
            <IconButtonComponent
              icon={SquarePen }
              tooltip="Saved as Draft"
              isActive={filters.status === 'Saved as Draft'}
              onClick={() => handleFilterChange('status', 'Saved as Draft')}
              color={statusColorMap['Saved as Draft']}
            />
            {/* Deleted / Cancelled - Trash2 - ID 1 */}
            <IconButtonComponent
              icon={Trash2}
              tooltip="Deleted / Cancelled"
              isActive={filters.status === 'Deleted'} 
              onClick={() => handleFilterChange('status', 'Deleted')}
              color={statusColorMap['Deleted']}
            />
          </div>

          <div style={pageStyles.divider} />

          {/* Priority Filters */}
          <div style={pageStyles.filterGroup}>
            <div style={pageStyles.filterLabel}>
              <Filter size={12} />
              Priority
            </div>
            {/* All Priorities - ListChecks */}
            <IconButtonComponent
              icon={ListChecks }
              tooltip="All Priorities"
              isActive={filters.priority === 'all'}
              onClick={() => handleFilterChange('priority', 'all')}
            />
            {/* Critical - AlertTriangle - ID 19 */}
            <IconButtonComponent
              icon={AlertTriangle }
              tooltip="Critical"
              isActive={filters.priority === 'critical'}
              onClick={() => handleFilterChange('priority', 'critical')}
              color={priorityColorMap['critical']}
            />
            {/* High - Flag - ID 18 */}
            <IconButtonComponent
              icon={Flag}
              tooltip="High"
              isActive={filters.priority === 'high'}
              onClick={() => handleFilterChange('priority', 'high')}
              color={priorityColorMap['high']}
            />
            {/* Normal - CircleCheck - ID 17 */}
            <IconButtonComponent
              icon={CircleCheck }
              tooltip="Normal"
              isActive={filters.priority === 'normal'}
              onClick={() => handleFilterChange('priority', 'normal')}
              color={priorityColorMap['normal']}
            />
          </div>

          <div style={pageStyles.divider} />

          {/* Sort Button */}
          <Tooltip text={`Sort by Rating: ${sortOrder === 'desc' ? 'High to Low' : 'Low to High'}`}>
            <div
              style={pageStyles.sortButton}
              onClick={toggleSort}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ArrowUpDown size={16} />
            </div>
          </Tooltip>

          {/* Reset Button */}
          <Tooltip text="Reset All Filters">
            <button
              onClick={clearAllFilters}
              style={pageStyles.resetButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.25)';
              }}
            >
              <RotateCcw size={14} />
            </button>
          </Tooltip>

          <div style={pageStyles.divider} />

          {/* Results Count */}
          <div style={pageStyles.resultsInfo}>
            <BadgeCheck  size={14} />
            {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
          </div>
        </div>
      </div>

      {currentTasks.length > 0 ? (
        <>
          <div style={pageStyles.grid}>
            {currentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                getPriorityStyles={getPriorityStyles}
                openDialog={openTaskDetailDialog}
              />
            ))}
          </div>

          {totalPages >= 1 && (
            <Pagination
              filteredTasks={filteredTasks}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div style={pageStyles.emptyState}>
          <div style={pageStyles.emptyStateIcon}>📭</div>
          <div style={pageStyles.emptyStateText}>No tasks found</div>
          <div style={pageStyles.emptyStateSubtext}>
            Try adjusting your filters or search criteria
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSummaryPage;