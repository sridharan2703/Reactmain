/**
 * @fileoverview Menuitems Configuration.
 * @module Menuitems
 * @description Defines the structure and content for the application's main sidebar navigation menu.
 * Each item includes a unique ID, display title, Tabler Icon component, and the target URL path.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - uniqueId: Utility from lodash to generate unique identifiers.
 * - Tabler Icons: A collection of React components for icons.
 */
import { uniqueId } from "lodash";

import {
  IconLayoutDashboard,
  IconCheckbox,
  IconNotes,
  IconMailSpark,
  IconBrandOffice,
  IconUserPlus 
} from "@tabler/icons-react";



/**
 * @typedef {Object} MenuItem
 * @property {string} id - Unique identifier for the menu item.
 * @property {string} title - The display text for the menu item.
 * @property {React.ComponentType} icon - The React component for the icon.
 * @property {string} href - The target URL path for the link.
 */

/**
 * @constant {MenuItem[]} Menuitems
 * @description Array of objects representing the navigation links in the sidebar.
 */
const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },

  {
    id: uniqueId(),
    title: "Inbox",
    icon: IconMailSpark,
    href: "/inbox",
  },
  {
    id: uniqueId(),
    title: "Task Summary",
    icon: IconNotes,
    href: "/TaskSummary",
  },

  {
    id: uniqueId(),
    title: "Components",
    icon: IconCheckbox,
    href: "/Components",
  },

  {
    id: uniqueId(),
    title: "Office Order",
    icon: IconBrandOffice,
    href: "/OfficeOrder",
  },
    {
    id: uniqueId(),
    title: "Employee E-File",
    icon: IconUserPlus,
    href: "/EmployeeEFile",
  },
];

export default Menuitems;