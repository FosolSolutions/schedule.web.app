//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import * as validatorMessages from "utils/validatorMessages";

//------------------------------------------------------------------------------

/**
 * Return an appropriate error message if participant key doesn't match required
 * pattern, otherwise null.
 *
 * @param  {string} inputDisplayName Display name of the input
 *
 * @return {Function}                Validation rule function
 */
export const participantKeyValid = (inputDisplayName) => (inputValue) => {
    let returnVal;

    // Return a validatorMessage if the passed location code does not match
    // participant key pattern.
    if (inputValue.match(/^[A-Za-z\d-]*$/)) {
        returnVal = null;
    } else {
        returnVal = validatorMessages.notRecognized(inputDisplayName);
    }

    return returnVal;
};

/**
 * Return an appropriate error message if input is left blank, otherwise null.
 *
 * @param  {string}   inputDisplayName Display name of the input
 *
 * @return {Function}                  Validation rule function
 */
export const required = (inputDisplayName) => (inputValue) => (
    inputValue ? null : validatorMessages.isRequired(inputDisplayName)
);
