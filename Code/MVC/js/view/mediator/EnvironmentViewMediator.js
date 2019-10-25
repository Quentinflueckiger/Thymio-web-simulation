import ViewMediator from "./ViewMediator.js";

export default class EnvironmentViewMediator extends ViewMediator {
    constructor(environment, mediatorFactory) {
        super(environment, mediatorFactory);

        this.model.addObserver("PlaygroundAdded", (e) => this.onPlaygroundAdded(e));
        this.model.addObserver("PlaygroundRemoved", (e) => this.onPlaygroudRemoved(e));
    }

    onPlaygroundAdded(e){
        this.addChild(e.playground);
    }

    onPlaygroudRemoved(e){
        this.removeChild(e.playground);
    }
}