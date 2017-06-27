'use strict';

const assert = require('chai').assert;
const snippet = require('./fixture.html');
const Fixture = require('../../fixture');
const sizer = require('../../../lib/composites/modals/sizer');

describe('composites/modals/sizer', () => {
  let fixture, modal;
  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    modal = el.querySelector('.dqpl-modal');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should set modal content maxHeight', () => {
    sizer(modal);
    assert.isNotNull(modal.querySelector('.dqpl-modal-content').style.maxHeight);
  });
});
