'use strict';

const queryAll = require('../../commons/query-all');
const activate = require('./activate');

/**
 * Handles arrow keyboard logic
 * @param  {Object} data  Object containing the following properties:
 *     @prop  {Number} key             keydown keycode
 *     @prop  {HTMLElement} combobox   the combobox element
 *     @prop  {HTMLElement} liveRegion the liveRegion instance
 *     @prop  {HTMLElement} listbox    the listbox element
 */
module.exports = (data) => {
  const isNext = data.key === 40;
  const activeID = data.combobox.getAttribute('aria-activedescendant');
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
    data.combobox.setAttribute('aria-activedescendant', adjacentOption.id);

    // announce the option politely due to a webkit aria-activedescendant bug:
    // https://bugs.webkit.org/show_bug.cgi?id=167680
    data.liveRegion.announce(adjacentOption.innerText, 1e3);

    // set active class/scroll
    activate(data.combobox, data.listbox);
  }
};
