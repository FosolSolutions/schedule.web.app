//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import axios from "axios";

//----------------------------------------------------------------------------
// Redux Support
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------
// Helpers
//----------------------------------------------------------------------------
import {
    LOGIN,
    LOGIN_ERROR,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    SET_GIVEN_NAME,
    SET_SURNAME,
} from "redux/actionTypes";
import { PATH_API_AUTH_BACKDOOR } from "utils/backendConstants";
//----------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
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
 * Login the user using the authentication back door.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function backdoorLogin() {
    return (dispatch) => {
        dispatch({
            type: LOGIN,
        });

        axios
            .get(
                PATH_API_AUTH_BACKDOOR,
            )
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: LOGIN_SUCCESS });
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


//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
