//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import axios from "axios";
import format from "date-fns/format";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectCalendar } from "redux/reducers/calendarReducer";
import { setSnackbarContentKey } from "redux/actions/uiActions";

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
    FETCH_EVENTS,
    FETCH_EVENTS_SUCCESS,
    FETCH_EVENTS_FAILURE,
    FETCH_EVENTS_ERROR,
} from "redux/actionTypes";
import {
    PATH_DATA_CALENDARS,
    PATH_DATA_CALENDAR,
    PATH_DATA_EVENTS,
} from "utils/backendConstants";
import {
    SNACKBAR_NETWORK_ERROR,
    DATE_END_ECCLESIAL_SCHEDULE,
    DATE_START_ECCLESIAL_SCHEDULE,
    SNACKBAR_DYNAMIC_CALENDAR_ERROR,
    SNACKBAR_DYNAMIC_EVENTS_ERROR,
} from "utils/constants";
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
                handleErrorResponse(FETCH_CALENDARS_ERROR, dispatch, error);
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
        const PATH = `${PATH_DATA_CALENDAR}/${calendarId}?${startParam}${endParam}`;

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
                        calendar: response.data,
                    });
                } else {
                    dispatch({
                        type: FETCH_CALENDAR_FAILURE,
                    });
                }
            })
            .catch((error) => {
                handleErrorResponse(FETCH_CALENDAR_ERROR, dispatch, error);
            });
    };
}

/**
 * Hard-coded convenience method for 2019 Ecclesial schedule.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function fetchEcclesialCalendar() {
    return (dispatch) => {
        dispatch(
            fetchCalendarInRange(
                DATE_START_ECCLESIAL_SCHEDULE,
                DATE_END_ECCLESIAL_SCHEDULE,
            ),
        );
    };
}

/**
 * Fetch the events, with full activity, opening, participant data.
 *
 * @param  {Array} eventIds The event IDs to fetch full data for.
 *
 * @return {Function}       Action-dispatching thunk.
 */
export function fetchEvents(eventIds) {
    return (dispatch) => {
        const PATH = `${PATH_DATA_EVENTS}?ids=${eventIds.join()}`;

        dispatch({
            type: FETCH_EVENTS,
        });

        axios({
            method: "get",
            url: PATH,
            withCredentials: true,
        })
            .then((response) => {
                const status = response.status;

                if (status === 200) {
                    dispatch({
                        type: FETCH_EVENTS_SUCCESS,
                        events: response.data,
                    });
                } else {
                    dispatch({
                        type: FETCH_EVENTS_FAILURE,
                    });
                }
            })
            .catch((error) => {
                handleErrorResponse(FETCH_EVENTS_ERROR, dispatch, error);
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
 * @param {Object}   error           The returned error object.
 */
function handleErrorResponse(errorActionType, dispatch, error) {
    let dynamicSnackbarError = false;
    let showSnackbar = false;
    let errorMsg;

    if (typeof error.response !== "undefined" && typeof error.response.data !== "undefined") {
        if (error.response.status === 401) {
            errorMsg = "";
        } else {
            dynamicSnackbarError = true;
            errorMsg = error.response.data.message;
            showSnackbar = true;
        }
    } else if (
        typeof error.response !== "undefined" &&
        typeof error.response.status !== "undefined" &&
        typeof error.response.statusText !== "undefined"
    ) {
        if (error.response.status !== 401) {
            showSnackbar = true;
        }

        errorMsg = `${error.response.status}: ${error.response.statusText}`;
    } else if (typeof error.message !== "undefined" && typeof errorMsg !== "undefined") {
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

    if (showSnackbar && errorMsg !== "") {
        if (dynamicSnackbarError) {
            switch (errorActionType) {
                case FETCH_CALENDAR_ERROR:
                    dispatch(setSnackbarContentKey(SNACKBAR_DYNAMIC_CALENDAR_ERROR));
                    break;
                case FETCH_EVENTS_ERROR:
                    dispatch(setSnackbarContentKey(SNACKBAR_DYNAMIC_EVENTS_ERROR));
                    break;
                default:
            }
        } else {
            dispatch(setSnackbarContentKey(SNACKBAR_NETWORK_ERROR));
        }
    }
}
