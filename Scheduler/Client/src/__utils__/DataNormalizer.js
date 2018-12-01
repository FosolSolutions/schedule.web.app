//------------------------------------------------------------------------------
// Third-party
//------------------------------------------------------------------------------
import isUndefined from "lodash/isUndefined";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    SORT_ALPHABETICAL,
    SORT_DATE,
} from "utils/constants";
import {
    getAlphaObjectSorter,
    getDateObjectSorter,
} from "utils/generalUtils";

//------------------------------------------------------------------------------

export class DataNormalizer {
    constructor(
        data,
        parentMapPropertyName = null,
        sort = null,
        sortPropertyName = null,
        sortOrder = null,
    ) {
        let dataToNormalize;

        if (sort !== null && sortPropertyName !== null && sortOrder !== null) {
            switch (sort) {
                case SORT_ALPHABETICAL:
                    dataToNormalize = data.sort(
                        getAlphaObjectSorter(sortPropertyName, sortOrder),
                    );
                    break;
                case SORT_DATE:
                    dataToNormalize = data.sort(
                        getDateObjectSorter(sortPropertyName, sortOrder),
                    );
                    break;
                default:
            }
        } else {
            dataToNormalize = data;
        }

        this.items = {};
        this.allItemIds = [];
        this.parentMap = {};

        dataToNormalize.forEach((rawItem) => {
            let clonedArray;

            // Store a map of all children keyed by parent id. For example, for
            // normalized activities data, get a map of arrays of activity ids
            // keyed by event id.
            if (parentMapPropertyName !== null) {
                if (!isUndefined(this.parentMap[rawItem[parentMapPropertyName]])) {
                    clonedArray = this.parentMap[rawItem[parentMapPropertyName]].slice();
                    clonedArray.push(rawItem.id);
                    this.parentMap[rawItem[parentMapPropertyName]] = clonedArray;
                } else {
                    this.parentMap[rawItem[parentMapPropertyName]] = [rawItem.id];
                }
            }

            this.items[rawItem.id] = rawItem;
            this.allItemIds.push(rawItem.id);
        });
    }

    /**
     * Get a map of all children keyed by parent id. For example, normalized
     * activities data, get a map of arrays of activity ids keyed by event id.
     *
     * @param {Object} normalizedData       Keys: byId, allIds.
     * @param {string} parentIdPropertyName The parent id property name. E.g.
     *                                      for activities data, eventId.
     *
     * @return {Object}                     Object map of children by parent id.
     */
    getParentMap() {
        return this.parentMap;
    }

    /**
     * @return {Object} All items keyed by id.
     */
    getItems() {
        return this.items;
    }

    /**
     * @return {Array} All item ids (sorted by sortPropertyName if provided).
     */
    getItemIds() {
        return this.allItemIds;
    }

    /**
     * Get the normalized data object. Keys:
     *  - {Object} byId   The items, keyed by id
     *  - {Array}  allIds The item ids sorted by sortPropertyName if provided
     *
     * @return {Object} The normalized data object
     */
    getNormalizedData() {
        return {
            byId: this.items,
            allIds: this.allItemIds,
        };
    }
}
