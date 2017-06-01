'use strict';

const assert = require('chai').assert;
var checkboxEntry = require('../../../lib/components/checkboxes/');

describe('components/checkboxes/index', () => {
  it('should be a function', () => {
    assert.equal('function', typeof checkboxEntry);
  });
});
