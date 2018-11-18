//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import update from "immutability-helper";
import isBefore from "date-fns/isBefore";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    SET_CURRENT_CALENDAR_MONTH,
    SET_DRAWER_IS_OPEN,
    SET_MAIN_CONTENT_KEY,
    SET_SNACKBAR_CONTENT_KEY,
    SET_SCHEDULE_END_DATE,
    SET_SCHEDULE_START_DATE,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    DATE_END_ECCLESIAL_SCHEDULE,
    DATE_START_ECCLESIAL_SCHEDULE,
} from "utils/constants";

//------------------------------------------------------------------------------

export const initialUiState = {
    currentCalendarMonth: new Date(),
    scheduleStartDate: (isBefore(new Date(), DATE_START_ECCLESIAL_SCHEDULE))
        ? DATE_START_ECCLESIAL_SCHEDULE
        : new Date(),
    scheduleEndDate: DATE_END_ECCLESIAL_SCHEDULE,
    drawerIsOpen: true,
    mainContentKey: "",
    snackbarContentKey: "",
};

/**
 * User reducer
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 *
 * @return {Object}        Updated state
 */
export default function uiReducer(
    state = initialUiState,
    action,
) {
    let returnVal;

    switch (action.type) {
        case SET_CURRENT_CALENDAR_MONTH:
            returnVal = update(state, {
                currentCalendarMonth: { $set: action.currentCalendarMonth },
            });
            break;
        case SET_DRAWER_IS_OPEN:
            returnVal = update(state, {
                drawerIsOpen: { $set: action.drawerIsOpen },
            });
            break;
        case SET_MAIN_CONTENT_KEY:
            returnVal = update(state, {
                mainContentKey: { $set: action.mainContentKey },
            });
            break;
        case SET_SCHEDULE_END_DATE:
            returnVal = update(state, {
                scheduleEndDate: { $set: action.scheduleEndDate },
            });
            break;
        case SET_SCHEDULE_START_DATE:
            returnVal = update(state, {
                scheduleStartDate: { $set: action.scheduleStartDate },
            });
            break;
        case SET_SNACKBAR_CONTENT_KEY:
            returnVal = update(state, {
                snackbarContentKey: { $set: action.snackbarContentKey },
            });
            break;
        default:
            returnVal = state;
    }

    return returnVal;
}

/**
 * currentCalendarMonth selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Date}         The current month in the calendar UI.
 */
export function selectCurrentCalendarMonth(state) {
    return state.ui.currentCalendarMonth;
}

/**
 * drawerIsOpen selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether drawerIsOpen
 */
export function selectDrawerIsOpen(state) {
    return state.ui.drawerIsOpen;
}

/**
 * mainContentKey selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      The current main content key.
 */
export function selectMainContentKey(state) {
    return state.ui.mainContentKey;
}

/**
 * scheduleEndDate selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Date}         The schedule end date.
 */
export function selectScheduleEndDate(state) {
    return state.ui.scheduleEndDate;
}

/**
 * scheduleStartDate selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Date}         The schedule start date.
 */
export function selectScheduleStartDate(state) {
    return state.ui.scheduleStartDate;
}


/**
 * snackbarContentKey selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      The current snackbar content key.
 */
export function selectSnackbarContentKey(state) {
    return state.ui.snackbarContentKey;
}
