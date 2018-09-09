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
    FETCH_CALENDARS_ERROR
} from "redux/actionTypes";
//----------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
export default function setCalendars() {
    return dispatch => {
        dispatch({
            type: FETCH_CALENDARS
        });

        axios
            .get("https://fosolschedule.azurewebsites.net/data/calendars")
            .then(response => {
                dispatch({
                    type: FETCH_CALENDARS_SUCCESS,
                    calendars: response.data
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCH_CALENDARS_ERROR,
                    error
                });
            });
    };
}

//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
