'use strict';

const Classlist = require('classlist');

module.exports = (combobox, listbox, noHide) => {
  // clear selected state
  const prevSelected = listbox.querySelector('[aria-selected="true"]');
  if (prevSelected) { prevSelected.removeAttribute('aria-selected'); }

  const active = listbox.querySelector('.dqpl-option-active');
  if (active) {
    active.setAttribute('aria-selected', 'true');
  }

  // hide the list (unless noShow)
  if (!noHide) {
    Classlist(listbox).remove('dqpl-listbox-show');
    combobox.setAttribute('aria-expanded', 'false');
  }

  // set pseudoVal
  const pseudoVal = active && combobox.querySelector('.dqpl-pseudo-value');
  if (pseudoVal) { pseudoVal.innerText = active.innerText; }
};
