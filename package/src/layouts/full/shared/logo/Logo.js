import { Link } from "react-router";
import { styled } from "@mui/material";

/**
 * @fileoverview Logo Component.
 * @module Logo
 * @description A simple, styled component representing the application's logo. 
 * It functions as a navigational link back to the dashboard/home page.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - Link: React Router v6 component for navigation (imported from "react-router").
 * - styled: Material-UI utility for creating styled components.
 */

/**
 * @constant {StyledComponent} LinkStyled
 * @description A styled version of the React Router Link component.
 * Sets fixed dimensions (height/width) and ensures block display for consistent logo sizing.
 */
const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

/**
 * Logo Functional Component.
 * Renders the logo area, which acts as a link to the root path ("/").
 * The content of the logo (e.g., an image or text) is implicitly intended 
 * to be placed inside the returned JSX structure.
 *
 * @returns {JSX.Element} The Logo link component.
 */
const Logo = () => {
  return (
    <LinkStyled
      to="/"
      height={70} // Prop passed to the styled component (LinkStyled)
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* 
        NOTE: Logo content (e.g., <img src="..." alt="App Logo" /> or <Typography>App Name</Typography>) 
        is intentionally empty in the provided source code, but would be placed here in a real application.
      */}
    </LinkStyled>
  );
};

export default Logo;