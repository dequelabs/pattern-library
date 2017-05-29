'use strict';

const debug = require('debug')('dqpl:components:selects');
const queryAll = require('../../helpers/query-all');
const activate = require('./activate');

module.exports = (key, combobox, listbox) => {
  debug('arrow!');
  const isNext = key === 40;
  debug('isNext? ', isNext);
  const activeID = combobox.getAttribute('aria-activedescendant');
  const selectedOption = activeID && document.getElementById(activeID);
  debug('selectedOption? ', selectedOption);
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
