//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    LOCAL_STORAGE,
    SESSION_STORAGE,
} from "utils/constants";

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Purpose
//------------------------------------------------------------------------------
// Any utility methods that are independent of business logic or app data belong
// here

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
/**
 * Capitalize the first letter of a string
 *
 * @param  {string} string The target string
 *
 * @return {string}        Target string with the first letter uppercased
 */
export function capitalizeFirstLetter(string) {
    let returnVal = string;

    if (typeof string === "string") {
        returnVal = `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
    }

    return returnVal;
}

/**
 * Capitalize the first letter of a string, lowercasing the rest
 *
 * @param  {string} string The target string
 *
 * @return {string}        Target string with the first letter uppercased, and
 *                         the rest lowercased
 */
export function capitalizeFirstLetterOnly(string) {
    let returnVal = string;

    if (typeof string === "string") {
        returnVal = `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
    }

    return returnVal;
}

/**
 * Given a string, return an HSL color that's a result of hashing the provided
 * string, with the provided saturation and lightness.
 *
 * @param {string} string     The string to generate a color for
 * @param {number} saturation Saturation of the color (0-100)
 * @param {number} lightness  Lightness of the color (0-100)
 *
 * @return {string}           HSL color
 */
export function stringToHslColor(string, saturation = 60, lightness = 65) {
    const chars = [...string];
    let hash = 0;

    chars.forEach((char, index) => {
        hash = string.charCodeAt(index) + ((hash << 5) - hash);
    });

    return `hsl(${hash % 360},${saturation}%,${lightness}%)`;
}

/**
 * Delete the specified key from the specified web storage (sessionStorage or
 * localStorage).
 *
 * @param  {string}          storageType   One of either:
 *                                               - LOCAL_STORAGE
 *                                               - SESSION_STORAGE
 * @param  {string|string[]} toDelete      Key(s) of value(s) to be removed
 */
export function deleteFromWebStorage(storageType, toDelete) {
    if (typeof toDelete === "string") {
        window[storageType].removeItem(toDelete);
    } else {
        toDelete.forEach((key) => {
            window[storageType].removeItem(key);
        });
    }
}

/**
 * Delete everything we've stored on the frontend, except cookies, which are
 * handled by the backend.
 */
export function deleteStorage() {
    [LOCAL_STORAGE, SESSION_STORAGE].forEach((storageType) => {
        window[storageType].clear();
    });
}

/**
 * Get the number of seconds in the passed number of days
 *
 * @param  {number} days The number of days
 *
 * @return {number}      The number of seconds in the passed number of days
 */
export function getDaySeconds(days) {
    return (days * 24 * 60 * 60);
}

/**
 * Get a value from the specified web storage (sessionStorage or localStorage)
 * matching the provided key. If the value has an associated expiry, only return
 * the value if the value is still valid. Otherwise, purge it from the
 * associated web storage and return null.
 *
 * @param  {string}  storageType   One of either:
 *                                     - LOCAL_STORAGE
 *                                     - SESSION_STORAGE
 * @param  {string}  key           Key of value to be returned
 * @param  {boolean} remove        Whether the key should be removed from
 *                                 storageType after it's read
 *
 * @return {Object|string|boolean} Corresponding value for passed key.
 */
export function readWebStorage(storageType, key, remove = false) {
    let returnVal = null;
    const storageObject = JSON.parse(window[storageType].getItem(key));

    if (storageObject !== null) {
        if (storageObject.expiry !== -1 && storageObject.expiry < window.Date.now()) {
            window[storageType].removeItem(key);
        } else {
            returnVal = JSON.parse(storageObject.value);
            if (remove) {
                window[storageType].removeItem(key);
            }
        }
    }

    return returnVal;
}

/**
 * Write specified key/value pair to the specified web storage (sessionStorage
 * or localStorage). Encodes value passed as object to JSON. Stores passed
 * primitive values (string or boolean) in an object and encodes to JSON for
 * storage. Write fails silently if specified storageType is unavailable.
 *
 * @param  {string}                storageType One of either:
 *                                                 - LOCAL_STORAGE
 *                                                 - SESSION_STORAGE
 * @param  {string}                key         Key for stored data
 * @param  {Object|string|boolean} value       Data to store
 * @param  {number}                expiry      Optional. Number of days stored
 *                                             data should remain valid. Value
 *                                             of -1 means no expiry.
 */
export function writeWebStorage(storageType, key, value, expiry = -1) {
    const expiryTime = (expiry === -1)
        ? expiry
        : window.Date.now() + getDaySeconds(expiry);
    const storageObject = {};

    storageObject.value = JSON.stringify(value);
    storageObject.expiry = expiryTime;
    const stringVal = JSON.stringify(storageObject);

    window[storageType].setItem(key, stringVal);
}
