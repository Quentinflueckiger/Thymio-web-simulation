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
    }

    loadPlayground(playgroundName) {
        var cc = this;
        //loadJSON(function test(){}, this);
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
    }
}