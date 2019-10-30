import MainView from '../view/MainView.js';
import Thymio from '../model/Thymio.js';
import APIClient from '../APIClient.js';
import Playground from '../model/Playground.js';
import Box from '../model/Box.js';
import Plane from '../model/Plane.js';
import * as IF from '../FilesFilters/IntegrityFilter.js';

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
            
        }
    }

    onAeslFileSubmited(e) {
        const file = document.getElementById("aeslFile").files[0];

        IF.loadFile(file);
    }
}
