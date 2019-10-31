import Shape from './Shape.js';

export default class Octagon extends Shape {
    constructor(name, properties, hasWalls) {
        super(name, properties);
        this.className = 'Octagon';
        this.hasWalls = hasWalls;
    }
    
}