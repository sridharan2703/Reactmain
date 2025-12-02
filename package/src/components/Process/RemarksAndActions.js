/**
 * @fileoverview Compact Enhanced RemarksAndActions component for forms.
 * Features stunning priority visualization with badge selection.
 * @module RemarksAndActions
 * @author Rakshana
 * @date 05/11/2025
 * @since 3.2.0 // Updated version
 */

import React from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import { SaveButton, SubmitButton, FavoriteButton, DeleteButton } from "src/components/ui/Button.js";
import FlagIcon from "@mui/icons-material/Flag";
import NotesIcon from "@mui/icons-material/Notes";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";

/**
 * Compact enhanced component with stunning visual design and badge selection.
 */
const RemarksAndActions = ({
  remarks,
  onRemarksChange,
  priority,
  onPriorityChange,
  onSave,
  onSubmit,
  onPreview,
  isSavedSuccessfully,
  loading,
  remarksLabel = "Remarks",
  priorityLabel = "Priority Level",
  saveLabel = "Save as Draft",
  submitLabel: submitLabelProp, // Renamed to submitLabelProp to avoid conflict
  previewLabel = "Preview",
  deleteLabel = "Delete",
  priorityOptions = [
    { value: "17", label: "Normal" },
    { value: "18", label: "High" },
    { value: "19", label: "Critical" },
  ],
  initiator = false,
  draft = false, // Used for SaveandHold context
  additionalDetails = false, // NEW PROP for AdditionalDetails context
  onDelete,
}) => {
  const finalSubmitLabel = additionalDetails 
    ? (submitLabelProp || "Re-Submit") 
    : (submitLabelProp || "Submit");
  const showDeleteButton = draft && onDelete;

  // Check if current priority is valid
  const validPriorities = priorityOptions.map(p => p.value);
  const isPriorityValid = validPriorities.includes(priority);

  // If priority is invalid or falsy, default to "17" for visual rendering
  const effectivePriority = isPriorityValid ? priority : "17"; 
  
  // Synchronize parent state to "17" if the current state is invalid/unset on initial load
  React.useEffect(() => {
    if (!isPriorityValid) {
      // Only set the default if the current prop value is not in the list
      onPriorityChange("17");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  const getPriorityBadgeConfig = (priorityValue) => {
   
    const configs = {
     
      // PRIORITY 17: NORMAL (NEW: BLUE)
      "17": {
        gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", // Blue gradient
        glowGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)",
        borderColor: "#3b82f6",
        color: "#1e40af", // Dark Blue for text
        glowColor: "rgba(59, 130, 246, 0.3)",
        label: "Normal Priority",
        description: "Standard processing time",
      },
      
     
      // PRIORITY 18: HIGH (NEW: ORANGE)
      "18": {
        gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", // Orange gradient
        glowGradient: "linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.08) 100%)",
        borderColor: "#f97316",
        color: "#f34f18ff", // Dark Orange/Brown for text
        glowColor: "rgba(249, 115, 22, 0.3)",
        label: "High Priority",
        description: "Urgent attention required",
      },
      
      
      // PRIORITY 19: CRITICAL (REMAINS: RED)
      "19": {
        gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        glowGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)",
        borderColor: "#ef4444",
        color: "#e00d0dff",
        glowColor: "rgba(239, 68, 68, 0.3)",
        label: "Critical Priority",
        description: "Immediate action needed",
      },
    };
   
    return configs[priorityValue] || configs["17"]; 
  };

  const badgeConfig = getPriorityBadgeConfig(effectivePriority);

  const sectionStyle = {
    padding: "20px",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
  };

  const fieldContainerStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "20px",
    alignItems: "start",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  };

  const badgeGroupStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  };

  const getBadgeStyle = (priorityVal) => {
    const config = getPriorityBadgeConfig(priorityVal);
    const isSelected = effectivePriority === priorityVal;
    
    return {
      height: "36px",
      fontSize: "13px",
      fontWeight: isSelected ? "700" : "600",
      borderRadius: "10px",
      // Thicker, colored border when selected, subtle grey border when unselected
      border: isSelected ? `2px solid ${config.borderColor}` : "1.5px solid #e5e7eb", 
      // Gradient background when selected, white/transparent when unselected
      background: isSelected ? config.gradient : "#fff",
      // White text/icon when selected, specific color when unselected
      color: isSelected ? "#fff" : config.color,
      boxShadow: isSelected ? `0 4px 12px ${config.glowColor}` : "0 1px 3px rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-1px)", // Reduced hover transform
        boxShadow: `0 4px 12px ${config.glowColor}`,
        // Use glowGradient on hover for unselected to give feedback
        background: isSelected ? config.gradient : config.glowGradient, 
      },
      // Ensure Mui Chip inner elements also adopt the correct colors
      "& .MuiChip-label": {
        color: isSelected ? "#fff" : config.color,
      },
      "& .MuiChip-icon": {
        color: isSelected ? "#fff" : config.color,
      }
    };
  };

  const priorityShowcaseStyle = {
    marginTop: "10px",
    padding: "14px",
    background: badgeConfig.glowGradient, // Use template literal if needed, but it's fine as string
    borderRadius: "12px",
    border: `2px solid ${badgeConfig.borderColor}`, // Use template literal for dynamic border
    boxShadow: `0 4px 12px ${badgeConfig.glowColor}`, // Use template literal for dynamic shadow
    transition: "all 0.3s ease",
  };

  const priorityHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const priorityIconBoxStyle = {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: badgeConfig.gradient,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 4px 10px ${badgeConfig.glowColor}`,
    flexShrink: 0,
  };

  const priorityTextContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  };

  const priorityLabelMainStyle = {
    fontSize: "15px",
    fontWeight: "800",
    color: badgeConfig.color,
    letterSpacing: "0.3px",
    lineHeight: "1.2",
  };

  const priorityDescriptionStyle = {
    fontSize: "11px",
    fontWeight: "500",
    color: badgeConfig.color,
    opacity: 0.7,
    marginTop: "4px",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    justifyContent: "flex-end",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9",
  };

  const buttonEnhancedStyle = {
    minWidth: "120px",
    height: "44px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.18)",
    },
  };

  return (
    <div style={sectionStyle}>
      <div style={fieldContainerStyle}>
        {/* Remarks Field - Left */}
        <div>
          <div style={labelStyle}>
            <NotesIcon sx={{ fontSize: 16, color: "#64748b" }} />
            {remarksLabel}
          </div>
          <TextField
            placeholder="Enter your remarks"
            name="remarks"
            value={remarks}
            onChange={(e) => onRemarksChange(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={5}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
                border: "1.5px solid #e5e7eb",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#cbd5e1",
                  transform: "translateY(-1px)",
                },
                "&.Mui-focused": {
                  borderColor: "#6366f1",
                  boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "14px",
                lineHeight: "1.5",
              },
            }}
          />
        </div>

        {/* Priority Section - Right */}
        <div>
          <div style={labelStyle}>
            <SignalCellularAltIcon sx={{ fontSize: 16, color: "#64748b" }} />
            {priorityLabel}
          </div>
          
          <div style={badgeGroupStyle}>
            {priorityOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                icon={<FlagIcon sx={{ fontSize: 16 }} />}
                onClick={() => onPriorityChange(option.value)}
                sx={getBadgeStyle(option.value)}
              />
            ))}
          </div>
          
          <div style={priorityShowcaseStyle}>
            <div style={priorityHeaderStyle}>
              <div style={priorityIconBoxStyle}>
                <FlagIcon sx={{ fontSize: 18, color: "#fff" }} />
              </div>
              <div style={priorityTextContainerStyle}>
                <div style={priorityLabelMainStyle}>
                  {badgeConfig.label}
                </div>
                <div style={priorityDescriptionStyle}>
                  {badgeConfig.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        {(initiator || draft || additionalDetails) && (
          <SaveButton
            variant="primary"
            styleType="gradient"
            onClick={onSave}
            disabled={loading}
            sx={buttonEnhancedStyle}
          >
            {saveLabel}
          </SaveButton>
        )}

        <SubmitButton
          type="button" 
          variant={additionalDetails ? "primary" : "success"}
          styleType="filled"
          onClick={onSubmit}
          disabled={loading}
          sx={buttonEnhancedStyle}
        >
          {finalSubmitLabel}
        </SubmitButton>

        {showDeleteButton && (
          <DeleteButton
            onClick={onDelete}
            variant="error"
            styleType="filled"
            disabled={loading}
            sx={buttonEnhancedStyle}
          >
            {deleteLabel}
          </DeleteButton>
        )}

        {isSavedSuccessfully && onPreview && (
          <FavoriteButton
            onClick={onPreview}
            variant="warning"
            styleType="filled"
            disabled={loading}
            sx={buttonEnhancedStyle}
          >
            {previewLabel}
          </FavoriteButton>
        )}
      </div>
    </div>
  );
};

RemarksAndActions.propTypes = {
  remarks: PropTypes.string.isRequired,
  onRemarksChange: PropTypes.func.isRequired,
  priority: PropTypes.oneOf(["17", "18", "19"]),
  onPriorityChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onPreview: PropTypes.func,
  isSavedSuccessfully: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  remarksLabel: PropTypes.string,
  priorityLabel: PropTypes.string,
  saveLabel: PropTypes.string,
  submitLabel: PropTypes.string, 
  previewLabel: PropTypes.string,
  deleteLabel: PropTypes.string,
  priorityOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  initiator: PropTypes.bool,
  draft: PropTypes.bool, // For SaveandHold context
  additionalDetails: PropTypes.bool, // For AdditionalDetails context
  onDelete: PropTypes.func,
};

RemarksAndActions.defaultProps = {
  priority: "17",
  initiator: false,
  draft: false,
  additionalDetails: false,
  submitLabel: "Submit", 
};

export default RemarksAndActions;