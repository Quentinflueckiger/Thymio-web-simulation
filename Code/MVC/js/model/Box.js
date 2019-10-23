import Mesh from './Mesh.js';

export default class Box extends Mesh {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Box';
    }
}