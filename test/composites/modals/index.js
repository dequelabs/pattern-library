'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const fire = require('simulant').fire;
const snippet = require('./fixture.html');
const Fixture = require('../../fixture');
const global = require('../../../lib/global');
const index = require('../../../lib/composites/modals/');

describe('composites/modals', () => {
  let fixture, element, trigger;
  before(() => {
    fixture = new Fixture();
    // NOTE: only call this once so delegated
    // events don't get attached multiple times
    global();
    index();
  });

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    element = el.querySelector('.dqpl-modal');
    trigger = document.querySelector(`[data-dialog-id="${element.id}"]`);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('clicking a trigger', () => {
    it('should call not attempt to open the modal if it cannot be found', () => {
      trigger.removeAttribute('data-dialog-id');
      fire(trigger, 'click');
      assert.isFalse(Classlist(element).contains('dqpl-dialog-show'));
    });

    it('should open the modal', () => {
      fire(trigger, 'click');
      assert.isTrue(Classlist(element).contains('dqpl-dialog-show'));
    });
  });

  describe('clicking a close/cancel button', () => {
    it('should call close', () => {
      fire(trigger, 'click'); // open the modal
      assert.isTrue(Classlist(element).contains('dqpl-dialog-show'));
      const close = element.querySelector('.dqpl-close');
      fire(close, 'click');
      assert.isFalse(Classlist(element).contains('dqpl-dialog-show'));
    });
  });

  describe('keydowns on modals', () => {
    describe('escape', () => {
      it('should call close', () => {
        fire(trigger, 'click'); // open the modal
        assert.isTrue(Classlist(element).contains('dqpl-dialog-show'));
        fire(element, 'keydown', { which: 27 });
        assert.isFalse(Classlist(element).contains('dqpl-dialog-show'));
      });

      it('should not call close if `data-force-action` is set', () => {
        fire(trigger, 'click'); // open the modal
        element.setAttribute('data-force-action', 'true');
        fire(element, 'keydown', { which: 27 });
        assert.isTrue(Classlist(element).contains('dqpl-dialog-show'));
      });
    });
  });
});
