//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { OpeningParticipant } from "utils/OpeningParticipant";
import { OpeningApplication } from "utils/OpeningApplication";
import { EventCriterion } from "utils/EventCriterion";

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
        this.participants = data.participants;
        this.applications = data.applications;
        this.addedById = data.addedById;
        this.addedOn = data.addedOn;
        this.updatedById = data.updatedById;
        this.updatedOn = data.updatedOn;
        this.rowVersion = data.rowVersion;

        this.participants = [];
        this.applications = [];
        this.criteria = [];

        data.participants.forEach((participantDatum) => {
            this.criteria.push(new OpeningParticipant(participantDatum));
        });

        data.applications.forEach((applicationDatum) => {
            this.criteria.push(new OpeningApplication(applicationDatum));
        });

        data.criteria.forEach((criterionDatum) => {
            this.criteria.push(new EventCriterion(criterionDatum));
        });
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

    getParticipants() {
        return this.participants;
    }

    getCriteria() {
        return this.criteria;
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
}
