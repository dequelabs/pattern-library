'use strict';

/**
 * DQPL Tabs
 * TODO: This should become a proper component eventually
 */

import events from './events';
import attrs from './attributes';

const debug = require('debug')('dqpl:components:tabs');

module.exports = () => {
  events();
  attrs();

  document.addEventListener('dqpl:ready', () => {
    debug('dqpl:ready heard - reassessing tab attributes');
    attrs();
  });
};
