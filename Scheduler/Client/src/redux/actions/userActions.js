//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import axios from "axios";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    FETCH_IDENTITY,
    FETCH_IDENTITY_ERROR,
    FETCH_IDENTITY_FAILURE,
    FETCH_IDENTITY_SUCCESS,
    LOGIN,
    LOGIN_ERROR,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    SET_USER,
    SIGN_OFF,
    SIGN_OFF_ERROR,
    SIGN_OFF_FAILURE,
    SIGN_OFF_SUCCESS,
    SET_IS_AUTHENTICATED,
} from "redux/actionTypes";
import { selectPageId } from "redux/reducers/uiReducer";
import {
    setPageId,
    setSnackbarContentKey,
} from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { User } from "utils/User";
import {
    PATH_AUTH_BACKDOOR,
    PATH_AUTH_GOOGLE,
    PATH_AUTH_MICROSOFT,
    PATH_AUTH_IDENTITY,
    PATH_AUTH_SIGN_OFF,
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
    SNACKBAR_NETWORK_ERROR,
} from "utils/constants";

//------------------------------------------------------------------------------

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
            dispatch(fetchIdentity());
        }
    };
}

/**
 * Set the user in the store.
 *
 * @param  {User} user The user.
 *
 * @return {Object}    Action object.
 */
export function setUser(user) {
    return {
        type: SET_USER,
        user,
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
    writeWebStorage(LOCAL_STORAGE, CLIENT_KEY_IS_AUTHENTICATED, isAuthenticated);

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
            url: PATH_AUTH_BACKDOOR,
            withCredentials: true,
        })
            .then((response) => {
                const pageId = selectPageId(getState());

                if (response.status === 200) {
                    dispatch({ type: LOGIN_SUCCESS });
                    dispatch(setUser(new User(response.data)));
                    writeWebStorage(LOCAL_STORAGE, CLIENT_KEY_IS_AUTHENTICATED, true);
                    if (pageId === PAGE_ID_ROOT) {
                        dispatch(setPageId(PAGE_ID_DASHBOARD, HISTORY_REPLACE));
                    }
                } else {
                    dispatch({ type: LOGIN_FAILURE });
                }
            })
            .catch((error) => {
                handleErrorResponse(LOGIN_ERROR, dispatch, getState, error);
            });
    };
}

/**
 * Login the user using the authentication back door.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function googleLogin() {
    return (dispatch, getState) => {
        dispatch({
            type: LOGIN,
        });

        axios({
            method: "get",
            url: PATH_AUTH_GOOGLE,
            withCredentials: true,
        })
            .then(() => {
                // Note sure what response to expect here yet due to CORS issues
            })
            .catch((error) => {
                handleErrorResponse(LOGIN_ERROR, dispatch, getState, error);
            });
    };
}

/**
 * Login the user using the authentication back door.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function microsoftLogin() {
    return (dispatch, getState) => {
        dispatch({
            type: LOGIN,
        });

        axios({
            method: "get",
            url: PATH_AUTH_MICROSOFT,
            withCredentials: true,
        })
            .then(() => {
                // Note sure what response to expect here yet due to CORS issues
            })
            .catch((error) => {
                handleErrorResponse(LOGIN_ERROR, dispatch, getState, error);
            });
    };
}

/**
 * Get the current user.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function fetchIdentity() {
    return (dispatch, getState) => {
        dispatch({
            type: FETCH_IDENTITY,
        });

        axios
            .get(
                PATH_AUTH_IDENTITY,
                {
                    withCredentials: true,
                },
            )
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: FETCH_IDENTITY_SUCCESS });
                    dispatch(setUser(new User(response.data)));
                } else {
                    dispatch({ type: FETCH_IDENTITY_FAILURE });
                }
            })
            .catch((error) => {
                handleErrorResponse(FETCH_IDENTITY_ERROR, dispatch, getState, error);
            });
    };
}

/**
 * Login the user using the authentication back door.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function signOff() {
    return (dispatch, getState) => {
        deleteFromWebStorage(LOCAL_STORAGE, CLIENT_KEY_IS_AUTHENTICATED);
        dispatch({
            type: SIGN_OFF,
        });

        axios
            .get(
                PATH_AUTH_SIGN_OFF,
                {
                    withCredentials: true,
                },
            )
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: SIGN_OFF_SUCCESS });
                    dispatch(setPageId(PAGE_ID_ROOT, HISTORY_REPLACE));
                } else {
                    dispatch({ type: SIGN_OFF_FAILURE });
                }
            })
            .catch((error) => {
                handleErrorResponse(SIGN_OFF_ERROR, dispatch, getState, error);
            });
    };
}

//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
/**
 * Handle login-related endpoint error responses.
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

    // Send the user to the login page.
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

    // Dispatch the error into the redux store, and let the rest of the app
    // know that the user is not authenticated. Update the cached authenticated
    // flag.
    dispatch({
        type: errorActionType,
        error: errorMsg,
    });
    dispatch(setIsAuthenticated(false));

    if (showSnackbar) {
        dispatch(setSnackbarContentKey(SNACKBAR_NETWORK_ERROR));
    }
}
