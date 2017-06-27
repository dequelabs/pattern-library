'use strict';

const assert = require('chai').assert;
const isOutside = require('../../../lib/commons/is-outside');

describe('commons/is-outside', () => {
  it('should properly check if the target is outside of the selector', () => {
    const div = () => document.createElement('div');
    const container = div();
    const other = div();
    container.className = 'container';
    const child1 = div();
    const child2 = div();

    container.appendChild(child1);
    container.appendChild(child2);

    document.body.appendChild(container);
    document.body.appendChild(other);

    assert.isFalse(isOutside(child1, '.container'));
    assert.isFalse(isOutside(child2, '.container'));
    // check self
    assert.isFalse(isOutside(container, '.container'));
    assert.isTrue(isOutside(other, '.container'));
  });
});
