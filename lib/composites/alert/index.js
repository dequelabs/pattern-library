'use strict';

import delegate from 'delegate';
import open from '../../commons/open';
import sizer from '../../commons/sizer';
import trapFocus from '../../commons/trap-focus';

const debug = require('debug')('dqpl:composites:alert');

module.exports = () => {
  /**
   * Handle clicks on triggers
   */
  delegate(document.body, '[data-alert-dialog]', 'click', (e) => {
    const trigger = e.delegateTarget;
    const alertID = trigger.getAttribute('data-alert-dialog');
    const alert = document.getElementById(alertID);

    if (!alert) {
      return debug('No alert found with id: ', alertID);
    }

    open(trigger, alert);
    window.addEventListener('resize', onWindowResize);
  });

  /**
   * Keydowns on alerts - trap focus
   */
   trapFocus('.dqpl-alert');

  function onWindowResize() {
    sizer(document.querySelector('.dqpl-alert-show'));
  }
};
