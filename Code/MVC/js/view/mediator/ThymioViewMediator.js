import ViewMediator from "./ViewMediator.js";
import { MTLLoader } from '../../../bin/loaders/MTLLoader.js';
import { OBJLoader } from '../../../bin/loaders/OBJLoader.js';

export default class ThymioViewMediator extends ViewMediator {
    constructor(thymio, mediatorFactory) {
        super(thymio, mediatorFactory);
        this.ready = false;
        this.speed = 0.001;
        this.model.mediator = this;
        this.leftMotor = 0;
        this.rightMotor = 0;
    }

    makeObject3D() {
        var tvm = this;
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
                tvm.ready = true;
                
            })
        })
        return container;
    }
    
    onFrameRenderered() {
        super.onFrameRenderered();

        if (this.ready){
            this.move();
        }
        
    }

    setMotors(left, right) {
        this.leftMotor = left;
        this.rightMotor = right;
    }

    stopMotors() {
        this.object3D.rotateY(-Math.PI/2);
        this.leftMotor = 0;
        this.rightMotor = 0;
    }

    getDirection() {
        var direction = new THREE.Vector3();
        return this.object3D.getWorldDirection(direction);;
    }
    move() {
        if (this.leftMotor === this.rightMotor){
            //move in a straight line
            //this.object3D.translateOnAxis(this.getDirection(), this.speed + this.rightMotor); 
            this.object3D.position.x += this.getDirection().x * this.speed * this.rightMotor;
            this.object3D.position.z += this.getDirection().z * this.speed * this.rightMotor;
        }
        else if (this.leftMotor > this.rightMotor) {
            //turn towards the right
        }
        else if (this.leftMotor < this.rightMotor) {
            //turn towards the left
        }

    }
}