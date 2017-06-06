'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');

describe('components/selects/index', () => {
  // TODO: dqpl:ready tests
  it('should call init', () => {
    let called = false;
    proxyquire('../../../lib/components/selects', {
      './init': () => called = true
    })();

    assert.isTrue(called);
  });
});
