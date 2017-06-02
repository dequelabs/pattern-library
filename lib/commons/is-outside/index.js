'use strict';

const matches = require('dom-matches');
const closest = require('closest');

/**
 * Check if the target is outside of selector
 * @param  {HTMLElement} target   the element in question
 * @param  {String} selector the selector in question
 * @return {Boolean}
 */
module.exports = (target, selector) => {
  return !matches(target, selector) && !closest(target, selector);
};
