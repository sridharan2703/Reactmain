// // import React, { useEffect, useState } from "react";
// // import Cookies from "js-cookie";
// // import DOMPurify from "dompurify";
// // import header from "./header.png";
// // import { QRCodeCanvas } from "qrcode.react";
// // import { HostName } from "src/assets/host/Host";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import { jsPDF } from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import NotoSansDevanagari from "src/views/OfficeOrder/Fonts/NotoSansDevanagari-Regular.js";
// // import NotoSansDevanagariBold from "src/views/OfficeOrder/Fonts/NotoSansDevanagari-Bold.js";

// // const OfficeOrderPreview = ({
// //   onBack,
// //   coverpageno,
// //   formData,
// //   bodyData,
// //   employeeid,
// // }) => {
// //   const [parsedData, setParsedData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [generating, setGenerating] = useState(false);
// //   const [signatureImage, setSignatureImage] = useState(null);
// //   const sessionId = Cookies.get("session_id");

// //   const formatDate = (dateStr) => {
// //     if (!dateStr) return "";
// //     const d = new Date(dateStr);
// //     if (isNaN(d)) return dateStr;
// //     return `${String(d.getDate()).padStart(2, "0")}-${String(
// //       d.getMonth() + 1
// //     ).padStart(2, "0")}-${d.getFullYear()}`;
// //   };

// // const fetchSignatureImage = async (role) => {
// //     if (!role) {
// //       setSignatureImage(null);
// //       return;
// //     }

// //     try {
// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");

// //       const body = {
// //         token: "HRFGVJISOVp1fncC",
// //         session_id: sessionId,
// //         role: role,
// //       };

// //       const response = await fetch(
// //         "https://wftest1.iitm.ac.in:7000/OfficeOrder_download",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(body),
// //         }
// //       );

// //       if (!response.ok) throw new Error("Failed to fetch signature: " + response.statusText);

// //       // --- START OF FIX ---
// //       const contentType = response.headers.get("content-type");

// //       if (contentType && contentType.includes("image")) {
// //         // If the response is an image, read it as a blob and convert to a data URL
// //         const imageBlob = await response.blob();
// //         const reader = new FileReader();
// //         reader.onloadend = () => {
// //           setSignatureImage(reader.result); // reader.result will be a data URL (e.g., data:image/jpeg;base64,...)
// //         };
// //         reader.onerror = (e) => {
// //           console.error("FileReader error while converting image blob:", e);
// //           setSignatureImage(null);
// //         };
// //         reader.readAsDataURL(imageBlob);
// //         return; // Exit as the signature is now handled
// //       } else if (contentType && contentType.includes("application/json")) {
// //         // If it's JSON, proceed with the original logic (decryption)
// //         const encryptedData = await response.json();
// //         const encryptedPayload = encryptedData.Data ?? encryptedData.data;
// //         if (!encryptedPayload) throw new Error("Encrypted data missing from JSON payload.");

// //         const decryptedString = await decryptData(encryptedPayload);
// //         const parsedData = validateJsonData(decryptedString);

// //         const signature = parsedData?.signature || parsedData?.digital_signature;
// //         if (signature) {
// //           // Assuming the signature string from JSON is already base64 or a data URL
// //           setSignatureImage(signature);
// //         } else {
// //           console.warn("Signature or digital_signature not found in decrypted JSON data.");
// //         }
// //       } else {
// //         // Handle unexpected content types for robust error reporting
// //         const textResponse = await response.text();
// //         console.error(`Received unexpected content type from signature API: ${contentType}. Response text: ${textResponse.substring(0, 200)}`);
// //         throw new Error(`Unexpected content type from signature API: ${contentType}. Expected image or JSON.`);
// //       }
// //       // --- END OF FIX ---

// //     } catch (err) {
// //       console.error("Signature fetch error:", err);
// //       setSignatureImage(null);
// //     }
// //   };

// //   useEffect(() => {
// //     const buildPreview = async () => {
// //       try {
// //         setLoading(true);
// //         setError("");

// //         // Function to process the HTML content for both API and props body data
// //         const processBodyContent = (htmlContent) => {
// //           let content = htmlContent;

// //           content = content.replace(
// //             /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z?))/g,
// //             (m) => formatDate(m)
// //           );

// //           const tempDiv = document.createElement("div");
// //           tempDiv.innerHTML = content;

// //           // Remove signature/registrar/kul-sachiv text from paragraphs
// //           tempDiv.querySelectorAll("p").forEach((p) => {
// //             const txt = p.textContent.trim().toLowerCase();
// //             if (
// //               (txt.includes("deputy registrar") ||
// //                 txt.includes("sign") ||
// //                 txt.includes("कुलसचिव")) &&
// //               p.textContent.length < 100
// //             )
// //               p.remove();
// //           });

// //           // Remove specific travel agency divs
// //           tempDiv.querySelectorAll("div").forEach((div) => {
// //             const txt = div.textContent.trim().toLowerCase();
// //             if (
// //               txt.includes("balmer lawrie") ||
// //               txt.includes("ashok travels") ||
// //               txt.includes("irctc")
// //             ) {
// //               div.remove();
// //             }
// //           });

// //           // START OF FIX: Remove the merged header row and insert a standard <thead> for preview
// //           tempDiv.querySelectorAll("table").forEach((table) => {
// //             const allRows = Array.from(table.querySelectorAll("tr"));
// //             if (allRows.length > 0) {
// //               const firstRowCells = Array.from(
// //                 allRows[0].querySelectorAll("td, th")
// //               );
// //               // Check if the first row is the merged header based on content
// //               const isMergedHeaderRow = firstRowCells.some((cell) => {
// //                 const cellText = cell.textContent.trim().toLowerCase();
// //                 return (
// //                   cellText.includes("leave") &&
// //                   cellText.includes("from") &&
// //                   cellText.includes("to")
// //                 );
// //               });

// //               if (isMergedHeaderRow) {
// //                 allRows[0].remove(); // Remove the row with "Leave Type From To" for cleaner preview

// //                 // Insert a standard <thead> for correct preview styling and headers
// //                 const thead = document.createElement("thead");
// //                 const headerRow = document.createElement("tr");
// //                 ["Leave Type", "From", "To"].forEach((text) => {
// //                   const th = document.createElement("th");
// //                   th.textContent = text;
// //                   headerRow.appendChild(th);
// //                 });
// //                 thead.appendChild(headerRow);
// //                 table.prepend(thead);

// //                 // Ensure all remaining rows are wrapped in <tbody> if not already
// //                 if (!table.querySelector('tbody')) {
// //                     const tbody = document.createElement('tbody');
// //                     Array.from(table.children).forEach(child => {
// //                         if (child.tagName === 'TR') {
// //                             tbody.appendChild(child);
// //                         }
// //                     });
// //                     if (tbody.children.length > 0) {
// //                         table.appendChild(tbody);
// //                     }
// //                 }
// //               }
// //             }
// //           });

// //           return tempDiv.innerHTML;
// //         };

// //         let bodyContent, referenceNo, subject, refsubject, header, footer, referenceDate, signatory, signaturePlace;

// //         if (bodyData?.body && bodyData?.subject) {
// //           bodyContent = processBodyContent(bodyData.body || "");
// //           referenceNo = bodyData.referenceNo || "";
// //           subject = bodyData.subject || "";
// //           refsubject = bodyData.refsubject || "";
// //           header = bodyData.header || "";
// //           footer = bodyData.footer || "";
// //           referenceDate = bodyData.referenceDate || new Date().toISOString();
// //           signatory = formData?.signingAuthority ;
// //           signaturePlace = "Place";

// //         } else {
// //           const jwtToken = Cookies.get("HRToken");
// //           if (!jwtToken) throw new Error("Authentication token missing.");
// //           const body = {
// //             employeeid,
// //             coverpageno,
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //           };
// //           const response = await fetch(`${HostName}/Officeordertemppoc`, {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Bearer ${jwtToken}`,
// //             },
// //             body: JSON.stringify(body),
// //           });
// //           if (!response.ok) throw new Error("Failed to fetch Office Order");
// //           const encryptedData = await response.json();
// //           const encryptedPayload = encryptedData.Data ?? encryptedData.data;
// //           if (!encryptedPayload) throw new Error("Encrypted data missing");
// //           const decryptedString = await decryptData(encryptedPayload);
// //           const validData = validateJsonData(decryptedString);

// //           bodyContent = processBodyContent(validData.Body || validData.filled_template || "");
// //           referenceNo = validData.Referencenumber || "";
// //           subject = validData.Subject || validData.subject || "";
// //           refsubject = validData.refsubject || "";
// //           header = validData.Header || "";
// //           footer = validData.Footer || "";
// //           referenceDate = validData.date || validData.today_date || new Date().toISOString();
// //           signatory = formData?.signingAuthority || validData.signatory ;
// //           signaturePlace = validData.signaturePlace;
// //         }

// //         setParsedData({
// //           filled_template: bodyContent,
// //           body: bodyContent,
// //           Referencenumber: referenceNo,
// //           subject: subject,
// //           refsubject: refsubject,
// //           header: header,
// //           footer: footer,
// //           date: referenceDate,
// //           signatory: signatory,
// //           signaturePlace: signaturePlace,
// //         });

// //         // Fetch signature image if signing authority is available
// //         if (formData?.signingAuthority) {
// //           await fetchSignatureImage(formData.signingAuthority);
// //         }

// //       } catch (err) {
// //         console.error(err);
// //         setError(err.message || "Failed to fetch Office Order");
// //         setParsedData(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     buildPreview();
// //   }, [coverpageno, formData, bodyData, sessionId, employeeid]);

// // const sanitizeForPreview = (html) =>
// //     DOMPurify.sanitize(html, {
// //       ADD_TAGS: ["span", "ul", "ol", "li"], // Add ul, ol, and li tags here
// //       ADD_ATTR: ["style"]
// //     });

// //   const extractTableData = (tableElement) => {
// //     const head = [];
// //     const body = [];

// //     const allRows = Array.from(tableElement.querySelectorAll("tr"));

// //     if (allRows.length === 0) return { head, body };

// //     const firstRow = allRows[0];
// //     const firstRowCells = Array.from(firstRow.querySelectorAll("td, th"));

// //     let startRowIndex = 0;

// //     // Check if the first row is a header based on content
// //     const isHeaderRow = firstRowCells.some(cell => {
// //       const cellText = cell.textContent.trim().toLowerCase();
// //       // This check is now mostly for the PDF generation fallback, as the HTML is pre-cleaned for the preview
// //       return cellText.includes('leave') || cellText.includes('from') || cellText.includes('to');
// //     });

// //     if (isHeaderRow && !tableElement.querySelector('thead')) {
// //       // Only skip if a THEAD wasn't explicitly added in the useEffect cleanup
// //       startRowIndex = 1;
// //     }

