//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import axios from "axios";
import format from "date-fns/format";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectCalendar } from "redux/reducers/calendarsReducer";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    FETCH_CALENDARS,
    FETCH_CALENDARS_SUCCESS,
    FETCH_CALENDARS_ERROR,
    FETCH_CALENDARS_FAILURE,
    FETCH_CALENDAR,
    FETCH_CALENDAR_SUCCESS,
} from "redux/actionTypes";
import {
    PATH_DATA_CALENDARS,
    PATH_DATA_CALENDAR,
} from "utils/backendConstants";
import {
    calendar1RangeOct as calendarOctober,
    calendar1RangeNov as calendarNovember,
    calendar1RangeDec as calendarDecember,
} from "mocks/mockEndpointResponseData";
import { Calendar } from "utils/Calendar";
import { Calendars } from "utils/Calendars";
import { isSameMonth } from "date-fns/esm";

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
/**
 * Fetch the calendars from the calendars endpoint.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function fetchCalendars() {
    return (dispatch) => {
        dispatch({
            type: FETCH_CALENDARS,
        });

        axios({
            method: "get",
            url: PATH_DATA_CALENDARS,
            withCredentials: true,
        })
            .then((response) => {
                if (response.status === 200) {
                    dispatch({
                        type: FETCH_CALENDARS_SUCCESS,
                        calendars: getCalendarsFrontendFormat(response.data),
                    });
                } else {
                    dispatch({
                        type: FETCH_CALENDARS_FAILURE,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_CALENDARS_ERROR,
                    error,
                });
            });
    };
}

/**
 * Fetch the current calendar including events in the specified date range.
 *
 * @param  {Date} startOn Start date. Optional, defaults to now.
 * @param  {Date} endOn   End date.
 *
 * @return {Function}     Action-dispatching thunk.
 */
export function fetchCalendarInRange(startOn = null, endOn) {
    return (dispatch, getState) => {
        const currentCalendar = selectCalendar(getState());
        const calendarId = currentCalendar.id || 1;
        const dateFormat = "YYYY-LL-dd";
        const startParam = (startOn === null) ? "" : `starton=${format(startOn, dateFormat, { awareOfUnicodeTokens: true })}&`;
        const endParam = `endon${format(endOn, dateFormat, { awareOfUnicodeTokens: true })}`;
        const PATH = `${PATH_DATA_CALENDAR}${calendarId}?${startParam}${endParam}`; // eslint-disable-line

        // START-- Mock data handling ---
        const octDate = new Date(2018, 9, 1);
        const novDate = new Date(2018, 10, 1);
        const decDate = new Date(2018, 11, 1);
        const IS_OCT = isSameMonth(startOn, octDate);
        const IS_NOV = isSameMonth(startOn, novDate);
        const IS_DEC = isSameMonth(startOn, decDate);
        let mockCalendar;

        if (IS_OCT) {
            mockCalendar = calendarOctober;
        } else if (IS_NOV) {
            mockCalendar = calendarNovember;
        } else if (IS_DEC) {
            mockCalendar = calendarDecember;
        }
        // END--- Mock data handling ---

        dispatch({
            type: FETCH_CALENDAR,
        });

        dispatch({
            type: FETCH_CALENDAR_SUCCESS,
            calendar: getCalendarFrontendFormat(mockCalendar),
        });

        // Un-comment when API ready
        // axios
        //     .get(
        //         PATH,
        //         {
        //             withCredentials: true,
        //         },
        //     )
        //     .then((response) => {
        //         console.log(response);
        //         dispatch({
        //             type: FETCH_CALENDAR_SUCCESS,
        //             calendar: getCalendarFrontendFormat(mockCalendar),
        //         });
        //     })
        //     .catch((error) => {
        //         dispatch({
        //             type: FETCH_CALENDAR_ERROR,
        //             error,
        //         });
        //     });
    };
}

//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
/**
 * Get the frontend-formatted calendars array.
 *
 * @param {Object} calendarsResponseData Calendars endpoint response data
 *
 * @return {Calendar[]}                  Array of Calendar instances
 */
function getCalendarsFrontendFormat(calendarsResponseData) {
    const calendars = new Calendars(calendarsResponseData);

    return calendars.getAll();
}

/**
 * Get the frontend-formatted calendars array.
 *
 * @param {Object} calendarResponseData Calendar endpoint response data
 *
 * @return {Calendar}                   A Calendar instance
 */
function getCalendarFrontendFormat(calendarResponseData) {
    return new Calendar(calendarResponseData);
}
