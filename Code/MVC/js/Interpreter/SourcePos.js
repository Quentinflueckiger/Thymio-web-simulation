export default class SourcePos {
    constructor() {
        this.character = -1;
        this.row = -1;
        this.column = -1;
    }
    
    getValues() {
        return [this.character, this.row, this.column];
    }

    setValues(arr) {
        this.character = arr[0];
        this.row = arr[1];
        this.column = arr[2];
    }
}