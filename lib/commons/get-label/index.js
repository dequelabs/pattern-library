'use strict';

const closest = require('closest');

/**
 * Find form field's label element
 * @param  {HTMLElement} el         the field element
 * @param  {String} parentSelector  the selector for the common parent of the field and label
 * @param  {String} labelSelector   the selector for the label element (qualified within the parent)
 * @return {HTMLElement}            the label element
 */
module.exports = (el, parentSelector, labelSelector) => {
  const dataLabelId = el.getAttribute('data-label-id');
  if (dataLabelId) {
    return document.getElementById(dataLabelId);
  }

  const parent = closest(el, parentSelector);
  return parent && parent.querySelector(labelSelector);
};
