'use strict';

const delegate = require('delegate');
const closest = require('closest');
const debug = require('debug')('dqpl:composites:modals');
const open = require('./open');
const close = require('./close');
const sizer = require('./sizer');
const queryAll = require('../../commons/query-all');
const focusableSelector = require('../../commons/is-focusable/selector');

module.exports = () => {
  /**
   * Handle clicks on triggers
   */

  delegate(document.body, '[data-modal]', 'click', (e) => {
    const trigger = e.delegateTarget;
    const modalID = trigger.getAttribute('data-modal');
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

  delegate(document.body, '.dqpl-modal-close, .dqpl-modal-cancel', 'click', (e) => {
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

  delegate(document.body, '.dqpl-modal', 'keydown', (e) => {
    const modal = e.delegateTarget;
    const target = e.target;
    const which = e.which;

    if (which === 27) {
      close(modal);
    } else if (which === 9) {
      const focusables = queryAll(focusableSelector, modal);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && target === first) {
        e.preventDefault();
        if (last) { last.focus(); }
      } else if (!e.shiftKey && target === last) {
        e.preventDefault();
        if (first) { first.focus(); }
      }
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
    sizer(document.querySelector('.dqpl-modal-show'));
  }
};
