'use strict';

const closest = require('closest');
const Classlist = require('classlist');
const fixExisting = require('./fix-existing');
const createLandmarkMenu = require('./create-landmark-menu');

module.exports = () => {
  const skipContainer = document.querySelector('.dqpl-skip-container');
  if (!skipContainer) { return; }
  const shouldRemove = skipContainer.getAttribute('data-remove-tabindex-on-blur') === 'true';

  // focus management
  skipContainer.addEventListener('focusin', (e) => {
    const target = e.target;
    const list = Classlist(skipContainer);

    if (closest(target, 'ul')) {
      list.add('dqpl-child-focused');
    }

    list.add('dqpl-skip-container-active');
    setTimeout(() => list.add('dqpl-skip-fade'));
  });

  skipContainer.addEventListener('focusout', (e) => {
    const target = e.target;
    const list = Classlist(skipContainer);

    setTimeout(() => {
      const activeEl = document.activeElement;
      if (closest(activeEl, '.dqpl-skip-container')) { return; }

      if (closest(target, 'ul')) {
        list.remove('dqpl-child-focused');
      }

      list.remove('dqpl-skip-container-active');
      setTimeout(() => list.remove('dqpl-skip-fade'));
    });
  });

  if (skipContainer.childElementCount) {
    return fixExisting(shouldRemove);
  }

  createLandmarkMenu(shouldRemove, skipContainer);
};
