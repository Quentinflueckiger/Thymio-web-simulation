import Observable from '../Observable.js';

export default class AstronomicalBody extends Observable {
    constructor(name, properties = {}) {
        super();
        this.name = name;
        this.properties = properties;
    }
}