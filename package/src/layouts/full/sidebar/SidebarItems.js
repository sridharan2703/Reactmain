import React, { useState } from "react";
import { useLocation, NavLink, Link } from 'react-router';
import { Box, Typography, Tooltip, Fade, Zoom, Chip } from "@mui/material";
import {
  Logo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint } from '@tabler/icons-react';
import Menuitems from "./MenuItems";

const renderMenuItems = (items, pathDirect, isCollapsed, hoveredItem, setHoveredItem) => {
  return items.map((item, index) => {
    const Icon = item.icon ? item.icon : IconPoint;
    const itemIcon = (
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hoveredItem === item.id ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
          '&::after': isCollapsed && pathDirect === item?.href ? {
            content: '""',
            position: 'absolute',
            right: -8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 4,
            height: 20,
            backgroundColor: '#5D87FF',
            borderRadius: 2,
            animation: 'pulse 2s infinite'
          } : {}
        }}
      >
        <Icon 
          stroke={1.5} 
          size="1.3rem" 
          style={{
            filter: hoveredItem === item.id ? 'drop-shadow(0 0 8px rgba(93, 135, 255, 0.6))' : 'none',
            transition: 'filter 0.3s ease'
          }}
        />
      </Box>
    );

    if (item.subheader) {
      if (isCollapsed) {
        return (
          <Box 
            key={item.subheader}
            sx={{ 
              height: 2, 
              background: 'linear-gradient(90deg, transparent, #5D87FF, transparent)',
              margin: '16px 0',
              borderRadius: 1,
              opacity: 0.3
            }} 
          />
        );
      }
      
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

    if (item.children) {
      if (isCollapsed) {
        return (
          <Tooltip 
            key={item.id}
            title={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 ,  fontFamily: '"Poppins", sans-serif',
}}>
                  {item.title}
                </Typography>
                {item.children.map(child => (
                  <Typography key={child.id} variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem',  fontFamily: '"Poppins", sans-serif',
 }}>
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
                  border: '1px solid rgba(93, 135, 255, 0.2)',
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
                component="div"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
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
                <Typography component='span' sx={{ opacity: 0, width: 0 }}>
                  {item.title}
                </Typography>
              </MenuItem>
            </Box>
          </Tooltip>
        );
      }
      
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
          {renderMenuItems(item.children, pathDirect, isCollapsed, hoveredItem, setHoveredItem)}
        </Submenu>
      );
    }

    const menuItem = (
      <MenuItem
        key={item.id}
        isSelected={pathDirect === item?.href}
        borderRadius='12px'
        icon={itemIcon}
        component="div"
        link={item.href && item.href !== "" ? item.href : undefined}
        target={item.href && item.href.startsWith("https") ? "_blank" : "_self"}
        badge={item.chip && !isCollapsed ? true : false}
        badgeContent={item.chip || ""}
        badgeColor='secondary'
        badgeTextColor="#1b84ff"
        disabled={item.disabled}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          transform: hoveredItem === item.id ? 'translateX(8px)' : 'translateX(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
          '&::after': pathDirect === item?.href ? {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: 'linear-gradient(180deg, #5D87FF, #49BEFF)',
            borderRadius: '0 4px 4px 0'
          } : {}
        }}
      >
        <Link 
          to={item.href} 
          target={item.href.startsWith("https") ? "_blank" : "_self"} 
          rel="noopener noreferrer" 
          style={{ 
            textDecoration: 'none', 
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            position: 'relative'
          }}
        >
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
          {!isCollapsed && item.chip && (
            <Chip
              label={item.chip}
              size="small"
              sx={{
                ml: 'auto',
                height: 20,
                fontSize: '0.7rem',
                background: 'linear-gradient(45deg, #5D87FF, #49BEFF)',
                color: 'white',
                transform: hoveredItem === item.id ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease',
                 fontFamily: '"Poppins", sans-serif',

              }}
            />
          )}
        </Link>
      </MenuItem>
    );

    if (isCollapsed) {
      return (
        <Tooltip 
          key={item.id}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500,  fontFamily: '"Poppins", sans-serif',
 }}>
                {item.title}
              </Typography>
              {item.chip && (
                <Chip
                  label={item.chip}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: '0.6rem',
                    background: 'linear-gradient(45deg, #5D87FF, #49BEFF)',
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
                border: '1px solid rgba(93, 135, 255, 0.2)',
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

    return (
      <Fade in={!isCollapsed} timeout={{ enter: 300 + index * 50, exit: 200 }} key={item.id}>
        <Box>
          {menuItem}
        </Box>
      </Fade>
    );
  });
};

const SidebarItems = ({ isCollapsed = false }) => {
  const location = useLocation();
  const pathDirect = location.pathname;
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <Box sx={{ 
      px: isCollapsed ? "8px" : "24px", 
      overflowX: 'hidden',
      transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
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
        themeColor={"#5D87FF"} 
        themeSecondaryColor={'#49BEFF1a'}
      >
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
        {renderMenuItems(Menuitems, pathDirect, isCollapsed, hoveredItem, setHoveredItem)}
        
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