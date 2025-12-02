/**
 * @fileoverview Enhanced Button component with all variations in one file.
 * Supports multiple variants, style types, sizes, states, and new variations.
 * Includes navigation functions for back, previous, and next buttons.
 * @module src/components/ui/Button
 * @author Rakshana
 * @date 12/09/2025
 * @since 1.0.0
 * @ModifedBy Susmitha
 * @ModifiedOn 30/10/2025
 */

import {
  FaSpinner,
  FaDownload,
  FaPlus,
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaSearch,
  FaFilter,
  FaSync,
  FaFileExport,
  FaUpload,
  FaPrint,
  FaShare,
  FaCopy,
  FaHeart,
  FaStar,
  FaBell,
  FaLock,
  FaUnlock,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { Button as MuiButton } from "@mui/material";
// Enhanced button styles with new variations
const buttonStyles = {
  base: {
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "inherit",
    lineHeight: "1.5",
    textDecoration: "none",
    position: "relative",
    overflow: "hidden",
  },

  variants: {
    primary: {
      filled: {
        background:
          "linear-gradient(135deg, rgb(32, 99, 155) 0%, rgb(23, 63, 95) 100%)",
        color: "#fff",
      },
      outlined: {
        backgroundColor: "transparent",
        color: "#6d28d9",
        border: "2px solid #6d28d9",
      },
      light: { backgroundColor: "#ede9fe", color: "#6d28d9" },
      gradient: {
        background: "linear-gradient(135deg, #6d28d9, #8b5cf6)",
        color: "#fff",
      },
    },
    secondary: {
      filled: { backgroundColor: "#374151", color: "#fff" },
      outlined: {
        backgroundColor: "transparent",
        color: "#374151",
        border: "2px solid #374151",
      },
      light: { backgroundColor: "#f3f4f6", color: "#374151" },
      gradient: {
        background: "linear-gradient(135deg, #374151, #6b7280)",
        color: "#fff",
      },
    },
    success: {
      filled: { backgroundColor: "#16a34a", color: "#fff" },
      outlined: {
        backgroundColor: "transparent",
        color: "#16a34a",
        border: "2px solid #16a34a",
      },
      light: { backgroundColor: "#dcfce7", color: "#16a34a" },
      gradient: {
        background: "linear-gradient(135deg, #16a34a, #22c55e)",
        color: "#fff",
      },
    },
    danger: {
      filled: { backgroundColor: "#dc2626", color: "#fff" },
      outlined: {
        backgroundColor: "transparent",
        color: "#dc2626",
        border: "2px solid #dc2626",
      },
      light: { backgroundColor: "#fee2e2", color: "#dc2626" },
      gradient: {
        background: "linear-gradient(135deg, #dc2626, #ef4444)",
        color: "#fff",
      },
    },
    warning: {
      filled: { backgroundColor: "#f59e0b", color: "#fff" },
      outlined: {
        backgroundColor: "transparent",
        color: "#f59e0b",
        border: "2px solid #f59e0b",
      },
      light: { backgroundColor: "#fef3c7", color: "#92400e" },
      gradient: {
        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
        color: "#fff",
      },
    },
    info: {
      filled: { backgroundColor: "#2563eb", color: "#fff" },
      outlined: {
        backgroundColor: "transparent",
        color: "#2563eb",
        border: "2px solid #2563eb",
      },
      light: { backgroundColor: "#dbeafe", color: "#2563eb" },
      gradient: {
        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
        color: "#fff",
      },
    },
    ghost: {
      filled: { backgroundColor: "transparent", color: "#374151" },
      outlined: {
        backgroundColor: "transparent",
        color: "#374151",
        border: "2px dashed #374151",
      },
      light: { backgroundColor: "transparent", color: "#6b7280" },
      gradient: { backgroundColor: "transparent", color: "#374151" },
    },
    link: {
      filled: {
        backgroundColor: "transparent",
        color: "#2563eb",
        textDecoration: "underline",
      },
      outlined: {
        backgroundColor: "transparent",
        color: "#2563eb",
        border: "none",
        textDecoration: "underline",
      },
      light: { backgroundColor: "transparent", color: "#3b82f6" },
      gradient: {
        backgroundColor: "transparent",
        color: "#2563eb",
        textDecoration: "underline",
      },
    },
    premium: {
      filled: { backgroundColor: "#f59e0b", color: "#fff" },
      outlined: {
        backgroundColor: "transparent",
        color: "#f59e0b",
        border: "2px solid #f59e0b",
      },
      light: { backgroundColor: "#fef3c7", color: "#92400e" },
      gradient: {
        background: "linear-gradient(135deg, #f59e0b, #d97706)",
        color: "#fff",
      },
    },
    dark: {
      filled: { backgroundColor: "#1f2937", color: "#fff" },
      outlined: {
        backgroundColor: "transparent",
        color: "#1f2937",
        border: "2px solid #1f2937",
      },
      light: { backgroundColor: "#4b5563", color: "#fff" },
      gradient: {
        background: "linear-gradient(135deg, #1f2937, #374151)",
        color: "#fff",
      },
    },
    light: {
      filled: {
        backgroundColor: "#f9fafb",
        color: "#374151",
        border: "1px solid #e5e7eb",
      },
      outlined: {
        backgroundColor: "transparent",
        color: "#374151",
        border: "2px solid #e5e7eb",
      },
      light: {
        backgroundColor: "#ffffff",
        color: "#374151",
        border: "1px solid #d1d5db",
      },
      gradient: {
        background: "linear-gradient(135deg, #f9fafb, #ffffff)",
        color: "#374151",
      },
    },
  },

  sizes: {
    xs: { fontSize: "12px", padding: "4px 8px", minHeight: "24px" },
    sm: { fontSize: "13px", padding: "6px 12px", minHeight: "32px" },
    md: { fontSize: "14px", padding: "10px 20px", minHeight: "40px" },
    lg: { fontSize: "16px", padding: "12px 28px", minHeight: "48px" },
    xl: { fontSize: "18px", padding: "16px 32px", minHeight: "56px" },
  },

  shapes: {
    square: { borderRadius: "4px" },
    rounded: { borderRadius: "8px" },
    pill: { borderRadius: "50px" },
    circle: { borderRadius: "50%", padding: "12px", aspectRatio: "1/1" },
  },

  states: {
    disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
    },
    loading: {
      cursor: "not-allowed",
    },
  },
};

