//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";

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
        const eventTypesArray = [];

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
                    eventTypesArray.push(EVENT_NAME_BIBLE_CLASS);
                    this.bibleClassEvents.push(event);
                    break;
                case EVENT_NAME_BIBLE_TALK:
                    eventTypesArray.push(EVENT_NAME_BIBLE_TALK);
                    this.bibleTalkEvents.push(event);
                    break;
                case EVENT_NAME_HALL_CLEANING:
                    eventTypesArray.push(EVENT_NAME_HALL_CLEANING);
                    this.hallCleaningEvents.push(event);
                    break;
                case EVENT_NAME_MEMORIAL_MEETING:
                    eventTypesArray.push(EVENT_NAME_MEMORIAL_MEETING);
                    this.memorialMeetingEvents.push(event);
                    break;
                default:
            }
        });

        eventTypesArray.sort((a, b) => {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
        });

        eventTypesArray.forEach((eventType) => {
            this.eventTypes.add(eventType);
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
     * @return {Array} Memorial meeting events.
     */
    getMemorialMeetingEvents() {
        return this.memorialMeetingEvents;
    }

    /**
     * @param  {Date} date The date to get events for.
     * @return {Array}     All events for the passed date.
     */
    getAllByDay(date) {
        return this.all.filter((event) => isSameDay(date, event.getStartDate()));
    }

    /**
     * @param  {Date} startOn The start date to get events for.
     * @param  {Date} endOn   The end date to get events for.
     * @return {Set}          All events for the passed date range.
     */
    getAllByRange(startOn, endOn) {
        return this.all.filter(
            (event) => isWithinInterval(
                event.getStartDate(),
                {
                    start: startOn,
                    end: endOn,
                },
            ),
        );
    }
}
