# Logbook

## 08.10.2019

### Morning

Imported 3D model of Thymio robot and added it to the scene (scaled and rotated), lots of problems with modules and such.

### Afternoon

Corrected spelling errors in the documentation.
Creation of the logbook and the configuration markdown files.
Set up the Windows Virtual Machine with a webserver. Created a gmail and a github account for the webserver side. Set up the local web server with Internet Information Service (IIS) Manager, which is an inbuilt software of windows 10 and allows the user to easily host webserver. The step by step instruction of https://mywindowshub.com/how-to-install-and-setup-a-website-in-iis-on-windows-10/ was lacking a crucial information, that is the configuration of the hosts file used by TCP/IP at the location C:\Windows\System32\drivers\etc. Afterwards the website was booting and showing the wanted scene with one issue. The model was not loaded properly.
> Failed to load resource: the server responded with a status of 404 (Not Found) :85/Models/Thymio_3d_Model/obj.mtl:1

## 10.10.2019

### Afternoon

Created the first architecture proposal document using draw.io and exporting it as .svg. And looked for some advice on MVC approach to create Three.js application, as it is the architectural patterns chosen for the software. In addition a Pipe-Filter pattern might be used for the language interpretation part.
Completed meeting section of the documentation.


## 14.10.2019

### Morning

Refactoring of Geometricalmeshes that is now used as an external module for every geometrical mesh creation. First try at threejs overlay, creating a text and a button and putting it on top of the scene via the CSS.

### Afternoon

Moved playground creation code into Playgrounds.js, added a second playground with columns and a U-shape in the middle. With the button added this morning we have the ability to switch between the two playgrounds. Only the actual playground gets recomputed each time, we are not reloading the Thymio model.
Had a problem creating the Octagonal plane at start. The math weren't good.
Not the right math to create a regular octagon.
function generateOctagon(color, segmentLength){

    var b = segmentLength * 2.5;
    var geom = new THREE.Geometry();

    geom.vertices.push(new THREE.Vector3(segmentLength, b, 0));
Has been corrected with :
function generateOctagon(color, segmentLength){

    var diameter = (1+Math.sqrt(2)) x segmentLength;
    var radius = diameter/2;
    var geom = new THREE.Geometry();

    geom.vertices.push(new THREE.Vector3(segmentLength/2, radius, 0));
