import { OrbitControls } from '../../bin/controls/OrbitControls.js';
import * as ColorPalette from '../ColorPalette.js';

export default class RenderingContext {
    constructor(scene, camera, renderer, controls) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
    }

    static getDefault(containerElement) {

        const width  = window.innerWidth, height = window.innerHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        const renderer = new THREE.WebGLRenderer();

        // controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.maxPolarAngle = Math.PI * 0.49;
	    controls.minDistance = 20;
	    controls.maxDistance = 1000;

        camera.position.set(20,20,20);camera.lookAt(scene.position);
        camera.updateMatrix();

        renderer.setClearColor(ColorPalette.LightBlue);
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;

        scene.add(new THREE.AmbientLight(0x555555));

        const light = new THREE.DirectionalLight( 0xffffff, 1, 100 );

        light.position.set( 50, 50, 0 ); 			
        light.castShadow = true;
    
        light.shadow.mapSize.width = 512;  
        light.shadow.mapSize.height = 512; 
        light.shadow.camera.near = 0.5;    
        light.shadow.camera.far = 200;
         
        scene.add(light);

        /*var helper = new THREE.CameraHelper( light.shadow.camera );
        scene.add( helper );*/

        var axesHelper = new THREE.AxesHelper( 20 );
        scene.add( axesHelper );

        /*
        var testBox = new Physijs.BoxMesh(
			new THREE.BoxGeometry(10, 10, 10),
			new THREE.MeshPhongMaterial( { color : "#fc031c"} )
		);
        scene.add(testBox);*/
        
        containerElement.appendChild(renderer.domElement);

        return new RenderingContext(scene, camera, renderer, controls);
    }
}