// //     // Extract body rows
// //     for (let i = startRowIndex; i < allRows.length; i++) {
// //       const cells = Array.from(allRows[i].querySelectorAll("td, th"));
// //       if (cells.length > 0) {
// //         const rowData = cells.map(cell => cell.textContent.trim());
// //         if (rowData.some(cell => cell.length > 0)) {
// //           // Assuming 3 columns as per the image
// //           if (rowData.length >= 3) {
// //              body.push(rowData.slice(0, 3));
// //           } else {
// //              body.push(rowData);
// //           }
// //         }
// //       }
// //     }

// //     return { head: [], body }; // Return empty head as we define it manually in PDF
// //   };

// // const generatePDF = async () => {
// //   if (!parsedData) return;
// //   setGenerating(true);

// //   try {
// //     const pdf = new jsPDF({ unit: "mm", format: "a4" });
// //     const pageWidth = pdf.internal.pageSize.getWidth();
// //     const pageHeight = pdf.internal.pageSize.getHeight();
// //     const margin = 15;
// //     const contentWidth = pageWidth - margin * 2;
// //     const lineHeight = 5;
// //     const paraGap = 3;
// //     const TABLE_BOTTOM_GAP = 10; // ✅ extra space below tables

// //     // --- Fonts ---
// //     pdf.addFileToVFS("NotoSansDevanagari-Regular.ttf", NotoSansDevanagari);
// //     pdf.addFont("NotoSansDevanagari-Regular.ttf", "NotoSansDevanagari", "normal");
// //     pdf.addFileToVFS("NotoSansDevanagari-Bold.ttf", NotoSansDevanagariBold);
// //     pdf.addFont("NotoSansDevanagari-Bold.ttf", "NotoSansDevanagari", "bold");

// //     // --- Watermark and frame ---
// //     const drawFrame = () => {
// //       pdf.setDrawColor(0);
// //       pdf.setFontSize(70);
// //       pdf.setTextColor(240, 240, 240);
// //       const centerX = pageWidth / 2;
// //       const centerY = pageHeight / 2;
// //       pdf.text("DRAFT", centerX, centerY, { angle: 45, align: "center" });
// //       pdf.setTextColor(0, 0, 0);
// //       pdf.setFontSize(11);
// //     };

// //     drawFrame();
// //     let y = margin + 10;

// //     // --- Header image ---
// //     try {
// //       const img = new Image();
// //       img.src = header;
// //       await new Promise((res) => {
// //         if (img.complete) res();
// //         else {
// //           img.onload = res;
// //           img.onerror = res;
// //         }
// //       });
// //       const h = 28;
// //       pdf.addImage(img, "PNG", margin, y, contentWidth, h);
// //       y += h + 12;
// //     } catch (e) {
// //       console.warn("Header failed", e);
// //       y += 40;
// //     }

// //     pdf.setFont("times", "normal");
// //     pdf.setFontSize(11);

// //     // --- Reference number and date ---
// //     const refNumberText = parsedData.Referencenumber.replace(/<[^>]*>/g, "").trim();
// //     pdf.text(refNumberText, margin, y);
// //     pdf.text(`Date: ${formatDate(parsedData.date)}`, pageWidth - margin, y, {
// //       align: "right",
// //     });
// //     y += 10;

// //     // --- Header section (To/Prof/Thro) ---
// //     if (parsedData.header) {
// //       const headerDiv = document.createElement("div");
// //       headerDiv.innerHTML = parsedData.header;
// //       const headerText = headerDiv.textContent.trim();
// //       const headerLines = pdf.splitTextToSize(headerText, contentWidth);
// //       for (const line of headerLines) {
// //         pdf.text(line, margin, y);
// //         y += 5;
// //       }
// //       y += 8;
// //     }

// //     // --- Subject section ---
// //     if (parsedData.subject) {
// //       const subjectDiv = document.createElement("div");
// //       subjectDiv.innerHTML = parsedData.subject;
// //       const subjectText = subjectDiv.textContent.trim();
// //       const subjectLines = pdf.splitTextToSize(subjectText, contentWidth);
// //       for (const line of subjectLines) {
// //         pdf.text(line, margin, y);
// //         y += 5;
// //       }
// //       y += 8;
// //     }

// //     // --- Body and tables ---
// //     const tempDiv = document.createElement("div");
// //     tempDiv.innerHTML = parsedData.body || parsedData.filled_template;
// //     const elements = Array.from(tempDiv.children);

// //     const startNewPage = () => {
// //       pdf.addPage();
// //       drawFrame();
// //       y = margin + 10;
// //       pdf.setFontSize(11);
// //     };

// //     for (const el of elements) {
// //       const tag = el.tagName?.toLowerCase();
// //       const text = el.textContent.trim();

// //       if (!text && tag !== "table") continue;

// //       // Skip repetitive headers
// //       if (
// //         tag === "p" &&
// //         ["no.f.", "date:", "to", "sub:", "ref:"].some((x) =>
// //           el.innerHTML.toLowerCase().includes(`<strong>${x}`)
// //         )
// //       ) {
// //         continue;
// //       }

// //       if (y + 2 * lineHeight > pageHeight - margin - 20 && tag !== "table") {
// //         startNewPage();
// //       }

// //       if (tag === "p") {
// //         const isBold = el.querySelector("b, strong") || el.style.fontWeight === "bold";
// //         pdf.setFont("times", isBold ? "bold" : "normal");
// //         const lines = pdf.splitTextToSize(text, contentWidth);
// //         for (const line of lines) {
// //           if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //           pdf.text(line, margin, y);
// //           y += lineHeight;
// //         }
// //         y += paraGap;
// //       } else if (tag === "ul" || tag === "ol") { // MODIFIED BLOCK START
// //         const items = el.querySelectorAll("li");
// //         for (let idx = 0; idx < items.length; idx++) {
// //           const liText = items[idx].textContent.trim();
// //           const isBulletList = tag === "ul" || items[idx].getAttribute('data-list') === 'bullet'; // Check data-list attribute
// //           const liBullet = isBulletList ? "•" : `${idx + 1}.`; // Use bullet or number based on check

// //           if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //           pdf.setFont("times", "normal");
// //           pdf.text(liBullet, margin + 4, y);
// //           const liLines = pdf.splitTextToSize(liText, contentWidth - 12);
// //           for (const line of liLines) {
// //             if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //             pdf.text(line, margin + 12, y);
// //             y += lineHeight;
// //           }
// //           y += paraGap;
// //         }
// //       } else if (tag === "table") {
// //         if (y + 40 > pageHeight - margin - 20) startNewPage();

// //         const { body: originalBody } = extractTableData(el);

// //         if (originalBody.length > 0) {
// //           const tableHead = [["Leave Type", "From", "To"]];

// //           const tableBody = originalBody.map((row) => [
// //             row[0],
// //             row[1],
// //             row[2],
// //           ]);

// //           autoTable(pdf, {
// //             head: tableHead,
// //             body: tableBody,
// //             startY: y,
// //             tableWidth: contentWidth,
// //             margin: { left: margin, right: margin },
// //             styles: {
// //               fontSize: 10,
// //               font: "times",
// //               cellPadding: 2,
// //               overflow: "linebreak",
// //               valign: "middle",
// //               halign: "center",
// //               lineColor: [0, 0, 0],
// //               lineWidth: 0.2,
// //             },
// //             headStyles: {
// //               fillColor: [255, 255, 255],
// //               fontStyle: "bold",
// //               textColor: [0, 0, 0],
// //               halign: "center",
// //             },
// //             didDrawPage: () => drawFrame(),
// //           });

// //           // ✅ Add visible spacing below the table
// //           y = pdf.lastAutoTable.finalY + TABLE_BOTTOM_GAP;
// //         }
// //       } else {
// //         if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //         pdf.setFont("times", "normal");
// //         const lines = pdf.splitTextToSize(text, contentWidth);
// //         for (const line of lines) {
// //           if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //           pdf.text(line, margin, y, { align: "justify" });
// //           y += lineHeight;
// //         }
// //         y += paraGap;
// //       }

// //       pdf.setFont("times", "normal");
// //     }

// //     // --- Signature section ---
// //     if (y + 40 > pageHeight - margin - 20) startNewPage();

// //     y += 20;

// //     // Add signature image if available
// //     if (signatureImage) {
// //       try {
// //         const sigImg = new Image();
// //         const imgSrc = signatureImage.startsWith('data:')
// //           ? signatureImage
// //           : `data:image/png;base64,${signatureImage}`;

// //         sigImg.src = imgSrc;
// //         await new Promise((res, rej) => {
// //           if (sigImg.complete) {
// //             res();
// //           } else {
// //             sigImg.onload = res;
// //             sigImg.onerror = rej;
// //           }
// //         });

// //         const sigWidth = 40;
// //         const sigHeight = 15;
// //         const sigX = pageWidth - margin - sigWidth;

// //         pdf.addImage(sigImg, 'PNG', sigX, y, sigWidth, sigHeight);
// //         y += sigHeight + 5;
// //       } catch (e) {
// //         console.warn("Signature image failed in PDF", e);
// //       }
// //     }

// //     pdf.setFont("times", "bold");
// //     pdf.text(parsedData.signatory || "Authorized Signatory", pageWidth - margin, y, {
// //       align: "right",
// //     });
// //     y += 5;
// //     pdf.setFont("times", "italic");
// //     pdf.text(parsedData.signaturePlace || "Place", pageWidth - margin, y, {
// //       align: "right",
// //     });

// //     y += 15;

// //     // --- To section ---
// //     if (formData?.toSection && formData.toSection.length > 0) {
// //       if (y + 10 > pageHeight - margin - 20) startNewPage();

// //       pdf.setFont("times", "bold");
// //       pdf.setFontSize(11);
// //       pdf.text("To:", margin, y);
// //       y += 7;

// //       pdf.setFont("times", "normal");
// //       pdf.setFontSize(10);

// //       formData.toSection.forEach((item) => {
// //         const lines = pdf.splitTextToSize(item, contentWidth);
// //         for (const line of lines) {
// //           if (y + 5 > pageHeight - margin - 20) startNewPage();
// //           pdf.text(line, margin, y);
// //           y += 5;
// //         }
// //       });
// //     }

// //     // --- Footer ---
// //     if (parsedData.footer) {
// //       let footerHTML = parsedData.footer.trim();

// //       if (footerHTML) {
// //         let normalizedHTML = footerHTML
// //           .replace(/<!--[\s\S]*?-->/g, "")
// //           .replace(/\\n/g, " ")
// //           .trim();

// //         normalizedHTML = normalizedHTML.replace(/<br\s*\/?>/gi, "</p><p>");

// //         const footerDiv = document.createElement("div");
// //         footerDiv.innerHTML = normalizedHTML;

