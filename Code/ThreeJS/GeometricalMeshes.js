/**
*   Creates a box mesh.
*   @param {Color} color    The hex value of the wanted color
*   @param {Float} width    The x value
*   @param {Float} length   The y value
*   @param {Float} depth    The z value
*   @return {Mesh}          The mesh created
*/
function generateBox(color, width, length, depth){

    var geometry = new THREE.BoxGeometry( width, length, depth );
    var material = new THREE.MeshPhongMaterial( { color : color} );
    var box = new THREE.Mesh( geometry, material );
                
    return box;
}

function generatePlane(color, width, height){

    var geometry = new THREE.PlaneGeometry( width, height, 32 );
    var material = new THREE.MeshPhongMaterial( {color: color, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
                
    plane.rotateX(1.57);

    return plane;
}

function generateAxes(){

	var x = generateLine(Red, new THREE.Vector3(-25,0,0),new THREE.Vector3(25,0,0));
	var y = generateLine(Green,new THREE.Vector3(0,-25,0),new THREE.Vector3(0,25,0));
	var z = generateLine(Blue,new THREE.Vector3(0,0,-25),new THREE.Vector3(0,0,25));

	return [x,y,z];
}

function generateLine(color, a, b){

	var material = new THREE.LineBasicMaterial({color : color});
	var geometry = new THREE.Geometry();
	geometry.vertices.push(a);
	geometry.vertices.push(b);
	var line = new THREE.Line(geometry, material);

	return line;
}

function generateSphere(color, radius){

    var geometry = new THREE.SphereGeometry(radius, 32, 32, 0, 3.1,0 , 3.1);
    var material = new THREE.MeshPhongMaterial({color});
    var sphere = new THREE.Mesh(geometry,material);
    return sphere;
}

function generateThymioMesh(){

    var body = generateBox(ThymioColor, 2, 1, 2);
    var head = generateSphere(ThymioColor, 1);
    head.position.z = 1 ;
    head.scale.y -= 0.5;
    var thymio = new THREE.Group();
    thymio.add(body);
    thymio.add(head);

    thymio.position.set(0, 0.5, 0);
    thymio.rotateY(1.57);

    thymio.castShadow = true;

    return thymio;
}