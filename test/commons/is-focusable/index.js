'use strict';

const assert = require('chai').assert;
const isFocusable = require('../../../lib/commons/is-focusable');

describe('commons/is-focusable', () => {
  it('should properly determine if the element is focusable', () => {
    const a = document.createElement('a');
    a.href = '#';
    const aNoHref = document.createElement('a');
    const enabledButton = document.createElement('button');
    enabledButton.type = 'button';
    const disabledButton = document.createElement('button');
    disabledButton.disabled = true;
    const enabledInput = document.createElement('input');
    enabledInput.type = 'text';
    const disabledInput = document.createElement('input');
    disabledInput.type = 'text';
    disabledInput.disabled = true;
    const focusableDiv = document.createElement('div');
    focusableDiv.tabIndex = 0;
    const nonFocusableDiv = document.createElement('div');

    [enabledButton, enabledInput, focusableDiv].forEach((el) => {
      assert.isTrue(isFocusable(el));
    });

    [aNoHref, disabledButton, disabledInput, nonFocusableDiv].forEach((el) => {
      assert.isFalse(isFocusable(el));
    });
  });
});
