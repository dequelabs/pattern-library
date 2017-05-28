'use strict';

const delegate = require('delegate');
const Classlist = require('classlist');
const activateTab = require('./utils/activate-tab');
const debug = require('debug')('dqpl:components:tabs');
const getPanel = require('./utils/get-panel');

module.exports = () => {
  /**
   * Clicks on tabs
   */

  delegate(document.body, '.dqpl-tablist .dqpl-tab', 'click', (e) => {
    debug('tab clicked', e.delegateTarget);
    activateTab(e.delegateTarget);
  });

  /**
   * Keydowns on tabs
   */

  delegate(document.body, '.dqpl-tablist .dqpl-tab', 'keydown', (e) => {
    debug(`${e.which} keydown on tab`, e.delegateTarget);
    const which = e.which;
    const tab = e.target;

    switch (which) {
      case 37:
      case 38:
        e.preventDefault();
        activateTab(tab, 'prev');
        break;
      case 39:
      case 40:
        e.preventDefault();
        activateTab(tab, 'next');
    }
  });
};
