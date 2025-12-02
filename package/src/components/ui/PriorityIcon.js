/**
 * @fileoverview Styles and component for displaying a priority indicator.
 * Shows a small colored circle representing the priority level: high, medium, low, or none.
 * @module src/components/ui/PriorityIcon
 * @author Rakshana
 * @date 12/09/2025
 * @since 1.0.0
 */

/**
 * Styles for the PriorityIcon component.
 * Includes base styles for the circle and color variations for each priority level.
 *
 * 📝 Example usage of styles:
 * Input:
 * <span style={{...priorityStyles.base, ...priorityStyles.high}} />
 *
 * Output:
 * A small red circle indicating high priority.
 *
 * @type {Object<string, React.CSSProperties>}
 */
const priorityStyles = {
  base: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    display: "inline-block",
  },
  high: {
    backgroundColor: "#EF4444", // Red
  },
  medium: {
    backgroundColor: "#F59E0B", // Amber
  },
  low: {
    backgroundColor: "#3B82F6", // Blue
  },
  none: {
    backgroundColor: "#A1A1AA", // Zinc
  },
};

/**
 * PriorityIcon component for displaying a small colored circle representing a task's priority.
 *
 * 📝 Example:
 * Input:
 * <PriorityIcon level="high" />
 *
 * Output:
 * A red circle with title "Priority: high".
 *
 * Input:
 * <PriorityIcon level="low" />
 *
 * Output:
 * A blue circle with title "Priority: low".
 *
 * @param {Object} props - Props passed to the PriorityIcon component.
 * @param {'high' | 'medium' | 'low' | 'none'} [props.level='none'] - Priority level determining the circle's color.
 * @returns {JSX.Element} Rendered priority indicator.
 */
const PriorityIcon = ({ level = "none" }) => {
  const style = {
    ...priorityStyles.base,
    ...priorityStyles[level],
  };
  return <span style={style} title={`Priority: ${level}`} />;
};

export default PriorityIcon;
