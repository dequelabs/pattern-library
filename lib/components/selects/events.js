'use strict';

import delegate from 'delegate';
import Classlist from 'classlist';
import LiveRegion from 'live-region';
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

module.exports = (combobox, listbox) => {
  const liveRegion = new LiveRegion({
    ariaLive: 'polite'
  });

  /**
   * attach native label click to focus control behavior
   */

  const label = getLabel(combobox, '.dqpl-field-wrap', '.dqpl-label, .dqpl-label-inline');
  if (label) {
    label.addEventListener('click', () => combobox.focus());
  }

  /**
   * Combobox events
   */

  combobox.addEventListener('click', () => {
    Classlist(listbox).toggle('dqpl-listbox-show');
    const hasShowClass = Classlist(listbox).contains('dqpl-listbox-show');
    // set expanded state
    combobox.setAttribute('aria-expanded', hasShowClass ? 'true' : 'false');
    if (hasShowClass) { open(combobox, listbox); }
  });

  combobox.addEventListener('keydown', (e) => {
    const which = e.which;

    switch (which) {
      case 38: // up
      case 40: // down
        e.preventDefault();
        if (Classlist(listbox).contains('dqpl-listbox-show')) {
          arrow({
            key: which,
            combobox: combobox,
            listbox: listbox,
            liveRegion: liveRegion
          });
        } else {
          open(combobox, listbox);
        }
        break;
      case 13: // enter
      case 32: // space
        e.preventDefault();
        if (Classlist(listbox).contains('dqpl-listbox-show')) {
          select(combobox, listbox);
        } else {
          open(combobox, listbox);
        }
        break;
      case 27: // escape
        if (Classlist(listbox).contains('dqpl-listbox-show')) {
          // restore previously selected
          const cachedSelected = listbox.getAttribute('data-cached-selected');
          combobox.setAttribute('aria-activedescendant', cachedSelected);
          Classlist(listbox).remove('dqpl-listbox-show');
          combobox.setAttribute('aria-expanded', 'false');
        }
        break;
      default:
        // TODO: letters / numbers might not cut it...should probably allow any character
        if (isLetterOrNum(which)) {
          open(combobox, listbox);
          search(which, combobox, listbox);
        }
    }
  });

  combobox.addEventListener('blur', onComboBlur);

  function onComboBlur() {
    const wasVisible = Classlist(listbox).contains('dqpl-listbox-show');

    Classlist(listbox).remove('dqpl-listbox-show');
    combobox.setAttribute('aria-expanded', 'false');

    const cached = listbox.getAttribute('data-cached-selected');
    if (cached && wasVisible) {
      combobox.getAttribute('aria-activedescendant', cached);
    }
  }

  /**
   * Listbox events
   */

  delegate(listbox, '[role="option"]', 'mousedown', (e) => {
    const option = e.delegateTarget;
    // detach blur events so the list doesn't close
    combobox.removeEventListener('blur', onComboBlur);
    combobox.setAttribute('aria-activedescendant', option.id);

    activate(combobox, listbox, true);
    select(combobox, listbox, true);

    document.removeEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseUp() {
    combobox.focus();
    Classlist(listbox).remove('dqpl-listbox-show');
    combobox.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mouseup', onMouseUp);
  }
};
