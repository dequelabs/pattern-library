'use strict';

import init from './init';

const debug = require('debug')('dqpl:composites:menu');

function findTopBar() {
  const topBar = document.querySelector('.dqpl-top-bar');
  if (topBar) { // TODO: Don't make top bar required?
    return init(topBar);
  }
  // no top bar present...wait for dqpl:ready before trying again
  document.addEventListener('dqpl:ready', onReadyFire);
}

function onReadyFire() {
  debug('dqpl:ready fired - querying DOM for top bar.');
  document.removeEventListener('dqpl:ready', onReadyFire);
  findTopBar(); // try again
}

module.exports = findTopBar;
