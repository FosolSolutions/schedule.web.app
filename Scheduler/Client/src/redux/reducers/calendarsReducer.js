//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import update from "immutability-helper";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    FETCH_CALENDAR,
    FETCH_CALENDARS,
    FETCH_CALENDARS_ERROR,
    FETCH_CALENDARS_FAILURE,
    FETCH_CALENDARS_SUCCESS,
    FETCH_CALENDAR_ERROR,
    FETCH_CALENDAR_SUCCESS,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

export const initialCalendarsState = {
    calendar: {
        data: {},
        error: false,
        isLoading: false,
    },
    calendars: {
        data: [],
        error: false,
        isLoading: true,
    },
};

/**
 * Calendars reducer
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 *
 * @return {Object}        Updated state
 */
export default function calendarsReducer(state = initialCalendarsState, action) {
    let returnVal;

    switch (action.type) {
        case FETCH_CALENDAR:
            returnVal = update(state, {
                calendar: {
                    isLoading: { $set: true },
                },
            });
            break;
        case FETCH_CALENDARS:
            returnVal = update(state, {
                calendars: {
                    isLoading: { $set: true },
                },
            });
            break;
        case FETCH_CALENDAR_ERROR:
            returnVal = update(state, {
                calendar: {
                    isLoading: { $set: false },
                    error: { $set: action.error },
                },
            });
            break;
        case FETCH_CALENDARS_ERROR:
            returnVal = update(state, {
                calendars: {
                    isLoading: { $set: false },
                    error: { $set: true },
                },
            });
            break;
        case FETCH_CALENDARS_FAILURE:
            returnVal = update(state, {
                calendars: {
                    isLoading: { $set: false },
                    error: { $set: true },
                },
            });
            break;
        case FETCH_CALENDAR_SUCCESS:
            returnVal = update(state, {
                calendar: {
                    isLoading: { $set: false },
                    error: { $set: false },
                    data: { $set: action.calendar },
                },
            });
            break;
        case FETCH_CALENDARS_SUCCESS:
            returnVal = update(state, {
                calendars: {
                    isLoading: { $set: false },
                    error: { $set: false },
                    data: { $set: action.calendars },
                },
            });
            break;
        default:
            returnVal = state;
    }

    return returnVal;
}

/**
 * calendar selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object[]}     The calendar object
 */
export function selectCalendar(state) {
    return state.calendars.calendar.data;
}

/**
 * calendars selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object[]}     The array of calendar objects
 */
export function selectCalendars(state) {
    return state.calendars.calendars.data;
}

/**
 * isLoading selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether the calendars request is in progress
 */
export function selectCalendarsIsLoading(state) {
    return state.calendars.calendars.isLoading;
}

/**
 * error selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object}       The calendars request error
 */
export function selectCalendarsError(state) {
    return state.calendars.calendars.error;
}
