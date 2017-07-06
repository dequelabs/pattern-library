'use strict';

import Classlist from 'classlist';
import resize from './events/resize';
import attachMainEvents from './events/main';
import getTopLevels from './utils/get-top-level-items';

module.exports = (topBar) => {
  const elements = {
    topBar: topBar,
    trigger: topBar.querySelector('.dqpl-menu-trigger'),
    menu: document.querySelector('.dqpl-side-bar'),
    scrim: document.getElementById('dqpl-side-bar-scrim'),
    topBarItems: getTopLevels(topBar.querySelector('[role="menubar"]'), true)
  };
  const updateTopBarItems = (items) => elements.topBarItems = items;

  // Configure the menu based on size of window
  resize(elements, updateTopBarItems);

  // attach all of the top/side bar click and keydown events
  attachMainEvents(elements, updateTopBarItems);

  // update top bar element references on dqpl:refresh
  elements.topBar.addEventListener('dqpl:refresh', () => {
    const topLevels = getTopLevels(topBar.querySelector('[role="menubar"]'), true);
    updateTopBarItems(topLevels);

    const activeOnes = topLevels.filter((t) => t.tabIndex === 0);
    // default to the first item if no active item exists
    if (!activeOnes.length) { topLevels[0].tabIndex = 0; }
  });

  // ensure the "dqpl-no-sidebar" class is present since there is no menu (sidebar)
  if (!elements.menu) {
    Classlist(document.body).add('dqpl-no-sidebar');
  }
};
