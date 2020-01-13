import CreatorView from '../view/CreatorView.js';
import Thymio from '../model/Thymio.js';
import Playground from '../model/Playground.js';
import Box from '../model/Box.js';
import Plane from '../model/Plane.js';
import Octagon from '../model/Octagon.js';
import UShapedFigure from '../model/UShapedFigure.js';
import Cylinder from '../model/Cylinder.js';
import Track from '../model/Track.js';

export default class CreatorController {
    constructor(environment, thymio) {
        this.environment = environment;
        this.view = new CreatorView(this, environment);
        this.view.initialize();
        this.thymio = thymio;
        this.playground;
        this.ground;
        this.shapes = [];
        this.oldShapes = [];
        this.ctrl = false;
        this.positionShape = false;
        this.rollOverMesh;
        this.shapeType = 0;         // 0 = no shape, 1 = Box, 2 = Cylinder, 3 = Tracks
        this.props;
        this.points = [];
        this.oldPoints = [];
    }

    loadPlayground(playgroundName) {
        var cc = this;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var myArr = JSON.parse(this.responseText);
                cc.createPlayground(myArr);
            }
        };
        xmlhttp.open("GET", './json/'+playgroundName+'.json', true);
        xmlhttp.send();
        
    }

    createPlayground(file) {

        const playground = new Playground(file.playground);
        this.environment.addPlayground(playground);

        if (file.boxes) {
            for (const boxRecord of file.boxes) {
                var box = new Box(boxRecord.name, boxRecord.props);
                playground.addShape(box);
            }
        }

        if (file.planes) {
            for (const planeRecord of file.planes) {
                var plane = new Plane(planeRecord.name, planeRecord.props);
                playground.addShape(plane);
            }
        }
        
        if (file.thymios) {
            if(this.thymio.mediator)
                this.thymio.mediator.setPosition(file.thymios.positionX, file.thymios.positionX);
        }
        
        if (file.octagons) {
            for (const octagonRecord of file.octagons) {
                var octagon = new Octagon(octagonRecord.name, octagonRecord.props, octagonRecord.hasWalls);
                playground.addShape(octagon);
            }
        }

        if (file.uShapes) {
            for (const uShapeRecord of file.uShapes) {
                var uShape = new UShapedFigure(uShapeRecord.name, uShapeRecord.props);
                playground.addShape(uShape);
            }
        }

        if (file.cylinders) {
            for (const cylinderRecord of file.cylinders) {
                var cylinder = new Cylinder(cylinderRecord.name, cylinderRecord.props);
                playground.addShape(cylinder);
            }
        }

        if (file.tracks) {
            for (const trackRecord of file.tracks) {
                var track = new Track(trackRecord.name, trackRecord.props);
                playground.addShape(track);
            }
        }
        this.playground = playground;
    }

    onKeyDown(e){
        // Test for control key
        if (e.keyCode === 17)
        {
            this.ctrl = true;
        }
        // Test for "Z" and control key
        else if (e.keyCode === 90 && this.ctrl)
        {
            if(this.shapes.length > 0 && this.shapeType != 3)
            {
                var temp = this.shapes.pop();
                this.playground.removeShape(temp);
                this.oldShapes.push(temp);
            }
            else if(this.points.length > 0 && this.shapeType === 3)
            {
                var temp = this.points.pop();
                this.view.renderingContext.scene.remove(temp);
                this.oldPoints.push(temp);
            }
        }
        // Test for "Y" and control key
        else if (e.keyCode === 89 && this.ctrl)
        {
            if (this.oldShapes.length > 0 && this.shapeType != 3)
            {
                var temp = this.oldShapes.pop();
                this.playground.addShape(temp);
                this.shapes.push(temp);
            }
            else if(this.oldPoints.length > 0 && this.shapeType === 3)
            {
                var temp = this.oldPoints.pop();
                this.view.renderingContext.scene.add(temp);
                this.points.push(temp);
            }
            
        }
        // Test for shift key
        else if (e.keyCode === 16)
        {
            this.view.renderingContext.controls.enabled = !this.view.renderingContext.controls.enabled;
        }
        // Test for escape key
        else if (e.keyCode === 27)
        {
            this.positionShape  = false;
            this.view.renderingContext.scene.remove(this.rollOverMesh);
        }
    }

    onKeyUp(e){
        if (e.keyCode === 17)
        {
            this.ctrl = false;
        }
    }

    // Might need to optimize it because as soon as a mesh is placed down the application is slowed down
    onMouseMove(e){
        if(this.positionShape){
            e.preventDefault();
            this.view.mouse.set( ( e.clientX / window.innerWidth ) * 2 - 1, - ( e.clientY / window.innerHeight ) * 2 + 1 );
            this.view.raycaster.setFromCamera( this.view.mouse, this.view.camera );
            var intersects = this.view.raycaster.intersectObjects( this.view.objects );
            if ( intersects.length > 0 ) {
                var intersect = intersects[ 0 ];
                this.rollOverMesh.position.x = intersect.point.x;
                this.rollOverMesh.position.z = intersect.point.z;

                this.rollOverMesh.position.divideScalar( 1 ).floor().multiplyScalar( 1).addScalar( 0.5 );
            }
            this.view.render();
        }
        
    }

    // Might need to optimize it because as soon as a mesh is placed down the application is slowed down
    onMouseDown(e){
        if(!this.view.renderingContext.controls.enabled && this.positionShape)
        {
            this.positionShape  = false;
            
            e.preventDefault();
			this.view.mouse.set( ( e.clientX / window.innerWidth ) * 2 - 1, - ( e.clientY / window.innerHeight ) * 2 + 1 );
			this.view.raycaster.setFromCamera( this.view.mouse, this.view.camera );
			var intersects = this.view.raycaster.intersectObjects( this.view.objects );
			if ( intersects.length > 0 ) {
				var intersect = intersects[ 0 ];

                
                var interesctPos = new THREE.Vector3(0,0,0);
                interesctPos.x = intersect.point.x;
                interesctPos.z = intersect.point.z;
                interesctPos.divideScalar( 1 ).floor().multiplyScalar( 1).addScalar( 0.5 );
                switch(this.shapeType)
                {   
                    // Box
                    case 1:
                        this.props.positionX = interesctPos.x;
                        this.props.positionZ = interesctPos.z;
                        var mesh = new Box("Box"+this.props.positionX, this.props);
                        break;
                    // Cylinder
                    case 2:
                        this.props.positionX = interesctPos.x;
                        this.props.positionZ = interesctPos.z;
                        var mesh = new Cylinder("Cylinder"+this.props.positionX, this.props);
                        break;
                    // Track
                    case 3:
                        // create little red point at pos
                        var rollOverGeo = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
	                    var rollOverMaterial = new THREE.MeshBasicMaterial( { color: this.props.color } );
                        var tempMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
                        tempMesh.position.y += 0.25;
                        tempMesh.position.x = interesctPos.x;
                        tempMesh.position.z = interesctPos.z;
                        this.view.renderingContext.scene.add( tempMesh );
                        this.points.push(tempMesh);
                        this.positionShape = true;
                        // go back to placing next points
                        // do it while generate button not pressed
                        return;
                    default:
                        break;
                }
                this.playground.addShape(mesh);
                //this.view.objects.push(mesh);
                this.shapes.push(mesh);
				
				this.view.render();
			}

            this.view.renderingContext.scene.remove(this.rollOverMesh);
        }

    }

    saveClicked(e){
        var fileName;
        var promptTxt = prompt("Please enter a name for the file:", "");
        if (promptTxt == null || promptTxt == "") {
            return false;
        } else {
            fileName = promptTxt;
        }
        this.prepareData(fileName);
    }

    prepareData(fileName){
        var boxes = [], uShapes = [], cylinders = [], tracks = [], ground = [], thymio = [];
        for(var i = 0; i < this.playground.shapes.length; i++){
            switch(this.playground.shapes[i].className)
            {
                case "Box":
                    boxes.push(this.playground.shapes[i]);
                    break;
                case "UShapedFigure":
                    uShapes.push(this.playground.shapes[i]);
                    break;
                case "Track":
                    tracks.push(this.playground.shapes[i]);
                    break;
                case "Cylinder":
                    cylinders.push(this.playground.shapes[i]);
                    break;
                case "Thymio":
                    thymio.push(this.playground.shapes[i]);
                    break;
                case "Plane":
                case "Octagon":
                    ground.push(this.playground.shapes[i]);
                    break;
                default:
                    console.error("Unregistered shape: ", this.playground.shapes[i].className);
                    break;
            }
        }
        this.createJsonFile(ground, boxes, cylinders, tracks, uShapes, fileName);
    }

    createJsonFile(ground, boxes, cylinders, tracks, uShapes, fileName){
        var obj = {
            playground: fileName
        };
        if(ground[0].className === 'Plane'){
            obj.planes = [
                {
                    name : ground[0].name,
                    props : ground[0].properties,
                    hasWalls : ground[0].hasWalls
                }
            ]
        }
        else if(ground[0].className === 'Octagon'){
            obj.octagons = [
                {
                    name : ground[0].name,
                    props : ground[0].properties,
                    hasWalls : ground[0].hasWalls
                }
            ]
        }
        else {
            console.error("No ground given");
        }
        obj.boxes = [];
        boxes.forEach(box => {
            obj.boxes.push({
                name : box.name,
                props : box.properties
            })
        });
        obj.cylinders = [];
        cylinders.forEach(cylinder => {
            obj.cylinders.push({
                name : cylinder.name,
                props : cylinder.properties
            })
        });
        obj.tracks = [];
        tracks.forEach(track => {
            obj.tracks.push({
                name : track.name,
                props : track.properties
            })
        });
        obj.uShapes = [];
        uShapes.forEach(uShape => {
            obj.uShapes.push({
                name : uShape.name,
                props : uShape.properties
            })
        });
        
        var json = JSON.stringify(obj);
        this.download(""+fileName+".json", json);
    }

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    generateGround(e){
        this.deletePlaceholder();
        var form = document.getElementById("groundForm").elements;

        this.playground.removeShape(this.ground);

        if(form[0].checked){
            var props = {
                width :  parseInt(form[2].value, 10), 
                height :  parseInt(form[3].value, 10),
                color : form[4].value
            };
            var ground = new Plane("ground", props, form[5].checked);
        }
        else{
            var props = {
                segmentLength : parseInt(form[2].value, 10)/2,
                color : form[4].value
            };
            var ground = new Octagon("ground", props, form[5].checked);
        }

        this.playground.addShape(ground);
        this.ground = ground;
    }

    generateBox(e){    
        this.deletePlaceholder();
        var form = document.getElementById("boxForm").elements;
        
        this.props = {
            width : parseInt(form[0].value, 10),
            height : parseInt(form[2].value, 10),
            depth : parseInt(form[1].value, 10),
            color : form[3].value,
            positionX : 0,
            positionZ : 0,
            rotateY : THREE.Math.degToRad(parseInt(form[4].value, 10))
        };
        var rollOverGeo = new THREE.BoxBufferGeometry(parseInt(form[0].value, 10),parseInt(form[2].value, 10),parseInt(form[1].value, 10));
	    var rollOverMaterial = new THREE.MeshBasicMaterial( { color: form[3].value, opacity: 0.5, transparent: true } );
        this.rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
        this.rollOverMesh.position.y += parseInt(form[2].value, 10)/2;
        this.rollOverMesh.rotateY(THREE.Math.degToRad(parseInt(form[4].value, 10)));
        this.view.renderingContext.scene.add( this.rollOverMesh );

        this.shapeType = 1;

        this.positionShape  = true;
    }

    generateCylinder(e){
        this.deletePlaceholder();
        var form = document.getElementById("cylinderForm").elements;

        this.props = {
            topRadius : parseInt(form[1].value, 10),
            botRadius : parseInt(form[0].value, 10),
            height : parseInt(form[2].value, 10),
            positionX : 0,
            positionZ : 0,
            color : form[3].value
        };
        var rollOverGeo = new THREE.CylinderGeometry(this.props.topRadius, this.props.botRadius, this.props.height, 32);
	    var rollOverMaterial = new THREE.MeshBasicMaterial( { color: form[3].value, opacity: 0.5, transparent: true } );
        this.rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
        this.rollOverMesh.position.y += parseInt(form[2].value, 10)/2;
        this.view.renderingContext.scene.add( this.rollOverMesh );

        this.shapeType = 2;

        this.positionShape = true;
    }

    startTrack(e){
        this.deletePlaceholder();

        var form = document.getElementById("trackForm").elements;
        
        this.props = {
            color : form[0].value,
            points : []
        }

        var rollOverGeo = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
	    var rollOverMaterial = new THREE.MeshBasicMaterial( { color: form[0].value, opacity: 0.5, transparent: true } );
        this.rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
        this.rollOverMesh.position.y += 0.25;
        this.view.renderingContext.scene.add( this.rollOverMesh );
        this.shapeType = 3;

        this.positionShape = true;
    }

    generateTrack(e){
        //this.points.pop();
        // Compute tracks with point array
        this.points.pop();
        //var firstPt = this.points[0];
        this.points.forEach(pt => {                      
            this.props.points.push({
                positionX : pt.position.x,
                positionZ : pt.position.z
            });
        });
        /*this.props.points.push({
            positionX : firstPt.position.x,
            positionZ : firstPt.position.z
        });*/
        this.deletePlaceholder();
        this.points = [];

        var mesh = new Track("Track"+this.points.length, this.props);
        this.playground.addShape(mesh);
        this.shapes.push(mesh);
				
		this.view.render();
		

        this.view.renderingContext.scene.remove(this.rollOverMesh);
    }

    deletePlaceholder(){
        if(this.positionShape && this.points.length == 0)
            this.view.renderingContext.scene.remove(this.rollOverMesh);
        else if (this.positionShape && this.points.length > 0)
        {
            this.points.forEach(pt => {
                this.view.renderingContext.scene.remove(pt)
            });
        }
    }
}