/**
 * @fileoverview Employee E-File Popup Component
 * @module EmployeeEfilePopup
 * @description A reusable React component that displays employee e-file information in a modal dialog with loading states, multiple layout variants, and action buttons.
 *
 * @author Susmitha
 * @version 1.0.0
 * @created 10-11-2024
 * @lastModified 17-11-2024
 *
 * @dependencies
 * - React: Core React library
 * - Material-UI: UI component library
 * - EmployeeEfile: Main e-file content component
 * - FancyCircularLoader: Custom loading component
 *
 * @features
 * - Responsive design (fullscreen on mobile)
 * - Multiple layout variants (default, compact, detailed)
 * - Smooth loading animations
 * - Action buttons (export, print)
 * - Employee header information
 * - Permission-based data display
 *
 * @props
 * @param {boolean} open - Controls popup visibility
 * @param {function} onClose - Callback when popup closes
 * @param {string|number} employeeId - Unique employee identifier
 * @param {string} [employeeName=""] - Employee's full name
 * @param {string} [department=""] - Department name
 * @param {string} [designation=""] - Employee job title
 * @param {"default"|"compact"|"detailed"} [variant="default"] - Layout variant
 * @param {boolean} [showHeaderInfo=true] - Show employee header section
 * @param {boolean} [enableActions=true] - Show footer action buttons
 * @param {string} [maxWidth="xl"] - MUI dialog maxWidth
 * @param {string} [userRole=""] - User role for permissions
 * @param {string} [sessionId=""] - Session ID for tracking
 * @param {string} [type=""] - Controls popup opening condition
 *
 * @example
 * <EmployeeEfilePopup
 *   open={true}
 *   onClose={handleClose}
 *   employeeId="12345"
 *   employeeName="John Doe"
 *   department="Engineering"
 *   designation="Senior Developer"
 *   variant="detailed"
 *   type="elife"
 * />
 */

import React, { useState, useEffect } from "react";
import {
  Dialog, // Modal dialog container
  DialogContent, // Dialog content area
  IconButton, // Clickable icon button
  Box, // Layout container
  useTheme, // Material-UI theme hook
  useMediaQuery, // Responsive breakpoint hook
  Typography, // Text component
  AppBar, // Top app bar
  Toolbar, // App bar toolbar
  Chip, // Small label component
  Fade, // Fade animation
  Slide, // Slide animation
  Avatar, // User avatar
  Button, // Button component
} from "@mui/material"; // Material-UI components
import { Close, Download, Print, Person } from "@mui/icons-material";
import EmployeeEfile from "src/views/Menus/EmployeeFile/efile";
import FancyCircularLoader from "src/components/ui/Loader"; // ✅ IMPORT THE LOADER

/**
 * EmployeeEfilePopup Component
 *
 * @component
 * @param {boolean} open - Determines if the popup dialog is visible.
 * @param {function} onClose - Callback function triggered when the popup closes.
 * @param {string|number} employeeId - Unique identifier for the employee.
 * @param {string} [employeeName=""] - Employee's full name.
 * @param {string} [department=""] - Department name.
 * @param {string} [designation=""] - Employee designation or role.
 * @param {"default"|"compact"|"detailed"} [variant="default"] - Layout variant for the popup.
 * @param {boolean} [showHeaderInfo=true] - Whether to show the employee header section.
 * @param {boolean} [enableActions=true] - Whether to display footer action buttons.
 * @param {string} [maxWidth="xl"] - MUI dialog maxWidth property.
 * @param {string} [userRole=""] - User role for permission-based data.
 * @param {string} [sessionId=""] - Session ID for tracking the user session.
 * @param {string} [type=""] - Type parameter that controls if popup should open
 *
 * @returns {JSX.Element} The Employee E-File popup dialog.
 */
