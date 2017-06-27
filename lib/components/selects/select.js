'use strict';

import Classlist from 'classlist';

/**
 * Cleans up previously selected / sets new selection
 */
module.exports = (combobox, listbox, noHide) => {
  // clear selected state
  const prevSelected = listbox.querySelector('[aria-selected="true"]');
  if (prevSelected) { prevSelected.removeAttribute('aria-selected'); }

  const active = listbox.querySelector('.dqpl-option-active');
  if (active) {
    active.setAttribute('aria-selected', 'true');
  }

  if (!noHide) {
    // hide the list
    Classlist(listbox).remove('dqpl-listbox-show');
    combobox.setAttribute('aria-expanded', 'false');
  }

  // set pseudoVal
  const pseudoVal = active && combobox.querySelector('.dqpl-pseudo-value');
  if (pseudoVal) { pseudoVal.innerText = active.innerText; }
};
