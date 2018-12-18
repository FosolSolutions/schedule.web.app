//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    SET_CURRENT_CALENDAR_MONTH,
    SET_DRAWER_IS_OPEN,
    SET_SCHEDULE_END_DATE,
    SET_SCHEDULE_START_DATE,
    SET_SNACKBAR_CONTENT_KEY,
    SET_SCREEN_WIDTH,
} from "redux/actionTypes";
import { selectSnackbars } from "redux/reducers/uiReducer";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    ARRAY_COMMAND_PUSH,
    ARRAY_COMMAND_SHIFT,
} from "utils/constants";

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
/**
 * Set whether the calendar date.
 *
 * @param  {Date} date The new calendar month to show in the calendar UI.
 *
 * @return {Object}    Action object.
 */
export function setCurrentCalendarMonth(date) {
    return {
        type: SET_CURRENT_CALENDAR_MONTH,
        currentCalendarMonth: date,
    };
}

/**
 * Set whether the drawer should be open.
 *
 * @param  {boolean} drawerIsOpen Whether the drawer should be open.
 *
 * @return {Object}               Action object.
 */
export function setDrawerIsOpen(drawerIsOpen) {
    return {
        type: SET_DRAWER_IS_OPEN,
        drawerIsOpen,
    };
}

/**
 * Set whether the schedule end date.
 *
 * @param  {Date} date The schedule end date.
 *
 * @return {Object}    Action object.
 */
export function setScheduleEndDate(date) {
    return {
        type: SET_SCHEDULE_END_DATE,
        scheduleEndDate: date,
    };
}

/**
 * Set whether the schedule start date.
 *
 * @param  {Date} date The schedule start date.
 *
 * @return {Object}    Action object.
 */
export function setScheduleStartDate(date) {
    return {
        type: SET_SCHEDULE_START_DATE,
        scheduleStartDate: date,
    };
}

/**
 * Set/unset the snackbar content key.
 *
 * @param  {string} arrayCommand       An ARRAY_COMMAND_*
 * @param  {Object} snackbarContent    Two key/value pairs:
 *                                      - key    {string} A SNACKBAR_* constant
 *                                      - text   {string} Snackbar message
 *                                      Optional (not required when shifting)
 *
 * @return {Object}                    Action object.
 */
export function setSnackbarContent(arrayCommand, snackbarContent) {
    return (dispatch, getState) => {
        const currentSnackbars = new Map(selectSnackbars(getState()));

        if (
            arrayCommand === ARRAY_COMMAND_PUSH &&
            typeof snackbarContent !== "undefined"
        ) {
            currentSnackbars.set(Date.now(), snackbarContent);
        } else if (arrayCommand === ARRAY_COMMAND_SHIFT) {
            currentSnackbars.delete(currentSnackbars.keys().next().value);
        }

        dispatch({
            type: SET_SNACKBAR_CONTENT_KEY,
            snackbars: currentSnackbars,
        });
    };
}

/**
 * Dispatch SET_SCREEN_WIDTH action.
 *
 * @return {Function} Action-dispatching thunk
 */
export function setResponsiveProperties() {
    return (dispatch) => {
        const updateScreenWidthProperties = () => {
            dispatch({
                type: SET_SCREEN_WIDTH,
                screenWidth: window.innerWidth,
            });
        };
        let resizeTimer;

        updateScreenWidthProperties();

        window.addEventListener("resize", () => {
            // Throttle resize event so it doesn't overwhelm Chrome/Safari
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateScreenWidthProperties, 200);
        });
    };
}


//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
