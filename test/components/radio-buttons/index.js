'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');

describe('components/radio-buttons/', () => {
  it('should call setup', () => {
    let called = false;
    const entry = proxyquire('../../../lib/components/radio-buttons', {
      './setup': () => called = true
    });

    entry();

    assert.isTrue(called);
  });
});
