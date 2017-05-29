'use strict';

const boxCache = [];
const Classlist = require('classlist');
const debug = require('debug')('dqpl:components:selects');
const noClobber = require('../../helpers/no-clobber');
const rndid = require('../../helpers/rndid');
const queryAll = require('../../helpers/query-all');
const validate = require('./validate');
const attachEvents = require('./events');

module.exports = () => {
  queryAll('.dqpl-combobox')
    .forEach((combobox) => {
      if (boxCache.indexOf(combobox) > -1) { return; }
      boxCache.push(combobox);
      const dropdownId = combobox.getAttribute('aria-owns');
      const listbox = dropdownId && document.getElementById(dropdownId);

      if (!listbox) {
        return debug('Unable to find listbox using aria-owns attribute for: ', combobox);
      }

      combobox.tabIndex = 0;

      // ensure pseudo value element is present
      let pseudoVal = combobox.querySelector('.dqpl-pseudo-value');
      if (!pseudoVal) {
        pseudoVal = document.createElement('div');
        Classlist(pseudoVal).add('dqpl-pseudo-value');
        combobox.appendChild(pseudoVal);
      }

      // associate pseudoVal with combobox
      noClobber(combobox, pseudoVal, 'aria-labelledby');

      // ensure all options have an id
      queryAll('[role="option"]', listbox).forEach((o) => o.id = o.id || rndid());

      // attach native click-label-focus-control behavior
      validate(combobox, listbox);
      attachEvents(combobox, listbox);

      // check if there is a default selected and ensure it has the right attrs/classes
      const activeId = combobox.getAttribute('aria-activedescendant');
      const active = activeId && document.getElementById(activeId);

      if (active) {
        active.setAttribute('aria-selected', 'true');
        Classlist(active).add('dqpl-option-active');
      }
    });
};