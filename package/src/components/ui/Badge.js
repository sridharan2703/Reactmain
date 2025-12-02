/**
 * @fileoverview Extended Badge component with color, size, and variant support.
 * Variations:
 * - Colors: default, green, red, blue, yellow
 * - Sizes: sm, md, lg
 * - Variants: filled, outline
 *
 * @module src/components/ui/Badge
 * @since 1.1.0
 */

import React from "react";

/**
 * Extended Badge component
 * Supports:
 * - Label style (like before)
 * - Overlaid style with badgeContent (like MUI)
 *
 * Usage:
 * <Badge badgeContent={4} color="yellow">
 *   <MailIcon />
 * </Badge>
 */

const badgeStyles = {
  wrapper: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  base: {
    display: "inline-block",
    borderRadius: "16px",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  sizes: {
    sm: { fontSize: "10px", padding: "2px 8px" },
    md: { fontSize: "12px", padding: "4px 12px" },
    lg: { fontSize: "14px", padding: "6px 16px" },
  },
  badgeBubble: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    minWidth: "18px",
    height: "18px",
    borderRadius: "50%",
    fontSize: "10px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
  },
  colors: {
    default: { background: "#E5E7EB", color: "#374151" },
    green: { background: "#D1FAE5", color: "#065F46" },
    red: { background: "#FEE2E2", color: "#991B1B" },
    blue: { background: "#DBEAFE", color: "#1E40AF" },
    yellow: { background: "#FEF3C7", color: "#92400E" },
  },
};
/**
 * Badge component for displaying labels or notification bubbles.
 *
 * Supports:
 * - Label style (tag/pill)
 * - Bubble style (badgeContent overlay, like MUI)
 *
 * 📝 Examples:
 * <Badge color="green" size="md" variant="filled">Success</Badge>
 * → Renders a filled green label badge with "SUCCESS"
 *
 * <Badge color="red" size="sm" variant="outline">Error</Badge>
 * → Renders a small outlined red badge with "ERROR"
 *
 * <Badge badgeContent={4} color="yellow">
 *   <MailIcon />
 * </Badge>
 * → Renders a yellow notification bubble with count "4" over the MailIcon
 *
 * <Badge badgeContent="⚠" color="red">
 *   <WarningIcon />
 * </Badge>
 * → Renders a red bubble with a ⚠ icon
 *
 * @param {Object} props - Props passed to the Badge component.
 * @param {React.ReactNode} props.children - Text or element (e.g. icon) displayed inside the badge.
 * @param {'default' | 'green' | 'red' | 'blue' | 'yellow'} [props.color='default'] - Color variant.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Badge size (affects padding + font size).
 * @param {'filled' | 'outline'} [props.variant='filled'] - Badge variant style.
 * @param {React.ReactNode} [props.badgeContent] - Optional overlay content (number, string, or icon) shown as a bubble.
 * @returns {JSX.Element} Rendered Badge component.
 */

const Badge = ({
  children,
  color = "default",
  size = "md",
  variant = "filled",
  badgeContent,
}) => {
  const { background, color: textColor } = badgeStyles.colors[color];
  const sizeStyle = badgeStyles.sizes[size];

  if (badgeContent !== undefined) {
    // Bubble badge (like notification count)
    return (
      <div style={badgeStyles.wrapper}>
        {children}
        <span
          style={{
            ...badgeStyles.badgeBubble,
            backgroundColor: background,
            color: textColor,
          }}
        >
          {badgeContent}
        </span>
      </div>
    );
  }

  // Label badge (like tags/pills)
  const style =
    variant === "filled"
      ? { ...badgeStyles.base, ...sizeStyle, backgroundColor: background, color: textColor }
      : { ...badgeStyles.base, ...sizeStyle, border: `2px solid ${textColor}`, color: textColor, backgroundColor: "transparent" };

  return <span style={style}>{children}</span>;
};

export default Badge;
