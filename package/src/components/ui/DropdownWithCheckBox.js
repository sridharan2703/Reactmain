/**
 * @fileoverview DropdownWithCheckboxes Component.
 * @module DropdownWithCheckboxes
 * @description A customizable Material-UI Select component that supports multiple selections
 * using checkboxes, includes an optional search feature, and provides enhanced error/helper text display.
 * @author Susmitha
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - React hooks: useState, useRef, useEffect for component logic and state management.
 * - Material-UI components: For form and selection UI elements.
 */

/**
 * @typedef {Object} DropdownOption
 * @property {string|number} label - The display text for the option.
 * @property {any} value - The unique value of the option.
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
  ListSubheader,
  FormHelperText,
} from "@mui/material";

/**
 * @typedef {Object} DropdownProps
 * @property {string} label - The label text for the dropdown.
 * @property {DropdownOption[]} [options=[]] - Array of available selection options.
 * @property {any[]} [value=[]] - Array of currently selected values.
 * @property {Function} onChange - Callback function triggered when the selection changes.
 * @property {boolean} [showSearch=true] - Whether to display the search input in the menu.
 * @property {boolean} [disabled=false] - Whether the dropdown is disabled.
 * @property {string} [error=""] - If set, treats the dropdown as having an error state.
 * @property {string} [helperText=""] - Helper text displayed below the dropdown.
 * @property {object} [sx={}] - Custom Material-UI styling object for the FormControl root.
 */

/**
 * DropdownWithCheckboxes Functional Component.
 * 
 * @param {DropdownProps} props - The component's props.
 * @returns {JSX.Element} The Multi-select Dropdown component.
 */
const DropdownWithCheckboxes = ({
  label,
  options = [],
  value = [],
  onChange,
  showSearch = true,
  disabled = false,
  error = "",
  helperText = "",
  sx = {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // FIX: Add defensive programming to handle invalid options
  const safeOptions = options.map(option => ({
    ...option,
    label: typeof option.label === 'string' ? option.label : String(option.label || option.value || ''),
    value: option.value !== undefined ? option.value : option.label
  }));

  // Filter options based on the current search term
  const filteredOptions = safeOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Effect to focus the search input automatically when the menu is opened 
   * or the search term changes.
   */
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

  /**
   * Handles the change event from the Material-UI Select component.
   * Manages the format conversion between the event value and the expected array state.
   * @param {Event} event - The DOM change event.
   */
  const handleChange = (event) => {
    const newValue = event.target.value;
    
    // Custom logic to handle "select all" or clear all (if implemented with a specific value)
    if (newValue[newValue.length - 1] === "all") {
      onChange([]);
      return;
    }
    
    // Ensure the output is an array of selected values
    onChange(typeof newValue === "string" ? newValue.split(",") : newValue);
  };

  return (
    <FormControl 
      fullWidth 
      error={!!error}
      disabled={disabled}
      sx={sx}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        onOpen={() => setSearchTerm("")} // Clear search when opening
        onClose={() => setSearchTerm("")} // Clear search when closing
        input={<OutlinedInput label={label} />}
        // Custom render logic for the selected values chip display
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>Placeholder (Select options)</em>;
          }
          // Display selected values as a comma-separated string
          return selected.join(", ");
        }}
        // Custom props for the dropdown menu positioning and size
        MenuProps={{
          disableAutoFocusItem: true, // Crucial for search input to retain focus
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
          PaperProps: {
            sx: {
              maxHeight: { xs: 250, sm: 300 },
              minWidth: { xs: '100%', sm: 300 },
              width: { xs: '100%', sm: 400 },
              maxWidth: 'calc(100vw - 32px)',
              mt: { xs: 5, sm: 5.5 },
              overflowX: 'hidden',
            },
          },
        }}
      >
        {/* Search Input (List Subheader) */}
        {showSearch && (
          <ListSubheader
            sx={{
              lineHeight: 1,
              backgroundColor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
              p: { xs: 0.75, sm: 1 },
            }}
          >
            <TextField
              inputRef={searchInputRef}
              placeholder="Search options..."
              size="small"
              fullWidth
              onChange={(e) => setSearchTerm(e.target.value)}
              // Prevents the select menu from closing when keys are pressed in the search box
              onKeyDown={(event) => event.stopPropagation()}
              autoFocus // Focus automatically on open
              sx={{
                '& .MuiInputBase-root': {
                  borderBottom: 'none',
                },
                '& .MuiInputBase-input': {
                  py: { xs: 0.25, sm: 0.5 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            />
          </ListSubheader>
        )}
        
        {/* Render Filtered Menu Items */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {/* Checkbox indicates selection status */}
              <Checkbox checked={value.indexOf(option.value) > -1} />
              {/* List Item Text */}
              <ListItemText 
                primary={option.label} 
                primaryTypographyProps={{ 
                  style: { 
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    paddingTop: "1px",
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  } 
                }} 
              />
            </MenuItem>
          ))
        ) : (
          /* No Options Found Message */
          <MenuItem disabled sx={{ fontSize: "14px", color: "text.disabled" }}>
            No options found
          </MenuItem>
        )}
      </Select>
      
      {/* Helper and Error Text */}
      {(error || helperText) && (
        <FormHelperText error={!!error}>
          {error || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

/**
 * Prop type validation for DropdownWithCheckboxes.
 */
DropdownWithCheckboxes.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  showSearch: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  sx: PropTypes.object,
};

export default DropdownWithCheckboxes;