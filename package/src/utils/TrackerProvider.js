// // src/utils/TrackerProvider.jsx - Enhanced minimal version
// import { useTracker } from "src/hooks/useTracker";
// import { useState, useEffect } from "react";

// const TrackerProvider = ({ children, config = {} }) => {
//   const [isEnabled, setIsEnabled] = useState(true);

//   // Optional: Add error boundary logic
//   useEffect(() => {
//     const handleError = (event) => {
//       console.error('Tracker Error:', event.error);
//     };

//     window.addEventListener('error', handleError);
//     return () => window.removeEventListener('error', handleError);
//   }, []);

//   // Run the tracker hook with optional configuration
//   const trackerOptions = {
//     enableClickTracking: config.enableClickTracking !== false,
//     enableScrollTracking: config.enableScrollTracking !== false,
//     enablePageViews: config.enablePageViews !== false,
//     enableSessionTracking: config.enableSessionTracking !== false,
//     scrollDebounceMs: config.scrollDebounceMs || 1000,
//     excludeElements: config.excludeElements || [
//       'INPUT[type="password"]',
//       '[data-no-track]'
//     ],
//     ...config
//   };

//   // Only run tracker if enabled
//   if (isEnabled) {
//     try {
//       useTracker(trackerOptions);
//     } catch (error) {
//       console.warn('Tracker initialization failed:', error);
//       // Disable tracking on error to prevent repeated failures
//       setIsEnabled(false);
//     }
//   }

//   return children;
// };

// export default TrackerProvider;

// // Alternative: Even simpler version with just error handling
// export const SimpleTrackerProvider = ({ children, config }) => {
//   try {
//     useTracker(config);
//   } catch (error) {
//     console.warn('Tracking disabled due to error:', error);
//   }
  
//   return children;
// };

// // Alternative: With conditional tracking based on environment
// export const ConditionalTrackerProvider = ({ children, config }) => {
//   const shouldTrack = process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_TRACKING;
  
//   if (shouldTrack) {
//     useTracker(config);
//   }
  
//   return children;
// };

// src/utils/TrackerProvider.js - Simplified version
import { useTracker } from "src/hooks/useTracker";

const TrackerProvider = ({ children, config = {} }) => {
  const defaultConfig = {
    enableClickTracking: true,
    enableScrollTracking: true,
    enablePageViews: true,
    enableSessionTracking: true,
    scrollDebounceMs: 1000,
    excludeElements: [
      'INPUT[type="password"]',
      '[data-no-track]',
      '.no-track'
    ],
    trackOnlyVisibleElements: true,
    ...config
  };

  // This will only work if called within router context
  useTracker(defaultConfig);
  
  return children;
};

export default TrackerProvider;