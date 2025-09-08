import { uniqueId } from "lodash";

import {
  IconLayoutDashboard,
  IconTypography,
  IconPoint,
  IconBorderAll,
  IconBorderStyle2,
  IconAlignBoxLeftBottom,
  IconCheckbox,
  IconRadar,
  IconPlaneTilt,
  IconCalendarTime,
  IconListNumbers,
  IconNotes,
  IconClipboardText,
  IconUserPlus,
  IconPlaneInflight,
  IconMailSpark
} from "@tabler/icons-react";

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
    title: "Leave & Vacation",
    icon: IconPlaneInflight,
    href: "https://modernize-react.adminmart.com/tables/basic",
    children: [
      {
        id: uniqueId(),
        title: "Leave Application",
        icon: IconPoint,
        href: "https://modernize-react.adminmart.com/tables/basic",
      },
      {
        id: uniqueId(),
        title: "Child Care",
        icon: IconPoint,
        href: "https://modernize-react.adminmart.com/tables/collapsible",
      },
      {
        id: uniqueId(),
        title: "Casual Leave",
        icon: IconPoint,
        href: "https://modernize-react.adminmart.com/tables/enhanced",
      },
      {
        id: uniqueId(),
        title: "Rejoining",
        icon: IconPoint,
        href: "https://modernize-react.adminmart.com/tables/enhanced",
      },
      {
        id: uniqueId(),
        title: "Outstation Intimation",
        icon: IconPoint,
        href: "https://modernize-react.adminmart.com/tables/enhanced",
      },
    ],
  },

  {
    id: uniqueId(),
    title: "Apply for NOC",
    icon: IconAlignBoxLeftBottom,
    href: "/form-elements/button",
  },
  {
    id: uniqueId(),
    title: "Immediate Manager",
    icon: IconUserPlus,
    href: "/form-elements/checkbox",
  },
  {
    id: uniqueId(),
    title: "APAR",
    icon: IconRadar,
    href: "/form-elements/radio",
  },

  {
    id: uniqueId(),
    title: "Reports",
    icon: IconClipboardText,
    href: "https://modernize-react.adminmart.com/react-tables/basic",
    children: [
      {
        id: uniqueId(),
        title: "Leave & Travel",
        icon: IconPlaneTilt,
        href: "https://modernize-react.adminmart.com/react-tables/basic",
      },
      {
        id: uniqueId(),
        title: "Conference Details",
        icon: IconCalendarTime,
        href: "https://modernize-react.adminmart.com/react-tables/dense",
      },
      {
        id: uniqueId(),
        title: "Casual Leave",
        icon: IconListNumbers,
        href: "https://modernize-react.adminmart.com/react-tables/filter",
      },
      {
        id: uniqueId(),
        title: "NOC Report  ",
        icon: IconNotes,
        href: "https://modernize-react.adminmart.com/react-tables/row-selection",
      },
    ],
  },
];

export default Menuitems;
