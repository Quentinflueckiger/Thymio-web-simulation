import ViewMediator from './ViewMediator.js';

export default class PlaneViewMediator extends ViewMediator {
    constructor(plane, mediatorFactory){
        super(plane, mediatorFactory);
        this.model.mediator = this;
    }

    makeObject3D(){
        const container = new THREE.Object3D();
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(this.model.properties.width,0.2, this.model.properties.height),//, PlaneViewMediator.SphereSegments),
            new THREE.MeshPhongMaterial( { color : this.model.properties.color, side: THREE.DoubleSide} )
        );
        mesh.position.y -= 0.1;
        container.add(mesh);
        //mesh.rotateX(Math.PI/2);
        
        mesh.receiveShadow = true;

        if(this.model.hasWalls) {
            const wallDepth = 1;
            const wallHeight = 6;

            var wallN = new THREE.Mesh(
                new THREE.BoxGeometry( this.model.properties.width+wallDepth/2, wallHeight, wallDepth),
                new THREE.MeshPhongMaterial( { color : this.model.properties.color } )
            )
            wallN.position.y += wallHeight/2;
            wallN.castShadow = true;
            wallN.receiveShadow = true;
            var wallS = wallN.clone();
            wallN.position.z -= this.model.properties.height/2;
            wallS.position.z += this.model.properties.height/2;
            var wallE = new THREE.Mesh(
                new THREE.BoxGeometry(wallDepth, wallHeight, this.model.properties.height+wallDepth/2),
                new THREE.MeshPhongMaterial( { color : this.model.properties.color } )
            )
            wallE.position.y += wallHeight/2;
            wallE.castShadow = true;
            wallE.receiveShadow = true;
            var wallW = wallE.clone();
            wallE.position.x -= this.model.properties.width/2;
            wallW.position.x += this.model.properties.width/2;
            container.add(wallN);
            container.add(wallE);
            container.add(wallS);
            container.add(wallW);
        }

        return container;
    }
}
PlaneViewMediator.SphereSegments = 32;