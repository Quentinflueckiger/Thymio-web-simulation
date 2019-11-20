import ViewMediatorFactory from './ViewMediatorFactory.js';
import RenderingContext from './RenderingContext.js';
import EnvironmentViewMediator from './mediator/EnvironmentViewMediator.js';
import SimulatorButtons from './controls/SimulatorButtons.js';

export default class SimulatorView {
    constructor(controller, environment) {
        this.controller = controller;
        this.environment = environment;
        this.renderingContext = this.createRenderingContext();
        this.environmentViewMediator = new EnvironmentViewMediator(environment, new ViewMediatorFactory());
        this.simulatorButtons = new SimulatorButtons();
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

        this.simulatorButtons.init();
        
        this.simulatorButtons.addObserver('pgPickerClicked', (e) => this.controller.onPGPickerClicked(e));
        this.simulatorButtons.addObserver('aeslFileSubmited', (e) => this.controller.onAeslFileSubmited(e));
        
        this.simulatorButtons.addObserver('dPadUpClicked', (e) => this.controller.onDPUpClicked(e));
        this.simulatorButtons.addObserver('dPadLeftClicked', (e) => this.controller.onDPLeftClicked(e));
        this.simulatorButtons.addObserver('dPadCenterClicked', (e) => this.controller.onDPCenterClicked(e));
        this.simulatorButtons.addObserver('dPadRightClicked', (e) => this.controller.onDPRightClicked(e));
        this.simulatorButtons.addObserver('dPadDownClicked', (e) => this.controller.onDPDownClicked(e));

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