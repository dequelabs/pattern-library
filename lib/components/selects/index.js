'use strict';

import init from './init';

module.exports = () => {
  document.addEventListener('dqpl:ready', init);
  init();
};
