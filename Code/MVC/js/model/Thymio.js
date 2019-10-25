import Shape from "./Shape.js";

export default class Thymio extends Shape {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Thymio';
    }
}