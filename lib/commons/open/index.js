'use strict';

import Classlist from 'classlist';
import sizer from '../sizer';
import { hide } from '../aria';

module.exports = (trigger, el, focusEl) => {

  // Show the element
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
  if (focusEl) {
    focusEl.setAttribute('tabindex', '-1');
    focusEl.focus();
  } else {
    el.setAttribute('tabindex', '-1');
    el.focus();
  }
};
