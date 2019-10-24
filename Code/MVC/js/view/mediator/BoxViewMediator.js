import ViewMediator from './ViewMediator.js';

export default class BoxViewMediator extends ViewMediator {
    constructor(box, mediatorFactory){
        super(box, mediatorFactory);     
    }

    makeObject3D(){
        const container = new THREE.Object3D();
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(this.model.properties.width, this.model.properties.height, this.model.properties.depth),
            new THREE.MeshPhongMaterial( { color : this.model.properties.color} )

        )

        container.add(mesh);
        mesh.position.setX(this.model.properties.position);

        return container;
    }

    onFrameRenderered(){
        super.onFrameRenderered();
    }
}