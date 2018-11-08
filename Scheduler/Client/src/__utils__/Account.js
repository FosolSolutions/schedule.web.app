export class Account {
    constructor(name, calendars) {
        this.name = name;
        this.calendars = calendars;
    }

    addCalendar(calendar) {
        this.calendars.push(calendar);
    }

    getName() {
        return this.name;
    }

    getCalendars() {
        return this.calendars;
    }
}
