'use strict';

import Classlist from 'classlist';

/**
 * Cleans up previously selected / sets new selection
 */
module.exports = (listboxButton, listbox, noHide) => {
  // clear selected state
  const prevSelected = listbox.querySelector('.dqpl-option-selected');
  if (prevSelected) {
    prevSelected.removeAttribute('aria-selected');
    Classlist(prevSelected).remove('dqpl-option-selected');
  }

  const active = listbox.querySelector('.dqpl-option-active');
  if (active) {
    active.setAttribute('aria-selected', 'true');
    Classlist(active).add('dqpl-option-selected');
  }

  if (!noHide) {
    // hide the list
    Classlist(listbox).remove('dqpl-listbox-show');
    listboxButton.setAttribute('aria-expanded', 'false');
    listboxButton.focus();
  }

  // set pseudoVal
  const pseudoVal = active && listboxButton.querySelector('.dqpl-pseudo-value');
  if (pseudoVal) { pseudoVal.innerHTML = active.innerHTML; }
};
