/**
 * @fileoverview Data configuration for Employee E-File sections.
 * Contains section definitions, sample data, and configuration objects.
 * @module src/components/employeeEfile/employeeEfileData
 * @author Rovita
 * @date 04/11/2025
 * @since 1.0.0
 */

import { keyframes, styled } from "@mui/system";
import {
  Box,
  Paper,
  Card,
  Button,
  TableContainer,
  Chip,
  Avatar,
  Container,
  Grid,
  IconButton,
} from "@mui/material";

// =============================================================================
// ANIMATION KEYFRAMES
// =============================================================================

/**
 * Floating animation for subtle hover effects
 * @description Creates a gentle floating motion with vertical translation and scale
 */
export const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-8px) scale(1.05); }
`;

/**
 * Slide up with fade animation for smooth element entrance
 * @description Elements slide up from bottom while fading in
 */
export const slideUpFade = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

/**
 * Scale in animation for focused element appearances
 * @description Elements scale from slightly smaller to normal size with fade
 */
export const scaleIn = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`;

/**
 * Gradient flow animation for dynamic background effects
 * @description Creates moving gradient effect by shifting background position
 */
export const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/**
 * Wave animation for decorative horizontal movement
 * @description Creates horizontal sliding wave effect
 */
export const waveAnimation = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

/**
 * Ripple animation for click/touch feedback
 * @description Creates expanding circle that fades out, similar to material design
 */
export const rippleAnimation = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

// =============================================================================
// CARD COMPONENTS
// =============================================================================

/**
 * Interactive icon card with hover effects and gradient border
 * @param color - Base color for border and hover effects
 * @description Features animated top border, hover lift, and gradient backgrounds
 * Ideal for feature icons or action cards
 */
export const IconCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
  border: `2px solid ${color}20`,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  minHeight: 80,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: `linear-gradient(90deg, ${color} 0%, ${color}80 50%, ${color}00 100%)`,
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 8px 25px ${color}30`,
    border: `2px solid ${color}40`,
    "&::before": {
      transform: "scaleX(1)",
    },
  },
}));

/**
 * Modern card with left accent border and hover elevation
 * @param color - Accent border color and hover effects
 * @description Clean card with subtle gradients and smooth hover transitions
 * Suitable for content containers and information panels
 */
export const ModernCard = styled(Card)(({ theme, color }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  borderLeft: `4px solid ${color}`,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  "&:hover": {
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-2px)",
  },
}));

/**
 * Professional dependent card with vertical gradient accent
 * @param color - Color for left border gradient and hover effects
 * @description Features vertical gradient border, subtle shadows, and smooth hover
 * Designed for dependent lists and profile cards
 */
export const ProfessionalDependentCard = styled(Card)(({ theme, color }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  border: `1px solid ${color}20`,
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
    background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
  },
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 6px 20px ${color}15`,
    border: `1px solid ${color}30`,
  },
}));

/**
 * Minimal dependent card with subtle borders and hover
 * @param color - Border color with transparency variations
 * @description Clean, minimal design with subtle hover effects
 * Perfect for compact lists and secondary information
 */
export const MinimalDependentCard = styled(Card)(({ theme, color }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 10,
  background: "#ffffff",
  border: `1px solid ${color}15`,
  boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "0 3px 15px rgba(0, 0, 0, 0.08)",
    border: `1px solid ${color}25`,
  },
}));

/**
 * Grid-optimized dependent card with full height and flex layout
 * @param color - Border and hover effect color
 * @description Designed for grid layouts with consistent height and flex display
 * Ideal for card grids and dashboard layouts
 */
export const GridDependentCard = styled(Card)(({ theme, color }) => ({
  padding: theme.spacing(2),
  borderRadius: 14,
  background: "linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)",
  border: `1px solid ${color}15`,
  boxShadow: "0 3px 15px rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 22px ${color}12`,
    border: `1px solid ${color}25`,
  },
}));

/**
 * Professional appointment card with glass morphism effects
 * @param color - Top border gradient and hover effect color
 * @description Features backdrop filter, gradient border, and sophisticated hover
 * Designed for appointment cards and premium content displays
 */
