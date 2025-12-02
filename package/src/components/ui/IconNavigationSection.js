// IconNavigationSection.jsx


/**
 * @fileoverview Enhanced Button component with all variations in one file.
 * Supports multiple variants, style types, sizes, states, and new variations.
 * Includes navigation functions for back, previous, and next buttons.
 * @module src/components/ui/Button
 * @author Rovita
 * @date 31/10/2025
 * @since 1.0.0
 */



import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Avatar,
  Tooltip,
//   Button,
  keyframes,
  styled,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { BackButton } from 'src/components/ui/Button.js';

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-8px) scale(1.05); }
`;

const waveAnimation = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const rippleAnimation = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

// Styled Components
const NavigationWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  border: '1px solid rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//   gap:4
}));

const WavyContainer = styled(Box)(({ theme, color }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  background: `linear-gradient(135deg, ${color}08 0%, ${color}15 100%)`,
  border: `1px solid ${color}20`,
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
    animation: `${waveAnimation} 3s ease-in-out infinite`,
  },
}));

const BackNavButton = styled(BackButton)(({ theme }) => ({
  borderRadius: 25,
  padding: '10px 20px',
  background: 'linear-gradient(45deg, #666 0%, #999 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #555 0%, #888 100%)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
  zIndex: 2,
  position: 'relative',
}));

const NavigationIcon = styled(IconButton)(({ theme, color, isactive }) => ({
  position: 'relative',
  width: 48,
  height: 48,
  gap:4,
  background: isactive ? 
    `linear-gradient(135deg, ${color} 0%, ${color}80 100%)` :
    `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
  border: isactive ? `2px solid ${color}` : `1px solid ${color}30`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    borderRadius: '50%',
    background: `${color}20`,
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: `0 8px 25px ${color}40`,
    '&::before': {
      width: '100%',
      height: '100%',
    }
  },
}));

const RippleEffect = styled(Box)(({ theme, color }) => ({
  position: 'absolute',
  borderRadius: '50%',
  backgroundColor: `${color}30`,
  transform: 'scale(0)',
  animation: `${rippleAnimation} 1s ease-out`,
  pointerEvents: 'none',
}));

const IconsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  minHeight: 60,
}));

const IconNavigationSection = ({ 
  sections, 
  activeSection, 
  onSectionClick, 
  onBackClick,
  color = '#1976d2' 
}) => {
  const [ripples, setRipples] = useState([]);

  const handleIconClick = (sectionId, event) => {
    onSectionClick(sectionId);
    
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      color: sections.find(s => s.id === sectionId)?.color || color,
    };
    setRipples(prev => [...prev, ripple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 1000);
  };

  return (
    <NavigationWrapper>
      <WavyContainer color={color}>
        <BackNavButton
          startIcon={<ArrowBack />}
          onClick={onBackClick}
        >
          Back
        </BackNavButton>
        
        <Box
          sx={{
            width: 2,
            height: 30,
            margin: '0 16px',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: color,
              animation: `${floatAnimation} 2s ease-in-out infinite`,
            }
          }}
        />
        
        <IconsContainer>
          {ripples.map(ripple => (
            <RippleEffect
              key={ripple.id}
              color={ripple.color}
              sx={{
                left: ripple.x - 20,
                top: ripple.y - 20,
                width: 40,
                height: 40,
              }}
            />
          ))}
          
          {sections.map((section) => (
            <Tooltip 
              key={section.id} 
              title={section.label} 
              placement="top" 
              arrow
              enterDelay={500}
              leaveDelay={200}
                            componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'black',
                    color: 'white',
                    '& .MuiTooltip-arrow': {
                      color: 'black',
                    },
                  },
                },
              }}
            >
              <NavigationIcon
                color={section.color}
                isactive={activeSection === section.id}
                onClick={(e) => handleIconClick(section.id, e)}
                sx={{
                  animation: activeSection === section.id ? 
                    `${floatAnimation} 2s ease-in-out infinite` : 'none',
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: activeSection === section.id ? 
                      'white' : `${section.color}80`,
                    color: activeSection === section.id ? 
                      section.color : 'white',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    boxShadow: activeSection === section.id ? 
                      `0 4px 15px ${section.color}40` : 'none',
                    //   gap:4
                  }}
                >
                  {section.icon}
                </Avatar>
              </NavigationIcon>
            </Tooltip>
          ))}
        </IconsContainer>
      </WavyContainer>
    </NavigationWrapper>
  );
};

export default IconNavigationSection;