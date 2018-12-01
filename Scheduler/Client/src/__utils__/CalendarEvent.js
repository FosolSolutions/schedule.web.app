export class CalendarEvent {
    constructor(data, activities) {
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
        this.criteria = data.criteria.map((criteria) => criteria.id);
        this.activities = activities;
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

    getActivities() {
        return this.activities;
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
