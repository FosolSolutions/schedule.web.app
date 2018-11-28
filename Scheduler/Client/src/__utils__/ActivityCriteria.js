//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { EventActivity } from "utils/EventActivity";

//------------------------------------------------------------------------------

export class ActivityCriteria {
    constructor(data) {
        const openings = data.byId;
        const allIds = data.allIds;

        this.all = new Map();

        allIds.forEach((openingId) => {
            const activity = new EventActivity(openings[openingId]);
            this.all.set(openingId, activity);
        });
    }

    /**
     * @return {Map} All openings.
     */
    getAll() {
        return this.all;
    }
}
