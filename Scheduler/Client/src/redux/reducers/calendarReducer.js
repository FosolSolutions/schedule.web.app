//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import update from "immutability-helper";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    FETCH_CALENDAR,
    FETCH_EVENTS,
    FETCH_CALENDARS,
    FETCH_CALENDARS_ERROR,
    FETCH_CALENDARS_FAILURE,
    FETCH_CALENDARS_SUCCESS,
    FETCH_CALENDAR_ERROR,
    FETCH_CALENDAR_FAILURE,
    FETCH_CALENDAR_SUCCESS,
    FETCH_EVENTS_ERROR,
    FETCH_EVENTS_FAILURE,
    FETCH_EVENTS_SUCCESS,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { DATE_START_ECCLESIAL_SCHEDULE } from "utils/constants";

//------------------------------------------------------------------------------

export const initialCalendarsState = {
    calendar: {
        data: null,
        error: null,
        isLoading: true,
        populatedTo: DATE_START_ECCLESIAL_SCHEDULE,
    },
    calendars: {
        data: null,
        error: null,
        isLoading: true,
    },
    events: {
        data: null,
        error: null,
        isLoading: false,
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
        case FETCH_EVENTS:
            returnVal = update(state, {
                events: {
                    isLoading: { $set: true },
                },
            });
            break;
        case FETCH_EVENTS_ERROR:
            returnVal = update(state, {
                events: {
                    isLoading: { $set: false },
                    error: { $set: action.error },
                },
            });
            break;
        case FETCH_EVENTS_FAILURE:
            returnVal = update(state, {
                events: {
                    isLoading: { $set: false },
                    error: { $set: null },
                },
            });
            break;
        case FETCH_EVENTS_SUCCESS:
            returnVal = update(state, {
                events: {
                    data: { $set: action.events },
                    isLoading: { $set: false },
                    error: { $set: null },
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

/**
 * events selector
 *
 * @param  {Object} state   Store state object
 *
 * @return {CalendarEvetns} The CalendarEvents
 */
export function selectEvents(state) {
    return state.calendars.events.data;
}

/**
 * error selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object}       The events request error
 */
export function selectEventsError(state) {
    return state.calendars.events.error;
}
