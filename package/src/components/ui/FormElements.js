/**
 * @fileoverview Styles for form elements (like inputs, labels, and ratings).
 * These styles make form fields easy to read and use.
 * @module src/components/ui
 * @author Rakshana
 * @date 12/09/2025
 * @since 1.0.0
 */

/**
 * Styles for form fields such as text boxes, labels, highlighted inputs, and rating stars.
 *
 * 📝 Example 1 (Text Input):
 * Input:
 * <div style={formElementStyles.container}>
 *   <label style={formElementStyles.label}>Name</label>
 *   <input style={formElementStyles.input} type="text" placeholder="Enter your name" />
 * </div>
 *
 * Output:
 * A clean input box with rounded corners and a label "Name" above it.
 *
 * 📝 Example 2 (Highlighted Input):
 * Input:
 * <input style={{ ...formElementStyles.input, ...formElementStyles.highlight }} type="text" value="Warning" />
 *
 * Output:
 * A yellow-highlighted input box, often used to show errors or special attention.
 *
 * 📝 Example 3 (Rating Input):
 * Input:
 * <div style={formElementStyles.ratingContainer}>
 *   <div style={formElementStyles.starsContainer}>
 *     ⭐ ⭐ ⭐ ⭐ ⭐
 *     <span style={formElementStyles.ratingText}>4.5/5</span>
 *   </div>
 * </div>
 *
 * Output:
 * A row of stars with a rating number beside them (e.g., "4.5/5").
 *
 * @type {Object<string, React.CSSProperties>}
 */
export const formElementStyles = {
  container: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '12px',
    color: '#6B7280',
    margin: '0 0 4px 0',
    fontWeight: '500',
  },
  input: {
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
    color: '#111827',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease-in-out',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
  },
  highlight: {
    backgroundColor: '#fffbe0',
    border: '1px solid #fcd34d',
  },
  ratingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  starsContainer: {
    display: 'flex',
    gap: '2px',
    alignItems: 'center',
    marginTop: '5px',
  },
  ratingText: {
    marginLeft: '8px',
    color: '#4b5563',
    fontSize: '14px',
    fontWeight: '500',
  }
};

// Example of a default export
export default formElementStyles;
