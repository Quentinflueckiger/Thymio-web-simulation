import GalaxyViewMediator from './mediator/GalaxyViewMediator.js';
import SolarSystemViewMediator from './mediator/SolarSystemViewMediator.js';
import PlanetViewMediator from './mediator/PlanetViewMediator.js';
import SunViewMediator from './mediator/SunViewMediator.js';
import BoxViewMediator from './mediator/BoxViewMediator.js';
import EnvironmentViewMediator from './mediator/EnvironmentViewMediator.js';


export default class ViewMediatorFactory {
    getMediator(astronomicalBody) {
        switch (astronomicalBody.className) {
            case 'Galaxy':
                return new GalaxyViewMediator(astronomicalBody, this);
            case 'SolarSystem':
                return new SolarSystemViewMediator(astronomicalBody, this);
            case 'Sun':
                return new SunViewMediator(astronomicalBody, this);
            case 'Planet':
                return new PlanetViewMediator(astronomicalBody, this);
            case 'Box' :
                return new BoxViewMediator(astronomicalBody, this);
            case 'Environment' :
                return new EnvironmentViewMediator(astronomicalBody, this);
        }
    }

}
