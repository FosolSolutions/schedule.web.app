//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { ApplicationAnswer } from "utils/ApplicationAnswer";
import { Participant } from "utils/Participant";

//------------------------------------------------------------------------------

export class OpeningApplication {
    constructor(data) {
        this.openingId = data.openingId;
        this.participant = new Participant(data.participant);
        this.state = data.state;
        this.answers = data.answers.map((answer) => new ApplicationAnswer(answer));
        this.addedOn = new Date(data.addedOn);
    }

    getOpeningId() {
        return this.openingId;
    }

    getParticipant() {
        return this.participant;
    }

    getState() {
        return this.state;
    }

    getAnswer(questionId) {
        const answers = this.answers;
        let matchingAnswer = null;

        for (let index = 0; index < answers.length; index += 1) {
            const currentAnswer = answers[index];

            if (answers[index].getQuestionId() === questionId) {
                matchingAnswer = currentAnswer;
                break;
            }
        }

        return matchingAnswer;
    }

    getAnswers() {
        return this.answers;
    }

    getAddedOn() {
        return this.addedOn;
    }
}
