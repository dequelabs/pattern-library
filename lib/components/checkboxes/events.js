'use strict';

const delegate = require('delegate');
const Classlist = require('classlist');
const closest = require('closest');
const toggleSelected = (box) => {
  if (box.getAttribute('aria-disabled') === 'true') { return; }
  const wasSelected = box.getAttribute('aria-checked') === 'true';

  box.setAttribute('aria-checked', wasSelected ? 'false' : 'true');
  const inner = box.querySelector('.dqpl-inner-checkbox');
  Classlist(inner)
    .remove('fa-check-square')
    .remove('fa-square-o')
    .add(wasSelected ? 'fa-square-o' : 'fa-check-square');
};

module.exports = () => {
  /**
   * Clicks on checkboxes
   */

  delegate(document.body, '.dqpl-checkbox', 'click', (e) => {
    toggleSelected(e.delegateTarget);
  });

  /**
   * Keydowns on checkboxes
   */

  delegate(document.body, '.dqpl-checkbox', 'keydown', (e) => {
    const which = e.which;
    if (which === 32) {
      e.preventDefault();
      toggleSelected(e.target);
    } else if (which === 13) {
      const form = closest(e.target, 'form');
      if (form) {
        form.submit();
      }
    }
  });
};