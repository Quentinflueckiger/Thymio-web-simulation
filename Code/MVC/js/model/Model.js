import Observable from '../Observable.js';

export default class Model extends Observable {
    constructor(name, properties = {}) {
        super();
        this.name = name;
        this.properties = properties;
    }
}