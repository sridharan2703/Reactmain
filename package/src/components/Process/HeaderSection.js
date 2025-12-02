

/**
 * @fileoverview Clean & Professional HeaderSection
 * Simple, elegant design with subtle interactions
 * @author Rakshana
 * @module HeaderSection
 * @since 6.0.0
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip, Box, Typography } from '@mui/material';
import {
  HelpOutline as GuidelinesIcon,
  VideoLibrary as VideoIcon,
  Description as HelDocIcon,
  AccountTree as FlowchartIcon,
  AccountCircle as SendIcon,
} from '@mui/icons-material';

const HeaderSection = ({
  title,
  onGuidelinesClick,
  onVideoClick,
  onHelDocClick,
  onFlowchartClick,
  onEfileClick,
}) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [efileHovered, setEfileHovered] = useState(false);
  const iconButtons = [
    { 
      id: 'guidelines', 
      icon: GuidelinesIcon, // Using HelpOutline (Question Mark) for Guidelines as seen in the image's crops
      label: 'Guidelines', 
      onClick: onGuidelinesClick,
      color: '#8b5cf6'
    },
    { 
      id: 'video', 
      icon: VideoIcon, 
      label: 'Video Tutorial', 
      onClick: onVideoClick,
      color: '#ec4899'
    },
    { 
      id: 'heldoc', 
      icon: HelDocIcon, // Using Description (Paper/File) for Help Doc as seen in the image's crops
      label: 'Help Doc', 
      onClick: onHelDocClick,
      color: '#06b6d4'
    },
    { 
      id: 'flowchart', 
      icon: FlowchartIcon, 
      label: 'Process Flow', 
      onClick: onFlowchartClick,
      color: '#10b981'
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 32px',
        marginBottom: '32px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
        }
      }}
    >
      {/* Title Section */}
      <Typography
        variant="h5"
        sx={{
          margin: 0,
          fontSize: '22px',
          fontWeight: '700 !important',
          color: '#0f172a',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </Typography>

      {/* Actions Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Icon Buttons */}
        {iconButtons.map((btn) => {
          const isHovered = hoveredIcon === btn.id;
          return (
            <Tooltip
              key={btn.id}
              title={btn.label}
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: '#1a365d',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '7px 7px',
                    borderRadius: '25px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                },
                arrow: {
                  sx: {
                    color: '#1a365d',
                  },
                },
              }}
            >
              <IconButton
                onClick={btn.onClick}
                size="medium"
                onMouseEnter={() => setHoveredIcon(btn.id)}
                onMouseLeave={() => setHoveredIcon(null)}
                sx={{
                  color: isHovered ? btn.color : '#64748b',
                  backgroundColor: isHovered ? `${btn.color}10` : '#f8fafc',
                  border: `1.5px solid ${isHovered ? btn.color : '#e2e8f0'}`,
                  borderRadius: '12px',
                  padding: '7px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: `${btn.color}10`,
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                     transform: 'translateY(0)', // Added to match other buttons
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '20px',
                  },
                }}
              >
                <btn.icon />
              </IconButton>
            </Tooltip>
          );
        })}

        {/* Divider */}
        <Box
          sx={{
            width: '1px',
            height: '32px',
            backgroundColor: '#e2e8f0',
            margin: '0 8px',
          }}
        />

        {/* E-File Button */}
        <Box
          component="button"
          onClick={onEfileClick}
          onMouseEnter={() => setEfileHovered(true)}
          onMouseLeave={() => setEfileHovered(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            background: efileHovered
              ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
              : '#2563eb',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          <SendIcon sx={{ fontSize: '18px' }} />
          E-File
        </Box>
      </Box>
    </Box>
  );
};

HeaderSection.propTypes = {
  title: PropTypes.string.isRequired,
  onGuidelinesClick: PropTypes.func,
  onVideoClick: PropTypes.func,
  onHelDocClick: PropTypes.func,
  onFlowchartClick: PropTypes.func,
  onEfileClick: PropTypes.func,
};

HeaderSection.defaultProps = {
  title: 'Process Approval',
  onGuidelinesClick: undefined,
  onVideoClick: undefined,
  onHelDocClick: undefined,
  onFlowchartClick: undefined,
  onEfileClick: undefined,
};

export default HeaderSection;
