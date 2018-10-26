//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import isSameDay from "date-fns/isSameDay";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { EVENT_NAME_MEMORIAL_MEETING } from "utils/backendConstants";
import { CalendarEvent } from "utils/CalendarEvent";

//------------------------------------------------------------------------------

export class CalendarEvents {
    constructor(data) {
        this.all = [];
        this.memorialMeetingEvents = [];

        data.forEach((eventDatum) => {
            const event = new CalendarEvent(eventDatum);

            this.all.push(event);

            if (event.getName() === EVENT_NAME_MEMORIAL_MEETING) {
                this.memorialMeetingEvents.push(event);
            }
        });
    }

    getAll() {
        return this.all;
    }

    getMemorialMeetingEvents() {
        return this.memorialMeetingEvents;
    }

    getByDay(date) {
        return this.all.filter((event) => isSameDay(date, event.getStartDate()));
    }
}
