/**
 * @fileoverview Icons Component for displaying a page of icons.
 * @module Icons
 * @description A page component that embeds an external icons website (Tabler Icons) 
 * within an iframe, wrapped in a PageContainer and DashboardCard.
 * @author Rakshana
 * @date 01/11/2025
 * 
 * @imports
 * - React: Core React library
 * - PageContainer: Custom component for page layout/SEO
 * - DashboardCard: Custom component for wrapping content in a card/panel
 */
import React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

/**
 * Icons Functional Component.
 * Renders an iframe embedding the Tabler Icons website inside a structured card layout.
 *
 * @returns {JSX.Element} The Icons page component.
 */
const Icons = () => {
  return (
    <PageContainer title="Icons" description="this is Icons">

      <DashboardCard title="Icons">
        {/* 
         * Embeds the Tabler Icons website (https://tabler-icons.io/) within an iframe.
         * This allows the user to browse icons without leaving the application context.
         */}
        <iframe 
          src="https://tabler-icons.io/" 
          title="Inline Frame Example" 
          frameBorder={0}
          width="100%"
          height="650"
        ></iframe>
      </DashboardCard>
    </PageContainer>
  );
};

export default Icons;