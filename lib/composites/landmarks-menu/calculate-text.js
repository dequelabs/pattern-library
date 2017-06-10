'use strict';

const idrefsText = (str) => {
  if (!str) { return ''; }
  var result = [], index, length;
  var idrefs = str.trim().replace(/\s{2,}/g, ' ').split(' ');
  for (index = 0, length = idrefs.length; index < length; index++) {
    result.push(document.getElementById(idrefs[index]).textContent);
  }
  return result.join(' ');
};
const getLabel = (el) => {
  return el.getAttribute('aria-label') || idrefsText(el.getAttribute('aria-labelledby'));
};

/**
 * Retrieves an element's label prioritized in the following order:
 * - it's data-skip-to-name attribute
 * - it's aria-label or the value of the element(s)
 *   pointed to in the aria-labelledby attribute
 * = it's role
 * @param  {HTMLElement} el
 * @return {String}
 */
module.exports = (el) => el.getAttribute('data-skip-to-name') || getLabel(el) || el.getAttribute('role');
