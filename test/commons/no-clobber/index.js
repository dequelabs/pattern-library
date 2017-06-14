'use strict';

const assert = require('chai').assert;
const noClobber = require('../../../lib/commons/no-clobber');
const element = (tag) => document.createElement(tag || 'div');

describe('commons/no-clobber', () => {
  let target, ref;

  beforeEach(() => {
    target = element();
    ref = element();
    document.body.appendChild(target);
    document.body.appendChild(ref);
  });

  afterEach(() => {
    target.parentNode.removeChild(target);
    ref.parentNode.removeChild(ref);
  });

  describe('attr param', () => {
    it('should default to aria-describedby if no attr is provided', () => {
      noClobber(target, ref);

      assert.equal(target.getAttribute('aria-describedby'), ref.id);
    });

    it('should set the provided attr', () => {
      noClobber(target, ref, 'aria-boognish');
      assert.equal(target.getAttribute('aria-boognish'), ref.id);
    });
  });

  describe('id', () => {
    describe('given a ref without an id', () => {
      it('should assign an id to ref', () => {
        assert.isFalse(!!ref.id);
        noClobber(target, ref);
        assert.isTrue(!!ref.id);
      });
    });

    describe('given a ref with an id', () => {
      it('should not clobber the existing id', () => {
        const expectedID = 'foo';
        ref.id = expectedID;
        noClobber(target, ref);
        assert.equal(ref.id, expectedID);
      });
    });
  });

  describe('given an existing value', () => {
    it('should no clobber the existing value', () => {
      target.setAttribute('aria-labelledby', 'cats dogs');
      ref.id = 'rain';
      noClobber(target, ref, 'aria-labelledby');
      assert.equal(target.getAttribute('aria-labelledby'), 'cats dogs rain');
    });
  });

  describe('given a duplicate', () => {
    it('should not include the duplicate token value', () => {
      target.setAttribute('aria-labelledby', 'cats dogs');
      ref.id = 'cats';
      noClobber(target, ref, 'aria-labelledby');
      assert.equal(target.getAttribute('aria-labelledby'), 'cats dogs');
    });
  });
});
