import Shape from "./Shape.js";

export default class Cylinder extends Shape {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Cylinder';
    }
    
}