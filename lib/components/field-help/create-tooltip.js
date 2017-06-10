'use strict';

const Classlist = require('classlist');

/**
 * Creates the dqpl tooltip element
 */
module.exports = (text) => {
  const tip = document.createElement('div');

  tip.setAttribute('role', 'tooltip');
  tip.innerHTML = text;
  Classlist(tip).add('dqpl-tooltip');

  return tip;
};
