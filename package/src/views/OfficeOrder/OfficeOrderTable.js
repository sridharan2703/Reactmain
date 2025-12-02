/**
 * @file OfficeOrderTable.js
 * @fileoverview
 * @description A React component that displays a table of office orders with filtering, searching, and PDF preview capabilities.
 * Handles fetching encrypted data from APIs, rendering dynamic columns based on filters, and managing form modals for editing.
 * Supports viewing official/user copies of PDFs, template selection, and status updates with confirmation dialogs.
 *
 * @component
 * @module src/views/OfficeOrder/OfficeOrderTable
 * @version 1.0.0
 * @date 26-11-2025
 * @author Susmitha
 * @modifiedby Rakshana
 */


import React, { useState, useEffect } from "react";
import GenericTableGrid from "src/components/ui/TableGrid";
import EmployeeVisitForm from "./EmployeeVisitForm.js";
import SaveandHold from "src/views/OfficeOrder/OfficeOrderSaveandHold.js";
import Cookies from "js-cookie";
import FancyCircularLoader from "src/components/ui/Loader";
import { HostName } from "src/assets/host/Host";
import Swal from "sweetalert2";
import {
  sendEncryptedData,
  decryptData,
  encryptPayloadForGo,
  validateJsonData,
} from "src/components/Encryption/EncryptionKey";
import { Box } from "@mui/material";
import { BackButton } from "src/components/ui/Button.js";


/**
 * OfficeOrderTable component.
 * Renders a responsive table grid for office orders, with options to filter by status, search records,
 * view PDFs, and open forms for editing or continuing saved holds.
 *
 * @param {Function} onBack - Callback function to handle navigation back to the previous view.
 * @param {Object} order - Office order data object (currently unused in the component).
 * @param {string} [filter=''] - Filter type for the table data: 'saveandhold', 'ongoing', or 'complete'.
 * @param {boolean} [isSidebarOpen=false] - Flag to indicate if the sidebar is open, affecting table layout.
 * @returns {JSX.Element} The rendered table or form/modal UI based on state.
 */
