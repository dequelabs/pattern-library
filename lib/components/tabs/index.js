'use strict';

/**
 * DQPL Tabs
 * TODO: This should become a proper component
 */

const debug = require('debug')('dqpl:components:tabs');
const events = require('./events');
const attrs = require('./attributes');

module.exports = () => {
  events();
  attrs();
  
  document.addEventListener('dqpl:ready', () => {
    debug('dqpl:ready heard - reassessing tab attributes');
    attrs();
  });
};
