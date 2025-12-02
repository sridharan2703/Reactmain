
/**
 * @fileoverview CommentsHistory Component.
 * @module CommentsHistory
 * @description Fetches, decrypts, and displays the comment and approval history
 * for a specific task using a generic table component. It handles API communication,
 * data transformation, role-based color coding, and error handling.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - React hooks: for state and lifecycle management.
 * - Cookies: for accessing authentication tokens.
 * - Swal: for user-friendly alerts.
 * - Encryption/Decryption utilities: for secure data transfer.
 * - Table: Generic table component for display.
 */
import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { HostName } from "src/assets/host/Host";
import {
  encryptPayloadForGo,
  decryptData,
  validateJsonData,
} from "src/components/Encryption/EncryptionKey";
import Table from "src/components/ui/Table";
import PropTypes from 'prop-types';


/**
 * @typedef {Object} CommentData
 * @property {number} id - Unique client-side ID.
 * @property {string} commenter - Name or ID of the user who commented.
 * @property {string} role - Role of the user (e.g., 'Approver', 'Initiator').
 * @property {string} comment - The remark/comment text.
 * @property {string} date - Formatted date and time of the comment.
 */

/**
 * @typedef {Object} RoleColor
 * @property {string} bg - Background color for the role badge.
 * @property {string} text - Text color for the role badge.
 */

/**
 * @typedef {Object} CommentsHistoryProps
 * @property {CommentData[]} [comments=[]] - External comments array (if data is pre-loaded).
 * @property {boolean} [loading=false] - External loading state.
 * @property {string} [title="Comment & Approval History"] - Title for the section.
 * @property {Function} [onRefresh] - Optional callback to handle manual refresh (renders a refresh button).
 * @property {string} [emptyMessage="No comments found."] - Message to display when no comments are available.
 * @property {Object.<string, RoleColor>} [roleColors={}] - Custom color mapping for user roles.
 * @property {string} [headerColor="#3F51B5"] - Color for the header/refresh button theme.
 * @property {boolean} [searchable=true] - Enables/disables searching in the internal table.
 * @property {string} taskId - The ID of the task to fetch comments for (required for internal fetch).
 * @property {string|number} processId - The ID of the process (required for internal fetch).
 * @property {string} sessionId - The session ID (required for internal fetch).
 */

/**
 * CommentsHistory Functional Component.
 * 
 * @param {CommentsHistoryProps} props - The component's props.
 * @returns {JSX.Element} The Comments History section with a Table.
 */
