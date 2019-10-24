import ViewMediator from "./ViewMediator.js";

export default class EnvironmentViewMediator extends ViewMediator {
    constructor(environment, mediatorFactory) {
        super(environment, mediatorFactory);

        this.astronomicalBody.addObserver("PlaygroundAdded", (e) => this.onPlaygroundAdded(e));
        this.astronomicalBody.addObserver("PlaygroundRemoved", (e) => this.onPlaygroudRemoved(e));

        console.log("EnvViewMed");
    }

    makeObject3D(){
        const container = new THREE.Object3D();
        const mesh = new THREE.Mesh(
            new THREE.SpheereGeometry(50, 60, 60),
            new THREE.MeshPhongMaterial({color : '#11ff00'})
        )

        container.add(mesh);
        mesh.position.setX(this.astronomicalBody.properties.position);

        return container;
    
    }

    onPlaygroundAdded(e){
        this.addChild(e.playground);
    }

    onPlaygroudRemoved(e){
        this.removeChild(e.playground);
    }

}