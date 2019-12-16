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
        //console.log("E pressed: ",e.keyCode);
    }

    onKeyUp(e){
        //console.log("E releases: ",e.keyCode);
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
        console.log("boxes: ", boxes);
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
        var form = document.getElementById("groundForms").elements;

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
            console.log("Val:  ", form[2].value);
            var props = {
                segmentLength : parseInt(form[2].value, 10)/2,
                color : form[4].value
            };
            var ground = new Octagon("ground", props, form[5].checked);
        }

        this.playground.addShape(ground);
        this.ground = ground;


    }
}