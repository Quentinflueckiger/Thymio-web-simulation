import Model from "./Model.js";

export default class Thymio extends Model {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Thymio';
    }
}