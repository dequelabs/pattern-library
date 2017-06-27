'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const checkboxEntry = require('../../../lib/components/checkboxes/');

describe('components/checkboxes/index', () => {
  it('should be a function', () => {
    assert.equal('function', typeof checkboxEntry);
  });

  it('should call checkboxes/attributes', () => {
    let called = false;
    const cBox = proxyquire('../../../lib/components/checkboxes/', {
      './attributes': () => {
        called = true;
      }
    });

    cBox();
    assert.isTrue(called);
  });

  it('should call checkboxes/events', () => {
    let called = false;
    const cBox = proxyquire('../../../lib/components/checkboxes/', {
      './events': () => {
        called = true;
      }
    });

    cBox();
    assert.isTrue(called);
  });
});
