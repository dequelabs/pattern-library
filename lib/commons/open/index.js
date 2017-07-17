'use strict';

import Classlist from 'classlist';
import sizer from '../sizer';
import { hide } from '../aria';

// const debug = require('debug')('dqpl:composites:modals');

module.exports = (trigger, el) => {

  // Show the alert
  Classlist(el).add('dqpl-show');
  Classlist(document.body).add('dqpl-open');

  let scrim = el.querySelector('.dqpl-screen');

  if (!scrim) {
    scrim = document.createElement('div');
    Classlist(scrim).add('dqpl-screen');
    el.appendChild(scrim);
  }

  hide(el);
  sizer(el);
};
