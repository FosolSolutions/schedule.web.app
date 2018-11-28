//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import isBefore from "date-fns/isBefore";
import cloneDeep from "lodash/cloneDeep";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    EVENT_NAME_BIBLE_CLASS,
    EVENT_NAME_BIBLE_TALK,
    EVENT_NAME_HALL_CLEANING,
    EVENT_NAME_MEMORIAL_MEETING,
} from "utils/constants";

//------------------------------------------------------------------------------

export class CalendarEventsNormalizer {
    constructor(events) {
        const sortedRawEvents = events
            .sort(
                (a, b) => {
                    const aIsBeforeB = isBefore(
                        new Date(a.startOn),
                        new Date(b.startOn),
                    );

                    if (aIsBeforeB) { return -1; }
                    if (!aIsBeforeB) { return 1; }
                    return 0;
                },
            );
        const sortedActivitiesMap = new Map();
        const sortedOpeningsMap = new Map();

        this.events = {};
        this.allEventIds = [];
        this.bibleClassIds = [];
        this.bibleTalkIds = [];
        this.hallCleaningIds = [];
        this.memorialMeetingIds = [];

        this.activities = {};
        this.activityIds = [];
        this.openings = {};
        this.openingIds = [];

        sortedRawEvents.forEach((rawEvent) => {
            const id = rawEvent.id;
            const sortedActivities = rawEvent.activities
                .sort((a, b) => {
                    if (a.name < b.name) { return -1; }
                    if (a.name > b.name) { return 1; }
                    return 0;
                });
            sortedActivitiesMap.set(
                id,
                rawEvent.activities.map((activity) => activity.id),
            );

            this.events[id] = rawEvent;
            this.allEventIds.push(id);

            switch (rawEvent.name) {
                case EVENT_NAME_BIBLE_CLASS:
                    this.bibleClassIds.push(id);
                    break;
                case EVENT_NAME_BIBLE_TALK:
                    this.bibleTalkIds.push(id);
                    break;
                case EVENT_NAME_HALL_CLEANING:
                    this.hallCleaningIds.push(id);
                    break;
                case EVENT_NAME_MEMORIAL_MEETING:
                    this.memorialMeetingIds.push(id);
                    break;
                default:
            }

            sortedActivities
                .forEach((activity) => {
                    const sortedOpenings = activity.openings
                        .sort((a, b) => {
                            if (a.name < b.name) { return -1; }
                            if (a.name > b.name) { return 1; }
                            return 0;
                        });
                    sortedOpeningsMap.set(
                        activity.id,
                        activity.openings.map((opening) => opening.id),
                    );
                    this.activityIds.push(activity.id);
                    this.activities[activity.id] = cloneDeep(activity);
                    sortedOpenings
                        .forEach((opening) => {
                            this.openingIds.push(opening.id);
                            this.openings[opening.id] = cloneDeep(opening);
                        });
                });
        });

        this.allEventIds.forEach(
            (eventId) => {
                this.events[eventId].activities = sortedActivitiesMap.get(eventId);
            },
        );

        this.activityIds.forEach(
            (activityId) => {
                this.activities[activityId].openings = sortedOpeningsMap.get(activityId);
            },
        );
    }

    /**
     * @return {Object} All events keyed by id.
     */
    getActivities() {
        return this.activities;
    }

    /**
     * @return {Array} All activity ids (sorted by name).
     */
    getActivityIds() {
        return this.activityIds;
    }

    /**
     * @return {Object} All events keyed by id.
     */
    getEvents() {
        return this.events;
    }

    /**
     * @return {Object} All openings keyed by id.
     */
    getOpenings() {
        return this.openings;
    }

    /**
     * @return {Array} All opening ids (sorted by name).
     */
    getOpeningIds() {
        return this.openingIds;
    }

    /**
     * @return {Array} All event ids (sorted by date).
     */
    getAllEventIds() {
        return this.allEventIds;
    }

    /**
     * @return {Array} Bible class ids (sorted by date).
     */
    getBibleClassIds() {
        return this.bibleClassIds;
    }

    /**
     * @return {Array} Bible talk ids (sorted by date).
     */
    getBibleTalkIds() {
        return this.bibleTalkIds;
    }

    /**
     * @return {Array} Hall cleaning ids (sorted by date).
     */
    getHallCleaningIds() {
        return this.hallCleaningIds;
    }

    /**
     * @return {Array} Memorial meeting ids (sorted by date).
     */
    getMemorialMeetingIds() {
        return this.memorialMeetingIds;
    }
}
