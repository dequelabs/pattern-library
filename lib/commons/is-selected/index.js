'use strict';

const Cl = require('classlist');

module.exports = (el) => {
  return Cl(el).contains('dqpl-selected') || el.getAttribute('aria-checked') === 'true';
};
