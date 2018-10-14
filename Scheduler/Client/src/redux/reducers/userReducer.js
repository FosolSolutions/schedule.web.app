//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import update from "immutability-helper";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    SET_GIVEN_NAME,
    SET_SURNAME,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

export const initialUserState = {
    givenName: "matthew",
    surname: "bennett",
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
        case SET_GIVEN_NAME:
            returnVal = update(state, {
                givenName: { $set: action.givenName },
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
 * surname selector
 *
 * @param  {Object} state Store state object
 *
 * @return {string}       The surname
 */
export function selectSurname(state) {
    return state.user.surname;
}
