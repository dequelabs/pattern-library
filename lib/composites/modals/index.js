'use strict';

import delegate from 'delegate';
import closest from 'closest';
import close from '../../commons/dialog/close';
import sizer from '../../commons/dialog/sizer';
import trapFocus from '../../commons/dialog/trap-focus';
import queryAll from '../../commons/query-all';
import focusableSelector from '../../commons/is-focusable/selector';

module.exports = () => {
  /**
   * Handle closing / canceling
   */

  delegate(document.body, '.dqpl-close, .dqpl-cancel', 'click', (e) => {
    const button = e.delegateTarget;
    const modal = closest(button, '.dqpl-modal');
    close(modal);
    window.removeEventListener('resize', onWindowResize);
  });

  /**
   * Keydowns on modals
   * - trap focus
   * - escape => close
   */
  trapFocus('.dqpl-modal');
  delegate(document.body, '.dqpl-modal', 'keydown', (e) => {
    const modal = e.delegateTarget;
    const which = e.which;

    if (which === 27) {
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

  function onWindowResize() {
    sizer(document.querySelector('.dqpl-dialog-show'));
  }
};
