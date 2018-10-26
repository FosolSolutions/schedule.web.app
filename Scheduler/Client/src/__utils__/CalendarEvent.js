//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { EventActivity } from "utils/EventActivity";
import { EventCriterion } from "utils/EventCriterion";
import { parseISOString } from "utils/generalUtils";

//------------------------------------------------------------------------------

export class CalendarEvent {
    constructor(data) {
        this.id = data.id;
        this.calendarId = data.calendarId;
        this.key = data.key;
        this.name = data.name;
        this.description = data.description;
        this.startDate = new Date(data.startOn);
        this.endDate = new Date(data.endOn);
        this.addedById = data.addedById;
        this.addedOn = data.addedOn;
        this.updatedById = data.updatedById;
        this.updatedOn = data.updatedOn;
        this.rowVersion = data.rowVersion;

        this.activities = [];
        this.criteria = [];

        data.activities.forEach((activityData) => {
            this.activities.push(new EventActivity(activityData));
        });

        data.criteria.forEach((criterionDatum) => {
            this.criteria.push(new EventCriterion(criterionDatum));
        });
    }

    getId() {
        return this.id;
    }

    getCalendarId() {
        return this.calendarId;
    }

    getKey() {
        return this.key;
    }

    getName() {
        return this.name;
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
