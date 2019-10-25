import Shape from './Shape.js';

export default class Box extends Shape {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Box';
        //this.debugArray = [];
    }
    /*
    [Symbol.iterator](){
        return this.debugArray.values();
    }*/
}