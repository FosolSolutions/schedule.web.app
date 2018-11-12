//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import update from "immutability-helper";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    SET_DRAWER_IS_OPEN,
    SET_PAGE_ID,
    SET_SNACKBAR_CONTENT_KEY,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { PAGE_ID } from "utils/staticBackendData";

//------------------------------------------------------------------------------

export const initialUiState = {
    drawerIsOpen: true,
    snackbarContentKey: "",
    pageId: PAGE_ID,
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
        case SET_PAGE_ID:
            returnVal = update(state, {
                pageId: { $set: action.pageId },
            });
            break;
        case SET_SNACKBAR_CONTENT_KEY:
            returnVal = update(state, {
                snackbarContentKey: { $set: action.snackbarContentKey },
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

/**
 * pageId selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      The current page ID.
 */
export function selectPageId(state) {
    return state.ui.pageId;
}

/**
 * snackbarContentKey selector
 *
 * @param  {Object} state Store state object
 *
 * @return {boolean}      The current snackbar content key.
 */
export function selectSnackbarContentKey(state) {
    return state.ui.snackbarContentKey;
}
