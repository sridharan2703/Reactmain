import React, { useState } from "react";
import { styled, Container, Box } from "@mui/material";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router";
import Topbar from "./header/Topbar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  width: "98vw",
  height: "90vh",
  overflow: "hidden",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
  height: "100%",
  overflow: "hidden",
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      {/* ------------------------------------------- */}
      {/* Topbar */}
      {/* ------------------------------------------- */}
      <Topbar onOpenSidebar={() => setMobileSidebarOpen(true)} />

      <MainWrapper className="mainwrapper">
        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />

        {/* ------------------------------------------- */}
        {/* Main Wrapper */}
        {/* ------------------------------------------- */}
        <PageWrapper className="page-wrapper">
          <Box
            sx={{
              flexGrow: 1,
              height: "100%",
              padding: "20px",
              margin: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                height: "100%",
                padding: 0,
                margin: 0,
                overflow: "hidden",
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </PageWrapper>
      </MainWrapper>
    </>
  );
};

export default FullLayout;
