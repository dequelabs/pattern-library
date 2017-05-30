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

module.exports = (el) => el.getAttribute('data-skip-to-name') || getLabel(el) || el.getAttribute('role');
