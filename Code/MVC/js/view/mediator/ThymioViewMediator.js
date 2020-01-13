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
        this.timeOuts = [];
        this.points = [];
        this.target;
        this.followTrackStart = false;
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
            if(this.state == 2 && this.followTrackStart){
                this.controlTrack();
            }
        }
        
    }

    reset(){
        this.stopMotors();
        this.resetRotation();
        this.resetState();
        this.setPosition(0,0);
        this.clearTimeOuts();
        this.noGroundCnt = 0;
        document.getElementById("dPadText").innerHTML = "Basic";
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
        this.timeOuts.push(setTimeout(function(){
            thm.stopMotors();
            thm.halfTurn(true);
        },1000));
    }

    halfTurn(dir){
        if (dir)
            this.setMotors(-400,400);
        else
            this.setMotors(400, -400);
        var thm = this;
        this.timeOuts.push(setTimeout(function(){
            thm.setMotors(400,400);
        },750));
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
        var limit = 1000;
        var ground = false;
        raycaster.set(this.object3D.position, new THREE.Vector3(0,-1,0));
        if(this.shapes.length < 1)
            return false;

        intersects = raycaster.intersectObjects(this.shapes, true);
        for(let i = 0; i < intersects.length; i++){
            if( intersects[i].object.mediator.model.className === "Plane" ||
                intersects[i].object.mediator.model.className === "Octagon")
            {
                ground = true;
            }
            else 
            {
            }
        }
        if (!ground)
            this.noGroundCnt++;
        //if (this.noGroundCnt > limit)
            //this.fall();
    }

    clearTimeOuts(){
        this.timeOuts.forEach(element => {
            clearTimeout(element);
        });
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
            this.startFollowingTrack();
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
            this.halfTurn(false);
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
            this.halfTurn(true);
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
            this.stopMotors();
            this.clearTimeOuts();
        }
        else if(this.state == 2)
        {
            this.stopFollowingTrack();
        }
        else
        {
            console.error("Unimplemented thymio state.");
        }
    }

    dPCenterClicked(){
        this.state = (this.state + 1) % nbrOfState;

        var stateText = document.getElementById("dPadText");
        if(this.state == 0)
            stateText.innerHTML = "Basic";
        else if(this.state == 1)
            stateText.innerHTML = "Explorator";
        else if(this.state == 2)
            stateText.innerHTML = "Track Follower";

        this.followTrackStart = false;
        this.points = [];
        this.stopMotors();
    }

    startFollowingTrack(){
        if (this.followTrackStart)
            return false;
        var trackExist;
        
        this.shapes.forEach(element => {
            if (element.mediator.model.className === "Track")
                trackExist = element;
        });

        if ( trackExist)
        {   
            trackExist.mediator.model.points.forEach(point => {
                this.points.push(point);
            })

            this.findClosestpoint();

            this.followTrackStart = true;
        }
        else
        {

        }
    }

    stopFollowingTrack(){
        
        this.followTrackStart = false;
        this.points = [];
        this.stopMotors();
    }

    findClosestpoint(){
        var smallest = 100;
        var index;
        for (let i = 0; i < this.points.length; i++) {
            if (this.object3D.position.distanceTo(this.points[i]) < smallest)
            {
                smallest = this.object3D.position.distanceTo(this.points[i]);
                index = i;
            }            
        }
        var pointsHolder = [];
        for(let i = 0; i < this.points.length; i++)
        {
            if(i+index < this.points.length)
                pointsHolder.push(this.points[i+index]);
            /*else
                pointsHolder.push(this.points[i-(this.points.length-index)]);*/
        }
        this.points = [];
        pointsHolder.forEach(point => {
            this.points.push(point);
        });
        this.goToPoint(this.points.shift());
    }

    goToPoint(point){
        
        this.target = point;
        this.object3D.lookAt(this.target);
        this.setMotors(400,400);
    }

    controlTrack(){      
        if( this.object3D.position.distanceTo(this.target) < 2)
        {   
            if(this.points.length == 0)
            {
                this.stopFollowingTrack();
                return true;
            }
            this.goToPoint(this.points.shift());
        }
    }

}