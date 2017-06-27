'use strict';

import closest from 'closest';
import isVisible from '../is-visible';
import queryAll from '../query-all';

const isEnabled = (el) => el.getAttribute('aria-disabled') !== 'true';

/**
 * Finds adjacent menu item
 * @param  {HTMLElement} target the base item
 * @param  {String} dir         direction of desired adjacent item ("next" or "prev")
 * @return {HTMLElement}        the adjacent item
 */
module.exports = (target, dir) => {
  const isDown = dir === 'down';
  const menu = closest(target, '[role="menu"]'); // TODO: Open this up to more than just menus?
  const items = menu && queryAll('[role="menuitem"]', menu).filter(isVisible).filter(isEnabled);

  if (!items || !items.length) { return; }

  const currentIndex = items.indexOf(target);
  const adjacentIndex = isDown ? currentIndex + 1 : currentIndex - 1;
  let item = items[adjacentIndex];

  if (!item) {
    item = items[isDown ? 0 : items.length - 1];
  }

  return item;
};
