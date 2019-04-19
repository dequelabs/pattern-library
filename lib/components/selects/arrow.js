'use strict';

import queryAll from '../../commons/query-all';
import activate from './activate';

/**
 * Handles arrow keyboard logic
 * @param  {Object} data  Object containing the following properties:
 *     @prop  {Number} key             keydown keycode
 *     @prop  {HTMLElement} listbox    the listbox element
 */
module.exports = (data) => {
  const isNext = data.key === 40;
  const activeID = data.listbox.getAttribute('aria-activedescendant');
  const selectedOption = activeID && document.getElementById(activeID);

  if (!selectedOption) {
    return;
  }

  const options = queryAll('[role="option"]', data.listbox).filter((o) => {
    return o.getAttribute('aria-disabled') !== 'true';
  });
  const index = options.indexOf(selectedOption);
  const adjacentIndex = isNext ? index + 1 : index - 1;

  if (adjacentIndex !== -1 && adjacentIndex !== options.length) {
    const adjacentOption = options[adjacentIndex];
    data.listbox.setAttribute('aria-activedescendant', adjacentOption.id);

    // set active class/scroll
    activate(data.listbox);
  }
};
