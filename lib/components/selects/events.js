'use strict';

import delegate from 'delegate';
import Classlist from 'classlist';
import getLabel from '../../commons/get-label';
import open from './open';
import arrow from './arrow';
import select from './select';
import search from './search';
import activate from './activate';

const isLetterOrNum = (key) => {
  var isLetter = key >= 65 && key <= 90;
  var isNumber = key >= 48 && key <= 57;
  return isLetter || isNumber;
};

module.exports = (listboxButton, listbox) => {
  /**
   * attach native label click to focus control behavior
   */

  const label = getLabel(listboxButton, '.dqpl-field-wrap', '.dqpl-label, .dqpl-label-inline');
  if (label) {
    label.addEventListener('click', () => listboxButton.focus());
  }

  /**
   * listboxButton events
   */

  listboxButton.addEventListener('click', () => {
    Classlist(listbox).toggle('dqpl-listbox-show');
    const hasShowClass = Classlist(listbox).contains('dqpl-listbox-show');
    // set expanded state
    listboxButton.setAttribute('aria-expanded', hasShowClass ? 'true' : 'false');
    if (hasShowClass) { open(listboxButton, listbox); }
  });

  listboxButton.addEventListener('keydown', (e) => {
    if (e.which !== 40) {
      return;
    }

    e.preventDefault();
    open(listboxButton, listbox);
  });

  listbox.addEventListener('keydown', (e) => {
    const which = e.which;

    switch (which) {
      case 38: // up
      case 40: // down
        e.preventDefault();
        arrow({
          key: which,
          listbox
        });
        break;
      case 13: // enter
      case 32: // space
        e.preventDefault();
        select(listboxButton, listbox);
        break;
      case 27: // escape
        // restore previously selected
        const cachedSelected = listbox.getAttribute('data-cached-selected');
        listbox.setAttribute('aria-activedescendant', cachedSelected);
        Classlist(listbox).remove('dqpl-listbox-show');
        listboxButton.setAttribute('aria-expanded', 'false');
        listboxButton.focus();
        break;
      default:
        // TODO: letters / numbers might not cut it...should probably allow any character
        if (isLetterOrNum(which)) {
          search(which, listbox);
        }
    }
  });

  listbox.addEventListener('blur', onListboxBlur);

  function onListboxBlur() {
    Classlist(listbox).remove('dqpl-listbox-show');
    listboxButton.setAttribute('aria-expanded', 'false');

    const cached = listbox.getAttribute('data-cached-selected');
    if (cached) {
      listbox.setAttribute('aria-activedescendant', cached);
    }
  }

  /**
   * Listbox events
   */

  delegate(listbox, '[role="option"]', 'mousedown', (e) => {
    const option = e.delegateTarget;
    // detach blur events so the list doesn't close
    listbox.removeEventListener('blur', onListboxBlur);

    if (option.getAttribute('aria-disabled') === 'true') {
      return setTimeout(() => {
        listboxButton.focus();
        // re-attach blur events so the list closes on blur again
        listbox.addEventListener('blur', onListboxBlur);
      });
    }

    listbox.setAttribute('aria-activedescendant', option.id);

    activate(listbox, true);
    select(listboxButton, listbox, true);

    document.removeEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseUp() {
    listboxButton.focus();
    Classlist(listbox).remove('dqpl-listbox-show');
    listboxButton.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mouseup', onMouseUp);
    // re-attach blur events so the list closes on blur again
    listbox.addEventListener('blur', onListboxBlur);
  }
};
