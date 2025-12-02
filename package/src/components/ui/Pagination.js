/**
 * @fileoverview Updated Pagination component
 * @module src/components/ui/Pagination
 * @author Rakshana
 * @date 24/09/2025
 * @since 2.2.0
 */

import React from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const Pagination = ({
  filteredTasks = [],              // filtered tasks array
  totalPages = 1,                  // total number of pages
  currentPage = 1,                 // current active page
  tasksPerPage = 10,               // tasks per page
  setCurrentPage,                  // handler to update current page
  setTasksPerPage,                 // handler to update tasks per page
  responsive = { isTablet: false },// responsive object
  palette = {                      // default palette
    border: "#d1d5db",
    light: "#f9fafb",
    white: "#ffffff",
    hover: "#f3f4f6",
    text: { primary: "#111827", secondary: "#6b7280" },
  },
}) => {
  const indexOfFirstTask = (currentPage - 1) * tasksPerPage;
  const indexOfLastTask = Math.min(indexOfFirstTask + tasksPerPage, filteredTasks.length);

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderTop: `1px solid ${palette.border}`,
        background: palette.light,
        flexWrap: responsive.isTablet ? "wrap" : "nowrap",
        gap: "12px",
      }}
    >
      {/* Show entries */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "14px", color: palette.text.secondary, fontWeight: 500 }}>
          Show:
        </span>
        <select
          value={tasksPerPage}
          onChange={(e) => setTasksPerPage(Number(e.target.value))}
          style={{
            padding: "6px 12px",
            border: `1px solid ${palette.border}`,
            borderRadius: "6px",
            fontSize: "14px",
            background: palette.white,
            color: palette.text.primary,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span style={{ fontSize: "14px", color: palette.text.secondary }}>entries</span>
      </div>

      {/* Entries count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          order: responsive.isTablet ? 3 : 2,
        }}
      >
        <span style={{ fontSize: "14px", color: palette.text.secondary, fontWeight: 500 }}>
          {indexOfFirstTask + 1}–{indexOfLastTask} of {filteredTasks.length}
        </span>
      </div>

      {/* Pagination buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          order: responsive.isTablet ? 2 : 3,
        }}
      >
        {/* Previous Button */}
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "8px 12px",
            border: `1px solid ${palette.border}`,
            borderRadius: "6px",
            background: palette.white,
            cursor: "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
            color: palette.text.primary,
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) e.currentTarget.style.background = palette.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = palette.white;
          }}
        >
          <IconChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) pageNum = i + 1;
          else if (currentPage <= 3) pageNum = i + 1;
          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
          else pageNum = currentPage - 2 + i;

          if (pageNum > totalPages || pageNum < 1) return null;

          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => paginate(pageNum)}
              style={{
                padding: "8px 12px",
                border: `1px solid ${isActive ? "#ed553b" : palette.border}`,
                borderRadius: "50px",
                background: isActive ? "#ed553b" : palette.white,
                color: isActive ? palette.white : palette.text.primary,
                cursor: "pointer",
                minWidth: "50px",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = palette.hover;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = palette.white;
              }}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "8px 12px",
            border: `1px solid ${palette.border}`,
            borderRadius: "6px",
            background: palette.white,
            cursor: "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
            color: palette.text.primary,
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) e.currentTarget.style.background = palette.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = palette.white;
          }}
        >
          <IconChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
