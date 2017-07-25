'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const snippet = require('./fixture.html');
const fire = require('simulant').fire;
const Fixture = require('../../fixture');
const global = require('../../../lib/global');

describe('global/dialog', () => {
  let fixture, element, trigger;

  before(() => {
    fixture = new Fixture();
    global(); // NOTE: Doing this just once because we don't want to attach multiple delegated listeners
  });

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    element = el.querySelector('.dqpl-modal');
    trigger = document.querySelector(`[data-dialog-id="${element.id}"]`);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should call open', () => {
    let openCalled = false;
    proxyquire('../../../lib/global/dialog', {
      '../../commons/dialog/open': () => openCalled = true
    })(trigger, element);
    fire(trigger, 'click');

    assert.isTrue(openCalled);
  });

  it('should call close', () => {
    let closeCalled = false;
    const cancelBtn = document.querySelector('.dqpl-close');
    proxyquire('../../../lib/global/dialog', {
      '../../commons/dialog/close': () => closeCalled = true
    })(trigger, 'click');

    fire(trigger, 'click');
    fire(cancelBtn, 'click');

    assert.isTrue(closeCalled);
  });
});
