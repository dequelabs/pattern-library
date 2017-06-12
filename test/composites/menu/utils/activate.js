'use strict';

const assert = require('chai').assert;
const activate = require('../../../../lib/composites/menu/utils/activate');

describe('composites/menu/utils/activate', () => {
  it('should configure tabindex properly and focus the newly active', () => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');

    document.body.appendChild(div1);
    document.body.appendChild(div2);

    activate(div1, div2);
    assert.equal(div1.tabIndex, -1);
    assert.equal(div2.tabIndex, 0);
    assert.equal(document.activeElement, div2);
  });
});
