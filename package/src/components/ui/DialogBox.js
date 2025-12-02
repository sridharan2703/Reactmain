/**
 * @fileoverview Styles and component for a modal dialog box.
 * Supports overlay background, header with title and close button,
 * content area, and footer with action buttons.
 * @module src/components/ui/DialogBox
 * @author Rakshana
 * @date 12/09/2025
 * @since 1.0.0
 */

import React from "react";
import Button from "./Button"; // Assuming Button component is in the same folder

/**
 * Styles for the DialogBox component.
 * Includes overlay, dialog container, header, content, footer, and buttons.
 *
 * 📝 Example usage of styles:
 * Input:
 * <div style={dialogStyles.overlay}>
 *   <div style={dialogStyles.dialog}>Content</div>
 * </div>
 *
 * Output:
 * A centered white dialog box over a semi-transparent dark background.
 *
 * @type {Object<string, React.CSSProperties | Object>}
 */
const dialogStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "500px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#9CA3AF",
  },
  content: {
    fontSize: "16px",
    color: "#374151",
  },
  footer: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
};

/**
 * DialogBox component for displaying modal dialogs with title, content, and action buttons.
 *
 * 📝 Example:
 * Input:
 * <DialogBox isOpen={true} title="Confirm Delete" onClose={() => console.log("Closed")}>
 *   Are you sure you want to delete this item?
 * </DialogBox>
 *
 * Output:
 * A modal dialog centered on screen with title "Confirm Delete",
 * content text, "Cancel" and "Confirm" buttons, and an overlay background.
 *
 * @param {Object} props - Props passed to the DialogBox component.
 * @param {boolean} props.isOpen - Determines if the dialog is visible.
 * @param {function(): void} props.onClose - Callback fired when the dialog is closed.
 * @param {string} props.title - Title text displayed in the dialog header.
 * @param {React.ReactNode} props.children - Content to display inside the dialog.
 * @returns {JSX.Element|null} Rendered DialogBox component or null if closed.
 */
const DialogBox = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={dialogStyles.overlay} onClick={onClose}>
      <div style={dialogStyles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={dialogStyles.header}>
          <h3 style={dialogStyles.title}>{title}</h3>
          <button onClick={onClose} style={dialogStyles.closeButton}>
            &times;
          </button>
        </div>
        <div style={dialogStyles.content}>{children}</div>
        <div style={dialogStyles.footer}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onClose}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
