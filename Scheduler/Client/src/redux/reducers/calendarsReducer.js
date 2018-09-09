//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import update from "immutability-helper";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    FETCH_CALENDARS,
    FETCH_CALENDARS_SUCCESS,
    FETCH_CALENDARS_ERROR
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

export const initialCalendarsState = {
    calendars: [],
    error: null,
    isLoading: false
};

/**
 * Calendars reducer
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 *
 * @return {Object}        Updated state
 */
export default function calendarsReducer(
    state = initialCalendarsState,
    action
) {
    let returnVal;

    switch (action.type) {
        case FETCH_CALENDARS:
            returnVal = update(state, {
                isLoading: { $set: true }
            });
            break;
        case FETCH_CALENDARS_ERROR:
            returnVal = update(state, {
                isLoading: { $set: false },
                error: { $set: action.error }
            });
            break;
        case FETCH_CALENDARS_SUCCESS:
            returnVal = update(state, {
                isLoading: { $set: false },
                error: { $set: null },
                calendars: { $set: action.calendars }
            });
            break;
        default:
            returnVal = state;
    }

    return returnVal;
}

/**
 * calendars selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object[]}     The array of calendar objects
 */
export function selectCalendars(state) {
    return state.calendars.calendars;
}

/**
 * isLoading selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether the calendars request is in progress
 */
export function selectCalendarsIsLoading(state) {
    return state.calendars.isLoading;
}

/**
 * error selector
 *
 * @param  {Object} state Store state object
 *
 * @return {string}       The calendars request error
 */
export function selectCalendarsError(state) {
    return state.calendars.error;
}
