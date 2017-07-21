'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const fire = require('simulant').fire;
const snippet = require('./fixture.html');
const Fixture = require('../../fixture');
const index = require('../../../lib/composites/alert/');

describe('composites/alert', () => {
  let fixture, element, trigger;
  before(() => {
    fixture = new Fixture();

    index();
  });

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    element = el.querySelector('.dqpl-alert');
    trigger = document.querySelector(`[data-alert-id="${element.id}"]`);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('clicking a trigger', () => {
    it('should call not attempt to open the alert if it cannot be found', () => {
      trigger.removeAttribute('data-alert-id');
      fire(trigger, 'click');
      assert.isFalse(Classlist(element).contains('dqpl-show'));
    });

    it('should show the alert', () => {
      fire(trigger, 'click');
      assert.isTrue(Classlist(element).contains('dqpl-show'));
    });
  });

  describe('keydowns on modals', () => {
    describe('escape', () => {
      it('should NOT call close', () => {
        fire(trigger, 'click'); // Shows the alert
        assert.isTrue(Classlist(element).contains('dqpl-show'));
        fire(element, 'keydown', { which: 27 });
        assert.isTrue(Classlist(element).contains('dqpl-show'));
      });
    });

    describe('shift + tab on the first focusable element within alert', () => {
      it('should focus the last focusable element in the alert', () => {
        fire(trigger, 'click'); // Shows the alert
        const lastFocusable = element.querySelector('.dqpl-buttons .dqpl-button-secondary');
        const firstFocusable = element.querySelector('.dqpl-buttons .dqpl-button-primary');
        fire(firstFocusable, 'keydown', { which: 9, shiftKey: true });
        assert.equal(document.activeElement, lastFocusable);
      });
    });

    describe('tab on the last focusable element within the alert', () => {
      it('should focus the first element', () => {
        fire(trigger, 'click'); // Shows the alert
        const lastFocusable = element.querySelector('.dqpl-buttons .dqpl-button-secondary');
        const firstFocusable = element.querySelector('.dqpl-buttons .dqpl-button-primary');
        fire(lastFocusable, 'keydown', { which: 9, shiftKey: false });
        assert.equal(document.activeElement, firstFocusable);
      });
    });
  });
});
