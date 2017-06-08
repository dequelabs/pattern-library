'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');


describe('composites/landmarks-menu', () => {
  // TODO: Test that firing dqpl:ready calls init
  it('should call init', () => {
    let called = false;
    proxyquire('../../../lib/composites/landmarks-menu', {
      './init': () => called = true
    })();
    assert.isTrue(called);
  });
});
