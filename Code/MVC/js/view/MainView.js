export default class MainView {
    constructor(controller, playground) {
        this.controller = controller;
        this.playground = playground;
        this.renderingContext = this.createRenderingContext();
        this.playgroundViewMediator = new playgroundViewMediator(playground, new ViewMediatorFactory());
        this.objectPicker = new ObjectPicker(this.galaxyViewMediator, this.renderingContext);
        this.descriptionPanel = new DescriptionPanel();
    }

    createRenderingContext() {
        const domContainer = document.createElement('div');

        document.body.appendChild(domContainer);

        return RenderingContext.getDefault(domContainer);
    }

    initialize() {
        const scene = this.renderingContext.scene;
        const object3D = this.playgroundViewMediator.object3D;

        scene.add(object3D);

        document.getElementById("pgButton").addEventListener('click', (e) => this.controller.onClickPicker(e.value));

        window.addEventListener( 'resize', (e) => this.onWindowResize(), false );
        this.render();
    }

    render() {
        this.renderingContext.controls.update();
        requestAnimationFrame(() => this.render());

        this.playgroundViewMediator.onFrameRenderered();
        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
    }

    onWindowResize(){
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
        this.objectPicker.notifyWindowResize();
    }
}