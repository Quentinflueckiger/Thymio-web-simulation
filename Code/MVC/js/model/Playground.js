import Model from "./Model.js";

export default class Playground extends Model {
    constructor(name, properties){
        super(name, properties);
        this.className = 'Playground';
        this.shapes = [];
    }

    addShape(shape) {
        shape.parent = this;
        this.shapes.push(shape);
        this.emit('ShapeAdded', {shape});
    }

    removeShape(shape) {
        const index = this.shapes.indexOf(shape);

        if (index !== -1) {
            this.shapes.splice(index, 1);
            this.emit('ShapeRemoved', {shape});
        }
    }

    [Symbol.iterator]() {
        return this.shapes.values();
    }
}