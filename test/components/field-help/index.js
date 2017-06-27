'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const fieldHelpEntry = require('../../../lib/components/field-help');

describe('components/field-help/index', () => {
  it('should be a function', () => {
    assert.equal('function', typeof fieldHelpEntry);
  });

  it('should call field-help/setup', () => {
    let called = false;
    const f = proxyquire('../../../lib/components/field-help', {
      './setup': () => called = true
    });

    f();
    assert.isTrue(called);
  });
});
