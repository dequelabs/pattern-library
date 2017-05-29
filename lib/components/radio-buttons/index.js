'use strict';

const setup = require('./setup');

module.exports = () => {
  document.addEventListener('dqpl:ready', setup);
  setup();
};
