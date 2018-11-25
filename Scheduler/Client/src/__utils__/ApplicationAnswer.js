export class ApplicationAnswer {
    constructor(data) {
        this.openingId = data.openingId;
        this.questionId = data.questionId;
        this.participantId = data.participantId;
        this.text = data.text;
        this.addedOn = new Date(data.addedOn);

        // Un-implemented
        this.options = data.options.map((option) => option.id);
    }

    getOpeningId() {
        return this.openingId;
    }

    getQuestionId() {
        return this.questionId;
    }

    getParticipantId() {
        return this.participantId;
    }

    getText() {
        return this.text;
    }

    getOptions() {
        return this.options;
    }

    getAddedOn() {
        return this.addedOn;
    }
}
