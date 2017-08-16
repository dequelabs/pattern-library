'use strict';

import delegate from 'delegate';
import open from '../../commons/dialog/open';
import close from '../../commons/dialog/close';
import closest from 'closest';
import sizer from '../../commons/dialog/sizer';
import selector from '../../commons/dialog/selector';
import { show, hide } from '../../commons/dialog/aria';

const debug = require('debug')('dqpl:composites:alert');

module.exports = () => {
  /**
   * Handle clicks on triggers
   */

  delegate(document.body, '[data-dialog-id]', 'click', (e) => {
    const trigger = e.delegateTarget;
    const elID = trigger.getAttribute('data-dialog-id');
    const el = document.getElementById(elID);
    const container = el.querySelector('.dqpl-dialog-inner');
    const h2 = el.querySelector('.dqpl-modal-header h2');

    debug('modal heading: ', h2);

    if (!alert) {
      return debug('No alert found with id: ', elID);
    }

    const focusEl = h2 || container;
    open(trigger, el, focusEl);
    window.addEventListener('resize', onWindowResize);
  });

  /**
   * Handle clicks on cancel/close buttons
   */

  delegate(document.body, '.dqpl-close, .dqpl-cancel', 'click', (e) => {
    const button = e.delegateTarget;
    const modal = closest(button, '.dqpl-modal, .dqpl-alert');
    close(modal);
    window.removeEventListener('resize', onWindowResize);
  });

  function onWindowResize() {
    sizer(document.querySelector('.dqpl-dialog-show'));
  }

  /**
   * Open up custom events to call aria hide/show on a dialog
   *
   * example call:
   * ```
   * const e = new CustomEvent('dqpl:dialog:aria-hide', {
   *  bubbles: true, // IMPORTANT
   *  cancelable: false // IMPORTANT
   * });
   *
   * dialog.dispatchEvent(e);
   * ```
   */

  delegate(document.body, selector, 'dqpl:dialog:aria-hide', (e) => {
    hide(e.delegateTarget);
  });

  delegate(document.body, selector, 'dqpl:dialog:aria-show', (e) => {
    show(e.delegateTarget);
  });
};
