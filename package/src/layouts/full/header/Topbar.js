/**
 * @fileoverview Ultra Professional Topbar Component
 * @module Topbar;
 * @description A sophisticated navigation bar for the Human Resources Management Portal.
 * Features include logo display, action buttons for notifications and navigation,
 * role display, and direct navigation to Employee E-File upon settings icon selection.
 * 
 * @author Rakshana
 * @version 1.1.0
 * @created 13-11-2024
 * @lastModified 17-11-2024
 * 
 * 
 * @features
 * - Responsive design with media queries
 * - Animated gradient background
 * - Cookie-based role retrieval
 * - Direct navigation to Employee E-File
 * 
 * @props
 * @param {function} onOpenSidebar - Callback to open the sidebar on mobile
 * 
 * @state
 * @state {string} selectedRole - Currently selected user role from cookies
 * 
 * @example
 * <Topbar onOpenSidebar={handleOpenSidebar} />
 */
import {
  AppBar,
  styled,
  Toolbar,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  keyframes,
  Badge,
  Chip,
  Tooltip,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Profile from "./Profile";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Navigation hook for routing
import IITMLogo from "src/assets/Logo/iitm_logo.png";

const gradientFlow = keyframes`
  0%, 100% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
`;

const elegantHover = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-2px) scale(1.02); }
  100% { transform: translateY(0px) scale(1); }
`;

const TopbarContainer = styled(Box)({
  display: "flex",
  justifyContent: "flex-start", // Align to left instead of center
  width: "100%",
  padding: "6px 0",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
  color: "#e3d2a1",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
});

const UltraProfessionalAppBar = styled(AppBar)(({ theme }) => ({
  background:
    `linear-gradient(135deg, 
          #2c5282 0%, 
          #385e7c 25%,
          #4a90c2 50%,
          #385e7c 75%,
          #2c5282 100%)`,
  backgroundSize: "400% 400%",
  animation: `${gradientFlow} 20s ease infinite`,
  boxShadow:
    "0 8px 32px rgba(44,82,130,0.15), 0 4px 16px rgba(56,94,124,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
  position: "relative",
  zIndex: 10,
  borderRadius: "12px",
  width: "92%",
  maxWidth: "1900px",
  minWidth: "320px",
  margin: "0 auto",
  border: `1px solid rgba(74,144,194,0.3)`,
  backdropFilter: "blur(20px)",
  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      "0 12px 40px rgba(44,82,130,0.2), 0 8px 20px rgba(56,94,124,0.15)",
  },
}));

const LogoContainer = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",
  "&:hover .logo": {
    animation: `${elegantHover} 0.6s ease`,
  },
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: "rgba(255,255,255,0.15)",
  border: `1px solid rgba(255,255,255,0.3)`,
  borderRadius: "8px",
  padding: "6px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.25)",
    transform: "translateY(-2px) scale(1.05)",
    boxShadow: `0 4px 12px rgba(74,144,194,0.3)`,
  },
}));

/**
 * Utility function to get cookie value by name
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string} The cookie value or empty string if not found
 */
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
};

/**
 * Topbar Component
 * Renders the top navigation bar with logo, actions, and direct E-File navigation
 * @param {Object} props - Component props
 * @param {function} props.onOpenSidebar - Function to toggle sidebar visibility
 * @returns {JSX.Element} Topbar JSX
 */
const Topbar = ({ onOpenSidebar }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [selectedRole, setSelectedRole] = useState("");
  const topbarRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigation hook

  /**
   * Handler to navigate to Employee E-File with user state
   * Retrieves necessary cookies and passes as navigation state
   */
  const handleEFileNavigation = () => {
    const empid = getCookie("Empid") || "Not Available";
    const userRole = getCookie("selectedRole") || "Not Available";
    const session_id = getCookie("session_id") || "Not Available";

    navigate("/EmployeeEFile", {
      state: {
        type: "userefile",
        employeeId: empid,
        userRole: userRole,
        sessionId: session_id,
      },
    });
  };

  /**
   * Effect hook to load selected role from cookies on component mount
   * Runs once when component is initialized
   */
  useEffect(() => {
    const role = getCookie("selectedRole");
    if (role) {
      setSelectedRole(role);
    }
  }, []);

  return (
    <TopbarContainer>
      <UltraProfessionalAppBar
        ref={topbarRef}
        position="static"
        elevation={0}
        className="UltraProfessionalAppBar"
      >
        {/* Professional Toolbar - further reduced height */}
        <Toolbar
          sx={{
            px: 2.5,
            py: 0.5,
            minHeight: "42px !important",
            zIndex: 10,
            position: "relative",
            gap: 1,
          }}
        >
          {!lgUp && (
            <ActionButton onClick={onOpenSidebar}>
              <MenuIcon />
            </ActionButton>
          )}

          {/* Enhanced Logo + Brand - even smaller logo */}
          <LogoContainer>
            <Avatar
              src={IITMLogo}
              alt="IIT Madras Logo"
              className="logo"
              sx={{
                width: 34,
                height: 34,
                border: `2px solid #F4991A`,
                boxShadow: `0 4px 16px rgba(244,153,26,0.4)`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            {mdUp && (
              <Box sx={{ ml: 1.5 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "24px",
                    fontWeight: "700 !important",
                    background: "white",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    letterSpacing: 1.5,
                    textShadow: "none",
                    lineHeight: 1.2,
                  }}
                >
                  Human Resources
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: "500",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    mt: 0.1,
                  }}
                >
                  Management Portal
                </Typography>
              </Box>
            )}
          </LogoContainer>

          <Box sx={{ flexGrow: 1 }} />

          {/* Professional Action Buttons - smaller gap */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Tooltip title="Notifications" arrow>
              <ActionButton>
                <Badge badgeContent={7} color="error">
                  <NotificationsIcon sx={{ fontSize: 18 }} />
                </Badge>
              </ActionButton>
            </Tooltip>

            <Tooltip title="Employee E-File" arrow>
              <ActionButton onClick={handleEFileNavigation}>
                <AccountCircleIcon sx={{ fontSize: 18 }} />
              </ActionButton>
            </Tooltip>

            <Box
              sx={{ ml: 1, display: "flex", alignItems: "center", gap: 0.5 }}
            >
              {selectedRole && (
                <Chip
                  size="small"
                  label={selectedRole}
                  sx={{
                    bgcolor: "rgba(244,153,26,0.3)",
                    color: "#F4991A",
                    fontSize: "12px",
                    height: "30px",
                    fontWeight: 600,
                  }}
                />
              )}
              <Profile />
            </Box>
          </Box>
        </Toolbar>
      </UltraProfessionalAppBar>
    </TopbarContainer>
  );
};

export default Topbar;