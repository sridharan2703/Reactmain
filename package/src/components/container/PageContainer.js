import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/**
 * @fileoverview PageContainer Component.
 * @module PageContainer
 * @description A wrapper component that handles SEO optimization (via react-helmet) 
 * by setting the document title and meta description based on the provided props, 
 * and renders its children as the main page content.
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 * 
 * @imports
 * - React: Core React library.
 * - PropTypes: For prop type validation.
 * - Helmet: Library for managing changes to the document head.
 */

/**
 * @typedef {Object} PageContainerProps
 * @property {string} [title] - The title of the page to be set in the document head.
 * @property {string} [description] - The meta description of the page.
 * @property {React.ReactNode} children - The content of the page to be rendered.
 */

/**
 * PageContainer Functional Component.
 * 
 * @param {PageContainerProps} props - The component's props.
 * @returns {JSX.Element} The wrapper component with Helmet applied.
 */
const PageContainer = ({ title, description, children }) => (
  <div>
    {/* 
      Helmet is used to manage changes to the document head.
      This sets the page title and meta description dynamically for SEO.
    */}
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    {/* Renders the actual content of the page */}
    {children}
  </div>
);

/**
 * Prop type validation for PageContainer.
 */
PageContainer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default PageContainer;