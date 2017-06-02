'use strict';

/**
 * A querySelectorAll that returns a
 * normal array rather than live node list
 * @param  {String} selector
 * @param  {HTMLElement} context
 * @return {Array}
 */

module.exports = (selector, context) => {
  context = context || document;
  return Array.prototype.slice.call(
    context.querySelectorAll(selector)
  );
};
