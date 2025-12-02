/**
 * @fileoverview A rich text editor component you built to allow users to type formatted text.
 * @module TextEdit
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 */

import React, { useState, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";

// -----------------------------------------------------------------------------
// Register Quill Better Table Plugin
// -----------------------------------------------------------------------------
Quill.register(
  {
    "modules/better-table": QuillBetterTable,
  },
  true
);

/**
 * TextEdit Component
 *
 * Provides a feature-rich text editor with:
 * - Formatting tools (fonts, sizes, lists, bold/italic, alignment, links, images)
 * - Table support including merge/unmerge
 * - Read-only display mode for previewing content
 * - Auto-correction to convert ordered lists (<ol>) to unordered lists (<ul>)
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.value=""] - Initial HTML content for the editor.
 * @param {Function} props.onChange - Callback fired whenever the content changes.
 * @param {boolean} [props.readOnly=false] - Enables preview mode (no toolbar, no editing).
 *
 * @returns {JSX.Element} Rendered Quill editor.
 */
const TextEdit = ({ value = "", onChange, readOnly = false }) => {

  /**
   * Local state to hold editor content.
   * Mirrors the value prop and updates when parent changes it.
   */
  const [editorContent, setEditorContent] = useState(value);

  /**
   * Sync editor content when parent component updates `value`.
   */
  useEffect(() => {
    setEditorContent(value);
  }, [value]);

  /**
   * Quill modules configuration.
   * Toolbar is disabled entirely in read-only mode.
   */
  const modules = readOnly
    ? {} // Read-only → Disable all interactive modules
    : {
        toolbar: [
          [{ font: [] }, { size: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: "bullet" }, { list: "ordered" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
          ["table"], // Table insertion button
        ],
        "better-table": {
          operationMenu: {
            items: {
              unmergeCells: {
                text: "Unmerge cells",
              },
            },
          },
        },
        keyboard: {
          bindings: QuillBetterTable.keyboardBindings,
        },
        clipboard: {
          matchVisual: false,
        },
      };

  // Assign CSS class based on mode
  const quillClassName = readOnly ? "custom-quill custom-quill-readonly" : "custom-quill";

  return (
    <div>
      {/* -------------------------------------------------------------------
          Custom Styling for Quill Editor
      ------------------------------------------------------------------- */}
      <style>{`
        .custom-quill {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .custom-quill-readonly {
          background-color: #f9fafb;
        }
        .custom-quill .ql-container {
          border: none;
          min-height: 250px;
          max-height: 500px;
          overflow-y: auto;
        }
        .custom-quill .ql-editor {
          min-height: 250px;
          max-height: 500px;
          padding: 12px 15px;
          font-size: 14px;
          line-height: 1.5;
          color: #374151;
        }
        .custom-quill-readonly .ql-editor {
          background-color: #f9fafb;
          cursor: default;
        }
        .custom-quill .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: italic;
        }
        .custom-quill .ql-toolbar {
          border: none;
          border-bottom: 1px solid #d1d5db;
          background-color: #f9fafb;
        }
        .custom-quill-readonly .ql-toolbar {
          display: none;
        }

        /* List styling */
        .custom-quill .ql-editor ul, 
        .custom-quill .ql-editor ol {
          padding-left: 1.5em !important;
          margin: 5px 0 !important;
        }
        .custom-quill .ql-editor ul {
          list-style-type: disc !important;
        }
        .custom-quill .ql-editor ol {
          list-style-type: decimal !important;
        }
        .custom-quill .ql-editor li {
          margin-bottom: 4px;
        }

        /* Table styling */
        .custom-quill .ql-editor table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1em 0 !important;
        }
        .custom-quill .ql-editor table th,
        .custom-quill .ql-editor table td {
          border: 1px solid #d1d5db !important;
          padding: 10px 12px !important;
          text-align: left !important;
          background-color: #ffffff !important;
          min-width: 80px !important;
        }
        .custom-quill .ql-editor table th {
          background-color: #f3f4f6 !important;
          font-weight: 600 !important;
          text-align: center !important;
        }
        .custom-quill .ql-editor table tr:nth-child(even) td {
          background-color: #f9fafb !important;
        }

        /* Link styling */
        .custom-quill .ql-editor a {
          color: #3b82f6 !important;
          text-decoration: none !important;
        }
        .custom-quill .ql-editor a:hover {
          text-decoration: underline !important;
        }

        /* Blockquote styling */
        .custom-quill .ql-editor blockquote {
          border-left: 4px solid #d1d5db !important;
          margin: 1em 0 !important;
          padding-left: 1em !important;
          background-color: #f9fafb !important;
          font-style: italic !important;
        }

        /* Code block styling */
        .custom-quill .ql-editor code {
          background-color: #f3f4f6 !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
        }
        .custom-quill .ql-editor pre {
          background-color: #1f2937 !important;
          color: #f9fafb !important;
          padding: 1em !important;
          border-radius: 6px !important;
          overflow-x: auto !important;
        }

        /* Image styling */
        .custom-quill .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 4px !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }
      `}</style>

      {/* -------------------------------------------------------------------
          ReactQuill Editor instance
      ------------------------------------------------------------------- */}
      <ReactQuill
        theme="snow"
        value={editorContent}
        /**
         * Handle content changes.
         * Also performs auto-correction for <ol> → <ul>.
         */
        onChange={(content) => {
          setEditorContent(content);

          let correctedContent = content;
          if (correctedContent.includes('<ol>')) {
            correctedContent = correctedContent
              .replace(/<ol>/g, '<ul>')
              .replace(/<\/ol>/g, '</ul>');
          }

          // Send sanitized content to parent
          onChange(correctedContent);
        }}
        readOnly={readOnly}
        className={quillClassName}
        modules={modules}
        placeholder={readOnly ? "" : "Type your content here..."}
      />
    </div>
  );
};

export default TextEdit;
