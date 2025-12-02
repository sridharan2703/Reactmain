/**
 * @file CommonDataTable.jsx
 * @author Susmitha
 * @date 20-10-2025
 * @description A sophisticated, feature-rich data table component with search, sort, pagination, and keyboard navigation
 * @version 1.0.0
 *
 * @dependencies
 * - React, useState, useEffect, useMemo, useCallback, useRef
 * - @mui/material: Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, TableSortLabel, IconButton, Button, Tooltip, MenuItem
 * - @mui/icons-material: FirstPage, LastPage, ChevronLeft, ChevronRight, SearchOffOutlined, ErrorOutline
 * - src/components/ui/TopColorCard: DependentSectionCard
 *
 * @features
 * - Advanced search and filtering
 * - Multi-column sorting with visual indicators
 * - Pagination with customizable page sizes
 * - Keyboard navigation (arrow keys)
 * - Cell selection with visual feedback
 * - Responsive design for mobile/desktop
 * - Customizable header colors
 * - Empty states with meaningful messages
 * - Accessibility support
 * - Performance optimized with memoization
 *
 * @example
 * // Basic usage with minimal props
 * <CommonDataTable
 *   columns={columns}
 *   data={data}
 *   title="User Records"
 * />
 *
 * @example
 * // Customized usage with all props
 * <CommonDataTable
 *   columns={columns}
 *   data={data}
 *   title="Advanced Data Table"
 *   searchable={true}
 *   headerColor="#FF5733"
 *   sx={{ maxWidth: 1200 }}
 * />
 *
 * @example
 * // Column configuration example
 * const columns = [
 *   {
 *     key: 'id',
 *     label: 'ID',
 *     align: 'left',
 *     render: (row) => <strong>{row.id}</strong>
 *   },
 *   {
 *     key: 'name',
 *     label: 'Full Name',
 *     align: 'left'
 *   }
 * ];
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  TableSortLabel,
  IconButton,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import {
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
  SearchOffOutlined,
  ErrorOutline, // 👈 Added for no data icon
} from "@mui/icons-material";

import DependentSectionCard from "src/components/ui/TopColorCard";

/**
 * CommonDataTable Component
 *
 * A comprehensive data table component that provides advanced data presentation
 * with search, sort, pagination, and keyboard navigation capabilities.
 * Built with Material-UI for consistent design and excellent user experience.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Array} props.columns - Column configuration array
 * @param {Array} props.data - Data array to be displayed
 * @param {string} props.title - Table title displayed in header
 * @param {boolean} props.searchable - Whether to show search functionality
 * @param {string} props.headerColor - Color for table header (default: #2563EB)
 * @param {Object} props.sx - Additional Material-UI sx styles
 *
 * @returns {React.Element} Rendered data table component
 *
 * @state
 * - searchTerm: string - Current search filter term
 * - sortConfig: object - Current sort configuration {key, direction}
 * - page: number - Current page index (0-based)
 * - rowsPerPage: number - Number of rows per page
 * - selectedRow: number - Currently selected row index
 * - selectedCol: number - Currently selected column index
 *
 * @keyboard
 * - ArrowDown: Move to next row
 * - ArrowUp: Move to previous row
 * - ArrowRight: Move to next column
 * - ArrowLeft: Move to previous column
 * - Enter: Select current cell (optional)
 */
