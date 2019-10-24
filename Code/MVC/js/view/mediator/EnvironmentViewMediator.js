import ViewMediator from "./ViewMediator.js";

export default class EnvironmentViewMediator extends ViewMediator {
    constructor(environment, mediatorFactory) {
        super(environment, mediatorFactory);

        this.model.addObserver("PlaygroundAdded", (e) => this.onPlaygroundAdded(e));
        this.model.addObserver("PlaygroundRemoved", (e) => this.onPlaygroudRemoved(e));

        //const testSphere = this.createSphere(5,60);

        //this.object3D.add(testSphere);
    }

    onPlaygroundAdded(e){
        this.addChild(e.playground);
    }

    onPlaygroudRemoved(e){
        this.removeChild(e.playground);
    }

    createSphere(r, seg) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(r, seg,seg),
            new THREE.MeshPhongMaterial({color : '#11ff00'})
        );
    }
}