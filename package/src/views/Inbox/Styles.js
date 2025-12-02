/**
 * @fileoverview UIComponents: Pure UI components and styling helpers for visual elements.
 * @module UIComponents
 * @description Provides a set of reusable, domain-agnostic React components for 
 * task/dashboard UIs, including custom tooltips, priority icons, and date/status formatting.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - React hooks: for component state and effect management.
 * - Tabler Icons: for vector icons.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  IconFlame,
  IconAlertTriangle,
  IconCircleLetterSFilled,
  IconUrgent,
  IconAlertCircleFilled,
} from "@tabler/icons-react";
import PropTypes from 'prop-types';

/**
 * @constant {Object} palette
 * @description A centralized color palette object for consistent styling across components.
 */
const palette = {
  primary: "#2563EB",
  secondary: "#64748B",
  success: "#059669",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#0891B2",
  neutral: "#374151",
  light: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
  hover: "#F1F5F9",
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    muted: "#94A3B8",
  },
  overdue: {
    bg: "#FEF2F2",
    border: "#FECACA",
    text: "#DC2626",
  },
};

/**
 * Calculates the number of days between a given date string and the current date.
 * @param {string} dateString - The date string to compare against.
 * @returns {number} The number of days passed (0 for today, 1 for yesterday, etc.).
 */
const getNumericDaysAgo = (dateString) => {
  if (dateString === "N/A") return 0;
  const updated = new Date(dateString);
  if (isNaN(updated.getTime())) return 0;
  const now = new Date();
  const diffTime = Math.abs(now - updated);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Formats the days difference into a human-readable string ("Today", "1 day", "N days").
 * @param {string} dateString - The date string.
 * @returns {string} The formatted days ago string.
 */
const getDaysAgo = (dateString) => {
  const days = getNumericDaysAgo(dateString);
  if (days === 0) return "Today";
  return days === 1 ? "1 day" : `${days} days`;
};

/**
 * Retrieves a hex color code based on a status/badge string.
 * @param {string} badge - The status string (e.g., "Done", "Urgent").
 * @returns {string} The corresponding hex color code.
 */
const getStatusColor = (badge) => {
  switch (badge?.toLowerCase()) {
    case "done":
      return "#10B981";
    case "urgent":
      return "#EF4444";
    case "on hold":
      return "#F59E0B";
    case "later":
      return "#8B5CF6";
    case "review":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

/**
 * @typedef {Object} SmartTooltipProps
 * @property {React.ReactNode} children - The element that triggers the tooltip.
 * @property {React.ReactNode} content - The content to be displayed inside the tooltip.
 * @property {boolean} visible - Controls the visibility of the tooltip.
 */

/**
 * SmartTooltip Component.
 * A custom, dynamically positioned tooltip that ensures it stays within the viewport boundaries.
 * 
 * @param {SmartTooltipProps} props - The component's props.
 * @returns {JSX.Element} The tooltip wrapper.
 */
const SmartTooltip = ({ children, content, visible }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  // eslint-disable-next-line
  const [placement, setPlacement] = useState("bottom");
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  
  /** Effect to calculate the best position for the tooltip to avoid clipping off the screen. */
  useEffect(() => {
    if (visible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newPlacement = "bottom"; // Currently only using bottom/top logic
      let top = triggerRect.bottom + 8;
      let left =
        triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        
      // Check if tooltip overflows bottom, switch to top placement
      if (top + tooltipRect.height > viewportHeight - 10) {
        newPlacement = "top";
        top = triggerRect.top - tooltipRect.height - 8;
      }
      
      // Horizontal clamping
      if (left < 10) {
        left = triggerRect.left;
      } else if (left + tooltipRect.width > viewportWidth - 10) {
        left = triggerRect.right - tooltipRect.width;
      }
      
      // Final clamping to ensure it's fully on screen
      left = Math.max(
        10,
        Math.min(left, viewportWidth - tooltipRect.width - 10)
      );
      top = Math.max(
        10,
        Math.min(top, viewportHeight - tooltipRect.height - 10)
      );
      
      setPosition({ top, left });
      setPlacement(newPlacement);
    }
  }, [visible]);
  
  return (
    <div
      ref={triggerRef}
      style={{ position: "relative", display: "inline-flex" }}
    >
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            background: "rgb(248, 250, 252)",
            color: "rgb(0, 0, 0)",
            padding: "8px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "500",
            whiteSpace: "nowrap",
            zIndex: 999,
            boxShadow:
              "0 8px 25px rgba(139, 92, 246, 0.3), 0 4px 12px rgba(0,0,0,0.15)",
            pointerEvents: "none",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {content}
          {/* Tooltip arrow/pointer */}
          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "6px solid rgb(248, 250, 252)",
            }}
          />
        </div>
      )}
    </div>
  );
};

SmartTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
};

/**
 * @typedef {Object} PriorityIconProps
 * @property {string} priority - The priority level string (e.g., "Critical", "High").
 */

/**
 * PriorityIcon Component.
 * Renders an icon and badge set corresponding to the task's priority level, 
 * with an informative tooltip.
 * 
 * @param {PriorityIconProps} props - The component's props.
 * @returns {JSX.Element} The priority icon component.
 */
