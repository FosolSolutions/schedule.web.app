//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import axios from "axios";
import format from "date-fns/format";
import isUndefined from "lodash/isUndefined";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectCurrentCalendar,
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
    FETCH_EVENTS,
    FETCH_EVENTS_SUCCESS,
    FETCH_EVENTS_FAILURE,
    FETCH_EVENTS_ERROR,
    FETCH_ACTIVITIES,
    FETCH_ACTIVITIES_SUCCESS,
    FETCH_ACTIVITIES_FAILURE,
    FETCH_ACTIVITIES_ERROR,
    FETCH_OPENINGS,
    FETCH_OPENINGS_SUCCESS,
    FETCH_OPENINGS_FAILURE,
    FETCH_OPENINGS_ERROR,
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
    PATH_DATA_APPLY,
    PATH_DATA_OPENING,
    PATH_DATA_UNAPPLY,
} from "utils/backendConstants";
import {
    SNACKBAR_NETWORK_ERROR,
    DATE_END_ECCLESIAL_SCHEDULE,
    DATE_START_ECCLESIAL_SCHEDULE,
    SNACKBAR_DYNAMIC_CALENDARS_ERROR,
    SNACKBAR_DYNAMIC_EVENTS_ERROR,
    SNACKBAR_DYNAMIC_OPENING_ERROR,
    SNACKBAR_DYNAMIC_ACTIVITIES_ERROR,
    SNACKBAR_DYNAMIC_OPENINGS_ERROR,
    ARRAY_COMMAND_PUSH,
    SORT_DATE,
    SORT_ORDER_ASC,
    SORT_ALPHABETICAL,
    ERROR_MESSAGE_UNKNOWN,
} from "utils/constants";
import { CalendarEventsNormalizer } from "utils/CalendarEventsNormalizer";
import { noOp } from "utils/generalUtils";
import { DataNormalizer } from "utils/DataNormalizer";

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
export function applyToOpening(answers, openingId, rowVersion, onSuccess = noOp) {
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
                const parsedError = getParsedErrorDetails(error);

                if (parsedError.errorMsg !== ERROR_MESSAGE_UNKNOWN) {
                    handleErrorResponse(APPLY_TO_OPENING_ERROR, dispatch, parsedError);
                } else {
                    throw error;
                }
            });
    };
}

/**
 * Fetch the calendars from the calendars endpoint.
 *
 * @param  {Function} onSuccess Success callback function.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function fetchCalendars(onSuccess = noOp) {
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
                let normalizer;

                if (status === 200) {
                    normalizer = new DataNormalizer(response.data);

                    dispatch({
                        type: FETCH_CALENDARS_SUCCESS,
                        calendars: normalizer.getNormalizedData(),
                    });

                    onSuccess();
                } else {
                    dispatch({
                        type: FETCH_CALENDARS_FAILURE,
                    });
                }
            })
            .catch((error) => {
                const parsedError = getParsedErrorDetails(error);

                if (parsedError.errorMsg !== ERROR_MESSAGE_UNKNOWN) {
                    handleErrorResponse(FETCH_CALENDARS_ERROR, dispatch, parsedError);
                } else {
                    throw error;
                }
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
        const onSuccessCallback = () => dispatch(
            fetchEventsInRange(
                DATE_START_ECCLESIAL_SCHEDULE,
                DATE_END_ECCLESIAL_SCHEDULE,
                true,
            ),
        );

        dispatch(fetchCalendars(onSuccessCallback));
    };
}

/**
 * Fetch the events within the specified date range.
 *
 * @param  {Date}    startOn            Start date.
 * @param  {Date}    endOn              End date.
 * @param  {boolean} fetchNextOnSuccess Whether to fetch activities on success.
 *
 * @return {Function}     Action-dispatching thunk.
 */
export function fetchEventsInRange(startOn, endOn, fetchNextOnSuccess = false) {
    return (dispatch, getState) => {
        const currentCalendar = selectCurrentCalendar(getState());
        const calendarId = currentCalendar.getId();
        const PATH = `${PATH_DATA_CALENDAR}/${calendarId}/events?${getDateRangeQueryString(startOn, endOn)}`;

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
                let normalizer;

                if (status === 200) {
                    normalizer = new CalendarEventsNormalizer(
                        response.data,
                        null,
                        SORT_DATE,
                        "startOn",
                        SORT_ORDER_ASC,
                    );

                    dispatch({
                        type: FETCH_EVENTS_SUCCESS,
                        events: normalizer.getNormalizedData(),
                    });

                    if (fetchNextOnSuccess) {
                        dispatch(fetchActivitiesInRange(startOn, endOn, true));
                    }
                } else {
                    dispatch({
                        type: FETCH_EVENTS_FAILURE,
                    });
                }
            })
            .catch((error) => {
                const parsedError = getParsedErrorDetails(error);

                if (parsedError.errorMsg !== ERROR_MESSAGE_UNKNOWN) {
                    handleErrorResponse(FETCH_EVENTS_ERROR, dispatch, parsedError);
                } else {
                    throw error;
                }
            });
    };
}

