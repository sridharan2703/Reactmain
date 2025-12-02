/**
 * @fileoverview A versatile Input component with multiple variations.
 * Supports standard, search, password toggle, textarea, date, email,
 * prefix/suffix icons, clearable input, and validation states.
 * @module src/components/ui/Input
 * @author Rakshana
 * @date 15/09/2025
 * @since 2.0.0
 */

import React, { useState } from "react";

// --- STYLES ---
const inputStyles = {
  base: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  disabled: {
    backgroundColor: "#F3F4F6",
    cursor: "not-allowed",
    color: "#9CA3AF",
  },
  error: {
    borderColor: "#EF4444", // Red-500
  },
  container: {
    position: "relative",
    width: "100%",
  },
  suffix: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#6B7280",
  },
  prefix: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6B7280",
  },
};

const errorMessageStyle = {
  color: "#D32F2F",
  fontSize: "14px",
  marginTop: "4px",
};

/**
 * Input Component Variants
 *
 * @param {Object} props
 * @param {string} [props.type="text"] - Input type (text, password, email, date).
 * @param {boolean} [props.disabled] - If true, disables the input.
 * @param {string} [props.error] - Validation error message.
 * @param {boolean} [props.isSearch] - Renders a search input.
 * @param {boolean} [props.isPassword] - Renders a password input with toggle visibility.
 * @param {boolean} [props.isTextarea] - Renders a multi-line textarea.
 * @param {boolean} [props.isClearable] - Adds a clear/reset button.
 * @param {React.ReactNode} [props.prefix] - Element/icon before input.
 * @param {React.ReactNode} [props.suffix] - Element/icon after input.
 * @returns {JSX.Element} The rendered Input component.
 */
const Input = ({
  type = "text",
  disabled,
  error,
  isSearch,
  isPassword,
  isTextarea,
  isClearable,
  prefix,
  suffix,
  value,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const style = {
    ...inputStyles.base,
    ...(disabled && inputStyles.disabled),
    ...(error && inputStyles.error),
    ...(prefix ? { paddingLeft: "36px" } : {}),
    ...(suffix || isPassword || isClearable
      ? { paddingRight: "36px" }
      : {}),
  };

  // Handle input change
  const handleChange = (e) => {
    if (onChange) onChange(e.target.value);
  };

  return (
    <div>
      <div style={inputStyles.container}>
        {/* Prefix */}
        {prefix && <span style={inputStyles.prefix}>{prefix}</span>}

        {/* Textarea Variant */}
  {/* Textarea Variant with auto-resize */}
{isTextarea ? (
  <textarea
    style={{ ...style, resize: "none", overflow: "hidden" }}
    disabled={disabled}
    value={value}
    onChange={(e) => {
      handleChange(e);
      // auto-resize
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }}
    rows={1} // start with single line
    {...props}
  />
) : (
  <input
    type={
      isPassword ? (showPassword ? "text" : "password") : isSearch ? "search" : type
    }
    style={style}
    disabled={disabled}
    value={value}
    onChange={handleChange}
    {...props}
  />
)}


        {/* Password Toggle */}
        {isPassword && (
          <span
            style={inputStyles.suffix}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        )}

        {/* Clear Button */}
        {isClearable && value && (
          <span style={inputStyles.suffix} onClick={() => onChange("")}>
            ❌
          </span>
        )}

        {/* Custom Suffix */}
        {suffix && !isPassword && !isClearable && (
          <span style={inputStyles.suffix}>{suffix}</span>
        )}
      </div>

      {/* Error Message */}
      {error && <p style={errorMessageStyle}>{error}</p>}
    </div>
  );
};

export default Input;
