import ViewMediatorFactory from './ViewMediatorFactory.js';
import RenderingContext from './RenderingContext.js';
import EnvironmentViewMediator from './mediator/EnvironmentViewMediator.js';
import EnvironmentButtons from './controls/EnvironmentButtons.js';
import ButtonsPanel from '../controller/ButtonsPanel.js';

export default class MainView {
    constructor(controller, environment) {
        this.controller = controller;
        this.environment = environment;
        this.renderingContext = this.createRenderingContext();
        this.environmentViewMediator = new EnvironmentViewMediator(environment, new ViewMediatorFactory());
        this.environmentButtons = new EnvironmentButtons();
        this.ButtonsPanel = new ButtonsPanel();
    }

    createRenderingContext() {
        const domContainer = document.createElement('div');

        document.body.appendChild(domContainer);

        return RenderingContext.getDefault(domContainer);
    }

    initialize() {
        const scene = this.renderingContext.scene;
        const object3D = this.environmentViewMediator.object3D;

        scene.add(object3D);

        this.environmentButtons.init();
        this.environmentButtons.addObserver('pgPickerClicked', this.controller.onPGPickerClicked);

        window.addEventListener( 'resize', (e) => this.onWindowResize(), false );
        this.render();
    }

    render() {
        this.renderingContext.controls.update();
        requestAnimationFrame(() => this.render());

        this.environmentViewMediator.onFrameRenderered();
        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
    }

    onWindowResize(){
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}