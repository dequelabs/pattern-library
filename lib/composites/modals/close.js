'use strict';

const Classlist = require('classlist');
const debug = require('debug')('dqpl:composites:modals');
const ariaShow = require('./aria').show;

module.exports = (modal) => {
  const trigger = document.querySelector(`[data-modal="${modal.id}"]`);

  Classlist(modal).remove('dqpl-modal-show');
  Classlist(document.body).remove('dqpl-modal-open');

  ariaShow();

  if (trigger) {
    trigger.focus();
  } else {
    debug('Unable to find trigger for modal: ', modal);
  }
};
