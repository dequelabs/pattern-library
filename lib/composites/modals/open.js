'use strict';

import Classlist from 'classlist';
import sizer from './sizer';
import { hide } from './aria';

const debug = require('debug')('dqpl:composites:modals');

module.exports = (trigger, modal) => {
  const heading = modal.querySelector('.dqpl-modal-header h2');

  // show the modal
  Classlist(modal).add('dqpl-modal-show');
  Classlist(document.body).add('dqpl-modal-open');

  let scrim = modal.querySelector('.dqpl-modal-screen');

  if (!scrim) {
    scrim = document.createElement('div');
    Classlist(scrim).add('dqpl-modal-screen');
    modal.appendChild(scrim);
  }

  if (!heading) {
    debug('No heading found for modal: ', modal);
  } else {
    heading.tabIndex = -1;
    heading.focus();
  }

  hide(modal);
  sizer(modal);
};
