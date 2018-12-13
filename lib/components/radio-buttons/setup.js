'use strict';

import Classlist from 'classlist';
import delegate from 'delegate';
import queryAll from '../../commons/query-all';
import getLabel from '../../commons/get-label';
import getSelectedIndex from './get-selected-index';
import setSelected from './set-selected';
import traverse from './traverse';
import SELECTOR from './selector';

const cachedRadios = [];
const cachedGroups = [];
const debug = require('debug')('dqpl:components:radio-buttons');
const isDisabled = (e) => e.getAttribute('aria-disabled') === 'true';

module.exports = () => {
  queryAll('.dqpl-radio-group')
    .forEach((radioGroup) => {
      const radios = queryAll(SELECTOR, radioGroup);
      const selectedIndex = getSelectedIndex(radios);

      /**
       * Attrs / props / markup
       */
      radios.forEach((radio, i) => {
        if (cachedRadios.indexOf(radio) > -1) { return; }
        cachedRadios.push(radio);
        const isSelected = i === selectedIndex;

        // attrs / props
        radio.tabIndex = isSelected ? 0 : -1;
        radio.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        radio.setAttribute('aria-setsize', radios.length);
        radio.setAttribute('aria-posinset', i + 1);

        // validate role
        if (radio.getAttribute('role') !== 'radio') {
          debug('role="radio" missing from: ', radio);
        }

        // add the icon (dqpl-inner-radio)
        let inner = radio.querySelector('.dqpl-inner-radio');

        if (!inner) {
          inner = document.createElement('span');
          inner.setAttribute('aria-hidden', 'true');
          radio.appendChild(inner);
        }

        const iconClass = isSelected ? 'fa-dot-circle-o' : 'fa-circle-o';

        Classlist(inner)
          .remove('fa-dot-circle-o')
          .remove('fa-circle-o')
          .remove('fa-circle')
          .add('fa')
          .add(iconClass)
          .add('dqpl-inner-radio');

        /**
         * Label clicks
         */

        const label = getLabel(
          radio,
          '.dqpl-field-wrap, .dqpl-radio-wrap',
          '.dqpl-label, .dqpl-label-inline'
        );

        if (!label) {
          debug('Unable to find label for: ', label);
        } else {
          label.addEventListener('click', () => {
            radio.click();
            radio.focus();
          });
        }

        /**
         * Enable / disable events
         */

        radio.addEventListener('dqpl:radio:disable', () => {
          debug('dqpl:radio:disable fired - disabling: ', radio);
          const isChecked = radio.getAttribute('aria-checked') === 'true';
          radio.setAttribute('aria-disabled', 'true');
          Classlist(inner)
            .remove('fa-dot-circle-o')
            .remove('fa-circle-o')
            .add(isChecked ? 'fa-dot-circle-o' : 'fa-circle');

          if (label) { Classlist(label).add('dqpl-label-disabled'); }
        });

        radio.addEventListener('dqpl:radio:enable', () => {
          debug('dqpl:radio:enable fired - enabling: ', radio);
          const isChecked = radio.getAttribute('aria-checked') === 'true';
          radio.removeAttribute('aria-disabled');
          Classlist(inner)
            .remove('fa-circle')
            .remove('fa-dot-circle-o')
            .remove('fa-circle-o')
            .add(isChecked ? 'fa fa-dot-circle-o' : 'fa fa-circle-o');

          if (label) { Classlist(label).remove('dqpl-label-disabled'); }
        });
      });

      /**
       * Events
       */

      if (cachedGroups.indexOf(radioGroup) > -1) { return; }
      cachedGroups.push(radioGroup);

      // clicks on radios
      delegate(radioGroup, '[role="radio"]', 'click', (e) => {
        const radio = e.delegateTarget;
        if (isDisabled(radio)) { return; }
        setSelected(radios, radio);
      });

      // keydowns on radios
      delegate(radioGroup, '[role="radio"]', 'keydown', (e) => {
        const which = e.which;
        const target = e.target;

        if (isDisabled(target)) { return; }

        switch (which) {
          case 32:
            e.preventDefault();
            target.click();
            break;
          case 37:
          case 38:
            e.preventDefault();
            traverse(target, radios, 'prev');
            break;
          case 39:
          case 40:
            e.preventDefault();
            traverse(target, radios, 'next');
            break;
        }
      });
    });
};
