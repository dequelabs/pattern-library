'use strict';

const debug = require('debug')('dqpl:components:checkboxes');
const attrs = require('./attributes');

module.exports = () => {
  attrs();
  require('./events')();

  document.addEventListener('dqpl:ready', () => {
    debug('dqpl:ready heard - reassessing checkbox attributes');
    attrs();
  });
};
