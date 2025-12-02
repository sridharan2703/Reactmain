/**
 * @fileoverview User Settings Component
 * @module Settings
 * @description A React component that displays user profile information, settings, and provides navigation to user-specific features like Employee E-File.
 * 
 * @author Susmitha
 * @version 1.0.0
 * @created 13-11-2024
 * @lastModified 17-11-2024
 * 
 * @dependencies
 * - React: Core React library
 * - Material-UI: UI component library
 * - React Router: Navigation library
 * - PremiumButton: Custom button component
 * 
 * @features
 * - User profile display with avatar
 * - Theme mode toggle (light/dark)
 * - Navigation to Employee E-File
 * - Cookie-based user data management
 * - Responsive design
 * 
 * @props
 * @param {string} themeMode - Current theme mode ("light" or "dark")
 * @param {function} toggleThemeMode - Function to toggle between theme modes
 * @param {function} onClose - Callback function when settings close
 * 
 * @state
 * @state {Object} user - User data object containing profile information
 * @state {boolean} loading - Loading state for user data
 * 
 * @example
 * <Settings
 *   themeMode="light"
 *   toggleThemeMode={handleThemeToggle}
 *   onClose={handleCloseSettings}
 * />
 */

import React, { useState, useEffect } from "react"; // Import React and hooks
import {
  Box, // Layout container component
  Card, // Card container component
  CardContent, // Card content area
  Typography, // Text display component
  Avatar, // User avatar component
  Button, // Button component
  Divider, // Horizontal divider
  Chip, // Small label component
  IconButton, // Clickable icon button
} from "@mui/material"; // Material-UI components
import { Badge, Close } from "@mui/icons-material"; // Material-UI icons
import { PremiumButton } from "src/components/ui/Button.js"; // Custom premium button component
import { useNavigate } from "react-router-dom"; // Navigation hook

/**
 * Utility function to get cookie value by name
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string|null} The cookie value or null if not found
 */
const getCookie = (name) => {
  if (typeof document === "undefined") return null; // Server-side rendering check
  const value = `${document.cookie}`; // Get all cookies as string
  const parts = value.split(`; ${name}=`); // Split by cookie name
  if (parts.length === 2) return parts.pop().split(";").shift(); // Extract cookie value
  return null; // Return null if cookie not found
};

/**
 * Utility function to decode and parse user data from cookie
 * @param {string} encodedUserData - URL-encoded JSON string of user data
 * @returns {Object|null} Parsed user data object or null if decoding fails
 */
const decodeUserData = (encodedUserData) => {
  try {
    if (!encodedUserData) return null; // Return null if no data
    const decoded = decodeURIComponent(encodedUserData); // URL decode the data
    return JSON.parse(decoded); // Parse JSON string to object
  } catch {
    return null; // Return null on any error
  }
};

/**
 * Settings Component
 * Displays user profile information and settings options
 * @param {Object} props - Component props
 * @param {string} props.themeMode - Current theme mode
 * @param {function} props.toggleThemeMode - Theme toggle handler
 * @param {function} props.onClose - Close handler
 * @returns {JSX.Element} Settings component JSX
 */
