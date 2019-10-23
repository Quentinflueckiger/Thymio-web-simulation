import MainView from '../view/MainView.js';

export default class PlaygroundGontroller{
    constructor(playground){
        this.playground = playground;
        this.view = new MainView(this, playground);
    }

    // Button function and such

    onClickPicker(){
        var pgPicker = document.getElementById("pgPicker");
        var playground = PG.generatePlayGround(pgPicker.options[pgPicker.selectedIndex].value);
        if(playground != null){

            changePlayGround(playground);
        }
        else{

            console.log("Playground : ", playground);
        }
    }
}