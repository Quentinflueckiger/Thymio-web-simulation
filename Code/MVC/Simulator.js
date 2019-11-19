/**
 * @author  Quentinflueckiger   /   https://github.com/Quentinflueckiger
 */

import EnvironmentController from './js/controller/EnvironmentController.js';
import Environment from './js/model/Environment.js';

// Creates the environment and its controller
const environment = new Environment('Base environment');
const environmentController = new EnvironmentController(environment);

// Register the playground loaded as default
environmentController.loadPlayground("Baseplayground");
