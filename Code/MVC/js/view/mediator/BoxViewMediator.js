import ViewMediator from './ViewMediator.js';

export default class BoxViewMediator extends ViewMediator {
    constructor(box, mediatorFactory){
        super(box, mediatorFactory);     
    }

    makeObject3D(){
        const container = new THREE.Object3D();
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(this.astronomicalBody.properties.width, this.astronomicalBody.properties.height, this.astronomicalBody.properties.depth),
            new THREE.MeshPhongMaterial( { color : this.astronomicalBody.properties.color} )

        )

        container.add(mesh);
        mesh.position.setX(this.astronomicalBody.properties.position);

        return container;
    }

    onFrameRenderered(){
        super.onFrameRenderered();
    }
}