/**
 * Fetch the activities within the specified date range.
 *
 * @param  {Date}    startOn            Start date.
 * @param  {Date}    endOn              End date.
 * @param  {boolean} fetchNextOnSuccess Whether to fetch openings on success.
 *
 * @return {Function}                   Action-dispatching thunk.
 */
export function fetchActivitiesInRange(startOn, endOn, fetchNextOnSuccess) {
    return (dispatch, getState) => {
        const currentCalendar = selectCurrentCalendar(getState());
        const calendarId = currentCalendar.getId();
        const PATH = `${PATH_DATA_CALENDAR}/${calendarId}/activities?${getDateRangeQueryString(startOn, endOn)}`;

        dispatch({
            type: FETCH_ACTIVITIES,
        });

        axios({
            method: "get",
            url: PATH,
            withCredentials: true,
        })
            .then((response) => {
                const status = response.status;
                let normalizer;

                if (status === 200) {
                    normalizer = new DataNormalizer(
                        response.data,
                        "eventId",
                        SORT_ALPHABETICAL,
                        "name",
                        SORT_ORDER_ASC,
                    );

                    dispatch({
                        type: FETCH_ACTIVITIES_SUCCESS,
                        activities: normalizer.getNormalizedData(),
                        activitiesByEvent: normalizer.getParentMap(),
                    });

                    if (fetchNextOnSuccess) {
                        dispatch(fetchOpeningsInRange(startOn, endOn));
                    }
                } else {
                    dispatch({
                        type: FETCH_ACTIVITIES_FAILURE,
                    });
                }
            })
            .catch((error) => {
                const parsedError = getParsedErrorDetails(error);

                if (parsedError.errorMsg !== ERROR_MESSAGE_UNKNOWN) {
                    handleErrorResponse(FETCH_ACTIVITIES_ERROR, dispatch, parsedError);
                } else {
                    throw error;
                }
            });
    };
}

/**
 * Fetch the openings within the specified date range.
 *
 * @param  {Date} startOn Start date.
 * @param  {Date} endOn   End date.
 *
 * @return {Function}     Action-dispatching thunk.
 */
