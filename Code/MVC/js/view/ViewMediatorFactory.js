import BoxViewMediator from './mediator/BoxViewMediator.js';
import EnvironmentViewMediator from './mediator/EnvironmentViewMediator.js';
import PlaygroundViewMediator from './mediator/PlaygroundViewMediator.js';
import PlaneViewMediator from './mediator/PlaneViewMediator.js';


export default class ViewMediatorFactory {
    getMediator(model) {
        switch (model.className) {
            case 'Box' :
                return new BoxViewMediator(model, this);
            case 'Plane' :
                return new PlaneViewMediator(model, this);
            case 'Playground' :
                return new PlaygroundViewMediator(model, this);
            case 'Environment' :
                return new EnvironmentViewMediator(model, this);
        }
    }

}
