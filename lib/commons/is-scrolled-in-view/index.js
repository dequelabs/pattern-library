'use strict';

/**
 * Tests if element is scrolled into view
 * @param  {HTMLElement} container the scrollable parent of element in question
 * @param  {HTMLElement} element   the element in question
 * @return {Boolean}
 */
module.exports = (container, element) => {
  // TODO: Test that this works
  const elTop = element.offsetTop;
  const elHeight = element.offsetHeight;
  const parentHeight = container.offsetHeight;
  return ((elTop + elHeight) > 0) && (elTop < parentHeight);
};
