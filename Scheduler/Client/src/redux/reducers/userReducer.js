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
    SET_GIVEN_NAME,
    SET_IS_AUTHENTICATED,
    SET_SURNAME,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

export const initialUserState = {
    givenName: "name",
    isAuthenticated: false,
    loginError: null,
    loginInProgress: false,
    surname: "surname",
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
        case SET_GIVEN_NAME:
            returnVal = update(state, {
                givenName: { $set: action.givenName },
            });
            break;
        case SET_IS_AUTHENTICATED:
            returnVal = update(state, {
                isAuthenticated: { $set: action.isAuthenticated },
            });
            break;
        case SET_SURNAME:
            returnVal = update(state, {
                surname: { $set: action.surname },
            });
            break;
        default:
            returnVal = state;
    }

    return returnVal;
}

/**
 * givenName selector
 *
 * @param  {Object} state Store state object
 *
 * @return {string}       The givenName
 */
export function selectGivenName(state) {
    return state.user.givenName;
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
 * surname selector
 *
 * @param  {Object} state Store state object
 *
 * @return {string}       The surname
 */
export function selectSurname(state) {
    return state.user.surname;
}
