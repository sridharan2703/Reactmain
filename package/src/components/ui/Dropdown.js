
/**
 * @file Dropdown.jsx
 * @fileoverview
 * A fully reusable, MUI-styled dropdown component that visually aligns
 * exactly with TextField inputs. Supports floating labels, clear button,
 * search filtering, and consistent spacing.
 *
 * @component
 * @version 2.0.1
 * @date 2025-11-04
 * @author Susmitha
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Popper,
  Paper,
  MenuItem,
  InputAdornment,
  IconButton,
  ClickAwayListener,
  ListItemText,
} from "@mui/material";
import { ArrowDropDown, Clear } from "@mui/icons-material";

const Dropdown = ({
  label,
  options = [],
  value = null,
  onChange,
  showSearch = true,
  showClear = true,
  disabled = false,
  error = "",
  helperText = "",
  sx = {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value?.label || "");
  const [filtered, setFiltered] = useState(options);

  const inputRef = useRef(null);

  /** Filter dropdown options when typing */
  useEffect(() => {
    if (!showSearch) return;
    if (!search) {
      setFiltered(options);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        options.filter((opt) => opt.label.toLowerCase().includes(lower))
      );
    }
  }, [search, options, showSearch]);

  /** Handle dropdown toggle */
  const handleToggle = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  /** Handle selection */
  const handleSelect = (option) => {
    onChange(option);
    setSearch(option.label);
    setOpen(false);
  };

  /** Handle clear */
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearch("");
    setFiltered(options);
  };

  /** Close dropdown when clicking outside */
  const handleClickAway = (event) => {
    if (anchorEl && !anchorEl.contains(event.target)) {
      setOpen(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div style={{ width: "100%" }}>
        {/* MUI TextField styled input */}
        <TextField
          inputRef={inputRef}
          fullWidth
          label={label} // ✅ Dynamic floating label
          value={search}
          onClick={handleToggle}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          disabled={disabled}
          error={!!error}
          helperText={error || helperText}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "52px", // ✅ Matches standard TextField height
              borderRadius: "6px",
            },
            "& .MuiInputLabel-root": {
              fontSize: "14px",
            },
            "& .MuiOutlinedInput-input": {
              padding: "14px 40px 10px 12px", // ✅ identical alignment to TextField
              fontSize: "15px",
            },
            ...sx,
          }}
          InputProps={{
            readOnly: !showSearch,
            endAdornment: (
              <>
                {showClear && search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      edge="end"
                      sx={{ mr: -1 }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )}
                <InputAdornment position="end">
                  <ArrowDropDown
                    sx={{
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      color: "text.secondary",
                    }}
                  />
                </InputAdornment>
              </>
            ),
          }}
        />

        {/* Dropdown Menu */}
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          style={{ zIndex: 1300, width: anchorEl?.offsetWidth || "100%" }}
        >
          <Paper
            elevation={4}
            sx={{
              mt: 0.5,
              borderRadius: "6px",
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {filtered.length > 0 ? (
              filtered.map((option) => (
                <MenuItem
                  key={option.value}
                  selected={option.value === value?.value}
                  onClick={() => handleSelect(option)}
                  sx={{
                    fontSize: "15px",
                    py: 1,
                    "&.Mui-selected": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))
            ) : (
              <MenuItem
                disabled
                sx={{ fontSize: "14px", color: "text.disabled" }}
              >
                No options found
              </MenuItem>
            )}
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string.isRequired, // ✅ Required for proper floating label
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  showSearch: PropTypes.bool,
  showClear: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  sx: PropTypes.object,
};

export default Dropdown;
