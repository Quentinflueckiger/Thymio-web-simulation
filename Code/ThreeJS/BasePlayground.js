import { OrbitControls } from '../ThreeJS/js/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from '../ThreeJS/js/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../ThreeJS/js/examples/jsm/loaders/OBJLoader.js';

//import { generateBox } from './GeometricalMeshes.js';
import * as GM from './GeometricalMeshes.js';

var renderer, scene, camera, light;
var meshes, thymio;

const thymiopath = '../Models/Thymio_3d_Model/';
const WallHeight = 6;
const WallDepth = 1;
const GroundColor = "#bdbbbb";
const BackGroundColor = "#7fc4f5";
const ThymioColor = "#e6e6e6";
const PI = 3.14;

init();
animate();

function generateThymioMesh(){

    var body = GM.generateBox(ThymioColor, 2, 1, 2);
    var head = generateSphere(ThymioColor, 1);
    head.position.z = 1 ;
    head.scale.y -= 0.5;
    var thymio = new THREE.Group();
    thymio.add(body);
    thymio.add(head);

    thymio.position.set(0, 0.5, 0);
    thymio.rotateY(PI/2);

    thymio.castShadow = true;

    return thymio;
}

function generateBasePlayGround(color, width, length){

    var plane = GM.generatePlane(color, width, length);
    plane.receiveShadow = true;

    var wallN = GM.generateBox(color, WallDepth, WallHeight, width);
    wallN.position.x -= width/2;
    wallN.position.y += WallHeight/2;
    wallN.castShadow = true;
    wallN.receiveShadow = true;
    var wallE = GM.generateBox(color, width, WallHeight, WallDepth);
    wallE.position.z -= width/2;
    wallE.position.y += WallHeight/2;
    wallE.castShadow = true;
    wallE.receiveShadow = true;
    var wallS = GM.generateBox(color, WallDepth, WallHeight, width);
    wallS.position.x += width/2;
    wallS.position.y += WallHeight/2;
    wallS.castShadow = true;
    wallS.receiveShadow = true;
    var wallW = GM.generateBox(color, width, WallHeight, WallDepth);
    wallW.position.z += width/2;
    wallW.position.y += WallHeight/2;
    wallW.castShadow = true;
    wallW.receiveShadow = true;

    var playground = new THREE.Group();
    playground.add(plane);
    playground.add(wallN);
    playground.add(wallE);
    playground.add(wallS);
    playground.add(wallW);

    return playground;
}

function generateTestPlayground(){
    var column = GM.generateBox(ThymioColor, 5, 10, 5);
    scene.add(column);
}

function loadOBJWMTL(){

    var mtlLoader = new MTLLoader();
    //mtlLoader.setTexturePath('../../Models/Thymio_3d_Model/');
    mtlLoader.setPath(thymiopath);
    mtlLoader.load('obj.mtl', function(materials){
        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(thymiopath);
        objLoader.load('tinker.obj', function(object){
            object.scale.set(0.05,0.05,0.05);
            object.rotateX(-PI/2);

            thymio = object;

            scene.add(object);
        })
    })

    
}

function initGFX(){

    meshes = GM.generateAxes();
    //meshes.push(generateThymioMesh());
    
    meshes.push(generateBasePlayGround(GroundColor,50,50));
    meshes.forEach(addMeshToScene);

    loadOBJWMTL();
}

function addMeshToScene(value, index, array){

	scene.add(value);
}

function onDocumentMouseMove(){
    //throw {name : "NotImplementedError", message : "staged to be implemented later"}; 
}

function onDocumentTouchStart(){

}

function onDocumentTouchMove(){

}

function resizeWindow(){

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
}

function initLight(){

    light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
    light.position.set( 25, 25, 0 ); 			
    light.castShadow = true;            
    scene.add( light );

    light.shadow.mapSize.width = 512;  
    light.shadow.mapSize.height = 512; 
    light.shadow.camera.near = 0.5;    
    light.shadow.camera.far = 500;     
}

function init(){

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(20,20,20);
    camera.lookAt(scene.position);
    camera.updateMatrix();
                
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(BackGroundColor);
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
 
    initLight();
    initGFX();

    var helper = new THREE.CameraHelper( light.shadow.camera );
    scene.add( helper );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    // controls
    var controls = new OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI * 0.5;
	controls.minDistance = 20;
	controls.maxDistance = 1000;

    window.addEventListener('resize', resizeWindow);
    document.body.appendChild( renderer.domElement );
}

			
function animate(){

    requestAnimationFrame( animate );

    // check that thymio exist, is already loaded
    if (thymio){
       
    }

    render();
}

function render() {
                
    renderer.render(scene, camera);
}