//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import cloneDeep from "lodash/cloneDeep";

//------------------------------------------------------------------------------

export class UserNormalizer {
    constructor(rawUser) {
        this.user = rawUser;
        this.attributesById = {};
        this.allAttributeIds = rawUser.attributes.map((attribute) => {
            this.attributesById[attribute.id] = cloneDeep(attribute);
            return attribute.id;
        });
    }

    /**
     * @return {Object} All events keyed by id.
     */
    getUser() {
        return this.user;
    }

    /**
     * @return {Array} All activity ids (sorted by name).
     */
    getAllAttributes() {
        return this.attributesById;
    }

    /**
     * @return {Object} All events keyed by id.
     */
    getAllAttributeIds() {
        return this.allAttributeIds;
    }
}
