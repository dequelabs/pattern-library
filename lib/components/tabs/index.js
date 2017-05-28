'use strict';

/**
 * DQPL Tabs
 * TODO: This should become a proper component
 */

const debug = require('debug')('dqpl:components:tabs');

module.exports = class Tabs {
  constructor() {
    debug('HELLLLOOOOO');
    require('./events')();
    require('./attributes')();
  }
};
