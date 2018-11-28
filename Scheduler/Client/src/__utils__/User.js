//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { Participant } from "utils/Participant";

//------------------------------------------------------------------------------

export class User extends Participant {
    constructor(data) {
        super(data);
        this.ownedAccounts = data.ownedAccounts.map((ownedAccount) => ownedAccount.id);
        this.accounts = data.accounts.map((account) => account.id);
        this.oauthAccounts = data.oauthAccounts.map((oAuthAccount) => oAuthAccount.id);
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
}
