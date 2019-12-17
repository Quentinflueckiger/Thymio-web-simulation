import ViewMediator from './ViewMediator.js';

export default class BoxViewMediator extends ViewMediator {
    constructor(box, mediatorFactory){
        super(box, mediatorFactory); 
    }

    makeObject3D(){
        //const container = new THREE.Object3D();
        const mesh = new Physijs.BoxMesh(
            new THREE.BoxGeometry(this.model.properties.width, this.model.properties.height, this.model.properties.depth),
            new THREE.MeshPhongMaterial( { color : this.model.properties.color} ),
            100

        )
            
        //container.add(mesh);
        mesh.position.setX(this.model.properties.positionX);
        mesh.position.setZ(this.model.properties.positionZ);

        // Compute Y offset
        mesh.position.y += this.model.properties.height/2;
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if(this.model.properties.rotateY)
            mesh.rotateY(THREE.Math.degToRad(this.model.properties.rotateY, 10));

        return mesh;//container;
    }
    
}