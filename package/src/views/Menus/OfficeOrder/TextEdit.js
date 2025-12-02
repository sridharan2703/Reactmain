

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


// import React, { useEffect, useState } from "react";
// import ReactQuill, { Quill } from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import QuillBetterTable from "quill-better-table";
// import "quill-better-table/dist/quill-better-table.css";

// Quill.register(
//   {
//     "modules/better-table": QuillBetterTable,
//   },
//   true
// );

// const TextEdit = ({ value = "", onChange }) => {
//   const [editorContent, setEditorContent] = useState(value);

//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ color: [] }, { background: [] }],
//       [{ align: [] }],
//       [{ list: "bullet" }, { list: "ordered" }],
//       ["blockquote", "code-block"],
//       ["link", "image"],
//       ["clean"],
//       ["table"],
//     ],
//     "better-table": {
//       operationMenu: {
//         items: {
//           unmergeCells: {
//             text: "Unmerge cells",
//           },
//         },
//       },
//     },
//     keyboard: {
//       bindings: QuillBetterTable.keyboardBindings,
//     },
//   };

//   return (
//     <div style={{ width: '100%', maxWidth: '1200px' }}>
//       <style>
//         {`
//           .ql-editor table {
//             width: 80% !important;
//             table-layout: auto;
//             border-collapse: collapse;
//           }
//           .ql-editor th {
//             text-align: center !important;
//             min-width: 100px;
//             padding: 8px;
//             border: 1px solid #bb1c1cff;
//             font-weight: bold;
//             background-color: #c41313ff;
//           }
//           .ql-editor td {
//             text-align: center !important;
//             min-width: 100px;
//             padding: 8px;
//             border: 1px solid #b40707ff;
//           }
//           .ql-container {
//             font-size: 14px;
//           }
//         `}
//       </style>
//       <ReactQuill
//         value={editorContent}
//         onChange={(content) => {
//           setEditorContent(content);
//           onChange(content);
//           let correctedContent = content;

//           if (correctedContent.includes('<ol>')) {
//              correctedContent = correctedContent.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>');
//           }
//         }}
//         modules={modules}
//         theme="snow"
//         placeholder="Type or paste HTML content with tables here..."
//       />
//     </div>
//   );
// };

// export default TextEdit;



// import React, { useState, useEffect } from "react";
// import ReactQuill, { Quill } from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import QuillBetterTable from "quill-better-table";
// import "quill-better-table/dist/quill-better-table.css";

// // Register the better-table module
// Quill.register(
//   {
//     "modules/better-table": QuillBetterTable,
//   },
//   true
// );

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
//       ["clean"],
//       ["table"], // Add table button to toolbar
//     ],
//     "better-table": {
//       operationMenu: {
//         items: {
//           unmergeCells: {
//             text: "Unmerge cells",
//           },
//         },
//       },
//     },
//     keyboard: {
//       bindings: QuillBetterTable.keyboardBindings,
//     },
//     clipboard: {
//       matchVisual: false,
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

//         /* Enhanced table styles with better-table support */
//         .custom-quill .ql-editor table {
//           border-collapse: collapse !important;
//           width: 100% !important;
//           table-layout: auto !important;
//           margin: 1em 0 !important;
//         }
        
//         .custom-quill .ql-editor table th,
//         .custom-quill .ql-editor table td {
//           border: 1px solid #000 !important;
//           padding: 8px 12px !important;
//           text-align: center !important;
//           vertical-align: middle !important;
//           word-wrap: break-word !important;
//           min-width: 100px !important;
//         }
        
//         .custom-quill .ql-editor table th {
//           font-weight: bold !important;
//           background-color: #f3f4f6 !important;
//         }
        
//         .custom-quill .ql-editor table thead {
//           background-color: #f3f4f6 !important;
//         }
        
//         .custom-quill .ql-editor table tbody td {
//           background-color: #ffffff !important;
//         }
        
//         .custom-quill .ql-editor table tr {
//           border: 1px solid #000 !important;
//         }
//       `}</style>

//       <ReactQuill
//         theme="snow"
//         value={editorContent}
//         onChange={(content) => {
//           setEditorContent(content);  
          
//           // Convert ordered lists to unordered if needed
//           let correctedContent = content;
//           if (correctedContent.includes('<ol>')) {
//             correctedContent = correctedContent.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>');
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
// import ReactQuill, { Quill } from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import QuillBetterTable from "quill-better-table";
// import "quill-better-table/dist/quill-better-table.css";

