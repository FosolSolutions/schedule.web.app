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
        this.eventTypes = new Set();
        this.hallCleaningEvents = [];
        this.memorialMeetingEvents = [];

        data.forEach((eventDatum) => {
            const event = new CalendarEvent(eventDatum);

            this.all.push(event);

            switch (event.getName()) {
                case EVENT_NAME_BIBLE_CLASS:
                    this.eventTypes.add(EVENT_NAME_BIBLE_CLASS);
                    this.bibleClassEvents.push(event);
                    break;
                case EVENT_NAME_BIBLE_TALK:
                    this.eventTypes.add(EVENT_NAME_BIBLE_TALK);
                    this.bibleTalkEvents.push(event);
                    break;
                case EVENT_NAME_HALL_CLEANING:
                    this.eventTypes.add(EVENT_NAME_HALL_CLEANING);
                    this.hallCleaningEvents.push(event);
                    break;
                case EVENT_NAME_MEMORIAL_MEETING:
                    this.eventTypes.add(EVENT_NAME_MEMORIAL_MEETING);
                    this.memorialMeetingEvents.push(event);
                    break;
                default:
            }
        });
    }

    /**
     * @return {Array} All events.
     */
    getAll() {
        return this.all;
    }

    /**
     * @return {Array} Bible class events.
     */
    getBibleClassEvents() {
        return this.bibleClassEvents;
    }

    /**
     * @return {Array} Bible talk events.
     */
    getBibleTalkEvents() {
        return this.bibleTalkEvents;
    }

    /**
     * @return {Array} Hall cleaning events.
     */
    getHallCleaningEvents() {
        return this.hallCleaningEvents;
    }

    /**
     * @return {Set} The event types.
     */
    getEventTypes() {
        return this.eventTypes;
    }

    /**
     * @return {Set} Memorial meeting events.
     */
    getMemorialMeetingEvents() {
        return this.memorialMeetingEvents;
    }

    /**
     * @param  {Date} date The date to get events for.
     * @return {Set}       All events for the .
     */
    getAllByDay(date) {
        return this.all.filter((event) => isSameDay(date, event.getStartDate()));
    }
}
