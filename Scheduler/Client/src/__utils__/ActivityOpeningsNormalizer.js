//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import cloneDeep from "lodash/cloneDeep";

//------------------------------------------------------------------------------

export class ActivityOpeningsNormalizer {
    constructor(openings) {
        const sortedOpenings = openings
            .sort((a, b) => {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
            });

        this.openings = {};
        this.openingIds = [];

        sortedOpenings
            .forEach((opening) => {
                this.openingIds.push(opening.id);
                this.openings[opening.id] = cloneDeep(opening);
            });
    }

    /**
     * @return {Object} All openings keyed by id.
     */
    getOpenings() {
        return this.openings;
    }

    /**
     * @return {Array} All opening ids (sorted by name).
     */
    getOpeningIds() {
        return this.openingIds;
    }
}
