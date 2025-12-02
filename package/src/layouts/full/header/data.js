/**
 * @fileoverview Header Data Configuration.
 * @module HeaderData
 * @description Defines the data structures used for various dropdown menus (Notifications, Profile, Apps, Pages) 
 * in the application's header/topbar component.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - Static image and SVG assets for avatars and icons.
 */
import img1 from "src/assets/images/profile/user-1.jpg";
import img2 from "src/assets/images/profile/user-2.jpg";
import img3 from "src/assets/images/profile/user-3.jpg";
import img4 from "src/assets/images/profile/user-4.jpg";

import icon1 from "src/assets/images/svgs/icon-account.svg";
import icon2 from "src/assets/images/svgs/icon-inbox.svg";
import icon3 from "src/assets/images/svgs/icon-tasks.svg";

import ddIcon1 from "src/assets/images/svgs/icon-dd-chat.svg";
import ddIcon2 from "src/assets/images/svgs/icon-dd-cart.svg";
import ddIcon3 from "src/assets/images/svgs/icon-dd-invoice.svg";
import ddIcon4 from "src/assets/images/svgs/icon-dd-date.svg";
import ddIcon5 from "src/assets/images/svgs/icon-dd-mobile.svg";
import ddIcon6 from "src/assets/images/svgs/icon-dd-lifebuoy.svg";
import ddIcon7 from "src/assets/images/svgs/icon-dd-message-box.svg";
import ddIcon8 from "src/assets/images/svgs/icon-dd-application.svg";

/**
 * @typedef {Object} NotificationItem
 * @property {string} avatar - URL or path to the user/event avatar image.
 * @property {string} title - Main notification title.
 * @property {string} subtitle - Secondary descriptive text.
 */

/**
 * @constant {NotificationItem[]} notifications
 * @description Array of data objects for the Notifications Dropdown menu.
 */
const notifications = [
  {
    avatar: img1,
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    avatar: img2,
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: img3,
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: img4,
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
  {
    avatar: img1,
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    avatar: img2,
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: img3,
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: img4,
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
];

/**
 * @typedef {Object} ProfileItem
 * @property {string} href - Target URL path.
 * @property {string} title - Main title/label.
 * @property {string} subtitle - Secondary description.
 * @property {string} icon - URL or path to the item's icon image.
 */

/**
 * @constant {ProfileItem[]} profile
 * @description Array of data objects for the User Profile Dropdown menu.
 */
const profile = [
  {
    href: "/user-profile",
    title: "My Profile",
    subtitle: "Account Settings",
    icon: icon1,
  },
  {
    href: "/apps/email",
    title: "My Inbox",
    subtitle: "Messages & Emails",
    icon: icon2,
  },
  {
    href: "/apps/notes",
    title: "My Tasks",
    subtitle: "To-do and Daily Tasks",
    icon: icon3,
  },
];

/**
 * @typedef {Object} AppsLinkItem
 * @property {string} href - Target URL path.
 * @property {string} title - Main title/label (Application Name).
 * @property {string} subtext - Secondary descriptive text.
 * @property {string} avatar - URL or path to the application's icon image.
 */

/**
 * @constant {AppsLinkItem[]} appsLink
 * @description Array of data objects for the Quick Links/Apps Dropdown menu.
 */
const appsLink = [
  {
    href: "/apps/chats",
    title: "Chat Application",
    subtext: "Messages & Emails",
    avatar: ddIcon1,
  },
  {
    href: "/apps/ecommerce/shop",
    title: "eCommerce App",
    subtext: "Messages & Emails",
    avatar: ddIcon2,
  },
  {
    href: "/",
    title: "Invoice App",
    subtext: "Messages & Emails",
    avatar: ddIcon3,
  },
  {
    href: "/apps/calendar",
    title: "Calendar App",
    subtext: "Messages & Emails",
    avatar: ddIcon4,
  },
  {
    href: "/apps/contacts",
    title: "Contact Application",
    subtext: "Account settings",
    avatar: ddIcon5,
  },
  {
    href: "/apps/tickets",
    title: "Tickets App",
    subtext: "Account settings",
    avatar: ddIcon6,
  },
  {
    href: "/apps/email",
    title: "Email App",
    subtext: "To-do and Daily tasks",
    avatar: ddIcon7,
  },
  {
    href: "/",
    title: "Kanban Application",
    subtext: "To-do and Daily tasks",
    avatar: ddIcon8,
  },
];

/**
 * @typedef {Object} PageLinkItem
 * @property {string} href - Target URL path.
 * @property {string} title - Page title/label.
 */

/**
 * @constant {PageLinkItem[]} pageLinks
 * @description Array of data objects for the Pages Quick Links section.
 */
const pageLinks = [
  {
    href: "/pricing",
    title: "Pricing Page",
  },
  {
    href: "/auth/login",
    title: "Authentication Design",
  },
  {
    href: "/auth/register",
    title: "Register Now",
  },
  {
    href: "/404",
    title: "404 Error Page",
  },
  {
    href: "/apps/notes",
    title: "Notes App",
  },
  {
    href: "/user-profile",
    title: "User Application",
  },
  {
    href: "/apps/blog/posts",
    title: "Blog Design",
  },
  {
    href: "/apps/ecommerce/eco-checkout",
    title: "Shopping Cart",
  },
];

// Export all data arrays
export { notifications, profile, pageLinks, appsLink };
