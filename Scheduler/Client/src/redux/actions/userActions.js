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
    SET_PARTICIPANT_ID,
} from "redux/actionTypes";
import { selectParticipantId } from "redux/reducers/userReducer";
import { setSnackbarContentKey } from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { User } from "utils/User";
import {
    PATH_AUTH_IDENTITY,
    PATH_AUTH_PARTICIPANT,
    PATH_AUTH_SIGN_OFF,
} from "utils/backendConstants";
import {
    deleteFromWebStorage,
    readWebStorage,
    updateHistory,
    writeWebStorage,
} from "utils/generalUtils";
import {
    CLIENT_KEY_IS_AUTHENTICATED,
    HISTORY_REPLACE,
    LOCAL_STORAGE,
    SNACKBAR_NETWORK_ERROR,
    SNACKBAR_DYNAMIC_USER_ERROR,
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
 * Set the participantId in the store.
 *
 * @param  {User} participantId The user.
 *
 * @return {Object}             Action object.
 */
export function setParticipantId(participantId = "") {
    return {
        type: SET_PARTICIPANT_ID,
        participantId,
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
 * Log the user in with the participant ID.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function participantLogin() {
    return (dispatch, getState) => {
        const participantId = selectParticipantId(getState());
        const PATH = `${PATH_AUTH_PARTICIPANT}/${participantId}`;

        dispatch({
            type: LOGIN,
        });

        axios({
            method: "get",
            url: PATH,
            withCredentials: true,
        })
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: LOGIN_SUCCESS });
                    dispatch(setUser(new User(response.data)));
                    writeWebStorage(LOCAL_STORAGE, CLIENT_KEY_IS_AUTHENTICATED, true);
                } else {
                    dispatch({ type: LOGIN_FAILURE });
                }
            })
            .catch((error) => {
                handleErrorResponse(LOGIN_ERROR, dispatch, error);
            });
    };
}

/**
 * Get the current user.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function fetchIdentity() {
    return (dispatch) => {
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
                handleErrorResponse(FETCH_IDENTITY_ERROR, dispatch, error);
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
                PATH_AUTH_SIGN_OFF,
                {
                    withCredentials: true,
                },
            )
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: SIGN_OFF_SUCCESS });
                    updateHistory("", HISTORY_REPLACE);
                } else {
                    dispatch({ type: SIGN_OFF_FAILURE });
                }
            })
            .catch((error) => {
                handleErrorResponse(SIGN_OFF_ERROR, dispatch, error);
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
 * @param {Object}   error           The returned error object.
 */
function handleErrorResponse(errorActionType, dispatch, error) {
    let showSnackbar = false;
    let dynamicSnackbarError = false;
    let errorMsg;

    // Send the user to the login page.
    updateHistory("", HISTORY_REPLACE);

    if (typeof error.response !== "undefined" && typeof error.response.data !== "undefined") {
        if (error.response.status === 401 && errorActionType === FETCH_IDENTITY_ERROR) {
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

    // Dispatch the error into the redux store, and let the rest of the app
    // know that the user is not authenticated. Update the cached authenticated
    // flag.
    dispatch({
        type: errorActionType,
        error: errorMsg,
    });
    dispatch(setIsAuthenticated(false));

    if (showSnackbar && errorMsg !== "") {
        if (dynamicSnackbarError) {
            dispatch(setSnackbarContentKey(SNACKBAR_DYNAMIC_USER_ERROR));
        } else {
            dispatch(setSnackbarContentKey(SNACKBAR_NETWORK_ERROR));
        }
    }
}
