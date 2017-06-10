'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const Classlist = require('classlist');
const snippet = require('./fixture.html');
const Fixture = require('../../fixture');
const close = require('../../../lib/composites/modals/close');

describe('composites/modals/close', () => {
  let fixture, modal, trigger;
  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    modal = el.querySelector('.dqpl-modal');
    trigger = el.querySelector('.dqpl-button-secondary');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should add the proper classes', () => {
    // throw the show classes on the modal/body
    Classlist(modal).add('dqpl-modal-show');
    Classlist(document.body).add('dqpl-modal-open');
    close(modal);
    assert.isFalse(Classlist(modal).contains('dqpl-modal-show'));
    assert.isFalse(Classlist(document.body).contains('dqpl-modal-open'));
  });

  it('should call aria-show', () => {
    let called = false;
    proxyquire('../../../lib/composites/modals/close', {
      './aria': {
        show: () => called = true
      }
    })(modal);

    assert.isTrue(called);
  });

  it('should focus the trigger', () => {
    close(modal);
    assert.equal(trigger, document.activeElement);
  });

  it('should call debug if trigger is not found', () => {
    let called = false;
    trigger.parentNode.removeChild(trigger);
    proxyquire('../../../lib/composites/modals/close', {
      'debug': () => {
        return function () { called = true; };
      }
    })(modal);

    assert.isTrue(called);
  });
});
