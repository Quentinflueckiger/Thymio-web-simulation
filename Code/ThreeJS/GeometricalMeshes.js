// Hex value of four base colors.
const Blue = "#0324ff";     
const Red = "#fc031c";
const Grey = "#e5e5e5";
const Green = "#11ff00";

// Used for the track, might let the users change their values later on 
const TrackDepth = 1;
const TrackHeight = 0.25;

/**
*   Creates a box mesh.
*   @param {Color} color    The hex value of the wanted color
*   @param {Float} width    The x value
*   @param {Float} height   The y value
*   @param {Float} depth    The z value
*   @return {Mesh}          The mesh created
*/
function generateBox(color, width, height, depth){

    var geometry = new THREE.BoxGeometry( width, height, depth );
    var material = new THREE.MeshPhongMaterial( { color : color} );
    var box = new THREE.Mesh( geometry, material );
                
    return box;
}

/**
 * Creates a plane mesh.
 * @param {Color} color     The hex value of the wanted color
 * @param {Float} width     The x value
 * @param {Float} height    The z value
 * @return {Mesh}           The mesh created
 */
function generatePlane(color, width, height){

    var geometry = new THREE.PlaneGeometry( width, height, 32 );
    var material = new THREE.MeshPhongMaterial( {color: color, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
                
    plane.rotateX(Math.PI/2);

    return plane;
}

/**
 * Create a XYZ axis system.
 * @returns {Mesh[]}        An array filled with the three meshes of the corresponding axes. 
 */
function generateAxes(){

	var x = generateLine(Red, new THREE.Vector3(-50,0,0),new THREE.Vector3(50,0,0));
	var y = generateLine(Green,new THREE.Vector3(0,-50,0),new THREE.Vector3(0,25,0));
	var z = generateLine(Blue,new THREE.Vector3(0,0,-50 ),new THREE.Vector3(0,0,50));

	return [x,y,z];
}

/**
 * Create a line mesh.
 * @param {Color} color     The hex value of the wanted color
 * @param {Float} a         Starting point of the line
 * @param {Float} b         Ending point of the line
 * @return {Mesh}           The mesh created
 */
function generateLine(color, a, b){

	var material = new THREE.LineBasicMaterial({color : color});
	var geometry = new THREE.Geometry();
	geometry.vertices.push(a);
	geometry.vertices.push(b);
	var line = new THREE.Line(geometry, material);

	return line;
}

/**
 * Create a sphere mesh.
 * @param {Color} color     The hex value of the wanted color
 * @param {Float} radius    The radius of the sphere
 * @return {Mesh}           The mesh created
 */
function generateSphere(color, radius){

    var geometry = new THREE.SphereGeometry(radius, 32, 32, 0, 3.1,0 , 3.1);
    var material = new THREE.MeshPhongMaterial({color});
    var sphere = new THREE.Mesh(geometry,material);

    return sphere;
}

/**
 * Create a regular octagon mesh.
 * @param {Color} color         The hex value of the wanted color
 * @param {Float} segmentLength The length of the sides
 * @return {Mesh}               The mesh created
 */
function generateOctagon(color, segmentLength){

    // Calculate the diameter of the octagon and it's radius
    var diameter = (1+Math.sqrt(2))*segmentLength;
    var radius = diameter/2;
    var geom = new THREE.Geometry();

    // Push all 8 vertices
    geom.vertices.push(new THREE.Vector3(segmentLength/2, radius, 0));
    geom.vertices.push(new THREE.Vector3(radius, segmentLength/2, 0));
    geom.vertices.push(new THREE.Vector3(radius, -segmentLength/2, 0));
    geom.vertices.push(new THREE.Vector3(segmentLength/2, -radius, 0));
    geom.vertices.push(new THREE.Vector3(-segmentLength/2, -radius, 0));
    geom.vertices.push(new THREE.Vector3(-radius, -segmentLength/2, 0));
    geom.vertices.push(new THREE.Vector3(-radius, segmentLength/2, 0));
    geom.vertices.push(new THREE.Vector3(-segmentLength/2, radius, 0));

    geom.faces.push(new THREE.Face3(0, 2, 1));
    geom.faces.push(new THREE.Face3(0, 3, 2));
    geom.faces.push(new THREE.Face3(0, 4, 3));
    geom.faces.push(new THREE.Face3(0, 5, 4));
    geom.faces.push(new THREE.Face3(0, 6, 5));
    geom.faces.push(new THREE.Face3(0, 7, 6));

    geom.computeFaceNormals();
    geom.computeVertexNormals();

    var material = new THREE.MeshPhongMaterial({color});    
    var octagon = new THREE.Mesh(geom, material);

    octagon.rotateX(-Math.PI/2);

    return octagon;
}

/**
 * Create a U shaped mesh.
 * @param {Color} color         The hex value of the wanted color
 * @param {Float} wallHeight    The y parameter
 * @param {Float} size          The scaling factor
 * @return {Mesh}               The mesh created
 */
function generateUShapedFigure(color, wallHeight, size){

    var botBox = generateBox(color, 8, wallHeight, 1);
    botBox.position.z += 4;
    var middleBox = generateBox(color, 2, wallHeight, 7);
    middleBox.position.x -= 3;
    var topBox = generateBox(color, 12, wallHeight, 2);
    topBox.position.x +=2;
    topBox.position.z -=4;

    var uShapedFigure = new THREE.Group();
    uShapedFigure.add(botBox);
    uShapedFigure.add(middleBox);
    uShapedFigure.add(topBox);
    uShapedFigure.position.y += wallHeight/2;
    uShapedFigure.scale.set(size,1,size);

    return uShapedFigure;
}

/**
 * Create a cylindric mesh.
 * @param {Color} color         The hex value of the wanted color
 * @param {Float} height        The y parameter
 * @param {Float} botRadius     The radius at the bottom of the cylinder
 * @param {Float} topRadius     The radius at the top of the cylinder
 * @return {Mesh}               The mesh created
 */
function generateCylinder(color, height, botRadius, topRadius){

    var geometry = new THREE.CylinderGeometry(topRadius, botRadius, height, 32);
    var material = new THREE.MeshLambertMaterial({color});
    var cylinder = new THREE.Mesh(geometry, material);

    return cylinder;
}

/**
 * Create a track composed of multiple box mesh.
 * @param {Color} color     The hex value of the wanted color
 * @return {THREE.Group}    The group containing all the parts of the track
 */
function generateTrack(color, points){
    
    // If less than two points are given throw an error message as no track can be built with only one point
    if (points.length < 2){
        throw {name : "MissingArgumentsError", message : "not enough points to create a track"}; 
    }
    
    var track = new THREE.Group();

    // Loop through the points array and create a box between every tow following points
    for (let i = 0; i < points.length-1; i++) {

        // Calculate a Vector3 between the two points
        var trackWidth = new THREE.Vector3().copy(points[i+1]).sub(points[i]);
        // Create the mesh with the calculated width from the Vector3
        var line = generateBox(color, trackWidth.length(), TrackHeight, TrackDepth);
        // Position the center of the object to first point + half of the distance between the points (for x and z)
        line.position.x = points[i].x + trackWidth.x/2;
        line.position.z = points[i].z + trackWidth.z/2;
        // Align mesh to calculated Vector3
        line.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), trackWidth.clone().normalize());
        track.add(line);       
    }

    track.position.y += TrackHeight/2;

    return track;
}

/**
 * Create an array with coordinates
 * @return {Vector3[]}          The array filled with Vector3 coordinate of the points
 */
function createPoints(){
    
    var points = new Array(new THREE.Vector3(0,0,0));
    points.push(new THREE.Vector3(5,0,0));
    points.push(new THREE.Vector3(10,0,0));
    points.push(new THREE.Vector3(25,0,0));
    points.push(new THREE.Vector3(35,0,10));
    points.push(new THREE.Vector3(35,0,30));

    return points;
}

export{ generateBox, generatePlane, generateAxes, 
        generateLine, generateSphere, generateOctagon, 
        generateUShapedFigure, generateCylinder, generateTrack, 
        createPoints };