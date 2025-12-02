/**
 * @fileoverview Alerts component for displaying styled alert messages.
 * Supports multiple alert types: success, error, warning, and info.
 * Each type can be rendered in different variants: filled, outlined, and subtle.
 * Each alert includes an icon for better visual feedback and a dismiss button.
 *
 * @module src/components/ui/Alerts
 * @date 12/09/2025
 * @since 1.0.0
 */

import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";

const alertStyles = {
  base: {
    padding: "12px 16px",
    marginBottom: "16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // ✅ for icon+text on left, close on right
    gap: "12px",
  },
  variants: {
    success: {
      filled: { backgroundColor: "#D1FAE5", color: "#065F46" },
      outlined: {
        border: "1px solid #065F46",
        color: "#065F46",
        backgroundColor: "#fff",
      },
      subtle: { backgroundColor: "#ECFDF5", color: "#047857" },
    },
    error: {
      filled: { backgroundColor: "#FEE2E2", color: "#991B1B" },
      outlined: {
        border: "1px solid #991B1B",
        color: "#991B1B",
        backgroundColor: "#fff",
      },
      subtle: { backgroundColor: "#FEF2F2", color: "#B91C1C" },
    },
    warning: {
      filled: { backgroundColor: "#FEF3C7", color: "#92400E" },
      outlined: {
        border: "1px solid #92400E",
        color: "#92400E",
        backgroundColor: "#fff",
      },
      subtle: { backgroundColor: "#FFFBEB", color: "#B45309" },
    },
    info: {
      filled: { backgroundColor: "#DBEAFE", color: "#1E40AF" },
      outlined: {
        border: "1px solid #1E40AF",
        color: "#1E40AF",
        backgroundColor: "#fff",
      },
      subtle: { backgroundColor: "#EFF6FF", color: "#2563EB" },
    },
  },
};

// ✅ Icons
const alertIcons = {
  success: <FaCheckCircle />,
  error: <FaTimesCircle />,
  warning: <FaExclamationTriangle />,
  info: <FaInfoCircle />,
};

/**
 * Alerts component with dismiss button
 *
 * @param {Object} props
 * @param {'success' | 'error' | 'warning' | 'info'} props.type
 * @param {string} props.message
 * @param {'filled' | 'outlined' | 'subtle'} [props.variant]
 * @returns {JSX.Element}
 */
const Alerts = ({ type, message, variant = "filled" }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null; // ✅ Don’t render if closed

  const style = {
    ...alertStyles.base,
    ...alertStyles.variants[type][variant],
  };

  return (
    <div style={style}>
      {/* Left: Icon + message */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "16px" }}>{alertIcons[type]}</span>
        <span>{message}</span>
      </div>

      {/* Right: Cancel button */}
      <button
        onClick={() => setVisible(false)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "inherit",
          fontSize: "16px",
        }}
        aria-label="Close alert"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Alerts;
