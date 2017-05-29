'use strict';

const setup = require('./setup');
const debug = require('debug')('dqpl:components:field-help');

module.exports = () => {
  document.addEventListener('dqpl:ready', () => {
    debug('dqpl:ready heard - reassessing field help');
    setup();
  });

  setup();
};
