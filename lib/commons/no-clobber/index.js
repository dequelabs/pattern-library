'use strict';

import rndid from '../rndid';

/**
 * Handles not clobbering existing values in token list attributes
 * @param  {HTMLElement} target the target element for the attr to be added
 * @param  {HTMLElement} ref    the element that target is being associated with
 * @param  {String} attr        the attr to be added (defaults to 'aria-describedby')
 */
module.exports = (target, ref, attr) => {
  attr = attr || 'aria-describedby';
  ref.id = ref.id || rndid(); // ensure it has an id
  const existingVal = target.getAttribute(attr);
  const values = existingVal ? existingVal.split(' ') : [];
  // prevent duplicates
  if (values.indexOf(ref.id) > -1) { return; }

  values.push(ref.id);
  target.setAttribute(attr, values.join(' ').trim());
};
