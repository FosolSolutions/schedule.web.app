//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { Calendar } from "utils/Calendar";

//------------------------------------------------------------------------------

export class Calendars {
    constructor(data) {
        this.calendars = [];

        data.forEach((calendarDatum) => {
            this.calendars.push(new Calendar(calendarDatum));
        });
    }

    getAll() {
        return this.calendars;
    }
}
