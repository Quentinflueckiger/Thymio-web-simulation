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


## 15.10.2019

### Morning

Talk with Mr. Furher about :
1. Webserver (have to be able to access it online of course) (Linux -> Apache, XAMP)
2. Which element the user should be able to add to a playground (Track, boxes, cylinder)
3. Problem of environment while developing a program using Thymio studio, only able to start coding if either of those two condition is met : -Real Thymio plugged in, -Virtual Thymio plugged in.

First try at the algorithm to create the tracks. Using Lines wasn't a good idea as they are too thin.

    var line = generateLine(color, points[i], points[i+1]);

### Afternoon

Second test for the algorithm to create a track. This work just fine for now, the method takes a hex color and an array of points as parameters.

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

Trying to resolve issue with shadow on the main plane for both playground, still not working properly. 

## 17.10.2019

Worked on documentation, VPL part.

## 18.10.2019

Finished VPL part of dumentation.

Tried to fix an issue with the sadow that occurs in both playgrounds, the shadow on the main plane isn't rendered. But for now it still is an open issue.
Added a picker on the scene in order to select the playground.

## 22.10.2019

### Morning

Fixed webserver, now accessible from within bfh network. Finished picker, it now loads the correct playground when submited.


    var pgPicker = document.getElementById("pgPicker");
    var playground = PG.generatePlayGround(pgPicker.options[pgPicker.selectedIndex].value);
    if(playground != null){

        changePlayGround(playground);
    }


### Afternoon

Looking for compiler/interpretor file from aseba.

|   | Status  | Usefull file(s)  | Location  | Description  |
|---|---|---|---|---|
| aseba/aseba/clients  | done  | yes  | /studio/*, /massloader/massloader.cpp  | aesleditor and vpl blocks, file loader  |
| aseba/aseba/common  | done  | no  | -  | -  |
| aseba/aseba/compiler  | done  | yes  | *  | Compiler/Lexer/Parser  |
| aseba/aseba/switches  | done  | no  | -  | -  |
| aseba/aseba/targets  | done  | yes  | /playground/*, /challenge/challenge.cpp, /can-translator/morse.c  | playground simulator and thymio description, view of thymio variables (maybe too old), morse code for hexadecimal  |
| aseba/aseba/transport  | done  | yes  | /buffer/vm-buffer.c  | ProcessIncEvent  |
| aseba/aseba/vm    | done  | yes  | /vm.c   | SetupEvent, EventAddress |

Decided to use a state machine to record and handle the aseba event system.

Finished track for obstaclePlayground.


## 23.10.2019

### Morning

Changed the function to create tracks to a class so later on we can use it and it's properties for the playground creator. Read about physics and three.js, will probably use https://github.com/chandlerprall/Physijs/wiki/Basic-Setup for collision and other physics related issues. Looked for javascript/three.js mvc example.

### Afternoon

Created a branch on git to hold the mvc development while it isn't stable. First test to convert the program to mvc using some parts of https://github.com/lucasmajerowicz/threejs-mvc-example and https://www.taniarascia.com/javascript-mvc-todo-app/ .
Decided to delete what I had done and take the project of lucas majerowicz and enhance/modify with our needs. Deleted parts that would not be used and changed from trackball to orbitcontrols.
Created the first draft for the favicon.

## 24.10.2019

### Afternoon



## 25.10.2019

### Morning

Continue to convert old code to the mvc.

### Afternoon

Some issues with the attribution of points to the track, this is the old way. We now add them as properties at start. But it isn't suitable for dynamic creation of track. There was a algorithm error as well in TrackViewMediator, using a vector instead of a value for width, so it might be possible to use the following code.

    import Shape from "./Shape.js";

    export default class Point extends Shape {
        constructor(name, properties) {
            super(name, properties);
            this.className = 'Point';
            this.debugArray = [];
        }

        [Symbol.iterator]() {
            return this.debugArray.values();
        }
    }
-----
    import ViewMediator from "./ViewMediator.js";

    export default class PointViewMediator extends ViewMediator {
        constructor(point, mediatorFactory) {
            super(point, mediatorFactory);
        }

        makeObject3D() {
            const container = new THREE.Object3D();
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshPhongMaterial( { color : "#fc031c"} )

            )

            container.add(mesh);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            return container;
        }
    }

Finished to add every shape needed to the mvc, and added as well the thymio.

## 01.11.2019

### Morning

Merged MVC into master as it is stable, and pulled it on the server. Added only the MVC folder to the webserver, probleme with javascript files, net::ERR_ABORTED 404 (Not Found), error for three.js and orbitcontrols.js (at least those two). Resolved the problem of three.js by adding an user to the IIS manager, IIS_IUSRS and gave him basic permission. But orbitcontrols is still not working. Loaders don't work either.