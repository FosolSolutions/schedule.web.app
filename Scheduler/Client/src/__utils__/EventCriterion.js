export class EventCriterion {
    constructor(data) {
        this.id = data.id;
        this.criterion = data.criterion;
        this.isGroup = data.isGroup;
    }

    getId() {
        return this.id;
    }

    getCriterion() {
        return this.criterion;
    }

    getIsGroup() {
        return this.isGroup;
    }
}