const OfficeOrderTable = ({ onBack, order, filter, isSidebarOpen = false }) => {
  /**
   * Color palette object for consistent theming across the component.
   * Defines primary colors, text variants, and UI states like hover and borders.
   *
   * @type {Object}
   * @property {string} primary - Main brand color (#20639B).
   * @property {string} darkBlue - Darker shade for gradients (#173F5F).
   * @property {string} teal - Accent color for secondary actions (#3CAEA3).
   * @property {string} yellow - Warning color (#F6D55C).
   * @property {string} coral - Error/danger color (#ED553B).
   * @property {string} success - Success color (#3CAEA3).
   * @property {string} warning - Warning color (#F6D55C).
   * @property {string} border - Border color (#E2E8F0).
   * @property {string} hover - Hover background (#F9FAFB).
   * @property {string} white - White background (#FFFFFF).
   * @property {Object} text - Text color variants.
   *   @property {string} primary - Primary text (#1E293B).
   *   @property {string} secondary - Secondary text (#64748B).
   */
  const palette = {
    primary: "#20639B",
    darkBlue: "#173F5F",
    teal: "#3CAEA3",
    yellow: "#F6D55C",
    coral: "#ED553B",
    success: "#3CAEA3",
    warning: "#F6D55C",
    border: "#E2E8F0",
    hover: "#F9FAFB",
    white: "#FFFFFF",
    text: { primary: "#1E293B", secondary: "#64748B" },
  };

  /**
   * State for storing the list of office order records fetched from the API.
   * Each record includes details like employee ID, order number, status, etc.
   *
   * @type {Array<Object>}
   */
  const [records, setRecords] = useState([]);

  /**
   * State for the currently selected record to open in a form modal.
   *
   * @type {Object|null}
   */
  const [selectedRecord, setSelectedRecord] = useState(null);

  /**
   * Loading state for API fetches and operations like PDF generation.
   *
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Progress percentage for the loading spinner (0-100).
   *
   * @type {number}
   */
  const [progress, setProgress] = useState(0);

  /**
   * Object to store dropdown options for template types per record ID.
   *
   * @type {Object}
   */
  const [dropdownOptions, setDropdownOptions] = useState({});

  /**
   * Error message state for displaying user-facing errors.
   *
   * @type {string}
   */
  const [error, setError] = useState("");

  /**
   * Trigger state to refresh the table data on changes (e.g., after form submission).
   *
   * @type {number}
   */
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * URL for the currently open PDF object (blob URL).
   *
   * @type {string|null}
   */
  const [pdfUrl, setPdfUrl] = useState(null);

  /**
   * Loading state specifically for PDF generation.
   *
   * @type {boolean}
   */
  const [generating, setGenerating] = useState(false);

  /**
   * Type of PDF being viewed (e.g., 'Official Copy' or 'User Copy').
   *
   * @type {string|null}
   */
  const [pdfType, setPdfType] = useState(null);

  /**
   * Trigger for resizing the table grid on data or loading changes.
   *
   * @type {number}
   */
  const [resizeTrigger, setResizeTrigger] = useState(0);

  /**
   * Search term for filtering records in the table.
   *
   * @type {string}
   */
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Session ID from cookies for API authentication.
   *
   * @type {string}
   */
  const sessionId = Cookies.get("session_id");

  /**
   * JWT token from cookies for API authorization headers.
   *
   * @type {string}
   */
  const jwtToken = Cookies.get("HRToken");

  /**
   * Refreshes the table by incrementing the refresh trigger, causing a re-fetch of data.
   * Used after successful form submissions or status updates.
   *
   * @returns {void}
   */
  const refreshTable = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  /**
   * Closes the PDF viewer modal by revoking the blob URL and resetting states.
   * Prevents memory leaks from unreleased object URLs.
   *
   * @returns {void}
   */
  const closePdfViewer = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      setPdfType(null);
    }
  };

  /**
   * useEffect hook to handle Escape key press for closing the PDF modal
   * and manage body overflow to prevent scrolling during modal open.
   * Adds/removes global event listener on mount/unmount.
   *
   * @returns {Function} Cleanup function to remove event listener and reset overflow.
   */
  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape" && pdfUrl) {
        closePdfViewer();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    if (pdfUrl) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [pdfUrl]);

  /**
   * useEffect hook to trigger table resize when loading state or record count changes.
   * Ensures the grid layout updates dynamically.
   *
   * @returns {void}
   */
  useEffect(() => {
    setResizeTrigger((prev) => prev + 1);
  }, [loading, records.length]);

  /**
   * Converts a base64-encoded string to a Blob object for PDF handling.
   * Used when the API returns PDF data as base64 in JSON.
   *
   * @param {string} base64 - The base64-encoded string.
   * @param {string} mimeType - The MIME type for the blob (e.g., 'application/pdf').
   * @returns {Blob} The created Blob object.
   */
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  /**
   * Fetches and displays a PDF for a given office order number and template type.
   * Handles encrypted API requests, decryption, and various response formats (binary PDF or JSON with base64).
   * Opens a modal with the PDF iframe on success; shows error dialog on failure.
   *
   * @param {string} order_no - The office order number/reference to fetch PDF for.
   * @param {string} templatetype - The type of template: 'officecopy' or 'usercopy'.
   * @returns {Promise<void>}
   */
  const handleViewPDF = async (order_no, templatetype) => {
    try {
      setGenerating(true);
      setError("");
      setPdfUrl(null);
      setPdfType(null);

      const session_id = Cookies.get("session_id");
      const jwtToken = Cookies.get("HRToken");

      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!order_no) throw new Error("Order number is missing.");
      if (!session_id) throw new Error("Session ID is missing.");
      const payloadToEncrypt = {
        token: "HRFGVJISOVp1fncC",
        templatetype,
        officeorderhistorypdf: order_no,
        P_id: session_id,
      };
      const encryptedPayload = await encryptPayloadForGo(payloadToEncrypt);
      const requestBody = { Data: encryptedPayload };
      const response = await fetch(
        "https://wftest1.iitm.ac.in:7007/OfficeOrder_Historypdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch PDF: ${response.status} ${response.statusText}`
        );
      }
      const contentType = response.headers.get("content-type");

      let pdfObjectUrl;

      if (contentType && contentType.includes("application/pdf")) {

        const pdfBlob = await response.blob();
        pdfObjectUrl = URL.createObjectURL(pdfBlob);
      } else if (contentType && contentType.includes("application/json")) {
        console.log("🔐 JSON response with encrypted data detected");

        const jsonResponse = await response.json();

        if (!jsonResponse.Data) {
          throw new Error("Encrypted response missing 'Data' field.");
        }
        const decryptedText = await decryptData(jsonResponse.Data);
        const cleanedText = decryptedText.replace(/^\uFEFF/, "").trim();

        let pdfBase64;
        try {
          const decryptedJson = JSON.parse(cleanedText);
          if (decryptedJson.Status !== 200) {
            throw new Error(
              decryptedJson.message || "Server returned non-200 status."
            );
          }
          pdfBase64 =
            decryptedJson.pdf_data ||
            decryptedJson.pdf_base64 ||
            decryptedJson.PDF ||
            decryptedJson.pdf;

          if (!pdfBase64) {
            throw new Error("No PDF data found in JSON response.");
          }
        } catch (jsonError) {
          console.warn("⚠ Response is not JSON, treating as direct base64");
          pdfBase64 = cleanedText;
        }
        const cleanedBase64 = pdfBase64.replace(
          /^data:application\/pdf;base64,/,
          ""
        );

        if (!cleanedBase64) {
          throw new Error("No PDF data found after decryption.");
        }
        const pdfBlob = base64ToBlob(cleanedBase64, "application/pdf");
        pdfObjectUrl = URL.createObjectURL(pdfBlob);
      } else {
        try {
          const blob = await response.blob();
          if (blob.type.includes("pdf") || blob.size > 100) {
            pdfObjectUrl = URL.createObjectURL(blob);
          } else {
            throw new Error("Response is not a valid PDF");
          }
        } catch (blobError) {
          try {
            const jsonResponse = await response.json();
            throw new Error(
              `Unexpected JSON response: ${JSON.stringify(jsonResponse)}`
            );
          } catch (jsonError) {
            throw new Error(
              `Unknown response format. Content-Type: ${contentType}`
            );
          }
        }
      }
      if (!pdfObjectUrl) {
        throw new Error("Failed to generate PDF URL");
      }

      setPdfUrl(pdfObjectUrl);
      setPdfType(templatetype === "officecopy" ? "Official Copy" : "User Copy");
    } catch (err) {
      console.error("PDF fetch error:", err);
      Swal.fire({
        icon: "error",
        title: "PDF Error",
        text: err.message || "Failed to load PDF.",
      });
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Inline styles object for the PDF viewer modal.
   * Defines layout, colors, and transitions for overlay, content, header, etc.
   *
   * @type {Object}
   */
  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 50,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(3px)",
    },
    modalContent: {
      width: "90%",
      height: "85%",
      maxWidth: "1200px",
      backgroundColor: palette.white,
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
      transform: pdfUrl ? "scale(1)" : "scale(0.9)",
      transition: "transform 0.3s ease-out",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 28px",
      borderBottom: "1px solid #e5e7eb",
    },
    modalTitle: {
      margin: 0,
      fontSize: "18px",
      fontWeight: "600",
    },
    modalActions: {
      display: "flex",
      gap: "10px",
    },
    closeButton: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      background: "#ef4444",
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
    },
    modalBody: {
      flex: 1,
      overflowY: "auto",
      padding: "0",
      background: "#f9fafb",
    },
    iframe: {
      width: "100%",
      height: "100%",
      border: "none",
    },
  };

  /**
   * PDFViewerModal sub-component.
   * Renders a modal overlay with an iframe for previewing the PDF.
   * Handles click-to-close on overlay and includes a close button.
   *
   * @param {string} pdfUrl - The blob URL of the PDF to display.
   * @param {string} title - The title for the modal (e.g., 'Official Copy').
   * @param {Function} onClose - Callback to close the modal.
   * @returns {JSX.Element} The modal JSX.
   */
  const PDFViewerModal = ({ pdfUrl, title, onClose }) => {
    /**
     * Renders the iframe content for the PDF.
     *
     * @returns {JSX.Element} The iframe element.
     */
    const renderContent = () => (
      <iframe
        src={pdfUrl}
        title={title}
        style={styles.iframe}
        frameBorder="0"
        allowFullScreen
      />
    );

    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Office Order Preview ({title})</h3>
            <div style={styles.modalActions}>
              <button onClick={onClose} style={styles.closeButton}>
                ✕ Close
              </button>
            </div>
          </div>
          <div style={styles.modalBody}>{renderContent()}</div>
        </div>
      </div>
    );
  };

  /**
   * Array of column definitions for the GenericTableGrid.
   * Each column specifies key, label, width, sorting, alignment, and custom render functions.
   * Dynamically adjusted based on filter (e.g., adds 'Pending' or 'Template Type' column).
   *
   * @type {Array<Object>}
   */
  let columns = [
    {
      key: "id",
      label: "Id",
      width: "80px",
      sortable: true,
      type: "number",
      align: "left",
      render: (item) => (
        <div style={{ fontWeight: "50", color: palette.primary }}>
          {item.id}
        </div>
      ),
    },
    {
      key: "employeeid",
      label: "Emp Id",
      width: "70px",
      sortable: true,
      align: "center",
    },
    {
      key: "coverpageno",
      label: "CoverPageNo",
      width: "180px",
      sortable: true,
      align: "center",
    },
    {
      key: "order_no",
      label: "Reference Num",
      width: "250px",
      sortable: true,
      align: "center",
    },
    {
      key: "applicant",
      label: "Applicant",
      width: "1fr",
      sortable: true,
      align: "left",
      render: (item) => {
        const parts = (item.applicant || "").split(" / ");
        const name = parts[0] || "--";
        const designation = parts[2] || "";
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontWeight: "600" }}>{name}</div>
            {designation && (
              <div style={{ fontSize: "12px", color: palette.text.secondary }}>
                {designation}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "department",
      label: "Department",
      width: "1fr",
      sortable: true,
      align: "left",
    },
    {
      key: "claimtype",
      label: "ClaimType",
      width: "1fr",
      sortable: true,
      align: "center",
    },
    {
      key: "status",
      label: "Status",
      width: "100px",
      sortable: true,
      align: "center",
    },
  ];

  /**
   * Conditionally adds a column based on the filter type.
   * For 'ongoing': Adds 'Pending' column showing assigned user.
   * For others: Adds 'Template Type' dropdown for selection.
   *
   * @returns {void}
   */
  if (filter === "ongoing") {
    columns.push({
      key: "pendingwith",
      label: "Pending",
      width: "120px",
      sortable: true,
      align: "center",
      render: (item) => (item.assignedto ? item.assignedto : "--"),
    });
  } else {
    columns.push({
      key: "templateType",
      label: "Template Type",
      width: "180px",
      sortable: true,
      align: "left",
   render: (item) => (
        <select
          value={item.templateType || ""}
          onChange={(e) => {
            const selectedValue = e.target.value;
            handleTemplateChange(item.id, selectedValue);
          }}
          onFocus={async (e) => {
            e.stopPropagation(); // CRITICAL: Stop propagation to prevent row click
            if (dropdownOptions[item.id] && dropdownOptions[item.id].length > 0)
              return;

            try {
              const body = {
                employeeid: item.employeeid,
                coverpageno: item.coverpageno,
                token: "HRFGVJISOVp1fncC",
                session_id: sessionId,
              };

              const encryptedPayload = await encryptPayloadForGo(body);

              const resp = await fetch(
                `${HostName}/OfficeOrder_DropdownValuesHandler`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                  },
                  body: JSON.stringify({ Data: encryptedPayload }),
                }
              );

              const encData = await resp.json();

              const decrypted = await decryptData(encData.Data ?? encData.data);

              const parsed = validateJsonData(decrypted) ? decrypted : {};

              const records =
                parsed?.Data?.Records ||
                parsed?.data?.Records ||
                parsed?.Data?.records ||
                parsed?.records ||
                [];

              const options = records.map((rec) => ({
                Id: rec.Id || rec.id,
                value: rec.dropdown_value || rec.dropdownValue || rec.value,
                label: rec.dropdown_value || rec.dropdownValue || rec.value,
              }));

              setDropdownOptions((prev) => ({
                ...prev,
                [item.id]: options,
              }));
            } catch (err) {
              console.error("Dropdown fetch error:", err);
            }
          }}
          onClick={(e) => e.stopPropagation()} // Keep this to prevent row click
          style={{
            width: "100%",
            padding: "6px",
            borderRadius: "6px",
            border: `1px solid ${palette.border}`,
            fontSize: "13px",
          }}
        >
          <option value="">Select</option>
          {(dropdownOptions[item.id] || []).map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ),
    });
  }

  /**
   * Adds the 'Generated Template' action column with PDF view buttons (only for 'complete' filter).
   * Buttons trigger PDF fetch for official/user copies.
   *
   * @returns {void}
   */
  columns.push({
    key: "generatedtemplate",
    label: "Generated Template",
    width: "160px",
    sortable: false,
    align: "center",
    render: (item) => {
      if (filter === "complete") {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              alignItems: "center",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation(); // CRITICAL: Stop propagation to prevent row click
                handleViewPDF(item.order_no, "officecopy");
              }}
              style={{
                backgroundColor: palette.primary,
                color: palette.white,
                border: `1px solid ${palette.primary}`,
                borderRadius: "6px",
                cursor: generating ? "wait" : "pointer",
                padding: "6px 10px",
                fontSize: "14px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 5px rgba(32, 99, 155, 0.3)",
                transition: "all 0.3s ease",
                opacity: generating ? 0.6 : 1,
              }}
              title="View Office Order Copy"
              disabled={generating}
            >
              📜
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // CRITICAL: Stop propagation to prevent row click
                handleViewPDF(item.order_no, "usercopy");
              }}
              style={{
                backgroundColor: palette.teal,
                color: palette.white,
                border: `1px solid ${palette.teal}`,
                borderRadius: "6px",
                cursor: generating ? "wait" : "pointer",
                padding: "6px 10px",
                fontSize: "14px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 5px rgba(60, 190, 163, 0.3)",
                transition: "all 0.3s ease",
                opacity: generating ? 0.6 : 1,
              }}
              title="View User Copy"
              disabled={generating}
            >
              📄
            </button>
          </div>
        );
      }
      return "--";
    },
  });

  /**
   * Array of filter configurations for the table (status filter).
   *
   * @type {Array<Object>}
   */
  const filters = [
    {
      key: "status",
      label: "All Status",
      options: [
        { value: "Approved", label: "Approved" },
        { value: "Pending", label: "Pending" },
        { value: "Rejected", label: "Rejected" },
      ],
    },
  ];

  /**
   * Filters the records array based on the search term.
   * Searches across all record values (case-insensitive).
   *
   * @type {Array<Object>}
   */
  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  /**
   * useEffect hook to fetch office order details from the API on mount or dependency changes.
   * Encrypts payload, handles decryption, formats records, and updates state.
   * Uses different endpoints based on filter type (task vs. visit details).
   *
   * Dependencies: jwtToken, sessionId, filter, refreshTrigger.
   *
   * @returns {void}
   */
  useEffect(() => {
    /**
     * Async function to fetch and process office order data.
     *
     * @returns {Promise<void>}
     */
    const fetchOfficeOrderDetails = async () => {
      if (!jwtToken) return;

      setLoading(true);
      setProgress(0);

      try {
        const isTaskFilter = ["saveandhold", "ongoing", "complete"].includes(
          filter
        );
        const apiEndpoint = isTaskFilter
          ? "/OfficeOrder_taskvisitdetails"
          : "/OfficeOrder_visitdetails";

        const body = isTaskFilter
          ? {
              token: "HRFGVJISOVp1fncC",
              session_id: sessionId,
              status: filter,
            }
          : {
              token: "HRFGVJISOVp1fncC",
              session_id: sessionId,
            };

        const encryptedPayload = await encryptPayloadForGo(body);

        const response = await fetch(`${HostName}${apiEndpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ Data: encryptedPayload }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        const decrypted = await decryptData(result.Data ?? result.data);
        const parsed = validateJsonData(decrypted) ? decrypted : {};
        const records = parsed?.Data?.Records ?? [];

        const formattedRecords = records.map((item, idx) => ({
          id: item.visit_id || `${idx + 1}`,
          employeeid: item.employee_id || item.employeeid || "--",
          coverpageno: item.cover_page_no || item.coverpageno || "--",
          order_no: item.order_no || "--",
          applicant:
            item.employee_name ||
            item.facultyname ||
            item.facultydetails ||
            "--",
          designation: item.designation || "--",
          department: item.department || "--",
          destination: `${item.citytown || item.city_town || ""}, ${
            item.country || ""
          }`,
          status: item.status_description || item.status || "--",
          claimtype: item.claim_type || item.claimtype || "",
          visitfrom: item.visit_from || item.visitfrom,
          visitto: item.visit_to || item.visitto,
          natureOfvisit:
            item.nature_of_visit || item.natureofparticipation_value || "--",
          country: item.country,
          city: item.citytown || item.city_town,
          assignedto: item.assign_to,
          signingauthority: item.to_column,
          processtype: item.process_type || item.processtype,
          task_id: item.task_id || null,
          process_id: item.process_id || item.processid || 1,
        }));

        setRecords(formattedRecords);
        setProgress(100);
      } catch (error) {
        console.error("❌ Error fetching/decrypting:", error);
        setRecords([]);
        setProgress(50);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeOrderDetails();
  }, [jwtToken, sessionId, filter, refreshTrigger]);

  /**
   * Handles changes to the template type dropdown selection.
   * Updates record state, sets selected record for form, and shows confirmation for 'saveandhold' deletions.
   * Infers process type (e.g., Amendment, Cancellation) from selection.
   *
   * @param {string|number} id - The ID of the record being updated.
   * @param {string} value - The selected template type value.
   * @returns {void}
   */
  const handleTemplateChange = (id, value) => {
    const record = records.find((r) => r.id === id);
    const selectedOption = dropdownOptions[id]?.find(
      (opt) => opt.value === value
    );

    if (filter === "saveandhold" && selectedOption?.Id === "2" && value) {
      Swal.fire({
        title: "Are you sure?",
        text: "The existing data will be deleted. Do you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ED553B",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          handleConfirmYes(id, value, record);
        } else {
          handleConfirmNo(id, record);
        }
      });
      return;
    }

    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, templateType: value } : rec))
    );

    if (value) {
      let processtype;
      const lowerValue = value.toLowerCase();

      if (lowerValue.includes("amendment")) {
        processtype = "Amendment";
      } else if (lowerValue.includes("cancellation")) {
        processtype = "Cancellation";
      }

      setSelectedRecord({
        ...record,
        templateType: value,
        processtype: processtype,
      });
    }
  };

  /**
   * Handles confirmation for deleting existing data in 'saveandhold' mode.
   * Fetches deleted status ID, updates record status via API, refreshes table, and opens new form.
   *
   * @param {string|number} id - The ID of the record.
   * @param {string} value - The new template type value.
   * @param {Object} record - The record object being updated.
   * @returns {Promise<void>}
   */
  const handleConfirmYes = async (id, value, record) => {
    try {
      setLoading(true);
      setError("");

      const jwtToken = Cookies.get("HRToken");
      const sessionId = Cookies.get("session_id");
      if (!jwtToken) throw new Error("Authentication token missing.");
      if (!sessionId) throw new Error("Session ID missing.");

      const statusPayload = {
        statusdescription: "Deleted",
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
      };

      const statusResponse = await sendEncryptedData(
        "/Statusmasternew",
        statusPayload
      );
      const decryptedStatus = await decryptData(
        statusResponse.Data ?? statusResponse.data
      );
      const validStatusData = validateJsonData(decryptedStatus);
      const deletedStatusId =
        validStatusData?.Data?.Records?.[0]?.statusid ?? 1;

      const updatePayload = {
        token: "HRFGVJISOVp1fncC",
        session_id: sessionId,
        p_coverpageno: record.coverpageno,
        p_employeeid: record.employeeid,
        p_taskstatusid: String(deletedStatusId),
        p_updatedby: "DELETEBYUSER",
        p_updatedon: new Date().toISOString(),
      };

      const updateResponse = await sendEncryptedData(
        "/OfficeOrder_statusupdate",
        updatePayload
      );
      const decryptedUpdate = await decryptData(
        updateResponse.Data ?? updateResponse.data
      );

      console.log("Update response:", decryptedUpdate);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Previous data has been removed. Opening a new form...",
        timer: 100,
        showConfirmButton: false,
      });

      refreshTable();

      setTimeout(() => {
        setSelectedRecord({ ...record, templateType: value });
      }, 100);
    } catch (error) {
      console.error("Error in confirm YES:", error);
      Swal.fire("Error", error.userMessage || "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles cancellation of deletion in 'saveandhold' mode.
   * Resets template to 'Continue Editing' and shows info dialog.
   *
   * @param {string|number} id - The ID of the record.
   * @param {Object} record - The record object.
   * @returns {void}
   */
  const handleConfirmNo = (id, record) => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, templateType: "Continue Editing" } : rec
      )
    );
    setSelectedRecord({ ...record, templateType: "Continue Editing" });

    Swal.fire({
      icon: "info",
      title: "Cancelled",
      text: "You can continue editing your existing data.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  /**
   * Closes the form modal and optionally refreshes the table.
   * Resets template type in records state.
   *
   * @param {boolean} [shouldRefresh=false] - Whether to trigger a table refresh.
   * @returns {void}
   */
  const handleCloseForm = (shouldRefresh) => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === selectedRecord?.id ? { ...rec, templateType: "" } : rec
      )
    );
    if (shouldRefresh === true) {
      console.log(
        "Form submitted successfully. Refreshing table data via onClose(true)."
      );
      refreshTable();
    }
    setSelectedRecord(null);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {pdfUrl && (
        <PDFViewerModal
          pdfUrl={pdfUrl}
          title={pdfType}
          onClose={closePdfViewer}
        />
      )}

      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
            gap: "20px",
            color: palette.primary,
            fontSize: "18px",
          }}
        >
          <FancyCircularLoader progress={progress} size={80} strokeWidth={8} />
        </div>
      ) : selectedRecord ? (
        selectedRecord.templateType === "Continue Editing" ? (
          <SaveandHold
            record={selectedRecord}
            onClose={handleCloseForm}
            onSuccess={refreshTable}
          />
        ) : (
          <EmployeeVisitForm
            record={selectedRecord}
            onClose={handleCloseForm}
            onSuccess={refreshTable}
          />
        )
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BackButton
              onClick={onBack}
              style={{
                padding: "10px 20px",
                background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.darkBlue} 100%)`,
                color: palette.white,
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 8px rgba(32, 99, 155, 0.2)",
                transition: "all 0.3s ease",
              }}
            >
              <span>Back</span>
            </BackButton>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border: `1px solid ${palette.border}`,
                width: "300px",
                fontSize: "14px",
                outline: "none",
                backgroundColor: palette.white,
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = palette.primary)}
              onBlur={(e) => (e.target.style.borderColor = palette.border)}
            />
          </div>

          <GenericTableGrid
            data={filteredRecords}
            columns={columns}
            filters={filters}
            palette={palette}
            externalResizeTrigger={resizeTrigger}
            isSidebarOpen={isSidebarOpen}
            emptyStateConfig={{ icon: "📭", message: "No Records Found" }}
          />
        </Box>
      )}
    </Box>
  );
};

export default OfficeOrderTable;