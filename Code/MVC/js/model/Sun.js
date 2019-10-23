import AstronomicalBody from './AstronomicalBody.js';

export default class Sun extends AstronomicalBody {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Sun';
    }
}