'use strict';

import Classlist from 'classlist';
import queryAll from '../../commons/query-all';
const scrollIntoViewIfNeedBe = require('scroll-into-view-if-needed').default;

/**
 * Activates an option
 */
module.exports = (combobox, listbox, noScroll) => {
  // clean
  queryAll('[role="option"].dqpl-option-active')
    .forEach((o) => Classlist(o).remove('dqpl-option-active'));

  const optionID = combobox.getAttribute('aria-activedescendant');
  const active = optionID && document.getElementById(optionID);

  if (active) {
    Classlist(active).add('dqpl-option-active');
  }

  if (active && !noScroll) {
    scrollIntoViewIfNeedBe(active, false);
  }
};
