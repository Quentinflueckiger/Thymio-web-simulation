import BoxViewMediator from './mediator/BoxViewMediator.js';
import EnvironmentViewMediator from './mediator/EnvironmentViewMediator.js';
import PlaygroundViewMediator from './mediator/PlaygroundViewMediator.js';
import PlaneViewMediator from './mediator/PlaneViewMediator.js';
import OctagonViewMediator from './mediator/OctagonViewMediator.js';
import UShapedFigureViewMediator from './mediator/UShapedFIgureViewMediator.js';
import CylinderViewMediator from './mediator/CylinderViewMediator.js';
import TrackViewMediator from './mediator/TrackViewMediator.js';
import ThymioViewMediator from './mediator/ThymioViewMediator.js';


export default class ViewMediatorFactory {
    getMediator(model) {
        switch (model.className) {
            case 'Box' :
                return new BoxViewMediator(model, this);
            case 'Plane' :
                return new PlaneViewMediator(model, this);
            case 'Octagon' :
                return new OctagonViewMediator(model, this);
            case 'UShapedFigure' :
                return new UShapedFigureViewMediator(model, this);
            case 'Cylinder' :
                return new CylinderViewMediator(model, this);
            case 'Track' :
                return new TrackViewMediator(model, this);
            case 'Thymio' :
                return new ThymioViewMediator(model, this);
            case 'Playground' :
                return new PlaygroundViewMediator(model, this);
            case 'Environment' :
                return new EnvironmentViewMediator(model, this);
        }
    }

}