export function fetchOpeningsInRange(startOn, endOn) {
    return (dispatch, getState) => {
        const currentCalendar = selectCurrentCalendar(getState());
        const calendarId = currentCalendar.getId();
        const PATH = `${PATH_DATA_CALENDAR}/${calendarId}/openings?${getDateRangeQueryString(startOn, endOn)}`;

        dispatch({
            type: FETCH_OPENINGS,
        });

        axios({
            method: "get",
            url: PATH,
            withCredentials: true,
        })
            .then((response) => {
                const status = response.status;
                let normalizer;

                if (status === 200) {
                    normalizer = new DataNormalizer(
                        response.data,
                        "activityId",
                        SORT_ALPHABETICAL,
                        "name",
                        SORT_ORDER_ASC,
                    );

                    dispatch({
                        type: FETCH_OPENINGS_SUCCESS,
                        openings: normalizer.getNormalizedData(),
                        openingsByActivity: normalizer.getParentMap(),
                    });
                } else {
                    dispatch({
                        type: FETCH_OPENINGS_FAILURE,
                    });
                }
            })
            .catch((error) => {
                const parsedError = getParsedErrorDetails(error);

                if (parsedError.errorMsg !== ERROR_MESSAGE_UNKNOWN) {
                    handleErrorResponse(FETCH_OPENINGS_ERROR, dispatch, parsedError);
                } else {
                    throw error;
                }
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
 * @param  {number} onSuccess Callback on success.
 *
 * @return {Function}         Action-dispatching thunk.
 */
export function fetchOpening(openingId, onSuccess = noOp) {
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

                    if (!isUndefined(questions) && questions.length > 0) {
                        hydrateAnswerMap(response.data, dispatch);
                    }

                    dispatch({
                        type: FETCH_OPENING_SUCCESS,
                        opening: response.data,
                    });

                    onSuccess();
                } else {
                    dispatch({
                        type: FETCH_OPENING_FAILURE,
                    });
                }
            })
            .catch((error) => {
                const parsedError = getParsedErrorDetails(error);

                if (parsedError.errorMsg !== ERROR_MESSAGE_UNKNOWN) {
                    handleErrorResponse(FETCH_OPENING_ERROR, dispatch, parsedError);
                } else {
                    throw error;
                }
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
export function unapplyFromOpening(openingId, rowVersion, onSuccess = noOp) {
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
                        opening: response.data,
                    });
                    onSuccess();
                } else {
                    dispatch({
                        type: UNAPPLY_FROM_OPENING_FAILURE,
                    });
                }
            })
            .catch((error) => {
                const parsedError = getParsedErrorDetails(error);

                if (parsedError.errorMsg !== ERROR_MESSAGE_UNKNOWN) {
                    handleErrorResponse(
                        UNAPPLY_FROM_OPENING_ERROR,
                        dispatch,
                        parsedError,
                    );
                } else {
                    throw error;
                }
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
 * Get the date range query string (using "startOn", "endOn" params), with no
 * leading "?".
 *
 * @param  {Date|null} startOn The start Date (optional).
 * @param  {Date}      endOn   The end Date.
 *
 * @return {string}            The query string as described above.
 */
function getDateRangeQueryString(startOn, endOn) {
    const dateFormat = "yyyy-MM-dd";
    const startParam = (startOn === null) ? "" : `starton=${format(startOn, dateFormat)}&`;
    const endParam = `endon=${format(endOn, dateFormat)} 23:59:59`;

    return `${startParam}${endParam}`;
}

/**
 * Parse the error object and return an object with the following keys:
 *   - {boolean} dynamicSnackbarError Whether to show the error message verbatim
 *                                    to the user.
 *   - {boolean} showSnacbar          Whether to show a snackbar.
 *   - {string}  errorMsg             The message.
 *
 * @param  {Object} error The XHR error object
 *
 * @return {Object}      The return object described above
 */
function getParsedErrorDetails(error) {
    const returnVal = {
        dynamicSnackbarError: false,
        showSnackbar: false,
        errorMsg: undefined,
    };

    if (!isUndefined(error.response) && !isUndefined(error.response.data)) {
        if (error.response.status === 401) {
            returnVal.errorMsg = "";
        } else {
            returnVal.dynamicSnackbarError = true;
            returnVal.errorMsg = error.response.data.message;
            returnVal.showSnackbar = true;
        }
    } else if (
        !isUndefined(error.response) &&
        !isUndefined(error.response.status) &&
        !isUndefined(error.response.statusText)
    ) {
        if (error.response.status !== 401) {
            returnVal.showSnackbar = true;
        }

        returnVal.errorMsg = `${error.response.status}: ${error.response.statusText}`;
    } else if (!isUndefined(error.message) && !isUndefined(returnVal.errorMsg)) {
        returnVal.errorMsg = error.message;
        returnVal.showSnackbar = true;
    } else {
        returnVal.errorMsg = ERROR_MESSAGE_UNKNOWN;
        returnVal.showSnackbar = true;
    }

    return returnVal;
}

/**
 * Handle calendar-related endpoint error responses.
 *
 * @param {string}   errorActionType The action type of the error.
 * @param {Function} dispatch        Redux dispatch method.
 * @param {Object}   parsedError     The parsed error object.
 */
function handleErrorResponse(errorActionType, dispatch, parsedError) {
    let snackbarContentKey;

    dispatch({
        type: errorActionType,
        error: parsedError.errorMsg,
    });

    if (parsedError.showSnackbar && parsedError.errorMsg !== "") {
        if (parsedError.dynamicSnackbarError) {
            switch (errorActionType) {
                case FETCH_CALENDARS_ERROR:
                    snackbarContentKey = SNACKBAR_DYNAMIC_CALENDARS_ERROR;
                    break;
                case FETCH_EVENTS_ERROR:
                    snackbarContentKey = SNACKBAR_DYNAMIC_EVENTS_ERROR;
                    break;
                case FETCH_ACTIVITIES_ERROR:
                    snackbarContentKey = SNACKBAR_DYNAMIC_ACTIVITIES_ERROR;
                    break;
                case FETCH_OPENINGS_ERROR:
                    snackbarContentKey = SNACKBAR_DYNAMIC_OPENINGS_ERROR;
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
                text: parsedError.errorMsg,
            },
        ));
    }
}

/**
 * Hydrate the local answer store from the received questions.
 *
 * @param {Object} rawOpening Opening JSON
 * @param {Function} dispatch Redux dispatch function.
 */
function hydrateAnswerMap(rawOpening, dispatch) {
    rawOpening.questions.forEach((question) => {
        if (!isUndefined(rawOpening.id) && !isUndefined(question.id)) {
            dispatch(setAnswer(rawOpening.id, question.id));
        }
    });
}
