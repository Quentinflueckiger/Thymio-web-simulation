import ViewMediator from "./ViewMediator.js";

export default class UShapedFigureViewMediator extends ViewMediator {
    constructor(uShapedFigure, mediatorFactory) {
        super(uShapedFigure, mediatorFactory);
        this.model.mediator = this;
    }

    makeObject3D() {

        const container = new THREE.Object3D();
        const material = new THREE.MeshPhongMaterial( { color : this.model.properties.color} );

        const botBox = new THREE.Mesh(
            new THREE.BoxGeometry(8, this.model.properties.height, 1),
            material
        )
        botBox.position.z += 4;

        const middleBox = new THREE.Mesh(
            new THREE.BoxGeometry(2, this.model.properties.height, 7),
            material
        )
        middleBox.position.x -= 3;

        const topBox = new THREE.Mesh(
            new THREE.BoxGeometry(12, this.model.properties.height, 2),
            material
        )
        topBox.position.x += 2;
        topBox.position.z -= 4;

        container.add(botBox);
        container.add(middleBox);
        container.add(topBox);

        // Compute Y offset
        container.position.y += this.model.properties.height/2;

        container.scale.set(this.model.properties.size, 1, this.model.properties.size);

        // If Position x and z properties are given set the objects' position to it
        // Should do the same for rotation, around Y axis should be enough
        if (this.model.properties.positionX && this.model.properties.positionZ) {
            container.position.setX(this.model.properties.positionX);
            container.position.setZ(this.model.properties.positionZ);
        }

        container.castShadow = true;
        container.receiveShadow = true;

        return container;
    }
}
