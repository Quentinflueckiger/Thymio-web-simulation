import Model from './Model.js';

export default class Plane extends Model {
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