const backendConstants = window.Scheduler.constants;

//------------------------------------------------------------------------------
// Private implementation details
//------------------------------------------------------------------------------
const rootRequestPath = "https://localhost:44375"; // "https://coeventapi.azurewebsites.net"; // 
const authPath = `${rootRequestPath}/auth`;
const dataPath = `${rootRequestPath}/data`;
const managePath = `${rootRequestPath}/manage`;

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
// Pages Data ------------------------------------------------------------------
export const PAGES_OBJECT_MAP = backendConstants.pages;
export const PATH_ABSOLUTE_ROOT = backendConstants.absoluteRootPath;

// Page IDs --------------------------------------------------------------------
export const PAGE_ID_CALENDAR = backendConstants.pages.calendar.id;
export const PAGE_ID_DASHBOARD = backendConstants.pages.dashboard.id;
export const PAGE_ID_ROOT = backendConstants.pages.root.id;
export const PAGE_ID_SCHEDULES = backendConstants.pages.schedules.id;

// API Paths -------------------------------------------------------------------
export const PATH_AUTH_PARTICIPANT = `/auth/authenticate`;
export const PATH_AUTH_GOOGLE = `${authPath}/signin?authScheme=Google&redirectUrl=https://coevent.azurewebsites.net`;
export const PATH_AUTH_MICROSOFT = `${authPath}/signin?authScheme=Microsoft&redirectUrl=https://coevent.azurewebsites.net`;
export const PATH_AUTH_IDENTITY = `/auth/identity`;
export const PATH_AUTH_SIGN_OFF = `/auth/signout`;
export const PATH_MANAGE_PARTICIPANT = `/api/manage/participant`;

// Data Paths ------------------------------------------------------------------
export const PATH_DATA_CALENDARS = `/api/data/calendars`;
export const PATH_DATA_CALENDAR = `/api/data/calendar`;
export const PATH_DATA_EVENT = `/api/data/calendar/event`;
export const PATH_DATA_OPENING = `/api/data/calendar/event/activity/opening`;
export const PATH_DATA_APPLY = `/api/data/calendar/event/activity/opening/apply`;
export const PATH_DATA_UNAPPLY = `/api/data/calendar/event/activity/opening/unapply`;
