import ViewMediator from './ViewMediator.js';

export default class OctagonViewMediator extends ViewMediator {
    constructor(octagon, mediatorFactory) {
        super(octagon, mediatorFactory);
    }

    makeObject3D() {

        const container = new THREE.Object3D();
        const geometry = new THREE.Geometry();

        // Calculate the diameter of the octagon and it's radius
        const segmentLength = this.model.properties.segmentLength;
        const diameter = (1+Math.sqrt(2))*segmentLength;
        const radius = diameter/2;

        // Push all 8 vertices
        geometry.vertices.push(new THREE.Vector3(segmentLength/2, radius, 0));
        geometry.vertices.push(new THREE.Vector3(radius, segmentLength/2, 0));
        geometry.vertices.push(new THREE.Vector3(radius, -segmentLength/2, 0));
        geometry.vertices.push(new THREE.Vector3(segmentLength/2, -radius, 0));
        geometry.vertices.push(new THREE.Vector3(-segmentLength/2, -radius, 0));
        geometry.vertices.push(new THREE.Vector3(-radius, -segmentLength/2, 0));
        geometry.vertices.push(new THREE.Vector3(-radius, segmentLength/2, 0));
        geometry.vertices.push(new THREE.Vector3(-segmentLength/2, radius, 0));

        geometry.faces.push(new THREE.Face3(0, 2, 1));
        geometry.faces.push(new THREE.Face3(0, 3, 2));
        geometry.faces.push(new THREE.Face3(0, 4, 3));
        geometry.faces.push(new THREE.Face3(0, 5, 4));
        geometry.faces.push(new THREE.Face3(0, 6, 5));
        geometry.faces.push(new THREE.Face3(0, 7, 6));
    
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({ color : this.model.properties.color })
        )

        container.add(mesh);
        mesh.rotateX(-Math.PI/2);

        return container;
    }

    onFrameRenderered() {
        super.onFrameRenderered();
    }
}