import ViewMediator from "./ViewMediator.js";

export default class EnvironmentViewMediator extends ViewMediator {
    constructor(environment, mediatorFactory, scene) {
        super(environment, mediatorFactory);
        this.scene = scene;
        
        this.model.addObserver("PlaygroundAdded", (e) => this.onPlaygroundAdded(e));
        this.model.addObserver("PlaygroundRemoved", (e) => this.onPlaygroudRemoved(e));
        this.model.addObserver("ThymiosAdded", (e) => this.onThymiosAdded(e));
        this.model.addObserver("ThymiosRemoved", (e) => this.onThymiosRemoved(e));
    }

    onPlaygroundAdded(e){
        this.addChild(e.playground);
    }

    onPlaygroudRemoved(e){
        this.removeChild(e.playground);
    }

    onThymiosAdded(e) {
        this.addChild(e.thymio);
    }

    onThymiosRemoved(e) {
        this.removeChild(e.thymio);
    }

}