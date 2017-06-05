'use strict';

const assert = require('chai').assert;
const queryAll = require('../../../lib/commons/query-all');
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');
const getSelectedIndex = require('../../../lib/components/radio-buttons/get-selected-index');

describe('components/radio-buttons/get-selected-index', () => {
  let fixture;
  before(() => {
    fixture = new Fixture();
    fixture.create(snippet);
  });
  after(() => {
    fixture.destroy().cleanUp();
  });

  it('should return the selected index', () => {
    const radios = queryAll('.dqpl-radio', fixture.element);
    radios[1].setAttribute('aria-checked', 'true');
    assert.equal(1, getSelectedIndex(radios));
  });
});
