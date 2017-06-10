'use strict';

const matches = require('dom-matches');
const SELECTOR = require('./selector');

/**
 * Checks if element is naturally focusable
 * @param  {HTMLElement} el the element in question
 * @return {Boolean}
 */
module.exports = (el) => matches(el, SELECTOR);
