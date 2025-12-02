/**
 * @fileoverview SidebarItems Component.
 * @module SidebarItems
 * @description Renders the hierarchical and responsive list of menu items for the sidebar.
 * It handles the logic for hover effects, active state selection, collapsed/expanded views, 
 * and tooltips for mini-sidebar mode.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - React, useState: Core React features.
 * - useLocation, Link, useNavigate: React Router hooks and component for navigation.
 * - Material-UI components: For styling and interaction.
 * - react-mui-sidebar components: Library components for menu structure.
 * - Tabler Icons: Icon components.
 * - Menuitems: The data structure defining the menu links.
 */
import React, { useState } from "react";
import { useLocation, Link, useNavigate } from 'react-router';
import { Box, Typography, Tooltip, Fade, Zoom, Chip } from "@mui/material";
import {
  // Aliasing the imported components to avoid name conflicts with local components
  Logo as MuiSidebarLogo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint } from '@tabler/icons-react';
import Menuitems from "./MenuItems";

/**
 * @typedef {Object} MenuItemData
 * @property {string} id - Unique ID.
 * @property {string} title - Display title.
 * @property {React.ComponentType} [icon] - Icon component.
 * @property {string} [href] - Target URL.
 * @property {string} [subheader] - Header text if it's a subheader type.
 * @property {MenuItemData[]} [children] - Nested menu items.
 * @property {string} [chip] - Optional badge/chip content.
 * @property {boolean} [disabled] - Optional flag to disable the item.
 */

/**
 * Recursively renders the menu items, subheaders, and submenus.
 * 
 * @param {MenuItemData[]} items - Array of menu item objects.
 * @param {string} pathDirect - The current pathname from React Router (for active state).
 * @param {boolean} isCollapsed - True if the sidebar is in its collapsed (mini-sidebar) state.
 * @param {string|null} hoveredItem - The ID of the currently hovered item.
 * @param {Function} setHoveredItem - Setter for the hovered item state.
 * @param {Function} handleItemClick - Handler for menu item clicks (handles forced refresh).
 * @returns {JSX.Element[]} An array of MenuItem or Submenu JSX elements.
 */
