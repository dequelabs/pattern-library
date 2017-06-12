'use strict';

const assert = require('chai').assert;
const selector = require('../../../lib/commons/is-focusable/selector');


describe('commons/is-focusable/selector', () => {
  it('should export a string', () => assert.equal('string', typeof selector));
});
