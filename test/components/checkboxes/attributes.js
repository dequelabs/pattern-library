'use strict';

const assert = require('chai').assert;
const CustomEvent = require('custom-event');
const Classlist = require('classlist');
const proxyquire = require('proxyquire');
const attributes = require('../../../lib/components/checkboxes/attributes');
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');
const queryAll = require('../../../lib/commons/query-all');
const getLabel = require('../../../lib/commons/get-label');

describe('components/checkboxes/attributes', () => {
  let fixture, checkboxes;

  before(() => fixture = new Fixture());
  beforeEach(() => {
    fixture.create(snippet);
    checkboxes = queryAll('.dqpl-checkbox', fixture.element);
  });
  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should be a function', () => assert.equal(typeof attributes, 'function'));

  it('should warn if role="checkbox" is missing', () => {
    // before hand remove role from a box
    const firstBox = document.querySelector('.dqpl-checkbox');
    firstBox.removeAttribute('role');
    let debugged = false;
    const logger = () => debugged = true;
    const attrs = proxyquire('../../../lib/components/checkboxes/attributes', {
      'debug': () => logger
    });

    attrs();
    assert.isTrue(debugged);
  });

  it('should create dqpl-inner-checkbox elements for each checkbox and add the proper classes', () => {
    attributes();
    checkboxes
      .forEach((checkbox) => {
        const boxList = Classlist(checkbox);
        const isSelected = boxList.contains('dqpl-selected');
        const isDisabled = checkbox.getAttribute('aria-disabled') === 'true';
        const inner = checkbox.querySelector('.dqpl-inner-checkbox');
        const innerList = Classlist(inner);
        // ensure the inner element exists
        assert.isTrue(!!inner);
        // ensure the proper icon classes have been added
        if (isSelected) {
          assert.isTrue(innerList.contains('fa-check-square'));
        } else if (isDisabled) {
          assert.isTrue(innerList.contains('fa-square'));
        } else {
          assert.isTrue(innerList.contains('fa-square-o'));
        }
      });
  });


  it('should ensure tabindex="0" is set', () => {
    attributes();
    checkboxes.forEach((box) => assert.equal(box.tabIndex, 0));
  });

  it('should properly configure initial aria-checked state', () => {
    attributes();
    checkboxes.forEach((box) => {
      const val = Classlist(box).contains('dqpl-selected') ? 'true' : 'false';
      assert.equal(box.getAttribute('aria-checked'), val);
    });
  });

  it('should handle labels (clicking label clicks/focuses box)', () => {
    attributes();
    checkboxes.forEach((box) => {
      const label = getLabel(box, '.dqpl-checkbox-wrap', '.dqpl-label');
      const isDisabled = box.getAttribute('aria-disabled') === 'true';

      assert.isTrue(!!label);

      if (isDisabled) {
        assert.isTrue(Classlist(label).contains('dqpl-label-disabled'));
      }
      let clicked = false;
      let focused = false;
      box.addEventListener('click', () => clicked = true);
      box.addEventListener('focus', () => focused = true);

      label.click();
      assert.isTrue(clicked);
      assert.isTrue(focused);
    });
  });

  describe('dqpl:checkbox:disable', () => {
    it('should disable the checkbox', () => {
      attributes();
      const e = new CustomEvent('dqpl:checkbox:disable');
      checkboxes[0].dispatchEvent(e);
      assert.equal(checkboxes[0].getAttribute('aria-disabled'), 'true');
    });

    it('should set the right classes', () => {
      attributes();
      const box = checkboxes[0];
      const label = getLabel(box, '.dqpl-checkbox-wrap', '.dqpl-label');
      const inner = box.querySelector('.dqpl-inner-checkbox');
      const isChecked = box.getAttribute('aria-checked') === 'true';
      const e = new CustomEvent('dqpl:checkbox:disable');
      box.dispatchEvent(e);

      assert.isTrue(Classlist(inner).contains(isChecked ? 'fa-check-square' : 'fa-square'));
      assert.isTrue(Classlist(label).contains('dqpl-label-disabled'));
    });
  });

  describe('dqpl:checkbox:enable', () => {
    it('should disable the checkbox', () => {
      attributes();
      const e = new CustomEvent('dqpl:checkbox:enable');
      checkboxes[0].dispatchEvent(e);
      assert.isNull(checkboxes[0].getAttribute('aria-disabled'));
    });

    it('should set the right classes', () => {
      attributes();
      const box = checkboxes[0];
      const label = getLabel(box, '.dqpl-checkbox-wrap', '.dqpl-label');
      const inner = box.querySelector('.dqpl-inner-checkbox');
      const isChecked = box.getAttribute('aria-checked') === 'true';
      const e = new CustomEvent('dqpl:checkbox:enable');
      box.dispatchEvent(e);

      assert.isTrue(Classlist(inner).contains(isChecked ? 'fa-check-square' : 'fa-square-o'));
      assert.isFalse(Classlist(label).contains('dqpl-label-disabled'));
    });
  });
});
