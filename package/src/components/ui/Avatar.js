/**
 * @fileoverview Styles and component for displaying user avatars.
 * Supports image avatars or a fallback with the first letter of the user's name.
 * Multiple sizes are supported: small (sm), medium (md), and large (lg).
 * @module src/components/ui/Avatar
 * @author Rakshana
 * @date 12/09/2025
 * @since 1.0.0
 */

/**
 * Styles for the Avatar component.
 * Includes base circular layout, size variants, and image styling.
 *
 * 📝 Example usage of styles:
 * Input:
 * <div style={{...avatarStyles.base, ...avatarStyles.sizes.md}}>
 *   <img src="user.jpg" alt="User" style={avatarStyles.image} />
 * </div>
 *
 * Output:
 * A medium-sized circular avatar displaying the user's image.
 *
 * @type {Object<string, React.CSSProperties | Object>}
 */
import React from "react";

const avatarStyles = {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // NOTE: changed to visible so indicator can sit on the border outside container
    overflow: "visible",
    fontWeight: "600",
    position: "relative", // required for absolutely-positioned indicator
  },
  sizes: {
    sm: { width: "32px", height: "32px", fontSize: "14px" },
    md: { width: "48px", height: "48px", fontSize: "18px" },
    lg: { width: "64px", height: "64px", fontSize: "24px" },
  },
  radius: {
    circle: { borderRadius: "50%" },
    rounded: { borderRadius: "12px" },
    square: { borderRadius: "4px" },
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    // ensure image takes the wrapper's radius
    borderRadius: "inherit",
    zIndex: 0,
  },
  colors: {
    gray: { backgroundColor: "#9CA3AF", color: "#fff" },
    green: { backgroundColor: "#10B981", color: "#fff" },
    blue: { backgroundColor: "#3B82F6", color: "#fff" },
    yellow: { backgroundColor: "#F59E0B", color: "#fff" },
    red: { backgroundColor: "#EF4444", color: "#fff" },
  },
  variations: {
    filled: {},
    outlined: { border: "2px solid #2563EB", backgroundColor: "transparent" },
    shadow: { boxShadow: "0 2px 6px rgba(0,0,0,0.2)" },
    subtle: { backgroundColor: "#F3F4F6", color: "#374151" },
    ghost: { backgroundColor: "transparent", color: "#374151" },
  },
};

const getIndicatorPositionStyles = (position) => {
  switch (position) {
    case "top-right":
      return { top: 0, right: 0, transform: "translate(25%, -25%)" };
    case "top-left":
      return { top: 0, left: 0, transform: "translate(-25%, -25%)" };
    case "bottom-left":
      return { bottom: 0, left: 0, transform: "translate(-25%, 25%)" };
    // ✅ corrected bottom-right
    default:
      return { bottom: 0, right: 0, transform: "translate(25%, 25%)" };
  }
};

/**
 * Avatar component to display a user's image or a fallback letter.
 *
 * 📝 Example:
 * Input:
 * <Avatar src="user.jpg" alt="Alice" size="md" />
 *
 * Output:
 * A medium circular avatar showing Alice's image.
 *
 * Input:
 * <Avatar alt="Bob" size="sm" />
 *
 * Output:
 * A small circular avatar showing the letter "B".
 *
 * @param {Object} props - Props passed to the Avatar component.
 * @param {string} [props.src] - Optional URL of the user's avatar image.
 * @param {string} props.alt - Alternative text for the avatar, used as fallback letter if image is missing.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Size of the avatar.
 * @returns {JSX.Element} Rendered Avatar component.
 */
const Avatar = ({
  src,
  alt,
  size = "md",
  color = "gray",
  radius = "circle",
  variant = "filled",
  indicator, // "online" | "busy" | "offline" | number | true
  indicatorPosition = "bottom-right", // supports top-right, bottom-right, etc.
  style: customStyle,
  className,
}) => {
  const wrapperStyle = {
    ...avatarStyles.base,
    ...avatarStyles.sizes[size],
    ...avatarStyles.radius[radius],
    ...(avatarStyles.colors[color] || {}),
    ...(avatarStyles.variations[variant] || {}),
    ...customStyle,
    position: "relative", // make sure wrapper is positioned
    overflow: "visible", // allow indicator to overlap outside border (important)
  };

  const fallback = alt ? alt.charAt(0).toUpperCase() : "";

  // indicator size mapping
  const indicatorSize = size === "sm" ? 10 : size === "lg" ? 16 : 12;

  const showIndicator =
    indicator !== undefined && indicator !== null && indicator !== false;

  const posStyles = getIndicatorPositionStyles(indicatorPosition);

  return (
    <div style={wrapperStyle} className={className} aria-label={alt}>
      {src ? (
        <img src={src} alt={alt} style={avatarStyles.image} />
      ) : (
        <span>{fallback}</span>
      )}

      {showIndicator && (
        <span
          style={{
            position: "absolute",
            ...posStyles,
            width: `${indicatorSize}px`,
            height: `${indicatorSize}px`,
            borderRadius: "50%",
            backgroundColor:
              indicator === "online"
                ? "#10B981"
                : indicator === "busy"
                ? "#F59E0B"
                : indicator === "offline"
                ? "#9CA3AF"
                : "#16A34A", // default green-ish for truthy values
            border: "2px solid white",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            boxSizing: "content-box",
          }}
        >
          {typeof indicator === "number" ? indicator : null}
        </span>
      )}
    </div>
  );
};

export default Avatar;
