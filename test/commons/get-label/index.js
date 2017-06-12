'use strict';

const assert = require('chai').assert;
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');
const getLabel = require('../../../lib/commons/get-label/');

describe('commons/get-adjacent-item', () => {
  let fixture, target1, target2, label1, label2;

  before(() => fixture = new Fixture());
  beforeEach(() => {
    fixture.create(snippet);
    target1 = document.getElementById('target-1');
    target2 = document.getElementById('target-2');

    label1 = document.getElementById('label-1');
    label2 = document.getElementById('label-2');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should handle data-label-id', () => {
    const label = getLabel(target1);
    assert.equal(label, label1);
  });

  it('should handle finding label by parent/label selector', () => {
    const label = getLabel(target2, '.parentClass', '.labelClass');
    assert.equal(label, label2);
  });
});
