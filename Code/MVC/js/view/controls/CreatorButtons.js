import Observable from '../../Observable.js';

export default class CreatorButtons extends Observable{
    constructor() {
        super();
    }
    
    init() {
        
        document.getElementById("saveButton").addEventListener('click', (e)=>this.onSaveClicked(e));
        document.getElementById("generateGround").addEventListener('click', (e)=>this.onGenerateGroundClicked(e));
        document.getElementById("generateBox").addEventListener('click', (e)=>this.onGenerateBoxClicked(e));
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
}
