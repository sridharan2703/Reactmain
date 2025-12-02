// import {
//   decryptData,
//   validateJsonData,
// } from "src/components/Decryption/Decrypt";

// // Utility to send user activity logs to Go API
// export const trackEvent = async (eventName, extraData = {}) => {
//   try {
//     // Read values from localStorage/sessionStorage/cookies
//     const localData = JSON.parse(localStorage.getItem("userSession") || "{}");

//     const token = localData.HRToken || "";
//     const session_id = localData.session_id || "";
//     const employeeid = localData.EmpId || "";
//     const user_id = localData.userId || "";
//     const username = localData.username || "";

//     const payload = {
//       token,
//       session_id,
//       event_name: eventName,
//       employeeid,
//       event_data: {
//         user_id,
//         username,
//         ip_address: window.location.hostname,
//         device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
//         ...extraData, // allow extra fields
//       },
//     };

//     // 🔹 Log payload before sending
//     console.log("📌 Sending User Activity Log:", payload);

//     const response = await fetch(
//       "https://wftest1.iitm.ac.in:5000/InsertUserActivityLog",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     // 🔹 API returns encrypted response
//     const encryptedData = await response.json();
//     console.log("🔒 Encrypted Response:", encryptedData);

//     if (!encryptedData.Data) {
//       throw new Error("No encrypted data received from API");
//     }

//     // 🔹 Decrypt and validate
//     const decryptedData = await decryptData(encryptedData.Data);
//     const parsedData = validateJsonData(decryptedData);

//     console.log("🔓 Decrypted Response:", parsedData);

//     if (parsedData?.message) {
//       console.log(`✅ ${parsedData.message}`);
//     }
//   } catch (err) {
//     console.error("🔥 Error inserting user activity log:", err);
//   }
// };



// // src/utils/track.js - Enhanced version
// import { decryptData, validateJsonData } from "src/components/Decryption/Decrypt";

// // Rate limiting to prevent spam
// const eventQueue = new Map();
// const RATE_LIMIT_MS = 1000; // 1 second between same events

// // Retry mechanism for failed requests
// const retryQueue = [];
// const MAX_RETRIES = 3;

// export const trackEvent = async (eventName, extraData = {}, options = {}) => {
//   const { 
//     skipRateLimit = false, 
//     priority = 'normal' 
//   } = options;

//   try {
//     // Rate limiting check (except for high priority events)
//     if (!skipRateLimit && priority !== 'high') {
//       const lastEventTime = eventQueue.get(eventName);
//       const now = Date.now();
      
//       if (lastEventTime && (now - lastEventTime) < RATE_LIMIT_MS) {
//         console.log(`⏱️ Rate limited: ${eventName}`);
//         return;
//       }
//       eventQueue.set(eventName, now);
//     }

//     // Enhanced data collection
//     const localData = getStorageData();
//     if (!localData.token || !localData.session_id) {
//       console.warn("🚨 Missing authentication data for tracking");
//       return;
//     }

//     const payload = {
//       token: localData.token,
//       session_id: localData.session_id,
//       event_name: eventName,
//       employeeid: localData.employeeid,
//       timestamp: new Date().toISOString(),
//       event_data: {
//         user_id: localData.user_id,
//         username: localData.username,
//         ip_address: window.location.hostname,
//         device: getDeviceInfo(),
//         browser: getBrowserInfo(),
//         screen_resolution: `${window.screen.width}x${window.screen.height}`,
//         viewport_size: `${window.innerWidth}x${window.innerHeight}`,
//         user_agent: navigator.userAgent,
//         referrer: document.referrer || null,
//         ...extraData,
//       },
//     };

//     console.log("📌 Sending User Activity Log:", {
//       event: eventName,
//       timestamp: payload.timestamp,
//       data: payload.event_data
//     });

//     await sendTrackingData(payload);

//   } catch (err) {
//     console.error("🔥 Error in trackEvent:", err);
//     // Add to retry queue for later processing
//     addToRetryQueue(eventName, extraData, options);
//   }
// };