/**
 * Navigation Helper Functions
 */
const navigationHelpers = {
  goBack: () => {
   
    if (window.history.length > 1) {
      window.history.back();
     
    } else {
     
    }
  },

  goForward: () => {
    
    if (window.history.length > 1) {
      window.history.forward();
    
    } else {
     
    }
  },

  navigateTo: (url) => {
    
    window.location.href = url;
  },

  goHome: () => {
    
    window.location.href = "/";
  },

  goToPrevious: (currentIndex, totalItems, onNavigate) => {
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
  

    if (onNavigate && typeof onNavigate === "function") {
     
      onNavigate(previousIndex);
    }
    return previousIndex;
  },

  goToNext: (currentIndex, totalItems, onNavigate) => {
    const nextIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
  

    if (onNavigate && typeof onNavigate === "function") {
      onNavigate(nextIndex);
    }
    return nextIndex;
  },

  goToStep: (currentStep, targetStep, totalSteps, onStepChange) => {
 

    if (targetStep >= 0 && targetStep < totalSteps && onStepChange) {
    
      onStepChange(targetStep);
    } else {
     
    }
  },
};

/**
 * Main Button Component with enhanced variations
 */
const Button = ({
  children,
  variant = "primary",
  styleType = "filled",
  size = "md",
  shape = "rounded",
  disabled = false,
  isLoading = false,
  isDownloading = false,
  fullWidth = false,
  href,
  onClick,
  icon,
  iconPosition = "left",
  badge,
  tooltip,
  navigateTo,
  goBack = false,
  goForward = false,
  goHome = false,
  onStepChange,
  currentStep,
  targetStep,
  totalSteps,
  onNavigate,
  currentIndex,
  totalItems,
  ...props
}) => {
  const style = {
    ...buttonStyles.base,
    ...(buttonStyles.variants[variant]?.[styleType] ||
      buttonStyles.variants.primary.filled),
    ...buttonStyles.sizes[size],
    ...buttonStyles.shapes[shape],
    ...(disabled && buttonStyles.states.disabled),
    ...(isLoading && buttonStyles.states.loading),
    ...(fullWidth && { width: "100%" }),
    ...props.style,
  };

  const handleClick = (e) => {
    if (goBack) {
      navigationHelpers.goBack();
      return;
    }

    if (goForward) {
      navigationHelpers.goForward();
      return;
    }

    if (goHome) {
      navigationHelpers.goHome();
      return;
    }

    if (navigateTo) {
      navigationHelpers.navigateTo(navigateTo);
      return;
    }

    if (onStepChange && currentStep !== undefined && targetStep !== undefined) {
      navigationHelpers.goToStep(
        currentStep,
        targetStep,
        totalSteps || 10,
        onStepChange
      );
      return;
    }

    if (onNavigate && currentIndex !== undefined && totalItems !== undefined) {
      if (variant === "previous" || props["data-type"] === "previous") {
        navigationHelpers.goToPrevious(currentIndex, totalItems, onNavigate);
        return;
      }
      if (variant === "next" || props["data-type"] === "next") {
        navigationHelpers.goToNext(currentIndex, totalItems, onNavigate);
        return;
      }
    }
if (!disabled && !isLoading && onClick) {
     
      onClick(e);
    }
  };

  const renderIcon = () => {
    if (isLoading) return <FaSpinner className="spin" />;
    if (isDownloading) return <FaDownload />;
    return icon;
  };

  const buttonContent = (
    <>
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
      {badge && (
        <span
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            backgroundColor: "#dc2626",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {badge}
        </span>
      )}
    </>
  );

  const buttonElement = (
    <button
      style={style}
      disabled={disabled || isLoading}
      onClick={handleClick}
      title={tooltip}
      {...props}
    >
      {buttonContent}
    </button>
  );

  return (
    <>
      {buttonElement}
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </>
  );
};

