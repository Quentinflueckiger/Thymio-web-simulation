import ViewMediatorFactory from './ViewMediatorFactory.js';
import RenderingContext from './RenderingContext.js';
import EnvironmentViewMediator from './mediator/EnvironmentViewMediator.js';
import CreatorButtons from './controls/CreatorButtons.js';
import {GUI} from '../../bin/gui/dat.gui.module.js';

export default class CreatorView {
    constructor(controller, environment) {
        this.controller = controller;
        this.environment = environment;
        this.renderingContext = this.createRenderingContext();
        this.environmentViewMediator = new EnvironmentViewMediator(environment, new ViewMediatorFactory());
        this.groundParams = {
            shape: true,
            sizeX: 50,
            sizeZ: 50,
			color: false
        }
        console.log("c: ", this.controller);
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

        var gui = new GUI();
        var folder = gui.addFolder( "Ground" );
		folder.add( this.groundParams, 'shape');
		folder.add( this.groundParams, 'sizeX', 5, 100).step(1).onFinishChange();
        folder.add( this.groundParams, 'sizeZ', 5, 100, 1).onFinishChange(this.zChanged);
        folder.add( this.groundParams, 'color' );
        folder.open();

        window.addEventListener( 'keydown', (e) => this.controller.onKeyDown(e));
        window.addEventListener( 'keyup', (e) => this.controller.onKeyUp(e));

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

    zChanged(){
        console.log("HA");
        this.controller.changeGroundSizeZ();
    }
}