'use strict';

const Classlist = require('classlist');
const queryAll = require('../../commons/query-all');
const activate = require('./activate');

/**
 * Opens the listbox
 */
module.exports = (combobox, listbox) => {
  const activeDesc = combobox.getAttribute('aria-activedescendant');
  if (!activeDesc) {
    // theres no initially selected => default to the first
    const nonDisableds = queryAll('[role="option"]', listbox).filter((o) => {
      return o.getAttribute('aria-disabled') !== 'true';
    });

    if (nonDisableds.length) {
      combobox.setAttribute('aria-activedescendant', nonDisableds[0].id);
    }
  }

  Classlist(listbox).add('dqpl-listbox-show');
  combobox.setAttribute('aria-expanded', 'true');
  listbox.setAttribute('data-cached-selected', combobox.getAttribute('aria-activedescendant'));
  activate(combobox, listbox);
};
