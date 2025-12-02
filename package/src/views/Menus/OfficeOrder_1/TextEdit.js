
// import React, { useState, useEffect } from "react";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";

// const TextEdit = ({ value = "", onChange }) => {
//   const [editorContent, setEditorContent] = useState(value);
//   useEffect(() => {
//     setEditorContent(value);
//   }, [value]);
  
//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ color: [] }, { background: [] }],
//       [{ align: [] }],
//       [{ list: "bullet" }, { list: "ordered" }], // Bullet (unordered) first, then ordered
//       ["blockquote", "code-block"],
//       ["link", "image"],
//       ["clean"],
//     ],
//     clipboard: {
//       matchVisual: false, // Prevents Quill from modifying pasted content styling
//     },
//   };

//   return (
//     <div>
//       <style>{`
//         .custom-quill {
//           border: 1px solid #d1d5db;
//           border-radius: 8px;
//           overflow: hidden;
//         }
//         .custom-quill .ql-container {
//           border: none;
//           min-height: 250px;
//           max-height: 500px;
//           overflow-y: auto;
//         }
//         .custom-quill .ql-editor {
//           min-height: 250px;
//           max-height: 500px;
//           padding: 12px 15px;
//         }
//         .custom-quill .ql-toolbar {
//           border: none;
//           border-bottom: 1px solid #d1d5db;
//           background-color: #f9fafb;
//         }
        
//         /* Ensure bulletins (list items) are correctly styled in the editor */
//         .custom-quill .ql-editor ul, 
//         .custom-quill .ql-editor ol {
//           padding-left: 1.5em !important; /* Ensure space for markers */
//           margin-top: 5px !important;
//           margin-bottom: 5px !important;
//         }

//         /* Explicitly set list style for safety */
//         .custom-quill .ql-editor ul {
//             list-style-type: disc !important;
//         }
//         .custom-quill .ql-editor ol {
//             list-style-type: decimal !important;
//         }
//         /* END: List styles enhancement */

//         /* Enhanced table styles */
//         .custom-quill .ql-editor table {
//           border-collapse: collapse !important;
//           width: 100% !important;
//           margin: 1em 0 !important;
//           border: 1px solid #000 !important;
//         }
        
//         .custom-quill .ql-editor table thead {
//           background-color: #f3f4f6 !important;
//         }
        
//         .custom-quill .ql-editor table th,
//         .custom-quill .ql-editor table td {
//           border: 1px solid #000 !important;
//           padding: 8px 12px !important;
//           text-align: center !important;
//           vertical-align: middle !important;
//           word-wrap: break-word !important;
//         }
        
//         .custom-quill .ql-editor table th {
//           font-weight: bold !important;
//           background-color: #f3f4f6 !important;
//         }
        
//         .custom-quill .ql-editor table tbody td {
//           background-color: #ffffff !important;
//         }
        
//         .custom-quill .ql-editor table tr {
//           border: 1px solid #000 !important;
//         }
        
//         .custom-quill .ql-editor table col {
//           width: auto !important;
//         }
//       `}</style>

//       <ReactQuill
//         theme="snow"
//         value={editorContent}
//         onChange={(content) => {
//           setEditorContent(content);
          
//           let correctedContent = content;

//           if (correctedContent.includes('<ol>')) {
//              correctedContent = correctedContent.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>');
//           }
          
//           onChange(correctedContent);
//         }}
//         className="custom-quill"
//         modules={modules}
//         placeholder="Type your content here..."
//       />
//     </div>
//   );
// };

// export default TextEdit;  


// import React, { useState, useEffect } from "react";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { Quill } from 'react-quill-new';
// import TableUI from 'quill-table-ui';
// Quill.register('modules/tableUI', TableUI);

// const TextEdit = ({ value = "", onChange }) => {
//   const [editorContent, setEditorContent] = useState(value);

//   useEffect(() => {
//     setEditorContent(value);
//   }, [value]);

