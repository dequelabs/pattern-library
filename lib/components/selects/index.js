'use strict';

const init = require('./init');

module.exports = () => {
  document.addEventListener('dqpl:ready', init);
  init();
};
