'use strict';

import matches from 'dom-matches';
import closest from 'closest';

/**
 * Check if the target is outside of selector
 * @param  {HTMLElement} target   the element in question
 * @param  {String} selector the selector in question
 * @return {Boolean}
 */

// TODO: closest has a third param - checkSelf...that could replace this
module.exports = (target, selector) => !matches(target, selector) && !closest(target, selector);
