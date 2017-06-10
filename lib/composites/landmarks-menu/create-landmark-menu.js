'use strict';

const Classlist = require('classlist');
const debug = require('debug')('dqpl:composites:landmarks-menu');
const queryAll = require('../../commons/query-all');
const SELECTOR = require('./selector');
const calculateText = require('./calculate-text');

module.exports = (shouldRemove, skipContainer) => {
  const links = [];
  const main = document.querySelector('.dqpl-main-content');

  queryAll(SELECTOR).forEach((skipTarget) => {
    if (skipTarget.getAttribute('data-no-skip') === 'true') {
      return;
    }

    const linkText = calculateText(skipTarget);
    if (!linkText) {
      return debug('Unable to calulate text for skip link for: ', skipTarget);
    }

    const skipToText = skipContainer.getAttribute('data-skip-to-text') || '';
    const linkHTML = [
      `<span class="dqpl-skip-one">${skipToText}</span>`,
      `<span class="dqpl-skip-two">${linkText}</span>`
    ].join('');

    // create the skip link
    const link = document.createElement('a');
    link.href = '#';
    link.innerHTML = linkHTML;
    Classlist(link).add('dqpl-skip-link');
    links.push(link);

    link.addEventListener('click', (e) => {
      e.preventDefault();
      // ensure its focusable
      skipTarget.tabIndex = skipTarget.tabIndex === 0 ? 0 : -1;
      // focus it
      skipTarget.focus();

      if (main && (skipTarget === main)) {
        main.scrollTop = 0;
      } else {
        skipTarget.scrollIntoView(true);
      }

      if (shouldRemove) {
        skipTarget.removeEventListener('blur', onSkipTargetBlur);
        skipTarget.addEventListener('blur', onSkipTargetBlur);
      }

      function onSkipTargetBlur() {
        skipTarget.removeAttribute('tabindex');
        skipTarget.removeEventListener('blur', onSkipTargetBlur);
      }
    });
  });

  let parent = skipContainer;
  if (links.length > 1) {
    const ul = document.createElement('ul');
    Classlist(ul).add('dqpl-skip-list');
    skipContainer.appendChild(ul);
    parent = ul;
  }

  links.forEach((link) => {
    if (links.length > 1) {
      const li = document.createElement('li');
      parent.appendChild(li);
      li.appendChild(link);
    } else {
      parent.appendChild(link);
    }
  });
};
