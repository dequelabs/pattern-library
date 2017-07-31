'use strict';

import Classlist from 'classlist';
import { show } from '../aria';

const debug = require('debug')('dqpl:commons:close');

/**
 * Closes a dialog and returns focus to it's trigger
 * @param  {HTMLElement} el the dialog element
 */
module.exports = (el) => {
  const trigger = document.querySelector(`[data-dialog-id="${el.id}"]`);

  Classlist(el).remove('dqpl-dialog-show');
  Classlist(document.body).remove('dqpl-open');

  show(el);

  if (trigger) {
    trigger.focus();
  } else {
    debug('Unable to find trigger for el: ', el);
  }
};
