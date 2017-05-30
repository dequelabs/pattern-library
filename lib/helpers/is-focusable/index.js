'use strict';

const matches = require('dom-matches');
const SELECTOR = require('./selector');

module.exports = (el) => {
  return matches(SELECTOR);
};
