//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import update from "immutability-helper";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    LOGIN,
    LOGIN_ERROR,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    SIGN_OFF,
    SIGN_OFF_ERROR,
    SIGN_OFF_FAILURE,
    SIGN_OFF_SUCCESS,
    FETCH_IDENTITY,
    FETCH_IDENTITY_ERROR,
    FETCH_IDENTITY_FAILURE,
    FETCH_IDENTITY_SUCCESS,
    MANAGE_PARTICIPANT,
    MANAGE_PARTICIPANT_ERROR,
    MANAGE_PARTICIPANT_FAILURE,
    MANAGE_PARTICIPANT_SUCCESS,
    SET_IS_AUTHENTICATED,
    SET_PARTICIPANT_ID,
    SET_SAFARI_CORS_ERROR,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { Participant } from "utils/Participant";
import { UserAttribute } from "utils/UserAttribute";

//------------------------------------------------------------------------------

const initialUserData = {
    id: null,
    key: "",
    state: "",
    calendarId: null,
    displayName: "",
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    contactInfo: [],
    attributes: [],
    addedById: null,
    addedOn: "",
    rowVersion: "",
};

export const initialUserState = {
    error: null,
    fetchIdentityInProgress: false,
    loginInProgress: false,
    manageParticipantInProgress: false,
    participantKey: "",
    signOffInProgress: false,
    isAuthenticated: false,
    safariCors: false,

    user: initialUserData,
    attributes: {
        byId: {},
        allIds: [],
    },
};

/**
 * User reducer
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 *
 * @return {Object}        Updated state
 */
export default function userReducer(
    state = initialUserState,
    action,
) {
    let returnVal;

    switch (action.type) {
        case LOGIN:
            returnVal = update(state, {
                loginInProgress: { $set: true },
            });
            break;
        case LOGIN_ERROR:
            returnVal = update(state, {
                isAuthenticated: { $set: false },
                loginInProgress: { $set: false },
                error: { $set: action.error },
            });
            break;
        case LOGIN_FAILURE:
            returnVal = update(state, {
                isAuthenticated: { $set: false },
                loginInProgress: { $set: false },
                error: { $set: null },
            });
            break;
        case LOGIN_SUCCESS:
            returnVal = update(state, {
                isAuthenticated: { $set: true },
                loginInProgress: { $set: false },
                error: { $set: null },
            });
            break;
        case SIGN_OFF:
            returnVal = update(state, {
                signOffInProgress: { $set: true },
            });
            break;
        case SIGN_OFF_ERROR:
            returnVal = update(state, {
                signOffInProgress: { $set: false },
                error: { $set: action.error },
            });
            break;
        case SIGN_OFF_FAILURE:
            returnVal = update(state, {
                signOffInProgress: { $set: false },
                error: { $set: null },
            });
            break;
        case SIGN_OFF_SUCCESS:
            returnVal = update(state, {
                isAuthenticated: { $set: false },
                participantKey: { $set: "" },
                signOffInProgress: { $set: false },
                error: { $set: null },
            });
            break;
        case FETCH_IDENTITY:
            returnVal = update(state, {
                fetchIdentityInProgress: { $set: true },
            });
            break;
        case FETCH_IDENTITY_ERROR:
            returnVal = update(state, {
                fetchIdentityInProgress: { $set: false },
                error: { $set: action.error },
            });
            break;
        case FETCH_IDENTITY_FAILURE:
            returnVal = update(state, {
                fetchIdentityInProgress: { $set: false },
                error: { $set: null },
            });
            break;
        case FETCH_IDENTITY_SUCCESS:
            returnVal = update(state, {
                isAuthenticated: { $set: true },
                fetchIdentityInProgress: { $set: false },
                error: { $set: null },
            });
            break;
        case MANAGE_PARTICIPANT:
            returnVal = update(state, {
                manageParticipantInProgress: { $set: true },
            });
            break;
        case MANAGE_PARTICIPANT_ERROR:
            returnVal = update(state, {
                manageParticipantInProgress: { $set: false },
                error: { $set: action.error },
            });
            break;
        case MANAGE_PARTICIPANT_FAILURE:
            returnVal = update(state, {
                manageParticipantInProgress: { $set: false },
                error: { $set: null },
            });
            break;
        case MANAGE_PARTICIPANT_SUCCESS:
            returnVal = update(state, {
                isAuthenticated: { $set: true },
                manageParticipantInProgress: { $set: false },
                error: { $set: null },
                user: { $set: action.user },
                attributes: { $set: action.attributes },
            });
            break;
        case SET_IS_AUTHENTICATED:
            returnVal = update(state, {
                isAuthenticated: { $set: action.isAuthenticated },
            });
            break;
        case SET_PARTICIPANT_ID:
            returnVal = update(state, {
                participantKey: { $set: action.participantKey },
            });
            break;
        case SET_SAFARI_CORS_ERROR:
            returnVal = update(state, {
                safariCors: { $set: true },
            });
            break;
        default:
            returnVal = state;
    }

    return returnVal;
}

/**
 * fetchIdentityInProgress selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether the fetch identity request is in progress
 */
export function selectFetchIdentityInProgress(state) {
    return state.user.fetchIdentityInProgress;
}


/**
 * isAuthenticated selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether the user is authenticated
 */
export function selectIsAuthenticated(state) {
    return state.user.isAuthenticated;
}

/**
 * error selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object}       The error
 */
export function selectUserError(state) {
    return state.user.error;
}

/**
 * loginInProgress selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether the login request is in progress
 */
export function selectLoginInProgress(state) {
    return state.user.loginInProgress;
}

/**
 * manageParticipantInProgress selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether the login request is in progress
 */
export function selectManageParticipantInProgress(state) {
    return state.user.manageParticipantInProgress;
}

/**
 * participantKey selector
 *
 * @param  {Object} state Store state object
 *
 * @return {string}       The participantKey
 */
export function selectParticipantKey(state) {
    return state.user.participantKey;
}

/**
 * signOffInProgress selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether the sign off request is in progress
 */
export function selectSignOffInProgress(state) {
    return state.user.signOffInProgress;
}

/**
 * user selector
 *
 * @param  {Object} state Store state object
 *
 * @return {string}       The user
 */
export function selectUser(state) {
    return new Participant(state.user.user);
}

/**
 * user attributes selector
 *
 * @param  {Object} state     Store state object
 *
 * @return {UserAttribute[]}  The user's attributes
 */
export function selectUserAttributes(state) {
    const attributeData = state.user.attributes;
    return attributeData.allIds.map((id) => new UserAttribute(attributeData.byId[id]));
}

/**
 * safariCors selector
 *
 * @param  {Object} state     Store state object
 *
 * @return {boolean}          Whether the user has encountered safari CORS error
 */
export function selectSafariCors(state) {
    return state.user.safariCors;
}
