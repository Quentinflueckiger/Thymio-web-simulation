import SimulatorView from '../view/SimulatorView.js';
import Playground from '../model/Playground.js';
import Box from '../model/Box.js';
import Plane from '../model/Plane.js';
import * as Interpreter from '../Interpreter/IntegrityFilter.js';
import Octagon from '../model/Octagon.js';
import UShapedFigure from '../model/UShapedFigure.js';
import Cylinder from '../model/Cylinder.js';
import Track from '../model/Track.js';

export default class EnvironmentController {
    constructor(environment, thymio) {
        this.environment = environment;
        this.view = new SimulatorView(this, environment);
        this.view.initialize();
        this.thymio = thymio;
        this.playground;
        this.program;
        
    }

    onPGPickerClicked(e){
        var pgPicker = document.getElementById("pgPicker");
        
        this.environment.removePlayground(this.environment.playground[0]);
        
        this.thymio.mediator.reset();

        var newPlayground = pgPicker.options[pgPicker.selectedIndex].value;
        this.loadPlayground(newPlayground);
    }
    
    loadPlayground(playgroundName) {
        var ec = this;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var myArr = JSON.parse(this.responseText);
                ec.createPlayground(myArr);
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
                var plane = new Plane(planeRecord.name, planeRecord.props, planeRecord.hasWalls);
                playground.addShape(plane);

                if(planeRecord.hasWalls){
                    this.createPlaneWall(planeRecord, playground);
                }
            }
        }
        
        if (file.thymios) {
            
            this.thymio.mediator.setPosition(file.thymios.positionX, file.thymios.positionX);
        }
        
        if (file.octagons) {
            for (const octagonRecord of file.octagons) {
                var octagon = new Octagon(octagonRecord.name, octagonRecord.props, octagonRecord.hasWalls);
                playground.addShape(octagon);

                if(octagonRecord.hasWalls){
                    
                    this.createOctagonWall(octagonRecord, playground);
                }
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
        this.thymio.mediator.setPlaygroundShapes(this.playground.shapes);
    }

    onJsonPGSubmited(e){
        const file = document.getElementById("jsonPlaygroundFile").files[0];
        var ec = this;
        this.environment.removePlayground(this.environment.playground[0]);
        
        this.thymio.mediator.reset();
        this.loadFile(file, ec);
    }


    onAeslFileSubmited(e) {
        const file = document.getElementById("aeslFile").files[0];

        Interpreter.loadFile(file, this);
    }

    onDPUpClicked(e) {
        
        this.thymio.mediator.dPUpClicked();
        //this.thymio.mediator.setMotors(300,300);
    }

    onDPLeftClicked(e) {
        
        this.thymio.mediator.dPLeftClicked();
        //this.thymio.mediator.setMotors(300,150);
    }

    onDPCenterClicked(e) {
        
        this.thymio.mediator.stopMotors();
        this.thymio.mediator.dPCenterClicked();
    }

    onDPRightClicked(e) {
        
        this.thymio.mediator.dPRightClicked();
        //this.thymio.mediator.setMotors(150,300);
    }

    onDPDownClicked(e) {
        
        this.thymio.mediator.dPDownClicked();
        //this.thymio.mediator.setMotors(-300,-300);
    }

    // This content will most likely end in the compiler
    loadFile(file, ec) {
        var reader = new FileReader();

        
        // file reading started
        reader.addEventListener('loadstart', function() {
            console.log('File reading started');
        });

        // file reading finished successfully and parse to Json format
        reader.addEventListener('load', function(e) {
            var text = JSON.parse(e.target.result);

            ec.createPlayground(text);
        });
        
        // file reading failed
        reader.addEventListener('error', function() {
            alert('Error : Failed to read file');
        });

        // file read progress 
        reader.addEventListener('progress', function(e) {
            if(e.lengthComputable == true) {
                var percent_read = Math.floor((e.loaded/e.total)*100);
                console.log(percent_read + '% read');
            }
        });

        // read as text file
        reader.readAsText(file);
    }

    setProgram(program){
        this.program = program;
    }

    createPlaneWall(record, playground){
        const wallDepth = 1;
        const wallHeight = 6;

        var propN = {
            width: wallDepth,
             height: wallHeight,
            depth: record.props.height+wallDepth,
            color: record.props.color,
            positionX: -record.props.width/2,
            positionZ: 0
        }
        var propS = {
            width: wallDepth,
            height: wallHeight,
            depth: record.props.height+wallDepth,
            color: record.props.color,
            positionX: record.props.width/2,
            positionZ: 0
        }
        var propE = {
            width: record.props.width+wallDepth,
            height: wallHeight,
            depth: wallDepth,
            color: record.props.color,
            positionX: 0,
            positionZ: -record.props.height/2
        }
        var propW = {
            width: record.props.width+wallDepth,
            height: wallHeight,
            depth: wallDepth,
            color: record.props.color,
            positionX: 0,
            positionZ: record.props.height/2
        }
        var wallN = new Box("wallN", propN);
        var wallS = new Box("wallS", propS);
        var wallE = new Box("wallE", propE);
        var wallW = new Box("wallW", propW);
        playground.addShape(wallS);
        playground.addShape(wallN);
        playground.addShape(wallE);
        playground.addShape(wallW);
    }

    createOctagonWall(record, playground){
        
        const wallDepth = 1;
        const wallHeight = 6;
        const radius = ((1+Math.sqrt(2))*record.props.segmentLength)/2;
        const xy = radius*Math.sin(45*Math.PI / 180);

        var propN = {
            width: wallDepth,
             height: wallHeight,
            depth: record.props.segmentLength+wallDepth/2,
            color: record.props.color,
            positionX: -radius,
            positionZ: 0
        }
        var propS = {
            width: wallDepth,
            height: wallHeight,
            depth: record.props.segmentLength+wallDepth/2,
            color: record.props.color,
            positionX: radius,
            positionZ: 0
        }
        var propE = {
            width: record.props.segmentLength+wallDepth/2,
            height: wallHeight,
            depth: wallDepth,
            color: record.props.color,
            positionX: 0,
            positionZ: -radius
        }
        var propW = {
            width: record.props.segmentLength+wallDepth/2,
            height: wallHeight,
            depth: wallDepth,
            color: record.props.color,
            positionX: 0,
            positionZ: radius
        }
        
        var propNE  = {
            width: record.props.segmentLength+wallDepth/2,
            height: wallHeight,
            depth: wallDepth,
            color: record.props.color,
            positionX: -xy,
            positionZ: -xy,
            rotateY:Math.PI/4
        }
        var propSW  = {
            width: record.props.segmentLength+wallDepth/2,
            height: wallHeight,
            depth: wallDepth,
            color: record.props.color,
            positionX: xy,
            positionZ: xy,
            rotateY:Math.PI/4
        }
        var propNW = {
            width: record.props.segmentLength+wallDepth/2,
            height: wallHeight,
            depth: wallDepth,
            color: record.props.color,
            positionX: xy,
            positionZ: -xy,
            rotateY:-Math.PI/4
        }
        var propSE = {
            width: record.props.segmentLength+wallDepth/2,
            height: wallHeight,
            depth: wallDepth,
            color: record.props.color,
            positionX: -xy,
            positionZ: xy,
            rotateY:-Math.PI/4
        }
        var wallN = new Box("wallN", propN);
        var wallS = new Box("wallS", propS);
        var wallE = new Box("wallE", propE);
        var wallW = new Box("wallW", propW);
        var wallNE = new Box("wallW", propNE);
        var wallSE = new Box("wallW", propSE);
        var wallSW = new Box("wallW", propSW);
        var wallNW = new Box("wallW", propNW);

        playground.addShape(wallS);
        playground.addShape(wallN);
        playground.addShape(wallE);
        playground.addShape(wallW);
        playground.addShape(wallNE);
        playground.addShape(wallSE);
        playground.addShape(wallSW);
        playground.addShape(wallNW);
    }
}
