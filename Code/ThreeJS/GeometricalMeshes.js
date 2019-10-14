// Hex value of four base colors.
const Blue = "#0324ff";     
const Red = "#fc031c";
const Grey = "#e5e5e5";
const Green = "#11ff00";

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
                
    plane.rotateX(1.57);

    return plane;
}

/**
 * Create a XYZ axis system.
 * @returns {Mesh[]}        An array filled with the three meshes of the corresponding axe. 
 */
function generateAxes(){

	var x = generateLine(Red, new THREE.Vector3(-25,0,0),new THREE.Vector3(25,0,0));
	var y = generateLine(Green,new THREE.Vector3(0,-25,0),new THREE.Vector3(0,25,0));
	var z = generateLine(Blue,new THREE.Vector3(0,0,-25),new THREE.Vector3(0,0,25));

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

export{generateBox, generatePlane, generateAxes, generateLine, generateSphere};