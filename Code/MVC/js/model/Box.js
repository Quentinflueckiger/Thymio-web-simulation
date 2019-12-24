import Model from './Model.js';

export default class Box extends Model {
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