'use strict';

import Classlist from 'classlist';
import { show } from '../aria';

const debug = require('debug')('dqpl:composites:element');

module.exports = (el) => {
  const trigger = document.querySelector(`[data-id="${el.id}"]`);

  Classlist(el).remove('dqpl-show');
  Classlist(document.body).remove('dqpl-open');

  show();

  if (trigger) {
    trigger.focus();
  } else {
    debug('Unable to find trigger for el: ', el);
  }
};