// Icon Only Button
const IconButton = ({ icon, size = "md", ...props }) => (
  <Button
    size={size}
    shape="circle"
    icon={icon}
    style={{ padding: "12px" }}
    {...props}
  />
);

// Text Button (Link style)
const TextButton = (props) => (
  <Button variant="link" styleType="filled" {...props} />
);

// Ghost Button (Minimal style)
const GhostButton = (props) => (
  <Button variant="ghost" styleType="filled" {...props} />
);

// Back Button - Goes back in browser history
const BackButton = ({
  currentIndex,
  totalItems,
  onNavigate,
  currentStep,
  onStepChange,
  totalSteps,
  ...props
}) => {
  return (
    <Button
      variant="primary"
      styleType="filled"
      icon={<FaArrowLeft />}
      currentIndex={currentIndex}
      totalItems={totalItems}
      onNavigate={onNavigate}
      currentStep={currentStep}
      onStepChange={onStepChange}
      targetStep={currentStep !== undefined ? currentStep - 1 : undefined}
      totalSteps={totalSteps}
      data-type="back"
      {...props}
    >
      {props.children || "Back"}
    </Button>
  );
};

// Previous Button - For previous item in list or previous step
const PreviousButton = ({
  currentIndex,
  totalItems,
  onNavigate,
  currentStep,
  onStepChange,
  totalSteps,
  ...props
}) => {
  return (
    <Button
      variant="primary"
      styleType="filled"
      icon={<FaChevronLeft />}
      currentIndex={currentIndex}
      totalItems={totalItems}
      onNavigate={onNavigate}
      currentStep={currentStep}
      onStepChange={onStepChange}
      targetStep={currentStep !== undefined ? currentStep - 1 : undefined}
      totalSteps={totalSteps}
      data-type="previous"
      {...props}
    >
      {props.children || "Previous"}
    </Button>
  );
};

