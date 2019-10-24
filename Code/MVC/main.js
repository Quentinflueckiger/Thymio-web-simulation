import APIClient from './js/APIClient.js';
import GalaxyController from './js/controller/GalaxyController.js';
import Galaxy from './js/model/Galaxy.js';
import SolarSystem from './js/model/SolarSystem.js';
import Planet from './js/model/Planet.js';
import Sun from './js/model/Sun.js';
import Box from './js/model/Box.js';
import Environment from './js/model/Environment.js';

const galaxy = new Galaxy('Milky Way');
const environment = new Environment('Base environment');
const galaxyController = new GalaxyController(galaxy);

// add solar system to galaxy
const apiClient = new APIClient();
const galaxyRecord = apiClient.getRecord();

for (const solarSystemRecord of galaxyRecord.solarSystems) {
    const sunRecord = solarSystemRecord.sun;
    const sun = new Sun(sunRecord.name, sunRecord.props);
    const solarSystem = new SolarSystem(solarSystemRecord.name, sun, solarSystemRecord.props);
    galaxy.addSolarSystem(solarSystem);

    for (const planetRecord of solarSystemRecord.planets) {
        const planet = new Planet(planetRecord.name, planetRecord.props);

        if (planetRecord.satellites) {
            for (const satelliteRecord of planetRecord.satellites) {
                planet.addSatellite(new Planet(satelliteRecord.name, satelliteRecord.props));
            }
        }
        solarSystem.addPlanet(planet);
    }

    var boxProps = {
        width : 1,
        height : 1,
        depth : 1,
        color : '#11ff00',
        position : 10
    }
    var box = new Box("Test Box", boxProps);
    solarSystem.addBox(box);
    /*
    var tprops = {  texture: 'images/2_no_clouds_4k.jpg',
                    orbitalSpeed: 0.07,
                    rotationSpeed: 0.05,
                    radius: 0.8,
                    distance: 30};

    var testPlanet = new Planet("Test planet", tprops);
    solarSystem.addPlanet(testPlanet);*/
}