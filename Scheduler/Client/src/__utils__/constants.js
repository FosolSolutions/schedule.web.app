//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
// Externally-determined, locally implemented paths ----------------------------
export const PATH_EMAIL_SIGNIN = "auth/signin/participant";
export const PATH_ADMIN = "admin";

// Client Storage --------------------------------------------------------------
export const LOCAL_STORAGE = "localStorage";
export const SESSION_STORAGE = "sessionStorage";

export const CLIENT_KEY_IS_AUTHENTICATED = "CLIENT_KEY_IS_AUTHENTICATED";

// History API -----------------------------------------------------------------
export const HISTORY_PUSH = "HISTORY_PUSH";
export const HISTORY_REPLACE = "HISTORY_REPLACE";

// Content Keys ----------------------------------------------------------------
export const SNACKBAR_NETWORK_ERROR = "SNACKBAR_NETWORK_ERROR";
export const SNACKBAR_DYNAMIC_USER_ERROR = "SNACKBAR_DYNAMIC_USER_ERROR";
export const SNACKBAR_DYNAMIC_CALENDARS_ERROR = "SNACKBAR_DYNAMIC_CALENDARS_ERROR";
export const SNACKBAR_DYNAMIC_ACTIVITIES_ERROR = "SNACKBAR_DYNAMIC_ACTIVITIES_ERROR";
export const SNACKBAR_DYNAMIC_OPENINGS_ERROR = "SNACKBAR_DYNAMIC_OPENINGS_ERROR";
export const SNACKBAR_DYNAMIC_EVENTS_ERROR = "SNACKBAR_DYNAMIC_EVENTS_ERROR";
export const SNACKBAR_DYNAMIC_OPENING_ERROR = "SNACKBAR_DYNAMIC_OPENING_ERROR";

// Misc ------------------------------------------------------------------------
export const ARRAY_COMMAND_PUSH = "ARRAY_COMMAND_PUSH";
export const ARRAY_COMMAND_SHIFT = "ARRAY_COMMAND_SHIFT";
export const SORT_ALPHABETICAL = "SORT_ALPHABETICAL";
export const SORT_DATE = "SORT_DATE";
export const SORT_ORDER_ASC = "SORT_ORDER_ASC";
export const SORT_ORDER_DESC = "SORT_ORDER_DESC";

// SVG Paths -------------------------------------------------------------------
export const SVG_PATH_GOOGLE = "M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z";
export const SVG_PATH_MICROSOFT = "M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z";

// Hardcoded data values -------------------------------------------------------
// Schedule dates
export const DATE_START_ECCLESIAL_SCHEDULE = new Date(2019, 0, 1);
export const DATE_END_ECCLESIAL_SCHEDULE = new Date(2019, 5, 30);

// Event names/types
export const EVENT_NAME_MEMORIAL_MEETING = "Memorial Meeting";
export const EVENT_NAME_BIBLE_CLASS = "Bible Class";
export const EVENT_NAME_BIBLE_TALK = "Bible Talk";
export const EVENT_NAME_HALL_CLEANING = "Hall Cleaning";

// Activity names
export const ACTIVITY_NAME_PRESIDE = "Preside";
export const ACTIVITY_NAME_PRESIDER = "Presider";

// Criteria
export const CRITERIA_RULE_PARTICIPATE = "Participate";
export const CRITERIA_KEY_SKILL = "Skill";
export const CRITERIA_KEY_BROTHER = "Brother";
export const CRITERIA_KEY_SISTER = "Sister";
export const CRITERIA_KEY_MEMBER = "Member";

export const CRITERIA_VALUE_LECTURER = "Lecturer";
export const CRITERIA_VALUE_PRESIDE = "Preside";
export const CRITERIA_VALUE_BIBLE_CLASS = "Bible Class";
export const CRITERIA_VALUE_DOORMAN = "Doorman";
export const CRITERIA_VALUE_EXHORT = "Exhort";
export const CRITERIA_VALUE_PIANIST = "Pianist";
export const CRITERIA_VALUE_PRAY = "Pray";
export const CRITERIA_VALUE_READ = "Read";
export const CRITERIA_VALUE_SERVE = "Serve";
export const CRITERIA_VALUE_EMBLEMS = "Emblems";
export const CRITERIA_VALUE_CLEAN = "Clean";
export const CRITERIA_VALUE_TRUE = "True";
export const CRITERIA_VALUE_FALSE = "False";

export const CRITERIA_VALUE_TYPE_STRING = "System.String";
export const CRITERIA_VALUE_TYPE_BOOLEAN = "System.Boolean";

export const CRITERIA_LOGICAL_OPERATOR_AND = "And";
export const CRITERIA_LOGICAL_OPERATOR_OR = "Or";

// Openings
export const OPENING_NAME_SPEAKER = "Speaker";

// Tags
export const TAG_KEY_TITLE = "Title";

// Error messages
export const ERROR_MESSAGE_UNKNOWN = "Unknown error";

// Theme constants -------------------------------------------------------------
export const DRAWER_WIDTH = "250px";
export const WINDOW_WIDTH_DRAWER_PERSISTENT = 1200;

export const COLOR_PRIMARY_MAIN = "hsl(210, 29%, 29%)";
export const COLOR_PRIMARY_MID = "hsl(210, 19%, 44%)";
export const COLOR_PRIMARY_LIGHT = "hsl(210, 18%, 96%)";
export const COLOR_SECONDARY_MAIN = "hsl(207, 90%, 54%)";
export const COLOR_SECONDARY_DARK = "hsl(207, 89%, 44%)";
export const COLOR_SECONDARY_EXTRA_LIGHT = "hsl(207, 80%, 90%)";
export const COLOR_ERROR_MAIN = "hsl(6, 78%, 57%)";
export const COLOR_DEFAULT_MAIN = "hsl(210, 19%, 94%)";

export const DATE_PICKER_THEME = {
    overrides: {
        MuiInputAdornment: {
            positionEnd: {
                marginLeft: "0",
            },
        },
        MuiInputBase: {
            input: {
                padding: "2px 0 7px",
            },
        },
        MuiPickersToolbar: {
            toolbar: {
                height: "auto",
                padding: "0.75em 1em",
            },
        },
        MuiTypography: {
            h4: {
                fontSize: "1.5rem",
            },
            h6: {
                fontSize: "1rem",
            },
        },
    },
    palette: {
        primary: {
            main: COLOR_PRIMARY_MAIN,
        },
    },
    typography: {
        useNextVariants: true,
        fontFamily: [
            `"Open Sans"`,
            `"Helvetica Neue"`,
            "Arial",
            "sans-serif",
            "-apple-system",
            "BlinkMacSystemFont",
            `"Segoe UI"`,
            `"Apple Color Emoji"`,
            `"Segoe UI Emoji"`,
            `"Segoe UI Symbol"`,
        ].join(","),
    },
};
