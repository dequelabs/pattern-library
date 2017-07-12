'use strict';

import Classlist from 'classlist';
import sizer from './sizer';
import { hide } from './aria';

module.exports = (trigger, alert) => {

  // Show the alert
  Classlist(alert).add('dqpl-alert-show');
  Classlist(document.body).add('dqpl-modal-open');

  let scrim = alert.querySelector('.dqpl-alert-screen');

  if (!scrim) {
    scrim = document.createElement('div');
    Classlist(scrim).add('dqpl-alert-screen');
    alert.appendChild(scrim);
  }

  hide(alert);
  sizer(alert);
};
