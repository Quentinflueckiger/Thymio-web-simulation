import ViewMediator from './ViewMediator.js';

export default class PlaygroundViewMediator extends ViewMediator {
    constructor(playground, mediatorFactory) {
        super(playground, mediatorFactory);
        
        this.model.addObserver("ShapeAdded", (e) => this.onShapeAdded(e));
        this.model.addObserver("ShapeRemoved", (e) => this.onShapeRemoved(e));
    }

    onShapeAdded(e) {
        this.addChild(e.shape);
    }

    onShapeRemoved(e) {
        this.removeChild(e.shape);
    }
}