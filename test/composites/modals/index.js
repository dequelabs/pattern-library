'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const fire = require('simulant').fire;
const snippet = require('./fixture.html');
const Fixture = require('../../fixture');
const index = require('../../../lib/composites/modals/');

describe('composites/modals', () => {
  let fixture, element, trigger;
  before(() => {
    fixture = new Fixture();
    // NOTE: only call this once so delegated
    // events don't get attached multiple times
    index();
  });

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    element = el.querySelector('.dqpl-modal');
    trigger = document.querySelector(`[data-id="${element.id}"]`);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('clicking a trigger', () => {
    it('should call not attempt to open the modal if it cannot be found', () => {
      trigger.removeAttribute('data-id');
      fire(trigger, 'click');
      assert.isFalse(Classlist(element).contains('dqpl-show'));
    });

    it('should open the modal', () => {
      fire(trigger, 'click');
      assert.isTrue(Classlist(element).contains('dqpl-show'));
    });
  });

  describe('clicking a close/cancel button', () => {
    it('should call close', () => {
      fire(trigger, 'click'); // open the modal
      assert.isTrue(Classlist(element).contains('dqpl-show'));
      const close = element.querySelector('.dqpl-close');
      fire(close, 'click');
      assert.isFalse(Classlist(element).contains('dqpl-show'));
    });
  });

  describe('keydowns on modals', () => {
    describe('escape', () => {
      it('should call close', () => {
        fire(trigger, 'click'); // open the modal
        assert.isTrue(Classlist(element).contains('dqpl-show'));
        fire(element, 'keydown', { which: 27 });
        assert.isFalse(Classlist(element).contains('dqpl-show'));
      });
    });

    describe('shift + tab on the first focusable element within modal', () => {
      it('should focus the last focusable element in the modal', () => {
        fire(trigger, 'click'); // open the modal
        const lastFocusable = element.querySelector('.dqpl-cancel');
        const firstFocusable = element.querySelector('.dqpl-close');
        fire(firstFocusable, 'keydown', { which: 9, shiftKey: true });
        assert.equal(document.activeElement, lastFocusable);
      });
    });

    describe('tab on the last focusable element within the modal', () => {
      it('should focus the first element', () => {
        fire(trigger, 'click'); // open the modal
        const lastFocusable = element.querySelector('.dqpl-cancel');
        const firstFocusable = element.querySelector('.dqpl-close');
        fire(lastFocusable, 'keydown', { which: 9, shiftKey: false });
        assert.equal(document.activeElement, firstFocusable);
      });
    });
  });

  describe('shift+tab on the modal\'s h2', () => {
    it('should focus the last focusable element within the modal', () => {
      fire(trigger, 'click'); // open the modal
      const h2 = element.querySelector('h2');
      const lastFocusable = element.querySelector('.dqpl-cancel');
      fire(h2, 'keydown', { which: 9, shiftKey: true });
      assert.equal(document.activeElement, lastFocusable);
    });
  });
});
