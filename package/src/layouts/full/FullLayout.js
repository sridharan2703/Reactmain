import React, { useState, createContext } from "react";
import { styled, Box } from "@mui/material";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router";
import Topbar from "./header/Topbar";

/**
 * @fileoverview FullLayout Component: The main application layout.
 * @module FullLayout
 * @description Provides the standard application shell including a fixed top navigation (Topbar) 
 * and a collapsible side navigation (Sidebar). It manages the state of the sidebar and wraps 
 * the main content area for child routes.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - React, useState, createContext: Core React features.
 * - styled, Box: Material-UI styling and layout components.
 * - Sidebar: The side navigation component.
 * - Outlet: React Router v6 component to render child routes.
 * - Topbar: The top navigation/header component.
 */

/**
 * @constant {React.Context} SidebarContext
 * @description Context used to pass the current state of `isSidebarOpen` to child components
 * (e.g., the Header or content area) without prop drilling.
 */
export const SidebarContext = createContext();

/**
 * @constant {StyledComponent} MainWrapper
 * @description The main container for the layout (Sidebar + Page Content).
 * Applies a global padding at the top to clear the fixed Topbar.
 */
const MainWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
  minHeight: "80vh !important",
  paddingTop: "100px", // Space for fixed topbar (Assuming Topbar height is about 100px)
  overflow: "auto",
  [theme.breakpoints.down("lg")]: {
    paddingLeft: 0, // No left padding on mobile/tablet (sidebar is overlaid)
  },
}));

/**
 * @constant {StyledComponent} PageWrapper
 * @description The container for the main content area (`<Outlet />`).
 * Manages its `margin-left` dynamically to create space next to the Sidebar.
 */
const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
  minHeight: "calc(100vh - 60px)", // Minimum height calculation (assuming Topbar is 60px)
  transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth transition for sidebar open/close
  overflow: "auto", // Ensure content scrolls if needed
}));

/**
 * FullLayout Functional Component.
 * Implements the core structure of the application's full view.
 *
 * @returns {JSX.Element} The FullLayout component.
 */
const FullLayout = () => {
  // State for desktop sidebar visibility (toggled via a button)
  // eslint-disable-next-line
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  // State for mobile sidebar visibility (opened via Topbar button)
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sidebar widths: Adjust these if your Sidebar component uses different values
  const sidebarCollapsedWidth = 80; // px, when closed/collapsed
  const sidebarExpandedWidth = 60; // px, when open/expanded - NOTE: 60px seems small for expanded state, check implementation.

  return (
    <>
      {/* ------------------------------------------- */}
      {/* Fixed Topbar */}
      {/* ------------------------------------------- */}
      <Topbar onOpenSidebar={() => setMobileSidebarOpen(true)} />

      <MainWrapper>
        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />

        {/* ------------------------------------------- */}
        {/* Page Content - DYNAMIC OFFSET */}
        {/* ------------------------------------------- */}
        <PageWrapper
          // Dynamically sets the left margin based on the sidebar's current state (open/collapsed)
          style={{
            marginLeft: isSidebarOpen ? `${sidebarExpandedWidth}px` : `${sidebarCollapsedWidth}px`,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              minHeight: "80%",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Provides the sidebar state to nested components */}
            <SidebarContext.Provider value={{ isSidebarOpen }}>
              {/* Renders the content of the matched child route */}
              <Outlet />
            </SidebarContext.Provider>
          </Box>
        </PageWrapper>
      </MainWrapper>
    </>
  );
};

export default FullLayout;