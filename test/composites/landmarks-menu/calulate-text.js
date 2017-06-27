'use strict';

const assert = require('chai').assert;
const calc = require('../../../lib/composites/landmarks-menu/calculate-text');

describe('composites/landmarks-menu/calculate-text', () => {
  describe('given a "data-skip-to-name" attribute', () => {
    it('should return the proper value', () => {
      const expected = 'BOOGNISH';
      const element = document.createElement('div');
      element.setAttribute('data-skip-to-name', expected);
      const val = calc(element);
      assert.equal(val, expected);
    });
  });

  describe('given no "data-skip-to-name" attirubte and an aria-label', () => {
    it('should return the element\'s aria-label', () => {
      const expected = 'BOOGNISH';
      const element = document.createElement('div');
      element.setAttribute('aria-label', expected);
      const val = calc(element);
      assert.equal(val, expected);
    });

    it('should return the element\'s aria-labelledby referenced element\'s text', () => {
      // for this one we actually need to append some elements to the body
      const label1 = document.createElement('div');
      const label2 = document.createElement('div');
      label1.innerHTML = 'mighty';
      label2.innerHTML = 'boognish';
      label1.id = 'foo';
      label2.id = 'bar';
      const element = document.createElement('div');
      element.setAttribute('aria-labelledby', 'foo bar');
      document.body.appendChild(label1);
      document.body.appendChild(label2);
      const val = calc(element);
      assert.equal(val, 'mighty boognish');
    });
  });

  describe('given no "data-skip-to-name" and no aria-label(ledby)', () => {
    it('should return the element\'s role', () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'boognish');
      const val = calc(element);
      assert.equal(val, 'boognish');
    });
  });
});
