import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { useMediaQuery } from "@mui/material";

/**
 * @fileoverview Custom Scrollbar Component.
 * @module Scrollbar
 * @description Implements a custom scrollbar using the `simplebar-react` library 
 * for improved aesthetics and cross-browser consistency, but conditionally falls back 
 * to native scrolling on smaller screens (below 'lg' breakpoint).
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * @imports
 * - SimpleBar: The core SimpleBar React component.
 * - simplebar-react/dist/simplebar.min.css: Required SimpleBar styling.
 * - Box, styled, useMediaQuery: Material-UI components and utilities.
 */

/**
 * @constant {StyledComponent} SimpleBarStyle
 * @description A styled version of the SimpleBar component, ensuring it takes up 
 * the maximum available height of its container.
 */
const SimpleBarStyle = styled(SimpleBar)(() => ({
    maxHeight: "100%",
}));

/**
 * @typedef {Object} ScrollbarProps
 * @property {React.ReactNode} children - The content to be wrapped by the scrollbar.
 * @property {object} [sx] - Custom Material-UI styling applied to the scrollbar container.
 * @property {object} [other] - Any other props passed to the underlying SimpleBar component.
 */

/**
 * Scrollbar Functional Component.
 * Chooses between the custom SimpleBar scrollbar (for desktop/large screens) 
 * and native browser scrolling (for mobile/small screens).
 * 
 * @param {ScrollbarProps} props - The component's props.
 * @returns {JSX.Element} The Scrollbar wrapper (SimpleBar or native Box).
 */
const Scrollbar = (props) => {
    const { children, sx, ...other } = props;
    // Hook to check if the screen is smaller than the 'lg' breakpoint
    const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

    // If on a smaller screen (mobile/tablet), return a standard Box with native overflow scrolling
    if (lgDown) {
        return <Box sx={{ overflowX: "auto" }}>{children}</Box>;
    }

    // Otherwise (on desktop/large screens), use the custom SimpleBar scrollbar
    return (
        <SimpleBarStyle sx={sx} {...other}>
            {children}
        </SimpleBarStyle>
    );
};

export default Scrollbar;