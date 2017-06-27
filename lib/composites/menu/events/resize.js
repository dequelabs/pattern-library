'use strict';

import Classlist from 'classlist';
import getTopLevels from '../utils/get-top-level-items';

let lastSize;

module.exports = (elements, update) => {
  const menu = elements.menu;
  const trigger = elements.trigger;
  const scrim = elements.scrim;
  const topBar = elements.topBar;

  if (!menu || !trigger) { return; }

  /**
   * The menu is locked into visibility above 1024px viewport...
   * - ensure aria-expanded is removed/readded properly
   * - ensure the topbar menu isn't thrown off (in case the hamburger was the "active" item)
   */

  function onResize() {
    const width = window.innerWidth;
    if (width >= 1024) {
      if (!lastSize || lastSize === 'narrow') {
        lastSize = 'wide';

        const expandedState = menu.getAttribute('aria-expanded');
        if (expandedState) {
          menu.setAttribute('data-prev-expanded', expandedState);
        }

        menu.removeAttribute('aria-expanded');
        if (scrim) {
          Classlist(scrim)
            .remove('dqpl-scrim-show')
            .remove('dqpl-scrim-fade-in');
        }

        if (trigger.tabIndex === 0) {
          // since `$trigger` gets hidden (via css hook)
          // "activate" something else in the menubar
          const topBarMenuItems = getTopLevels(topBar.querySelector('[role="menubar"]'), true);
          update(topBarMenuItems);
          topBarMenuItems.forEach((item, i) => item.tabIndex = i === 0 ? 0 : -1);
        }
        menu.setAttribute('data-locked', 'true');
      }
    } else {
      if (!lastSize || lastSize === 'wide') {
        lastSize = 'narrow';
        const wasExpanded = menu.getAttribute('data-prev-expanded') === 'true';
        menu.setAttribute('aria-expanded', wasExpanded ? 'true' : 'false');
        update(getTopLevels(topBar.querySelector('ul'), true));
        menu.setAttribute('data-locked', 'false');

        if (wasExpanded === 'true' && scrim) {
          Classlist(scrim)
            .add('dqpl-scrim-show')
            .add('dqpl-scrim-fade-in');
        }
      }
    }
  }

  onResize();
  // TODO: Throttle this for better performance
  window.addEventListener('resize', onResize);
};
