'use strict';

import Classlist from 'classlist';
import queryAll from '../../commons/query-all';
import isSelected from '../../commons/is-selected';
import getLabel from '../../commons/get-label';

const debug = require('debug')('dqpl:components:checkboxes');
let cached = [];

/**
 * Sets attributes/classes/disable-enable event hooks for checkboxes
 */
module.exports = () => {
  const checkboxes = queryAll('.dqpl-checkbox:not(.dqpl-overlay-checkbox)');

  checkboxes.forEach((box) => {
    // only update ones we haven't already touched
    if (cached.indexOf(box) > -1) { return; }
    cached.push(box);

    const isSel = isSelected(box);
    const isDis = box.getAttribute('aria-disabled') === 'true';

    if (box.getAttribute('role') !== 'checkbox') {
      debug('role="checkbox" missing from checkbox: ', box);
    }

    const iconClass = isSel ? 'fa-check-square' : 'fa-square-o';
    // create the inner checkbox element for the icon
    const inner = document.createElement('div');
    Classlist(inner)
      .add('dqpl-inner-checkbox')
      .add('fa')
      .add(isDis ? 'fa-square' : iconClass);
    box.appendChild(inner);

    box.tabIndex = 0;
    box.setAttribute('aria-checked', isSel ? 'true' : 'false');


    const label = getLabel(
      box,
      '.dqpl-field-wrap, .dqpl-checkbox-wrap',
      '.dqpl-label, .dqpl-label-inline'
    );

    if (label) {
      if (isDis) { Classlist(label).add('dqpl-label-disabled'); }
      label.addEventListener('click', () => {
        box.click();
        box.focus();
      });
    }

    /**
     * Enable / disable events
     */

    box.addEventListener('dqpl:checkbox:disable', () => {
      debug('dqpl:checkbox:disable fired - disabling: ', box);
      box.setAttribute('aria-disabled', 'true');

      Classlist(inner)
        .remove('fa-check-square')
        .remove('fa-square-o')
        .remove('fa-square')
        .add(isSelected(box) ? 'fa-check-square' : 'fa-square');

      if (label) { Classlist(label).add('dqpl-label-disabled'); }
    });

    box.addEventListener('dqpl:checkbox:enable', () => {
      debug('dqpl:checkbox:enable fired - enabling: ', box);
      box.removeAttribute('aria-disabled');

      Classlist(inner)
        .remove('fa-check-square')
        .remove('fa-square-o')
        .remove('fa-square')
        .add(isSelected(box) ? 'fa-check-square' : 'fa-square-o');

      if (label) { Classlist(label).remove('dqpl-label-disabled'); }
    });
  });
};
