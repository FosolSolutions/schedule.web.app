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
    FETCH_CALENDARS,
    FETCH_CALENDARS_SUCCESS,
    FETCH_CALENDARS_ERROR,
} from "redux/actionTypes";
//----------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
/**
 * Set the calendars from the calendars endpoint response.
 *
 * @return {Function} Action-dispatching thunk.
 */
export function setCalendars() {
    return (dispatch) => {
        dispatch({
            type: FETCH_CALENDARS,
        });

        axios
            .get("https://fosolschedule.azurewebsites.net/data/calendars")
            .then((response) => {
                dispatch({
                    type: FETCH_CALENDARS_SUCCESS,
                    calendars: response.data,
                });
            })
            .catch((error) => {
                dispatch({
                    type: FETCH_CALENDARS_ERROR,
                    error,
                });
            });
    };
}

//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
