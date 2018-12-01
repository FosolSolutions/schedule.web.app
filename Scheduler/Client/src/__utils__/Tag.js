export class Tag {
    constructor(data) {
        this.key = data.key;
        this.value = data.value;
        this.addedOn = new Date(data.addedOn);
    }

    getKey() {
        return this.key;
    }

    getValue() {
        return this.value;
    }

    getAddedOn() {
        return this.addedOn;
    }
}
