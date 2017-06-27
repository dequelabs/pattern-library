'use strict';

const assert = require('chai').assert;
const queryAll = require('../../../lib/commons/query-all');

describe('commons/query-all', () => {
  it('should return an array (NOT a NodeList)', () => {
    const things = queryAll('.asdf');
    assert.isTrue(Array.isArray(things));
    assert.isTrue(things instanceof Array);
    assert.isFalse(things instanceof NodeList);
  });

  describe('context', () => {
    it('should default to the document', () => {
      const foo = document.createElement('div');
      foo.className = 'foo';
      const otherFoo = document.createElement('div');
      otherFoo.className = 'foo';

      document.body.appendChild(foo);
      document.body.appendChild(otherFoo);

      const foos = queryAll('.foo');
      assert.equal(foos.length, 2);
    });

    it('should query within context passed in', () => {
      const foo = document.createElement('div');
      foo.className = 'foo';
      const otherFoo = document.createElement('div');
      otherFoo.className = 'foo';
      const wrapper = document.createElement('div');
      wrapper.className = 'wrapper';

      wrapper.appendChild(foo);
      document.body.appendChild(wrapper);
      document.body.appendChild(otherFoo);

      const wrapperFoos = queryAll('.foo', wrapper);
      assert.equal(wrapperFoos.length, 1);
      assert.equal(wrapperFoos[0], foo);
    });
  });
});