const renderMenuItems = (items, pathDirect, isCollapsed, hoveredItem, setHoveredItem, handleItemClick) => {
  return items.map((item, index) => {
    const Icon = item.icon ? item.icon : IconPoint;
    
    // Icon wrapper with active/hover effects
    const itemIcon = (
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // Apply a slight animation on hover
          transform: hoveredItem === item.id ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
          // Active indicator dot for collapsed state
          '&::after': isCollapsed && pathDirect === item?.href ? {
            content: '""',
            position: 'absolute',
            right: -8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 4,
            height: 20,
            backgroundColor: '#e5ecf9',
            borderRadius: 2,
            animation: 'pulse 2s infinite'
          } : {}
        }}
      >
        <Icon 
          stroke={1.5} 
          size="1.3rem" 
          style={{
            // Drop shadow on icon when hovered
            filter: hoveredItem === item.id ? 'drop-shadow(0 0 8px #e77d67)' : 'none',
            transition: 'filter 0.3s ease'
          }}
        />
      </Box>
    );

    // --- Subheader Rendering ---
    if (item.subheader) {
      // Collapsed: Render a simple divider
      if (isCollapsed) {
        return (
          <Box 
            key={item.subheader}
            sx={{ 
              height: 2, 
              backgroundColor: '#e77d67',
              margin: '16px 0',
              borderRadius: 1,
              opacity: 0.3
            }} 
          />
        );
      }
      
      // Expanded: Render the subheader with animation
      return (
        <Fade in={!isCollapsed} timeout={300} key={item.subheader}>
          <Box sx={{ 
            margin: "0 -24px", 
            textTransform: 'uppercase',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: -4,
              height: 1,
              background: 'linear-gradient(90deg, transparent, #5D87FF20, transparent)'
            }
          }}>
            <Menu
              subHeading={item.subheader}
              key={item.subheader}
            />
          </Box>
        </Fade>
      );
    }

    // --- Submenu (Children) Rendering ---
    if (item.children) {
      // Collapsed: Render as a single MenuItem wrapped in a Tooltip
      if (isCollapsed) {
        return (
          <Tooltip 
            key={item.id}
            title={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 ,  fontFamily: '"Poppins", sans-serif' }}>
                  {item.title}
                </Typography>
                {item.children.map(child => (
                  <Typography key={child.id} variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem',  fontFamily: '"Poppins", sans-serif' }}>
                    • {child.title}
                  </Typography>
                ))}
              </Box>
            }
            placement="right"
            arrow
            TransitionComponent={Zoom}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                }
              }
            }}
          >
            <Box>
              <MenuItem
                key={`${item.id}-collapsed`}
                isSelected={pathDirect === item?.href}
                borderRadius='12px'
                icon={itemIcon}
                component="div" // Use div as it's not a direct link in collapsed state
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  // Shimmer effect on hover
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    transition: 'left 0.5s ease',
                  },
                  '&:hover::before': {
                    left: '100%'
                  }
                }}
              >
                {/* Hide text content */}
                <Typography component='span' sx={{ opacity: 0, width: 0 }}>
                  {item.title}
                </Typography>
              </MenuItem>
            </Box>
          </Tooltip>
        );
      }
      
      // Expanded: Render a recursive Submenu
      return (
        <Submenu
          key={item.id}
          title={item.title}
          icon={itemIcon}
          borderRadius='12px'
          sx={{
            '& .MuiCollapse-root': {
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important'
            }
          }}
        >
          {/* Recursively render children */}
          {renderMenuItems(item.children, pathDirect, isCollapsed, hoveredItem, setHoveredItem, handleItemClick)}
        </Submenu>
      );
    }

    // --- Single Menu Item Rendering ---
    
    /**
     * Handles the click event for navigation.
     * Prevents default action and forces a refresh if the user clicks the currently active page link.
     * @param {Event} e - The DOM click event.
     * @param {MenuItemData} item - The data for the clicked menu item.
     */
    const handleClick = (e, item) => {
      // If it's not an external link and we're already on the same page, refresh
      if (!item.href?.startsWith("https") && pathDirect === item.href) {
        e.preventDefault();
        handleItemClick(item);
      }
    };

    // The core MenuItem wrapped in a React Router Link
    const menuItem = (
      <Link 
        to={item.href} 
        // Open external links in a new tab
        target={item.href && item.href.startsWith("https") ? "_blank" : "_self"} 
        rel="noopener noreferrer" 
        style={{ 
          textDecoration: 'none', 
          color: 'inherit',
          display: 'block',
          width: '100%'
        }}
        onClick={(e) => handleClick(e, item)}
      >
        <MenuItem
          key={item.id}
          isSelected={pathDirect === item?.href}
          borderRadius='12px'
          icon={itemIcon}
          component="div" // Ensures the Link component is the wrapper
          badge={item.chip && !isCollapsed ? true : false}
          badgeContent={item.chip || ""}
          badgeColor='secondary'
          backgroundColor='#b6abac'
          disabled={item.disabled}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            // Slide effect on hover
            transform: hoveredItem === item.id ? 'translateX(8px)' : 'translateX(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            // Shimmer effect on hover
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              transition: 'left 0.5s ease',
            },
            '&:hover::before': {
              left: '100%'
            },
            // Active state indicator bar on the left
            '&::after': pathDirect === item?.href ? {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: '#b6abac',
              borderRadius: '0 4px 4px 0'
            } : {}
          }}
        >
          {/* Menu Item Title */}
          <Typography 
            component='span' 
            color={pathDirect === item?.href ? '#fff' : 'inherit'}
            sx={{
              opacity: isCollapsed ? 0 : 1,
              transform: isCollapsed ? 'translateX(-20px)' : 'translateX(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              fontWeight: pathDirect === item?.href ? 600 : 400,
              position: 'relative',
              zIndex: 1,
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            {item.title}
          </Typography>
          {/* Optional Chip/Badge */}
          {!isCollapsed && item.chip && (
            <Chip
              label={item.chip}
              size="small"
              sx={{
                ml: 'auto',
                height: 20,
                fontSize: '0.7rem',
                background: 'linear-gradient(45deg, #e77d67, #e77d67)',
                color: 'white',
                transform: hoveredItem === item.id ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease',
                fontFamily: '"Poppins", sans-serif',
              }}
            />
          )}
        </MenuItem>
      </Link>
    );

    // Collapsed: Render a Tooltip around the MenuItem
    if (isCollapsed) {
      return (
        <Tooltip 
          key={item.id}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500,  fontFamily: '"Poppins", sans-serif' }}>
                {item.title}
              </Typography>
              {item.chip && (
                <Chip
                  label={item.chip}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: '0.6rem',
                    background: 'linear-gradient(45deg, #e77d67, #e77d67)',
                    color: 'white'
                  }}
                />
              )}
            </Box>
          }
          placement="right"
          arrow
          TransitionComponent={Zoom}
          enterDelay={200}
          leaveDelay={100}
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                fontSize: '0.8rem',
                fontFamily: '"Poppins", sans-serif',
              }
            }
          }}
        >
          <Box>
            {menuItem}
          </Box>
        </Tooltip>
      );
    }

    // Expanded: Render with Fade-in animation
    return (
      <Fade in={!isCollapsed} timeout={{ enter: 300 + index * 50, exit: 200 }} key={item.id}>
        <Box>
          {menuItem}
        </Box>
      </Fade>
    );
  });
};

