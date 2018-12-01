//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import update from "immutability-helper";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    APPLY_TO_OPENING,
    APPLY_TO_OPENING_ERROR,
    APPLY_TO_OPENING_FAILURE,
    APPLY_TO_OPENING_SUCCESS,
    FETCH_CALENDAR,
    FETCH_ACTIVITIES,
    FETCH_OPENINGS,
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
    FETCH_OPENINGS_ERROR,
    FETCH_OPENINGS_FAILURE,
    FETCH_OPENINGS_SUCCESS,
    FETCH_ACTIVITIES_ERROR,
    FETCH_ACTIVITIES_FAILURE,
    FETCH_ACTIVITIES_SUCCESS,
    FETCH_OPENING,
    FETCH_OPENING_ERROR,
    FETCH_OPENING_FAILURE,
    FETCH_OPENING_SUCCESS,
    UNAPPLY_FROM_OPENING,
    UNAPPLY_FROM_OPENING_ERROR,
    UNAPPLY_FROM_OPENING_FAILURE,
    UNAPPLY_FROM_OPENING_SUCCESS,
    SET_ANSWER,
    SET_CURRENT_QUESTION_ID,
    SET_CURRENT_OPENING_ID,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { EventActivities } from "utils/EventActivities";
import { ActivityOpenings } from "utils/ActivityOpenings";
import { CalendarEvents } from "utils/CalendarEvents";
import { Calendars } from "utils/Calendars";

//------------------------------------------------------------------------------

const initialStateData = {
    byId: {},
    allIds: [],
    childrenById: [],
};

const initialEventsStateData = {
    ...initialStateData,
    bibleClassIds: [],
    bibleTalkIds: [],
    hallCleaningIds: [],
    memorialMeetingIds: [],
};

