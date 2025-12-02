/**
 * @fileoverview GenericTableGrid Component.
 * @module GenericTableGrid
 * @description A highly customized and responsive data table component built on Material-UI DataGrid.
 * It provides features like mobile card view, custom styling, full-text search, data filtering, 
 * and custom scrollbar handling for a consistent UX across devices.
 * @author Rakshana
 * @date 31/10/2025
 * @since 1.0.0
 * 
 * @imports
 * - React hooks: For component state, memoization, effects, and API ref management.
 * - Material-UI components: For layout, card view, and responsiveness.
 * - DataGrid components: For core table functionality and toolbar features.
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useMediaQuery, Box, Typography, Card, CardContent, alpha } from "@mui/material";
import { DataGrid, useGridApiRef, GridToolbarContainer, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarExport } from "@mui/x-data-grid";

/**
 * @typedef {Object} ColumnDefinition
 * @property {string} key - The data key in the row object.
 * @property {string} label - The display name for the column header.
 * @property {string} [width] - Custom width (e.g., '150px', '2fr').
 * @property {boolean} [hideOnMobile=false] - If true, hides the column in mobile view.
 * @property {Function} [render] - Custom render function for cell content.
 * @property {string} [align='left'] - Text alignment in the cell ('left', 'center', 'right').
 * @property {boolean} [sortable=true] - Enables/disables sorting for the column.
 */

/**
 * @typedef {Object} EmptyStateConfig
 * @property {string} [icon='📭'] - The icon to display in the empty state.
 * @property {string} [message='No Data'] - The message to display in the empty state.
 */

/**
 * @typedef {Object} GenericTableGridProps
 * @property {Object[]} [data=[]] - The raw data array to display.
 * @property {ColumnDefinition[]} [columns=[]] - Array defining the table columns.
 * @property {Object[]} [filters=[]] - (Not fully implemented in the provided code logic, but defined).
 * @property {Function} [onRowClick] - Callback function when a row/card is clicked, passed the row data.
 * @property {EmptyStateConfig} [emptyStateConfig] - Configuration for the empty state UI.
 * @property {any} [externalResizeTrigger] - Prop used to manually trigger DataGrid resize (e.g., when a parent container changes size).
 * @property {boolean} [isLoading=false] - Loading state flag.
 */

/**
 * GenericTableGrid Functional Component.
 * 
 * @param {GenericTableGridProps} props - The component's props.
 * @returns {JSX.Element} The responsive table/card view component.
 */
