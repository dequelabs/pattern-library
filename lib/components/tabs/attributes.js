'use strict';

import Classlist from 'classlist';
import queryAll from '../../commons/query-all';

const debug = require('debug')('dqpl:components:tabs');

module.exports = () => {
  const tabLists = queryAll('.dqpl-tablist');

  tabLists.forEach((container) => {
    const tabs = queryAll('.dqpl-tab', container);
    // find the initially active tab (defaults to first)
    const activeTab = container.querySelector('.dqpl-tab-active') || tabs[0];

    if (!activeTab) {
      return debug('unable to find active tab for tablist', container);
    }

    Classlist(activeTab).add('dqpl-tab-active');

    // Set initial tabindex / aria-selected
    tabs.forEach((t) => {
      const isActive = t === activeTab;
      t.tabIndex = isActive ? 0 : -1;
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');

      // validate aria-controls presence
      if (!t.getAttribute('aria-controls')) {
        debug('aria-controls attribute missing on tab', t);
      }
      // validate role
      if (t.getAttribute('role') !== 'tab') {
        debug('role="tab" missing on tab', t);
      }
    });
  });
};