export const initialCalendarsState = {
    answers: {},
    currentOpeningId: null,
    currentQuestionId: null,
    calendars: {
        data: initialStateData,
        error: null,
        isLoading: true,
    },
    events: {
        data: initialEventsStateData,
        error: null,
        isLoading: false,
    },
    activities: {
        data: initialStateData,
        error: null,
        isLoading: false,
    },
    openings: {
        data: initialStateData,
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
    let openingId;
    let questionId;
    let answer;

    switch (action.type) {
        case APPLY_TO_OPENING:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: action.isLoading },
                },
            });
            break;
        case APPLY_TO_OPENING_ERROR:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: false },
                    error: { $set: action.error },
                },
            });
            break;
        case APPLY_TO_OPENING_FAILURE:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: false },
                    error: { $set: null },
                },
            });
            break;
        case APPLY_TO_OPENING_SUCCESS:
            if (typeof state.openings.data.byId[action.opening.id] !== "undefined") {
                returnVal = update(state, {
                    openings: {
                        isLoading: { $set: false },
                        error: { $set: null },
                        data: {
                            byId: {
                                [action.opening.id]: { $set: action.opening },
                            },
                        },
                    },
                });
            } else {
                returnVal = update(state, {
                    openings: {
                        isLoading: { $set: false },
                        error: { $set: null },
                        data: {
                            byId: {
                                [action.opening.id]: { $set: action.opening },
                            },
                            allIds: { $push: [action.opening.id] },
                        },
                    },
                });
            }
            break;
        case FETCH_ACTIVITIES:
            returnVal = update(state, {
                activities: {
                    isLoading: { $set: true },
                },
            });
            break;
        case FETCH_ACTIVITIES_ERROR:
            returnVal = update(state, {
                activities: {
                    isLoading: { $set: false },
                    error: { $set: action.error },
                },
            });
            break;
        case FETCH_ACTIVITIES_FAILURE:
            returnVal = update(state, {
                activities: {
                    isLoading: { $set: false },
                    error: { $set: null },
                },
            });
            break;
        case FETCH_ACTIVITIES_SUCCESS:
            if (state.activities.data.allIds.length === 0) {
                returnVal = update(state, {
                    events: {
                        data: {
                            childrenById: { $set: action.activitiesByEvent },
                        },
                    },
                    activities: {
                        data: {
                            byId: { $set: action.activities.byId },
                            allIds: { $set: action.activities.allIds },
                        },
                        isLoading: { $set: false },
                        error: { $set: null },
                    },
                });
            } else {
                returnVal = update(state, {
                    events: {
                        data: {
                            childrenById: { $merge: action.activitiesByEvent },
                        },
                    },
                    activities: {
                        data: {
                            allIds: { $push: action.activities.allIds },
                            byId: { $merge: action.activities.byId },
                        },
                        isLoading: { $set: false },
                        error: { $set: null },
                    },
                });
            }
            break;
        case FETCH_CALENDAR:
            returnVal = update(state, {
                calendars: {
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
                calendars: {
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
                calendars: {
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
            if (typeof state.calendars.data.byId[action.id] !== "undefined") {
                returnVal = update(state, {
                    calendars: {
                        isLoading: { $set: false },
                        error: { $set: null },
                        data: {
                            byId: {
                                [action.id]: { $set: action.calendar },
                            },
                        },
                    },
                    events: {
                        data: { $set: action.events },
                    },
                });
            } else {
                returnVal = update(state, {
                    calendars: {
                        isLoading: { $set: false },
                        error: { $set: null },
                        data: {
                            byId: {
                                [action.id]: { $set: action.calendar },
                            },
                            allIds: { $push: [action.id] },
                        },
                    },
                    events: {
                        data: { $set: action.events },
                    },
                });
            }
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
            if (state.events.data.allIds.length === 0) {
                returnVal = update(state, {
                    events: {
                        data: {
                            byId: { $set: action.events.byId },
                            allIds: { $set: action.events.allIds },
                        },
                        isLoading: { $set: false },
                        error: { $set: null },
                    },
                });
            } else {
                returnVal = update(state, {
                    events: {
                        data: {
                            allIds: { $push: action.events.allIds },
                            byId: { $merge: action.events.byId },
                        },
                        isLoading: { $set: false },
                        error: { $set: null },
                    },
                });
            }
            break;
        case FETCH_OPENING:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: true },
                },
            });
            break;
        case FETCH_OPENING_ERROR:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: false },
                    error: { $set: action.error },
                },
            });
            break;
        case FETCH_OPENING_FAILURE:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: false },
                    error: { $set: null },
                },
            });
            break;
        case FETCH_OPENING_SUCCESS:
            if (typeof state.openings.data.byId[action.opening.id] !== "undefined") {
                returnVal = update(state, {
                    openings: {
                        isLoading: { $set: false },
                        error: { $set: null },
                        data: {
                            byId: {
                                [action.opening.id]: { $set: action.opening },
                            },
                        },
                    },
                });
            } else {
                returnVal = update(state, {
                    openings: {
                        isLoading: { $set: false },
                        error: { $set: null },
                        data: {
                            byId: {
                                [action.opening.id]: { $set: action.opening },
                            },
                            allIds: { $push: [action.opening.id] },
                        },
                    },
                });
            }
            break;
        case FETCH_OPENINGS:
            returnVal = update(state, {
                events: {
                    isLoading: { $set: true },
                },
            });
            break;
        case FETCH_OPENINGS_ERROR:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: false },
                    error: { $set: action.error },
                },
            });
            break;
        case FETCH_OPENINGS_FAILURE:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: false },
                    error: { $set: null },
                },
            });
            break;
        case FETCH_OPENINGS_SUCCESS:
            if (state.openings.data.allIds.length === 0) {
                returnVal = update(state, {
                    activities: {
                        data: {
                            childrenById: { $set: action.openingsByActivity },
                        },
                    },
                    openings: {
                        data: { $set: action.openings },
                        isLoading: { $set: false },
                        error: { $set: null },
                    },
                });
            } else {
                returnVal = update(state, {
                    activities: {
                        data: {
                            childrenById: { $merge: action.openingsByActivity },
                        },
                    },
                    openings: {
                        data: {
                            allIds: { $push: action.openings.allIds },
                            byId: { $merge: action.openings.byId },
                        },
                        isLoading: { $set: false },
                        error: { $set: null },
                    },
                });
            }
            break;
        case UNAPPLY_FROM_OPENING:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: action.isLoading },
                },
            });
            break;
        case UNAPPLY_FROM_OPENING_ERROR:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: false },
                    error: { $set: action.error },
                },
            });
            break;
        case UNAPPLY_FROM_OPENING_FAILURE:
            returnVal = update(state, {
                openings: {
                    isLoading: { $set: false },
                    error: { $set: null },
                },
            });
            break;
        case UNAPPLY_FROM_OPENING_SUCCESS:
            if (typeof state.openings.data.byId[action.opening.id] !== "undefined") {
                returnVal = update(state, {
                    openings: {
                        isLoading: { $set: false },
                        error: { $set: null },
                        data: {
                            byId: {
                                [action.opening.id]: { $set: action.opening },
                            },
                        },
                    },
                });
            } else {
                returnVal = update(state, {
                    openings: {
                        isLoading: { $set: false },
                        error: { $set: null },
                        data: {
                            byId: {
                                [action.opening.id]: { $set: action.opening },
                            },
                            allIds: { $push: [action.opening.id] },
                        },
                    },
                });
            }
            break;
        case SET_ANSWER:
            openingId = action.openingId;
            questionId = action.questionId;
            answer = action.answer;

            if (typeof state.answers[openingId] === "undefined") {
                const fullAnswer = { [openingId]: { [questionId]: answer } };
                returnVal = update(state, {
                    answers: { $merge: fullAnswer },
                });
            } else if (typeof state.answers[openingId][questionId] === "undefined") {
                returnVal = update(state, {
                    answers: {
                        [openingId]: { $merge: { [questionId]: action.answer } },
                    },
                });
            } else {
                returnVal = update(state, {
                    answers: {
                        [openingId]: {
                            [questionId]: { $set: action.answer },
                        },
                    },
                });
            }
            break;
        case SET_CURRENT_OPENING_ID:
            returnVal = update(state, {
                currentOpeningId: { $set: action.openingId },
            });
            break;
        case SET_CURRENT_QUESTION_ID:
            returnVal = update(state, {
                currentQuestionId: { $set: action.questionId },
            });
            break;
        default:
            returnVal = state;
    }

    return returnVal;
}

