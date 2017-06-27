'use strict';

import setup from './setup';

module.exports = () => {
  document.addEventListener('dqpl:ready', setup);
  setup();
};
