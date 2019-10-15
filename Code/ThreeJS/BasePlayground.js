import { OrbitControls } from '../ThreeJS/js/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from '../ThreeJS/js/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../ThreeJS/js/examples/jsm/loaders/OBJLoader.js';

//import { generateBox } from './GeometricalMeshes.js';
import * as GM from './GeometricalMeshes.js';
import * as PG from './Playgrounds.js';

var renderer, scene, camera, light;
var meshes, thymio;
var points;

const thymiopath = '../Models/Thymio_3d_Model/';
const BackGroundColor = "#7fc4f5";
const ThymioColor = "#e6e6e6";

init();
animate();

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
            object.rotateX(-Math.PI/2);

            thymio = object;
            
            scene.add(object);
        })
    })

    
}


function initGFX(){

    meshes = GM.generateAxes();

    //var playground = PG.generateBasePlayGround();
    var playground = PG.generateObstaclePlayGround();
    playground.name = "playground";
    meshes.push(playground);

    points = GM.createPoints();    
    var track = GM.generateTrack(ThymioColor, points);
    meshes.push(track);

    meshes.forEach(addMeshToScene);

    loadOBJWMTL();
}

function changePlayGround(playground){

    clearPlayground();
    meshes.push(playground);
    playground.name = "playground";
    scene.add(playground);
}

function clearPlayground(){
    scene.remove(scene.getObjectByName("playground"));
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
    
    document.getElementById("basePlaygroundBtn").onclick = function(){
        var playground = PG.generateBasePlayGround();
        changePlayGround(playground);
    }
    document.getElementById("obstaclePlaygroundBtn").onclick = function(){
        var playground = PG.generateObstaclePlayGround();
        changePlayGround(playground);
    }
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

    // check that thymio is already loaded, exist
    if (thymio){
       
    }

    render();
}

function render() {
                
    renderer.render(scene, camera);
}