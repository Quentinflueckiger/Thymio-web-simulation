export default class ButtonsPanel {
    constructor() {
        this.domContainer = document.createElement('button');
        this.domContainer.id = 'pgPickerButton';
        document.body.appendChild(this.domContainer);
    }
}