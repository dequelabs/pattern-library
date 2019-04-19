'use strict';

import Classlist from 'classlist';
import queryAll from '../../commons/query-all';
import activate from './activate';

/**
 * Opens the listbox
 */
module.exports = (listboxButton, listbox) => {
  const activeDesc = listbox.getAttribute('aria-activedescendant');
  if (!activeDesc) {
    // theres no initially selected => default to the first
    const nonDisableds = queryAll('[role="option"]', listbox).filter((o) => {
      return o.getAttribute('aria-disabled') !== 'true';
    });

    if (nonDisableds.length) {
      listbox.setAttribute('aria-activedescendant', nonDisableds[0].id);
    }
  }

  Classlist(listbox).add('dqpl-listbox-show');
  listboxButton.setAttribute('aria-expanded', 'true');
  listbox.focus();
  listbox.setAttribute('data-cached-selected', listbox.getAttribute('aria-activedescendant'));
  activate(listbox);
};
