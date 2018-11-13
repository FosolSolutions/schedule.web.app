//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { CalendarEvents } from "utils/CalendarEvents";
import { EventCriterion } from "utils/EventCriterion";
import { stringToHslColor } from "./generalUtils";

//------------------------------------------------------------------------------

export class Calendar {
    constructor(data) {
        this.id = data.id;
        this.key = data.key;
        this.accountId = data.accountId;
        this.name = data.name;
        this.description = data.description;
        this.events = new CalendarEvents(data.events);
        this.addedById = data.addedById;
        this.addedOn = data.addedOn;
        this.updatedById = data.updatedById;
        this.updatedOn = data.updatedOn;
        this.rowVersion = data.rowVersion;

        this.criteria = [];

        data.criteria.forEach((criterionDatum) => {
            this.criteria.push(new EventCriterion(criterionDatum));
        });

        // Hardcoded properties
        this.accountName = "Victoria Christadelphians";
        this.accountColor = stringToHslColor(this.accountName);
    }

    getId() {
        return this.id;
    }

    getKey() {
        return this.key;
    }

    getAccountColor() {
        return this.accountColor;
    }

    getAccountId() {
        return this.accountId;
    }

    getAccountName() {
        return this.accountName;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getEvents() {
        return this.events;
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
