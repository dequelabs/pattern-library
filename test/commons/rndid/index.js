'use strict';

require('babel-polyfill');
const assert = require('chai').assert;
const rndid = require('../../../lib/commons/rndid');

describe('commons/rndid', () => {
  describe('len', () => {
    it('should default to 8', () => {
      assert.equal(rndid().length, 8);
    });

    it('should accept len as the argument', () => {
      const LEN = 40;
      assert.equal(rndid(LEN).length, LEN);
    });
  });
});
