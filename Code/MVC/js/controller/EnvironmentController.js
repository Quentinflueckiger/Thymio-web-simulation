import MainView from '../view/MainView.js';
import Thymio from '../model/Thymio.js';
import APIClient from '../APIClient.js';
import Playground from '../model/Playground.js';
import Box from '../model/Box.js';
import Plane from '../model/Plane.js';
import * as Interpreter from '../Interpreter/IntegrityFilter.js';
import Octagon from '../model/Octagon.js';
import UShapedFigure from '../model/UShapedFigure.js';
import Cylinder from '../model/Cylinder.js';
import Track from '../model/Track.js';

export default class EnvironmentController {
    constructor(environment) {
        this.environment = environment;
        this.view = new MainView(this, environment);
        this.view.initialize();
    }

    onPGPickerClicked(e){
        var pgPicker = document.getElementById("pgPicker");
        
        this.environment.removePlayground(this.environment.playground[0]);

        var newPlayground = pgPicker.options[pgPicker.selectedIndex].value;
        this.createPlayground(newPlayground);
    }

    createPlayground(playgroundName) {
        const apiClient = new APIClient();
        const environmentRecord = apiClient.getRecord(playgroundName);

        for (const playgroundRecord of environmentRecord.playground) {
            const playground = new Playground(playgroundRecord.name);
            
            this.environment.addPlayground(playground);

            if (playgroundRecord.boxes) {
                for (const boxRecord of playgroundRecord.boxes) {
                    var box = new Box(boxRecord.name, boxRecord.props);
                    playground.addShape(box);
                }
            }
            
            if (playgroundRecord.planes) {
                for (const planeRecord of playgroundRecord.planes) {
                    var plane = new Plane(planeRecord.name, planeRecord.props);
                    playground.addShape(plane);
                }
            }
            
            if (playgroundRecord.thymios) {
                for (const thymioRecord of playgroundRecord.thymios) {
                    var thymio = new Thymio(thymioRecord.name, {});
                    playground.addShape(thymio);
                }
            }
            
            if (playgroundRecord.octagons) {
                for (const octagonRecord of playgroundRecord.octagons) {
                    var octagon = new Octagon(octagonRecord.name, octagonRecord.props, octagonRecord.hasWalls);
                    playground.addShape(octagon);
                }
            }

            if (playgroundRecord.uShapes) {
                for (const uShapeRecord of playgroundRecord.uShapes) {
                    var uShape = new UShapedFigure(uShapeRecord.name, uShapeRecord.props);
                    playground.addShape(uShape);
                }
            }

            if (playgroundRecord.cylinders) {
                for (const cylinderRecord of playgroundRecord.cylinders) {
                    var cylinder = new Cylinder(cylinderRecord.name, cylinderRecord.props);
                    playground.addShape(cylinder);
                }
            }

            if (playgroundRecord.tracks) {
                for (const trackRecord of playgroundRecord.tracks) {
                    var track = new Track(trackRecord.name, trackRecord.props);
                    playground.addShape(track);
                }
            }
        }
    }

    onAeslFileSubmited(e) {
        const file = document.getElementById("aeslFile").files[0];

        Interpreter.loadFile(file);
    }
}
