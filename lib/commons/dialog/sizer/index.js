'use strict';

/**
 * Adjusts the height of the dialog content based on window's height
 * @param  {HTMLElement} el the dialog element
 */
module.exports = (el) => {
  if (el && el.getAttribute('data-no-resize') === 'true') {
    return;
  }

  const content = el && el.querySelector('.dqpl-content');

  if (content) {
    content.style.maxHeight = `${window.innerHeight - 205}px`;
  }
};
