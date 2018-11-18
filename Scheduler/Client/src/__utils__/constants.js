//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
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
export const SNACKBAR_DYNAMIC_CALENDAR_ERROR = "SNACKBAR_DYNAMIC_CALENDAR_ERROR";
export const SNACKBAR_DYNAMIC_EVENTS_ERROR = "SNACKBAR_DYNAMIC_EVENTS_ERROR";

// SVG Paths -------------------------------------------------------------------
export const SVG_PATH_GOOGLE = "M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z";
export const SVG_PATH_MICROSOFT = "M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z";

// Hardcoded data values -------------------------------------------------------
export const DATE_START_ECCLESIAL_SCHEDULE = new Date(2019, 0, 1);
export const DATE_END_ECCLESIAL_SCHEDULE = new Date(2019, 5, 30);

export const EVENT_NAME_MEMORIAL_MEETING = "Memorial Meeting";
export const EVENT_NAME_BIBLE_CLASS = "Bible Class";
export const EVENT_NAME_BIBLE_TALK = "Bible Talk";
export const EVENT_NAME_HALL_CLEANING = "Hall Cleaning";

// Theme constants -------------------------------------------------------------
export const DRAWER_WIDTH = "250px";

export const COLOR_PRIMARY_MAIN = "#34495e";
export const COLOR_PRIMARY_LIGHT = "#eceff2";
export const COLOR_SECONDARY_MAIN = "#00a6fb";
export const COLOR_SECONDARY_DARK = "#0c7cd5";
export const COLOR_ERROR_MAIN = "#fe4a49";
export const COLOR_DEFAULT_MAIN = "#eceff2";

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
