'use strict';

import Classlist from 'classlist';
import { show } from '../../commons/aria';

const debug = require('debug')('dqpl:composites:modals');

module.exports = (modal) => {
  const trigger = document.querySelector(`[data-modal="${modal.id}"]`);

  Classlist(modal).remove('dqpl-modal-show');
  Classlist(document.body).remove('dqpl-modal-open');

  show();

  if (trigger) {
    trigger.focus();
  } else {
    debug('Unable to find trigger for modal: ', modal);
  }
};