export const ProfessionalAppointmentCard = styled(Card)(({ theme, color }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 20,
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
  backdropFilter: "blur(20px)",
  border: `1px solid ${color}20`,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
  },
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 40px ${color}20`,
  },
}));

// =============================================================================
// TABLE & DATA COMPONENTS
// =============================================================================

/**
 * Styled table container with colored header and custom borders
 * @param color - Header background and border color
 * @description Applies consistent styling to table headers and cells
 * Enhances table readability with colored headers
 */
export const ActionTableContainer = styled(TableContainer)(
  ({ theme, color }) => ({
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    "& .MuiTableHead-root": {
      backgroundColor: `${color}15`,
    },
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      color: color,
      borderBottom: `2px solid ${color}30`,
    },
    "& .MuiTableCell-body": {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  })
);

/**
 * Status chip with dynamic coloring based on status value
 * @param status - Status string that determines chip color
 * @description Maps status values to appropriate colors with consistent styling
 * Supports common status types: approved, pending, completed, active, etc.
 */
export const StatusChip = styled(Chip)(({ theme, status }) => {
  /**
   * Safely converts value to lowercase for consistent comparison
   * @param val - Input value to convert
   * @returns Lowercase string representation
   */
  const safeLower = (val) =>
    typeof val === "string"
      ? val.toLowerCase()
      : String(val ?? "").toLowerCase();

  /**
   * Determines color based on status value
   * @param status - Status value to evaluate
   * @returns HEX color code for the status
   */
  const getStatusColor = (status) => {
    switch (safeLower(status)) {
      case "approved":
      case "completed":
      case "active":
      case "processed":
      case "yes":
      case "permanent":
        return "#2e7d32"; // Green
      case "pending":
      case "under review":
        return "#ed6c02"; // Orange
      case "eligible":
        return "#1976d2"; // Blue
      default:
        return "#757575"; // Gray
    }
  };

  return {
    backgroundColor: `${getStatusColor(status)}20`,
    color: getStatusColor(status),
    fontWeight: "600",
    border: `1px solid ${getStatusColor(status)}40`,
  };
});

// =============================================================================
// LAYOUT & CONTAINER COMPONENTS
// =============================================================================

/**
 * Information item with hover interaction
 * @description Displays key-value pairs with subtle background and hover effect
 * Ideal for property lists and detail views
 */
export const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5),
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  background: "rgba(0, 0, 0, 0.02)",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(0, 0, 0, 0.04)",
    transform: "translateX(4px)",
  },
}));

/**
 * Full-height section container with consistent padding
 * @description Provides consistent spacing for page sections
 * Ensures proper vertical rhythm and responsive padding
 */
export const SectionContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

/**
 * Section icon grid with glass morphism effects
 * @description Container for section navigation icons with blurred background
 * Creates modern glass-like appearance for icon groupings
 */
export const SectionIconGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: "rgba(255, 255, 255, 0.8)",
  borderRadius: 16,
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(0, 0, 0, 0.1)",
}));

/**
 * Wavy container with animated top border
 * @param color - Wave animation color and container styling
 * @description Features animated wave effect at the top with gradient background
 * Perfect for section headers and highlighted containers
 */
export const WavyIconContainer = styled(Box)(({ theme, color }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  background: `linear-gradient(135deg, ${color}08 0%, ${color}15 100%)`,
  border: `1px solid ${color}20`,
  marginBottom: theme.spacing(2),
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
    animation: `${waveAnimation} 3s ease-in-out infinite`,
  },
}));

/**
 * Floating icons container with flexible layout
 * @description Centered container for floating action icons or badges
 * Supports wrapping and consistent spacing
 */
export const FloatingIconsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  minHeight: 60,
}));

/**
 * Section navigation wrapper with glass morphism
 * @description Premium container for section navigation with backdrop blur
 * Creates modern, elevated navigation area
 */
export const SectionNavigationWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: 16,
  border: "1px solid rgba(0, 0, 0, 0.1)",
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
}));

// =============================================================================
// BUTTON & INTERACTIVE COMPONENTS
// =============================================================================

/**
 * Back button with gradient background and hover effects
 * @description Styled back navigation button with consistent gradient styling
 * Provides clear visual feedback on hover
 */
export const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  padding: "10px 20px",
  background: "linear-gradient(45deg, #666 0%, #999 100%)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #555 0%, #888 100%)",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
}));

/**
 * Animated section icon with active states and ripple effects
 * @param color - Base color for background and borders
 * @param isactive - Boolean string ('true'/'false') for active state styling
 * @description Interactive icon with gradient backgrounds and hover animations
 * Supports active state with different styling
 */
export const AnimatedSectionIcon = styled(IconButton)(
  ({ theme, color, isactive }) => ({
    position: "relative",
    width: 48,
    height: 48,
    background:
      isactive === "true"
        ? `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`
        : `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
    border: isactive === "true" ? `2px solid ${color}` : `1px solid ${color}30`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 0,
      height: 0,
      borderRadius: "50%",
      background: `${color}20`,
      transform: "translate(-50%, -50%)",
      transition: "all 0.3s ease",
    },
    "&:hover": {
      transform: "translateY(-2px) scale(1.05)",
      boxShadow: `0 8px 25px ${color}40`,
      "&::before": {
        width: "100%",
        height: "100%",
      },
    },
    "& .MuiAvatar-root": {
      transition: "all 0.3s ease",
      filter: isactive === "true" ? "brightness(1.2)" : "brightness(1)",
    },
  })
);

/**
 * Ripple effect component for click animations
 * @param color - Ripple effect color
 * @description Creates material-design inspired ripple animation
 * Used for click feedback on interactive elements
 */
export const RippleEffect = styled(Box)(({ theme, color }) => ({
  position: "absolute",
  borderRadius: "50%",
  backgroundColor: `${color}30`,
  transform: "scale(0)",
  animation: `${rippleAnimation} 1s ease-out`,
  pointerEvents: "none",
}));
