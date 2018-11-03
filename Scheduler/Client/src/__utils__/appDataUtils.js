//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    PAGES_OBJECT_MAP,
    PATH_ABSOLUTE_ROOT,
} from "utils/backendConstants";
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Purpose
//------------------------------------------------------------------------------
// Any utility methods that are tied to business logic and and app data.

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Return the absolute path of the page for the passed page ID.
 *
 * @param {string} pageId A PAGE_ID_* constant.
 *
 * @return {string|null}  The absolute path.
 */
export function getAbsolutePath(pageId) {
    let returnVal = null;
    const relativePath = getRelativePath(pageId);

    if (relativePath !== null) {
        returnVal = `${PATH_ABSOLUTE_ROOT}/${relativePath}`;
    }

    return returnVal;
}

/**
 * Return the relative path of the page for the passed page ID (with no leading
 * slash).
 *
 * @param {string} pageId A PAGE_ID_* constant.
 *
 * @return {string|null}  The relative path.
 */
export function getRelativePath(pageId) {
    let returnVal = null;

    if (
        typeof PAGES_OBJECT_MAP[pageId] !== "undefined" &&
        typeof PAGES_OBJECT_MAP[pageId].relativePath !== "undefined"
    ) {
        returnVal = PAGES_OBJECT_MAP[pageId].relativePath;
    }

    return returnVal;
}
