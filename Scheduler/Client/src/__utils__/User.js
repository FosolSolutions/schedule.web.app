//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { capitalizeFirstLetterOnly } from "utils/generalUtils";

//------------------------------------------------------------------------------

export class User {
    constructor(data) {
        this.id = data.id;
        this.key = data.key;
        this.email = data.email;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.ownedAccounts = data.ownedAccounts;
        this.accounts = data.accounts;
        this.attributes = data.attributes;
        this.oauthAccounts = data.oauthAccounts;
        this.addedOn = data.addedOn;
        this.rowVersion = data.rowVersion;
    }

    getId() {
        return this.id;
    }

    getKey() {
        return this.key;
    }

    getEmail() {
        return this.email;
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

    getOwnedAccounts() {
        return this.ownedAccounts;
    }

    getAccounts() {
        return this.accounts;
    }

    getOauthAccounts() {
        return this.oauthAccounts;
    }

    getAddedOn() {
        return this.addedOn;
    }

    getRowVersion() {
        return this.rowVersion;
    }
}
