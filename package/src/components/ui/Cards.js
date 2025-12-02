//cards with tabs
/**
 * @fileoverview Styles and component for a generic Card UI element.
 * This card displays an optional image, a title, and a description.
 * The styles make the card visually appealing with shadows, rounded corners, and padding.
 * @module src/components/ui/Card
 * @author Rakshana
 * @date 12/09/2025
 * @since 1.0.0
 */

/**
 * Styles for the Card component.
 * The card can include an image at the top, followed by a title and description.
 *
 * 📝 Example usage of styles:
 * Input:
 * <div style={cardStyles.card}>
 *   <img src="example.jpg" alt="Example" style={cardStyles.image} />
 *   <h3 style={cardStyles.title}>Card Title</h3>
 *   <p style={cardStyles.description}>This is a description of the card.</p>
 * </div>
 *
 * Output:
 * A white card with rounded corners, a drop shadow, and a neatly displayed image,
 * title, and description.
 *
 * @type {Object<string, React.CSSProperties>}
 */
import { useState } from "react";
import Button from "./Button"; // reuse your Button component if available

const cardStyles = {
  base: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    maxWidth: "320px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease-in-out",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px 8px 0 0",
    marginBottom: "12px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  description: {
    fontSize: "14px",
    color: "#6B7280",
    flexGrow: 1,
  },
  footer: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    marginBottom: "8px",
    alignSelf: "flex-end",
  },
  tabButton: (isActive) => ({
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid #E5E7EB",
    backgroundColor: isActive ? "#065F46" : "#F9FAFB",
    color: isActive ? "white" : "#374151",
    transition: "all 0.2s ease-in-out",
  }),
  tabList: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  variations: {
    filled: {
      backgroundColor: "#D1FAE5",
      color: "#065F46",
      boxShadow: "none",
      border: "1px solid #E5E7EB",
    },
    outlined: {
      boxShadow: "none",
      border: "1px solid #E5E7EB",
    },
    hoverable: {
      cursor: "pointer",
      backgroundColor: "#f7ac95ff",
    },
    horizontal: {
      flexDirection: "row",
      maxWidth: "500px",
    },
    colored: {
      backgroundColor: "#F0F9FF", // light blue
    },
  },
};

const badgeColors = {
  info: { backgroundColor: "#DBEAFE", color: "#2563EB" },
  success: { backgroundColor: "#DCFCE7", color: "#16A34A" },
  warning: { backgroundColor: "#FEF3C7", color: "#D97706" },
  danger: { backgroundColor: "#FEE2E2", color: "#DC2626" },
};


/**
 * Card component to display optional image, title, description, badges, tabs, and footer actions.
 *
 * 📝 Example:
 * Input:
 * <Card
 *   title="User Profile"
 *   description="This is a description of the card."
 *   imageUrl="example.jpg"
 *   variant="filled"
 *   badge="Active"
 *   badgeType="success"
 *   withFooter
 *   tabs={[
 *     { label: "Details", content: "User details go here" },
 *     { label: "Settings", content: "Settings content here" },
 *   ]}
 * />
 *
 * Output:
 * A styled card with a success badge, image at the top, tabs for switching content,
 * and footer buttons (Cancel/Confirm).
 *
 * @param {Object} props - Props passed to the Card component.
 * @param {string} props.title - The title text of the card.
 * @param {string} props.description - The description text of the card.
 * @param {string} [props.imageUrl] - Optional URL of the image to display in the card.
 * @param {'default' | 'filled' | 'outlined' | 'hoverable' | 'horizontal' | 'colored'} [props.variant='default'] - Visual style of the card.
 * @param {string} [props.badge] - Optional badge text to display in the card.
 * @param {'info' | 'success' | 'warning' | 'danger'} [props.badgeType='info'] - Badge color scheme.
 * @param {boolean} [props.withFooter=false] - Whether to display footer action buttons.
 * @param {Array<{label: string, content: React.ReactNode, icon?: React.ReactNode}>} [props.tabs=[]] - Optional tabs to display inside the card.
 * @returns {JSX.Element} Rendered Card component.
 */


const Card = ({
  title,
  description,
  imageUrl,
  variant = "default",
  badge,
  badgeType = "info",
  withFooter = false,
  tabs = [],
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");

  const style = {
    ...cardStyles.base,
    ...(variant !== "default" && cardStyles.variations[variant]),
  };

  return (
    <div
      style={style}
      onMouseEnter={(e) =>
        variant === "hoverable" &&
        (e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)")
      }
      onMouseLeave={(e) =>
        variant === "hoverable" &&
        (e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)")
      }
    >
      {/* Image for vertical layout */}
      {imageUrl && variant !== "horizontal" && (
        <img src={imageUrl} alt={title} style={cardStyles.image} />
      )}

      {/* Badge */}
      {badge && (
        <span style={{ ...cardStyles.badge, ...badgeColors[badgeType] }}>
          {badge}
        </span>
      )}

      <div style={{ flex: 1 }}>
        <h3 style={cardStyles.title}>{title}</h3>
        {/* If tabs exist, show content from active tab */}
        {tabs.length > 0 ? (
          <div style={cardStyles.description}>
            {tabs.find((tab) => tab.label === activeTab)?.content}
          </div>
        ) : (
          <p style={cardStyles.description}>{description}</p>
        )}
      </div>

      {/* Horizontal image */}
      {variant === "horizontal" && imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{ width: "40%", borderRadius: "8px", marginLeft: "16px" }}
        />
      )}

      {/* Tabs */}
      {tabs.length > 0 && (
        <div style={cardStyles.tabList}>
          {tabs.map((tab) => (
            <button
              key={tab.label}
              style={cardStyles.tabButton(activeTab === tab.label)}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.icon && (
                <span style={{ display: "flex", alignItems: "center" }}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Footer buttons */}
      {withFooter && (
        <div style={cardStyles.footer}>
          <Button variant="secondary" styleType="light" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
};

export default Card;
