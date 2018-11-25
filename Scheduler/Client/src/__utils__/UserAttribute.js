export class UserAttribute {
    constructor(data) {
        this.id = data.id;
        this.key = data.key;
        this.value = data.value;
        this.valueType = data.valueType;
        this.addedById = data.addedById;
        this.addedOn = data.addedOn;
        this.rowVersion = data.rowVersion;
    }

    getId() {
        return this.id;
    }

    getKey() {
        return this.key;
    }

    getValue() {
        return this.value;
    }

    getValueType() {
        return this.valueType;
    }

    getAddedById() {
        return this.addedById;
    }

    getAddedOn() {
        return this.addedOn;
    }

    getRowVersion() {
        return this.rowVersion;
    }
}
