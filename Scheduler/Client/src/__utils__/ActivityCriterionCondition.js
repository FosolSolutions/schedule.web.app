export class ActivityCriteriaCondition {
    constructor(data) {
        this.key = data.key;
        this.logicalOperator = data.logicalOperator;
        this.value = data.value;
        this.valueType = data.valueType;
    }

    getKey() {
        return this.key;
    }

    getLogicalOperator() {
        return this.logicalOperator;
    }

    getValue() {
        return this.value;
    }

    getValueType() {
        return this.valueType;
    }
}
