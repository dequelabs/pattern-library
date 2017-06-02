'use strict';

// TODO: Test that this works
module.exports = (container, element) => {
  const elTop = element.offsetTop;
  const elHeight = element.offsetHeight;
  const parentHeight = container.offsetHeight;
  return ((elTop + elHeight) > 0) && (elTop < parentHeight);
};