// //         if (y + 60 > pageHeight - margin - 20) startNewPage();

// //         const boxPadding = 5;
// //         const startBoxY = y;

// //         pdf.setFont("times", "normal");
// //         pdf.setFontSize(10);

// //         const footerElements = Array.from(footerDiv.querySelectorAll("p, div, span"));
// //         const footerLines = [];

// //         footerElements.forEach((el) => {
// //           const text = el.textContent.trim();
// //           if (!text) return;

// //           const hasBold = el.querySelector("b,strong");
// //           const hasItalic = el.querySelector("i,em");

// //           let style = "normal";
// //           if (hasBold && hasItalic) style = "bolditalic";
// //           else if (hasBold) style = "bold";
// //           else if (hasItalic) style = "italic";

// //           pdf.setFont("times", style);
// //           const lines = pdf.splitTextToSize(text, contentWidth - boxPadding * 2);
// //           footerLines.push({ lines, style });
// //         });

// //         const totalLines = footerLines.reduce((sum, f) => sum + f.lines.length, 0);
// //         const boxHeight = totalLines * lineHeight + boxPadding * 2 + 4;

// //         pdf.setDrawColor(0);
// //         pdf.setLineWidth(0.5);
// //         pdf.rect(margin, startBoxY, contentWidth, boxHeight);

// //         y = startBoxY + boxPadding + 3;
// //         footerLines.forEach((f) => {
// //           pdf.setFont("times", f.style);
// //           f.lines.forEach((line) => {
// //             if (y + lineHeight > pageHeight - margin - 20) {
// //               startNewPage();
// //               y = margin + 10 + boxPadding + 3;
// //             }
// //             pdf.text(line, margin + boxPadding, y);
// //             y += lineHeight;
// //           });
// //         });

// //         y += 10;
// //       }
// //     }

// //     // --- Save file ---
// //     pdf.save(
// //       `OfficeOrder_${
// //         parsedData.Referencenumber.replace(/<[^>]*>/g, "").trim() || "draft"
// //       }.pdf`
// //     );
// //   } catch (err) {
// //     console.error("PDF generation error:", err);
// //     alert("PDF generation failed: " + err.message);
// //   } finally {
// //     setGenerating(false);
// //   }
// // };

// //   const renderContent = () => {
// //     if (!parsedData) return null;

// // return (
// //   <div
// //     className="a4-page"
// //     style={{
// //     minHeight: "auto",
// //     height: "auto",
// //     paddingBottom: "10px",
// //     marginBottom: "0",
// //   }}
// //   >
// //     <div className="watermark">DRAFT</div>

// //     {/* HEADER IMAGE */}
// //     <div style={styles.headerContainer}>
// //       <img src={header} alt="Header" style={styles.headerStyle} />
// //     </div>

// //     {/* REFERENCE NUMBER & DATE */}
// //     <div style={styles.refDateContainer}>
// //       <div style={styles.refSection}>
// //         {parsedData.Referencenumber ? (
// //           <div
// //             dangerouslySetInnerHTML={{
// //               __html: sanitizeForPreview(parsedData.Referencenumber),
// //             }}
// //           />
// //         ) : null}
// //       </div>

// //       <div style={styles.dateQrWrapper}>
// //         <div style={styles.dateSection}>
// //           Date: {formatDate(parsedData.date)}
// //         </div>
// //       </div>
// //     </div>

// //     {/* HEADER TEXT + QR CODE (TWO-COLUMN LAYOUT) */}
// //     {parsedData.header && (
// //       <div
// //         style={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "flex-start",
// //           marginTop: "20px",
// //           gap: "10px",
// //           ...styles.headerSection,
// //         }}
// //       >
// //         {/* LEFT COLUMN — HEADER TEXT */}
// //         <div
// //           style={{
// //             flex: 1,
// //             whiteSpace: "pre-wrap",
// //             paddingRight: "20px",
// //           }}
// //         >
// //           {parsedData.header
// //             .replace(/To\s*/g, "To\n")
// //             .replace(/ Thro/g, "\nThro")
// //             .replace(/<br\s*\/?>/gi, "\n")
// //             .replace(/<\/?[^>]+(>|$)/g, "")
// //             .trim()}
// //         </div>

// //         {/* RIGHT COLUMN — QR CODE */}
// //         {parsedData.Referencenumber && (
// //           <div style={{ flexShrink: 0, textAlign: "right" }}>
// //             <QRCodeCanvas
// //               value={parsedData.Referencenumber.replace(/<[^>]*>/g, "")}
// //               size={80}
// //               level="H"
// //               includeMargin={false}
// //             />
// //           </div>
// //         )}
// //       </div>
// //     )}

// //     {/* SUBJECT SECTION */}
// //     {parsedData.subject && (
// //       <div
// //         style={styles.subjectLine}
// //         dangerouslySetInnerHTML={{
// //           __html: sanitizeForPreview(
// //             `<p>${parsedData.subject}</p>${
// //               parsedData.refsubject
// //                 ? `<p>${parsedData.refsubject}</p>`
// //                 : ""
// //             }`
// //           ),
// //         }}
// //       />
// //     )}

// //     {/* BODY SECTION */}
// //     <div
// //       style={styles.body}
// //       dangerouslySetInnerHTML={{
// //         __html: sanitizeForPreview(
// //           parsedData.body || parsedData.filled_template
// //         ),
// //       }}
// //     />

// //     {/* SIGNATURE BLOCK */}
// //     <div style={styles.signatureBlock}>
// //       <div style={{ minHeight: 40 }} />

// //       {/* Signature Image */}
// //       {signatureImage && (
// //         <div style={{
// //           textAlign: 'right',
// //           marginBottom: '8px',
// //           display: 'flex',
// //           justifyContent: 'flex-end',
// //         }}>
// //           <img
// //             src={signatureImage.startsWith('data:') ? signatureImage : `data:image/png;base64,${signatureImage}`}
// //             alt="Digital Signature"
// //             style={{
// //               maxWidth: '150px',
// //               maxHeight: '60px',
// //               objectFit: 'contain',
// //             }}
// //             onError={(e) => {
// //               console.error('Signature image failed to load');
// //               e.target.style.display = 'none';
// //             }}
// //           />
// //         </div>
// //       )}

// //       <div style={styles.signName}>
// //         {parsedData.signatory || "Authorized Signatory"}
// //       </div>
// //       <div style={styles.signPlace}>
// //         {parsedData.signaturePlace || "Place"}
// //       </div>
// //     </div>

// //     {/* TO SECTION */}
// //     {formData?.toSection && formData.toSection.length > 0 && (
// //       <div style={styles.toSection}>
// //         <p style={styles.toSectionHeader}>To:</p>
// //         {formData.toSection.map((item, index) => (
// //           <p key={index} style={styles.toSectionItem}>
// //             {item}
// //           </p>
// //         ))}
// //       </div>
// //     )}

// //     {/* FOOTER SECTION */}
// //     {parsedData.footer && (
// //       <div
// //         style={styles.footerSection}
// //         dangerouslySetInnerHTML={{
// //           __html: sanitizeForPreview(parsedData.footer),
// //         }}
// //       />
// //     )}
// //   </div>
// // );

// // };

// //   return (
// //     <div style={styles.modalOverlay} onClick={onBack}>
// //       <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
// //         <div style={styles.modalHeader}>
// //           <h3 style={styles.modalTitle}>Office Order Preview (Official)</h3>
// //           <div style={styles.modalActions}>
// //             {parsedData && (
// //               <button
// //                 onClick={generatePDF}
// //                 disabled={generating}
// //                 style={{
// //                   ...styles.pdfButton,
// //                   opacity: generating ? 0.6 : 1,
// //                 }}
// //               >
// //                 {generating ? "Generating..." : "📄 Download PDF"}
// //               </button>
// //             )}
// //             <button onClick={onBack} style={styles.closeButton}>
// //               ✕
// //             </button>
// //           </div>
// //         </div>

// //         <div style={styles.modalBody}>
// //           {loading ? (
// //             <div style={styles.centerMessage}>
// //               <p>Loading preview...</p>
// //             </div>
// //           ) : error ? (
// //             <div style={styles.centerMessage}>
// //               <p style={{ color: "red" }}>⚠️ {error}</p>
// //             </div>
// //           ) : parsedData ? (
// //             renderContent()
// //           ) : (
// //             <div style={styles.centerMessage}>
// //               <p>No data available.</p>
// //             </div>
// //           )}
// //         </div>

// //         <style>{`
// //           .a4-page {
// //             width: 210mm;
// //             padding: 20mm;
// //             margin: 10mm auto;
// //             background: #fff;
// //             position: relative;
// //             border-radius: 8px;
// //             box-shadow: 0 4px 12px rgba(0,0,0,0.15);
// //             overflow: visible;
// //           }
// //           .a4-page.bordered::after {
// //             content: '';
// //             position: absolute;
// //             top: 6mm;
// //             left: 6mm;
// //             right: 6mm;
// //             bottom: 6mm;
// //             border: 1px solid #444;
// //             border-radius: 6px;
// //             pointer-events: none;
// //           }
// //              .a4-page ol li[data-list="bullet"] {
// //             list-style-type: disc; /* Display as a bullet point */
// //             margin-left: 20px; /* Adjust indentation as needed for proper alignment */
// //           }

// //           /* If your editor inserts a blank span for the bullet, hide it to avoid double bullets */
// //           .a4-page ol li[data-list="bullet"] .ql-ui {
// //             display: none;
// //           }

// //           /* You might also want to remove default padding for <ol> if it looks off */
// //           .a4-page ol {
// //             padding-left: 25px; /* Keep default ol padding, or adjust to match ul */
// //           }

