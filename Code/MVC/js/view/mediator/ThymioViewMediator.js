import ViewMediator from "./ViewMediator.js";
import { MTLLoader } from '../../../bin/loaders/MTLLoader.js';
import { OBJLoader } from '../../../bin/loaders/OBJLoader.js';

export default class ThymioViewMediator extends ViewMediator {
    constructor(thymio, mediatorFactory) {
        super(thymio, mediatorFactory);
        this.ready = false;
        this.speed = 0.001;
        this.turnSpeed = 0.01;
        this.model.mediator = this;
        this.leftMotor = 0;
        this.rightMotor = 0;
        this.ratio = 0.08; //Interval of {-40,40} instead of {-500,500}
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
                object.rotateZ(-Math.PI/2);

                container.add(object);
                container.rotateY(Math.PI/2);
                tvm.ready = true;
                
            })
        })
        return container;
    }
    
    getDirection() {
        var direction = new THREE.Vector3();
        return this.object3D.getWorldDirection(direction);;
    }
    
    onFrameRenderered() {
        super.onFrameRenderered();

        if (this.ready){
            this.move();
        }
        
    }

    setMotors(left, right) {
        this.leftMotor = left*this.ratio;
        this.rightMotor = right*this.ratio;
    }

    stopMotors() {
        this.leftMotor = 0;
        this.rightMotor = 0;
    }

    move() {
        var delta, velocity;

        // Have to improve for rotation when one motor is + and the other is -
        // When one of the motor is 0
        // And the value when he turns on himself
        if (this.leftMotor === this.rightMotor){
            //move in a straight line
            this.object3D.position.x += this.getDirection().x * this.speed * this.rightMotor;
            this.object3D.position.z += this.getDirection().z * this.speed * this.rightMotor;
        }
        else if (Math.abs(this.leftMotor) > Math.abs(this.rightMotor)) {
            //turn towards the right
            delta = this.leftMotor-this.rightMotor;
            this.object3D.rotateY(-(Math.atan(delta/Math.abs(this.leftMotor))*this.turnSpeed));
            this.object3D.position.x += this.getDirection().x * this.speed * this.leftMotor;
            this.object3D.position.z += this.getDirection().z * this.speed * this.leftMotor;
        }
        else if (Math.abs(this.leftMotor) < Math.abs(this.rightMotor)) {
            //turn towards the left
            delta = this.rightMotor-this.leftMotor;
            this.object3D.rotateY(Math.atan(delta/Math.abs(this.rightMotor))*this.turnSpeed);
            this.object3D.position.x += this.getDirection().x * this.speed * this.rightMotor;
            this.object3D.position.z += this.getDirection().z * this.speed * this.rightMotor;
        }
        else if (Math.abs(this.leftMotor) === Math.abs(this.rightMotor)) {
            //turn on himself
            velocity = this.leftMotor;
            this.object3D.rotateY(velocity/20 * this.turnSpeed);
        }
        else {
            console.log("Loophole");
        }

    }
}