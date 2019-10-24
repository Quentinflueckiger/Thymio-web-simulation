import Shape from './Shape.js';

export default class Plane extends Shape {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Plane';
        this.debugArray = [];
    }

    [Symbol.iterator]() {
        return this.debugArray.values();
    }
}