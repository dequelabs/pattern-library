'use strict';

const queryAll = require('../../helpers/query-all');
const activate = require('./activate');
const TYPE_TIME = 600;

let timer;
let keys = [];

module.exports = (which, combobox, listbox) => {
  const searchSelect = (matches) => {
    if (!matches.length) { return; }
    const current = listbox.querySelector('.dqpl-option-active');
    const currentIndex = matches.indexOf(current);
    const nextIndex = currentIndex + 1;
    const toBeSelected = matches[nextIndex] || matches[0];

    if (toBeSelected === current) { return; }
    combobox.setAttribute('aria-activedescendant', toBeSelected.id);
    activate(combobox, listbox);
  };

  clearTimeout(timer);

  let key = String.fromCharCode(which);
  if (!key || !key.trim().length) { return; }

  const options = queryAll('[role="option"]', listbox).filter((o) => {
    return o.getAttribute('aria-disabled') !== 'true';
  });

  key = key.toLowerCase();
  keys.push(key);

  // find the FIRST option that most closely matches our keys
  // if that first one is already selected, go to NEXT option
  const stringMatch = keys.join('');
  // attempt an exact match
  const deepMatches = options.filter((o) => {
    return o.innerText.toLowerCase().indexOf(stringMatch) === 0;
  });

  if (deepMatches.length) {
    searchSelect(deepMatches);
  } else {
    // plan b - first character match
    const firstChar = stringMatch[0];
    searchSelect(options.filter((o) => {
      return o.innerText.toLowerCase().indexOf(firstChar) === 0;
    }));
  }

  timer = setTimeout(() => {
    // reset
    keys = [];
  }, TYPE_TIME);
};
