/**
 * @fileoverview Compact dialogbox component with API Integration
 * @module components/Tasksummarydialog
 * @author Elakiya
 * @date 12/08/2025
 */

import Cookies from "js-cookie"; 
 import { HostName } from "src/assets/host/Host"; 
import { decryptData as cryptoDecryptData, encryptPayloadForGo as cryptoEncryptPayloadForGo } from "src/components/Encryption/EncryptionKey";
const base64ToBlob = (base64, mimeType = '') => { /* Placeholder for Base64 to Blob logic */ return new Blob(); }; 
// =========================================================================

// --- API Endpoints ---
const TASK_SUMMARY_ENDPOINT = '/TaskSummary';
const TASK_DETAIL_ENDPOINT = '/OfficeOrder_Tasksummary';
const PDF_ENDPOINT = '/OfficeOrder_Historypdf';

// --- API Filter ID Mappings (THESE ARE EXPORTED) ---
export const STATUS_TO_API_ID = {
  'Completed': 3, 'On Going': 4, 'Saved as Draft': 6, 'Deleted': 1, 'Pending': 5, 'all': null
};

export const PRIORITY_TO_API_ID = {
    'normal': 17, 'high': 18, 'critical': 19, 'all': null
};

// --- API Token ---
const API_STATIC_TOKEN = "HRFGVJISOVp1fncC";

// --- Dynamic ID Retrieval Functions (THESE ARE EXPORTED) ---
export const getAuthHeaders = () => {
  const token = Cookies.get("HRToken");
  if (!token) {
    const error = new Error("No authentication token found");
    error.userMessage = "Your session has expired. Please log in again.";
    throw error;
  }
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}`, };
};

export const getSessionId = () => Cookies.get('session_id');
export const getEmployeeId = () => Cookies.get('EmpId');
// ----------------------------------------------------------------------------------
// NOTE: getSessionId IS EXPORTED HERE. The error is an environmental issue if this code is correct.
// ----------------------------------------------------------------------------------

/**
 * Generic function to handle the encrypted API request and decrypted response.
 */
const executeEncryptedApiCall = async (endpoint, rawPayload) => {
    const sessionId = getSessionId();
    const fullPayload = { ...rawPayload, P_id: sessionId, token: API_STATIC_TOKEN };
    const headers = getAuthHeaders();
    
    if (!sessionId) {
         const error = new Error("Missing Session ID");
         error.userMessage = "Session ID not found in cookies. Cannot proceed.";
         throw error;
    }

    // =====================================================================
    // Special handling for PDF endpoint 
    // =====================================================================
    if (endpoint === PDF_ENDPOINT) {

        try {
            // 1. Encrypt the request payload
            const encryptedPayload = await cryptoEncryptPayloadForGo(fullPayload);
            
            // 2. Send the request with the encrypted wrapper
            const response = await fetch(`${HostName}${endpoint}`, {
                method: 'POST',
                headers, 
                body: JSON.stringify({ Data: encryptedPayload }), 
            });

            if (!response.ok) {
                 const errorText = await response.text().catch(() => "Response body not readable.");
                 throw new Error(`PDF API request failed with status: ${response.status}. Server error preview: ${errorText.substring(0, 100)}`);
            }
            
            // Clone the response to check content type/raw data without consuming the stream
            const clonedResponse = response.clone();
            
            // 3. Check Content-Type - The ultimate check for a raw file response
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/pdf")) {
            
                return response;
            }

            // 4. If Content-Type is NOT PDF, try reading as text (expected Base64 or JSON)
            const responseText = await clonedResponse.text();
            const cleanedText = responseText.replace(/^\uFEFF/, "").trim();
            
            if (!cleanedText) {
                throw new Error("PDF response is empty.");
            }

            // Check if it's the raw PDF header (if the server forgot Content-Type header)
            if (cleanedText.startsWith('%PDF')) {
           
                 return response; 
            }

            // --- Base64/JSON Parsing Logic (for when server behaves) ---
            const looksLikeBase64 = /^[A-Za-z0-9+/=]{50,}/.test(cleanedText) && !cleanedText.startsWith('{') && !cleanedText.startsWith('[');
            
            if (looksLikeBase64) {
            
                return cleanedText; // Return Base64 string
            }
            
            if (cleanedText.startsWith('{') || cleanedText.startsWith('[')) {
                try {
                    const parsedPdfResponse = JSON.parse(cleanedText);
                    
                    const pdfData = 
                        parsedPdfResponse.pdf_data || parsedPdfResponse.pdf_base64 ||
                        parsedPdfResponse.PDF || parsedPdfResponse.pdf ||
                        parsedPdfResponse.data || parsedPdfResponse.Data ||
                        (typeof parsedPdfResponse === 'string' ? parsedPdfResponse : null);
                    
                    if (pdfData) return pdfData;
                    
                    throw new Error("PDF data not found in expected response fields within JSON.");
                } catch (jsonError) {
                    if (/[A-Za-z0-9+/=]{100,}/.test(cleanedText)) return cleanedText;
                    throw new Error(`PDF response looks like JSON but failed to parse: ${jsonError.message}`);
                }
            }
            
            const base64Match = cleanedText.match(/[A-Za-z0-9+/=]{100,}/);
            if (base64Match) return base64Match[0];
            
            throw new Error(`Unable to extract PDF data. Response preview: ${cleanedText.substring(0, 200)}`);

        } catch (e) {
             const userMessage = e.userMessage || e.message || "PDF generation failed. Check server logs.";
             const wrappedError = new Error(userMessage);
             wrappedError.originalError = e;
             throw wrappedError;
        }
    }
    // =====================================================================
    // End of special handling. Resume standard ENCRYPTED call logic.
    // =====================================================================
    
    // Standard Encrypted Call (for other endpoints)
    try {
        const encryptedPayload = await cryptoEncryptPayloadForGo(fullPayload);
        
        const response = await fetch(`${HostName}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ Data: encryptedPayload }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Response body not readable.");
            throw new Error(`API request failed with status: ${response.status}. Server error preview: ${errorText.substring(0, 100)}`);
        }

        const clonedResponse = response.clone();
        let encryptedResponse;
        let responseText;

        try {
            encryptedResponse = await response.json(); 
        } catch (e) {
            try {
                responseText = await clonedResponse.text();
            } catch (textError) {
                responseText = "Response body consumed or unreadable. (Clone failed)";
            }

           
            throw new Error(`Failed to parse server's encrypted wrapper as JSON. Preview: ${responseText.substring(0, 100)}`);
        }
        
        if (!encryptedResponse.Data) {
            throw new Error("Encrypted response data missing from server.");
        }

        // Decrypt the response
        let decryptedResponse;
        try {
            decryptedResponse = await cryptoDecryptData(encryptedResponse.Data);
        } catch (decryptError) {
          
            throw new Error(`Failed to decrypt response: ${decryptError.message}`);
        }
        
        // Ensure we have a string to work with
        const decryptedString = typeof decryptedResponse === 'string' 
            ? decryptedResponse 
            : String(decryptedResponse);
            
        const cleanedText = decryptedString.replace(/^\uFEFF/, "").trim();

        // ===== Regular JSON parsing for non-PDF endpoints =====
        if (!cleanedText) {
            throw new Error("Response is empty after decryption.");
        }
        
        // Check if it's already an object 
        if (typeof decryptedResponse === 'object' && decryptedResponse !== null) {
            if (decryptedResponse.Data && Array.isArray(decryptedResponse.Data.Records)) {
                return decryptedResponse.Data.Records;
            }
            if (Array.isArray(decryptedResponse)) {
                return decryptedResponse;
            }
            if (decryptedResponse.Records && Array.isArray(decryptedResponse.Records)) {
                return decryptedResponse.Records;
            }
            return decryptedResponse;
        }
        
        // Try to parse as JSON only if it's a string
        try {
            const parsedResponse = JSON.parse(cleanedText);
            
            if (parsedResponse.Data && Array.isArray(parsedResponse.Data.Records)) {
                return parsedResponse.Data.Records;
            }
            if (Array.isArray(parsedResponse)) {
                return parsedResponse;
            }
            if (parsedResponse.Records && Array.isArray(parsedResponse.Records)) {
                return parsedResponse.Records;
            }
            
            return parsedResponse;

        } catch (jsonError) {
            throw new Error(`Failed to parse API response as JSON: ${jsonError.message}`);
        }

    } catch (e) {
     
        
        const userMessage = e.userMessage || e.message || "Secure communication failed. Please check session and API configuration.";
        const wrappedError = new Error(userMessage);
        wrappedError.originalError = e;
        throw wrappedError;
    }
};

