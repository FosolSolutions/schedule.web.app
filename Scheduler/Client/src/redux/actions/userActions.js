//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import axios from "axios";

//----------------------------------------------------------------------------
// Redux Support
//----------------------------------------------------------------------------
import {
    LOGIN,
    LOGIN_ERROR,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    SET_GIVEN_NAME,
    SET_SURNAME,
    SIGN_OFF,
    SIGN_OFF_ERROR,
    SIGN_OFF_FAILURE,
    SIGN_OFF_SUCCESS,
    SET_IS_AUTHENTICATED,
} from "redux/actionTypes";
import { selectPageId } from "redux/reducers/uiReducer";
import { setPageId } from "redux/actions/uiActions";

//----------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------
import {
    PATH_API_AUTH_BACKDOOR,
    PATH_API_AUTH_SIGN_OFF,
    PAGE_ID_DASHBOARD,
    PAGE_ID_ROOT,
} from "utils/backendConstants";
import {
    deleteFromWebStorage,
    readWebStorage,
    writeWebStorage,
} from "utils/generalUtils";
import {
    CLIENT_KEY_IS_AUTHENTICATED,
    HISTORY_REPLACE,
    LOCAL_STORAGE,
} from "utils/constants";

//----------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Initialize anonymous user properties from client storage.
 *
 * @return {Function} Action-dispatching thunk
 */
export function initUserFromCache() {
    return (dispatch) => {
        const cachedIsAuthenticated = readWebStorage(
            LOCAL_STORAGE,
            CLIENT_KEY_IS_AUTHENTICATED,
        );

        if (cachedIsAuthenticated) {
            dispatch(setIsAuthenticated(cachedIsAuthenticated));
        }
    };
}

/**
 * Set the user's given name.
 *
 * @param  {string} givenName The user's given name.
 *
 * @return {Object}           Action object.
 */
export function setGivenName(givenName) {
    return {
        type: SET_GIVEN_NAME,
        givenName,
    };
}

/**
 * Set the user's surname.
 *
 * @param  {string} surname The user's surname.
 *
 * @return {Object}         Action object.
 */
export function setSurname(surname) {
    return {
        type: SET_SURNAME,
        surname,
    };
}

/**
 * Set whether the user is authenticated.
 *
 * @param  {string} isAuthenticated The user's authentication status.
 *
 * @return {Object}                 Action object.
 */
export function setIsAuthenticated(isAuthenticated) {
    return {
        type: SET_IS_AUTHENTICATED,
        isAuthenticated,
    };
}

/**
 * Login the user using the authentication back door.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function backdoorLogin() {
    return (dispatch, getState) => {
        dispatch({
            type: LOGIN,
        });

        axios({
            method: "get",
            url: PATH_API_AUTH_BACKDOOR,
            withCredentials: true,
        })
            .then((response) => {
                const pageId = selectPageId(getState());

                if (response.status === 200) {
                    dispatch({ type: LOGIN_SUCCESS });
                    writeWebStorage(LOCAL_STORAGE, CLIENT_KEY_IS_AUTHENTICATED, true);

                    if (pageId === PAGE_ID_ROOT) {
                        dispatch(setPageId(PAGE_ID_DASHBOARD, HISTORY_REPLACE));
                    }
                } else {
                    dispatch({ type: LOGIN_FAILURE });
                }
            })
            .catch((error) => {
                dispatch({
                    type: LOGIN_ERROR,
                    error,
                });
            });
    };
}

/**
 * Login the user using the authentication back door.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function signOff() {
    return (dispatch) => {
        deleteFromWebStorage(LOCAL_STORAGE, CLIENT_KEY_IS_AUTHENTICATED);
        dispatch({
            type: SIGN_OFF,
        });

        axios
            .get(
                PATH_API_AUTH_SIGN_OFF,
                {
                    withCredentials: true,
                },
            )
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: SIGN_OFF_SUCCESS });
                    dispatch(setIsAuthenticated(false));
                    dispatch(setPageId(PAGE_ID_ROOT, HISTORY_REPLACE));
                } else {
                    dispatch({ type: SIGN_OFF_FAILURE });
                }
            })
            .catch((error) => {
                dispatch({
                    type: SIGN_OFF_ERROR,
                    error,
                });
            });
    };
}

//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
