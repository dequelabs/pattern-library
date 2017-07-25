'use strict';

import delegate from 'delegate';
import open from '../../commons/dialog/open';
import close from '../../commons/dialog/close';
import closest from 'closest';
import sizer from '../../commons/dialog/sizer';

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
    const h2 = el.querySelector('.dqpl-modal h2');

    if (!alert) {
      return debug('No alert found with id: ', elID);
    }

    const focusEl = h2 || container;
    open(trigger, el, focusEl);
    window.addEventListener('resize', onWindowResize);
  });

  delegate(document.body, '.dqpl-close, .dqpl-cancel', 'click', (e) => {
    const button = e.delegateTarget;
    const modal = closest(button, '.dqpl-modal, .dqpl-alert');
    close(modal);
    window.removeEventListener('resize', onWindowResize);
  });

  function onWindowResize() {
    sizer(document.querySelector('.dqpl-dialog-show'));
  }

};
