import Model from './Model.js';

export default class Octagon extends Model {
    constructor(name, properties, hasWalls) {
        super(name, properties);
        this.className = 'Octagon';
        this.hasWalls = hasWalls;
    }
    
}