'use strict';

/**
 * Determine whether an element is visible
 *
 * @param {HTMLElement} el The HTMLElement
 * @param {Boolean} screenReader When provided, will evaluate visibility from the perspective of a screen reader
 * @return {Boolean} The element's visibilty status
 */
module.exports = isVisible;
// TODO: Test that this actually works
function isVisible(el, screenReader, recursed) {
  let style;
  const nodeName = el.nodeName.toUpperCase();
  const parent = el.parentNode;

	// 9 === Node.DOCUMENT
	if (el.nodeType === 9) { return true; }

	style = window.getComputedStyle(el, null);
	if (style === null) { return false; }

  const isDisplayNone = style.getPropertyValue('display') === 'none';
  const isInvisibleTag = nodeName.toUpperCase() === 'STYLE' || nodeName.toUpperCase() === 'SCRIPT';
  const srHidden = screenReader && el.getAttribute('aria-hidden') === 'true';
  const isInvisible = !recursed && style.getPropertyValue('visibility') === 'hidden';

  if (isDisplayNone || isInvisibleTag || srHidden || isInvisible) {
    return false;
  }

	if (parent) {
		return isVisible(parent, screenReader, true);
	}

	return false;
}
