/**
 * @fileoverview Main application router configuration using React Router v6.
 * @module Router
 * @description Defines the routing structure for the application, including lazy loading, 
 * layout assignment (FullLayout, BlankLayout), error handling, and a dynamic component loader 
 * for task-specific pages.
 * @author Rakshana
 * @version 1.0.0
 * @created 01/11/2025
 * @lastModified 01/11/2025
 * 
 * @imports
 * - React, lazy, Suspense: For code splitting and loading fallback UI.
 * - createBrowserRouter, Navigate, useLocation: React Router hooks and utilities.
 * - ComponentMap: A map of component names to actual component references (used for dynamic routing).
 * 
 * @layouts
 * - FullLayout: The main layout with navigation, header, etc.
 * - BlankLayout: Minimal layout for authentication or error pages.
 * 
 * @pages
 * - Dashboard, Error, Login, Inbox, TaskSummary, Components, OfficeOrder, EmployeeEFile: Core application views.
 */
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, useLocation, RouterProvider } from "react-router-dom";
import ComponentMap from "src/routes/ComponentMap";
/* Layouts */
const FullLayout = lazy(() => import("../layouts/full/FullLayout"));
const BlankLayout = lazy(() => import("../layouts/blank/BlankLayout"));

/* Pages - Lazy Loaded Components for Code Splitting */
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const Error = lazy(() => import("../views/authentication/Error"));
const Login = lazy(() => import("../views/authentication/Login"));
const Inbox = lazy(() => import("../views/Inbox/Inbox.js"));
const TaskSummary = lazy(() => import("../views/TaskSummary/TaskSummary.js"));
const Components = lazy(() => import("../views/Components/index.js"));
const OfficeOrder = lazy(() => import("../views/OfficeOrder/OfficeOrder.js"));
// eslint-disable-next-line
const ApprovalScreen = lazy(() => // Not explicitly used in routes but defined
  import("../views/OfficeOrder/ApprovalScreen.js")
);
// eslint-disable-next-line
const AdditionalDetails = lazy(() => import("../views/OfficeOrder/AdditionalDetails.js")); // Not explicitly used in routes but defined

const EmployeeEFile = lazy(() =>
  import("../views/Menus/EmployeeFile/efile.js")
);

/* RouteLoader (Loading UI) */
/**
 * @typedef {Object} RouteLoaderProps
 * @property {string} componentName - The name of the component currently being loaded.
 */

/**
 * RouteLoader Component.
 * Displays a custom, professional-looking loading animation as a fallback for lazy-loaded routes.
 * 
 * @param {RouteLoaderProps} props - The component's props.
 * @returns {JSX.Element} The loading UI component.
 */
