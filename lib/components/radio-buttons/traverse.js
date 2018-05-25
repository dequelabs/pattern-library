'use strict';

import setSelected from './set-selected';
import closest from 'closest';
import queryAll from '../../commons/query-all';
const enabled = (r) => r.getAttribute('aria-disabled') !== 'true';

/**
 * Traverses to adjacent radio button
 * @param  {HTMLElement} radio  the starting point element
 * @param  {Array} radios       the radio buttons in the group
 * @param  {String} dir         "next" or "prev" - the direction to traverse
 */
module.exports = (radio, radios, dir) => {
  const group = closest(radio, '[role="radiogroup"]');
  const _radios = queryAll('[role="radio"]', group);
  const enableds = _radios.filter(enabled);
  if (enableds.length <= 1) { return; }
  const isNext = dir === 'next';
  const currentIndex = enableds.indexOf(radio);
  let adjacentIndex = isNext ? currentIndex + 1 : currentIndex - 1;
  if (!enableds[adjacentIndex]) {
    adjacentIndex = isNext ? 0 : enableds.length - 1;
  }
  // configure selected/unselected state and focus
  setSelected(_radios, enableds[adjacentIndex], true);
};

