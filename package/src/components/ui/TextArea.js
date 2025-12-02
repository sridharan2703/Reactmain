/**
 * @fileoverview Styles and component for a customizable TextArea input.
 * This TextArea supports disabled state styling and is fully responsive.
 * @module src/components/ui/TextArea
 * @author Rakshana
 * @date 12/09/2025
 * @since 1.0.0
 */

/**
 * Styles for the TextArea component.
 * Includes base styles and an optional disabled state.
 *
 * 📝 Example usage of styles:
 * Input:
 * <textarea style={{...textAreaStyles.base, ...textAreaStyles.disabled}} placeholder="Enter text" disabled />
 *
 * Output:
 * A gray, non-editable textarea with rounded corners and padding.
 *
 * @type {Object<string, React.CSSProperties>}
 */
const textAreaStyles = {
  base: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    fontSize: "16px",
  },
  disabled: {
    backgroundColor: "#F3F4F6",
    cursor: "not-allowed",
  },
};

/**
 * TextArea component for user text input.
 *
 * 📝 Example:
 * Input:
 * <TextArea placeholder="Write a comment..." disabled={false} />
 *
 * Output:
 * A white, editable textarea with rounded corners and padding.
 *
 * Input:
 * <TextArea placeholder="Can't type here" disabled={true} />
 *
 * Output:
 * A gray, non-editable textarea with rounded corners and a "not-allowed" cursor.
 *
 * @param {Object} props - Props passed to the TextArea component.
 * @param {string} props.placeholder - Placeholder text displayed inside the textarea.
 * @param {boolean} [props.disabled] - If true, disables the textarea and applies disabled styles.
 * @returns {JSX.Element} Rendered TextArea component.
 */
const TextArea = ({ placeholder, disabled }) => {
  const style = {
    ...textAreaStyles.base,
    ...(disabled && textAreaStyles.disabled),
  };

  return (
    <textarea
      style={style}
      placeholder={placeholder}
      disabled={disabled}
      rows={4}
    />
  );
};

export default TextArea;
