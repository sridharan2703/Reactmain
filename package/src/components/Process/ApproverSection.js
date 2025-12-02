/**
 * @fileoverview ApproverSection Component.
 * @module ApproverSection
 * @description Provides a specialized UI section for a workflow approver. 
 * It allows the user to select an approval action (Approve/Return), enter remarks, 
 * set task priority, specify the return-to user (if returning), and manage submission actions.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - React hooks: for state, effects, and navigation.
 * - Material-UI components: for form inputs and select elements.
 * - Custom Button components: for standardized action buttons.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import {
  TextField,
  FormControl,
  Select as MuiSelect,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { SaveButton, SubmitButton, FavoriteButton, CancelButton } from "src/components/ui/Button.js";

/**
 * @typedef {Object} PriorityOption
 * @property {string} value - The unique value of the priority level (e.g., "17").
 * @property {string} label - The display name of the priority level (e.g., "Normal").
 */

/**
 * @typedef {Object} ApproverSectionProps
 * @property {'approve'|'reject'|null} approvalAction - The currently selected approval state.
 * @property {Function} handleApprovalActionChange - Callback to update the approvalAction state.
 * @property {string} returnToUser - The ID or name of the user to return the task to.
 * @property {Function} setReturnToUser - Setter for the returnToUser state.
 * @property {Array} returnUserOptions - List of options for the return-to user dropdown.
 * @property {string} approverRemarks - The text content of the approver's remarks.
 * @property {Function} setApproverRemarks - Setter for the approverRemarks state.
 * @property {Function} handleSave - Callback for the "Save as Draft" action.
 * @property {Function} handleSubmit - Callback for the "Submit" action.
 * @property {Function} handlePreview - Callback for the "Preview" action.
 * @property {boolean} sendBackToMe - State for the "Send back to me" checkbox.
 * @property {Function} setSendBackToMe - Setter for the sendBackToMe state.
 * @property {string} priority - The currently selected priority value.
 * @property {Function} setPriority - Setter for the priority state.
 * @property {PriorityOption[]} [priorityOptions] - List of priority level options.
 */

/**
 * ApproverSection Functional Component.
 * 
 * @param {ApproverSectionProps} props - The component's props.
 * @returns {JSX.Element} The Approver Section UI.
 */
