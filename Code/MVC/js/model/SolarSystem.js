import AstronomicalBody from './AstronomicalBody.js';

export default class SolarSystem extends AstronomicalBody {
    constructor(name, sun, properties) {
        super(name, sun, properties);
        this.sun = sun;
        this.planets = [];
        this.className = 'SolarSystem';
    }

    addPlanet(planet) {
        planet.parent = this;
        this.planets.push(planet);
        this.emit('PlanetAdded', { planet });
    }

    removePlanet(planet) {
        const index = this.planets.indexOf(planet);

        if (index !== -1) {
            this.planets.splice(index, 1);
            this.emit('PlanetRemoved', { planet });
        }
    }

    // Test to add box
    addBox(box){
        box.parent = this;
        this.planets.push(box);
        this.emit('BoxAdded', {box});
    }

    [Symbol.iterator]() {
        return this.planets.values();
    }
}