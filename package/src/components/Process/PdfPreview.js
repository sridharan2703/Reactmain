/**
 * @fileoverview OfficeOrderPreview Component.
 * @module OfficeOrderPreview
 * @description A modal component that fetches an Office Order PDF from a specific API endpoint,
 * handles decryption of the response (if necessary), converts the base64 PDF data to a Blob URL,
 * and displays the PDF within an iframe for preview.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - React hooks: for state, effects, and memoization.
 * - Cookies: for accessing the authentication token.
 * - Alerts: Custom component for displaying error messages.
 * - decryptData: Utility for decrypting API response payloads.
 */

import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import Alerts from "src/components/ui/Alerts";
import { decryptData } from "src/components/Encryption/EncryptionKey";
import PropTypes from 'prop-types';

/**
 * @typedef {Object} OfficeOrderPreviewProps
 * @property {Function} onBack - Callback function to close the modal.
 * @property {Object} requestBody - The encrypted payload request body required by the PDF API.
 */

/**
 * Converts a base64 string to a Blob object.
 * @param {string} base64 - The base64 string data.
 * @param {string} [contentType=""] - The MIME type of the data.
 * @param {number} [sliceSize=512] - The size of chunks to process the base64 string.
 * @returns {Blob} The generated Blob object.
 */
const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * OfficeOrderPreview Functional Component.
 * 
 * @param {OfficeOrderPreviewProps} props - The component's props.
 * @returns {JSX.Element} The modal component containing the PDF viewer or loading/error states.
 */
const OfficeOrderPreview = ({ onBack, requestBody }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  /**
   * Fetches the PDF content from the API, handling both direct PDF and encrypted JSON responses.
   * @async
   */
  const fetchPDFFromAPI = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing.");

      const response = await fetch("https://wftest1.iitm.ac.in:8081/pdfapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errText}`);
      }

      const contentType = response.headers.get("content-type");

      // CASE 1: Direct PDF response (no encryption)
      if (contentType?.includes("application/pdf")) {
        const pdfBlob = await response.blob();
        setPdfUrl(URL.createObjectURL(pdfBlob));
        return;
      }

      // CASE 2: Encrypted JSON response
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        if (!data.Data) throw new Error("Encrypted 'Data' missing.");

        const decryptedJson = JSON.parse(await decryptData(data.Data));

        // Attempt to find base64 string under various common keys
        const pdfBase64 =
          decryptedJson.pdf ||
          decryptedJson.PDF ||
          decryptedJson.pdf_data ||
          decryptedJson.pdf_base64;

        if (!pdfBase64) throw new Error("No PDF data found.");

        // Remove potential data URI prefix
        const cleaned = pdfBase64.replace(
          /^data:application\/pdf;base64,/,
          ""
        );

        // Convert cleaned base64 string to Blob and create a URL
        const blob = base64ToBlob(cleaned, "application/pdf");
        setPdfUrl(URL.createObjectURL(blob));
        return;
      }

      // Neither PDF nor expected JSON was returned
      throw new Error("Unexpected response from server.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [requestBody]); // Dependency on requestBody ensures a re-fetch if the request payload changes

  /** Effect to trigger PDF fetching on component mount or when requestBody changes. */
  useEffect(() => {
    // Basic validation check for the request body structure
    if (!requestBody?.Data) {
      setError("Invalid preview request.");
      setLoading(false);
      return;
    }
    fetchPDFFromAPI();
  }, [requestBody, fetchPDFFromAPI]);

  /** Effect for cleanup: Revoke the Blob URL when the component unmounts or pdfUrl changes. */
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  /**
   * Renders the main content of the modal (loading, error, or PDF viewer).
   * @returns {JSX.Element} The content JSX.
   */
  const renderContent = () => {
    if (loading) {
      return (
        <div style={styles.center}>
          <div style={styles.loader}></div>
          <p style={styles.loading}>Generating PDF preview…</p>
        </div>
      );
    }

    if (pdfUrl) {
      // remove toolbar, sidebar, navpanes (Note: the `cleanURL` variable is commented out in source)
      // const cleanURL = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;

      return (
        <div style={styles.viewerWrapper}>
          <iframe
            // src={cleanURL}
             src={`${pdfUrl}#navpanes=0&pagemode=none`} // Uses a clean URL format
            style={styles.viewer}
            title="PDF Preview"
            allow="fullscreen" // Allows fullscreen if supported by browser/viewer
          ></iframe>
        </div>
      );
    }

    return (
      <div style={styles.center}>
        <Alerts type="error" message={error || "Failed to load preview."} />
        <button style={styles.retry} onClick={fetchPDFFromAPI}>
          Try Again
        </button>
      </div>
    );
  };

  return (
    <div style={styles.overlay} onClick={onBack}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>Office Order Preview</h3>
          <button style={styles.close} onClick={onBack}>
            ✕ Close
          </button>
        </div>

        <div style={styles.body}>{renderContent()}</div>
      </div>
    </div>
  );
};

// Define PropTypes for the component
OfficeOrderPreview.propTypes = {
  onBack: PropTypes.func.isRequired,
  requestBody: PropTypes.object.isRequired,
};

/**
 * @constant {Object} styles
 * @description Inline styles object for the modal's layout and appearance.
 */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    width: "1100px",
    height: "80vh",
    background: "#fff",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  header: {
    padding: "20px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { margin: 0, fontSize: "18px", fontWeight: 600 },
  close: {
    background: "#ef4444",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "6px",
    border: 0,
    cursor: "pointer",
  },
  body: {
    flex: 1,
    background: "#f9fafb",
    overflow: "hidden",
  },
  viewerWrapper: { width: "100%", height: "100%" },
  viewer: { width: "100%", height: "100%", border: "none" },

  center: {
    textAlign: "center",
    marginTop: "80px",
  },
  // Inline styles for the loading spinner animation (requires CSS keyframes defined elsewhere)
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #eee",
    borderTop: "5px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  loading: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#666",
  },
  retry: {
    marginTop: "20px",
    background: "#2563eb",
    color: "#fff",
    padding: "10px 20px",
    border: 0,
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default OfficeOrderPreview;