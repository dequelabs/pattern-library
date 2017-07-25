'use strict';

const assert = require('chai').assert;
const snippet = require('./fixture.html');
const Fixture = require('../../../fixture');
const sizer = require('../../../../lib/commons/dialog/sizer');

describe('commons/sizer', () => {
  let fixture, element;
  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    element = el.querySelector('.dqpl-modal');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should set modal content maxHeight', () => {
    sizer(element);
    assert.isNotNull(element.querySelector('.dqpl-content').style.maxHeight);
  });
});
