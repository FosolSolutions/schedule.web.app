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
    SET_IS_AUTHENTICATED,
    SET_USER,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

export const initialUserState = {
    fetchIdentityError: false,
    fetchIdentityInProgress: false,
    loginError: null,
    loginInProgress: false,
    signOffError: null,
    signOffInProgress: false,

    isAuthenticated: false,
    user: null,
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
                loginError: { $set: action.error },
            });
            break;
        case LOGIN_FAILURE:
            returnVal = update(state, {
                isAuthenticated: { $set: false },
                loginInProgress: { $set: false },
                loginError: { $set: null },
            });
            break;
        case LOGIN_SUCCESS:
            returnVal = update(state, {
                isAuthenticated: { $set: true },
                loginInProgress: { $set: false },
                loginError: { $set: null },
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
                signOffError: { $set: action.error },
            });
            break;
        case SIGN_OFF_FAILURE:
            returnVal = update(state, {
                signOffInProgress: { $set: false },
                signOffError: { $set: null },
            });
            break;
        case SIGN_OFF_SUCCESS:
            returnVal = update(state, {
                isAuthenticated: { $set: false },
                signOffInProgress: { $set: false },
                signOffError: { $set: null },
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
                fetchIdentityError: { $set: action.error },
            });
            break;
        case FETCH_IDENTITY_FAILURE:
            returnVal = update(state, {
                fetchIdentityInProgress: { $set: false },
                fetchIdentityError: { $set: null },
            });
            break;
        case FETCH_IDENTITY_SUCCESS:
            returnVal = update(state, {
                isAuthenticated: { $set: true },
                fetchIdentityInProgress: { $set: false },
                fetchIdentityError: { $set: null },
            });
            break;
        case SET_IS_AUTHENTICATED:
            returnVal = update(state, {
                isAuthenticated: { $set: action.isAuthenticated },
            });
            break;
        case SET_USER:
            returnVal = update(state, {
                user: { $set: action.user },
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
 * loginError selector
 *
 * @param  {Object} state Store state object
 *
 * @return {Object}       The login error
 */
export function selectLoginError(state) {
    return state.user.loginError;
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
    return state.user.user;
}
