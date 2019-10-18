import * as GM from './GeometricalMeshes.js';

const WallHeight = 6;
const WallDepth = 1;
const Width = 50;
const Length = 50;
const GroundColor = "#bdbbbb";
const WallColor = "#9fa3bd";

/**
 * Creates a base playground with a square plane as the bottom and four walls.
 * @return {THREE.Group}    The group containing all the meshes
 */
function generateBasePlayGround(){

    var plane = GM.generatePlane(GroundColor, Width, Length);
    plane.receiveShadow = true;

    var wallN = GM.generateBox(WallColor, WallDepth, WallHeight, Width+WallDepth);
    wallN.position.x -= Width/2;
    wallN.position.y += WallHeight/2;
    wallN.castShadow = true;
    wallN.receiveShadow = true;
    var wallE = GM.generateBox(WallColor, Width+WallDepth, WallHeight, WallDepth);
    wallE.position.z -= Width/2;
    wallE.position.y += WallHeight/2;
    wallE.castShadow = true;
    wallE.receiveShadow = true;
    var wallS = GM.generateBox(WallColor, WallDepth, WallHeight, Width+WallDepth);
    wallS.position.x += Width/2;
    wallS.position.y += WallHeight/2;
    wallS.castShadow = true;
    wallS.receiveShadow = true;
    var wallW = GM.generateBox(WallColor, Width+WallDepth, WallHeight, WallDepth);
    wallW.position.z += Width/2;
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

function generateObstaclePlayGround(){

    // Create octagon plane
    var plane = GM.generateOctagon(GroundColor, Length);
    plane.receiveShadow = true;
    

    // Create eight walls to surround the plane
    var radius = ((1+Math.sqrt(2))*Length)/2;       // Compute the radius of the octagon to place the walls 
    var xy = radius*Math.sin(45 * Math.PI / 180);   // Compute the middle quarter circle value
    var wallN = GM.generateBox(WallColor, WallDepth, WallHeight, Length+WallDepth/2);
    wallN.position.y += WallHeight/2;
    wallN.castShadow = true;
    wallN.receiveShadow = true;
    var wallS = wallN.clone();
    var wallNE = wallN.clone();
    var wallSE = wallN.clone();  
    wallN.position.x -= radius;
    wallS.position.x += radius;

    wallNE.rotateY(-Math.PI/4);
    var wallSW = wallNE.clone();
    wallNE.position.x -= xy;
    wallNE.position.z -= xy;
    wallSW.position.x += xy;
    wallSW.position.z += xy;

    wallSE.rotateY(Math.PI/4);
    var wallNW = wallSE.clone();
    wallSE.position.x -= xy;
    wallSE.position.z += xy;
    wallNW.position.x += xy;
    wallNW.position.z -= xy;

    var wallE = GM.generateBox(WallColor, Length+WallDepth/2, WallHeight, WallDepth);
    wallE.position.y += WallHeight/2;
    wallE.castShadow = true;
    wallE.receiveShadow = true;
    var wallW = wallE.clone();
    wallE.position.z -= radius;
    wallW.position.z += radius;

    // Create middle figure
    var uShaped = GM.generateUShapedFigure(WallColor, WallHeight, 3);
    uShaped.castShadow = true;
    uShaped.receiveShadow = true;

    // Create multiple cylinder as columns
    var columnTPL = GM.generateCylinder(WallColor, WallHeight, 2, 2);
    columnTPL.position.y += WallHeight/2;
    var columns = new THREE.Group();
    for (let i = 0; i < 7; i++) {
        var column = columnTPL.clone();
        column.position.x -= 14 + (i*3);
        column.position.z -= 14 + (i*3);
        columns.add(column);
    }
    for (let i = 0; i < 9; i++) {
        var column = columnTPL.clone();
        column.position.x -= radius - ((i+0.5)*4);
        columns.add(column);
    }
    for (let i = 0; i < 10; i++) {
        if (i < 5 || i > 7) {           
            var column = columnTPL.clone();
            column.position.x -= 14 + (i*3);
            column.position.z += 14 + (i*3);
            columns.add(column);
        }
    }
    columns.castShadow = true;
    columns.receiveShadow = true;


    var playground = new THREE.Group();
    playground.add(plane);
    playground.add(wallN);
    playground.add(wallNE);
    playground.add(wallE);
    playground.add(wallSE);
    playground.add(wallS);
    playground.add(wallSW);
    playground.add(wallW);
    playground.add(wallNW);
    playground.add(uShaped);
    playground.add(columns);

    return playground;
}

export { generateBasePlayGround, generateObstaclePlayGround };