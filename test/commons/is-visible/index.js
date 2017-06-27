'use strict';

const assert = require('chai').assert;
const isVisible = require('../../../lib/commons/is-visible');
const element = (tag, props) => {
  const el = document.createElement(tag || 'div');
  if (props) {
    Object.keys(props).forEach((prop) => {
      el[prop] = props[prop];
    });
  }
  return el;
};

describe('commons/is-visible', () => {
  let el;

  afterEach(() => { // clean up
    if (el && el.parentNode) { el.parentNode.removeChild(el); }
  });

  it('should return false for `display: none;` elements', () => {
    el = element('div', { innerHTML: 'foo' });
    el.style.display = 'none';
    document.body.appendChild(el);
    assert.isFalse(isVisible(el));
  });

  it('should return false for `visibility: hidden;` elements', () => {
    el = element('div', { innerHTML: 'foo' });
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    assert.isFalse(isVisible(el));
  });

  it('should return false for <style />', () => {
    el = element('style', { innerHTML: 'body { color: #00f; }' });
    document.body.appendChild(el);
    assert.isFalse(isVisible(el));
  });

  it('should return false for <script />', () => {
    el = element('script');
    document.body.appendChild(el);
    assert.isFalse(isVisible(el));
  });

  it('should return true for the document', () => {
    assert.isTrue(isVisible(document));
  });

  it('should return true for a visible element', () => {
    el = element('span', { innerHTML: 'Hello world' });
    document.body.appendChild(el);
    assert.isTrue(isVisible(el, true, true));
  });

  describe('given truthy screenReader param', () => {
    it('should return false for an aria-hidden element', () => {
      el = element();
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
      assert.isFalse(isVisible(el, true));
    });
  });

  describe('given a truthy recursed param', () => {
    it('should return false for an element with a invisible parent', () => {
      el = element();
      const child = element('h2', { innerHTML: 'Child' });
      el.style.display = 'none';
      el.appendChild(child);
      document.body.appendChild(el);
      assert.isFalse(isVisible(child, true, true));
    });
  });
});
