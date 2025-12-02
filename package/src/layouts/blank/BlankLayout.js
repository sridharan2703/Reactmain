// import { Outlet } from "react-router";

// const BlankLayout = () => (
//   <>
//     <Outlet />
//   </>
// );

// export default BlankLayout;

import { Outlet } from "react-router";

/**
 * @fileoverview BlankLayout Component.
 * @module BlankLayout
 * @description A minimal layout component used for pages that do not require 
 * the standard application header, sidebar, or footer (e.g., Login, 404 Error).
 * It simply renders the content of the matched child route via the Outlet component.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - Outlet: React Router v6 component for rendering child routes.
 */

/**
 * BlankLayout Functional Component.
 * Renders only the content of the current child route.
 *
 * @returns {JSX.Element} The minimal layout wrapping the child route content.
 */
const BlankLayout = () => (
  <>
    {/* Renders the element defined for the current matched child route */}
    <Outlet />
  </>
);

export default BlankLayout;