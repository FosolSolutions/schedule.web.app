//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import isBefore from "date-fns/isBefore";
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
} from "utils/constants";
import { CalendarEvent } from "utils/CalendarEvent";
import { getEventPath } from "utils/appDataUtils";

//------------------------------------------------------------------------------

export class CalendarEvents {
    constructor(data) {
        const eventTypesArray = [];
        const sortedEvents = data
            .map((event) => new CalendarEvent(event))
            .sort(
                (a, b) => {
                    let returnVal = 0;

                    if (isBefore(a.getStartDate(), b.getStartDate())) {
                        returnVal = -1;
                    } else if (isBefore(a.getStartDate(), b.getStartDate())) {
                        returnVal = 1;
                    }

                    return returnVal;
                },
            );

        this.all = new Map();
        this.bibleClassEvents = new Map();
        this.bibleTalkEvents = new Map();
        this.eventTypes = new Set();
        this.eventPathMap = new Map();
        this.hallCleaningEvents = new Map();
        this.memorialMeetingEvents = new Map();


        sortedEvents.forEach((event) => {
            this.all.set(event.getId(), event);

            switch (event.getName()) {
                case EVENT_NAME_BIBLE_CLASS:
                    eventTypesArray.push(EVENT_NAME_BIBLE_CLASS);
                    this.bibleClassEvents.set(event.getId(), event);
                    break;
                case EVENT_NAME_BIBLE_TALK:
                    eventTypesArray.push(EVENT_NAME_BIBLE_TALK);
                    this.bibleTalkEvents.set(event.getId(), event);
                    break;
                case EVENT_NAME_HALL_CLEANING:
                    eventTypesArray.push(EVENT_NAME_HALL_CLEANING);
                    this.hallCleaningEvents.set(event.getId(), event);
                    break;
                case EVENT_NAME_MEMORIAL_MEETING:
                    eventTypesArray.push(EVENT_NAME_MEMORIAL_MEETING);
                    this.memorialMeetingEvents.set(event.getId(), event);
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
            this.eventPathMap.set(eventType, getEventPath(eventType));
            this.eventTypes.add(eventType);
        });
    }

    /**
     * @return {Map} All events.
     */
    getAll() {
        return this.all;
    }

    /**
     * @return {Map} Bible class events.
     */
    getBibleClassEvents() {
        return [...this.bibleClassEvents.values()];
    }

    /**
     * @return {Map} Bible talk events.
     */
    getBibleTalkEvents() {
        return [...this.bibleTalkEvents.values()];
    }

    /**
     * @return {Map} Hall cleaning events.
     */
    getHallCleaningEvents() {
        return [...this.hallCleaningEvents.values()];
    }

    /**
     * @return {Set} The event types.
     */
    getEventTypes() {
        return this.eventTypes;
    }

    /**
     * @param  {string} eventType The EVENT_NAME_* constant.
     * @return {string}           The event path.
     */
    getEventPath(eventType) {
        return this.eventPathMap.get(eventType);
    }

    /**
     * @return {Array} Memorial meeting events.
     */
    getMemorialMeetingEvents() {
        return [...this.memorialMeetingEvents.values()];
    }

    /**
     * @param  {Date} date The date to get events for.
     * @return {Array}     All events for the passed date.
     */
    getAllByDay(date) {
        return [...this.all.values()].filter(
            (event) => isSameDay(date, event.getStartDate()),
        );
    }

    /**
     * @param  {Date} startOn The start date to get events for.
     * @param  {Date} endOn   The end date to get events for.
     * @return {Set}          All events for the passed date range.
     */
    getAllByRange(startOn, endOn) {
        return [...this.all.values()]
            .filter(
                (event) => isWithinInterval(
                    event.getStartDate(),
                    {
                        start: startOn,
                        end: endOn,
                    },
                ),
            );
    }

    /**
     * @param  {Date}  startOn The start date to get event ids for.
     * @param  {Date}  endOn   The end date to get event ids for.
     * @return {Array}         The array of event IDs.
     */
    getIdsByRange(startOn, endOn) {
        const events = this.getAllByRange(startOn, endOn);

        return events.map((event) => event.getId());
    }
}
