//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { ActivityOpening } from "utils/ActivityOpening";

//------------------------------------------------------------------------------

export class ActivityOpenings {
    constructor(data) {
        const openings = data.byId;

        this.allIds = data.allIds;
        this.all = new Map();

        this.allIds.forEach((openingId) => {
            const opening = new ActivityOpening(openings[openingId]);
            this.all.set(openingId, opening);
        });
    }

    /**
     * @return {Map} All openings, keyed by ID.
     */
    getAll() {
        return this.all;
    }

    /**
     * @return {Map} Array of openings (sorted by name).
     */
    getAllIds() {
        return this.allIds;
    }

    /**
     * @return {Map} Array of openings (sorted by name).
     */
    getAllValues() {
        return [...this.all.values()];
    }

    /**
     * @param  {number}          id ID of opening to get.
     * @return {ActivityOpening}    The opening.
     */
    getOpening(id) {
        return this.all.get(id);
    }
}
