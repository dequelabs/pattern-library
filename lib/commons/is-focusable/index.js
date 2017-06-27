'use strict';

import matches from 'dom-matches';
import SELECTOR from './selector';

/**
 * Checks if element is naturally focusable
 * @param  {HTMLElement} el the element in question
 * @return {Boolean}
 */
module.exports = (el) => matches(el, SELECTOR);
