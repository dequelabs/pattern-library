'use strict';

import delegate from 'delegate';
import focusableSelector from '../../is-focusable/selector';
import isVisible from '../../is-visible';
import queryAll from '../../query-all';

/**
 * Force keeping focus inside given element.
 *
 */
module.exports = (selector) => {
  delegate(document.body, selector, 'keydown', (e) => {
    if (e.which !== 9) { return; }

    const target = e.target;
    const container = e.delegateTarget;
    const focusables = queryAll(focusableSelector, container).filter((el) => {
      return isVisible(el);
    });

    if (!focusables.length) { return; }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && target === first) { // first to last
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && target === last) {
      e.preventDefault();
      first.focus();
    }
  });
};