//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ color: [] }, { background: [] }],
//       [{ align: [] }],
//       [{ list: "bullet" }, { list: "ordered" }],
//       ["blockquote", "code-block"],
//       ["link", "image"],
//       [{ table: true }], // Make sure table is enabled in toolbar
//       ["clean"],
//     ],
//     clipboard: {
//       matchVisual: false,
//     },
//     table: true, // Enable table module
//   };

//   return (
//     <div>
//       <style>{`
//         .custom-quill {
//           border: 1px solid #d1d5db;
//           border-radius: 8px;
//           overflow: hidden;
//         }
//         .custom-quill .ql-container {
//           border: none;
//           min-height: 250px;
//           max-height: 500px;
//           overflow-y: auto;
//         }
//         .custom-quill .ql-editor {
//           min-height: 250px;
//           max-height: 500px;
//           padding: 12px 15px;
//         }
//         .custom-quill .ql-toolbar {
//           border: none;
//           border-bottom: 1px solid #d1d5db;
//           background-color: #f9fafb;
//         }

//         /* List styles */
//         .custom-quill .ql-editor ul, 
//         .custom-quill .ql-editor ol {
//           padding-left: 1.5em !important;
//           margin-top: 5px !important;
//           margin-bottom: 5px !important;
//         }
//         .custom-quill .ql-editor ul {
//           list-style-type: disc !important;
//         }
//         .custom-quill .ql-editor ol {
//           list-style-type: decimal !important;
//         }

//         /* ===== Enhanced Table Styles ===== */
//         .custom-quill .ql-editor table {
//           border-collapse: collapse;
//           width: 100%;
//           margin: 1em 0;
//           table-layout: fixed;
//         }

//         .custom-quill .ql-editor table td,
//         .custom-quill .ql-editor table th {
//           border: 1px solid #000;
//           padding: 8px 12px;
//           text-align: left;
//           vertical-align: top;
//           min-width: 100px;
//         }

//         .custom-quill .ql-editor table th {
//           background-color: #f2f2f2;
//           font-weight: bold;
//           text-align: center;
//         }

//         /* Remove Quill's default table styling */
//         .custom-quill .ql-editor td.ql-editor-toolbar,
//         .custom-quill .ql-editor th.ql-editor-toolbar {
//           border: 1px solid #000 !important;
//         }

//         /* Handle table selection and focus */
//         .custom-quill .ql-editor .ql-table-selected {
//           outline: 2px solid #1976d2;
//         }

//         /* Ensure proper table display */
//         .custom-quill .ql-editor .ql-table {
//           display: table;
//           width: 100%;
//         }
//       `}</style>

//       <ReactQuill
//         theme="snow"
//         value={editorContent}
//         onChange={(content) => {
//           setEditorContent(content);
//           let correctedContent = content;

//           // Convert ordered lists to unordered if needed
//           if (correctedContent.includes("<ol>")) {
//             correctedContent = correctedContent
//               .replace(/<ol>/g, "<ul>")
//               .replace(/<\/ol>/g, "</ul>");
//           }

//           onChange(correctedContent);
//         }}
//         className="custom-quill"
//         modules={modules}
//         placeholder="Type your content here..."
//         formats={[
//           "header", "font", "size",
//           "bold", "italic", "underline", "strike", "blockquote",
//           "list", "bullet", "ordered", "indent",
//           "link", "image", "video", "table", // Include table in formats
//           "color", "background", "align", "code-block"
//         ]}
//       />
//     </div>
//   );
// };

// export default TextEdit;

import React, { useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";

Quill.register(
  {
    "modules/better-table": QuillBetterTable,
  },
  true
);

const TextEdit = ({ value = "", onChange }) => {
  const [editorContent, setEditorContent] = useState(value);

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "bullet" }, { list: "ordered" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
      ["table"],
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
  };

  return (
    <ReactQuill
 value={editorContent}
 onChange={(content) => {
 setEditorContent(content);
 onChange(content);
 }}
 modules={modules}
 theme="snow"
 placeholder="Type or paste HTML content with tables here..."
 // ADD THIS STYLE PROP 👇
 style={{ width: '100%', maxWidth: '1200px' }} // Example: set max width or a fixed width
 />
  );
};

export default TextEdit;
