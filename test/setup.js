/* setup.js - runs before mocha tests */
import chai from 'chai';

// Setup globals / chai
global.__DEV__ = true;
global.expect = chai.expect;
// global.Config = require('../../config')
global.Colors = require('../../colors/colors')