/**
 * Fetches the task summary for the grid.
 */
export const fetchTaskSummary = async (statusFilter, priorityFilter) => {
    const apiStatusId = STATUS_TO_API_ID[statusFilter];
    const apiPriorityId = PRIORITY_TO_API_ID[priorityFilter];
    const rawRequestBody = { "employee_id": getEmployeeId(), "task_status_id": apiStatusId, "priority": apiPriorityId };
    const records = await executeEncryptedApiCall(TASK_SUMMARY_ENDPOINT, rawRequestBody);
    return Array.isArray(records) ? records : (records.task_id ? [records] : []);
};

/**
 * Fetches the full task details for the dialog.
 */
export const fetchTaskDetails = async (process_id, task_id) => {
    const rawRequestBody = { "process_id": process_id, "task_id": task_id };
    const result = await executeEncryptedApiCall(TASK_DETAIL_ENDPOINT, rawRequestBody);
    return Array.isArray(result) && result.length > 0 ? result[0] : result;
};


/**
 * Fetches the PDF document (Base64 encoded) and converts it to a Blob URL.
 */
export const fetchPDFDocument = async (order_no, templatetype) => {
    const rawRequestBody = { templatetype, officeorderhistorypdf: order_no };

  
    
    try {
        const responseData = await executeEncryptedApiCall(PDF_ENDPOINT, rawRequestBody);
        
        let pdfBase64 = null;
        let pdfBlob = null;
        
        if (responseData instanceof Response) {
            // Case 1: Server returned raw PDF file bytes (The hacky workaround for a misconfigured server)
        
            pdfBlob = await responseData.blob(); 
        } else {
            // Case 2: Server returned Base64 string (The intended state)
            pdfBase64 = 
                responseData?.pdf_data || responseData?.pdf_base64 ||
                responseData?.PDF || responseData?.pdf ||
                responseData; 

            if (!pdfBase64) {
           
                throw new Error("No Base64 PDF data found in API response.");
            }
            
          
            const cleanedBase64 = (pdfBase64.toString() || "").replace(/^data:application\/pdf;base64,/, "");
            pdfBlob = base64ToBlob(cleanedBase64, "application/pdf");
        }
        
        if (!pdfBlob) {
             throw new Error("Could not create PDF Blob from server response.");
        }
        
        return URL.createObjectURL(pdfBlob);
        
    } catch (error) {
    
        throw error;
    }
};