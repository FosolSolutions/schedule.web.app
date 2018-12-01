//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    EVENT_NAME_BIBLE_CLASS,
    EVENT_NAME_BIBLE_TALK,
    EVENT_NAME_HALL_CLEANING,
    EVENT_NAME_MEMORIAL_MEETING,
} from "utils/constants";
import { DataNormalizer } from "utils/DataNormalizer";

//------------------------------------------------------------------------------

export class CalendarEventsNormalizer extends DataNormalizer {
    constructor(
        data,
        parentMapPropertyName = null,
        sort = null,
        sortPropertyName = null,
        sortOrder = null,
    ) {
        super(
            data,
            parentMapPropertyName,
            sort,
            sortPropertyName,
            sortOrder,
        );

        this.bibleClassIds = [];
        this.bibleTalkIds = [];
        this.hallCleaningIds = [];
        this.memorialMeetingIds = [];

        this.allItemIds.forEach((id) => {
            switch (this.items[id].name) {
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
        });
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

    /**
     * Get the normalized data object. Keys:
     *  - {Object} byId   The items, keyed by id
     *  - {Array}  allIds The item ids sorted by sortPropertyName if provided
     *  - {Array}  ...    The item ids for each of the properties above.
     *
     * @return {Object} The normalized data object
     */
    getNormalizedData() {
        return {
            byId: this.items,
            allIds: this.allItemIds,
            bibleClassIds: this.bibleClassIds,
            bibleTalkIds: this.bibleTalkIds,
            hallCleaningIds: this.hallCleaningIds,
            memorialMeetingIds: this.memorialMeetingIds,
        };
    }
}
