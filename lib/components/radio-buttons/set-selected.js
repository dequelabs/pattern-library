'use strict';

import Classlist from 'classlist';

/**
 * Cleans up previously selected / configures newly selected radio
 * @param  {Array} radios               Array of radio buttons in group
 * @param  {HTMLElement} newlySelected  Radio button to be selected
 * @param  {Boolean} focus              If the newlySelected radio should be focused
 */
module.exports = (radios, newlySelected, focus) => {
  radios.forEach((radio) => {
    const radioId = radio.nextElementSibling.id;
    const newlySelectedId = newlySelected.nextElementSibling.id;
    const isNewlySelected = radioId === newlySelectedId;
    // set attributes / properties / classes
    if (isNewlySelected) {
      newlySelected.tabIndex = 0;
      newlySelected.setAttribute('aria-checked', 'true');
      Classlist(newlySelected).toggle('dqpl-selected');
      if (focus) {
        newlySelected.focus();
      }
      const inner = radio.querySelector('.dqpl-inner-radio');
      if (inner) {
        Classlist(inner)
          .remove('fa-circle-o')
          .add('fa-dot-circle-o');
      }
    } else {
      radio.tabIndex = -1;
      radio.setAttribute('aria-checked', 'false');
      Classlist(radio).toggle('dqpl-selected');
      const inner = radio.querySelector('.dqpl-inner-radio');
      if (inner) {
        Classlist(inner)
          .remove('fa-dot-circle-o')
          .add('fa-circle-o');
      }
    }
  });
};
