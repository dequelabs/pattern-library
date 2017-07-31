'use strict';

const assert = require('chai').assert;
const snippet = require('./fixture.html');
const Fixture = require('../../../fixture');
const aria = require('../../../../lib/commons/dialog/aria');

describe('commons/aria', () => {
  let fixture, element, parent1, parent2, parent3, alreadyHidden, trigger, icon;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    element = el.querySelector('.dqpl-modal');
    parent1 = el.querySelector('#parent-1');
    parent2 = el.querySelector('#parent-2');
    parent3 = el.querySelector('#parent-3');
    alreadyHidden = el.querySelector('#sibling-1');
    icon = element.querySelector('.fa-close');
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
      aria.show(element);

      els.forEach((el) => {
        const ah = el.getAttribute('aria-hidden');
        if (el === alreadyHidden) {
          assert.equal(ah, 'true');
        } else {
          assert.isNull(ah);
        }
      });
    });

    it('should not remove aria-hidden from elements within the modal', () => {
      const isHidden = () => icon.getAttribute('aria-hidden') === 'true';
      assert.isTrue(isHidden());
      aria.show(element);
      assert.isTrue(isHidden());
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
