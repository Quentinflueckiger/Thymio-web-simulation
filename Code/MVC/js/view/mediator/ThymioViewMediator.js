import ViewMediator from "./ViewMediator.js";
import { MTLLoader } from '../../../bin/loaders/MTLLoader.js';
import { OBJLoader } from '../../../bin/loaders/OBJLoader.js';
import ProximitySensor from "../sensors/ProximitySensor.js";

const nbrOfState = 3;
const gravity = 100;

export default class ThymioViewMediator extends ViewMediator {
    constructor(thymio, mediatorFactory) {
        super(thymio, mediatorFactory);
        this.ready = false;
        this.speed = 0.003;
        this.turnSpeed = 0.01;
        this.model.mediator = this;
        this.leftMotor = 0;
        this.rightMotor = 0;
        this.ratio = 0.08; //Interval of {-40,40} instead of {-500,500}
        this.sensorInitalized = false;
        this.shapes = [];
        this.sensors = [];
        this.state = 0;             //0 = No behavior, 1 = Explorator behavior, 2 = Follow track behavior
        this.noGroundCnt = 0;
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
    
    resetState(){
        this.state = 0;
    }

    onFrameRenderered() {
        super.onFrameRenderered();

        if (this.ready){        
            this.move();
            this.controlFrontProx(3.5);
            this.controlBackProx(2.5);
            this.controlGroundProx();
        }
        
    }

    reset(){
        this.stopMotors();
        this.resetRotation();
        this.resetState();
        this.setPosition(0,0);
        this.noGroundCnt = 0;
    }

    setPosition(x,z) {
        this.object3D.position.x = x;
        this.object3D.position.z = z;
        this.object3D.position.y = 0;
    }

    setMotors(left, right) {
        this.leftMotor = left*this.ratio;
        this.rightMotor = right*this.ratio;
    }

    stopMotors() {
        this.leftMotor = 0;
        this.rightMotor = 0;
    }
    
    stepBack(){

        this.setMotors(-250,-250);
        var thm = this;
        setTimeout(function(){
            if(this.state == 1)
            {
                thm.stopMotors();
                thm.halfTurn();
            }
        },1000);
    }

    halfTurn(){

        this.setMotors(-400,400);
        var thm = this;
        setTimeout(function(){
            if (this.state == 1)
                thm.setMotors(400,400);
        },750);
    }

    fall(){
        this.object3D.position.y -= this.speed * gravity;
    }

    resetRotation() {
        this.object3D.rotation.y = Math.PI/2;
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

    setPlaygroundShapes(shapes){
        this.shapes = [];
        shapes.forEach(element => {
            this.shapes.push(element.mediator.object3D);
        });
    }

    controlFrontProx(dist){
        var raycaster = new THREE.Raycaster();
        var intersects;
        raycaster.set(this.object3D.position, this.getDirection().normalize());
        if (this.shapes.length < 1)
            return false;
    
        intersects = raycaster.intersectObjects(this.shapes, true);
        for(let i = 0; i < intersects.length; i++){
            //console.log("Intersection with: ", intersects[i]);
            if (intersects[i].distance < dist){
                if( intersects[i].object.mediator.model.className === "Plane" ||
                    intersects[i].object.mediator.model.className === "Octagon")
                {
                    //console.log("plane");
                    //console.log(intersects[i]);
                }
                else if (intersects[i].object.mediator.model.className === "Track")
                {
                    //console.log("Track");
                }
                else{
                    //console.log("Interesct: ", intersects[i]);
                    if(this.state == 0)
                    {
                        this.stopMotors();
                    }
                    else if(this.state == 1)
                    {
                        this.stepBack();
                    }
                }
            }
        }
        
    }

    controlBackProx(dist){
        var raycaster = new THREE.Raycaster();
        var intersects;
        raycaster.set(this.object3D.position, (this.getDirection().normalize()).negate());
        if (this.shapes.length < 1)
            return false;
    
        intersects = raycaster.intersectObjects(this.shapes, true);
        for(let i = 0; i < intersects.length; i++){
            //console.log("Intersection with: ", intersects[i]);
            if (intersects[i].distance < dist){
                if( intersects[i].object.mediator.model.className === "Plane" ||
                    intersects[i].object.mediator.model.className === "Octagon")
                {
                    //console.log("plane");
                }
                else if (intersects[i].object.mediator.model.className === "Track")
                {
                    //console.log("Track");
                }
                else{

                    //console.log("Interesct: ", intersects[i]);
                    this.stopMotors();
                }
            }
        }
        
    }

    controlGroundProx(){
        var raycaster = new THREE.Raycaster();
        var intersects;
        var limit = 10;
        raycaster.set(this.object3D.position, new THREE.Vector3(0,-1,0));
        if(this.shapes.length < 1)
            return false;

        intersects = raycaster.intersectObjects(this.shapes, true);
        for(let i = 0; i < intersects.length; i++){
            
            if( intersects[i].object.mediator.model.className === "Plane" ||
                intersects[i].object.mediator.model.className === "Octagon")
            {
                return true;
            }
            else 
            {
            }
        }
        this.noGroundCnt++;
        if (this.noGroundCnt > limit)
            this.fall();
    }

    dPUpClicked(){
        if(this.state == 0)
        {
            this.setMotors(400,400);
        }
        else if(this.state == 1)
        {
            this.setMotors(400,400);
        }
        else if(this.state == 2)
        {

        }
        else
        {
            console.error("Unimplemented thymio state.");
        }
    }
    
    dPLeftClicked(){
        if(this.state == 0)
        {
            this.setMotors(-100, 400);           
        }
        else if(this.state == 1)
        {
        }
        else if(this.state == 2)
        {

        }
        else
        {
            console.error("Unimplemented thymio state.");
        }
    }

    dPRightClicked(){
        if(this.state == 0)
        {
            this.setMotors(400,-100);
        }
        else if(this.state == 1)
        {

        }
        else if(this.state == 2)
        {

        }
        else
        {
            console.error("Unimplemented thymio state.");
        }
    }

    dPDownClicked(){
        if(this.state == 0)
        {
            this.setMotors(-400,-400);
        }
        else if(this.state == 1)
        {

        }
        else if(this.state == 2)
        {

        }
        else
        {
            console.error("Unimplemented thymio state.");
        }
    }

    dPCenterClicked(){
        console.log(this.state);
        this.state = (this.state + 1) % nbrOfState;
        this.stopMotors();
    }

}