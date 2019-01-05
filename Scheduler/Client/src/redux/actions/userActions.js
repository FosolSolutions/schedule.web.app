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
    MANAGE_PARTICIPANT,
    MANAGE_PARTICIPANT_SUCCESS,
    MANAGE_PARTICIPANT_FAILURE,
    MANAGE_PARTICIPANT_ERROR,
    SIGN_OFF,
    SIGN_OFF_ERROR,
    SIGN_OFF_FAILURE,
    SIGN_OFF_SUCCESS,
    SET_IS_AUTHENTICATED,
    SET_PARTICIPANT_ID,
    SET_SAFARI_CORS_ERROR,
} from "redux/actionTypes";
import { selectParticipantKey } from "redux/reducers/userReducer";
import { setSnackbarContent } from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
	PATH_AUTH_IDENTITY,
	PATH_AUTH_PARTICIPANT,
	PATH_MANAGE_PARTICIPANT,
	PATH_AUTH_SIGN_OFF,
} from "utils/backendConstants";
import {
    deleteFromWebStorage,
    getBrowser,
    readWebStorage,
    writeWebStorage,
} from "utils/generalUtils";
import {
    CLIENT_KEY_IS_AUTHENTICATED,
    LOCAL_STORAGE,
    SNACKBAR_NETWORK_ERROR,
    SNACKBAR_DYNAMIC_USER_ERROR,
    ARRAY_COMMAND_PUSH,
    BROWSER_NAME_SAFARI_IOS,
    BROWSER_NAME_SAFARI_DESKTOP,
} from "utils/constants";
import history from "utils/history";
import { UserNormalizer } from "utils/UserNormalizer";

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
 * Set the participantKey in the store.
 *
 * @param  {User} participantKey The user.
 *
 * @return {Object}             Action object.
 */
export function setParticipantKey(participantKey = "") {
	return {
		type: SET_PARTICIPANT_ID,
		participantKey,
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
		const participantKey = selectParticipantKey(getState());
		const PATH = `${PATH_AUTH_PARTICIPANT}/${participantKey}`;
		let normalizedParticipant;

		dispatch({
			type: LOGIN,
		});

		axios({
			method: "post",
			url: PATH,
			withCredentials: true,
		})
			.then((response) => {
				if (response.status === 200) {
					normalizedParticipant = normalizeUserData(response.data);
					dispatch({
						type: LOGIN_SUCCESS,
						user: normalizedParticipant.user,
						attributes: normalizedParticipant.attributes,
					});
					dispatch(manageParticipant(normalizedParticipant.user.id));
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
		let normalizedParticipant;

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
					normalizedParticipant = normalizeUserData(response.data);
					dispatch({
						type: FETCH_IDENTITY_SUCCESS,
						user: normalizedParticipant.user,
						attributes: normalizedParticipant.attributes,
					});
					dispatch(manageParticipant(normalizedParticipant.user.id));
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
 * Get the current user with all attributes.
 *
 * @param  {string} id The particpant ID.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function manageParticipant(id) {
	return (dispatch) => {
		const PATH = `${PATH_MANAGE_PARTICIPANT}/${id}`;
		let normalizedParticipant;

		dispatch({
			type: MANAGE_PARTICIPANT,
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
					normalizedParticipant = normalizeUserData(response.data);
					dispatch({
						type: MANAGE_PARTICIPANT_SUCCESS,
						user: normalizedParticipant.user,
						attributes: normalizedParticipant.attributes,
					});
				} else {
					dispatch({ type: MANAGE_PARTICIPANT_FAILURE });
				}
			})
			.catch((error) => {
				handleErrorResponse(MANAGE_PARTICIPANT_ERROR, dispatch, error);
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
                    history.replace("/");

                    // This is gross... Shouldn't be necessary, but logging in
                    // again without a page reload fails to trigger the startup
                    // XHR calls.
                    window.location.reload();
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
    let snackbarContentKey;
    let errorMsg;
    let isSafariCorsError = false;
    const cachedIsAuthenticated = readWebStorage(
        LOCAL_STORAGE,
        CLIENT_KEY_IS_AUTHENTICATED,
    );
    const browser = getBrowser();

    if (browser) {
        if (
            (
                browser.name === BROWSER_NAME_SAFARI_IOS ||
                browser.name === BROWSER_NAME_SAFARI_DESKTOP
            ) &&
            cachedIsAuthenticated &&
            errorActionType === MANAGE_PARTICIPANT_ERROR &&
            typeof error.response !== "undefined" &&
            error.response.status === 401
        ) {
            isSafariCorsError = true;
            dispatch({
                type: SET_SAFARI_CORS_ERROR,
            });
        }
    }

    // Send the user to the login page.
    history.replace("/");

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

    if (showSnackbar && errorMsg !== "" && !isSafariCorsError) {
        if (dynamicSnackbarError) {
            snackbarContentKey = SNACKBAR_DYNAMIC_USER_ERROR;
        } else {
            snackbarContentKey = SNACKBAR_NETWORK_ERROR;
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
 * @param {Object} rawUser User object with potentially nested attributes and
 *                         contactInfo.
 *
 * @return {Object}        Object with two properties: user, and attributes.
 *                         Need to add contactInfo handling later.
 *
 */
export function normalizeUserData(rawUser) {
	const normalizedUser = new UserNormalizer(rawUser);

	return {
		user: normalizedUser.getUser(),
		attributes: {
			byId: normalizedUser.getAllAttributes(),
			allIds: normalizedUser.getAllAttributeIds(),
		},
	};
}
