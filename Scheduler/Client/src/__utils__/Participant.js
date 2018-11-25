//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { capitalizeFirstLetterOnly, stringToHslColor } from "utils/generalUtils";

//------------------------------------------------------------------------------

export class Participant {
    constructor(data) {
        this.id = data.id;
        this.key = data.key;
        this.email = data.email;
        this.gender = data.gender;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.displayName = data.displayName;
        this.addedOn = data.addedOn;
        this.state = data.state;
        this.calendarId = data.calendarId;
        this.rowVersion = data.rowVersion;
        this.attributes = data.attributes.map((attribute) => attribute.id);
        this.contactInfo = data.attributes.map((contactInfoItem) => contactInfoItem.id);
        this.avatarColor = stringToHslColor(`${this.firstName}${this.lastName}`, 60, 70);
    }

    getId() {
        return this.id;
    }

    getKey() {
        return this.key;
    }

    getAttributes() {
        return this.attributes;
    }

    getEmail() {
        return this.email;
    }

    getContactInfor() {
        return this.contactInfo;
    }

    getGender() {
        return this.gender;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getDisplayName() {
        return `${capitalizeFirstLetterOnly(this.firstName)} ${capitalizeFirstLetterOnly(this.lastName).charAt(0)}.`;
    }

    getFullName() {
        return `${capitalizeFirstLetterOnly(this.firstName)} ${capitalizeFirstLetterOnly(this.lastName)}`;
    }

    getAddedOn() {
        return this.addedOn;
    }

    getRowVersion() {
        return this.rowVersion;
    }

    getAvatarColor() {
        return this.avatarColor;
    }
}
