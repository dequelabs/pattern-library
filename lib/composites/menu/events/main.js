'use strict';

const delegate = require('delegate');
const Classlist = require('classlist');
const closest = require('closest');
const arrow = require('./arrow');
const activate = require('../utils/activate');
const queryAll = require('../../../helpers/query-all');
const isVisible = require('../../../helpers/is-visible');
const getTopLevels = require('../utils/get-top-level-items');
const ACTIVE_CLASS = 'dqpl-active';

module.exports = (elements, update) => {
  /**
   * Listen for clicks outside the menu (when
   * its opened AND not locked) to close it
   */

  document.addEventListener('click', (e) => {
    const target = e.target;
    const isLocked = elements.menu.getAttribute('data-locked') === 'true';
    const isWithin = closest(target, '.dqpl-side-bar');
    const isHamburger = Classlist(target).contains('dqpl-menu-trigger') ||
      !!closest(target, '.dqpl-menu-trigger');

    if (isWithin || isHamburger || isLocked) {
      return;
    }

    if (elements.menu.getAttribute('aria-expanded') === 'true') {
      onTriggerClick();
    }
  });

  // hamburger clicks
  elements.trigger.addEventListener('click', onTriggerClick);

  /**
   * Toggle submenu on other topbar menu items with submenus
   */

  delegate(elements.topBar, '[role="menuitem"][aria-controls]', 'click', (e) => {
    const target = e.delegateTarget;
    if (target === elements.trigger) { return; }

    toggleSubmenu(target, (dropdown, done) => {
      Classlist(dropdown).toggle('dqpl-dropdown-active');
      done(
        false,
        Classlist(dropdown).contains('dqpl-dropdown-active') ? dropdown : target
      );
    });
  });

  /**
   * Menu item setup
   */

  elements.topBarItems.forEach((t, i) => t.tabIndex = i === 0 ? 0 : -1);
  queryAll('[role="menu"]', elements.menu)
    .forEach((m) => {
      const mItems = queryAll('[role="menuitem"]', m);
      mItems.forEach((mi, i) => mi.tabIndex = i === 0 ? 0 : -1);
    });

  /**
   * Keyboard logic for top bar
   */

  delegate(elements.topBar, '[role="menuitem"]', 'keydown', (e) => {
    const which = e.which;
    const target = e.target;

    switch (which) {
      case 37:
      case 39:
        e.preventDefault();
        arrow(
          getTopLevels(elements.topBar.querySelector('[role="menubar"]'), true),
          target,
          which == 39 ? 'next' : 'prev'
        );
        break;
      case 38:
      case 40:
        e.preventDefault();
        if (target.hasAttribute('aria-controls')) {
          target.click();
        }
        break;
      case 13:
      case 32:
        e.preventDefault();
        target.click();
        break;
    }
  });

  /**
   * Click links inside of clicked menuitems
   */

  delegate(elements.topBar, '[role="menuitem"]', 'click', (e) => {
    const target = e.delegateTarget;
    const link = target.querySelector('a');

    if (link) { link.click(); }
  });

  /**
   * Handle keydowns within top bar dropdowns
   */

  delegate(elements.topBar, '.dqpl-dropdown', 'keydown', (e) => {
    const which = e.which;
    const target = e.target;
    const dropdown = e.delegateTarget;

    if (which === 27 || which === 38) {
      const trigger = document.querySelector(`[aria-controls="${dropdown.id}"]`);
      if (trigger) { trigger.click(); }
    }
  });

  /**
   * Keyboard logic for menu (side bar)
   * - up/down traverse through menu items
   * - right (with submenu) opens submenu / focuses first item
   * - left/escape closes submenu (if within one) OR closes menu (if at top level)
   */

  delegate(elements.menu, '[role="menuitem"]', 'keydown', (e) => {
    const which = e.which;
    const target = e.target;

    switch (which) {
      case 27:
      case 37:
        const isOfMenu = target.parentNode === elements.menu;
        if (elements.menu.getAttribute('data-locked') === 'true' && isOfMenu) {
          return;
        }

        e.preventDefault();
        e.stopPropagation(); // prevent bubbling for sake of submenus

        const thisMenu = closest(target, '[role="menu"]');
        const thisTrigger = document.querySelector(`[aria-controls="${thisMenu.id}"]`);

        thisTrigger.click();
        if (!isOfMenu) { activate(target, thisTrigger); }
        break;
      case 40:
        e.preventDefault();
        arrowSetup(target, 'next');
        break;
      case 38:
        e.preventDefault();
        arrowSetup(target, 'prev');
        break;
      case 32:
      case 13:
        e.preventDefault();
        target.click();
        if (!target.getAttribute('aria-controls')) {
          const link = target.querySelector('a');
          if (link) { link.click(); }
        }
        break;
      case 39:
        if (target.hasAttribute('aria-controls')) {
          target.click();
        }
        break;
    }
  });

  /**
   * Mouse logic for expandable submenu triggers
   */

  delegate(elements.menu, '[role="menuitem"]', 'click', (e) => {
    e.stopPropagation();
    const trigger = e.delegateTarget;

    if (trigger.hasAttribute('aria-controls')) {
      toggleSubmenu(trigger, (submenu, done) => {
        // TODO: Get css slide down working
        submenu.style.display = isVisible(submenu) ? 'none' : 'block';
        let toFocus = submenu.querySelector('[role="menuitem"][tabindex="0"]');
        toFocus = toFocus || submenu.querySelector('[role="menuitem"]');
        done(false, toFocus);
      });
    } else {
      const link = trigger.querySelector('a');
      if (link) { link.click(); }
    }
  });

  elements.menu.addEventListener('keydown', (e) => {
    if (e.which !== 9) { return; }
    setTimeout(() => {
      const outside = !elements.menu.contains(document.activeElement);
      const isExpanded = elements.menu.getAttribute('aria-expanded');

      if (outside && isExpanded) {
        onTriggerClick(null, true);
      }
    });
  });

  function arrowSetup(target, dir) {
    const items = getTopLevels(closest(target, '[role="menu"]'));
    arrow(items, target, dir);
  }

  /**
   * Handles clicks on trigger
   * - toggles classes
   * - handles animation
   */

  function onTriggerClick(e, noFocus) {
    toggleSubmenu(elements.trigger, (_, done) => {
      Classlist(elements.trigger).toggle(ACTIVE_CLASS);
      const wasActive = Classlist(elements.menu).contains(ACTIVE_CLASS);
      const first = wasActive ? ACTIVE_CLASS : 'dqpl-show';
      const second = first === ACTIVE_CLASS ? 'dqpl-show' : ACTIVE_CLASS;

      Classlist(elements.menu).toggle(first);

      if (elements.scrim) {
        Classlist(elements.scrim).toggle('dqpl-scrim-show');
      }

      setTimeout(() => {
        Classlist(elements.menu).toggle(second);
        if (elements.scrim) { Classlist(elements.scrim).toggle('dqpl-scrim-fade-in'); }
        setTimeout(() => done(noFocus));
      }, 100);
    });
  }

  /**
   * Toggles a menu or submenu
   */

  function toggleSubmenu(trigger, toggleFn) {
    const droplet = document.getElementById(trigger.getAttribute('aria-controls'));

    if (!droplet) { return; }

    toggleFn(droplet, (noFocus, focusTarget) => {
      const prevExpanded = droplet.getAttribute('aria-expanded');
      const wasCollapsed = !prevExpanded || prevExpanded === 'false';
      droplet.setAttribute('aria-expanded', wasCollapsed ? 'true' : 'false');

      if (focusTarget) {
        focusTarget.focus();
      } else if (!noFocus) {
        let active = queryAll('.dqpl-menuitem-selected', droplet).filter(isVisible);
        active = active.length ?
          active :
          queryAll('[role="menuitem"][tabindex="0"]', droplet).filter(isVisible);
        let focusMe = wasCollapsed ? active[0] : closest(droplet, '[aria-controls][role="menuitem"]');
        focusMe = focusMe || elements.trigger;
        if (focusMe) { focusMe.focus(); }
      }
    });
  }
};