const RouteLoader = ({ componentName }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "100vh",
      padding: "8rem 2rem 2rem",
      backgroundColor: "#fafbfc",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "4rem 3rem",
        boxShadow:
          "0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 16px rgba(0, 0, 0, 0.04)",
        border: "1px solid #e8ecf1",
        textAlign: "center",
        minWidth: "420px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />

      <div
        style={{
          width: "36px",
          height: "36px",
          backgroundColor: "#f1f5f9",
          borderRadius: "16px",
          margin: "0 auto 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1.2s linear infinite",
          }}
        />
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          {[1, 2, 3, 4].map((step, index) => (
            <div
              key={step}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: index < 2 ? "#3b82f6" : "#e2e8f0",
                animation:
                  index === 2 ? "pulse-dot 1.5s ease-in-out infinite" : "none",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </div>

        <div
          style={{
            width: "100%",
            height: "4px",
            backgroundColor: "#f1f5f9",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
              borderRadius: "2px",
              animation: "progress-professional 2.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <h1
        style={{
          color: "#0f172a",
          fontSize: "1.375rem",
          fontWeight: "700",
          margin: "0 0 0.75rem 0",
          letterSpacing: "-0.05em",
          lineHeight: "1.2",
        }}
      >
        Loading {componentName}
      </h1>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#f0f9ff",
          border: "1px solid #e0f2fe",
          borderRadius: "8px",
          fontSize: "0.8125rem",
          color: "#0369a1",
          fontWeight: "500",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "#3b82f6",
            borderRadius: "50%",
            animation: "pulse-status 2s ease-in-out infinite",
          }}
        />
        Processing...
      </div>
    </div>

    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes progress-professional {
        0% { width: 0%; transform: translateX(-100%); }
        45% { width: 100%; transform: translateX(0%); }
        55% { width: 100%; transform: translateX(0%); }
        100% { width: 100%; transform: translateX(100%); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes pulse-dot {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
      }
      
      @keyframes pulse-status {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </div>
);


/**
 * DynamicComponent Functional Component.
 * A component designed to render dynamically chosen components based on state passed via React Router's `location.state`.
 * This is primarily used for routing to specific task/workflow pages where the component to load is defined externally.
 * 
 * @returns {JSX.Element} The dynamically loaded component wrapped in Suspense.
 */
const DynamicComponent = () => {
  const location = useLocation();
  const { component, taskData } = location.state || {};
 const componentName = component || "Error";
  
  /**
   * Retrieves the React component from the global ComponentMap based on its name.
   * @param {string} name - The component name string (key in ComponentMap).
   * @returns {React.ComponentType} The corresponding React component, or the Error component as fallback.
   */
  const getComponentFromMap = (name) => {
    const Comp = ComponentMap[name];
    if (!Comp) {
      return ComponentMap["Error"] || Error;
    }
    return Comp;
  };

  const Component = getComponentFromMap(componentName);

  return (
    <Suspense fallback={<RouteLoader componentName={componentName} />}>
      {/* Renders the dynamic component, passing taskData as a prop */}
      <Component taskData={taskData} />
    </Suspense>
  );
};

/* Router Definition */
/**
 * Main application router instance created using createBrowserRouter.
 * Defines the entire routing structure.
 */
const Router = createBrowserRouter([
  {
    path: "/",
    // Root path element loads the FullLayout with loading fallback
    element: (
      <Suspense fallback={<RouteLoader componentName="FullLayout" />}>
        <FullLayout />
      </Suspense>
    ),
    // Routes under FullLayout (authenticated/main app routes)
    children: [
      { path: "/", element: <Navigate to="/auth/login" replace /> }, 
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<RouteLoader componentName="Dashboard" />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "/inbox",
        element: (
          <Suspense fallback={<RouteLoader componentName="Inbox" />}>
            <Inbox />
          </Suspense>
        ),
      },
      {
        path: "/tasksummary",
        element: (
          <Suspense fallback={<RouteLoader componentName="TaskSummary" />}>
            <TaskSummary />
          </Suspense>
        ),
      },
      {
        path: "/components",
        element: (
          <Suspense fallback={<RouteLoader componentName="Components" />}>
            <Components />
          </Suspense>
        ),
      },
      {
        path: "/officeorder",
        element: (
          <Suspense fallback={<RouteLoader componentName="OfficeOrder" />}>
            <OfficeOrder />
          </Suspense>
        ),
      },

       {
        path: "/EmployeeEFile",

        element: (
          <Suspense fallback={<RouteLoader componentName="EmployeeEFile" />}>
            <EmployeeEFile />
          </Suspense>
        ),
      },
     
       { 
        path: "/:taskPath", // Dynamic path segment for tasks 
        element: <DynamicComponent /> 
      }, 
      { path: "*", element: <Navigate to="/auth/404" replace /> }, // Catch all unknown paths in the main layout
     
    ],
  },
  {
    path: "/auth",
    // Authentication/Error layout element
    element: (
      
        <BlankLayout />
   
    ),
    // Routes under BlankLayout
    children: [
      { path: "404", element: <Error /> }, // Error page
      { path: "login", element: <Login /> }, // Login page
      { path: "*", element: <Navigate to="/auth/404" replace /> }, // Catch all unknown paths under /auth
    ],
  },
]);

/**
 * DynamicRouterProvider Functional Component.
 * Wraps the Router instance in React Router's RouterProvider.
 * Note: This component is defined but not exported/used outside this file's internal logic flow.
 * 
 * @returns {JSX.Element} The application wrapped in the router context.
 */
const DynamicRouterProvider = () => {
  return <RouterProvider router={Router} />;
};

/**
 * Helper function to navigate to a dynamic task route with necessary state.
 * Encapsulates the logic for passing the component name and task data through router state.
 * 
 * @param {Function} navigate - The `useNavigate` hook function from React Router.
 * @param {Object} taskData - The data object for the task, expected to contain `Path` and `Component`.
 * @param {string} taskData.Path - The URL path segment for the task.
 * @param {string} taskData.Component - The name of the React Component to load.
 * @param {string} taskData.TaskId - The ID of the task.
 */
export const navigateWithTaskData = (navigate, taskData) => {
  const { Path, Component, ...restData } = taskData;

  if (Path && Component) {
    navigate(Path, {
      state: {
        component: Component, // The name of the component to load dynamically
        taskData: restData,   // All other task data for the component
        taskId: taskData.TaskId,
      },
    });
  } else {
    navigate("/auth/404");
  }
};

export default Router;
