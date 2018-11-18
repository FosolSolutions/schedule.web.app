//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    SET_CURRENT_CALENDAR_MONTH,
    SET_DRAWER_IS_OPEN,
    SET_SCHEDULE_END_DATE,
    SET_SCHEDULE_START_DATE,
    SET_SNACKBAR_CONTENT_KEY,
} from "redux/actionTypes";

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
        scheduleEndDate: date,
    };
}

/**
 * Set the snackbar content key.
 *
 * @param  {string} snackbarContentKey A SNACKBAR_* constant.
 *
 * @return {Object}                    Action object.
 */
export function setSnackbarContentKey(snackbarContentKey = "") {
    return {
        type: SET_SNACKBAR_CONTENT_KEY,
        snackbarContentKey,
    };
}


//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
