'use strict';

const assert = require('chai').assert;
const snippet = require('./fixture.html');
const Fixture = require('../../fixture');
const aria = require('../../../lib/commons/aria');

describe('commons/aria', () => {
  let fixture, element, parent1, parent2, parent3, alreadyHidden, trigger;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    element = el.querySelector('.dqpl-modal');
    parent1 = el.querySelector('#parent-1');
    parent2 = el.querySelector('#parent-2');
    parent3 = el.querySelector('#parent-3');
    alreadyHidden = el.querySelector('#sibling-1');
    trigger = document.querySelector(`[data-id="${element.id}"]`);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('show', () => {
    it('should remove aria-hidden from all elements except those with "data-already-aria-hidden" attr', () => {
      const els = [element, parent1, parent2, parent3, alreadyHidden, trigger];
      // add aria-hidden to everything
      els.forEach((el) => el.setAttribute('aria-hidden', 'true'));
      alreadyHidden.setAttribute('data-already-aria-hidden', 'true');
      aria.show();

      els.forEach((el) => {
        const ah = el.getAttribute('aria-hidden');
        if (el === alreadyHidden) {
          assert.equal(ah, 'true');
        } else {
          assert.isNull(ah);
        }
      });
    });
  });

  describe('hide', () => {
    it('should hide everything except direct parents of the modal (and the modal itself) passed in', () => {
      aria.hide(element);

      [alreadyHidden, trigger].forEach((el) => {
        assert.equal(el.getAttribute('aria-hidden'), 'true');
        if (el === alreadyHidden) {
          assert.equal(el.getAttribute('data-already-aria-hidden'), 'true');
        }
      });

      assert.notEqual(element.getAttribute('aria-hidden'), 'true');
    });
  });
});
