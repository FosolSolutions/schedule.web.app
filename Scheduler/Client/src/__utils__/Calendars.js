//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { Account } from "utils/Account";
import { Calendar } from "utils/Calendar";

//------------------------------------------------------------------------------

export class Calendars {
    constructor(data) {
        this.calendars = [];
        this.accountIds = new Set();
        this.accounts = new Map();

        data.forEach((calendarDatum) => {
            const calendar = new Calendar(calendarDatum);
            const accountId = calendar.getAccountId();
            const accountName = calendar.getAccountName();
            let account;

            this.calendars.push(calendar);
            this.accountIds.add(accountId);

            if (!this.accounts.has(accountId)) {
                this.accounts.set(
                    accountId,
                    new Account(accountName, [calendar]),
                );
            } else {
                account = this.accounts.get(accountId);
                account.addCalendar(calendar);
            }
        });
    }

    getAccounts() {
        return this.accounts;
    }

    getAll() {
        return this.calendars;
    }
}