// Next Button - For next item in list or next step
const NextButton = ({
  currentIndex,
  totalItems,
  onNavigate,
  currentStep,
  onStepChange,
  totalSteps,
  ...props
}) => {
 

  return (
    <Button
      variant="primary"
      icon={<FaChevronRight />}
      iconPosition="right"
      currentIndex={currentIndex}
      totalItems={totalItems}
      onNavigate={onNavigate}
      currentStep={currentStep}
      onStepChange={onStepChange}
      targetStep={currentStep !== undefined ? currentStep + 1 : undefined}
      totalSteps={totalSteps}
      data-type="next"
      {...props}
    >
      {props.children || "Next"}
    </Button>
  );
};

// Forward Button - Goes forward in browser history
const ForwardButton = (props) => (
  <Button
    variant="secondary"
    styleType="outlined"
    icon={<FaArrowRight />}
    goForward
    {...props}
  >
    {props.children || "Forward"}
  </Button>
);

// Home Button - Goes to home page
const HomeButton = (props) => (
  <Button
    variant="secondary"
    styleType="outlined"
    icon={<FaHome />}
    goHome
    {...props}
  >
    {props.children || "Home"}
  </Button>
);

// Step Navigation Button - For specific step navigation
const StepButton = ({
  step,
  currentStep,
  totalSteps,
  onStepChange,
  ...props
}) => (
  <Button
    variant={currentStep === step ? "primary" : "secondary"}
    styleType={currentStep === step ? "filled" : "outlined"}
    currentStep={currentStep}
    targetStep={step}
    totalSteps={totalSteps}
    onStepChange={onStepChange}
    {...props}
  >
    {props.children || `Step ${step + 1}`}
  </Button>
);

// First Button - Goes to first item
const FirstButton = (props) => (
  <Button
    variant="secondary"
    styleType="outlined"
    icon={<FaStepBackward />}
    {...props}
  >
    {props.children || "First"}
  </Button>
);

// Last Button - Goes to last item
const LastButton = (props) => (
  <Button
    variant="secondary"
    styleType="outlined"
    icon={<FaStepForward />}
    iconPosition="right"
    {...props}
  >
    {props.children || "Last"}
  </Button>
);

// Add Button
export const AddButton = ({
  onClick,
  children,
  color = "#10B981", // ✅ Default Emerald green
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  return (
    <MuiButton
      variant="contained"
      onClick={onClick}
      startIcon={<FaPlus />}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        textTransform: "none",
        backgroundColor: color, // ✅ dynamic color
        "&:hover": {
          backgroundColor: color.replace(")", ", 0.85)").replace("rgb", "rgba"), // subtle hover shade
        },
        borderRadius: "8px",
        fontWeight: 600,
        px: 2.5,
        py: 1,
      }}
      {...props}
    >
      {children || "Add"}
    </MuiButton>
  );
};
// Edit Button
const EditButton = (props) => (
  <Button variant="warning" styleType="outlined" icon={<FaEdit />} {...props}>
    {props.children || "Edit"}
  </Button>
);

// Delete Button
const DeleteButton = (props) => (
  <Button variant="danger" styleType="outlined" icon={<FaTrash />} {...props}>
    {props.children || "Delete"}
  </Button>
);

// View Button
const ViewButton = (props) => (
  <Button variant="info" styleType="outlined" icon={<FaEye />} {...props}>
    {props.children || "View"}
  </Button>
);

// Save Button
const SaveButton = (props) => (
  <Button variant="success" icon={<FaSave />} {...props}>
    {props.children || "Save"}
  </Button>
);

// Cancel Button
const CancelButton = (props) => (
  <Button
    variant="secondary"
    styleType="outlined"
    icon={<FaTimes />}
    {...props}
  >
    {props.children || "Cancel"}
  </Button>
);

// Submit Button
const SubmitButton = (props) => (
  <Button type="submit" variant="primary" {...props}>
    {props.children || "Submit"}
  </Button>
);

// Download Button
const DownloadButton = (props) => (
  <Button variant="info" styleType="outlined" icon={<FaDownload />} {...props}>
    {props.children || "Download"}
  </Button>
);

