//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import update from "immutability-helper";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { SET_DRAWER_IS_OPEN } from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

export const initialUiState = {
    drawerIsOpen: false,
};

/**
 * User reducer
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 *
 * @return {Object}        Updated state
 */
export default function uiReducer(
    state = initialUiState,
    action,
) {
    let returnVal;

    switch (action.type) {
        case SET_DRAWER_IS_OPEN:
            returnVal = update(state, {
                drawerIsOpen: { $set: action.drawerIsOpen },
            });
            break;
        default:
            returnVal = state;
    }

    return returnVal;
}

/**
 * drawerIsOpen selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      Whether drawerIsOpen
 */
export function selectDrawerIsOpen(state) {
    return state.ui.drawerIsOpen;
}
