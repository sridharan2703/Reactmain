/**
 * @fileoverview Sidebar Component.
 * @module Sidebar
 * @description Renders the application's main navigation sidebar. It supports two modes:
 * 1. Desktop: Permanent, hover-to-expand/collapse (mini-sidebar).
 * 2. Mobile/Tablet: Temporary Drawer that opens over the content.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - useMediaQuery, Box, Drawer: Material-UI components for responsive design and layout.
 * - useState: React hook for local state management (hover state).
 * - SidebarItems: The component containing the actual menu list items.
 * - Scrollbar: Custom component to handle scrolling within the sidebar.
 */

import { useMediaQuery, Box, Drawer } from "@mui/material";
import { useState } from "react";
import SidebarItems from "./SidebarItems";
import Scrollbar from "../../../components/custom-scroll/Scrollbar";

/**
 * @typedef {Object} SidebarProps
 * @property {boolean} isSidebarOpen - State for the desktop sidebar (intended for persistent control).
 * @property {boolean} isMobileSidebarOpen - State controlling the visibility of the temporary mobile Drawer.
 * @property {Function} onSidebarClose - Handler function to close the mobile Drawer.
 */

/**
 * Sidebar Functional Component.
 * 
 * @param {SidebarProps} props - The component's props.
 * @returns {JSX.Element} The Sidebar or Drawer component.
 */
const Sidebar = ({ isSidebarOpen, isMobileSidebarOpen, onSidebarClose }) => {
  // Hook to determine if the screen size is large (desktop) or up
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  
  // State to track if the mouse is hovering over the sidebar (for desktop mode)
  const [isHovered, setIsHovered] = useState(false);

  // Define sidebar widths
  const collapsedWidth = "64px";
  const expandedWidth = "270px";
  
  // Determine the current sidebar width based on hover state
  const sidebarWidth = isHovered ? expandedWidth : collapsedWidth;

  // --- Desktop/Large Screen Mode (Permanent Sidebar) ---
  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0, // Prevents Box from shrinking below its width
          bgcolor: "background.paper",
          transition: "width 0.3s ease", // Smooth width transition on hover
          // borderRight: (theme) => `1px solid ${theme.palette.divider}`, // Commented out border
        }}
        // Handlers for hover state
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Scrollbar>
          {/* Renders menu items, passing the collapsed state */}
          <SidebarItems isCollapsed={!isHovered} />
        </Scrollbar>
      </Box>
    );
  }

  // --- Mobile/Tablet Mode (Temporary Drawer) ---
  return (
    <Drawer
      variant="temporary"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      // Ensure the drawer content stays mounted for better performance
      ModalProps={{ keepMounted: true }} 
      sx={{
        "& .MuiDrawer-paper": {
          width: expandedWidth, // Always expanded width on mobile
          boxSizing: "border-box",
        },
      }}
    >
      <Scrollbar>
        {/* Renders menu items, always expanded (not collapsed) for the mobile drawer */}
        <SidebarItems isCollapsed={false} />
      </Scrollbar>
    </Drawer>
  );
};

export default Sidebar;