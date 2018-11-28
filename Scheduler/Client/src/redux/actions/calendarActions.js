//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import axios from "axios";
import format from "date-fns/format";
import isEmpty from "lodash/isEmpty";
import endOfMonth from "date-fns/endOfMonth";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectCalendars,
    selectCurrentOpeningId,
    selectCurrentQuestionId,
} from "redux/reducers/calendarReducer";
import { setSnackbarContent } from "redux/actions/uiActions";

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
    FETCH_OPENING,
    FETCH_OPENING_SUCCESS,
    FETCH_OPENING_FAILURE,
    FETCH_OPENING_ERROR,
    APPLY_TO_OPENING,
    APPLY_TO_OPENING_SUCCESS,
    APPLY_TO_OPENING_FAILURE,
    APPLY_TO_OPENING_ERROR,
    UNAPPLY_FROM_OPENING,
    UNAPPLY_FROM_OPENING_SUCCESS,
    UNAPPLY_FROM_OPENING_FAILURE,
    UNAPPLY_FROM_OPENING_ERROR,
    SET_ANSWER,
    SET_CURRENT_OPENING_ID,
    SET_CURRENT_QUESTION_ID,
} from "redux/actionTypes";
import {
    PATH_DATA_CALENDARS,
    PATH_DATA_CALENDAR,
    PATH_DATA_EVENTS,
    PATH_DATA_APPLY,
    PATH_DATA_OPENING,
    PATH_DATA_UNAPPLY,
} from "utils/backendConstants";
import {
    SNACKBAR_NETWORK_ERROR,
    DATE_START_ECCLESIAL_SCHEDULE,
    SNACKBAR_DYNAMIC_CALENDAR_ERROR,
    SNACKBAR_DYNAMIC_EVENTS_ERROR,
    SNACKBAR_DYNAMIC_OPENING_ERROR,
    ARRAY_COMMAND_PUSH,
} from "utils/constants";
import { CalendarEventsNormalizer } from "utils/CalendarEventsNormalizer";
import { normalizeArrayData } from "utils/appDataUtils";

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Apply to the opening.
 *
 * @param {Object[]} answers    Array of answer objects. One key required: text.
 * @param {number}   openingId  The opening ID.
 * @param {string}   rowVersion The db row version.
 * @param {Function} onSuccess  Success callback from calling code.
 *
 * @return {Function}           Action-dispatching thunk.
 */
export function applyToOpening(answers, openingId, rowVersion, onSuccess) {
    return (dispatch) => {
        dispatch({
            type: APPLY_TO_OPENING,
            isLoading: openingId,
        });

        axios({
            method: "put",
            url: PATH_DATA_APPLY,
            withCredentials: true,
            data: {
                answers,
                openingId,
                rowVersion,
            },
        })
            .then((response) => {
                const status = response.status;

                if (status === 200) {
                    onSuccess();
                    dispatch({
                        type: APPLY_TO_OPENING_SUCCESS,
                        opening: response.data,
                    });
                } else {
                    dispatch({
                        type: APPLY_TO_OPENING_FAILURE,
                    });
                }
            })
            .catch((error) => {
                handleErrorResponse(APPLY_TO_OPENING_ERROR, dispatch, error);
            });
    };
}

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
                        calendars: normalizeArrayData(response.data),
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
 * @param  {Date} startOn Start date.
 * @param  {Date} endOn   End date.
 *
 * @return {Function}     Action-dispatching thunk.
 */
