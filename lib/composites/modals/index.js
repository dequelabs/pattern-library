'use strict';

import delegate from 'delegate';
import close from '../../commons/dialog/close';
import trapFocus from '../../commons/dialog/trap-focus';

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
};
