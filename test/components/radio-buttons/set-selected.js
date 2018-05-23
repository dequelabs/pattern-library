'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const queryAll = require('../../../lib/commons/query-all');
const Fixture = require('../../fixture');
const snippet = require('./snippet.html');
const setSelected = require('../../../lib/components/radio-buttons/set-selected');

describe('components/radio-buttons/set-selected', () => {
  let fixture, radios;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    radios = queryAll('.dqpl-radio', fixture.element);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should properly configure selected state', () => {
    // do what setup does
    radios.forEach((r) => {
      const inner = document.createElement('div');
      Classlist(inner).add('dqpl-inner-radio');
      r.appendChild(inner);
    });

    setSelected(radios, radios[1], true);
    radios.forEach((r, i) => {
      const isChecked = i === 1;
      const inner = r.querySelector('.dqpl-inner-radio');

      assert.equal(r.getAttribute('aria-checked'), isChecked ? 'true' : 'false');

      if (isChecked) {
        assert.isTrue(Classlist(r).contains('dqpl-selected'));
      }

      assert.isTrue(
        Classlist(inner).contains(isChecked ? 'fa-dot-circle-o' : 'fa-circle-o')
      );
    });

    assert.equal(radios[1], document.activeElement);
  });

  it('should compare a live collection of element references', () => {
    const radioWraps = queryAll('.dqpl-radio-wrap', fixture.element);
    const radioWrap = radioWraps[2];
    const cloneWrap = radioWrap.cloneNode(true);
    radioWrap.parentElement.replaceChild(cloneWrap, radioWrap);
    const clone = cloneWrap.querySelector('[role="radio"]');
    assert.notEqual(clone, document.activeElement);
    setSelected(null, clone, true);
    assert.equal(clone, document.activeElement);
  });
});
