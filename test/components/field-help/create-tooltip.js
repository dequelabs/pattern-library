'use strict';

const Classlist = require('classlist');
const assert = require('chai').assert;
const createTooltip = require('../../../lib/components/field-help/create-tooltip');

describe('lib/components/field-help/create-tooltip', () => {
  it('should be a function', () => {
    assert.equal(typeof createTooltip, 'function');
  });

  it('should create the tooltip (with proper class, text, and roles)', () => {
    const tip = createTooltip('BOOGNISH');
    assert.isTrue(!!tip);
    assert.equal('tooltip', tip.getAttribute('role'));
    assert.isTrue(Classlist(tip).contains('dqpl-tooltip'));
    assert.equal(tip.innerText, 'BOOGNISH');
  });
});
