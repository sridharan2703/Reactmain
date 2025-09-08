import { useMediaQuery, Box, Drawer } from "@mui/material";
import { useState } from "react";
import SidebarItems from "./SidebarItems";
import Scrollbar from "../../../components/custom-scroll/Scrollbar";

const Sidebar = ({ isSidebarOpen, isMobileSidebarOpen, onSidebarClose }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [isHovered, setIsHovered] = useState(false);

  const collapsedWidth = "64px";
  const expandedWidth = "270px";
  const sidebarWidth = isHovered ? expandedWidth : collapsedWidth;

  if (lgUp) {
    // Desktop permanent sidebar
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          bgcolor: "background.paper",
          transition: "width 0.3s ease",
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Scrollbar>
          <SidebarItems isCollapsed={!isHovered} />
        </Scrollbar>
      </Box>
    );
  }

  // Mobile / tablet Drawer
  return (
    <Drawer
      variant="temporary"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: expandedWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Scrollbar>
        <SidebarItems isCollapsed={false} />
      </Scrollbar>
    </Drawer>
  );
};

export default Sidebar;
