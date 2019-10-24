import EnvironmentController from './js/controller/GalaxyController.js';
import Environment from './js/model/Environment.js';
import Playground from './js/model/Playground.js';
import Box from './js/model/Box.js';
import Plane from './js/model/Plane.js';
import * as ColorPalette from './js/ColorPalette.js';

//const galaxy = new Galaxy('Milky Way');
const environment = new Environment('Base environment');
const environmentController = new EnvironmentController(environment);

const playground = new Playground("Base Playground");
environment.addPlayground(playground);

var box1Props = {
    width : 1,
    height : 1,
    depth : 1,
    color : '#11ff00',
    position : 10
}
var box1 = new Box("Test Box", box1Props);

var box2Props = {
    width : 1,
    height : 1,
    depth : 1,
    color : '#11ff00',
    position : -10
}
var box2 = new Box("Test Box", box2Props);

playground.addShape(box1);
playground.addShape(box2);

var planeProps = {
    width :  50,
    height : 50,
    color : ColorPalette.GroundColor
}
var plane = new Plane("Bottom Plane", planeProps);
playground.addShape(plane);