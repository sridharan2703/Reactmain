/**
 * @fileoverview Header Component (Topbar).
 * @module Header
 * @description Renders the fixed top navigation bar of the application. 
 * It includes mobile sidebar toggle, a prominent title, and quick action icons (e.g., Notifications).
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - Material-UI components: For styling and layout.
 * - PropTypes: For prop validation.
 * - Tabler Icons: Icon components.
 */
import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack, 
  IconButton,
  Badge, 
  Button, 
  Menu, 
  MenuItem, 
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

import { IconBellRinging, IconMenu } from "@tabler/icons-react";

/**
 * @typedef {Object} HeaderProps
 * @property {object} [sx] - Custom styling for the AppBar (Material-UI prop).
 * @property {Function} toggleMobileSidebar - Handler to toggle the mobile sidebar visibility.
 */

/**
 * Header Functional Component.
 * 
 * @param {HeaderProps} props - The component's props.
 * @returns {JSX.Element} The styled AppBar component.
 */
const Header = (props) => {
  /**
   * @constant {StyledComponent} AppBarStyled
   * @description Styled Material-UI AppBar component with custom background, shadow, and mobile height.
   */
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "0 4px 20px rgba(231, 125, 103, 0.1)",
    background: "linear-gradient(135deg, #f1e1d2 0%, #f8f0e8 100%)",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(231, 125, 103, 0.1)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "50px",
    },
  }));

  /**
   * @constant {StyledComponent} ToolbarStyled
   * @description Styled Material-UI Toolbar component to ensure consistent height and width.
   */
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
    minHeight: "50px !important",
  }));
  
  /**
   * @constant {StyledComponent} TitleTypography
   * @description Styled Typography component for the application/section title.
   * Features custom font, color, and hover effects for prominence.
   */
  const TitleTypography = styled(Typography)(({ theme }) => ({
    color: "#d4644a !important", // Solid color for maximum visibility
    fontSize: "28px",
    fontWeight: "700 !important",
    letterSpacing: "2px",
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    marginLeft: theme.spacing(2),
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)", // Stronger shadow for contrast
    position: "relative",
    zIndex: 10,
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#e77d67 !important",
      transform: "scale(1.02)",
      textShadow: "0 2px 8px rgba(231, 125, 103, 0.4)",
    },
  }));
  
  /**
   * @constant {StyledComponent} StyledIconButton
   * @description A custom styled IconButton with a branded look and distinct hover effect.
   */
  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: "#e77d67", // Changed from inherit to brand color
    backgroundColor: "rgba(231, 125, 103, 0.1)",
    border: "1px solid rgba(231, 125, 103, 0.2)",
    borderRadius: "12px",
    width: "44px",
    height: "44px",
    margin: theme.spacing(1),
    transition: "all 0.3s ease",
    
    "&:hover": {
      backgroundColor: "rgba(231, 125, 103, 0.2)",
      transform: "scale(1.05)",
      boxShadow: "0 4px 12px rgba(231, 125, 103, 0.2)",
    },
    
    "& svg": {
      color: "#e77d67",
    },
  }));

  // State for menu anchoring (although the menu is not rendered, state is defined)
  // eslint-disable-next-line
  const [anchorEl, setAnchorEl] = useState(null);
  // State for calculating custom menu position (although the menu is not rendered, state is defined)
  // eslint-disable-next-line
  const [menuPosition, setMenuPosition] = useState(null);

  // eslint-disable-next-line
  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setAnchorEl(event.currentTarget);
  };

  // eslint-disable-next-line
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* Mobile Sidebar Toggle Button (Hidden on large screens) */}
        <StyledIconButton
          aria-label="menu"
          onClick={props.toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline-flex",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </StyledIconButton>

        {/* Fixed Title */}
        <TitleTypography variant="h4">
          Human Resources
        </TitleTypography>

        {/* Spacer to push content to the right */}
        <Box flexGrow={1} />
        
        {/* Right-side action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications Icon (Placeholder for dropdown logic) */}
          <IconButton
            sx={{
              color: "#e77d67",
              backgroundColor: "rgba(231, 125, 103, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(231, 125, 103, 0.2)",
              },
            }}
          >
            <IconBellRinging size={20} />
          </IconButton>
        </Box>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;