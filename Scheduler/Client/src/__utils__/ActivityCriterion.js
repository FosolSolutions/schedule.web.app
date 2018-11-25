//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { ActivityCriteriaCondition } from "utils/ActivityCriterionCondition";

//------------------------------------------------------------------------------

export class ActivityCriterion {
    constructor(data) {
        this.id = data.id;
        this.logicalOperator = data.logicalOperator;
        this.conditions = [];

        data.conditions.forEach((condition) => {
            this.conditions.push(new ActivityCriteriaCondition(condition));
        });
    }

    getId() {
        return this.id;
    }

    getLogicalOperator() {
        return this.logicalOperator;
    }

    getConditions() {
        return this.conditions;
    }
}
