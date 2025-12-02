// 'use client';
// import { Box, Typography } from "@mui/material";

// const Footer = () => {
//     return (
//         <Box sx={{ pt: 6, pb: 3, textAlign: "center" }}>
//             <Typography>
//                 © {new Date().getFullYear()} All rights reserved by Workflow IITM
               
//             </Typography>
//         </Box>
//     );
// };

// export default Footer;

'use client';
import { Box, Typography } from "@mui/material";

/**
 * @fileoverview Footer Component for the application.
 * @module Footer
 * @description Renders the application's footer section, typically containing copyright information.
 * Uses the 'use client' directive for client-side rendering compatibility (e.g., in Next.js).
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - Box, Typography: Material-UI components for layout and text display.
 */

/**
 * Footer Functional Component.
 * Displays the current year and the copyright notice.
 *
 * @returns {JSX.Element} The Footer component.
 */
const Footer = () => {
    return (
        <Box sx={{ pt: 6, pb: 3, textAlign: "center" }}>
            <Typography>
                {/* Dynamically generates the current year for the copyright notice */}
                © {new Date().getFullYear()} All rights reserved by Workflow IITM
               
            </Typography>
        </Box>
    );
};

export default Footer;
