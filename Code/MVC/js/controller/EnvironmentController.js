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
    }

    onPGPickerClicked(e){
        var pgPicker = document.getElementById("pgPicker");
        
        this.environment.removePlayground(this.environment.playground[0]);
        
        this.thymio.mediator.stopMotors();
        this.thymio.mediator.resetRotation();

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

    onJsonPGSubmited(e){
        const file = document.getElementById("jsonPlaygroundFile").files[0];
        var ec = this;
        this.environment.removePlayground(this.environment.playground[0]);
        
        this.thymio.mediator.stopMotors();
        this.thymio.mediator.resetRotation();
        this.loadFile(file, ec);
    }


    onAeslFileSubmited(e) {
        const file = document.getElementById("aeslFile").files[0];

        Interpreter.loadFile(file, this);
    }

    onDPUpClicked(e) {
        
        this.thymio.mediator.setMotors(300,300);
    }

    onDPLeftClicked(e) {
        
        this.thymio.mediator.setMotors(300,150);
    }

    onDPCenterClicked(e) {
        
        this.thymio.mediator.stopMotors();
    }

    onDPRightClicked(e) {
        
        this.thymio.mediator.setMotors(150,300);
    }

    onDPDownClicked(e) {
        
        this.thymio.mediator.setMotors(-300,-300);
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
}
