//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { ActivityOpening } from "utils/ActivityOpening";
import { EventCriterion } from "utils/EventCriterion";

//------------------------------------------------------------------------------

export class EventActivity {
    constructor(data) {
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

        this.openings = [];
        this.criteria = [];

        data.openings.forEach((openingDatum) => {
            this.openings.push(new ActivityOpening(openingDatum));
        });

        data.criteria.forEach((criterionDatum) => {
            this.criteria.push(new EventCriterion(criterionDatum));
        });
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
