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
