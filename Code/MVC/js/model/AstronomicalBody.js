import Model from './Model.js';

export default class AstronomicalBody extends Model {
    constructor(name, properties = {}) {
        super();
        this.name = name;
        this.properties = properties;
    }
}