// // Helper function to get storage data safely
// const getStorageData = () => {
//   try {
//     const localData = JSON.parse(localStorage.getItem("userSession") || "{}");
//     return {
//       token: localData.HRToken || "",
//       session_id: localData.session_id || "",
//       employeeid: localData.EmpId || "",
//       user_id: localData.userId || "",
//       username: localData.username || "",
//     };
//   } catch (error) {
//     console.error("Error reading localStorage:", error);
//     return {};
//   }
// };

// // Enhanced device detection
// const getDeviceInfo = () => {
//   const ua = navigator.userAgent;
//   if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
//   if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return "mobile";
//   return "desktop";
// };

// // Browser detection
// const getBrowserInfo = () => {
//   const ua = navigator.userAgent;
//   if (ua.includes("Chrome")) return "Chrome";
//   if (ua.includes("Firefox")) return "Firefox";
//   if (ua.includes("Safari")) return "Safari";
//   if (ua.includes("Edge")) return "Edge";
//   return "Unknown";
// };

// // Send tracking data with retry logic
// const sendTrackingData = async (payload, retryCount = 0) => {
//   try {
//     const response = await fetch(
//       "https://wftest1.iitm.ac.in:5000/InsertUserActivityLog",
//       {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const encryptedData = await response.json();
//     console.log("🔒 Encrypted Response received");

//     if (!encryptedData.Data) {
//       throw new Error("No encrypted data received from API");
//     }

//     const decryptedData = await decryptData(encryptedData.Data);
//     const parsedData = validateJsonData(decryptedData);

//     console.log("🔓 Tracking successful:", parsedData?.message || "Success");
    
//     return parsedData;

//   } catch (error) {
//     if (retryCount < MAX_RETRIES) {
//       console.log(`🔄 Retrying request (${retryCount + 1}/${MAX_RETRIES})`);
//       await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // exponential backoff
//       return sendTrackingData(payload, retryCount + 1);
//     }
//     throw error;
//   }
// };

// // Add failed events to retry queue
// const addToRetryQueue = (eventName, extraData, options) => {
//   retryQueue.push({ eventName, extraData, options, timestamp: Date.now() });
  
//   // Limit retry queue size
//   if (retryQueue.length > 50) {
//     retryQueue.shift(); // Remove oldest
//   }
// };

// // Process retry queue periodically
// const processRetryQueue = async () => {
//   if (retryQueue.length === 0) return;
  
//   const now = Date.now();
//   const itemsToRetry = retryQueue.filter(item => (now - item.timestamp) > 5000); // Wait 5 seconds before retry
  
//   for (const item of itemsToRetry) {
//     try {
//       await trackEvent(item.eventName, item.extraData, { ...item.options, skipRateLimit: true });
//       // Remove from retry queue if successful
//       const index = retryQueue.indexOf(item);
//       if (index > -1) retryQueue.splice(index, 1);
//     } catch (error) {
//       console.error("Retry failed:", error);
//     }
//   }
// };

// // Process retry queue every 30 seconds
// setInterval(processRetryQueue, 30000);

// // Specific tracking functions for common events
// export const trackPageView = (path, additionalData = {}) => {
//   trackEvent("page_view", {
//     path,
//     title: document.title,
//     url: window.location.href,
//     ...additionalData
//   }, { priority: 'high' });
// };

// export const trackClick = (element, additionalData = {}) => {
//   trackEvent("click", {
//     element_type: element.tagName?.toLowerCase(),
//     element_text: element.innerText?.slice(0, 100) || element.value?.slice(0, 100) || "N/A",
//     element_id: element.id || null,
//     element_class: element.className || null,
//     element_href: element.href || null,
//     ...additionalData
//   });
// };

// export const trackScroll = (scrollData) => {
//   trackEvent("scroll", {
//     scroll_y: scrollData.y,
//     scroll_percentage: Math.round((scrollData.y / (document.body.scrollHeight - window.innerHeight)) * 100),
//     page_height: document.body.scrollHeight,
//     viewport_height: window.innerHeight
//   });
// };