// //           .a4-page p {
// //             margin: 6px 0;
// //             line-height: 1.6;
// //             font-size: 11pt;
// //             text-align: justify;
// //           }
// //           .a4-page ul, .a4-page ol {
// //             margin: 10px 0;
// //             padding-left: 25px;
// //           }
// //           .a4-page li {
// //             margin: 6px 0;
// //             line-height: 1.6;
// //             font-size: 11pt;
// //             text-align: justify;
// //           }
// //           .a4-page table {
// //             width: 100%;
// //             border-collapse: collapse;
// //             margin: 12px 0;
// //           }
// //           .a4-page th, .a4-page td {
// //             border: 1px solid #000;
// //             padding: 6px;
// //             font-size: 10pt;
// //             text-align: center;
// //           }
// //           .a4-page th {
// //             background: #f0f0f0;
// //             font-weight: bold;
// //           }
// //           .a4-page .watermark {
// //             position: absolute;
// //             top: 50%;
// //             left: 50%;
// //             transform: translate(-50%, -50%) rotate(-45deg);
// //             font-size: 90px;
// //             color: rgba(150,150,150,0.08);
// //             font-weight: 50;
// //             white-space: nowrap;
// //             pointer-events: none;
// //             user-select: none;
// //             z-index: 1;
// //           }
// //         `}</style>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles = {
// //   modalOverlay: {
// //     position: "fixed",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: "rgba(0, 0, 0, 0.75)",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     zIndex: 1000,
// //     padding: "20px",
// //   },
// //   modalContent: {
// //     backgroundColor: "#fff",
// //     borderRadius: "12px",
// //     maxWidth: "1100px",
// //     width: "100%",
// //     maxHeight: "90vh",
// //     display: "flex",
// //     flexDirection: "column",
// //     boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
// //   },
// //   modalHeader: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     padding: "20px 28px",
// //     borderBottom: "1px solid #e5e7eb",
// //   },
// //   modalTitle: {
// //     margin: 0,
// //     fontSize: "18px",
// //     fontWeight: 600,
// //     color: "#111827",
// //   },
// //   modalActions: {
// //     display: "flex",
// //     gap: "12px",
// //     alignItems: "center",
// //   },
// //   pdfButton: {
// //     padding: "8px 16px",
// //     border: "none",
// //     borderRadius: "6px",
// //     background: "#059669",
// //     color: "#fff",
// //     cursor: "pointer",
// //     fontWeight: 600,
// //     fontSize: "14px",
// //   },
// //   closeButton: {
// //     padding: "8px 12px",
// //     border: "none",
// //     borderRadius: "6px",
// //     background: "#ef4444",
// //     color: "#fff",
// //     cursor: "pointer",
// //     fontSize: "18px",
// //     fontWeight: "bold",
// //     lineHeight: 1,
// //   },
// //   modalBody: {
// //     flex: 1,
// //     overflowY: "auto",
// //     padding: "20px",
// //     background: "#f9fafb",
// //   },
// //   centerMessage: {
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     minHeight: "300px",
// //     fontSize: "16px",
// //   },
// //   headerContainer: {
// //     marginBottom: "12px",
// //     zIndex: 10,
// //     position: "relative",
// //   },
// //   headerStyle: {
// //     maxHeight: "100px",
// //     objectFit: "contain",
// //     width: "100%",
// //   },
// //   refDateContainer: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "flex-start",
// //     marginBottom: "20px",
// //     fontSize: "11pt",
// //     zIndex: 10,
// //     position: "relative",
// //   },
// //   refSection: {
// //     textAlign: "left",
// //     fontWeight: "500",
// //     fontSize: "11pt",
// //   },
// //   dateQrWrapper: {
// //     display: "flex",
// //     flexDirection: "column",
// //     alignItems: "flex-end",
// //     gap: "8px",
// //   },
// //   dateSection: {
// //     textAlign: "right",
// //     fontWeight: "500",
// //   },
// //   qrBelowDate: {
// //     padding: "4px",
// //     background: "#fff",
// //     border: "1px solid #e5e7eb",
// //     borderRadius: "4px",
// //     zIndex: 4,
// //     position: "relative",
// //   },
// //   subjectLine: {
// //     marginBottom: "15px",
// //     fontSize: "11pt",
// //     lineHeight: 1.6,
// //     zIndex: 10,
// //     position: "relative",
// //   },
// //   headerSection: {
// //     marginBottom: "15px",
// //     fontSize: "11pt",
// //     lineHeight: 1.6,
// //     zIndex: 10,
// //     position: "relative",
// //   },
// //   body: {
// //     fontSize: "11pt",
// //     lineHeight: 1.6,
// //     color: "#000",
// //     marginTop: "10px",
// //     zIndex: 5,
// //     position: "relative",
// //   },
// //   footerSection: {
// //     marginTop: "20px",
// //     fontSize: "10pt",
// //     lineHeight: 1.5,
// //     padding: "10px",
// //     border: "1px solid #000",
// //     borderRadius: "4px",
// //     maxWidth: "700px",
// //     zIndex: 5,
// //     position: "relative",
// //   },
// //   signatureBlock: {
// //     marginTop: "40px",
// //     textAlign: "right",
// //     fontSize: "11pt",
// //     zIndex: 10,
// //     position: "relative",
// //   },
// //   signName: {
// //     fontWeight: "bold",
// //   },
// //   signPlace: {
// //     fontStyle: "italic",
// //     marginTop: "4px",
// //   },
// //   toSection: {
// //     marginTop: '30px',
// //     textAlign: 'left',
// //     fontSize: '10pt',
// //     lineHeight: 1.5,
// //     zIndex: 10,
// //     position: 'relative',
// //   },
// //   toSectionHeader: {
// //     fontWeight: 'bold',
// //     marginBottom: '5px',
// //     margin: 0,
// //     fontSize: '11pt',
// //   },
// //   toSectionItem: {
// //     margin: '0 0 4px 0',
// //   },
// // };

// // export default OfficeOrderPreview;

// //PDF VIEWER 1

// // import React, { useEffect, useState } from "react";
// // import Cookies from "js-cookie";
// // import DOMPurify from "dompurify";
// // import header from "./header.png";
// // import { QRCodeCanvas } from "qrcode.react";
// // import { HostName } from "src/assets/host/Host";
// // import {
// //   decryptData,
// //   validateJsonData,
// // } from "src/components/Decryption/Decrypt";
// // import { jsPDF } from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import NotoSansDevanagari from "src/views/OfficeOrder/Fonts/NotoSansDevanagari-Regular.js";
// // import NotoSansDevanagariBold from "src/views/OfficeOrder/Fonts/NotoSansDevanagari-Bold.js";

// // const OfficeOrderPreview = ({
// //   onBack,
// //   coverpageno,
// //   formData,
// //   bodyData,
// //   employeeid,
// // }) => {
// //   const [parsedData, setParsedData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [generating, setGenerating] = useState(false);
// //   const [signatureImage, setSignatureImage] = useState(null);
// //   const [pdfUrl, setPdfUrl] = useState(null); // New state for PDF URL
// //   const sessionId = Cookies.get("session_id");

// //   const formatDate = (dateStr) => {
// //     if (!dateStr) return "";
// //     const d = new Date(dateStr);
// //     if (isNaN(d)) return dateStr;
// //     return `${String(d.getDate()).padStart(2, "0")}-${String(
// //       d.getMonth() + 1
// //     ).padStart(2, "0")}-${d.getFullYear()}`;
// //   };

// //   const fetchSignatureImage = async (role) => {
// //     if (!role) {
// //       setSignatureImage(null);
// //       return;
// //     }

// //     try {
// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");

// //       const body = {
// //         token: "HRFGVJISOVp1fncC",
// //         session_id: sessionId,
// //         role: role,
// //       };

// //       const response = await fetch(
// //         "https://wftest1.iitm.ac.in:7000/OfficeOrder_download",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(body),
// //         }
// //       );

// //       if (!response.ok) throw new Error("Failed to fetch signature: " + response.statusText);

// //       const contentType = response.headers.get("content-type");

// //       if (contentType && contentType.includes("image")) {
// //         const imageBlob = await response.blob();
// //         const reader = new FileReader();
// //         reader.onloadend = () => {
// //           setSignatureImage(reader.result);
// //         };
// //         reader.onerror = (e) => {
// //           console.error("FileReader error while converting image blob:", e);
// //           setSignatureImage(null);
// //         };
// //         reader.readAsDataURL(imageBlob);
// //         return;
// //       } else if (contentType && contentType.includes("application/json")) {
// //         const encryptedData = await response.json();
// //         const encryptedPayload = encryptedData.Data ?? encryptedData.data;
// //         if (!encryptedPayload) throw new Error("Encrypted data missing from JSON payload.");

// //         const decryptedString = await decryptData(encryptedPayload);
// //         const parsedData = validateJsonData(decryptedString);

// //         const signature = parsedData?.signature || parsedData?.digital_signature;
// //         if (signature) {
// //           setSignatureImage(signature);
// //         } else {
// //           console.warn("Signature or digital_signature not found in decrypted JSON data.");
// //         }
// //       } else {
// //         const textResponse = await response.text();
// //         console.error(`Received unexpected content type from signature API: ${contentType}. Response text: ${textResponse.substring(0, 200)}`);
// //         throw new Error(`Unexpected content type from signature API: ${contentType}. Expected image or JSON.`);
// //       }
// //     } catch (err) {
// //       console.error("Signature fetch error:", err);
// //       setSignatureImage(null);
// //     }
// //   };

// //   const generatePDF = async () => {
// //     if (!parsedData) return;
// //     setGenerating(true);

// //     try {
// //       const pdf = new jsPDF({ unit: "mm", format: "a4" });
// //       const pageWidth = pdf.internal.pageSize.getWidth();
// //       const pageHeight = pdf.internal.pageSize.getHeight();
// //       const margin = 15;
// //       const contentWidth = pageWidth - margin * 2;
// //       const lineHeight = 5;
// //       const paraGap = 3;
// //       const TABLE_BOTTOM_GAP = 10;

// //       // --- Fonts ---
// //       pdf.addFileToVFS("NotoSansDevanagari-Regular.ttf", NotoSansDevanagari);
// //       pdf.addFont("NotoSansDevanagari-Regular.ttf", "NotoSansDevanagari", "normal");
// //       pdf.addFileToVFS("NotoSansDevanagari-Bold.ttf", NotoSansDevanagariBold);
// //       pdf.addFont("NotoSansDevanagari-Bold.ttf", "NotoSansDevanagari", "bold");

// //       // --- Watermark and frame ---
// //       const drawFrame = () => {
// //         pdf.setDrawColor(0);
// //         pdf.setFontSize(70);
// //         pdf.setTextColor(240, 240, 240);
// //         const centerX = pageWidth / 2;
// //         const centerY = pageHeight / 2;
// //         pdf.text("DRAFT", centerX, centerY, { angle: 45, align: "center" });
// //         pdf.setTextColor(0, 0, 0);
// //         pdf.setFontSize(11);
// //       };

// //       drawFrame();
// //       let y = margin + 10;

// //       // --- Header image ---
// //       try {
// //         const img = new Image();
// //         img.src = header;
// //         await new Promise((res) => {
// //           if (img.complete) res();
// //           else {
// //             img.onload = res;
// //             img.onerror = res;
// //           }
// //         });
// //         const h = 28;
// //         pdf.addImage(img, "PNG", margin, y, contentWidth, h);
// //         y += h + 12;
// //       } catch (e) {
// //         console.warn("Header failed", e);
// //         y += 40;
// //       }

// //       pdf.setFont("times", "normal");
// //       pdf.setFontSize(11);

// //       // --- Reference number and date ---
// //       const refNumberText = parsedData.Referencenumber.replace(/<[^>]*>/g, "").trim();
// //       pdf.text(refNumberText, margin, y);
// //       pdf.text(`Date: ${formatDate(parsedData.date)}`, pageWidth - margin, y, {
// //         align: "right",
// //       });
// //       y += 10;

