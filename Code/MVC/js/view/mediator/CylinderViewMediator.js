import ViewMediator from "./ViewMediator.js";

export default class CylinderViewMediator extends ViewMediator {
    constructor(cylinder, mediatorFactory) {
        super(cylinder, mediatorFactory);
    }

    makeObject3D() {
        const container = new THREE.Object3D();
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(this.model.properties.topRadius, this.model.properties.botRadius, 
                this.model.properties.height, CylinderViewMediator.SphereSegments
            ),
            new THREE.MeshPhongMaterial({ color : this.model.properties.color })
        )

        container.add(mesh);
        mesh.position.setX(this.model.properties.positionX);
        mesh.position.setZ(this.model.properties.positionZ);
        
        // Compute Y offset
        mesh.position.y += this.model.properties.height/2;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return container;
    }
}
CylinderViewMediator.SphereSegments = 32;