// export const trackUserSession = (action, additionalData = {}) => {
//   trackEvent(`session_${action}`, {
//     action,
//     ...additionalData
//   }, { priority: 'high', skipRateLimit: true });
// };

// export const trackError = (error, context = {}) => {
//   trackEvent("error", {
//     error_message: error.message,
//     error_stack: error.stack,
//     error_type: error.name,
//     context,
//     url: window.location.href
//   }, { priority: 'high', skipRateLimit: true });
// };


// src/utils/track.js
import { decryptData, validateJsonData } from "src/components/Decryption/Decrypt";

// Rate limiting to prevent spam
const eventQueue = new Map();
const RATE_LIMIT_MS = 1000;

// Utility to get storage data safely
const getStorageData = () => {
  try {
    const localData = JSON.parse(localStorage.getItem("userSession") || "{}");
    return {
      token: localData.HRToken || "",
      session_id: localData.session_id || "",
      employeeid: localData.EmpId || "",
      user_id: localData.userId || "",
      username: localData.username || "",
    };
  } catch (error) {
    console.error("Error reading localStorage:", error);
    return {};
  }
};

// Enhanced device detection
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return "mobile";
  return "desktop";
};

// Browser detection
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Unknown";
};

// Main tracking function
export const trackEvent = async (eventName, extraData = {}) => {
  try {
    // Rate limiting check
    const lastEventTime = eventQueue.get(eventName);
    const now = Date.now();
    
    if (lastEventTime && (now - lastEventTime) < RATE_LIMIT_MS) {
      console.log(`⏱️ Rate limited: ${eventName}`);
      return;
    }
    eventQueue.set(eventName, now);

    // Get authentication data
    const localData = getStorageData();
    if (!localData.token || !localData.session_id) {
      console.warn("🚨 Missing authentication data for tracking");
      return;
    }

    const payload = {
      token: localData.token,
      session_id: localData.session_id,
      event_name: eventName,
      employeeid: localData.employeeid,
      timestamp: new Date().toISOString(),
      event_data: {
        user_id: localData.user_id,
        username: localData.username,
        ip_address: window.location.hostname,
        device: getDeviceInfo(),
       
      },
    };

    console.log("📌 Sending User Activity Log:", {
      event: eventName,
      timestamp: payload.timestamp,
      data: payload.event_data
    });

    const response = await fetch(
      "https://wftest1.iitm.ac.in:5000/InsertUserActivityLog",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const encryptedData = await response.json();
    console.log("🔒 Encrypted Response received");

    if (!encryptedData.Data) {
      throw new Error("No encrypted data received from API");
    }

    const decryptedData = await decryptData(encryptedData.Data);
    const parsedData = validateJsonData(decryptedData);

    console.log("🔓 Tracking successful:", parsedData?.message || "Success");
    
    return parsedData;

  } catch (err) {
    console.error("🔥 Error inserting user activity log:", err);
  }
};

// Specific tracking functions
export const trackPageView = (path, additionalData = {}) => {
  trackEvent("page_view", {
    path,
    title: document.title,
    url: window.location.href,
    ...additionalData
  });
};

export const trackClick = (element, additionalData = {}) => {
  trackEvent("click", {
    element_type: element.tagName?.toLowerCase(),
    element_text: (element.innerText || element.value || "N/A").slice(0, 100),
    element_id: element.id || null,
    element_class: element.className || null,
    element_href: element.href || null,
    ...additionalData
  });
};

export const trackScroll = (scrollData) => {
  trackEvent("scroll", {
    scroll_y: scrollData.y,
    scroll_percentage: Math.round((scrollData.y / (document.body.scrollHeight - window.innerHeight)) * 100),
    page_height: document.body.scrollHeight,
    viewport_height: window.innerHeight,
    ...scrollData
  });
};

export const trackUserSession = (action, additionalData = {}) => {
  trackEvent(`session_${action}`, {
    action,
    ...additionalData
  });
};