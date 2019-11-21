/**
 * @author  Quentinflueckiger   /   https://github.com/Quentinflueckiger
 */

import EnvironmentController from './js/controller/EnvironmentController.js';
import Environment from './js/model/Environment.js';
import Thymio from './js/model/Thymio.js';

// Creates the environment and its controller
const environment = new Environment('Base environment');
const thymio = new Thymio("Thymio", {});
const environmentController = new EnvironmentController(environment, thymio);

// Register the playground loaded as default
environment.addThymio(thymio);
environmentController.loadPlayground("Baseplayground");