const Settings = ({ themeMode, toggleThemeMode, onClose }) => {
  const navigate = useNavigate(); // Initialize navigation function

  // State for user data with default values
  const [user, setUser] = useState({
    employeeId: "", // Employee identification number
    name: "", // Full name of user
    role: "", // User role/position
    email: "", // Email address
    phone: "", // Phone number
    username: "", // Username
    sessionId: "", // Session identifier
    selectedRole: "", // Selected role if multiple available
  });

  const [loading, setLoading] = useState(true); // Loading state

  /**
   * Effect hook to load user data from cookies on component mount
   * Runs once when component is initialized
   */
  useEffect(() => {
    try {
      // Retrieve user data from various cookies
      const empid = getCookie("Empid"); // Employee ID cookie
      const username = getCookie("username"); // Username cookie
      const userRole = getCookie("selectedRole"); // User role cookie
      const mobileNo = getCookie("mobileNo"); // Mobile number cookie
      const session_id = getCookie("session_id"); // Session ID cookie
      const userData = getCookie("userData"); // Comprehensive user data cookie
      const decodedUserData = decodeUserData(userData); // Decode user data

      // Construct email from username with domain
      const email = username ? `${username}@iitm.ac.in` : "user@iitm.ac.in";

      // Build user data object with fallback values
      const userDataFromCookies = {
        employeeId: empid || decodedUserData?.EmployeeId || "Not Available", // Employee ID with fallbacks
        name: decodedUserData?.username || username || "Not Available", // Name with fallbacks
        role: userRole || decodedUserData?.role || "Not Available", // Role with fallbacks
        email, // Constructed email
        phone: mobileNo || "Not Available", // Phone with fallback
        username: username || decodedUserData?.username || "Not Available", // Username with fallbacks
        sessionId: session_id || decodedUserData?.userId || "Not Available", // Session ID with fallbacks
        selectedRole: userRole || "Not Available", // Selected role with fallback
      };

      setUser(userDataFromCookies); // Update user state with retrieved data
    } catch {
      // Set default values if any error occurs during data retrieval
      setUser({
        employeeId: "Not Available",
        name: "Not Available",
        role: "Not Available",
        email: "Not Available",
        phone: "Not Available",
        username: "Not Available",
        sessionId: "Not Available",
        selectedRole: "Not Available",
      });
    } finally {
      setLoading(false); // Always set loading to false when done
    }
  }, []); // Empty dependency array - runs only once on mount

  // Show loading state while user data is being retrieved
  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}> {/* Centered loading container */}
        <Typography>Loading user data...</Typography> {/* Loading text */}
      </Box>
    );
  }

  /**
   * Handler function to navigate to Employee E-File screen
   * Passes user data as navigation state
   */
  const handleEFile = () => {
    navigate("/EmployeeEFile", { // Navigate to Employee E-File route
      state: { // Pass state to the target route
        type: "userefile", // E-file type
        employeeId: user.employeeId, // Current user's employee ID
        userRole: user.role, // Current user's role
        sessionId: user.sessionId, // Current session ID
      },
    });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900, margin: "0 auto", p: 3 }}> {/* Main container */}
      {/* Close Icon */}
      <IconButton
        onClick={onClose} // Close handler
        sx={{
          position: "absolute", // Absolute positioning
          top: 8, // Position from top
          right: 8, // Position from right
          zIndex: 10, // Ensure it's above other elements
        }}
      >
        <Close /> {/* Close icon */}
      </IconButton>

      {/* User Profile Card */}
      <Card elevation={2} sx={{ width: "100%", maxWidth: 900 }}> {/* Card with shadow */}
        <CardContent sx={{ p: 3 }}> {/* Card content with padding */}
          {/* Header Section with Avatar and Basic Info */}
          <Box
            sx={{
              display: "flex", // Flex layout
              alignItems: "center", // Center align vertically
              gap: 2, // Gap between elements
              mb: 3, // Bottom margin
            }}
          >
            <Avatar
              sx={{
                width: 70, // Avatar width
                height: 70, // Avatar height
                bgcolor: // Background color based on theme
                  themeMode === "light" ? "primary.main" : "secondary.main",
                fontSize: "1.5rem", // Font size for initials
              }}
            >
              {user.name !== "Not Available" // Check if name is available
                ? user.name
                    .split(" ") // Split name by spaces
                    .map((n) => n[0]) // Get first letter of each part
                    .join("") // Join letters to form initials
                : "U"} {/* Default initial if no name */}
            </Avatar>

            <Box> {/* User info container */}
              <Typography variant="h6" fontWeight="bold"> {/* User name */}
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary"> {/* User role */}
                {user.role}
              </Typography>

              <Box
                sx={{
                  display: "flex", // Flex layout
                  alignItems: "center", // Center align
                  gap: 0.5, // Small gap
                  mt: 0.5, // Top margin
                }}
              >
                <Badge sx={{ fontSize: 16 }} /> {/* Badge icon */}
                <Typography variant="caption" color="primary" fontWeight="bold"> {/* Employee ID */}
                  ID: {user.employeeId}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} /> {/* Horizontal divider */}

          {/* User Information Details */}
          <Box sx={{ space: 2 }}> {/* Information container */}
            {/* Full Name Field */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary"> {/* Label */}
                Full Name
              </Typography>
              <Typography variant="body1" fontWeight="medium"> {/* Value */}
                {user.name}
              </Typography>
            </Box>

            {/* Username Field */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary"> {/* Label */}
                Username
              </Typography>
              <Typography variant="body1" fontWeight="medium"> {/* Value */}
                {user.username}
              </Typography>
            </Box>

            {/* Role Field */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary"> {/* Label */}
                Role
              </Typography>
              <Typography variant="body1" fontWeight="medium"> {/* Value */}
                {user.role}
              </Typography>
            </Box>

            {/* Mobile Field */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary"> {/* Label */}
                Mobile
              </Typography>
              <Typography variant="body1" fontWeight="medium"> {/* Value */}
                {user.phone}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons Section */}
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}> {/* Buttons container */}
        <PremiumButton onClick={handleEFile} /> {/* Premium E-File button */}
        <Button 
          variant="contained" // Filled button style
          onClick={toggleThemeMode} // Theme toggle handler
          fullWidth // Take full available width
        >
          Switch to {themeMode === "light" ? "Dark" : "Light"} Mode {/* Dynamic button text */}
        </Button>
      </Box>
    </Box>
  );
};

export default Settings; // Export component