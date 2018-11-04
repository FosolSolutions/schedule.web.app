//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import isSameDay from "date-fns/isSameDay";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    EVENT_NAME_BIBLE_CLASS,
    EVENT_NAME_BIBLE_TALK,
    EVENT_NAME_HALL_CLEANING,
    EVENT_NAME_MEMORIAL_MEETING,
} from "utils/backendConstants";
import { CalendarEvent } from "utils/CalendarEvent";

//------------------------------------------------------------------------------

export class CalendarEvents {
    constructor(data) {
        this.all = [];
        this.bibleClassEvents = [];
        this.bibleTalkEvents = [];
        this.hallCleaningEvents = [];
        this.memorialMeetingEvents = [];

        data.forEach((eventDatum) => {
            const event = new CalendarEvent(eventDatum);

            this.all.push(event);

            switch (event.getName()) {
                case EVENT_NAME_BIBLE_CLASS:
                    this.bibleClassEvents.push(event);
                    break;
                case EVENT_NAME_BIBLE_TALK:
                    this.bibleTalkEvents.push(event);
                    break;
                case EVENT_NAME_HALL_CLEANING:
                    this.hallCleaningEvents.push(event);
                    break;
                case EVENT_NAME_MEMORIAL_MEETING:
                    this.memorialMeetingEvents.push(event);
                    break;
                default:
            }
        });
    }

    getAll() {
        return this.all;
    }

    getBibleClassEvents() {
        return this.bibleClassEvents;
    }

    getBibleTalkEvents() {
        return this.bibleTalkEvents;
    }

    getHallCleaningEvents() {
        return this.hallCleaningEvents;
    }

    getMemorialMeetingEvents() {
        return this.memorialMeetingEvents;
    }

    getAllByDay(date) {
        return this.all.filter((event) => isSameDay(date, event.getStartDate()));
    }
}
