'use strict';

import queryAll from '../query-all';

/**
 * Aria-hides everything except the
 * given element and direct parents of it
 */
exports.hide = (el) => {
  let parent = el.parentNode;

  while (parent && parent.nodeName !== 'HTML') {
    Array.prototype.slice.call(parent.children).forEach(childHandler);
    parent = parent.parentNode;
  }

  function childHandler(child) {
    if (child !== el && !child.contains(el)) {
      setHidden(child);
    }
  }

  /**
   * Sets aria-hidden="true" and sets data
   * attribute if it was originally hidden
   */
  function setHidden(child) {
    if (child.getAttribute('aria-hidden') === 'true') {
      child.setAttribute('data-already-aria-hidden', 'true');
    }

    child.setAttribute('aria-hidden', 'true');
  }
};

exports.show = () => {
  queryAll('[aria-hidden="true"]').forEach((el) => {
    if (el.getAttribute('data-already-aria-hidden') !== 'true') {
      el.removeAttribute('aria-hidden');
    }
  });
};
