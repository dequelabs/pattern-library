'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const Classlist = require('classlist');
const snippet = require('./fixture.html');
const Fixture = require('../../../fixture');
const close = require('../../../../lib/commons/dialog/close');


describe('commons/dialog/close', () => {
  let fixture, element, trigger;
  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    element = el.querySelector('.dqpl-modal');
    trigger = document.querySelector(`[data-dialog-id="${element.id}"]`);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should add the proper classes', () => {
    // throw the show classes on the modal/body
    Classlist(element).add('dqpl-dialog-show');
    Classlist(document.body).add('dqpl-open');
    close(element);
    assert.isFalse(Classlist(element).contains('dqpl-dialog-show'));
    assert.isFalse(Classlist(document.body).contains('dqpl-open'));
  });

  it('should call aria-show', () => {
    let called = false;
    proxyquire('../../../../lib/commons/dialog/close', {
      '../aria': {
        show: () => called = true
      }
    })(element);

    assert.isTrue(called);
  });

  it('should focus the trigger', () => {
    close(element);
    assert.equal(trigger, document.activeElement);
  });

  it('should call debug if trigger is not found', () => {
    let called = false;
    trigger.parentNode.removeChild(trigger);
    proxyquire('../../../../lib/commons/dialog/close', {
      'debug': () => {
        return function () { called = true; };
      }
    })(element);

    assert.isTrue(called);
  });
});
