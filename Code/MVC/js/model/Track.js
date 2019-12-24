import Model from "./Model.js";

export default class Track extends Model {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Track';
        //this.points = [];
    }

    /*
    Might be of use later on, for the custom playground generator
    addPoint(point){
        point.parent = this;
        this.points.push(point);
        this.emit('PointAdded', { point });
    }

    removePoint(point){
        const index = this.points.indexOf(point);

        if (index !== -1) {
            this.points.slice(index,1);
            this.emit('PointRemoved', { point });
        }
    }*/

    [Symbol.iterator]() {
        return this.points.values();
    }
}