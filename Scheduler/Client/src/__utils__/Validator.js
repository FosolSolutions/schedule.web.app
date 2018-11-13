export const VALIDATION_IN_PROGRESS = "In progress";
export const VALIDATION_INVALID = "Invalid";
export const VALIDATION_ASYNC_REQUIRED = "Async Validation Required";
export const VALIDATION_TYPE_ASYNC = "Async";
export const VALIDATION_TYPE_SYNC = "Sync";
export const VALIDATION_VALID = "Valid";
export const VALIDATION_UNVALIDATED = "Unvalidated";

/**
 * This class handles running of validation rules
 */
export default class Validator {
    /**
     * Constructor
     *
     * @param  {Array}  syncRules  Array of validatorRules to run
     *                             (synchronous-concern)
     * @param  {Array}  asyncRules Optional array of validatorRules to run
     *                             (asynchronous-concern)
     */
    constructor(syncRules, asyncRules) {
        this.setRules(syncRules, asyncRules);
    }

    /**
     * Run the validatorRules, returning the first-encountered validator rule
     * error message
     *
     * @param  {string} value        Input value to validate
     * @param  {string} type         One of:
     *                                  - VALIDATION_TYPE_SYNC
     *                                  - VALIDATION_TYPE_ASYNC
     * @param  {string} siblingValue Auxiliary values required by validator.
     *                               E.g. for min/max validation.
     *
     * @return {string}              Validator error message. null when valid.
     */
    runRules(value, type, siblingValue = "") {
        const rulesToRun = this[`${type.toLowerCase()}Rules`];
        const ruleReturnVals = rulesToRun.map((rule) => rule(value, siblingValue));
        let returnVal = null;

        ruleReturnVals.forEach((ruleReturnVal) => {
            if (ruleReturnVal !== null && returnVal === null) {
                returnVal = ruleReturnVal;
            }
        });

        return returnVal;
    }

    /**
     * Set the validatorRules. Exposed as a method so rules can be updated if
     * the conditions used to create those rules change.
     *
     * @param  {Array} syncRules  Array of synchronous-concern validatorRules
     *                            to set
     * @param  {Array} asyncRules Optional array of asynchronous-concern
     *                            validatorRules to set
     */
    setRules(syncRules, asyncRules) {
        this.syncRules = [];
        this.asyncRules = [];

        syncRules.forEach((rule) => {
            this.syncRules.push(rule);
        });

        if (asyncRules !== undefined) {
            asyncRules.forEach((rule) => {
                this.asyncRules.push(rule);
            });
        }
    }
}
