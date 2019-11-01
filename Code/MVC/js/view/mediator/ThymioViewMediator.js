import ViewMediator from "./ViewMediator.js";
import { MTLLoader } from '../../../bin/loaders/MTLLoader.js';
import { OBJLoader } from '../../../bin/loaders/OBJLoader.js';

export default class ThymioViewMediator extends ViewMediator {
    constructor(thymio, mediatorFactory) {
        super(thymio, mediatorFactory);
    }

    makeObject3D() {
        const container = new THREE.Object3D();
        
        const thymiopath = '../../../images/Thymio_3d_Model/';
        var mtlLoader = new MTLLoader();
        mtlLoader.setPath(thymiopath);
        mtlLoader.load('obj.mtl', function(materials){
            materials.preload();

            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(thymiopath);
            objLoader.load('tinker.obj', function(object){
                object.scale.set(0.05,0.05,0.05);
                object.rotateX(-Math.PI/2);

                container.add(object);
                
            })
        })
        return container;
    }

    move(left, right) {
        if (left === right){
            //move in a straight line
        }
        else if (left > right) {
            //turn towards the right
        }
        else if ( left < right) {
            //turn towards the left
        }

    }
}