// //       // --- Header section (To/Prof/Thro) ---
// //       if (parsedData.header) {
// //         const headerDiv = document.createElement("div");
// //         headerDiv.innerHTML = parsedData.header;
// //         const headerText = headerDiv.textContent.trim();
// //         const headerLines = pdf.splitTextToSize(headerText, contentWidth);
// //         for (const line of headerLines) {
// //           pdf.text(line, margin, y);
// //           y += 5;
// //         }
// //         y += 8;
// //       }

// //       // --- Subject section ---
// //       if (parsedData.subject) {
// //         const subjectDiv = document.createElement("div");
// //         subjectDiv.innerHTML = parsedData.subject;
// //         const subjectText = subjectDiv.textContent.trim();
// //         const subjectLines = pdf.splitTextToSize(subjectText, contentWidth);
// //         for (const line of subjectLines) {
// //           pdf.text(line, margin, y);
// //           y += 5;
// //         }
// //         y += 8;
// //       }

// //       // --- Body and tables ---
// //       const tempDiv = document.createElement("div");
// //       tempDiv.innerHTML = parsedData.body || parsedData.filled_template;
// //       const elements = Array.from(tempDiv.children);

// //       const startNewPage = () => {
// //         pdf.addPage();
// //         drawFrame();
// //         y = margin + 10;
// //         pdf.setFontSize(11);
// //       };

// //       for (const el of elements) {
// //         const tag = el.tagName?.toLowerCase();
// //         const text = el.textContent.trim();

// //         if (!text && tag !== "table") continue;

// //         // Skip repetitive headers
// //         if (
// //           tag === "p" &&
// //           ["no.f.", "date:", "to", "sub:", "ref:"].some((x) =>
// //             el.innerHTML.toLowerCase().includes(`<strong>${x}`)
// //           )
// //         ) {
// //           continue;
// //         }

// //         if (y + 2 * lineHeight > pageHeight - margin - 20 && tag !== "table") {
// //           startNewPage();
// //         }

// //         if (tag === "p") {
// //           const isBold = el.querySelector("b, strong") || el.style.fontWeight === "bold";
// //           pdf.setFont("times", isBold ? "bold" : "normal");
// //           const lines = pdf.splitTextToSize(text, contentWidth);
// //           for (const line of lines) {
// //             if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //             pdf.text(line, margin, y);
// //             y += lineHeight;
// //           }
// //           y += paraGap;
// //         } else if (tag === "ul" || tag === "ol") {
// //           const items = el.querySelectorAll("li");
// //           for (let idx = 0; idx < items.length; idx++) {
// //             const liText = items[idx].textContent.trim();
// //             const isBulletList = tag === "ul" || items[idx].getAttribute('data-list') === 'bullet';
// //             const liBullet = isBulletList ? "•" : `${idx + 1}.`;

// //             if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //             pdf.setFont("times", "normal");
// //             pdf.text(liBullet, margin + 4, y);
// //             const liLines = pdf.splitTextToSize(liText, contentWidth - 12);
// //             for (const line of liLines) {
// //               if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //               pdf.text(line, margin + 12, y);
// //               y += lineHeight;
// //             }
// //             y += paraGap;
// //           }
// //         } else if (tag === "table") {
// //           if (y + 40 > pageHeight - margin - 20) startNewPage();

// //           const { body: originalBody } = extractTableData(el);

// //           if (originalBody.length > 0) {
// //             const tableHead = [["Leave Type", "From", "To"]];

// //             const tableBody = originalBody.map((row) => [
// //               row[0],
// //               row[1],
// //               row[2],
// //             ]);

// //             autoTable(pdf, {
// //               head: tableHead,
// //               body: tableBody,
// //               startY: y,
// //               tableWidth: contentWidth,
// //               margin: { left: margin, right: margin },
// //               styles: {
// //                 fontSize: 10,
// //                 font: "times",
// //                 cellPadding: 2,
// //                 overflow: "linebreak",
// //                 valign: "middle",
// //                 halign: "center",
// //                 lineColor: [0, 0, 0],
// //                 lineWidth: 0.2,
// //               },
// //               headStyles: {
// //                 fillColor: [255, 255, 255],
// //                 fontStyle: "bold",
// //                 textColor: [0, 0, 0],
// //                 halign: "center",
// //               },
// //               didDrawPage: () => drawFrame(),
// //             });

// //             y = pdf.lastAutoTable.finalY + TABLE_BOTTOM_GAP;
// //           }
// //         } else {
// //           if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //           pdf.setFont("times", "normal");
// //           const lines = pdf.splitTextToSize(text, contentWidth);
// //           for (const line of lines) {
// //             if (y + lineHeight > pageHeight - margin - 20) startNewPage();
// //             pdf.text(line, margin, y, { align: "justify" });
// //             y += lineHeight;
// //           }
// //           y += paraGap;
// //         }

// //         pdf.setFont("times", "normal");
// //       }

// //       // --- Signature section ---
// //       if (y + 40 > pageHeight - margin - 20) startNewPage();

// //       y += 20;

// //       // Add signature image if available
// //       if (signatureImage) {
// //         try {
// //           const sigImg = new Image();
// //           const imgSrc = signatureImage.startsWith('data:')
// //             ? signatureImage
// //             : `data:image/png;base64,${signatureImage}`;

// //           sigImg.src = imgSrc;
// //           await new Promise((res, rej) => {
// //             if (sigImg.complete) {
// //               res();
// //             } else {
// //               sigImg.onload = res;
// //               sigImg.onerror = rej;
// //             }
// //           });

// //           const sigWidth = 40;
// //           const sigHeight = 15;
// //           const sigX = pageWidth - margin - sigWidth;

// //           pdf.addImage(sigImg, 'PNG', sigX, y, sigWidth, sigHeight);
// //           y += sigHeight + 5;
// //         } catch (e) {
// //           console.warn("Signature image failed in PDF", e);
// //         }
// //       }

// //       pdf.setFont("times", "bold");
// //       pdf.text(parsedData.signatory || "Authorized Signatory", pageWidth - margin, y, {
// //         align: "right",
// //       });
// //       y += 5;
// //       pdf.setFont("times", "italic");
// //       pdf.text(parsedData.signaturePlace || "Place", pageWidth - margin, y, {
// //         align: "right",
// //       });

// //       y += 15;

// //       // --- To section ---
// //       if (formData?.toSection && formData.toSection.length > 0) {
// //         if (y + 10 > pageHeight - margin - 20) startNewPage();

// //         pdf.setFont("times", "bold");
// //         pdf.setFontSize(11);
// //         pdf.text("To:", margin, y);
// //         y += 7;

// //         pdf.setFont("times", "normal");
// //         pdf.setFontSize(10);

// //         formData.toSection.forEach((item) => {
// //           const lines = pdf.splitTextToSize(item, contentWidth);
// //           for (const line of lines) {
// //             if (y + 5 > pageHeight - margin - 20) startNewPage();
// //             pdf.text(line, margin, y);
// //             y += 5;
// //           }
// //         });
// //       }

// //       // --- Footer ---
// //       if (parsedData.footer) {
// //         let footerHTML = parsedData.footer.trim();

// //         if (footerHTML) {
// //           let normalizedHTML = footerHTML
// //             .replace(/<!--[\s\S]*?-->/g, "")
// //             .replace(/\\n/g, " ")
// //             .trim();

// //           normalizedHTML = normalizedHTML.replace(/<br\s*\/?>/gi, "</p><p>");

// //           const footerDiv = document.createElement("div");
// //           footerDiv.innerHTML = normalizedHTML;

// //           if (y + 60 > pageHeight - margin - 20) startNewPage();

// //           const boxPadding = 5;
// //           const startBoxY = y;

// //           pdf.setFont("times", "normal");
// //           pdf.setFontSize(10);

// //           const footerElements = Array.from(footerDiv.querySelectorAll("p, div, span"));
// //           const footerLines = [];

// //           footerElements.forEach((el) => {
// //             const text = el.textContent.trim();
// //             if (!text) return;

// //             const hasBold = el.querySelector("b,strong");
// //             const hasItalic = el.querySelector("i,em");

// //             let style = "normal";
// //             if (hasBold && hasItalic) style = "bolditalic";
// //             else if (hasBold) style = "bold";
// //             else if (hasItalic) style = "italic";

// //             pdf.setFont("times", style);
// //             const lines = pdf.splitTextToSize(text, contentWidth - boxPadding * 2);
// //             footerLines.push({ lines, style });
// //           });

// //           const totalLines = footerLines.reduce((sum, f) => sum + f.lines.length, 0);
// //           const boxHeight = totalLines * lineHeight + boxPadding * 2 + 4;

// //           pdf.setDrawColor(0);
// //           pdf.setLineWidth(0.5);
// //           pdf.rect(margin, startBoxY, contentWidth, boxHeight);

// //           y = startBoxY + boxPadding + 3;
// //           footerLines.forEach((f) => {
// //             pdf.setFont("times", f.style);
// //             f.lines.forEach((line) => {
// //               if (y + lineHeight > pageHeight - margin - 20) {
// //                 startNewPage();
// //                 y = margin + 10 + boxPadding + 3;
// //               }
// //               pdf.text(line, margin + boxPadding, y);
// //               y += lineHeight;
// //             });
// //           });

// //           y += 10;
// //         }
// //       }

// //       // --- Generate PDF URL for viewing instead of downloading ---
// //       const pdfBlob = pdf.output("blob");
// //       const pdfObjectUrl = URL.createObjectURL(pdfBlob);
// //       setPdfUrl(pdfObjectUrl);

