
import { lazy } from 'react';

/* ***Layouts**** */
export const FullLayout = lazy(() => import('../layouts/full/FullLayout'));
export const BlankLayout = lazy(() => import('../layouts/blank/BlankLayout'));

/* ****Pages***** */
export const Inbox = lazy(() => import('src/views/Inbox/Inbox'));
export const OfficeOrder = lazy(() => import('src/views/OfficeOrder/OfficeOrder'));
export const EmployeeVisitForm = lazy(() => import('src/views/OfficeOrder/EmployeeVisitForm'));
export const OfficeOrderSaveandHold = lazy(() => import('src/views/OfficeOrder/OfficeOrderSaveandHold'));
export const TaskSummary = lazy(() => import('src/views/TaskSummary/TaskSummary'));
export const ApprovalScreen = lazy(() => import('src/views/OfficeOrder/ApprovalScreen'));
export const AdditionalDetails = lazy(() => import('src/views/OfficeOrder/AdditionalDetails'));


export const Login = lazy(() => import('/src/views/authentication/Login'));
export const dashboard = lazy(() => import('/src/views/dashboard/Dashboard'));

/* ****Form Elements & Tables***** */
//export const InboxTable = lazy(() => import('src/views/InboxTable'));
export const OfficeOrderTable = lazy(() => import('src/views/OfficeOrder/OfficeOrderTable'))
export const TaskCards = lazy(() => import('src/views/TaskSummary/TaskCards'));
export const TaskDialog = lazy(() => import('src/views/TaskSummary/TaskDialog'));
export const EmployeeEFile = lazy(() =>  import("src/views/Menus/EmployeeFile/efile.js")
);

