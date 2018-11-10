const backendConstants = window.Scheduler.constants;

//------------------------------------------------------------------------------
// Private implementation details
//------------------------------------------------------------------------------
const rootRequestPath = "https://coeventapi.azurewebsites.net/";
const authPath = `${rootRequestPath}auth/`;
const dataPath = `${rootRequestPath}data/`;

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
export const PATH_AUTH_BACKDOOR = `${authPath}backdoor/user`;
export const PATH_AUTH_GOOGLE = `${authPath}signin?authScheme=Google&redirectUrl=https://coevent.azurewebsites.net`;
export const PATH_AUTH_MICROSOFT = `${authPath}signin?authScheme=Microsoft&redirectUrl=https://coevent.azurewebsites.net`;
export const PATH_AUTH_IDENTITY = `${authPath}current/identity`;
export const PATH_AUTH_SIGN_OFF = `${authPath}signoff`;

// Data Paths ------------------------------------------------------------------
// TODO: Support paging properly
export const PATH_DATA_CALENDARS = `${dataPath}calendars`;
export const PATH_DATA_CALENDAR = `${dataPath}calendar/`;

// Event Names -----------------------------------------------------------------
export const EVENT_NAME_MEMORIAL_MEETING = "Memorial Meeting";
export const EVENT_NAME_BIBLE_CLASS = "Bible Class";
export const EVENT_NAME_BIBLE_TALK = "Bible Talk";
export const EVENT_NAME_HALL_CLEANING = "Hall Cleaning";