const PriorityIcon = ({ priority }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  /** Maps a priority string to a configuration array of icons/colors. */
  const getPriorityConfig = (priority) => {
    const priorityLower = priority?.toLowerCase() || "";
    switch (priorityLower) {
      case "critical":
        return [
          {
            icon: IconUrgent,
            color: palette.danger,
            label: "Critical",
          },
        ];
      case "high":
        return [
          { icon: IconFlame, color: palette.warning, label: "High Priority" },
          { icon: IconCircleLetterSFilled, color: palette.danger, label: "SLA" }, 
        ];
      default:
        return []; 
    }
  };

  const configs = getPriorityConfig(priority);

  if (configs.length === 0) {
    return <div style={{ minWidth: '40px', height: '30px' }} />; // Empty space placeholder
  }

  const primaryLabel = configs.map(c => c.label).join(' + ');

  return (
    <SmartTooltip content={primaryLabel} visible={showTooltip}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          padding: "2px", 
          borderRadius: "8px",
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {configs.map((config, index) => {
          const IconComponent = config.icon;
          return (
            <div
              key={index}
              style={{
                padding: "6px",
                borderRadius: "6px",
                background: `${config.color}10`,
                border: `1px solid ${config.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              <IconComponent size={16} color={config.color} stroke={1.5} />
            </div>
          );
        })}
      </div>
    </SmartTooltip>
  );
};

PriorityIcon.propTypes = {
  priority: PropTypes.string,
};

/**
 * @typedef {Object} OverdueBadgeProps
 * @property {number} days - Number of days overdue (though the prop isn't used in the final render).
 */

/**
 * OverdueBadge Component.
 * Renders a fixed "Overdue" status badge with a color scheme from the palette.
 * 
 * @param {OverdueBadgeProps} props - The component's props.
 * @returns {JSX.Element} The Overdue badge.
 */
const OverdueBadge = ({ days }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      background: palette.overdue.bg,
      color: palette.overdue.text,
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: "600",
      border: `1px solid ${palette.overdue.border}`,
    }}
  >
    <IconAlertCircleFilled size={12} stroke={1.5} />
    Overdue
  </div>
);

OverdueBadge.propTypes = {
  days: PropTypes.number,
};

/**
 * @typedef {Object} DaysCellProps
 * @property {string} daysAgo - The date string from which to calculate days ago.
 */

/**
 * DaysCell Component.
 * Displays the "N days ago" text, highlighting the cell if the item is considered overdue ( > 2 days).
 * 
 * @param {DaysCellProps} props - The component's props.
 * @returns {JSX.Element} The days difference cell content.
 */
const DaysCell = ({ daysAgo }) => {
  const numericDays = getNumericDaysAgo(daysAgo);
  const isOverdue = numericDays > 2;
  const displayText = getDaysAgo(daysAgo);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        fontWeight: isOverdue ? "600" : "400",
        color: isOverdue ? palette.overdue.text : palette.text.secondary,
      }}
    >
      {isOverdue && <IconAlertTriangle size={14} color={palette.overdue.text} />}
      <span>{displayText}</span>
    </div>
  );
};

DaysCell.propTypes = {
  daysAgo: PropTypes.string.isRequired,
};

/**
 * @typedef {Object} ProfileAvatarProps
 * @property {string} initiator - The full name of the initiator.
 */

/**
 * ProfileAvatar Component.
 * Renders a custom avatar with initials and a dynamically generated background color 
 * based on the initiator's name, wrapped in a SmartTooltip.
 * 
 * @param {ProfileAvatarProps} props - The component's props.
 * @returns {JSX.Element} The profile avatar component.
 */
const ProfileAvatar = ({ initiator }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  /** Gets initials from a full name. */
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  /** Generates a consistent color based on a hash of the name string. */
  const getAvatarColor = (name) => {
    const colors = [
      "#173F5F",
      "#20639B",
      "#3CAEA3",
      "#F6D55C",
      "#ED553B",
    ];
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };
  
  const avatarColor = getAvatarColor(initiator);
  
  return (
    <SmartTooltip content={initiator} visible={showTooltip}>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}DD)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: palette.white,
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease",
          border: `2px solid ${palette.white}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
          setShowTooltip(true);
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          setShowTooltip(false);
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        }}
      >
        {getInitials(initiator)}
      </div>
    </SmartTooltip>
  );
};

ProfileAvatar.propTypes = {
  initiator: PropTypes.string.isRequired,
};

/**
 * @typedef {Object} ProgressBarProps
 * @property {number} progress - The completion percentage (0-100).
 * @property {string} [color] - Optional hex color for the progress bar fill.
 */

/**
 * ProgressBar Component.
 * Renders a simple horizontal progress bar.
 * 
 * @param {ProgressBarProps} props - The component's props.
 * @returns {JSX.Element} The progress bar.
 */
const ProgressBar = ({ progress, color }) => (
  <div
    style={{
      width: "100px",
      height: "8px",
      backgroundColor: palette.border,
      borderRadius: "4px",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      style={{
        width: `${progress}%`,
        height: "100%",
        background: `linear-gradient(90deg, ${color || palette.primary}, ${
          color || palette.primary
        }DD)`,
        borderRadius: "4px",
        transition: "width 0.3s ease",
      }}
    />
  </div>
);

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  color: PropTypes.string,
};

// Export for use in other components
export {
  palette,
  getStatusColor,
  getNumericDaysAgo,
  getDaysAgo,
  SmartTooltip,
  PriorityIcon,
  OverdueBadge,
  DaysCell,
  ProfileAvatar,
  ProgressBar,
};