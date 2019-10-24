import GalaxyViewMediator from './mediator/GalaxyViewMediator.js';
import ViewMediatorFactory from './ViewMediatorFactory.js';
import RenderingContext from './RenderingContext.js';
import EnvironmentViewMediator from './mediator/EnvironmentViewMediator.js';

export default class MainView {
    constructor(controller, galaxy, environment) {
        this.controller = controller;
        this.galaxy = galaxy;
        this.environment = environment;
        this.renderingContext = this.createRenderingContext();
        this.galaxyViewMediator = new GalaxyViewMediator(galaxy, new ViewMediatorFactory());
        this.environmentViewMediator = new EnvironmentViewMediator(environment, new ViewMediatorFactory());
    }

    createRenderingContext() {
        const domContainer = document.createElement('div');

        document.body.appendChild(domContainer);

        return RenderingContext.getDefault(domContainer);
    }

    initialize() {
        const scene = this.renderingContext.scene;
        const object3D = this.galaxyViewMediator.object3D;

        scene.add(object3D);



        window.addEventListener( 'resize', (e) => this.onWindowResize(), false );
        this.render();
    }

    render() {
        this.renderingContext.controls.update();
        requestAnimationFrame(() => this.render());

        this.galaxyViewMediator.onFrameRenderered();
        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
    }

    onWindowResize(){
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}