// // Register the better-table module
// Quill.register(
//   {
//     "modules/better-table": QuillBetterTable,
//   },
//   true
// );

// const TextEdit = ({ value = "", onChange, readOnly = false }) => {
//   const [editorContent, setEditorContent] = useState(value);
  
//   useEffect(() => {
//     setEditorContent(value);
//   }, [value]);
  
//   const modules = readOnly
//     ? {} // Disable modules when read-only to prevent interactions
//     : {
//         toolbar: [
//           [{ font: [] }, { size: [] }],
//           ["bold", "italic", "underline", "strike"],
//           [{ color: [] }, { background: [] }],
//           [{ align: [] }],
//           [{ list: "bullet" }, { list: "ordered" }],
//           ["blockquote", "code-block"],
//           ["link", "image"],
//           ["clean"],
//           ["table"], // Add table button to toolbar
//         ],
//         "better-table": {
//           operationMenu: {
//             items: {
//               unmergeCells: {
//                 text: "Unmerge cells",
//               },
//             },
//           },
//         },
//         keyboard: {
//           bindings: QuillBetterTable.keyboardBindings,
//         },
//         clipboard: {
//           matchVisual: false,
//         },
//       };

//   const quillClassName = readOnly ? "custom-quill custom-quill-readonly" : "custom-quill";

//   return (
//     <div>
//       <style>{`
//         .custom-quill {
//           border: 1px solid #d1d5db;
//           border-radius: 8px;
//           overflow: hidden;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//         }
//         .custom-quill-readonly {
//           background-color: #f9fafb;
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
//           font-size: 14px;
//           line-height: 1.5;
//           color: #374151;
//         }
//         .custom-quill-readonly .ql-editor {
//           background-color: #f9fafb;
//           cursor: default;
//         }
//         .custom-quill .ql-editor.ql-blank::before {
//           color: #9ca3af;
//           font-style: italic;
//         }
//         .custom-quill .ql-toolbar {
//           border: none;
//           border-bottom: 1px solid #d1d5db;
//           background-color: #f9fafb;
//         }
//         .custom-quill-readonly .ql-toolbar {
//           display: none; /* Hide toolbar when read-only */
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
//         .custom-quill .ql-editor li {
//           margin-bottom: 4px;
//         }

//         /* Enhanced table styles with better-table support */
//         .custom-quill .ql-editor table {
//           border-collapse: collapse !important;
//           width: 100% !important;
//           table-layout: auto !important;
//           margin: 1em 0 !important;
//           font-size: 14px;
//         }
        
//         .custom-quill .ql-editor table th,
//         .custom-quill .ql-editor table td {
//           border: 1px solid #d1d5db !important;
//           padding: 10px 12px !important;
//           text-align: left !important;
//           vertical-align: top !important;
//           word-wrap: break-word !important;
//           min-width: 80px !important;
//           background-color: #ffffff !important;
//         }
        
//         .custom-quill .ql-editor table th {
//           font-weight: 600 !important;
//           background-color: #f3f4f6 !important;
//           color: #374151 !important;
//           border-color: #d1d5db !important;
//         }
        
//         .custom-quill .ql-editor table thead {
//           background-color: #f3f4f6 !important;
//         }
        
//         .custom-quill .ql-editor table tbody td {
//           background-color: #ffffff !important;
//           color: #374151 !important;
//         }
        
//         .custom-quill .ql-editor table tr {
//           border: none !important;
//         }
        
//         .custom-quill .ql-editor table tr:nth-child(even) td {
//           background-color: #f9fafb !important;
//         }
        
//         /* Link styles */
//         .custom-quill .ql-editor a {
//           color: #3b82f6 !important;
//           text-decoration: none !important;
//         }
//         .custom-quill .ql-editor a:hover {
//           text-decoration: underline !important;
//         }
        
//         /* Blockquote and code block */
//         .custom-quill .ql-editor blockquote {
//           border-left: 4px solid #d1d5db !important;
//           margin: 1em 0 !important;
//           padding-left: 1em !important;
//           background-color: #f9fafb !important;
//           font-style: italic !important;
//         }
        
//         .custom-quill .ql-editor code {
//           background-color: #f3f4f6 !important;
//           padding: 2px 4px !important;
//           border-radius: 3px !important;
//           font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
//         }
        
//         .custom-quill .ql-editor pre {
//           background-color: #1f2937 !important;
//           color: #f9fafb !important;
//           padding: 1em !important;
//           border-radius: 6px !important;
//           overflow-x: auto !important;
//         }
        
