'use strict';

const debug = require('debug')('dqpl:components:selects');

module.exports = (combobox, listbox) => {
  if (combobox.getAttribute('role') !== 'combobox') {
    debug('Combobox missing role="combobox" attribute: ', combobox);
  }

  if (listbox.getAttribute('role') !== 'listbox') {
    debug('Listbox missing role="listbox" attribute: ', listbox);
  }
};
