import MainView from '../view/MainView.js';

export default class GalaxyController {
    constructor(galaxy, environment) {
        this.galaxy = galaxy;
        this.environment = environment;
        this.view = new MainView(this, galaxy, environment);
        this.view.initialize();
    }

    /*
    setDescriptionPanelText(astronomicalBody, event) {
        if (astronomicalBody) {
            this.view.descriptionPanel.text = `${event}: ${astronomicalBody.name}`;
        } else {
            this.view.descriptionPanel.text = `${event}: ${this.galaxy.name}`;
        }
    }

    onClick(astronomicalBody) {
        this.setDescriptionPanelText(astronomicalBody, 'Clicked');

        if (astronomicalBody && astronomicalBody.className === 'Planet') {
            astronomicalBody.isMoving = !astronomicalBody.isMoving;
        }
    }

    onDoubleClick(astronomicalBody) {
        if (astronomicalBody) {
            const parentElement = astronomicalBody.parent;

            if (parentElement.className === 'Planet') {
                parentElement.removeSatellite(astronomicalBody);
            } else if (parentElement.className === 'SolarSystem') {
                parentElement.removePlanet(astronomicalBody);
            }
        }
    }

    onMouseMove(astronomicalBody) {
        this.setDescriptionPanelText(astronomicalBody, 'Hovered');
    }
    */
}
