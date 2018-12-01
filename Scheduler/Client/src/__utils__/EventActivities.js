//------------------------------------------------------------------------------
// Third-party
//------------------------------------------------------------------------------
import isUndefined from "lodash/isUndefined";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { EventActivity } from "utils/EventActivity";

//------------------------------------------------------------------------------

export class EventActivities {
    constructor(data) {
        const activities = data.byId;
        const activityObjectMap = data.childrenById;

        this.ids = data.allIds;
        this.all = new Map();

        this.ids.forEach((activityId) => {
            const openings = (!isUndefined(activityObjectMap[activityId]))
                ? activityObjectMap[activityId]
                : [];
            const activity = new EventActivity(activities[activityId], openings);
            this.all.set(activityId, activity);
        });
    }

    /**
     * @return {Map} All activities.
     */
    getAll() {
        return this.all;
    }

    /**
     * @return {Array} All activity ids (sorted by name).
     */
    getAllIds() {
        return this.ids;
    }

    /**
     * @return {Map} Array of activities.
     */
    getAllValues() {
        return [...this.all.values()];
    }

    /**
     * @param  {number}         id ID of activity to get.
     * @return {EventActivity}     The activity.
     */
    getActivity(id) {
        return this.all.get(id);
    }
}
