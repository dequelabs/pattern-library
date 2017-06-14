'use strict';

const assert = require('chai').assert;
const isSelected = require('../../../lib/commons/is-selected');
const element = (tag) => document.createElement(tag || 'div');

describe('commons/is-selected', () => {
  it('should return true for an element with the "dqpl-selected" class', () => {
    const div = element();
    div.className = 'dqpl-selected';
    assert.isTrue(isSelected(div));
  });

  it('should return true for an element with aria-checked="true"', () => {
    const div = element();
    div.setAttribute('aria-checked', 'true');
    assert.isTrue(isSelected(div));
  });

  it('should return false for an element without selected class / attribute', () => {
    assert.isFalse(isSelected(element()));
  });
});