// Upload Button
const UploadButton = (props) => (
  <Button variant="info" icon={<FaUpload />} {...props}>
    {props.children || "Upload"}
  </Button>
);

// Search Button
const SearchButton = (props) => (
  <Button variant="primary" styleType="outlined" icon={<FaSearch />} {...props}>
    {props.children || "Search"}
  </Button>
);

// Filter Button
const FilterButton = (props) => (
  <Button
    variant="secondary"
    styleType="outlined"
    icon={<FaFilter />}
    {...props}
  >
    {props.children || "Filter"}
  </Button>
);

// Refresh Button
const RefreshButton = (props) => (
  <Button variant="secondary" styleType="outlined" icon={<FaSync />} {...props}>
    {props.children || "Refresh"}
  </Button>
);

// Export Button
const ExportButton = (props) => (
  <Button
    variant="success"
    styleType="outlined"
    icon={<FaFileExport />}
    {...props}
  >
    {props.children || "Export"}
  </Button>
);

// Print Button
const PrintButton = (props) => (
  <Button
    variant="secondary"
    styleType="outlined"
    icon={<FaPrint />}
    {...props}
  >
    {props.children || "Print"}
  </Button>
);

// Share Button
const ShareButton = (props) => (
  <Button variant="info" styleType="outlined" icon={<FaShare />} {...props}>
    {props.children || "Share"}
  </Button>
);

// Copy Button
const CopyButton = (props) => (
  <Button variant="secondary" styleType="outlined" icon={<FaCopy />} {...props}>
    {props.children || "Copy"}
  </Button>
);

// Like Button
const LikeButton = (props) => (
  <Button variant="danger" styleType="outlined" icon={<FaHeart />} {...props}>
    {props.children || "Like"}
  </Button>
);

// Favorite Button
const FavoriteButton = (props) => (
  <Button variant="warning" styleType="outlined" icon={<FaStar />} {...props}>
    {props.children || "Favorite"}
  </Button>
);

// Notify Button
const NotifyButton = (props) => (
  <Button variant="info" styleType="outlined" icon={<FaBell />} {...props}>
    {props.children || "Notify"}
  </Button>
);

// Lock Button
const LockButton = (props) => (
  <Button variant="secondary" styleType="outlined" icon={<FaLock />} {...props}>
    {props.children || "Lock"}
  </Button>
);

// Unlock Button
const UnlockButton = (props) => (
  <Button variant="success" styleType="outlined" icon={<FaUnlock />} {...props}>
    {props.children || "Unlock"}
  </Button>
);

// Premium Button
const PremiumButton = (props) => (
  <Button variant="premium" icon={<FaStar />} {...props}>
    {props.children || "Premium"}
  </Button>
);

/**
 * Button Group Component with navigation support
 */
const ButtonGroup = ({ children, direction = "horizontal", ...props }) => (
  <div
    style={{
      display: "flex",
      flexDirection: direction === "vertical" ? "column" : "row",
      gap: "8px",
      alignItems: direction === "vertical" ? "stretch" : "center",
      ...props.style,
    }}
    {...props}
  >
    {children}
  </div>
);

/**
 * Navigation Container Component
 */
const NavigationContainer = ({ children, style, ...props }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

// Export everything explicitly
export {
  IconButton,
  TextButton,
  GhostButton,
  BackButton,
  PreviousButton,
  NextButton,
  ForwardButton,
  HomeButton,
  StepButton,
  FirstButton,
  LastButton,
  EditButton,
  DeleteButton,
  ViewButton,
  SaveButton,
  CancelButton,
  SubmitButton,
  DownloadButton,
  UploadButton,
  SearchButton,
  FilterButton,
  RefreshButton,
  ExportButton,
  PrintButton,
  ShareButton,
  CopyButton,
  LikeButton,
  FavoriteButton,
  NotifyButton,
  LockButton,
  UnlockButton,
  PremiumButton,
  ButtonGroup,
  NavigationContainer,
  navigationHelpers,
};

// Default export
export default Button;
