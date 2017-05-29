'use strict';

const Classlist = require('classlist');

module.exports = (radios, newlySelected, focus) => {
  radios.forEach((radio) => {
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
