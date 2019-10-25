import Shape from "./Shape.js";

export default class Track extends Shape {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Track';
        this.points = [];
    }

    addPoint(point){
        point.parent = this;
        this.points.push(point);
        this.emit('PointAdded', { point });
    }

    removePoint(point){
        const index = this.ploints.indexOf(point);

        if (index !== -1) {
            this.points.slice(index,1);
            this.emit('PointRemoved', { point });
        }
    }

    [Symbol.iterator]() {
        return this.points.values();
    }
}