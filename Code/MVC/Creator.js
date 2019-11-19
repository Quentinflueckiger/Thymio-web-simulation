/**
 * @author  Quentinflueckiger   /   https://github.com/Quentinflueckiger
 */

import CreatorController from './js/controller/CreatorController.js';
import Environment from './js/model/Environment.js';

// Creates the environment and its controller
const environment = new Environment('Empty environment');
const environmentController = new CreatorController(environment);

// Register the playground loaded as default
environmentController.loadPlayground("obstaclePlayground");
