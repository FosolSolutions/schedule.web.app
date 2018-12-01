//------------------------------------------------------------------------------
// Third-party
//------------------------------------------------------------------------------
import isUndefined from "lodash/isUndefined";
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

//------------------------------------------------------------------------------

export class CalendarEvents {
    constructor(data) {
        const eventTypesArray = [];
        const events = data.byId;
        const activityObjectMap = data.childrenById;

        this.allIds = data.allIds;
        this.all = new Map();
        this.bibleClassEvents = new Map();
        this.bibleTalkEvents = new Map();
        this.eventTypes = new Set();
        this.eventPathMap = new Map();
        this.hallCleaningEvents = new Map();
        this.memorialMeetingEvents = new Map();

        this.allIds.forEach((eventId) => {
            const activities = (!isUndefined(activityObjectMap[eventId]))
                ? activityObjectMap[eventId]
                : [];
            const event = new CalendarEvent(events[eventId], activities);
            this.all.set(eventId, event);

            switch (event.getName()) {
                case EVENT_NAME_BIBLE_CLASS:
                    eventTypesArray.push(EVENT_NAME_BIBLE_CLASS);
                    this.bibleClassEvents.set(eventId, event);
                    break;
                case EVENT_NAME_BIBLE_TALK:
                    eventTypesArray.push(EVENT_NAME_BIBLE_TALK);
                    this.bibleTalkEvents.set(eventId, event);
                    break;
                case EVENT_NAME_HALL_CLEANING:
                    eventTypesArray.push(EVENT_NAME_HALL_CLEANING);
                    this.hallCleaningEvents.set(eventId, event);
                    break;
                case EVENT_NAME_MEMORIAL_MEETING:
                    eventTypesArray.push(EVENT_NAME_MEMORIAL_MEETING);
                    this.memorialMeetingEvents.set(eventId, event);
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
     * @return {Map} All events.
     */
    getAll() {
        return this.all;
    }

    /**
     * @return {Map} All events.
     */
    getAllIds() {
        return this.allIds;
    }

    /**
     * @return {Map} Array of events.
     */
    getAllValues() {
        return [...this.all.values()];
    }

    /**
     * @param  {number}        id ID of opening to get.
     * @return {CalendarEvent}    The event.
     */
    getEvent(id) {
        return this.all.get(id);
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
