//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { OpeningQuestion } from "utils/OpeningQuestion";
import { ActivityCriterion } from "utils/ActivityCriterion";
import { OpeningApplication } from "utils/OpeningApplication";

//------------------------------------------------------------------------------

export class ActivityOpening {
    constructor(data) {
        this.id = data.id;
        this.key = data.key;
        this.name = data.name;
        this.activityId = data.activityId;
        this.description = data.description;
        this.minParticipants = data.minParticipants;
        this.maxParticipants = data.maxParticipants;
        this.openingType = data.openingType;
        this.applicationProcess = data.applicationProcess;
        this.state = data.state;
        this.addedById = data.addedById;
        this.addedOn = data.addedOn;
        this.updatedById = data.updatedById;
        this.updatedOn = data.updatedOn;
        this.rowVersion = data.rowVersion;
        this.criteriaRule = data.criteriaRule;
        this.criteria = data.criteria.map(
            (criterion) => new ActivityCriterion(criterion),
        );
        this.questions = data.questions.map((question) => new OpeningQuestion(question));
        this.applications = data.applications.map(
            (application) => new OpeningApplication(application),
        );

        // Un-implemented
        this.tags = data.tags;
    }

    getId() {
        return this.id;
    }

    getKey() {
        return this.key;
    }

    getName() {
        return this.name;
    }

    getActivityId() {
        return this.activityId;
    }

    getMinParticipants() {
        return this.minParticipants;
    }

    getMaxParticipants() {
        return this.maxParticipants;
    }

    getOpeningType() {
        return this.openingType;
    }

    getApplicationProcess() {
        return this.applicationProcess;
    }

    getDescription() {
        return this.description;
    }

    getApplications() {
        return this.applications;
    }

    getCriteria() {
        return this.criteria;
    }

    getTags() {
        return this.tags;
    }

    getQuestions() {
        return this.questions;
    }

    getQuestion(questionId) {
        const questions = this.questions;
        let matchingQuestion = null;

        for (let index = 0; index < questions.length; index += 1) {
            const currentQuestion = questions[index];

            if (questions[index].getId() === questionId) {
                matchingQuestion = currentQuestion;
                break;
            }
        }

        return matchingQuestion;
    }

    getAddedById() {
        return this.addedById;
    }

    getAddedOn() {
        return this.addedOn;
    }

    getUpdatedById() {
        return this.updatedById;
    }

    getUpdatedOn() {
        return this.updatedOn;
    }

    getRowVersion() {
        return this.rowVersion;
    }

    userIsParticipant(userId) {
        const applications = this.applications;
        let returnVal = false;

        for (let a = 0; a < applications.length; a += 1) {
            const participants = applications[a].getParticipants();

            for (let p = 0; p < participants.length; p += 1) {
                const participant = participants[p];

                if (participant.getId() === userId) {
                    returnVal = true;
                    break;
                }
            }

            if (returnVal) { break; }
        }

        return returnVal;
    }
}
