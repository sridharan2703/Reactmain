/**
 * @fileoverview Styles and component for a customizable Checkbox input.
 * Supports label text, checked state, onChange handling, and disabled state styling.
 * @module src/components/ui/Checkbox
 * @author Rakshana
 * @date 12/09/2025
 * @since 1.0.0
 */

import React from "react";

/**
 * Styles for the Checkbox component.
 * Includes container layout, input sizing, label text, and disabled states.
 *
 * 📝 Example usage of styles:
 * Input:
 * <label style={checkboxStyles.container}>
 *   <input type="checkbox" style={checkboxStyles.input} />
 *   <span style={checkboxStyles.label}>Option</span>
 * </label>
 *
 * Output:
 * A horizontally aligned checkbox with label text, pointer cursor, and spacing.
 *
 * @type {Object<string, React.CSSProperties | Object>}
 */
const checkboxStyles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  input: {
    cursor: "pointer",
    width: "16px",
    height: "16px",
  },
  label: {
    fontSize: "16px",
    color: "#374151",
  },
  disabledLabel: {
    color: "#9CA3AF",
    cursor: "not-allowed",
  },
};

/**
 * Checkbox component with label, checked state, and optional disabled state.
 *
 * 📝 Example:
 * Input:
 * <Checkbox label="Accept Terms" checked={true} onChange={() => {}} />
 *
 * Output:
 * A checkbox displayed next to the text "Accept Terms" with pointer cursor.
 *
 * Input:
 * <Checkbox label="Accept Terms" checked={false} disabled={true} />
 *
 * Output:
 * A gray, non-interactive checkbox with gray label text and "not-allowed" cursor.
 *
 * @param {Object} props - Props passed to the Checkbox component.
 * @param {string} props.label - Text to display next to the checkbox.
 * @param {boolean} props.checked - Whether the checkbox is checked.
 * @param {function} props.onChange - Callback function triggered when the checkbox changes.
 * @param {boolean} [props.disabled] - If true, disables the checkbox and applies disabled styles.
 * @returns {JSX.Element} Rendered Checkbox component.
 */
const Checkbox = ({ label, checked, onChange, disabled }) => {
  const labelStyle = {
    ...checkboxStyles.label,
    ...(disabled && checkboxStyles.disabledLabel),
  };
  
  const containerStyle = {
    ...checkboxStyles.container,
    ...(disabled && { cursor: 'not-allowed' }),
  };

  return (
    <label style={containerStyle}>
      <input
        type="checkbox"
        style={checkboxStyles.input}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span style={labelStyle}>{label}</span>
    </label>
  );
};

export default Checkbox;