export function fetchCalendarInRange(startOn, endOn) {
    return (dispatch, getState) => {
        const calendars = selectCalendars(getState()).getAll();
        const currentCalendar = (isEmpty(calendars))
            ? null
            : calendars.values().next().value;
        const calendarId = (
            currentCalendar !== null &&
            currentCalendar.getId() !== null
        ) ? currentCalendar.getId() : 1;
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
                let normalizedEvents;

                if (response.status === 200) {
                    normalizedEvents = normalizeEventsData(response.data.events);

                    dispatch({
                        type: FETCH_CALENDAR_SUCCESS,
                        id: calendarId,
                        calendar: response.data,
                        events: normalizedEvents.events,
                    });
                    dispatch(fetchEvents(normalizedEvents.events.allIds));
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
                endOfMonth(DATE_START_ECCLESIAL_SCHEDULE),
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
                let normalizedData;

                if (status === 200) {
                    normalizedData = normalizeEventsData(response.data);
                    dispatch({
                        type: FETCH_EVENTS_SUCCESS,
                        events: normalizedData.events,
                        activities: normalizedData.activities,
                        openings: normalizedData.openings,
                    });

                    dispatch(fetchOpenings(normalizedData.openings.allIds));
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

/**
 * Recursively fetch the openings.
 *
 * @param  {Array} openingIds The opening IDs to fetch full data for.
 *
 * @return {Function}         Action-dispatching thunk.
 */
export function fetchOpenings(openingIds) {
    return (dispatch) => {
        openingIds.forEach((openingId, index) => {
            window.setTimeout(() => dispatch(fetchOpening(openingId)), index * 400);
        });
    };
}

/**
 * Recursively fetch the openings.
 *
 * @param  {number} openingId The opening ID to fetch full data for.
 *
 * @return {Function}         Action-dispatching thunk.
 */
export function fetchOpening(openingId) {
    return (dispatch) => {
        dispatch({
            type: FETCH_OPENING,
        });

        axios({
            method: "get",
            url: `${PATH_DATA_OPENING}/${openingId}`,
            withCredentials: true,
        })
            .then((response) => {
                if (response.status === 200) {
                    const questions = response.data.questions;

                    if (typeof questions !== "undefined" && questions.length > 0) {
                        hydrateAnswerMap(response.data, dispatch);
                    }

                    dispatch({
                        type: FETCH_OPENING_SUCCESS,
                        opening: response.data,
                    });
                } else {
                    dispatch({
                        type: FETCH_OPENING_FAILURE,
                    });
                }
            })
            .catch((error) => {
                handleErrorResponse(FETCH_OPENING_ERROR, dispatch, error);
            });
    };
}

/**
 * Unapply from the opening.
 *
 * @param {number}   openingId  The opening ID.
 * @param {string}   rowVersion The db row version.
 * @param {string}   onSuccess  Callback on success.
 *
 * @return {Function}        Action-dispatching thunk.
 */
export function unapplyFromOpening(openingId, rowVersion, onSuccess = () => {}) {
    return (dispatch) => {
        dispatch({
            type: UNAPPLY_FROM_OPENING,
            isLoading: openingId,
        });

        axios({
            method: "put",
            url: PATH_DATA_UNAPPLY,
            withCredentials: true,
            data: {
                id: openingId,
                rowVersion,
            },
        })
            .then((response) => {
                const status = response.status;

                if (status === 200) {
                    dispatch({
                        type: UNAPPLY_FROM_OPENING_SUCCESS,
                    });
                    onSuccess();
                } else {
                    dispatch({
                        type: UNAPPLY_FROM_OPENING_FAILURE,
                    });
                }
            })
            .catch((error) => {
                handleErrorResponse(UNAPPLY_FROM_OPENING_ERROR, dispatch, error);
            });
    };
}

/**
 * Set the current opening.
 *
 * @param {number} openingId The opening ID.
 *
 * @return {Object}          The action.
 */
export function setCurrentOpeningId(openingId) {
    return {
        type: SET_CURRENT_OPENING_ID,
        openingId,
    };
}

/**
 * Set the current question.
 *
 * @param {number} questionId The question ID.
 *
 * @return {Object}           The action.
 */
export function setCurrentQuestionId(questionId) {
    return {
        type: SET_CURRENT_QUESTION_ID,
        questionId,
    };
}

/**
 * Set the answer using the current opening/question ID from the store.
 *
 * @param {string} answer     The answer.
 *
 * @return {Object}           The action.
 */
export function setAnswerFromState(answer = "") {
    return (dispatch, getState) => {
        const currentState = getState();
        const openingId = selectCurrentOpeningId(currentState);
        const questionId = selectCurrentQuestionId(currentState);

        dispatch({
            type: SET_ANSWER,
            openingId,
            questionId,
            answer,
        });
    };
}

/**
 * Set the answer directly
 *
 * @param {number} openingId  The opening ID.
 * @param {number} questionId The question ID.
 * @param {string} answer     The answer.
 *
 * @return {Object}           The action.
 */
export function setAnswer(openingId, questionId, answer = "") {
    return {
        type: SET_ANSWER,
        openingId,
        questionId,
        answer,
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
    let snackbarContentKey;
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
                    snackbarContentKey = SNACKBAR_DYNAMIC_CALENDAR_ERROR;
                    break;
                case FETCH_EVENTS_ERROR:
                    snackbarContentKey = SNACKBAR_DYNAMIC_EVENTS_ERROR;
                    break;
                case APPLY_TO_OPENING_ERROR:
                case FETCH_OPENING_ERROR:
                    snackbarContentKey = SNACKBAR_DYNAMIC_OPENING_ERROR;
                    break;
                default:
            }
        } else {
            snackbarContentKey = SNACKBAR_NETWORK_ERROR;
            dispatch(setSnackbarContent(SNACKBAR_NETWORK_ERROR));
        }

        dispatch(setSnackbarContent(
            ARRAY_COMMAND_PUSH,
            {
                key: snackbarContentKey,
                text: errorMsg,
            },
        ));
    }
}

/**
 * Normalize the raw events data (requires special handling for now).
 *
 * @param {Array} rawEvents Array of events with nested activities and
 *                          openings. Raw return JSON.
 *
 * @return {Object}         Object with three properties each matching the
 *                          return spec of normalizeArrayData (with one
 *                          exception - the normalized events has "allIds",
 *                          "bibleClassIds", "bibleTalkIds", "hallCleaningIds"
 *                          and "memorialMeetingIds"):
 *                              - events     {Object} Normalized events
 *                              - activities {Object} Normalized activities
 *                              - openings   {Object} Normalized openings
 *
 */
export function normalizeEventsData(rawEvents) {
    const normalizedEvents = new CalendarEventsNormalizer(rawEvents);

    return {
        events: {
            byId: normalizedEvents.getEvents(),
            allIds: normalizedEvents.getAllEventIds(),
            bibleClassIds: normalizedEvents.getBibleClassIds(),
            bibleTalkIds: normalizedEvents.getBibleTalkIds(),
            hallCleaningIds: normalizedEvents.getHallCleaningIds(),
            memorialMeetingIds: normalizedEvents.getMemorialMeetingIds(),
        },
        activities: {
            byId: normalizedEvents.getActivities(),
            allIds: normalizedEvents.getActivityIds(),
        },
        openings: {
            byId: normalizedEvents.getOpenings(),
            allIds: normalizedEvents.getOpeningIds(),
        },
    };
}

/**
 * Hydrate the local answer store from the received questions.
 *
 * @param {Object} rawOpening Opening JSON
 * @param {Function} dispatch Redux dispatch function.
 */
function hydrateAnswerMap(rawOpening, dispatch) {
    rawOpening.questions.forEach((question) => {
        if (typeof rawOpening.id !== "undefined" && typeof question.id !== "undefined") {
            dispatch(setAnswer(rawOpening.id, question.id));
        }
    });
}
