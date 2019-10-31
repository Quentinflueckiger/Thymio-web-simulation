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
        mesh.receiveShadow = true;

        if (this.model.hasWalls) {
            const wallDepth = 1;
            const wallHeight = 6;

            // Create eight walls to surround the plane
            var xy = radius*Math.sin(45 * Math.PI / 180);   // Compute the middle quarter circle value
            var wallN = new THREE.Mesh(
                new THREE.BoxGeometry( wallDepth, wallHeight, segmentLength+wallDepth/2),
                new THREE.MeshPhongMaterial( { color : this.model.properties.color } )
            )

            wallN.position.y += wallHeight/2;
            wallN.castShadow = true;
            wallN.receiveShadow = true;
            var wallS = wallN.clone();
            var wallNE = wallN.clone();
            var wallSE = wallN.clone();  
            wallN.position.x -= radius;
            wallS.position.x += radius;

            wallNE.rotateY(-Math.PI/4);
            var wallSW = wallNE.clone();
            wallNE.position.x -= xy;
            wallNE.position.z -= xy;
            wallSW.position.x += xy;
            wallSW.position.z += xy;

            wallSE.rotateY(Math.PI/4);
            var wallNW = wallSE.clone();
            wallSE.position.x -= xy;
            wallSE.position.z += xy;
            wallNW.position.x += xy;
            wallNW.position.z -= xy;

            var wallE = new THREE.Mesh(
                new THREE.BoxGeometry( segmentLength+wallDepth/2, wallHeight, wallDepth),
                new THREE.MeshPhongMaterial( { color : this.model.properties.color } )
            )

            wallE.position.y += wallHeight/2;
            wallE.castShadow = true;
            wallE.receiveShadow = true;
            var wallW = wallE.clone();
            wallE.position.z -= radius;
            wallW.position.z += radius;

            container.add(wallN);
            container.add(wallNE);
            container.add(wallE);
            container.add(wallSE);
            container.add(wallS);
            container.add(wallSW);
            container.add(wallW);
            container.add(wallNW);
        }

        return container;
    }

    onFrameRenderered() {
        super.onFrameRenderered();
    }
}
