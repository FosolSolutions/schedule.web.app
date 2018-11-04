//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    SET_DRAWER_IS_OPEN,
    SET_PAGE_ID,
} from "redux/actionTypes";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    HISTORY_PUSH,
    HISTORY_REPLACE,
    HISTORY_STATE_KEY_PAGE_ID,
} from "utils/constants";
import { getRelativePath } from "utils/appDataUtils";

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
/**
 * Set whether the drawer should be open.
 *
 * @param  {boolean} drawerIsOpen Whether the drawer should be open.
 *
 * @return {Object}               Action object.
 */
export function setDrawerIsOpen(drawerIsOpen) {
    return {
        type: SET_DRAWER_IS_OPEN,
        drawerIsOpen,
    };
}

/**
 * Set the page ID and update browser history.
 *
 * @param  {string}      pageId        A PAGE_ID_* to set.
 * @param  {string|null} historyMethod Either a HISTORY_* constant or false (in
 *                                     which case history will not be modified).
 *
 * @return {Object}                    Action object.
 */
export function setPageId(pageId, historyMethod = null) {
    const relativePath = getRelativePath(pageId);
    const historyAPIArgs = [
        { [HISTORY_STATE_KEY_PAGE_ID]: pageId },
        "",
        `/${relativePath}`,
    ];

    if (historyMethod === HISTORY_PUSH) {
        window.history.pushState(...historyAPIArgs);
    } else if (historyMethod === HISTORY_REPLACE) {
        window.history.replaceState(...historyAPIArgs);
    }

    return {
        type: SET_PAGE_ID,
        pageId,
    };
}

//------------------------------------------------------------------------------
// Private Implementation Details
//------------------------------------------------------------------------------
