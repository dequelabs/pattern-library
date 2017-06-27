'use strict';

import attrs from './attributes';
import events from './events';

const debug = require('debug')('dqpl:components:checkboxes');

module.exports = () => {
  attrs();
  events();

  document.addEventListener('dqpl:ready', () => {
    debug('dqpl:ready heard - reassessing checkbox attributes');
    attrs();
  });
};
