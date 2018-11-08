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
    FETCH_CALENDAR_FAILURE,
    FETCH_CALENDAR_SUCCESS,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

export const initialCalendarsState = {
    calendar: {
        data: null,
        error: null,
        isLoading: true,
    },
    calendars: {
        data: null,
        error: null,
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
export default function calendarReducer(state = initialCalendarsState, action) {
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
                    error: { $set: action.error },
                },
            });
            break;
        case FETCH_CALENDAR_FAILURE:
            returnVal = update(state, {
                calendar: {
                    isLoading: { $set: false },
                    error: { $set: null },
                },
            });
            break;
        case FETCH_CALENDARS_FAILURE:
            returnVal = update(state, {
                calendars: {
                    isLoading: { $set: false },
                    error: { $set: null },
                },
            });
            break;
        case FETCH_CALENDAR_SUCCESS:
            returnVal = update(state, {
                calendar: {
                    isLoading: { $set: false },
                    error: { $set: null },
                    data: { $set: action.calendar },
                },
            });
            break;
        case FETCH_CALENDARS_SUCCESS:
            returnVal = update(state, {
                calendars: {
                    isLoading: { $set: false },
                    error: { $set: null },
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
 * calendar error selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether there is a calendar error.
 */
export function selectCalendarError(state) {
    return state.calendars.calendar.error;
}

/**
 * calendar isLoading selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether the calendar is loading.
 */
export function selectCalendarIsLoading(state) {
    return state.calendars.calendar.isLoading;
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
