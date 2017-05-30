'use strict';

const closest = require('closest');
const delegate = require('delegate');
const debug = require('debug')('dqpl:components:option-menus');
const queryAll = require('../../helpers/query-all');
const isOutside = require('../../helpers/is-outside');
const getAdjacentItem = require('../../helpers/get-adjacent-item');

module.exports = () => {
  /**
   * Clicks on the document (outside of a dropdown or
   * trigger) should close all expanded options menus
   */

  document.addEventListener('click', (e) => {
    const target = e.target;
    const selector = '.dqpl-options-menu, .dqpl-options-menu-trigger';
    if (isOutside(target, selector)) {
      // collapse all menus
      queryAll(selector).forEach((m) => m.setAttribute('aria-expanded', 'false'));
    }
  });

  /**
   * Clicks on triggers
   */

  delegate(document.body, '.dqpl-options-menu-trigger', 'click', (e) => {
    const trigger = e.delegateTarget;
    const dropdownID = trigger.getAttribute('aria-controls');
    const wasExpanded = trigger.getAttribute('aria-expanded') === 'true';
    const dropdown = document.getElementById(dropdownID);
    if (!dropdown) { return debug('Unable to find option menu for trigger: ', trigger); }
    // clean up the others
    queryAll('.dqpl-options-menu, .dqpl-options-menu-trigger')
      .filter((el) => el !== trigger && el !== dropdown)
      .forEach((el) => el.setAttribute('aria-expanded', 'false'));
    // toggle expanded
    trigger.setAttribute('aria-expanded', wasExpanded ? 'false' : 'true');
    dropdown.setAttribute('aria-expanded', wasExpanded ? 'false' : 'true');

    if (!wasExpanded) {
      // focus the first item...
      const firstItem = dropdown.querySelector('[role="menuitem"]');
      if (firstItem) { firstItem.focus(); }
    }
  });

  /**
   * Keydowns on triggers
   */

  delegate(document.body, '.dqpl-options-menu-trigger', 'keydown', (e) => {
    if (e.which === 40) { // down
      e.preventDefault();
      e.delegateTarget.click();
    }
  });

  /**
   * Keydowns on options menuitems
   */

  delegate(document.body, '.dqpl-options-menu [role="menuitem"]', 'keydown', (e) => {
    const which = e.which;
    const target = e.delegateTarget;

    if (which === 38 || which === 40) { // up or down
      e.preventDefault();
      const toFocus = getAdjacentItem(target, which === 38 ? 'up' : 'down');
      if (toFocus) { toFocus.focus(); }
    } else if (which === 27) { // escape
      e.preventDefault();
      const dropdown = closest(target, '[role="menu"]');
      const id = dropdown && dropdown.id;
      const trigger = id && document.querySelector(`.dqpl-options-menu-trigger[aria-controls="${id}"]`);
      if (trigger) {
        trigger.click();
        trigger.focus();
      }
    } else if (which === 13 || which === 32) {
      e.preventDefault();
      target.click();
    }
  });

  /**
   * Clicks on options menuitems
   *
   * (If theres a link in it, click it)
   */

  delegate(document.body, '.dqpl-options-menu [role="menuitem"]', 'click', (e) => {
    const link = e.delegateTarget.querySelector('a');
    if (link) { link.click(); }
  });

  /**
   * Clicks on links within options menuitems
   *
   * In case its for whatever reason an internal link - prevent inifinite loop
   * (This click would bubble up to the menuitem which would trigger a click
   * on this link which would bubble up and repeat itself infinitely)
   */

  delegate(document.body, '.dqpl-options-menu [role="menuitem"] a', (e) => {
    e.stopPropagation();
  });
};
