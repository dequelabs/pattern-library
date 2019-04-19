'use strict';

import Classlist from 'classlist';
import noClobber from '../../commons/no-clobber';
import closest from 'closest';
import rndid from '../../commons/rndid';
import queryAll from '../../commons/query-all';
import validate from './validate';
import attachEvents from './events';

const boxCache = [];
const debug = require('debug')('dqpl:components:selects');

module.exports = () => {
  queryAll('.dqpl-listbox-button')
    .forEach((listboxButton) => {
      if (boxCache.indexOf(listboxButton) > -1) { return; }
      boxCache.push(listboxButton);

      const wrapper = closest(listboxButton, '.dqpl-select');
      const listbox = wrapper.querySelector('[role="listbox"]');

      if (!listbox) {
        return debug('Unable to find listbox using aria-owns attribute for: ', listboxButton);
      }

      listbox.tabIndex = -1;

      // ensure pseudo value element is present
      let pseudoVal = listboxButton.querySelector('.dqpl-pseudo-value');
      if (!pseudoVal) {
        pseudoVal = document.createElement('div');
        Classlist(pseudoVal).add('dqpl-pseudo-value');
        listboxButton.appendChild(pseudoVal);
      }

      noClobber(listboxButton, pseudoVal, 'aria-labelledby');

      // ensure all options have an id
      queryAll('[role="option"]', listbox).forEach((o) => o.id = o.id || rndid());

      // check if there is a default selected and ensure it has the right attrs/classes
      const activeId = listbox.getAttribute('aria-activedescendant');
      const active = activeId && document.getElementById(activeId);

      if (active) {
        active.setAttribute('aria-selected', 'true');
        Classlist(active).add('dqpl-option-selected');
        Classlist(active).add('dqpl-option-active');
      }

      // attach native click-label-focus-control behavior
      validate(listboxButton, listbox);
      attachEvents(listboxButton, listbox);
    });
};
