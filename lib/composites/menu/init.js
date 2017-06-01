'use strict';

const resize = require('./events/resize');
const attachMainEvents = require('./events/main');
const getTopLevels = require('./utils/get-top-level-items');

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

  // update top bar element references on dqpl:refresh
  elements.topBar.addEventListener('dqpl:refresh', () => {
    const topLevels = getTopLevels(topBar.querySelector('[role="menubar"]'), true);
    updateTopBarItems(topLevels);
    const activeOne = topLevels.find((t) => t.tabIndex === 0);
    // default to the first item if no active item exists
    if (!activeOne) { topLevels[0].tabIndex = 0; }
  });

  // attach all of the top/side bar click and keydown events
  attachMainEvents(elements, updateTopBarItems);
};