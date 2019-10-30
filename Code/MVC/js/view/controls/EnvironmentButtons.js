import Observable from '../../Observable.js';

export default class EnvironmentButtons extends Observable{
    constructor() {
        super();
    }
    
    init() {
        document.getElementById("pgPickerButton").addEventListener('click', (e)=>this.onPGPickerClicked(e));
    }

    onPGPickerClicked(e) {
        
        this.emit('pgPickerClicked', { e });
    }
}
