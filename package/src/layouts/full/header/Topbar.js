import { AppBar, styled, Toolbar, Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Profile from "./Profile";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  background: "linear-gradient(90deg, #001138,#001e66)",
  justifyContent: "center",
  [theme.breakpoints.up("lg")]: {
    minHeight: "70px",
  },
  zIndex: 9,
}));

const Topbar = ({ onOpenSidebar }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  return (
    <AppBarStyled position="sticky" color="default">
      <Toolbar sx={{ pl: 0 }}>
        {/* Hamburger button - only visible on tablet/mobile */}
        {!lgUp && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onOpenSidebar}
            sx={{ ml: 1, color: "white" }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          sx={{
            ml: 2,
            color: "white",
            fontSize: "25px",
            fontWeight: "800",
            letterSpacing: "2px",
            fontFamily: '"Poppins", sans-serif',
          }}
        >
          Human Resources
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
        <Profile />
      </Toolbar>
    </AppBarStyled>
  );
};

export default Topbar;
