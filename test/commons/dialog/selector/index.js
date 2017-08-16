'use strict';

const assert = require('chai').assert;

describe('commons/dialog/selector', () => {
  it('should export a string', () => {
    assert.equal('string', typeof require('../../../../lib/commons/dialog/selector'));
  });
});
