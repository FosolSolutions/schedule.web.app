//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { ActivityCriterion } from "utils/ActivityCriterion";

//------------------------------------------------------------------------------

export class EventActivity {
    constructor(data, openings) {
        const startDate = new Date(data.startOn);
        const endDate = new Date(data.endOn);

        this.id = data.id;
        this.key = data.key;
        this.name = data.name;
        this.eventId = data.eventId;
        this.description = data.description;
        this.startDate = startDate.getUTCDate();
        this.endDate = endDate.getUTCDate();
        this.sequence = data.sequence;
        this.addedById = data.addedById;
        this.addedOn = data.addedOn;
        this.updatedById = data.updatedById;
        this.updatedOn = data.updatedOn;
        this.rowVersion = data.rowVersion;
        this.openings = openings;

        // Can't normalize criteria as their IDs aren't unique. Also, [null]
        // from the backend means no criteria for now. Should move this to a
        // validation class.
        if (data.criteria.length === 1 && data.criteria[0] === null) {
            this.criteria = [];
        } else {
            this.criteria = data.criteria.map(
                (criteria) => new ActivityCriterion(criteria),
            );
        }
    }

    getId() {
        return this.id;
    }

    getKey() {
        return this.key;
    }

    getName() {
        return this.name;
    }

    getEventId() {
        return this.eventId;
    }

    getDescription() {
        return this.description;
    }

    getStartDate() {
        return this.startDate;
    }

    getEndDate() {
        return this.endDate;
    }

    getSequence() {
        return this.sequence;
    }

    getOpenings() {
        return this.openings;
    }

    getCriteria() {
        return this.criteria;
    }

    getAddedById() {
        return this.addedById;
    }

    getAddedOn() {
        return this.addedOn;
    }

    getUpdatedById() {
        return this.updatedById;
    }

    getUpdatedOn() {
        return this.updatedOn;
    }

    getRowVersion() {
        return this.rowVersion;
    }
}
