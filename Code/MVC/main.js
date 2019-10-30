import * as ColorPalette from './js/ColorPalette.js';
import EnvironmentController from './js/controller/EnvironmentController.js';
import Environment from './js/model/Environment.js';
import Playground from './js/model/Playground.js';
import Box from './js/model/Box.js';
import Plane from './js/model/Plane.js';
import Octagon from './js/model/Octagon.js';
import UShapeFigure from './js/model/UShapedFigure.js';
import Cylinder from './js/model/Cylinder.js';
import Track from './js/model/Track.js';
import Thymio from './js/model/Thymio.js';

//const galaxy = new Galaxy('Milky Way');
const environment = new Environment('Base environment');
const environmentController = new EnvironmentController(environment);

const playground = new Playground("Base Playground");
environment.addPlayground(playground);

// Data for base playground, will be moved in an other file as APIClients later on
const WallHeight = 6;
const WallDepth = 1;
const Width = 50;
const Length = 50;

var wallNProps = {
    width : WallDepth,
    height : WallHeight,
    depth : Width + WallDepth,
    color : ColorPalette.Grey,
    positionX : -Width/2,
    positionZ : 0
}
var wallN = new Box("N Wall", wallNProps);

var wallEProps = {
    width : Width + WallDepth,
    height : WallHeight,
    depth : WallDepth,
    color : ColorPalette.Grey,
    positionX : 0,
    positionZ : -Width/2
}
var wallE = new Box("E Wall", wallEProps);

var wallSProps = {
    width : WallDepth,
    height : WallHeight,
    depth : Width + WallDepth,
    color : ColorPalette.Grey,
    positionX : Width/2,
    positionZ : 0
}
var wallS = new Box("S Wall", wallSProps);

var wallWProps = {
    width : Width + WallDepth,
    height : WallHeight,
    depth : WallDepth,
    color : ColorPalette.Grey,
    positionX : 0,
    positionZ : Width/2
}
var wallW = new Box("W Wall", wallWProps);

playground.addShape(wallN);
playground.addShape(wallE);
playground.addShape(wallS);
playground.addShape(wallW);

var planeProps = {
    width :  Width,
    height : Length,
    color : ColorPalette.LightGrey
}
var plane = new Plane("Bottom Plane", planeProps);
playground.addShape(plane);

var octagonProps = {
    color : ColorPalette.LightGrey,
    segmentLength : 50
}
var octagon = new Octagon("Octagon Plane", octagonProps);

var ushapeProps = {
    height : WallHeight,
    size : 3,
    color : ColorPalette.Grey
}
var uShape = new UShapeFigure("UShaped Figure", ushapeProps);

var cylinderProps = {
    topRadius : 2,
    botRadius : 2,
    height : WallHeight,
    color : ColorPalette.Grey,
    positionX : 10,
    positionZ : 0
}
var cylinder = new Cylinder("Cylinder", cylinderProps);

var trackProps = {
    color : ColorPalette.Grey,
    points: [
        {
            positionX : 0,
            positionZ : 0
        },
        {
            positionX : 25,
            positionZ : 0
        },
        {
            positionX : 35,
            positionZ : 10
        },
        {
            positionX : 35,
            positionZ : 35
        }

    ]
}
var track = new Track("Track", trackProps);

var thymioProps = {
}
var thymio = new Thymio("Thymio", thymioProps);

playground.addShape(thymio);
//environment.removePlayground(playground);