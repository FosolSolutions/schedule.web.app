const backendConstants = window.Scheduler.constants;

//------------------------------------------------------------------------------
// Private implementation details
//------------------------------------------------------------------------------
const rootRequestPath = "https://coeventapi.azurewebsites.net";
const authPath = `${rootRequestPath}/auth`;
const dataPath = `${rootRequestPath}/data`;

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
export const PATH_AUTH_PARTICIPANT = `${authPath}/signin/participant`;
export const PATH_AUTH_GOOGLE = `${authPath}/signin?authScheme=Google&redirectUrl=https://coevent.azurewebsites.net`;
export const PATH_AUTH_MICROSOFT = `${authPath}/signin?authScheme=Microsoft&redirectUrl=https://coevent.azurewebsites.net`;
export const PATH_AUTH_IDENTITY = `${authPath}/current/identity`;
export const PATH_AUTH_SIGN_OFF = `${authPath}/signoff`;

// Data Paths ------------------------------------------------------------------
export const PATH_DATA_CALENDARS = `${dataPath}/calendars`;
export const PATH_DATA_CALENDAR = `${dataPath}/calendar`;
export const PATH_DATA_EVENTS = `${PATH_DATA_CALENDAR}/events`;
