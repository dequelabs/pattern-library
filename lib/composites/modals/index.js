'use strict';

import delegate from 'delegate';
import closest from 'closest';
import open from '../../commons/open';
import close from '../../commons/close';
import sizer from '../../commons/sizer';
import queryAll from '../../commons/query-all';
import focusableSelector from '../../commons/is-focusable/selector';
import trapFocus from '../../commons/trap-focus';

const debug = require('debug')('dqpl:composites:modals');

module.exports = () => {
  /**
   * Handle clicks on triggers
   */

  delegate(document.body, '[data-id]', 'click', (e) => {
    const trigger = e.delegateTarget;
    const modalID = trigger.getAttribute('data-id');
    const modal = document.getElementById(modalID);

    if (!modal) {
      return debug('No modal found with id: ', modalID);
    }

    open(trigger, modal);
    window.addEventListener('resize', onWindowResize);
  });

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

  delegate(document.body, '.dqpl-header h2', 'keydown', (e) => {
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
    sizer(document.querySelector('.dqpl-show'));
  }
};