//         /* Image styles */
//         .custom-quill .ql-editor img {
//           max-width: 100% !important;
//           height: auto !important;
//           border-radius: 4px !important;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
//         }
//       `}</style>

//       <ReactQuill
//         theme="snow"
//         value={editorContent}
//         onChange={(content) => {
//           setEditorContent(content);  
          
//           // Convert ordered lists to unordered if needed (legacy fix, consider removing if not necessary)
//           let correctedContent = content;
//           if (correctedContent.includes('<ol>')) {
//             correctedContent = correctedContent.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>');
//           }
          
//           onChange(correctedContent);
//         }}
//         readOnly={readOnly}
//         className={quillClassName}
//         modules={modules}
//         placeholder={readOnly ? "" : "Type your content here..."}
//       />
//     </div>
//   );
// };

// export default TextEdit;


import React, { useState, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";

// Register the better-table module
Quill.register(
  {
    "modules/better-table": QuillBetterTable,
  },
  true
);

const TextEdit = ({ value = "", onChange, readOnly = false }) => {
  const [editorContent, setEditorContent] = useState(value);
  
  useEffect(() => {
    setEditorContent(value);
  }, [value]);
  
  const modules = readOnly
    ? {} // Disable modules when read-only to prevent interactions
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
          ["table"], // Add table button to toolbar
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

  const quillClassName = readOnly ? "custom-quill custom-quill-readonly" : "custom-quill";

  return (
    <div>
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
          display: none; /* Hide toolbar when read-only */
        }
        
        /* List styles */
        .custom-quill .ql-editor ul, 
        .custom-quill .ql-editor ol {
          padding-left: 1.5em !important;
          margin-top: 5px !important;
          margin-bottom: 5px !important;
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

        /* Enhanced table styles with better-table support */
        .custom-quill .ql-editor table {
          border-collapse: collapse !important;
          width: 100% !important;
          table-layout: auto !important;
          margin: 1em 0 !important;
          font-size: 14px;
        }
        
        .custom-quill .ql-editor table th,
        .custom-quill .ql-editor table td {
          border: 1px solid #d1d5db !important;
          padding: 10px 12px !important;
          text-align: left !important;
          vertical-align: top !important;
          word-wrap: break-word !important;
          min-width: 80px !important;
          background-color: #ffffff !important;
        }
        
        .custom-quill .ql-editor table th {
          font-weight: 600 !important;
          background-color: #f3f4f6 !important;
          color: #374151 !important;
          border-color: #d1d5db !important;
          text-align: center !important;
        }

        /* Force center alignment for header row in case headers use td */
        .custom-quill .ql-editor table tr:first-child th,
        .custom-quill .ql-editor table tr:first-child td {
          text-align: center !important;
        }
        
        .custom-quill .ql-editor table thead {
          background-color: #f3f4f6 !important;
        }
        
        .custom-quill .ql-editor table tbody td {
          background-color: #ffffff !important;
          color: #374151 !important;
        }
        
        .custom-quill .ql-editor table tr {
          border: none !important;
        }
        
        .custom-quill .ql-editor table tr:nth-child(even) td {
          background-color: #f9fafb !important;
        }
        
        /* Link styles */
        .custom-quill .ql-editor a {
          color: #3b82f6 !important;
          text-decoration: none !important;
        }
        .custom-quill .ql-editor a:hover {
          text-decoration: underline !important;
        }
        
        /* Blockquote and code block */
        .custom-quill .ql-editor blockquote {
          border-left: 4px solid #d1d5db !important;
          margin: 1em 0 !important;
          padding-left: 1em !important;
          background-color: #f9fafb !important;
          font-style: italic !important;
        }
        
        .custom-quill .ql-editor code {
          background-color: #f3f4f6 !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
        }
        
        .custom-quill .ql-editor pre {
          background-color: #1f2937 !important;
          color: #f9fafb !important;
          padding: 1em !important;
          border-radius: 6px !important;
          overflow-x: auto !important;
        }
        
        /* Image styles */
        .custom-quill .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 4px !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>

      <ReactQuill
        theme="snow"
        value={editorContent}
        onChange={(content) => {
          setEditorContent(content);  
          
          // Convert ordered lists to unordered if needed (legacy fix, consider removing if not necessary)
          let correctedContent = content;
          if (correctedContent.includes('<ol>')) {
            correctedContent = correctedContent.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>');
          }
          
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