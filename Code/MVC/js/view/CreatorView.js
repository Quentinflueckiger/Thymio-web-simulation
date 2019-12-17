import ViewMediatorFactory from './ViewMediatorFactory.js';
import RenderingContext from './RenderingContext.js';
import EnvironmentViewMediator from './mediator/EnvironmentViewMediator.js';
import CreatorButtons from './controls/CreatorButtons.js';

export default class CreatorView {
    constructor(controller, environment) {
        this.controller = controller;
        this.environment = environment;
        this.renderingContext = this.createRenderingContext();
        this.environmentViewMediator = new EnvironmentViewMediator(environment, new ViewMediatorFactory());
        this.creatorButtons = new CreatorButtons();
        this.rollOverMesh;
        this.rollOverMaterial;
        this.mouse;
        this.raycaster;
        this.camera;
        this.objects = [];
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

        var gridHelper = new THREE.GridHelper( 150, 150 );
        scene.add( gridHelper );
        
        this.camera = this.renderingContext.camera;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        var geometry = new THREE.PlaneBufferGeometry( 150, 150 );
        geometry.rotateX( - Math.PI / 2 );
        var plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
        scene.add( plane );
        this.objects.push( plane );

        this.creatorButtons.init();

        this.creatorButtons.addObserver('saveClicked', (e) => this.controller.saveClicked(e));
        this.creatorButtons.addObserver('generateGround', () => this.controller.generateGround());
        this.creatorButtons.addObserver('generateBox', (e) => this.controller.generateBox(e));

        window.addEventListener( 'keydown', (e) => this.controller.onKeyDown(e));
        window.addEventListener( 'keyup', (e) => this.controller.onKeyUp(e));
        window.addEventListener( 'mousemove', (e) => this.controller.onMouseMove(e));
        window.addEventListener( 'mousedown', (e) => this.controller.onMouseDown(e));

        window.addEventListener( 'resize', (e) => this.onWindowResize(), false );
        this.render();
    }

    render() {
        this.renderingContext.controls.update();
        requestAnimationFrame(() => this.render());

        this.environmentViewMediator.onFrameRenderered();
        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
        this.camera = this.renderingContext.camera;
    }

    onWindowResize(){
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}