/**
 * @fileoverview DependentSectionCard Component (Top Color Card).
 * @module DependentSectionCard
 * @description A highly styled Material-UI Paper component used as a container for individual 
 * data sections (e.g., dependents). It features a prominent colored *top* strip, a dynamic 
 * header (title, subtitle, icon), and optional actions, with hover effects and responsive design.
 * NOTE: The side strip logic from the original DependentSectionCard has been modified to a TOP strip.
 * 
 * @imports
 * - React hooks: useState, useEffect for managing dynamic color state.
 * - Material-UI components: For layout and responsiveness.
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} DependentSectionCardProps
 * @property {React.ReactNode} children - The main content of the card.
 * @property {string} [title] - The main title displayed in the card header.
 * @property {string} [subtitle] - The secondary subtitle displayed below the title.
 * @property {string} [color] - Optional, explicit hex color code for the theme and top strip. If null, a random color is selected.
 * @property {React.ReactNode} [icon] - Optional icon component (e.g., MUI Icon) for the header.
 * @property {React.ReactNode} [headerAction] - Optional action element (e.g., Button) for the right side of the header.
 * @property {object} [sx={}] - Custom Material-UI styling object to override the root Paper styles.
 */

/**
 * DependentSectionCard Functional Component (renamed from the original file's context, 
 * but based on the provided code with a TOP strip modification).
 * 
 * @param {DependentSectionCardProps} props - The component's props.
 * @returns {JSX.Element} The styled Paper component acting as a section card.
 */
const DependentSectionCard = ({ 
  children, 
  title, 
  subtitle, 
  color, // No default value here, allowing random generation logic in useEffect
  icon,
  headerAction,
  sx = {} 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [randomColor, setRandomColor] = useState('#10B981'); // Default fallback

  /**
   * Effect to set the card's theme color. 
   * If `color` prop is provided, it is used; otherwise, a random color is chosen from a predefined list.
   */
  useEffect(() => {
    const colors = [
      '#e91e63', // Pink
      '#2196f3', // Blue
      '#9c27b0', // Purple
      '#ff9800', // Orange
      '#4caf50', // Green
      '#757575', // Grey
    ];
    const selectedColor = color || colors[Math.floor(Math.random() * colors.length)];
    setRandomColor(selectedColor);
  }, [color]); // Re-run if color prop changes

  // Use the provided color or the randomly generated one
  const finalColor = color || randomColor;

  return (
    <Paper
      sx={{
        p: isMobile ? 2 : 3,
        mb: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${finalColor}20`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        // The distinct color TOP strip (Note the change from left/bottom to top/right/height)
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0, // Stretches across the top
          height: 4, // Height of the strip
          background: `linear-gradient(90deg, ${finalColor} 0%, ${finalColor}80 100%)`, // Horizontal gradient
        },
        // Hover effect for elevation and movement
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${finalColor}20`,
        },
        ...sx // Apply custom props
      }}
    >
      {/* Header Section */}
      {(title || icon) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexDirection: isMobile ? 'column' : 'row',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            {/* Icon Container */}
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isMobile ? 48 : 60,
                  height: isMobile ? 48 : 60,
                  borderRadius: 3,
                  backgroundColor: `${finalColor}15`,
                  color: finalColor,
                  fontSize: isMobile ? '1.5rem' : '1.75rem',
                  boxShadow: `0 4px 12px ${finalColor}20`
                }}
              >
                {icon}
              </Box>
            )}
            
            {/* Title and Subtitle */}
            <Box>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="700"
                sx={{
                  // Gradient text effect using the theme color
                  background: `linear-gradient(45deg, ${finalColor}, ${finalColor}80)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  lineHeight: 1.2
                }}
              >
                {title}
              </Typography>
              
              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    fontSize: isMobile ? '0.8rem' : '0.9rem'
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Header Action (e.g., a button or link) */}
          {headerAction && (
            <Box sx={{ mt: isMobile ? 1 : 0 }}>
              {headerAction}
            </Box>
          )}
        </Box>
      )}

      {/* Main Children Content */}
      <Box>
        {children}
      </Box>
    </Paper>
  );
};

/**
 * Prop type validation for DependentSectionCard.
 */
DependentSectionCard.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.node,
  headerAction: PropTypes.node,
  sx: PropTypes.object,
};

export default DependentSectionCard;