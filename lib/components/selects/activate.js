'use strict';

import Classlist from 'classlist';
import queryAll from '../../commons/query-all';
const scrollIntoViewIfNeedBe = require('scroll-into-view-if-needed');

/**
 * Activates an option
 */
module.exports = (listbox, noScroll) => {
  // clean
  queryAll('[role="option"].dqpl-option-active', listbox)
    .forEach((o) => {
      Classlist(o).remove('dqpl-option-active');
    });

  queryAll('[aria-selected="true"]', listbox)
    .forEach((o) => o.removeAttribute('aria-selected'));

  const optionID = listbox.getAttribute('aria-activedescendant');
  const active = optionID && document.getElementById(optionID);

  if (!active) {
    return;
  }

  Classlist(active).add('dqpl-option-active');
  active.setAttribute('aria-selected', 'true');

  if (!noScroll) {
    scrollIntoViewIfNeedBe(active, false);
  }
};