/**
 * SidebarItems Functional Component.
 * The main container and controller for the sidebar menu rendering logic.
 * 
 * @param {Object} props - The component's props.
 * @param {boolean} [props.isCollapsed=false] - Whether the sidebar is currently collapsed.
 * @returns {JSX.Element} The sidebar navigation structure.
 */
const SidebarItems = ({ isCollapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathDirect = location.pathname;
  // State to track the currently hovered menu item ID (for custom visual effects)
  const [hoveredItem, setHoveredItem] = useState(null);

  /**
   * Handles click events, specifically for forcing a refresh on the current page.
   * @param {MenuItemData} item - The menu item data.
   */
  const handleItemClick = (item) => {
    // If we're already on the same page and it's not an external link, refresh the page
    if (!item.href?.startsWith("https") && pathDirect === item.href) {
      // Force a page refresh by navigating to the same route and then reloading the window
      navigate(item.href, { replace: true });
      window.location.reload();
    }
  };

  return (
    <Box sx={{ 
      position: 'fixed',
      left: 0,
      top: '100px', // Below the topbar
      height: 'calc(100vh - 100px)',
      width: isCollapsed ? '80px' : '280px',
      zIndex: 1200,
      px: isCollapsed ? "8px" : "24px", 
      overflowY: 'auto',
      overflowX: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      // Background and shadow effects based on collapsed state
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: isCollapsed ? 4 : 0,
        right: isCollapsed ? 4 : 0,
        bottom: 0,
        background: isCollapsed ? 'linear-gradient(180deg, rgba(93, 135, 255, 0.03), rgba(73, 190, 255, 0.03))' : 'transparent',
        borderRadius: isCollapsed ? 12 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none'
      },
      // Custom scrollbar styling
      '& .MuiBox-root': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(93, 135, 255, 0.3) transparent',
        '&::-webkit-scrollbar': {
          width: 4,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(93, 135, 255, 0.3)',
          borderRadius: 4,
          '&:hover': {
            background: 'rgba(93, 135, 255, 0.5)',
          },
        },
      },
      // Keyframes defined for animations used in rendering logic
      '@keyframes pulse': {
        '0%, 100%': { opacity: 0.3 },
        '50%': { opacity: 1 }
      },
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-2px)' }
      }
    }}>
      <MUI_Sidebar 
        width={"100%"} 
        showProfile={false} 
        themeColor={"#FEB21A"} 
        themeSecondaryColor={'#49BEFF1a'}
      >
        {/* Top Separator/Divider */}
        <Box sx={{ 
          margin: isCollapsed ? "0 -8px" : "0 -24px",
          transition: 'margin 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #5D87FF40, transparent)',
            marginBottom: 2,
            opacity: isCollapsed ? 0.3 : 0.1
          }} />
        </Box>
        
        {/* Render the actual menu items */}
        {renderMenuItems(Menuitems, pathDirect, isCollapsed, hoveredItem, setHoveredItem, handleItemClick)}
        
        {/* Bottom Separator/Divider */}
        <Box sx={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, #49BEFF40, transparent)',
          marginTop: 'auto',
          opacity: isCollapsed ? 0.3 : 0.1
        }} />
      </MUI_Sidebar>
    </Box>
  );
};

export default SidebarItems;