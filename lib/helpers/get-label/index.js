'use strict';

const closest = require('closest');

module.exports = (el, parentSelector, labelSelector) => {
  const dataLabelId = el.getAttribute('data-label-id');
  if (dataLabelId) {
    return document.getElementById(dataLabelId);
  }

  const parent = closest(el, parentSelector);
  return parent && parent.querySelector(labelSelector);
};
