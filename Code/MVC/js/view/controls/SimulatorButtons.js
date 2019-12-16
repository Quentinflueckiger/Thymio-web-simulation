import Observable from '../../Observable.js';

export default class SimulatorButtons extends Observable{
    constructor() {
        super();
    }
    
    init() {
        
        document.getElementById("pgPickerButton").addEventListener('click', (e)=>this.onPGPickerClicked(e));
        document.getElementById("jsonPGButton").addEventListener( 'click', (e)=>this.onJsonPGSubmited(e));
        document.getElementById("aeslFileButton").addEventListener('click', (e)=>this.onAeslFileSubmited(e));

        document.getElementById("dPadUp").addEventListener('click', (e)=>this.onDPUpClicked(e));
        document.getElementById("dPadLeft").addEventListener('click', (e)=>this.onDPLeftClicked(e));
        document.getElementById("dPadCenter").addEventListener('click', (e)=>this.onDPCenterClicked(e));
        document.getElementById("dPadRight").addEventListener('click', (e)=>this.onDPRightClicked(e));
        document.getElementById("dPadDown").addEventListener('click', (e)=>this.onDPDownClicked(e));
    }

    onPGPickerClicked(e) {
        
        this.emit('pgPickerClicked', { e });
    }

    onJsonPGSubmited(e) {

        this.emit('jsonPGSubmited', { e });
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

    onDPUpClicked(e) {
        
        this.emit('dPadUpClicked', { e });
    }

    onDPLeftClicked(e) {
        
        this.emit('dPadLeftClicked', { e });
    }

    onDPCenterClicked(e) {
        
        this.emit('dPadCenterClicked', { e });
    }

    onDPRightClicked(e) {
        
        this.emit('dPadRightClicked', { e });
    }

    onDPDownClicked(e) {
        
        this.emit('dPadDownClicked', { e });
    }
}
