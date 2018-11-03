//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    SET_DRAWER_IS_OPEN,
    SET_PAGE_ID,
} from "redux/actionTypes";
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
 * @param  {string}  pageId      A PAGE_ID_* to set.
 * @param  {boolean} push        Whether to push to browser history. Replace is
 *                               used when false.
 * @param  {Object}  stateObj    See history.[push, replace]State API.
 * @param  {title}   title       See history.[push, replace]State API.
 *
 * @return {Object}               Action object.
 */
export function setPageId(pageId, push, stateObj = {}, title = "") {
    const relativePath = getRelativePath(pageId);
    const historyAPIArgs = [
        stateObj,
        title,
        `/${relativePath}`,
    ];

    if (push) {
        window.history.pushState(...historyAPIArgs);
    } else {
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