const CommentsHistory = ({
  comments: externalComments = [],
  loading: externalLoading = false,
  title = "Comment & Approval History",
  onRefresh = null,
  emptyMessage = "No comments found.",
  roleColors = {},
  headerColor = "#3F51B5",
  searchable = true,
  taskId,
  processId,
  sessionId,
}) => {
  const [comments, setComments] = useState(externalComments);
  const [internalLoading, setInternalLoading] = useState(false);

  // Default color scheme for common roles
  const defaultRoleColors = {
    Initiator: { bg: "#DBEAFE", text: "#1E40AF" },
    Approver: { bg: "#FEF3C7", text: "#92400E" },
    Reviewer: { bg: "#E0E7FF", text: "#3730A3" },
    Admin: { bg: "#F3E8FF", text: "#6B21A8" },
    Default: { bg: "#F3F4F6", text: "#374151" },
  };

  /** Merges default colors with custom colors for badge rendering. */
  const mergedRoleColors = { ...defaultRoleColors, ...roleColors };
  
  /**
   * Gets the appropriate color configuration for a given role.
   * @param {string} role - The user role string.
   * @returns {RoleColor} The color object for the role.
   */
  const getRoleColor = (role) => {
    return mergedRoleColors[role] || mergedRoleColors.Default;
  };

  /**
   * Fetches comment data from the backend API, handles encryption/decryption,
   * and formats the response for display.
   * @async
   */
  const fetchCommentsData = useCallback(async () => {
    if (!taskId || !processId || !sessionId) {
      // Missing critical IDs, skip fetch
      return;
    }
    setInternalLoading(true);
    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");
      
      const endpoint = `${HostName}/OfficeOrder_approval_remarks`;
      
      // Payload for the API call
      const requestPayload = {
        token: "HRFGVJISOVp1fncC",
        taskid: taskId,
        session_id: sessionId,
        process_id: Number(processId),
      };

      // Encrypt the payload
      const encryptedPayload = await encryptPayloadForGo(requestPayload);
      
      // Send the API request
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

      // Decrypt and validate the response
      const decryptedObj = await decryptData(encryptedData);
      const parsed =
        typeof decryptedObj === "string"
          ? JSON.parse(decryptedObj)
          : decryptedObj;

      if (!validateJsonData(parsed)) {
        throw new Error("Decrypted response has unexpected format.");
      }

      // Extract records (handling nested structure)
      const records = parsed?.Records ?? parsed?.Data?.Records ?? [];

      const commentsArray = records.map((r, index) => {
        let formattedDate = r.UpdatedOn || "";

        // --- FIX: Custom Date Parsing for "DD-MM-YYYY HH:mm" ---
        if (typeof r.UpdatedOn === "string" && r.UpdatedOn.includes("-")) {
          try {
            const [datePart, timePart] = r.UpdatedOn.split(" "); 
            
            if (datePart && timePart) {
              const [day, month, year] = datePart.split("-");
              const [hour, minute] = timePart.split(":");

              // Date is parsed correctly using month index
              const customDate = new Date(
                parseInt(year),
                parseInt(month) - 1, 
                parseInt(day),
                parseInt(hour),
                parseInt(minute)
              );

              // Format date if valid
              if (!isNaN(customDate.getTime())) {
                formattedDate = customDate.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });
              }
            }
          } catch (error) {
            // console.warn("Date parse error for:", r.UpdatedOn, error); // Log removed
            formattedDate = r.UpdatedOn; // Fallback: keep original string
          }
        }
        // -------------------------------------------------------

        return {
          id: index + 1,
          commenter: r.UpdatedBy || r.UserID || "Unknown",
          role: r.UserRole || "",
          comment: r.Remarks || "",
          date: formattedDate,
        };
      });

      setComments(commentsArray);
    } catch (err) {
      // console.error("🔴 Fetch Comments Error:", err); // Log removed
      Swal.fire({
        title: "Error",
        text: err.userMessage || err.message || "Failed to load comments.",
        icon: "error",
      });
      setComments([]);
    } finally {
      setInternalLoading(false);
    }
  }, [taskId, processId, sessionId]);

  /** Effect to load comments on mount or when key props change. */
  useEffect(() => {
    // Use external comments if available
    if (externalComments.length > 0) {
      setComments(externalComments);
    } 
    // Otherwise, fetch comments internally
    else if (taskId && processId && sessionId) {
      fetchCommentsData();
    }
  }, [externalComments.length, taskId, processId, sessionId, fetchCommentsData]);

  // Table column definitions
  const columns = [
    {
      id: "id",
      label: "SI.No",
      align: "left",
    },
    {
      id: "commenter",
      label: "Commenter",
      align: "left",
    },
    {
      id: "role",
      label: "Role",
      align: "left",
      // Custom renderer for the role badge
      render: (row) => {
        const roleColor = getRoleColor(row.role);
        return (
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "500",
              display: "inline-block",
              backgroundColor: roleColor.bg,
              color: roleColor.text,
            }}
          >
            {row.role}
          </span>
        );
      },
    },
    {
      id: "comment",
      label: "Comment",
      align: "left",
    },
    {
      id: "date",
      label: "Date",
      align: "left",
    },
  ];

  // Inline styles for header elements
  const sectionHeadingStyle = {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    letterSpacing: "0.3px",
  };
  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    borderBottom: "1px solid #CFD8DC",
    paddingBottom: "8px",
  };

  const isLoading = externalLoading || internalLoading;

  // Render a simple loading message if data is being fetched and none is available
  if (isLoading && comments.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#6B7280",
          fontSize: "14px",
        }}
      >
        Loading comments...
      </div>
    );
  }

  // Main render
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={sectionHeaderStyle}>
        <h3 style={sectionHeadingStyle}>{title}</h3>
        {/* Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            style={{
              padding: "8px 16px",
              border: `1px solid ${headerColor}`,
              borderRadius: "6px",
              backgroundColor: "transparent",
              color: headerColor,
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              marginLeft: "auto",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = headerColor;
              e.target.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = headerColor;
            }}
          >
            ↻ Refresh
          </button>
        )}
      </div>

      {/* Render the generic Table component */}
      <Table
        columns={columns}
        data={comments}
        searchable={searchable}
        headerColor={headerColor}
      />

      {/* Empty State Message */}
      {comments.length === 0 && !isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#6B7280",
            fontSize: "14px",
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            marginTop: "8px",
          }}
        >
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

/**
 * Prop type validation for CommentsHistory.
 */
CommentsHistory.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  title: PropTypes.string,
  onRefresh: PropTypes.func,
  emptyMessage: PropTypes.string,
  roleColors: PropTypes.object,
  headerColor: PropTypes.string,
  searchable: PropTypes.bool,
  taskId: PropTypes.string.isRequired,
  processId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sessionId: PropTypes.string.isRequired,
};

export default CommentsHistory;