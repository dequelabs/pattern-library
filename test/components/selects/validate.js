'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');

describe('components/selects/validate', () => {
  it('should call debug if the combobox is missing the "combobox" role', function () {
    const c = document.createElement('div');
    const l = document.createElement('div');
    l.setAttribute('role', 'listbox');
    let called = false
    proxyquire('../../../lib/components/selects/validate', {
      'debug': () => {
        return function () {
          called = true;
        }
      }
    })(c, l);

    assert.isTrue(called);
  });
  it('should call debug if the listbox is missing the "listbox" role', () => {
    const c = document.createElement('div');
    const l = document.createElement('div');
    c.setAttribute('role', 'combobox');
    let called = false
    proxyquire('../../../lib/components/selects/validate', {
      'debug': () => {
        return function () {
          called = true;
        }
      }
    })(c, l);

    assert.isTrue(called);
  });
});
