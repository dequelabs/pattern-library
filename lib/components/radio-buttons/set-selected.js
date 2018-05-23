'use strict';

import Classlist from 'classlist';
import closest from 'closest';
import queryAll from '../../commons/query-all';

/**
 * Cleans up previously selected / configures newly selected radio
 * @param  {Array} radios               Array of radio buttons in group
 * @param  {HTMLElement} newlySelected  Radio button to be selected
 * @param  {Boolean} focus              If the newlySelected radio should be focused
 */
module.exports = (radios, newlySelected, focus) => {
  const group = closest(newlySelected, '[role="radiogroup"]');
  const _radios = queryAll('[role="radio"]', group);
  _radios.forEach((radio) => {
    const isNewlySelected = radio === newlySelected;
    // set attributes / properties / classes
    radio.tabIndex = isNewlySelected ? 0 : -1;
    radio.setAttribute('aria-checked', isNewlySelected ? 'true' : 'false');
    Classlist(radio).toggle('dqpl-selected');
    if (isNewlySelected && focus) { newlySelected.focus(); }

    // icon state
    const inner = radio.querySelector('.dqpl-inner-radio');
    if (inner) {
      Classlist(inner)
        .remove(isNewlySelected ? 'fa-circle-o' : 'fa-dot-circle-o')
        .add(isNewlySelected ? 'fa-dot-circle-o' : 'fa-circle-o');
    }
  });
};