// //     } catch (err) {
// //       console.error("PDF generation error:", err);
// //       alert("PDF generation failed: " + err.message);
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   const extractTableData = (tableElement) => {
// //     const head = [];
// //     const body = [];

// //     const allRows = Array.from(tableElement.querySelectorAll("tr"));

// //     if (allRows.length === 0) return { head, body };

// //     const firstRow = allRows[0];
// //     const firstRowCells = Array.from(firstRow.querySelectorAll("td, th"));

// //     let startRowIndex = 0;

// //     const isHeaderRow = firstRowCells.some(cell => {
// //       const cellText = cell.textContent.trim().toLowerCase();
// //       return cellText.includes('leave') || cellText.includes('from') || cellText.includes('to');
// //     });

// //     if (isHeaderRow && !tableElement.querySelector('thead')) {
// //       startRowIndex = 1;
// //     }

// //     for (let i = startRowIndex; i < allRows.length; i++) {
// //       const cells = Array.from(allRows[i].querySelectorAll("td, th"));
// //       if (cells.length > 0) {
// //         const rowData = cells.map(cell => cell.textContent.trim());
// //         if (rowData.some(cell => cell.length > 0)) {
// //           if (rowData.length >= 3) {
// //              body.push(rowData.slice(0, 3));
// //           } else {
// //              body.push(rowData);
// //           }
// //         }
// //       }
// //     }

// //     return { head: [], body };
// //   };

// //   useEffect(() => {
// //     const buildPreview = async () => {
// //       try {
// //         setLoading(true);
// //         setError("");

// //         const processBodyContent = (htmlContent) => {
// //           let content = htmlContent;

// //           content = content.replace(
// //             /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z?))/g,
// //             (m) => formatDate(m)
// //           );

// //           const tempDiv = document.createElement("div");
// //           tempDiv.innerHTML = content;

// //           tempDiv.querySelectorAll("p").forEach((p) => {
// //             const txt = p.textContent.trim().toLowerCase();
// //             if (
// //               (txt.includes("deputy registrar") ||
// //                 txt.includes("sign") ||
// //                 txt.includes("कुलसचिव")) &&
// //               p.textContent.length < 100
// //             )
// //               p.remove();
// //           });

// //           tempDiv.querySelectorAll("div").forEach((div) => {
// //             const txt = div.textContent.trim().toLowerCase();
// //             if (
// //               txt.includes("balmer lawrie") ||
// //               txt.includes("ashok travels") ||
// //               txt.includes("irctc")
// //             ) {
// //               div.remove();
// //             }
// //           });

// //           tempDiv.querySelectorAll("table").forEach((table) => {
// //             const allRows = Array.from(table.querySelectorAll("tr"));
// //             if (allRows.length > 0) {
// //               const firstRowCells = Array.from(
// //                 allRows[0].querySelectorAll("td, th")
// //               );
// //               const isMergedHeaderRow = firstRowCells.some((cell) => {
// //                 const cellText = cell.textContent.trim().toLowerCase();
// //                 return (
// //                   cellText.includes("leave") &&
// //                   cellText.includes("from") &&
// //                   cellText.includes("to")
// //                 );
// //               });

// //               if (isMergedHeaderRow) {
// //                 allRows[0].remove();

// //                 const thead = document.createElement("thead");
// //                 const headerRow = document.createElement("tr");
// //                 ["Leave Type", "From", "To"].forEach((text) => {
// //                   const th = document.createElement("th");
// //                   th.textContent = text;
// //                   headerRow.appendChild(th);
// //                 });
// //                 thead.appendChild(headerRow);
// //                 table.prepend(thead);

// //                 if (!table.querySelector('tbody')) {
// //                     const tbody = document.createElement('tbody');
// //                     Array.from(table.children).forEach(child => {
// //                         if (child.tagName === 'TR') {
// //                             tbody.appendChild(child);
// //                         }
// //                     });
// //                     if (tbody.children.length > 0) {
// //                         table.appendChild(tbody);
// //                     }
// //                 }
// //               }
// //             }
// //           });

// //           return tempDiv.innerHTML;
// //         };

// //         let bodyContent, referenceNo, subject, refsubject, header, footer, referenceDate, signatory, signaturePlace;

// //         if (bodyData?.body && bodyData?.subject) {
// //           bodyContent = processBodyContent(bodyData.body || "");
// //           referenceNo = bodyData.referenceNo || "";
// //           subject = bodyData.subject || "";
// //           refsubject = bodyData.refsubject || "";
// //           header = bodyData.header || "";
// //           footer = bodyData.footer || "";
// //           referenceDate = bodyData.referenceDate || new Date().toISOString();
// //           signatory = formData?.signingAuthority ;
// //           signaturePlace = "Place";

// //         } else {
// //           const jwtToken = Cookies.get("HRToken");
// //           if (!jwtToken) throw new Error("Authentication token missing.");
// //           const body = {
// //             employeeid,
// //             coverpageno,
// //             token: "HRFGVJISOVp1fncC",
// //             session_id: sessionId,
// //           };
// //           const response = await fetch(`${HostName}/Officeordertemppoc`, {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Bearer ${jwtToken}`,
// //             },
// //             body: JSON.stringify(body),
// //           });
// //           if (!response.ok) throw new Error("Failed to fetch Office Order");
// //           const encryptedData = await response.json();
// //           const encryptedPayload = encryptedData.Data ?? encryptedData.data;
// //           if (!encryptedPayload) throw new Error("Encrypted data missing");
// //           const decryptedString = await decryptData(encryptedPayload);
// //           const validData = validateJsonData(decryptedString);

// //           bodyContent = processBodyContent(validData.Body || validData.filled_template || "");
// //           referenceNo = validData.Referencenumber || "";
// //           subject = validData.Subject || validData.subject || "";
// //           refsubject = validData.refsubject || "";
// //           header = validData.Header || "";
// //           footer = validData.Footer || "";
// //           referenceDate = validData.date || validData.today_date || new Date().toISOString();
// //           signatory = formData?.signingAuthority || validData.signatory ;
// //           signaturePlace = validData.signaturePlace;
// //         }

// //         setParsedData({
// //           filled_template: bodyContent,
// //           body: bodyContent,
// //           Referencenumber: referenceNo,
// //           subject: subject,
// //           refsubject: refsubject,
// //           header: header,
// //           footer: footer,
// //           date: referenceDate,
// //           signatory: signatory,
// //           signaturePlace: signaturePlace,
// //         });

// //         if (formData?.signingAuthority) {
// //           await fetchSignatureImage(formData.signingAuthority);
// //         }

// //       } catch (err) {
// //         console.error(err);
// //         setError(err.message || "Failed to fetch Office Order");
// //         setParsedData(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     buildPreview();
// //   }, [coverpageno, formData, bodyData, sessionId, employeeid]);

// //   // Generate PDF automatically when parsedData is available
// //   useEffect(() => {
// //     if (parsedData && !pdfUrl && !generating) {
// //       generatePDF();
// //     }
// //   }, [parsedData, pdfUrl, generating]);

// //   // Clean up PDF URL when component unmounts
// //   useEffect(() => {
// //     return () => {
// //       if (pdfUrl) {
// //         URL.revokeObjectURL(pdfUrl);
// //       }
// //     };
// //   }, [pdfUrl]);

// //   const renderContent = () => {
// //     if (generating) {
// //       return (
// //         <div style={styles.centerMessage}>
// //           <p>Generating PDF preview...</p>
// //         </div>
// //       );
// //     }

// //     if (pdfUrl) {
// //       return (
// //         <div style={styles.pdfViewerContainer}>
// //           <iframe
// //             src={pdfUrl}
// //             style={styles.pdfViewer}
// //             title="Office Order PDF Preview"
// //           />
// //         </div>
// //       );
// //     }

// //     return null;
// //   };

// //   return (
// //     <div style={styles.modalOverlay} onClick={onBack}>
// //       <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
// //         <div style={styles.modalHeader}>
// //           <h3 style={styles.modalTitle}>Office Order Preview (Official)</h3>
// //           <div style={styles.modalActions}>
// //             {/* Download PDF button removed */}
// //             <button onClick={onBack} style={styles.closeButton}>
// //               ✕ Close
// //             </button>
// //           </div>
// //         </div>

// //         <div style={styles.modalBody}>
// //           {loading ? (
// //             <div style={styles.centerMessage}>
// //               <p>Loading preview...</p>
// //             </div>
// //           ) : error ? (
// //             <div style={styles.centerMessage}>
// //               <p style={{ color: "red" }}>⚠️ {error}</p>
// //             </div>
// //           ) : (
// //             renderContent()
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles = {
// //   modalOverlay: {
// //     position: "fixed",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: "rgba(0, 0, 0, 0.75)",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     zIndex: 1000,
// //     padding: "20px",
// //   },
// //   modalContent: {
// //     backgroundColor: "#fff",
// //     borderRadius: "12px",
// //     maxWidth: "1100px",
// //     width: "100%",
// //     maxHeight: "90vh",
// //     display: "flex",
// //     flexDirection: "column",
// //     boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
// //   },
// //   modalHeader: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     padding: "20px 28px",
// //     borderBottom: "1px solid #e5e7eb",
// //   },
// //   modalTitle: {
// //     margin: 0,
// //     fontSize: "18px",
// //     fontWeight: 600,
// //     color: "#111827",
// //   },
// //   modalActions: {
// //     display: "flex",
// //     gap: "12px",
// //     alignItems: "center",
// //   },
// //   closeButton: {
// //     padding: "8px 16px",
// //     border: "none",
// //     borderRadius: "6px",
// //     background: "#ef4444",
// //     color: "#fff",
// //     cursor: "pointer",
// //     fontSize: "14px",
// //     fontWeight: "bold",
// //   },
// //   modalBody: {
// //     flex: 1,
// //     overflowY: "auto",
// //     padding: "0",
// //     background: "#f9fafb",
// //   },
// //   centerMessage: {
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     minHeight: "300px",
// //     fontSize: "16px",
// //   },
// //   pdfViewerContainer: {
// //     width: "100%",
// //     height: "100%",
// //     minHeight: "70vh",
// //     border: "none",
// //   },
// //   pdfViewer: {
// //     width: "100%",
// //     height: "100%",
// //     minHeight: "70vh",
// //     border: "none",
// //     borderRadius: "0 0 12px 12px",
// //   },
// // };

// // export default OfficeOrderPreview;

// // import React, { useEffect, useState } from "react";
// // import Cookies from "js-cookie";
// // import Alerts from "src/components/ui/Alerts"; // ✅ adjust import path if needed

// // const OfficeOrderPreview = ({ onBack, coverpageno, employeeid }) => {
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [generating, setGenerating] = useState(false);
// //   const [pdfUrl, setPdfUrl] = useState(null);

// //   const fetchPDFFromAPI = async () => {
// //     try {
// //       setGenerating(true);
// //       setError("");
// //       setPdfUrl(null);

// //       const jwtToken = Cookies.get("HRToken");
// //       if (!jwtToken) throw new Error("Authentication token missing.");

// //       // ✅ Request body uses props as instructed
// //       const requestBody = {
// //         employeeid: employeeid,
// //         coverpageno: coverpageno,
// //         templatetype: "draft",
// //       };

// //       const response = await fetch(
// //         "https://wftest1.iitm.ac.in:8080/api/officeorder/pdf",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${jwtToken}`,
// //           },
// //           body: JSON.stringify(requestBody),
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(
// //           `Failed to fetch PDF: ${response.status} ${response.statusText}`
// //         );
// //       }

// //       const contentType = response.headers.get("content-type");

// //       if (contentType && contentType.includes("application/pdf")) {
// //         const pdfBlob = await response.blob();
// //         if (pdfBlob.size === 0) {
// //           // ✅ Empty PDF file
// //           throw new Error("No PDF found.");
// //         }
// //         const pdfObjectUrl = URL.createObjectURL(pdfBlob);
// //         setPdfUrl(pdfObjectUrl);
// //       } else if (contentType && contentType.includes("application/json")) {
// //         const responseData = await response.json();

// //         if (responseData.pdf_data || responseData.pdf_base64) {
// //           const pdfBase64 = responseData.pdf_data || responseData.pdf_base64;
// //           const base64Data = pdfBase64.replace(
// //             /^data:application\/pdf;base64,/,
// //             ""
// //           );

// //           if (!base64Data || base64Data.trim() === "") {
// //             throw new Error("No PDF found.");
// //           }

// //           const pdfBlob = base64ToBlob(base64Data, "application/pdf");
// //           const pdfObjectUrl = URL.createObjectURL(pdfBlob);
// //           setPdfUrl(pdfObjectUrl);
// //         } else {
// //           throw new Error("No PDF found.");
// //         }
// //       } else {
// //         throw new Error("No PDF found.");
// //       }
// //     } catch (err) {
// //       console.error("PDF fetch error:", err);
// //       setError(err.message || "Failed to load PDF.");
// //     } finally {
// //       setGenerating(false);
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ Helper to convert base64 → Blob
// //   const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
// //     const byteCharacters = atob(base64);
// //     const byteArrays = [];
// //     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
// //       const slice = byteCharacters.slice(offset, offset + sliceSize);
// //       const byteNumbers = new Array(slice.length);
// //       for (let i = 0; i < slice.length; i++) {
// //         byteNumbers[i] = slice.charCodeAt(i);
// //       }
// //       const byteArray = new Uint8Array(byteNumbers);
// //       byteArrays.push(byteArray);
// //     }
// //     return new Blob(byteArrays, { type: contentType });
// //   };

// //   useEffect(() => {
// //     fetchPDFFromAPI();
// //   }, [coverpageno, employeeid]);

// //   useEffect(() => {
// //     return () => {
// //       if (pdfUrl) URL.revokeObjectURL(pdfUrl);
// //     };
// //   }, [pdfUrl]);

// //   const renderContent = () => {
// //     if (generating || loading) {
// //       return (
// //         <div style={styles.centerMessage}>
// //           <p>Loading PDF preview...</p>
// //         </div>
// //       );
// //     }

// //     if (pdfUrl) {
// //       return (
// //         <div style={styles.pdfViewerContainer}>
// //           <iframe
// //             src={pdfUrl}
// //             style={styles.pdfViewer}
// //             title="Office Order PDF Preview"
// //           />
// //         </div>
// //       );
// //     }

// //     if (error) {
// //       // ✅ Show Alert if no PDF found
// //       return (
// //         <div style={styles.centerMessage}>
// //           <Alerts type="error" message={error || "No PDF found."} />
// //           <button onClick={fetchPDFFromAPI} style={styles.retryButton}>
// //             Retry
// //           </button>
// //         </div>
// //       );
// //     }

// //     return null;
// //   };

// //   return (
// //     <div style={styles.modalOverlay} onClick={onBack}>
// //       <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
// //         <div style={styles.modalHeader}>
// //           <h3 style={styles.modalTitle}>Office Order Preview (Official)</h3>
// //           <div style={styles.modalActions}>
// //             <button onClick={onBack} style={styles.closeButton}>
// //               ✕ Close
// //             </button>
// //           </div>
// //         </div>
// //         <div style={styles.modalBody}>{renderContent()}</div>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles = {
// //   modalOverlay: {
// //     position: "fixed",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: "rgba(0, 0, 0, 0.75)",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     zIndex: 1000,
// //     padding: "20px",
// //   },
// //   modalContent: {
// //     backgroundColor: "#fff",
// //     borderRadius: "12px",
// //     maxWidth: "1100px",
// //     width: "100%",
// //     maxHeight: "90vh",
// //     display: "flex",
// //     flexDirection: "column",
// //     boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
// //   },
// //   modalHeader: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     padding: "20px 28px",
// //     borderBottom: "1px solid #e5e7eb",
// //   },
// //   modalTitle: {
// //     margin: 0,
// //     fontSize: "18px",
// //     fontWeight: 600,
// //     color: "#111827",
// //   },
// //   modalActions: {
// //     display: "flex",
// //     gap: "12px",
// //     alignItems: "center",
// //   },
// //   closeButton: {
// //     padding: "8px 16px",
// //     border: "none",
// //     borderRadius: "6px",
// //     background: "#ef4444",
// //     color: "#fff",
// //     cursor: "pointer",
// //     fontSize: "14px",
// //     fontWeight: "bold",
// //   },
// //   retryButton: {
// //     padding: "8px 16px",
// //     border: "none",
// //     borderRadius: "6px",
// //     background: "#3b82f6",
// //     color: "#fff",
// //     cursor: "pointer",
// //     fontSize: "14px",
// //     fontWeight: "bold",
// //     marginTop: "10px",
// //   },
// //   modalBody: {
// //     flex: 1,
// //     overflowY: "auto",
// //     padding: "0",
// //     background: "#f9fafb",
// //   },
// //   centerMessage: {
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     minHeight: "300px",
// //     fontSize: "16px",
// //     flexDirection: "column",
// //   },
// //   pdfViewerContainer: {
// //     width: "100%",
// //     height: "100%",
// //     minHeight: "70vh",
// //     border: "none",
// //   },
// //   pdfViewer: {
// //     width: "100%",
// //     height: "100%",
// //     minHeight: "70vh",
// //     border: "none",
// //     borderRadius: "0 0 12px 12px",
// //   },
// // };

// // export default OfficeOrderPreview;



// import React, { useEffect, useState, useCallback } from "react";
// import Cookies from "js-cookie";
// import Alerts from "src/components/ui/Alerts"; 

// const OfficeOrderPreview = ({ onBack, coverpageno, employeeid }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [pdfUrl, setPdfUrl] = useState(null);

//   // Helper to convert base64 → Blob
//   const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
//     try {
//         const byteCharacters = atob(base64);
//         const byteArrays = [];
//         for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//             const slice = byteCharacters.slice(offset, offset + sliceSize);
//             const byteNumbers = new Array(slice.length);
//             for (let i = 0; i < slice.length; i++) {
//                 byteNumbers[i] = slice.charCodeAt(i);
//             }
//             const byteArray = new Uint8Array(byteNumbers);
//             byteArrays.push(byteArray);
//         }
//         return new Blob(byteArrays, { type: contentType });
//     } catch (e) {
//         console.error("Failed to decode base64 string:", e);
//         // This error often happens if the base64 string is malformed.
//         throw new Error("Invalid PDF data received from the server.");
//     }
//   };
  
//   // ✅ Use useCallback to memoize the fetch function
//   const fetchPDFFromAPI = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     // Revoke previous URL to prevent memory leaks if retrying
//     if (pdfUrl) {
//       URL.revokeObjectURL(pdfUrl);
//       setPdfUrl(null);
//     }

//     // ✅ Add console logs to check the props being used
//     console.log("Fetching PDF with:", { employeeid, coverpageno });

//     try {
//       const jwtToken = Cookies.get("HRToken");
//       if (!jwtToken) throw new Error("Authentication token missing. Please log in again.");

//       const requestBody = {
//         employeeid,
//         coverpageno,
//        // templatetype: "draft",
//       };

//       const response = await fetch(
//         "https://wftest1.iitm.ac.in:8080/api/officeorder/pdf",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       // ✅ IMPROVEMENT: More detailed error handling for failed API calls
//       if (!response.ok) {
//         const errorText = await response.text(); // Get detailed error from response body
//         console.error("API Error Response:", errorText);
//         throw new Error(
//           `Failed to fetch PDF. Server responded with: ${errorText || response.statusText}`
//         );
//       }
      
//       const contentType = response.headers.get("content-type");

//       // Case 1: Direct PDF Blob response
//       if (contentType && contentType.includes("application/pdf")) {
//         const pdfBlob = await response.blob();
//         if (pdfBlob.size === 0) {
//           throw new Error("The server returned an empty PDF file.");
//         }
//         const pdfObjectUrl = URL.createObjectURL(pdfBlob);
//         setPdfUrl(pdfObjectUrl);
//       } 
//       // Case 2: JSON response with Base64 data
//       else if (contentType && contentType.includes("application/json")) {
//         const responseData = await response.json();
//         const pdfBase64 = responseData.pdf_data || responseData.pdf_base64;
        
//         if (!pdfBase64 || pdfBase64.trim() === "") {
//           throw new Error("The server responded with success, but no PDF data was found.");
//         }
        
//         const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
//         const pdfBlob = base64ToBlob(base64Data, "application/pdf");
//         const pdfObjectUrl = URL.createObjectURL(pdfBlob);
//         setPdfUrl(pdfObjectUrl);
//       } 
//       // Case 3: Unexpected content type
//       else {
//         throw new Error(`Unexpected response type from server: ${contentType}`);
//       }
//     } catch (err) {
//       console.error("PDF fetch process failed:", err);
//       setError(err.message || "An unknown error occurred while loading the PDF.");
//     } finally {
//       setLoading(false);
//     }
//   }, [employeeid, coverpageno]); // ✅ Correct dependencies for useCallback

//   // Initial fetch when component mounts or props change
//   useEffect(() => {
//     if (employeeid && coverpageno) {
//       fetchPDFFromAPI();
//     } else {
//       setError("Required information (Employee ID or Coverpage No) is missing.");
//       setLoading(false);
//     }
//   }, [fetchPDFFromAPI, employeeid, coverpageno]);

//   // Cleanup effect to revoke the object URL on unmount
//   useEffect(() => {
//     return () => {
//       if (pdfUrl) {
//         URL.revokeObjectURL(pdfUrl);
//       }
//     };
//   }, [pdfUrl]);

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div style={styles.centerMessage}>
//           <p>Generating PDF preview, please wait...</p>
//         </div>
//       );
//     }

//     if (pdfUrl) {
//       return (
//         <div style={styles.pdfViewerContainer}>
//           <iframe
//             src={pdfUrl}
//             style={styles.pdfViewer}
//             title="Office Order PDF Preview"
//           />
//         </div>
//       );
//     }
    
//     // ✅ Error state is now the default if not loading and no PDF URL
//     return (
//       <div style={styles.centerMessage}>
//         <Alerts type="error" message={error || "Could not load the PDF preview."} />
//         <button onClick={fetchPDFFromAPI} style={styles.retryButton}>
//           Try Again
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div style={styles.modalOverlay} onClick={onBack}>
//       <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//         <div style={styles.modalHeader}>
//           <h3 style={styles.modalTitle}>Office Order Preview</h3>
//           <button onClick={onBack} style={styles.closeButton}>
//             ✕ Close
//           </button>
//         </div>
//         <div style={styles.modalBody}>{renderContent()}</div>
//       </div>
//     </div>
//   );
// };


// const styles = {
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.75)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     padding: "20px",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: "12px",
//     maxWidth: "1100px",
//     width: "100%",
//     height: "90vh", // Use height instead of maxHeight for consistency
//     display: "flex",
//     flexDirection: "column",
//     boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//   },
//   modalHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "20px 28px",
//     borderBottom: "1px solid #e5e7eb",
//   },
//   modalTitle: {
//     margin: 0,
//     fontSize: "18px",
//     fontWeight: 600,
//     color: "#111827",
//   },
//   closeButton: {
//     padding: "8px 16px",
//     border: "none",
//     borderRadius: "6px",
//     background: "#ef4444",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "bold",
//   },
//   retryButton: {
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "6px",
//     background: "#3b82f6",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "600",
//     marginTop: "20px",
//   },
//   modalBody: {
//     flex: 1,
//     overflow: "hidden", // Hide overflow to let the iframe handle scrolling
//     padding: "0",
//     background: "#f9fafb",
//     display: "flex", // Use flexbox to center content
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   centerMessage: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "20px",
//     textAlign: "center",
//   },
//   pdfViewerContainer: {
//     width: "100%",
//     height: "100%",
//   },
//   pdfViewer: {
//     width: "100%",
//     height: "100%",
//     border: "none",
//   },
// };

// export default OfficeOrderPreview;


// import React, { useEffect, useState, useCallback } from "react";
// import Cookies from "js-cookie";
// import Alerts from "src/components/ui/Alerts"; 

// const OfficeOrderPreview = ({ onBack, coverpageno, employeeid }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [pdfUrl, setPdfUrl] = useState(null);

//   // Helper to convert base64 → Blob
//   const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
//     try {
//         const byteCharacters = atob(base64);
//         const byteArrays = [];
//         for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//             const slice = byteCharacters.slice(offset, offset + sliceSize);
//             const byteNumbers = new Array(slice.length);
//             for (let i = 0; i < slice.length; i++) {
//                 byteNumbers[i] = slice.charCodeAt(i);
//             }
//             const byteArray = new Uint8Array(byteNumbers);
//             byteArrays.push(byteArray);
//         }
//         return new Blob(byteArrays, { type: contentType });
//     } catch (e) {
//         console.error("Failed to decode base64 string:", e);
//         throw new Error("Invalid PDF data received from the server.");
//     }
//   };
  
//   const fetchPDFFromAPI = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     if (pdfUrl) {
//       URL.revokeObjectURL(pdfUrl);
//       setPdfUrl(null);
//     }

//     console.log("Fetching PDF with:", { employeeid, coverpageno });

//     try {
//       const jwtToken = Cookies.get("HRToken");
//       if (!jwtToken) throw new Error("Authentication token missing. Please log in again.");

//       const requestBody = {
//         employeeid,
//         coverpageno,
//         templatetype: "draft",
//       };

//       const response = await fetch(
//         "https://wftest1.iitm.ac.in:8080/api/officeorder/pdf",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text(); 
//         console.error("API Error Response:", errorText);
//         throw new Error(
//           `Failed to fetch PDF. Server responded with: ${errorText || response.statusText}`
//         );
//       }
      
//       const contentType = response.headers.get("content-type");

//       if (contentType && contentType.includes("application/pdf")) {
//         const pdfBlob = await response.blob();
//         if (pdfBlob.size === 0) {
//           throw new Error("The server returned an empty PDF file.");
//         }
//         const pdfObjectUrl = URL.createObjectURL(pdfBlob);
//         setPdfUrl(pdfObjectUrl);
//       } 
//       else if (contentType && contentType.includes("application/json")) {
//         const responseData = await response.json();
//         const pdfBase64 = responseData.pdf_data || responseData.pdf_base64;
        
//         if (!pdfBase64 || pdfBase64.trim() === "") {
//           throw new Error("The server responded with success, but no PDF data was found.");
//         }
        
//         const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
//         const pdfBlob = base64ToBlob(base64Data, "application/pdf");
//         const pdfObjectUrl = URL.createObjectURL(pdfBlob);
//         setPdfUrl(pdfObjectUrl);
//       } 
//       else {
//         throw new Error(`Unexpected response type from server: ${contentType}`);
//       }
//     } catch (err) {
//       console.error("PDF fetch process failed:", err);
//       setError(err.message || "An unknown error occurred while loading the PDF.");
//     } finally {
//       setLoading(false);
//     }
//   }, [employeeid, coverpageno]);

//   useEffect(() => {
//     if (employeeid && coverpageno) {
//       fetchPDFFromAPI();
//     } else {
//       setError("Required information (Employee ID or Coverpage No) is missing.");
//       setLoading(false);
//     }
//   }, [fetchPDFFromAPI, employeeid, coverpageno]);

//   useEffect(() => {
//     return () => {
//       if (pdfUrl) {
//         URL.revokeObjectURL(pdfUrl);
//       }
//     };
//   }, [pdfUrl]);

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div style={styles.centerMessage}>
//           <p>Generating PDF preview, please wait...</p>
//         </div>
//       );
//     }

//     if (pdfUrl) {
//       return (
//         <div style={styles.pdfViewerContainer}>
//           <iframe
//             src={pdfUrl}
//             style={styles.pdfViewer}
//             title="Office Order PDF Preview"
//           />
//         </div>
//       );
//     }
    
//     return (
//       <div style={styles.centerMessage}>
//         <Alerts type="error" message={error || "Could not load the PDF preview."} />
//         <button onClick={fetchPDFFromAPI} style={styles.retryButton}>
//           Try Again
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div style={styles.modalOverlay} onClick={onBack}>
//       <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//         <div style={styles.modalHeader}>
//           <h3 style={styles.modalTitle}>Office Order Preview</h3>
//           <button onClick={onBack} style={styles.closeButton}>
//             ✕ Close
//           </button>
//         </div>
//         <div style={styles.modalBody}>{renderContent()}</div>
//       </div>
//     </div>
//   );
// };


// const styles = {
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.75)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     padding: "20px",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: "12px",
//     maxWidth: "1100px",
//     width: "100%",
//     height: "90vh",
//     display: "flex",
//     flexDirection: "column",
//     boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//   },
//   modalHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "20px 28px",
//     borderBottom: "1px solid #e5e7eb",
//   },
//   modalTitle: {
//     margin: 0,
//     fontSize: "18px",
//     fontWeight: 600,
//     color: "#111827",
//   },
//   closeButton: {
//     padding: "8px 16px",
//     border: "none",
//     borderRadius: "6px",
//     background: "#ef4444",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "bold",
//   },
//   retryButton: {
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "6px",
//     background: "#3b82f6",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "600",
//     marginTop: "20px",
//   },
//   modalBody: {
//     flex: 1,
//     overflow: "hidden",
//     padding: "0",
//     background: "#f9fafb",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   centerMessage: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "20px",
//     textAlign: "center",
//   },
//   pdfViewerContainer: {
//     width: "100%",
//     height: "100%",
//   },
//   pdfViewer: {
//     width: "100%",
//     height: "100%",
//     border: "none",
//   },
// };

// export default OfficeOrderPreview;


import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import Alerts from "src/components/ui/Alerts"; 

const OfficeOrderPreview = ({ onBack, coverpageno, employeeid }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  // Helper to convert base64 → Blob
  const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
    try {
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    } catch (e) {
        console.error("Failed to decode base64 string:", e);
        throw new Error("Invalid PDF data received from the server.");
    }
  };
  
  const fetchPDFFromAPI = useCallback(async () => {
    setLoading(true);
    setError("");
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }

    console.log("Fetching PDF with:", { employeeid, coverpageno });

    try {
      const jwtToken = Cookies.get("HRToken");
      if (!jwtToken) throw new Error("Authentication token missing. Please log in again.");

      const requestBody = {
        employeeid,
        coverpageno,
        templatetype: "draft",
      };

      const response = await fetch(
        "https://wftest1.iitm.ac.in:8080/api/officeorder/pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); 
        console.error("API Error Response:", errorText);
        throw new Error(
          `Failed to fetch PDF. Server responded with: ${errorText || response.statusText}`
        );
      }
      
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/pdf")) {
        const pdfBlob = await response.blob();
        if (pdfBlob.size === 0) {
          throw new Error("The server returned an empty PDF file.");
        }
        const pdfObjectUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfObjectUrl);
      } 
      else if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();
        const pdfBase64 = responseData.pdf_data || responseData.pdf_base64;
        
        if (!pdfBase64 || pdfBase64.trim() === "") {
          throw new Error("The server responded with success, but no PDF data was found.");
        }
        
        const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        const pdfBlob = base64ToBlob(base64Data, "application/pdf");
        const pdfObjectUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfObjectUrl);
      } 
      else {
        throw new Error(`Unexpected response type from server: ${contentType}`);
      }
    } catch (err) {
      console.error("PDF fetch process failed:", err);
      setError(err.message || "An unknown error occurred while loading the PDF.");
    } finally {
      setLoading(false);
    }
  }, [employeeid, coverpageno]);

  useEffect(() => {
    if (employeeid && coverpageno) {
      fetchPDFFromAPI();
    } else {
      setError("Required information (Employee ID or Coverpage No) is missing.");
      setLoading(false);
    }
  }, [fetchPDFFromAPI, employeeid, coverpageno]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const renderContent = () => {
    if (loading) {
      return (
        <div style={styles.centerMessage}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Generating PDF preview, please wait...</p>
        </div>
      );
    }

    if (pdfUrl) {
      return (
        <div style={styles.pdfViewerContainer}>
          <iframe
            src={pdfUrl}
            style={styles.pdfViewer}
            title="Office Order PDF Preview"
          />
        </div>
      );
    }
    
    return (
      <div style={styles.centerMessage}>
        <Alerts type="error" message={error || "Could not load the PDF preview."} />
        <button onClick={fetchPDFFromAPI} style={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  };

  return (
    <div style={styles.modalOverlay} onClick={onBack}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Office Order Preview</h3>
          <button onClick={onBack} style={styles.closeButton}>
            ✕ Close
          </button>
        </div>
        <div style={styles.modalBody}>{renderContent()}</div>
      </div>
    </div>
  );
};


const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    maxWidth: "1100px",
    width: "100%",
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    color: "#111827",
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
  retryButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    marginTop: "20px",
  },
  modalBody: {
    flex: 1,
    overflow: "hidden",
    padding: "0",
    background: "#f9fafb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  centerMessage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    textAlign: "center",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#6b7280",
    fontWeight: "500",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #e5e7eb",
    borderTop: "5px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  pdfViewerContainer: {
    width: "100%",
    height: "100%",
  },
  pdfViewer: {
    width: "100%",
    height: "100%",
    border: "none",
  },
};

// Add keyframe animation for the spinner
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Animation already exists
}

export default OfficeOrderPreview;