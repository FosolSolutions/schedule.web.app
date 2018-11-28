export class OpeningQuestion {
    constructor(data) {
        this.id = data.id;
        this.accountId = data.accountId;
        this.caption = data.caption;
        this.text = data.text;
        this.answerType = data.answerType;
        this.isRequired = data.isRequired;
        this.sequence = data.sequence;
        this.maxLength = data.maxLength;
        this.allowOther = data.allowOther;
        this.addedOn = new Date(data.addedOn);

        // Un-implemented
        this.options = data.options.map((option) => option.id);
    }

    getId() {
        return this.id;
    }

    getAccountId() {
        return this.accountId;
    }

    getCaption() {
        return this.caption;
    }

    getText() {
        return this.text;
    }

    getAnswerType() {
        return this.answerType;
    }

    getIsRequired() {
        return this.isRequired;
    }

    getSequence() {
        return this.sequence;
    }

    getmaxLength() {
        return this.maxLength;
    }

    getAllowOther() {
        return this.allowOther;
    }

    getOptions() {
        return this.options;
    }

    getAddedOn() {
        return this.addedOn;
    }
}
