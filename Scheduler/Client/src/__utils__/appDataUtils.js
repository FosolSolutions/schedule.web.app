//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import isWithinInterval from "date-fns/isWithinInterval";
import isSameDay from "date-fns/isSameDay";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    CRITERIA_LOGICAL_OPERATOR_AND,
    CRITERIA_LOGICAL_OPERATOR_OR,
} from "utils/constants";

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Purpose
//------------------------------------------------------------------------------
// Any utility methods that are tied to business logic/operate on app data.

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
/**
 * Return the relative path for the passed page id and sorted paths array.
 *
 * @param  {string} pageId The PAGE_ID_*
 * @param  {Array}  paths  The paths to nest.
 *
 * @return {string}        The full relative url.
 */
export function buildRelativePath(pageId, paths) {
    return `/${pageId}/${paths.join("/")}`;
}

/**
 * Build a path from the passed EVENT_NAME_*.
 *
 * @param  {string} eventName The EVENT_NAME_*
 *
 * @return {string}           The path
 */
export function getEventPath(eventName) {
    return eventName.replace(/\s/g, "").toLowerCase();
}

/**
 * Return whether the user with the passed attributes meets the passed criteria.
 * @todo: Implement criteriaRule handling.
 *
 * @param {Array}  criteria     Array of event criteria. See EventCriteria class
 *                              for details.
 * @param {Array}  attributes   Array of user/participant attributes. See
 *                              UserAttribute class for details.
 *
 * @return {boolean}            Whether the user meets the criteria.
 */
export function meetsCriteria(criteria, attributes) {
    const conditionTestResults = [];
    let returnVal;
    let attributeCompareArray;

    // Return an array of booleans for the result of testing each criteria array
    // against user's attributes.
    const criteriaResults = criteria.map((criterion) => {
        const logicalOperator = criterion.getLogicalOperator();
        const conditions = criterion.conditions;

        // Iterate over conditions, testing each against user's attributes. Use
        // plain for loop so we can break out early if possible.
        for (let c = 0; c < conditions.length; c += 1) {
            const condition = conditions[c];
            const conditionKey = condition.getKey().toLowerCase();
            const conditionValue = condition.getValue().toLowerCase();

            // Generate an array with the result of each condition test.
            attributeCompareArray = attributes.map((attribute) => (
                attribute.getKey().toLowerCase() === conditionKey &&
                attribute.getValue().toLowerCase() === conditionValue
            ));

            // Break out early when a condition isn't met and the overarching
            // logical operator is AND. Otherwise record condition test result
            // to a result array and continue.
            if (!attributeCompareArray.includes(true)) {
                if (logicalOperator === CRITERIA_LOGICAL_OPERATOR_AND) {
                    returnVal = false;
                    break;
                } else {
                    conditionTestResults.push(false);
                }
            } else {
                conditionTestResults.push(true);
            }
        }

        // Determine test result when we didn't break out early.
        if (typeof returnVal === "undefined") {
            if (logicalOperator === CRITERIA_LOGICAL_OPERATOR_AND) {
                returnVal = conditionTestResults.every(
                    (conditionTestResult) => (conditionTestResult === true),
                );
            } else if (logicalOperator === CRITERIA_LOGICAL_OPERATOR_OR) {
                returnVal = conditionTestResults.includes(true);
            }
        }

        return returnVal;
    });

    return criteriaResults.every((criteriaResult) => (criteriaResult === true));
}

// Data filtering helpers ------------------------------------------------------
/**
 * @param  {CalendarEvent[]} events Array of events.
 * @param  {Date}                      date   The date to get events for.
 * @return {Array}                            All events for the passed date.
 */
export function getAllEventsByDay(events, date) {
    return events.filter((event) => isSameDay(date, event.getStartDate()));
}

/**
 * @param  {CalendarEvent[]} events  Array of events.
 * @param  {Date}                      startOn The start date to get events for.
 * @param  {Date}                      endOn   The end date to get events for.
 * @return {Set}                               All events for the passed date
 *                                             range.
 */
export function getAllEventsByRange(events, startOn, endOn) {
    return events.filter(
        (event) => isWithinInterval(
            event.getStartDate(),
            {
                start: startOn,
                end: endOn,
            },
        ),
    );
}

/**
 * @param  {CalendarEvent[]} events  Array of events.
 * @param  {Date}                      startOn The start date to get event ids for.
 * @param  {Date}                      endOn   The end date to get event ids for.
 * @return {Array}                             The array of event IDs.
 */
export function getEventIdsByRange(events, startOn, endOn) {
    const eventsToMap = getAllEventsByRange(events, startOn, endOn);

    return eventsToMap.map((event) => event.getId());
}

// Data normalization helpers --------------------------------------------------
/**
 * Build and return a normalized data structure from the passed array of
 * objects (each containing at least an id property).
 *
 * @param {Array} rawData         Array of data objects, with at least one
 *                                property (id).
 *
 * @return {Object}               Normalized data. Includes byId object and
 *                                allIds array.
 */
export function normalizeArrayData(rawData) {
    const byId = {};
    const allIds = [];

    rawData.forEach((rawDatum) => {
        const id = rawDatum.id;

        byId[id] = rawDatum;
        allIds.push(id);
    });

    return {
        byId,
        allIds,
    };
}
