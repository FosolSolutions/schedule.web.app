//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { Calendar } from "utils/Calendar";

//------------------------------------------------------------------------------

export class Calendars {
    constructor(data) {
        const calendars = data.byId;
        const allIds = data.allIds;

        this.all = new Map();

        allIds.forEach((calendarId) => {
            const activity = new Calendar(calendars[calendarId]);
            this.all.set(calendarId, activity);
        });
    }

    /**
     * @return {Map} All calendars.
     */
    getAll() {
        return this.all;
    }

    /**
     * @return {Map} Array of calendars.
     */
    getAllValues() {
        return [...this.all.values()];
    }
}
