'use strict';

const queryAll = require('../../helpers/query-all');
const activate = require('./activate');

module.exports = (key, combobox, listbox) => {
  const isNext = key === 40;
  const activeID = combobox.getAttribute('aria-activedescendant');
  const selectedOption = activeID && document.getElementById(activeID);
  if (!selectedOption) { return; }

  const options = queryAll('[role="option"]', listbox).filter((o) => {
    return o.getAttribute('aria-disabled') !== 'true';
  });
  const index = options.indexOf(selectedOption);
  const adjacentIndex = isNext ? index + 1 : index - 1;

  if (adjacentIndex !== -1 && adjacentIndex !== options.length) {
    const adjacentOption = options[adjacentIndex];
    combobox.setAttribute('aria-activedescendant', adjacentOption.id);
    activate(combobox, listbox);
  }
};
