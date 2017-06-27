'use strict';

import Classlist from 'classlist';
import closest from 'closest';
import queryAll from '../../../commons/query-all';
import getPanel from './get-panel';

const debug = require('debug')('dqpl:components:tabs');

module.exports = (tab, dir) => {
  // configure active state of tabs/panels in tablist
  const tabList = closest(tab, '.dqpl-tablist');
  const tabs = tabList ? queryAll('.dqpl-tab', tabList) : [];

  if (dir) {
    const idx = tabs.indexOf(tab);
    tab = tabs[dir == 'prev' ? (idx - 1) : (idx + 1)];

    if (!tab) { // circularity
      tab = tabs[dir === 'prev' ? tabs.length - 1 : 0];
    }
  }

  debug('activating tab: ', tab);

  tabs.forEach((t) => {
    const isActive = t === tab;
    const panel = getPanel(t);
    if (!panel) {
      return debug('unable to find panel for tab', t);
    }

    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    t.tabIndex = isActive ? 0 : -1;
    Classlist(t)[isActive ? 'add' : 'remove']('dqpl-tab-active');
    Classlist(panel)[isActive ? 'remove' : 'add']('dqpl-hidden');
    panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    if (isActive && dir) { t.focus(); }
  });
};