const GenericTableGrid = ({
  data = [],
  columns = [],
  // eslint-disable-next-line
  filters = [],
  onRowClick = null,
  emptyStateConfig = { icon: "📭", message: "No Data" },
  externalResizeTrigger, 
  isLoading = false,
}) => {
  // --- State Management ---
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  // eslint-disable-next-line
  const [activeFilters, setActiveFilters] = useState({});
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [filterModel, setFilterModel] = useState({ items: [] }); 
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({}); 
  
  const isMobile = useMediaQuery("(max-width:768px)");

  const gridApiRef = useGridApiRef();
  const gridRef = useRef(null);

  // Custom Color Palette for the Grid theme
  const colors = {
    darkBlue: "#173F5F",
    mediumBlue: "#20639B",
    teal: "#3CAEA3",
    yellow: "#F6D55C",
    coral: "#ED553B",
    lightGray: "#F8FAFC",
    white: "#FFFFFF",
    border: "#E2E8F0",
    textPrimary: "#1E293B",
    textSecondary: "#64748B",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  };

  // --- Effects ---
  
  /** Hides columns marked with `hideOnMobile` when in mobile view. */
  useEffect(() => {
    const mobileVisibility = {};
    columns.forEach(col => {
      if (col.hideOnMobile) {
        mobileVisibility[col.key] = false;
      }
    });
    setColumnVisibilityModel(prev => ({ ...prev, ...mobileVisibility }));
  }, [isMobile, columns]);

  /** Debounces the external search text (if search functionality were fully utilized). */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // --- Memoized Values ---

  /** Calculates which columns should be visible based on `isMobile` and `hideOnMobile` prop. */
  const visibleColumns = useMemo(
    () => columns.filter((c) => !c.hideOnMobile || !isMobile),
    [columns, isMobile]
  );

  /** Maps raw data to add a unique `id` field for DataGrid. */
  const processedData = useMemo(() => 
    data.map((item, index) => ({
      ...item,
      id: item.id || `row-${index}`, 
    })), 
    [data]
  );

  /** Filters data based on global search, custom filters (if implemented), and DataGrid's internal filter model. */
  const filteredData = useMemo(() => {
    let filtered = processedData;

    const searchLower = debouncedSearch.toLowerCase().trim();
    if (searchLower !== "") {
      filtered = filtered.filter((item) =>
        columns.some((col) => {
          const value = item[col.key];
          if (!value) return false;
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }
    // eslint-disable-next-line
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        filtered = filtered.filter(item => String(item[key]) === value);
      }
    });

    if (filterModel.items.length > 0) {
      filtered = filtered.filter(row => {
        return filterModel.items.every(filterItem => {
          // Note: dataGridColumns is not defined here, rely on direct field access
          const value = row[filterItem.field];
          const operatorValue = filterItem.operatorValue;
          switch (filterItem.operator) {
            case 'contains':
              return String(value || '').toLowerCase().includes(operatorValue.toLowerCase());
            case 'equals':
              return String(value || '') === operatorValue;
            case 'isEmpty':
              return !value || value === '';
            case 'isNotEmpty':
              return !!value && value !== '';
            default:
              return true;
          }
        });
      });
    }

    return filtered;
  }, [processedData, debouncedSearch, activeFilters, columns, filterModel]); 

  /** Custom DataGrid Toolbar Component. */
  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ justifyContent: 'space-between', borderBottom: `1px solid ${colors.border}`, bgcolor: colors.lightGray, p: 1 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarExport />
      </Box>
    </GridToolbarContainer>
  );

  /** Debounced function to force DataGrid resize and update. */
  const debouncedResize = useMemo(() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        gridApiRef.current?.resize?.();
        gridApiRef.current?.forceUpdate?.();
      }, 150);
    };
  }, [gridApiRef]);

  /** Observes container resize to automatically force DataGrid update. */
  useEffect(() => {
    if (isLoading || !gridRef.current) return;
    const container = gridRef.current.querySelector(".MuiDataGrid-main");
    if (!container) return;
    const resizeObserver = new ResizeObserver(debouncedResize);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [isLoading, debouncedResize]);

  /** Listens to window resize events to ensure responsiveness. */
  useEffect(() => {
    const handleWindowResize = debouncedResize;
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [debouncedResize]);

  /** Triggers a resize when the external prop changes (used by parent components). */
  useEffect(() => {
    if (externalResizeTrigger !== undefined) {
      const timer = setTimeout(debouncedResize, 400);
      return () => clearTimeout(timer);
    }
  }, [externalResizeTrigger, debouncedResize]);

  /** Defines DataGrid column properties based on the simplified `columns` array. */
  const dataGridColumns = useMemo(() => {
    /** Calculates DataGrid-specific column properties (width, minWidth, flex). */
    const getColProps = (col) => {
      let baseProps = {
        flex: 1,
        minWidth: 120, 
        sortable: col.sortable !== false, 
        filterable: true,
        align: col.align || 'left',
        headerAlign: 'left',
        disableColumnMenu: false, 
      };

      if (col.width) {
        const width = col.width.toString();
        const widthMatch = width.match(/(\d+)px/);
        if (widthMatch) {
          const fixedWidth = parseInt(widthMatch[1]);
          baseProps.minWidth = fixedWidth;
          baseProps.width = fixedWidth;
          baseProps.flex = 0;
        } else if (width.includes('fr')) {
          const flexMatch = width.match(/(\d+)fr/);
          baseProps.flex = flexMatch ? parseInt(flexMatch[1]) : 1;
          baseProps.minWidth = 100;
        } else if (!isNaN(parseInt(width))) {
          const fixedWidth = parseInt(width);
          baseProps.minWidth = fixedWidth;
          baseProps.width = fixedWidth;
          baseProps.flex = 0;
        }
      }

      return baseProps;
    };

    return visibleColumns.map((col) => ({
      ...getColProps(col),
      field: col.key,
      headerName: col.label,
      renderCell: col.render
        ? (params) => col.render(params.row)
        : (params) => (
            <Typography variant="body2" sx={{ color: colors.textPrimary, fontSize: '0.875rem' }}>
              {params.value}
            </Typography>
          ),
    }));
  }, [visibleColumns, colors]);


  /** Component to display when no data or results are available. */
  const EmptyState = () => (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        color: colors.textSecondary,
        py: 5,
        bgcolor: colors.lightGray
      }}
    >
      <Box sx={{ fontSize: "64px", opacity: 0.5 }}>
        {emptyStateConfig.icon}
      </Box>
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ color: colors.textPrimary }}
      >
        {emptyStateConfig.message}
      </Typography>
    </Box>
  );

  /** The core DataGrid component wrapper for desktop view. */
  const DataGridComponent = () => (
    <Box 
      ref={gridRef} 
      sx={{ 
        flexGrow: 1, 
        minHeight: 0,
        width: '100%',
        
        // --- SCROLL FIX (Container to manage horizontal scroll) ---
        overflowX: 'auto', 
        overflowY: 'hidden',
        
        // Custom scrollbar styling
        '& *::-webkit-scrollbar': { width: '8px', height: '8px' },
        '& *::-webkit-scrollbar-track': { backgroundColor: colors.lightGray },
        '& *::-webkit-scrollbar-thumb': { backgroundColor: colors.mediumBlue, borderRadius: '10px' },
        '& *::-webkit-scrollbar-thumb:hover': { backgroundColor: colors.darkBlue },
      }}
    >
      <DataGrid
        apiRef={gridApiRef} 
        rows={filteredData}
        columns={dataGridColumns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        onRowClick={(params) => onRowClick && onRowClick(params.row)}
 
        autoHeight={false} 
        getRowHeight={() => "auto"} // Allows row height to adjust based on content
        rowBuffer={10}
        columnBuffer={5}
        columnThreshold={3}

        getRowId={(row) => row.id} 
        loading={isLoading}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel} 
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}

        slots={{ 
          toolbar: CustomToolbar,
          noRowsOverlay: EmptyState,
          noResultsOverlay: EmptyState,
        }}

        sx={{
          border: "none",
          boxShadow: 'none',
          bgcolor: colors.white,
          height: '100%', 
          
          // --- SCROLL FORCE FIX (Min Width for the internal table) ---
          minWidth: "1300px", 

          "& .MuiDataGrid-main": {
            bgcolor: colors.white,
            overflow: "visible" // Allow content to expand inside the scroll wrapper
          },

          // --- Custom Header Styling ---
          "& .MuiDataGrid-sortIcon": { color: `${colors.white} !important`, opacity: 1 },
          "& .MuiDataGrid-menuIcon .MuiSvgIcon-root": { color: `${colors.white} !important`, opacity: 1 },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            color: colors.white,
            textTransform: "uppercase",
            fontSize: "0.75rem",
          },
          "& .MuiDataGrid-columnHeader": {
            bgcolor: colors.mediumBlue,
            borderBottom: 'none',
            "&:focus": { outline: "none" },
          },
          "& .MuiDataGrid-iconButtonContainer": {
            visibility: "visible",
            width: "auto",
          },
          // -----------------------

          "& .MuiDataGrid-columnHeaders": {
            borderTopLeftRadius: '0px', 
            borderTopRightRadius: '0px',
          },
          "& .MuiDataGrid-cell": {
            py: 1.5,
            borderBottom: `1px solid ${colors.border}`,
            color: colors.textPrimary,
          },
          "& .MuiDataGrid-row": {
            cursor: onRowClick ? "pointer" : "default",
            "&:hover": {
              bgcolor: alpha(colors.mediumBlue, 0.05),
              boxShadow: colors.shadow,
            },
            transition: "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${colors.border}`,
            bgcolor: colors.lightGray,
            minHeight: '52px',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            position: "sticky",
            left: 0,
            zIndex: 2,
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: 'hidden', 
          },

          // Filter Panel Styling (ensuring white background)
          "& .MuiDataGrid-panel": { backgroundColor: "#FFFFFF !important" },
          "& .MuiDataGrid-filterForm": { backgroundColor: "#FFFFFF" },
          "& .MuiPaper-root.MuiDataGrid-paper": { backgroundColor: "#FFFFFF" },
          "& .MuiDataGrid-panel .MuiPaper-root": { backgroundColor: "#FFFFFF" },
          "& .MuiDataGrid-panel .MuiMenu-paper": { backgroundColor: "#FFFFFF" },
          "& .MuiDataGrid-panel .MuiInputBase-root": { backgroundColor: "#FFFFFF" },
        }}
      />
    </Box>
  );

  /** Mobile-specific component rendering data as responsive cards. */
  const MobileCardView = () => (
    <Box sx={{ overflowY: "auto", padding: "8px", background: colors.lightGray, flexGrow: 1 }}>
      {filteredData.length === 0 ? <EmptyState /> : (
          filteredData.map((item, idx) => (
            <Card
              key={item.id || idx}
              onClick={() => onRowClick && onRowClick(item)}
              sx={{
                borderRadius: "12px",
                margin: "12px 8px",
                boxShadow: colors.shadow,
                cursor: onRowClick ? "pointer" : "default",
                transition: "transform 0.2s",
                borderLeft: `4px solid ${colors.mediumBlue}`,
                "&:hover": { transform: "translateY(-2px)", boxShadow: colors.shadowLg },
              }}
            >
              <CardContent sx={{ 
                "&:last-child": { paddingBottom: "16px" },
                padding: "16px"
              }}>
                {visibleColumns.map((col) => (
                  <Box
                    key={col.key}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: `1px solid ${colors.border}`,
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <Typography variant="body2" fontWeight="600" color={colors.textPrimary} sx={{ flexShrink: 0 }}>
                      {col.label}
                    </Typography>
                    <Typography variant="body2" color={colors.textSecondary} sx={{ textAlign: 'right', marginLeft: '16px' }}>
                      {/* Render custom cell content or raw data */}
                      {col.render ? col.render(item) : item[col.key]}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))
      )}
    </Box>
  );

  // --- Main Render ---
  return (
    <Box
      sx={{
        background: colors.white,
        borderRadius: "16px",
        boxShadow: colors.shadowLg,
        display: "flex",
        flexDirection: "column",
        height: "100%", 
        border: "none",
        width: "100%", 
        minWidth: 0, 
        maxWidth: "100%",
      }}
    >
      {/* Conditional rendering based on loading, empty state, and device size */}
      {filteredData.length === 0 && searchText === "" && !isLoading ? (
        <EmptyState />
      ) : isMobile ? (
        <MobileCardView />
      ) : (
        <DataGridComponent />
      )}
    </Box>
  );
};

export default GenericTableGrid;