const EmployeeEfilePopup = ({
  open, // Controls if popup is open
  onClose, // Function to call when popup closes
  employeeId, // Unique identifier for the employee
  employeeName = "", // Employee's full name (optional)
  department = "", // Department name (optional)
  designation = "", // Job title (optional)
  variant = "default", // Layout variant: default, compact, or detailed
  showHeaderInfo = true, // Whether to show header information
  enableActions = true, // Whether to show action buttons
  maxWidth = "xl", // Maximum width of the dialog
  userRole = "", // User role for permission-based content
  sessionId = "", // Session ID for tracking
  type = "", // Type parameter that controls popup opening
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md")); // Check if screen is mobile size
  const [isLoaded, setIsLoaded] = useState(false); // Track if content is loaded
  const [loadingProgress, setLoadingProgress] = useState(0); // Track loading progress percentage
  const shouldOpen = open && Boolean(type);

 /**
   * Effect hook to handle loading animation and progress simulation
   * Runs when shouldOpen value changes
   */
  useEffect(() => {
    if (shouldOpen) {
      setIsLoaded(false); // Reset loaded state
      setLoadingProgress(0); // Reset progress
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10; // Increment progress by 10
        });
      }, 150);
      const timer = setTimeout(() => {
        setIsLoaded(true);
        setLoadingProgress(100);
        clearInterval(progressInterval);
      }, 1500);
      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [shouldOpen]);

  /**
   * Returns dialog styles based on variant and screen size
   * @returns {Object} Style object for dialog
   */
  const getDialogStyles = () => {
    const baseStyles = {
      height: fullScreen ? "100%" : "90vh",
      maxHeight: "90vh",
      overflow: "hidden",
      borderRadius: fullScreen ? 0 : "16px",
      background: "#fff",
      boxShadow: theme.shadows[10],
    };

    const variants = {
      default: baseStyles,
      compact: { ...baseStyles, height: "80vh", maxHeight: "80vh" },
      detailed: { ...baseStyles, height: "95vh", maxHeight: "95vh" },
    };

    return variants[variant] || variants.default;
  };


  /**
   * Returns header background color
   * @returns {string} CSS color value
   */
  const getHeaderGradient = () => "#4b43a8ff";

  /** Placeholder handler for footer action buttons (print/export). */
  const handleAction = (action) => {
    if (action === "download") {
      console.log("Download E-File triggered");
    } else if (action === "print") {
      window.print();
    }
  };
  if (!type) {
    return null;
  }

  return (
    <Dialog
      open={shouldOpen} // ✅ USE SHOULD_OPEN INSTEAD OF OPEN
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      fullWidth
      TransitionComponent={Slide}
      transitionDuration={400}
      sx={{
        "& .MuiDialog-paper": {
          ...getDialogStyles(),
          transform: "scale(0.95)",
          transition: "all 0.3s ease",
          ...(shouldOpen && { transform: "scale(1)" }),
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      {/* ---------------- HEADER ---------------- */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          height: "100px",
          background: getHeaderGradient(),
          borderTopLeftRadius: fullScreen ? 0 : "16px",
          borderTopRightRadius: fullScreen ? 0 : "16px",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "90px !important",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* LEFT SECTION: Employee Info */}
          <Fade in={isLoaded} timeout={500}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Person sx={{ color: "white" }} />
              </Avatar>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  Employee E-File
                </Typography>

                {/* Employee ID and Name (optional) */}
                {showHeaderInfo && employeeId && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label={`EmployeeID: ${employeeId}`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                    {employeeName && (
                      <Typography variant="caption" sx={{ color: "white" }}>
                        {employeeName}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Fade>

          {/* RIGHT SECTION: Close Button */}
          <Fade in={isLoaded} timeout={700}>
            <IconButton
              onClick={onClose}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Fade>
        </Toolbar>

        {/* SUBHEADER: Department / Designation */}
        {showHeaderInfo && (department || designation) && (
          <Fade in={isLoaded} timeout={900}>
            <Box sx={{ px: { xs: 2, sm: 3 }, pb: 2, display: "flex", gap: 1 }}>
              {department && (
                <Chip
                  label={department}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                />
              )}
              {designation && (
                <Chip
                  label={designation}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                />
              )}
            </Box>
          </Fade>
        )}
      </AppBar>

      {/* ---------------- CONTENT ---------------- */}
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        <Box sx={{ height: "100%", overflow: "auto", background: "#fff" }}>
          {!isLoaded ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FancyCircularLoader progress={loadingProgress} />
            </Box>
          ) : (
            <Fade in={isLoaded} timeout={600}>
              <Box>
                <EmployeeEfile
                  type={type}
                  initialEmployeeId={employeeId}
                  compactMode={variant === "compact"}
                  employeeId={employeeId}
                  userRole={userRole}
                  sessionId={sessionId}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </DialogContent>

      {/* ---------------- FOOTER ---------------- */}
      {enableActions && variant === "detailed" && (
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<Download />}
              size="small"
              variant="outlined"
              onClick={() => handleAction("download")}
            >
              Export
            </Button>
            <Button
              startIcon={<Print />}
              size="small"
              variant="contained"
              onClick={() => handleAction("print")}
            >
              Print
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default EmployeeEfilePopup