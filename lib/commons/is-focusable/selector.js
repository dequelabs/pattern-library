'use strict';

/**
 * Selector for naturally focusable elements
 */
module.exports = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'area[href]',
  'iframe',
  'object',
  'embed',
  '[tabindex="0"]',
  '[contenteditable]'
].join(', ');
