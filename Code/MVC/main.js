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
import APIClient from './js/APIClient.js';

const environment = new Environment('Base environment');
const environmentController = new EnvironmentController(environment);

environmentController.createPlayground("Baseplayground");

/*
const playground = new Playground("Base Playground");
environment.addPlayground(playground);

// Data for base playground, will be moved in an other file as APIClients later on


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

//environment.removePlayground(playground);*/