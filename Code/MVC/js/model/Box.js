import GeometricalMesh from './GeometricalMesh.js';

export default class Box extends GeometricalMesh{
    constructor(name, properties){
        super(name, properties);
        this.className = 'Box';
    }
}