const ApproverSection = ({
  approvalAction,
  handleApprovalActionChange,
  returnToUser,
  setReturnToUser,
  returnUserOptions,
  approverRemarks,
  setApproverRemarks,
  handleSave,
  handleSubmit,
  handlePreview,
  sendBackToMe,
  setSendBackToMe,
  priority,
  setPriority,
  priorityOptions = [
    { value: "17", label: "Normal" },
    { value: "18", label: "High" },
    { value: "19", label: "Critical" },
  ],
}) => {
  const navigate = useNavigate();
  const [priorityExpanded, setPriorityExpanded] = useState(false);

  /** Handles navigation back to the previous page. */
  const handleBack = () => navigate(-1);

  // NOTE: The incorrect useEffect block was removed as confirmed in the previous step.

  /**
   * Retrieves the color and styling configuration for a given priority value.
   * @param {string} priorityValue - The value of the selected priority.
   * @returns {Object} Styling configuration object.
   */
  const getPriorityConfig = (priorityValue) => {
    const configs = {
      "17": { // Normal
        borderColor: "#10b981",
        color: "#059669",
        glowColor: "rgba(16, 185, 129, 0.2)",
        iconBg: "#10b981",
        labelColor: "#059669",
        descColor: "#047857",
        dashedColor: "#d1f5d1",
      },
      "18": { // High
        borderColor: "#3b82f6",
        color: "#2563eb",
        glowColor: "rgba(59, 130, 246, 0.2)",
        iconBg: "#3b82f6",
        labelColor: "#2563eb",
        descColor: "#1e40af",
        dashedColor: "#dbeafe",
      },
      "19": { // Critical
        borderColor: "#f50b0bff",
        color: "#d93006ff",
        glowColor: "rgba(245, 11, 11, 0.2)",
        iconBg: "#f50b0bff",
        labelColor: "#d93706ff",
        descColor: "#920e0eff",
        dashedColor: "#fecdc7ff",
      },
    };
    return configs[priorityValue] || { // Default/Fallback
      borderColor: "#667eea",
      color: "#1e40af",
      glowColor: "rgba(102, 126, 234, 0.15)",
      iconBg: "#667eea",
      labelColor: "#1e40af",
      descColor: "#64748b",
      dashedColor: "#c7d2fe",
    };
  };

  // Ensure priority is always a string for consistent matching
  const effectivePriority = String(priority || "17");

  const config = getPriorityConfig(effectivePriority);

  // Get the display label for the selected priority
  const selectedPriorityLabel =
    priorityOptions.find((o) => o.value === effectivePriority)?.label || "Normal";

  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
          padding: "20px",
          border: "2px solid #FFC400",
          borderRadius: "12px",
          position: "relative",
          boxShadow: "0 4px 16px rgba(102, 126, 234, 0.15)",
        }}
      >
        {/* Header Badge */}
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "20px",
            backgroundColor: "#FFC400",
            color: "#FFFFFF",
            padding: "6px 20px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1px",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
          }}
        >
          Approver Section
        </div>

        {/* Main Content - Single Row */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "20px",
            marginBottom: "16px",
            alignItems: "flex-start",
          }}
        >
          {/* Remarks Field */}
          <div style={{ flex: "1 1 20%", minWidth: "100px !important" }}>
            <TextField
              value={approverRemarks}
              label="Remarks"
              onChange={(e) => setApproverRemarks(e.target.value)}
              placeholder="Enter your remarks..."
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  padding: "8px",
                  "& fieldset": {
                    borderColor: "#d1d5db",
                    borderWidth: "1.5px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea !important",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#667eea !important",
                  fontWeight: "600",
                  fontSize: "13px",
                },
                "& .MuiInputBase-input": {
                  fontSize: "13px",
                  lineHeight: "1.5",
                },
              }}
              required
            />
          </div>

                    {/* Priority Card/Dropdown */}
          <div
            style={{
              flex: "0 0 270px",
              padding: "4px 4px",
              borderRadius: "10px",
              // Conditional border and shadow based on whether a known config exists
              border: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "1.5px solid #e5e7eb" : `2px solid ${config.borderColor}`,
              transition: "all 0.2s ease",
              boxShadow: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "0 2px 6px rgba(0, 0, 0, 0.05)" : `0 4px 12px ${config.glowColor}`,
              backgroundColor: "#f9fafb",
              cursor: "pointer",
            }}
            onClick={() => setPriorityExpanded((prev) => !prev)}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "6px",
                  border: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "2px solid #d1d5db" : `2px solid ${config.borderColor}`,
                  backgroundColor: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "transparent" : config.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {/* Visual icon/indicator (using a generic symbol) */}
                <span
                  style={{
                    color: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "#6b7280" : "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  📶
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "#6b7280" : config.labelColor,
                  }}
                >
                  Priority
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "#9ca3af" : config.descColor,
                    marginTop: "2px",
                  }}
                >
                  {selectedPriorityLabel}
                </div>
              </div>
            </div>

            {/* Priority Dropdown below header - only when expanded */}
            {priorityExpanded && (
              <div
                className="dropdown-wrapper"
                style={{
                  paddingTop: "12px",
                  borderTop: `1px dashed ${effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "#c7d2fe" : config.dashedColor}`,
                }}
                onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing the card on dropdown click
              >
                <FormControl fullWidth variant="outlined">
                  <InputLabel
                    id="priority-label"
                    sx={{
                      fontSize: "11px",
                      color: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "#667eea" : config.color,
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      marginBottom: "6px",
                      "&.Mui-focused": {
                        color: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "#667eea" : config.color,
                      },
                    }}
                  >
                    PRIORITY LEVEL
                  </InputLabel>
                  <MuiSelect
                    labelId="priority-label"
                    value={effectivePriority}
                    label="PRIORITY LEVEL"
                    onChange={(e) => {
                      setPriority(e.target.value);
                      setPriorityExpanded(false); // Close dropdown on selection
                    }}
                    sx={{
                      padding: "8px 12px",
                      fontSize: "13px",
                      height: "auto",
                      borderRadius: "6px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "#c7d2fe" : config.borderColor,
                        borderWidth: "1.5px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "#667eea" : config.color,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: `${effectivePriority !== "17" && effectivePriority !== "18" && effectivePriority !== "19" ? "#667eea" : config.borderColor} !important`,
                        borderWidth: "2px",
                      },
                      "& .MuiSelect-select": {
                        padding: "8px 12px",
                        fontSize: "13px",
                      },
                    }}
                  >
                    {priorityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
            )}
          </div>

          {/* Approve Card */}
          <div
            style={{
              flex: "0 0 200px",
              cursor: "pointer",
              padding: "10px 10px",
              borderRadius: "10px",
              border: approvalAction === "approve" ? "2px solid #10B981" : "1.5px solid #e5e7eb",
              transition: "all 0.2s ease",
              boxShadow:
                approvalAction === "approve"
                  ? "0 4px 12px rgba(16, 185, 129, 0.2)"
                  : "0 2px 6px rgba(0, 0, 0, 0.05)",
            }}
            onClick={() => handleApprovalActionChange("approve")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "6px",
                  border: approvalAction === "approve" ? "2px solid #10B981" : "2px solid #d1d5db",
                  backgroundColor: approvalAction === "approve" ? "#10B981" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {approvalAction === "approve" && (
                  <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "bold" }}>✓</span>
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: approvalAction === "approve" ? "#059669" : "#6b7280",
                  }}
                >
                  Approve
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: approvalAction === "approve" ? "#047857" : "#9ca3af",
                    marginTop: "2px",
                  }}
                >
                  Accept & proceed
                </div>
              </div>
            </div>
          </div>

          {/* Reject/Return Card */}
          <div
            style={{
              flex: "0 0 300px",
              cursor: "pointer",
              padding: "10px 10px",
              borderRadius: "10px",
              border: approvalAction === "reject" ? "2px solid #FF3F7F" : "1.5px solid #e5e7eb",
              transition: "all 0.2s ease",
              boxShadow:
                approvalAction === "reject"
                  ? "0 4px 12px rgba(239, 68, 68, 0.2)"
                  : "0 2px 6px rgba(0, 0, 0, 0.05)",
            }}
            onClick={(e) => {
              // Prevent click on interactive elements inside from triggering the card action
              if (
                e.target.type !== "checkbox" &&
                !e.target.closest(".dropdown-wrapper") &&
                !e.target.closest("select")
              ) {
                handleApprovalActionChange("reject");
              }
            }}
          >
            {/* Header with checkbox and title in one line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                marginBottom: approvalAction === "reject" ? "12px" : "0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    border: approvalAction === "reject" ? "2px solid #FF3F7F" : "2px solid #d1d5db",
                    backgroundColor: approvalAction === "reject" ? "#FF3F7F" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {approvalAction === "reject" && (
                    <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "bold" }}>↩</span>
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: approvalAction === "reject" ? "#FF3F7F" : "#6b7280",
                    }}
                  >
                    Return
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: approvalAction === "reject" ? "#FF3F7F" : "#9ca3af",
                      marginTop: "2px",
                    }}
                  >
                    Send for revision
                  </div>
                </div>
              </div>

              {/* Send Back to Me Checkbox - on the same line as header */}
              {approvalAction === "reject" && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={sendBackToMe}
                    onChange={(e) => setSendBackToMe(e.target.checked)}
                    style={{
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                      accentColor: "#FF3F7F",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#FF3F7F",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Send back to me
                  </span>
                </label>
              )}
            </div>

            {approvalAction === "reject" && (
              <>
                {/* Return Dropdown below header */}
                <div
                  className="dropdown-wrapper"
                  style={{ paddingTop: "12px", borderTop: "1px dashed #fca5a5" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel
                      id="return-to-user-label"
                      sx={{
                        fontSize: "11px",
                        color: "#FF3F7F",
                        fontWeight: "700",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                        "&.Mui-focused": {
                          color: "#FF3F7F",
                        },
                      }}
                    >
                      RETURN TO USER
                    </InputLabel>
                    <MuiSelect
                      labelId="return-to-user-label"
                      value={returnToUser}
                      label="RETURN TO USER"
                      onChange={(e) => setReturnToUser(e.target.value)}
                      sx={{
                        padding: "8px 12px",
                        fontSize: "13px",
                        height: "auto",
                        borderRadius: "6px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#fca5a5",
                          borderWidth: "1.5px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#FF3F7F",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#FF3F7F !important",
                          borderWidth: "2px",
                        },
                        "& .MuiSelect-select": {
                          padding: "8px 12px",
                          fontSize: "13px",
                        },
                      }}
                    >
                      {returnUserOptions.map((option) => {
                        // Handle both simple string/number and object formats for options
                        const optionValue = typeof option === "object" ? option.value : option;
                        const optionLabel = typeof option === "object" ? option.label : option;
                        return (
                          <MenuItem key={optionValue} value={optionValue}>
                            {optionLabel}
                          </MenuItem>
                        );
                      })}
                    </MuiSelect>
                  </FormControl>
                </div>
              </>
            )}
          </div>


        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "14px",
          }}
        >
          <SaveButton onClick={handleSave}>Save as Draft</SaveButton>
          <FavoriteButton onClick={handlePreview}>Preview</FavoriteButton>
          <CancelButton onClick={handleBack}>Cancel</CancelButton>
          <SubmitButton
            onClick={handleSubmit}
            // Disable logic: requires an action, remarks, AND (if returning) a return user selection
            disabled={
              !approvalAction ||
              !approverRemarks.trim() ||
              (approvalAction === "reject" && !returnToUser)
            }
          >
            {approvalAction === "approve"
              ? "✓ Submit"
              : approvalAction === "reject"
              ? "↩ Submit"
              : "SELECT ACTION"}
          </SubmitButton>
        </div>
      </div>
    </div>
  );
};

/**
 * Prop type validation for ApproverSection.
 */
ApproverSection.propTypes = {
  approvalAction: PropTypes.oneOf(['approve', 'reject', null]),
  handleApprovalActionChange: PropTypes.func.isRequired,
  returnToUser: PropTypes.string,
  setReturnToUser: PropTypes.func.isRequired,
  returnUserOptions: PropTypes.array.isRequired,
  approverRemarks: PropTypes.string.isRequired,
  setApproverRemarks: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handlePreview: PropTypes.func.isRequired,
  sendBackToMe: PropTypes.bool,
  setSendBackToMe: PropTypes.func.isRequired,
  priority: PropTypes.string,
  setPriority: PropTypes.func.isRequired,
  priorityOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

export default ApproverSection;