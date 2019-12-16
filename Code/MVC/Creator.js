/**
 * @author  Quentinflueckiger   /   https://github.com/Quentinflueckiger
 */

import CreatorController from './js/controller/CreatorController.js';
import Environment from './js/model/Environment.js';
import Thymio from './js/model/Thymio.js';

// Creates the environment and its controller
const environment = new Environment('Empty environment');
const thymio = new Thymio("Thymio", {});
const environmentController = new CreatorController(environment, thymio);

// Register the playground loaded as default
environment.addThymio(thymio);
environmentController.loadPlayground("Baseplayground");
