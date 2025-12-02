// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { trackEvent } from "src/utils/track"; // adjust path if needed

// export const useTracker = () => {
//   const location = useLocation();

//   useEffect(() => {
//     // Log page views
//     trackEvent("page_view", { path: location.pathname });
//   }, [location]);

//   useEffect(() => {
//     // Track all clicks
//     const handleClick = (event) => {
//       const targetText = event.target.innerText || event.target.value || "N/A";
//       const targetType = event.target.tagName;

//       trackEvent("click", {
//         element: targetType,
//         text: targetText,
//         id: event.target.id || null,
//         class: event.target.className || null,
//       });
//     };

//     // Track scrolls (debounced)
//     let scrollTimeout;
//     const handleScroll = () => {
//       if (scrollTimeout) clearTimeout(scrollTimeout);
//       scrollTimeout = setTimeout(() => {
//         trackEvent("scroll", { y: window.scrollY });
//       }, 1000);
//     };

//     document.addEventListener("click", handleClick);
//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       document.removeEventListener("click", handleClick);
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);
// };


import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "src/utils/track"; // adjust path if needed

/**
 * @fileoverview Custom React hook for tracking user interactions and page views.
 * @module useTracker
 * @description Provides centralized tracking logic, listening for page view changes (via router location), 
 * user clicks, and scroll events, and sends them to an external tracking utility (`trackEvent`).
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - useEffect: React hook for side effects.
 * - useLocation: React Router hook to access current location object.
 * - trackEvent: Utility function for sending analytics events.
 */

/**
 * useTracker Custom Hook.
 * Implements logic to track user activity within the application lifecycle.
 *
 * @hook
 * @returns {void}
 */
export const useTracker = () => {
  const location = useLocation();

  /**
   * Effect for tracking page views.
   * Runs whenever the router location changes.
   */
  useEffect(() => {
    // Log page views
    trackEvent("page_view", { path: location.pathname });
  }, [location]);

  /**
   * Effect for tracking clicks and scrolls.
   * Runs once on component mount to set up global event listeners.
   */
  useEffect(() => {
    // Track all clicks
    const handleClick = (event) => {
      // Safely extract text content or value from the clicked element
      const targetText = event.target.innerText || event.target.value || "N/A";
      // Get the type of element (e.g., 'BUTTON', 'DIV', 'A')
      const targetType = event.target.tagName;

      // Send a 'click' event with element details
      trackEvent("click", {
        element: targetType,
        text: targetText,
        id: event.target.id || null,
        class: event.target.className || null,
      });
    };

    // Track scrolls (debounced)
    let scrollTimeout;
    const handleScroll = () => {
      // Clear previous timeout to debounce the scroll event
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      // Set a new timeout to log the scroll position after a delay (1000ms)
      scrollTimeout = setTimeout(() => {
        trackEvent("scroll", { y: window.scrollY });
      }, 1000);
    };

    // Attach event listeners to the document/window
    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);

    /**
     * Cleanup function to remove event listeners on unmount or before re-running the effect.
     */
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount
};