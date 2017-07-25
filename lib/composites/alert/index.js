'use strict';

import trapFocus from '../../commons/dialog/trap-focus';
import delegate from 'delegate';
import closest from 'closest';
import queryAll from '../../commons/query-all';
import focusableSelector from '../../commons/is-focusable/selector';

module.exports = () => {
  /**
   * Keydowns on alerts - trap focus
   */
  trapFocus('.dqpl-alert');

  /**
   * Prevents shift + tab from leaving alert
   */
  delegate(document.body, '.dqpl-alert .dqpl-dialog-inner', 'keydown', (e) => {
   if (e.which === 9 && e.shiftKey) {
     e.preventDefault();
     const alert = closest(e.delegateTarget, '.dqpl-alert');
     const focusables = queryAll(focusableSelector, alert);

     if (focusables.length) {
       focusables[focusables.length - 1].focus();
     }
   }
  });
};
