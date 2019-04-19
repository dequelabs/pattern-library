'use strict';

const debug = require('debug')('dqpl:components:selects');

module.exports = (combobox, listbox) => {
  if (listbox.getAttribute('role') !== 'listbox') {
    debug('Listbox missing role="listbox" attribute: ', listbox);
  }
};
