const backendConstants = window.Scheduler.constants;

//------------------------------------------------------------------------------
// Private implementation details
//------------------------------------------------------------------------------
const rootRequestPath = "https://coeventapi.azurewebsites.net/";
const apiPath = `${rootRequestPath}api/`;
const authPath = `${apiPath}auth/`;
const dataPath = `${rootRequestPath}data/`;

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
// Page IDs --------------------------------------------------------------------
export const PAGE_ID_CALENDAR = backendConstants.pageIds.calendar;
export const PAGE_ID_DASHBOARD = backendConstants.pageIds.dashboard;
export const PAGE_ID_HOME = backendConstants.pageIds.home;
export const PAGE_ID_SCHEDULES = backendConstants.pageIds.schedules;

// API Paths -------------------------------------------------------------------
export const PATH_API_AUTH_BACKDOOR = `${authPath}backdoor/user`;
export const PATH_API_AUTH_SIGN_OFF = `${authPath}signoff`;

// Data Paths ------------------------------------------------------------------
// TODO: Support paging properly
export const PATH_DATA_CALENDARS = `${dataPath}calendars`;
export const PATH_DATA_CALENDAR = `${dataPath}calendar/`;

// Event Names -----------------------------------------------------------------
export const EVENT_NAME_MEMORIAL_MEETING = "Memorial Meeting";
