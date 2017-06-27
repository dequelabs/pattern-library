'use strict';

const assert = require('chai').assert;
const getTopLevels = require('../../../../lib/composites/menu/utils/get-top-level-items');

describe('composites/menu/utils/get-top-level-items', () => {
  it('should return the expected items', () => {
    const div = document.createElement('div');
    div.innerHTML = [
      '<ul>',
      '<li role="menuitem"><div role="menuitem">a</div></li>',
      '<li role="menuitem">a</li>',
      '</ul>'
    ].join('');
    document.body.appendChild(div);
    const tls = getTopLevels(div.querySelector('ul'));
    assert.equal(2, tls.length);
  });
});
