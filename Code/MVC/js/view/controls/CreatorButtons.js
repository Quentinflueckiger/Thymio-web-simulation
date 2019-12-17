import Observable from '../../Observable.js';

export default class CreatorButtons extends Observable{
    constructor() {
        super();
    }
    
    init() {
        
        document.getElementById("saveButton").addEventListener('click', (e)=>this.onSaveClicked(e));
        document.getElementById("generateGround").addEventListener('click', (e)=>this.onGenerateGroundClicked(e));
        document.getElementById("generateBox").addEventListener('click', (e)=>this.onGenerateBoxClicked(e));
        document.getElementById("generateCylinder").addEventListener('click', (e)=>this.onGenerateCylinderClicked(e));
        document.getElementById("startTrack").addEventListener('click', (e) => this.onStartTrackClicked(e));
        document.getElementById("generateTrack").addEventListener('click', (e) => this.onGenerateTrackClicked(e));
    }

    onSaveClicked(e){
        this.emit('saveClicked', { e });
    }

    onGenerateGroundClicked(e) {
        this.emit('generateGround', { e });
    }

    onGenerateBoxClicked(e) {
        this.emit('generateBox', { e });
    }

    onGenerateCylinderClicked(e) {
        this.emit('generateCylinder', { e });
    }

    onStartTrackClicked(e) {
        this.emit('startTrack', { e });
    }

    onGenerateTrackClicked(e) {
        this.emit('generateTrack', { e });
    }
}
