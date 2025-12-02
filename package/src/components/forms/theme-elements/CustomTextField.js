import React from 'react';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

/**
 * @fileoverview CustomTextField Component.
 * @module CustomTextField
 * @description A styled version of the Material-UI TextField component (using the Outlined variant) 
 * that applies custom styles for border radius, height, colors for various states (hover, focus, disabled), 
 * and placeholder appearance.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - React: Core React library.
 * - styled: Material-UI utility for creating styled components.
 * - TextField: The base Material-UI input component.
 */

/**
 * @constant {StyledComponent} CustomTextField
 * @description A styled component wrapping the Material-UI TextField.
 * It targets specific CSS classes of the Outlined Input component to customize its appearance.
 */
const CustomTextField = styled((props) => <TextField {...props} />)(({ theme }) => ({
  // Targeting the root of the outlined input
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px', // Custom border radius
    borderColor: theme.palette.grey[700],
    height: "46px", // Fixed height for consistent look
    
    // Targeting the fieldset (notch outline)
    '& fieldset': {
      borderColor: theme.palette.grey[700],
    },
    
    // Hover state styling
    '&:hover fieldset': {
      borderColor: theme.palette.primary.dark,
    },
    
    // Focused state styling
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
  
  // Input text color
  '& .MuiOutlinedInput-input': {
    color: theme.palette.text.dark,
  },
  
  // Placeholder styling
  '& .MuiOutlinedInput-input::placeholder': {
    color: theme.palette.primary.light,
    opacity: '0.8',
  },
  
  // Disabled state styling for border
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.light,
  },
  
  // Disabled state styling for text
  '& .Mui-disabled .MuiOutlinedInput-input': {
    color: theme.palette.primary.light,
  },
}));

export default CustomTextField;