'use strict';

const queryAll = require('../../helpers/query-all');

/**
 * Aria-hides everything except the
 * modal and direct parents of it
 */
exports.hide = (modal) => {
  let parent = modal.parentNode;

  while (parent && parent.nodeName !== 'HTML') {
    Array.prototype.slice.call(parent.children).forEach(childHandler);
    parent = parent.parentNode;
  }

  function childHandler(child) {
    if (child !== modal && !child.contains(modal)) {
      setHidden(child);
    }
  }

  /**
   * Sets aria-hidden="true" and sets data
   * attribute if it was originally hidden
   */
  function setHidden(el) {
    if (el.getAttribute('aria-hidden') === 'true') {
      el.setAttribute('data-already-aria-hidden', 'true');
    }

    el.setAttribute('aria-hidden', 'true');
  }
};

exports.show = () => {
  queryAll('[aria-hidden="true"]').forEach((el) => {
    if (el.getAttribute('data-already-aria-hidden') !== 'true') {
      el.removeAttribute('aria-hidden');
    }
  });
};