const CommonDataTable = ({
  columns = [],
  data = [],
  title,
  searchable = true,
  headerColor = "#2563EB",
  sx = {},
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /** @state {string} searchTerm - Current search filter term */
  const [searchTerm, setSearchTerm] = useState("");

  /** @state {Object} sortConfig - Current sort configuration */
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  /** @state {number} page - Current page index (0-based) */
  const [page, setPage] = useState(0);

  /** @state {number} rowsPerPage - Number of rows to display per page */
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /** @state {number|null} selectedRow - Global index of selected row */
  const [selectedRow, setSelectedRow] = useState(null);

  /** @state {number} selectedCol - Index of selected column */
  const [selectedCol, setSelectedCol] = useState(0);

  /** @ref {Object} tableContainerRef - Reference to table container for scrolling */
  const tableContainerRef = useRef(null);

  // ============================================================================
  // DATA VALIDATION & MEMOIZATION
  // ============================================================================

  /**
   * Validates and ensures data is always an array
   * @memoized
   * @returns {Array} Safe data array
   */
  const safeData = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object") {
      console.warn("⚠️ Data is not an array, converting object to array");
      return [data];
    } else {
      console.warn("⚠️ Data is not an array or object, returning empty array");
      return [];
    }
  }, [data]);

  /**
   * Checks if we have any data to display
   * @memoized
   * @returns {boolean} True if data exists
   */
  const hasData = useMemo(() => {
    return safeData.length > 0;
  }, [safeData]);

  /**
   * Filters data based on search term
   * @memoized
   * @returns {Array} Filtered data array
   */
  const filteredData = useMemo(() => {
    if (!hasData) return [];
    if (!searchTerm.trim()) return safeData;
    return safeData.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [safeData, searchTerm, hasData]);

  /**
   * Sorts data based on sort configuration
   * @memoized
   * @returns {Array} Sorted data array
   */
  const sortedData = useMemo(() => {
    if (!hasData) return [];
    if (!sortConfig.key) return filteredData;
    const arr = [...filteredData];
    arr.sort((a, b) => {
      const va = a[sortConfig.key];
      const vb = b[sortConfig.key];
      if (va == null && vb == null) return 0;
      if (va == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (vb == null) return sortConfig.direction === "asc" ? 1 : -1;
      if (va < vb) return sortConfig.direction === "asc" ? -1 : 1;
      if (va > vb) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredData, sortConfig, hasData]);

  /**
   * Paginates sorted data for current page
   * @memoized
   * @returns {Array} Paginated data array
   */
  const paginatedData = useMemo(() => {
    if (!Array.isArray(sortedData)) {
      return [];
    }
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  /**
   * Calculates total number of pages
   * @memoized
   * @returns {number} Total page count
   */
  const pageCount = useMemo(() => {
    if (!Array.isArray(sortedData) || !hasData) return 1;
    return Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  }, [sortedData, rowsPerPage, hasData]);

  /**
   * Safe data length for display calculations
   * @type {number}
   */
  const displayDataLength =
    Array.isArray(sortedData) && hasData ? sortedData.length : 0;

  // ============================================================================
  // EFFECTS & SIDE EFFECTS
  // ============================================================================

  /**
   * Adjusts page when selected row changes to ensure visibility
   */
  useEffect(() => {
    if (selectedRow === null || !hasData) return;
    const newPage = Math.floor(selectedRow / rowsPerPage);
    if (newPage !== page) setPage(newPage);
  }, [selectedRow, rowsPerPage, page, hasData]);

  /**
   * Scrolls selected cell into view when selection changes
   */
  useEffect(() => {
    if (selectedRow === null || selectedCol === null || !hasData) return;
    const selector = `[data-cell='${selectedRow}-${selectedCol}']`;
    const el = document.querySelector(selector);
    if (el && tableContainerRef.current) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedRow, selectedCol, page, rowsPerPage, hasData]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles column sorting
   * @param {string} colId - Column identifier to sort by
   */
  const handleSort = (colId) => {
    if (!hasData) return;
    setSortConfig((prev) => ({
      key: colId,
      direction:
        prev.key === colId && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  /**
   * Handles keyboard navigation for cell selection
   * @callback
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = useCallback(
    (e) => {
      // ✅ Safety check for data availability
      if (
        !hasData ||
        !Array.isArray(sortedData) ||
        !sortedData.length ||
        columns.length === 0
      )
        return;

      const totalRows = sortedData.length;
      const totalCols = columns.length;

      const curRow = selectedRow === null ? 0 : selectedRow;
      const curCol = selectedCol === null ? 0 : selectedCol;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(curRow + 1, totalRows - 1);
        setSelectedRow(next);
        setSelectedCol((prev) => Math.min(prev ?? 0, totalCols - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevRow = Math.max(curRow - 1, 0);
        setSelectedRow(prevRow);
        setSelectedCol((prev) => Math.min(prev ?? 0, totalCols - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextCol = Math.min(curCol + 1, totalCols - 1);
        setSelectedCol(nextCol);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevCol = Math.max(curCol - 1, 0);
        setSelectedCol(prevCol);
      } else if (e.key === "Enter") {
        // Optional: handle Enter key for cell actions
      }
    },
    [sortedData, columns.length, selectedRow, selectedCol, hasData]
  );

  // Add global keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ============================================================================
  // UI COMPONENTS
  // ============================================================================

  /**
   * NoDataRow Component - Displays empty state message
   * @param {Object} props - Component props
   * @param {number} props.columnsLength - Number of columns for colspan
   * @param {string} props.message - Message to display
   * @param {React.Component} props.icon - Icon component to display
   * @returns {React.Element} No data row element
   */
  const NoDataRow = ({
    columnsLength,
    message = "No Data Found",
    icon: IconComponent = SearchOffOutlined,
  }) => (
    <TableRow>
      <TableCell
        colSpan={columnsLength}
        align="center"
        sx={{
          py: 8,
          backgroundColor: "#F9FAFB",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ opacity: 0.7 }}
        >
          <IconComponent
            sx={{
              fontSize: 64,
              color: "#94A3B8",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            color="text.secondary"
            gutterBottom
          >
            {message}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message === "No Data Available"
              ? "There is no data to display in the table."
              : "No records match your search criteria."}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  /**
   * NoDataAvailable Component - For complete empty state
   * @returns {React.Element} No data available element
   */
  const NoDataAvailable = () => (
    <NoDataRow
      columnsLength={columns.length}
      message="No Data Available"
      icon={ErrorOutline}
    />
  );

  // ============================================================================
  // RENDER LOGIC
  // ============================================================================

  // Early return for no data scenario
  if (!hasData) {
    return (
      <DependentSectionCard
        color={headerColor}
        sx={{
          p: 2,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          backgroundColor: "#fff",
          ...sx,
        }}
      >
        {/* Header Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          gap={2}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          {title && (
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ color: headerColor }}
            >
              {title}
            </Typography>
          )}
          {searchable && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              disabled={!hasData}
              sx={{
                width: { xs: "100%", sm: 260 },
                borderRadius: 1,
                borderColor: "black",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#94A3B8",
                },
              }}
            />
          )}
        </Box>

        {/* Table Container */}
        <TableContainer
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 3,
            maxHeight: 520,
            overflow: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.key || col.id}
                    align={col.align || "left"}
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      backgroundColor: headerColor,
                      textTransform: "uppercase",
                      whiteSpace: "normal",
                      lineHeight: "1.2",
                      overflow: "visible",
                      border: "none",
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <NoDataAvailable />
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer: Pagination Controls (Disabled) */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={2}
          gap={1}
          sx={{ pt: 2, opacity: 0.5 }}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          {/* Page Size Selector */}
          <Box display="flex" alignItems="center" gap={1} mb={{ xs: 2, sm: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Show:
            </Typography>
            <TextField
              select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              size="small"
              disabled
              sx={{ width: 80 }}
            >
              {[5, 10, 25, 50, 100].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="body2" color="text.secondary">
              entries
            </Typography>
          </Box>

          {/* Page Info */}
          <Box display="flex" alignItems="center" gap={1} mb={{ xs: 2, sm: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              0–0 of 0
            </Typography>
          </Box>

          {/* Pagination Buttons */}
          <Box display="flex" alignItems="center" gap={1.2}>
            {[FirstPage, ChevronLeft, ChevronRight, LastPage].map(
              (Icon, index) => (
                <Tooltip
                  key={index}
                  title={
                    ["First Page", "Previous Page", "Next Page", "Last Page"][
                      index
                    ]
                  }
                >
                  <span>
                    <IconButton
                      disabled
                      size="small"
                      sx={{
                        backgroundColor: "#F1F5F9",
                        color: "#94A3B8",
                      }}
                    >
                      <Icon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )
            )}
          </Box>
        </Box>
      </DependentSectionCard>
    );
  }

  // ============================================================================
  // MAIN RENDER - WITH DATA
  // ============================================================================

  return (
    <DependentSectionCard
      color={headerColor}
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        backgroundColor: "#fff",
        ...sx,
      }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={2}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        {title && (
          <Typography variant="h6" fontWeight={600} sx={{ color: headerColor }}>
            {title}
          </Typography>
        )}
        {searchable && (
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            sx={{
              width: { xs: "100%", sm: 260 },
              borderRadius: 1,
              borderColor: "black",
            }}
          />
        )}
      </Box>

      {/* Table Container */}
      <TableContainer
        ref={tableContainerRef}
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 3,
          maxHeight: 520,
          overflow: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key || col.id}
                  align={col.align || "left"}
                  sx={{
                    fontWeight: 700,
                    color: "#fff",
                    backgroundColor: headerColor,
                    textTransform: "uppercase",
                    whiteSpace: "normal",
                    lineHeight: "1.2",
                    overflow: "visible",
                    border: "none",
                  }}
                  sortDirection={
                    sortConfig.key === (col.key || col.id)
                      ? sortConfig.direction
                      : false
                  }
                >
                  <TableSortLabel
                    active={sortConfig.key === (col.key || col.id)}
                    direction={sortConfig.direction}
                    onClick={() => handleSort(col.key || col.id)}
                    sx={{
                      color: "inherit !important",
                      "&.Mui-active": { color: "inherit" },
                      "& .MuiTableSortLabel-icon": { color: "#fff !important" },
                    }}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                const globalIndex = page * rowsPerPage + index;
                const isRowSelected = selectedRow === globalIndex;

                return (
                  <TableRow
                    key={globalIndex}
                    hover
                    data-row={globalIndex}
                    selected={isRowSelected}
                    onClick={() => {
                      setSelectedRow(globalIndex);
                      setSelectedCol(0);
                    }}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.15s",
                      backgroundColor: isRowSelected
                        ? `${headerColor}08`
                        : "inherit",
                      "&:hover": {
                        backgroundColor: `${headerColor}04`,
                      },
                    }}
                  >
                    {columns.map((col, colIndex) => {
                      const isCellSelected =
                        selectedRow === globalIndex && selectedCol === colIndex;
                      const cellKey = col.key || col.id;

                      return (
                        <TableCell
                          key={cellKey}
                          align={col.align || "left"}
                          data-cell={`${globalIndex}-${colIndex}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRow(globalIndex);
                            setSelectedCol(colIndex);
                          }}
                          sx={{
                            borderBottom: "1px solid #E5E7EB",
                            borderRight: "none",
                            borderLeft: "none",
                            outline: isCellSelected
                              ? `2px solid ${headerColor}`
                              : "none",
                            outlineOffset: isCellSelected ? "-2px" : "0px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {col.render ? col.render(row) : row[cellKey] ?? "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <NoDataRow columnsLength={columns.length} />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer: Pagination Controls */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
        gap={1}
        sx={{ pt: 2 }}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        {/* Page Size Selector */}
        <Box display="flex" alignItems="center" gap={1} mb={{ xs: 2, sm: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Show:
          </Typography>
          <TextField
            select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            size="small"
            sx={{ width: 80 }}
          >
            {[5, 10, 25, 50, 100].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="text.secondary">
            entries
          </Typography>
        </Box>

        {/* Page Info Display */}
        <Box display="flex" alignItems="center" gap={1} mb={{ xs: 2, sm: 0 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {displayDataLength === 0
              ? "0–0 of 0"
              : `${page * rowsPerPage + 1}–${Math.min(
                  (page + 1) * rowsPerPage,
                  displayDataLength
                )} of ${displayDataLength}`}
          </Typography>
        </Box>

        {/* Pagination Navigation */}
        <Box display="flex" alignItems="center" gap={1.2}>
          {/* First Page Button */}
          <Tooltip title="First Page">
            <span>
              <IconButton
                onClick={() => setPage(0)}
                disabled={page === 0}
                size="small"
                sx={{
                  backgroundColor: page === 0 ? "#F1F5F9" : `${headerColor}08`,
                  color: page === 0 ? "#94A3B8" : headerColor,
                }}
              >
                <FirstPage fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {/* Previous Page Button */}
          <Tooltip title="Previous Page">
            <span>
              <IconButton
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                size="small"
                sx={{
                  backgroundColor: page === 0 ? "#F1F5F9" : `${headerColor}08`,
                  color: page === 0 ? "#94A3B8" : headerColor,
                }}
              >
                <ChevronLeft fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {/* Page Number Buttons */}
          {Array.from({ length: pageCount }, (_, i) => i)
            .slice(Math.max(0, page - 2), Math.min(pageCount, page + 3))
            .map((num) => (
              <Button
                key={num}
                size="small"
                onClick={() => setPage(num)}
                variant="outlined"
                sx={{
                  minWidth: 36,
                  px: 1,
                  fontSize: "0.875rem",
                  textTransform: "none",
                  fontWeight: num === page ? 700 : 400,
                  borderColor: headerColor,
                  color: num === page ? "#fff" : headerColor,
                  backgroundColor: num === page ? headerColor : "#fff",
                  "&:hover": {
                    backgroundColor:
                      num === page ? headerColor : `${headerColor}08`,
                    borderColor: headerColor,
                  },
                }}
              >
                {num + 1}
              </Button>
            ))}

          {/* Next Page Button */}
          <Tooltip title="Next Page">
            <span>
              <IconButton
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
                size="small"
                sx={{
                  backgroundColor:
                    page >= pageCount - 1 ? "#F1F5F9" : `${headerColor}08`,
                  color: page >= pageCount - 1 ? "#94A3B8" : headerColor,
                }}
              >
                <ChevronRight fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {/* Last Page Button */}
          <Tooltip title="Last Page">
            <span>
              <IconButton
                onClick={() => setPage(pageCount - 1)}
                disabled={page >= pageCount - 1}
                size="small"
                sx={{
                  backgroundColor:
                    page >= pageCount - 1 ? "#F1F5F9" : `${headerColor}08`,
                  color: page >= pageCount - 1 ? "#94A3B8" : headerColor,
                }}
              >
                <LastPage fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </DependentSectionCard>
  );
};

export default CommonDataTable;
