import ViewMediator from './ViewMediator.js';

export default class PlaneViewMediator extends ViewMediator {
    constructor(plane, mediatorFactory){
        super(plane, mediatorFactory);
    }

    makeObject3D(){
        const container = new THREE.Object3D();
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(this.model.properties.width, this.model.properties.height, PlaneViewMediator.SphereSegments),
            new THREE.MeshPhongMaterial( { color : this.model.properties.color, side: THREE.DoubleSide} )
        )

        container.add(mesh);
        mesh.rotateX(Math.PI/2);

        mesh.receiveShadow = true;

        return container;
    }
}
PlaneViewMediator.SphereSegments = 32;