import Shape from './Shape.js';

export default class Plane extends Shape {
    constructor(name, properties, hasWalls) {
        super(name, properties);
        this.className = 'Plane';
        this.hasWalls = hasWalls;
    }

    /*
    [Symbol.iterator]() {
        return this.debugArray.values();
    }*/
}