//------------------------------------------------------------------------------
// Selectors
//------------------------------------------------------------------------------
/**
 * applications isLoading selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether the application is loading.
 */
export function selectApplicationIsLoading(state) {
    return state.calendars.applications.isLoading;
}

/**
 * applications error selector
 *
 * @param  {Object} state Store state object
 *
 * @return {string}       The application error.
 */
export function selectApplicationError(state) {
    return state.calendars.applications.error;
}

/**
 * calendars selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object[]}     The array of calendar objects
 */
export function selectCalendars(state) {
    return new Calendars(state.calendars.calendars.data);
}

/**
 * Current calendar selector. Currently this just returns the first calendar, as
 * multiple calendars are not supported yet.
 *
 * @param  {Object} state Store state object.
 *
 * @return {Calendar}     The current (first) calendar.
 */
export function selectCurrentCalendar(state) {
    const calendars = selectCalendars(state).getAll();
    return calendars.values().next().value;
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
 * @param  {Object} state      Store state object
 *
 * @return {Array}             The events
 */
export function selectEvents(state) {
    return new CalendarEvents(state.calendars.events.data);
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

/**
 * activities selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object}       The activities
 */
export function selectActivities(state) {
    return new EventActivities(state.calendars.activities.data);
}

/**
 * openings selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object}       The openings
 */
export function selectOpenings(state) {
    return new ActivityOpenings(state.calendars.openings.data);
}

/**
 * error selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object}       The openings request error
 */
export function selectOpeningsError(state) {
    return state.calendars.openings.error;
}

/**
 * error selector
 *
 * @param  {Object} state    Store state object
 *
 * @return {boolean|number}  Whether openings or which opening is loading.
 */
export function selectOpeningsIsLoading(state) {
    return state.calendars.openings.isLoading;
}

/**
 * answers selector
 *
 * @param  {Object} state    Store state object
 *
 * @return {Object}          The answers, mapped by opening and question ID.
 */
export function selectAnswers(state) {
    return state.calendars.answers;
}

/**
 * currentOpeningId selector
 *
 * @param  {Object} state    Store state object
 *
 * @return {Object}          The current opening ID.
 */
export function selectCurrentOpeningId(state) {
    return state.calendars.currentOpeningId;
}

/**
 * currentQuestionId selector
 *
 * @param  {Object} state    Store state object
 *
 * @return {Object}          The current question ID.
 */
export function selectCurrentQuestionId(state) {
    return state.calendars.currentQuestionId;
}
