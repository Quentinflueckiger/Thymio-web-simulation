import MainView from '../view/MainView.js';

export default class EnvironmentController {
    constructor(environment) {
        this.environment = environment;
        this.view = new MainView(this, environment);
        this.view.initialize();
        console.log(this.environment);
    }

    onPGPickerClicked(){
        var pgPicker = document.getElementById("pgPicker");
        console.log("Environment ? : ", this.environment);
        
        //this.environment.removePlayground(this.environment.playground[pgPicker.selectedIndex].value);
    }

}
