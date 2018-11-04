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
    FETCH_CALENDAR_ERROR,
    FETCH_CALENDAR_SUCCESS,
} from "redux/actionTypes";
import {
    PATH_DATA_CALENDARS,
    PATH_DATA_CALENDAR,
} from "utils/backendConstants";
import { Calendar } from "utils/Calendar";
import { Calendars } from "utils/Calendars";

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
        const dateFormat = "yyyy-MM-dd";
        const startParam = (startOn === null) ? "" : `starton=${format(startOn, dateFormat)}&`;
        const endParam = `endon=${format(endOn, dateFormat)}`;
        const PATH = `${PATH_DATA_CALENDAR}${calendarId}?${startParam}${endParam}`;

        dispatch({
            type: FETCH_CALENDAR,
        });

        axios
            .get(
                PATH,
                {
                    withCredentials: true,
                },
            )
            .then((response) => {
                dispatch({
                    type: FETCH_CALENDAR_SUCCESS,
                    calendar: getCalendarFrontendFormat(response.data),
                });
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_CALENDAR_ERROR,
                    error,
                });
            });
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
