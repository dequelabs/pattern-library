'use strict';

const debug = require('debug')('dqpl:components:checkboxes');
const attrs = require('./attributes');
const events = require('./events');

module.exports = () => {
  attrs();
  events();

  document.addEventListener('dqpl:ready', () => {
    debug('dqpl:ready heard - reassessing checkbox attributes');
    attrs();
  });
};
