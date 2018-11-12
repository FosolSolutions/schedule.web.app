//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import axios from "axios";
import format from "date-fns/format";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectCalendar } from "redux/reducers/calendarReducer";
import { selectPageId } from "redux/reducers/uiReducer";
import {
    setPageId,
    setSnackbarContentKey,
} from "redux/actions/uiActions";

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
    FETCH_CALENDAR_FAILURE,
    FETCH_CALENDAR_SUCCESS,
} from "redux/actionTypes";
import {
    PAGE_ID_ROOT,
    PATH_DATA_CALENDARS,
    PATH_DATA_CALENDAR,
} from "utils/backendConstants";
import {
    HISTORY_REPLACE,
    SNACKBAR_NETWORK_ERROR,
} from "utils/constants";
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
    return (dispatch, getState) => {
        dispatch({
            type: FETCH_CALENDARS,
        });

        axios({
            method: "get",
            url: PATH_DATA_CALENDARS,
            withCredentials: true,
        })
            .then((response) => {
                const status = response.status;

                if (status === 200) {
                    dispatch({
                        type: FETCH_CALENDARS_SUCCESS,
                        calendars: new Calendars(response.data),
                    });
                } else {
                    dispatch({
                        type: FETCH_CALENDARS_FAILURE,
                    });
                }
            })
            .catch((error) => {
                handleErrorResponse(FETCH_CALENDARS_ERROR, dispatch, getState, error);
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
        const calendarId = (currentCalendar !== null) ? currentCalendar.id : 1;
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
                if (response.status === 200) {
                    dispatch({
                        type: FETCH_CALENDAR_SUCCESS,
                        calendar: new Calendar(response.data),
                    });
                } else {
                    dispatch({
                        type: FETCH_CALENDAR_FAILURE,
                    });
                }
            })
            .catch((error) => {
                handleErrorResponse(FETCH_CALENDAR_ERROR, dispatch, getState, error);
            });
    };
}

//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
/**
 * Handle calendar-related endpoint error responses.
 *
 * @param {string}   errorActionType The action type of the error.
 * @param {Function} dispatch        Redux dispatch method.
 * @param {Function} getState        Redux getState method.
 * @param {Object}   error           The returned error object.
 */
function handleErrorResponse(errorActionType, dispatch, getState, error) {
    const pageId = selectPageId(getState());
    let showSnackbar = false;
    let errorMsg;

    if (pageId !== PAGE_ID_ROOT) {
        dispatch(setPageId(PAGE_ID_ROOT, HISTORY_REPLACE));
    }

    if (
        typeof error.response !== "undefined" &&
        typeof error.response.status !== "undefined" &&
        typeof error.response.statusText !== "undefined"
    ) {
        if (error.response.status !== 401) {
            showSnackbar = true;
        }

        errorMsg = `${error.response.status}: ${error.response.statusText}`;
    } else if (typeof error.message !== "undefined") {
        errorMsg = error.message;
        showSnackbar = true;
    } else {
        errorMsg = "Unknown Error";
        showSnackbar = true;
    }

    dispatch({
        type: errorActionType,
        error: errorMsg,
    });

    if (showSnackbar) {
        dispatch(setSnackbarContentKey(SNACKBAR_NETWORK_ERROR));
    }
}
