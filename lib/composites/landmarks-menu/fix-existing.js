'use strict';

const delegate = require('delegate');
const debug = require('debug')('dqpl:composites:landmarks-menu');

module.exports = (shouldRemove) => {
  delegate(document.body, '.dqpl-skip-link', 'click', (e) => {
    e.preventDefault();
    const link = e.delegateTarget;
    const href = link.getAttribute('href');
    const landing = href && document.querySelector(href);

    if (!landing) {
      return debug('Unable to calculate landing for skip link: ', link);
    }

    // ensure focusability
    landing.tabIndex = landing.tabIndex === 0 ? 0 : -1;
    // focus it
    landing.focus();
    // tabindex cleanup
    if (shouldRemove) {
      landing.addEventListener('blur', onLandingBlur);
    }

    function onLandingBlur() {
      landing.removeAttribute('tabindex');
      landing.removeEventListener('blur', onLandingBlur);
    }
  });
};
