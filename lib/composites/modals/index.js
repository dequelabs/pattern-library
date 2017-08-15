'use strict';

import delegate from 'delegate';
import closest from 'closest';
import close from '../../commons/dialog/close';
import trapFocus from '../../commons/dialog/trap-focus';
import queryAll from '../../commons/query-all';
import focusableSelector from '../../commons/is-focusable/selector';

module.exports = () => {
  /**
   * Keydowns on modals
   * - trap focus
   * - escape => close
   */
  trapFocus('.dqpl-modal');
  delegate(document.body, '.dqpl-modal', 'keydown', (e) => {
    const modal = e.delegateTarget;
    const which = e.which;

    if (which === 27 && modal.getAttribute('data-force-action') !== 'true') {
      close(modal);
    }
  });

  delegate(document.body, '.dqpl-modal-header h2', 'keydown', (e) => {
    if (e.which === 9 && e.shiftKey) {
      e.preventDefault();
      const modal = closest(e.delegateTarget, '.dqpl-modal');
      const focusables = queryAll(focusableSelector, modal);

      if (focusables.length) {
        focusables[focusables.length - 1].focus();
      }
    }
  });
};
