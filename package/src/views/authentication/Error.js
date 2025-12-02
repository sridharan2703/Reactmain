/**
 * @fileoverview Error Component for 404 Not Found page.
 * @module Error
 * @description A simple, centered page component to display a 404 "Page Not Found" error, 
 * featuring an image, descriptive text, and a button to navigate back to the home page.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - Box, Container, Typography, Button: Material-UI components for layout and display.
 * - Link: React Router v6 component for navigation. (Note: The `Link` is imported from 'react-router', 
 *   but in modern React Router v6 it's usually imported from 'react-router-dom').
 * - ErrorImg: Static image asset for visual appeal.
 */
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router';
import ErrorImg from 'src/assets/images/backgrounds/404-error-idea.gif';

/**
 * Error Functional Component.
 * Renders the 404 Not Found error page.
 *
 * @returns {JSX.Element} The Error page component.
 */
const Error = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      {/* 404 Error Image */}
      <img src={ErrorImg} alt="404" style={{ width: '100%', maxWidth: '500px' }} />
      
      {/* Primary Error Message */}
      <Typography align="center" variant="h1" mb={4}>
        Opps!!!
      </Typography>
      
      {/* Secondary Description */}
      <Typography align="center" variant="h4" mb={4}>
        This page you are looking for could not be found.
      </Typography>
      
      {/* Navigation Button to Home */}
      <Button 
        color="primary" 
        variant="contained" 
        component={Link} // Uses the imported Link component for internal navigation
        to="/" 
        disableElevation
      >
        Go Back to Home
      </Button>
    </Container>
  </Box>
);

export default Error;