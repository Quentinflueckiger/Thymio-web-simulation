import Observable from '../../Observable.js';

export default class EnvironmentButtons extends Observable{
    constructor() {
        super();
        //this.mediator = mediator;
        //this.renderingContext = renderingContext;
    }
    
    init() {
        
        document.getElementById("pgPickerButton").addEventListener('click', (e)=>this.onPGPickerClicked(e));
        document.getElementById("aeslFileButton").addEventListener('click', (e)=>this.onAeslFileSubmited(e));
    }

    onPGPickerClicked(e) {
        
        this.emit('pgPickerClicked', { e });
    }

    onAeslFileSubmited(e) {
        
        this.emit('aeslFileSubmited', { e });
    }
}
