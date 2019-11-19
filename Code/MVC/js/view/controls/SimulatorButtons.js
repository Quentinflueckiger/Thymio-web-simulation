import Observable from '../../Observable.js';

export default class SimulatorButtons extends Observable{
    constructor() {
        super();
        //this.mediator = mediator;
        //this.renderingContext = renderingContext;
    }
    
    init() {
        
        document.getElementById("pgPickerButton").addEventListener('click', (e)=>this.onPGPickerClicked(e));
        document.getElementById("aeslFileButton").addEventListener('click', (e)=>this.onAeslFileSubmited(e));

        document.getElementById("fwdButton").addEventListener('click', (e)=>this.onFwdButtonClicked(e));
        document.getElementById("bwdButton").addEventListener('click', (e)=>this.onBwdButtonClicked(e));
    }

    onPGPickerClicked(e) {
        
        this.emit('pgPickerClicked', { e });
    }

    onAeslFileSubmited(e) {
        
        this.emit('aeslFileSubmited', { e });
    }

    onFwdButtonClicked(e) {
        this.emit('fwdButtonClicked', { e });
    }
    onBwdButtonClicked(e) {

        this.emit('bwdButtonClicked', { e });
    }
}
