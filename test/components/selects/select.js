'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const select = require('../../../lib/components/selects/select');
const queryAll = require('../../../lib/commons/query-all');
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');

describe('components/selects/select', () => {
  let fixture, combo, list, options;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    combo = fixture.element.querySelector('.dqpl-listbox-button');
    list = fixture.element.querySelector('.dqpl-listbox');
    options = queryAll('.dqpl-option', list);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should remove aria-selected from the previously selected option', () => {
    const prevActive = options[2];
    const newActive = options[1];
    // mock up some attrs/classes
    prevActive.setAttribute('aria-selected', 'true');
    prevActive.classList.add('dqpl-option-selected');
    Classlist(newActive).add('dqpl-option-active');

    select(combo, list);

    assert.isFalse(!!prevActive.getAttribute('aria-selected'));
  });

  it('should set aria-selected="true" to the option that has the "dqpl-option-active" class', () => {
    const prevActive = options[2];
    const newActive = options[1];
    // mock up some attrs/classes
    prevActive.setAttribute('aria-selected', 'true');
    Classlist(newActive).add('dqpl-option-active');

    select(combo, list);

    assert.equal(newActive.getAttribute('aria-selected'), 'true');
  });

  it('should hide the list given a falsey "noHide" param', () => {
    Classlist(options[1]).add('dqpl-option-active');
    Classlist(list).add('dqpl-listbox-show');
    combo.setAttribute('aria-expanded', 'true');
    select(combo, list, false);
    assert.equal(combo.getAttribute('aria-expanded'), 'false');
    assert.isFalse(Classlist(list).contains('dqpl-listbox-show'));
  });

  it('should NOT hide the list given a truthy "noHide" param', () => {
    Classlist(options[1]).add('dqpl-option-active');
    Classlist(list).add('dqpl-listbox-show');
    combo.setAttribute('aria-expanded', 'true');
    select(combo, list, true);
    assert.equal(combo.getAttribute('aria-expanded'), 'true');
    assert.isTrue(Classlist(list).contains('dqpl-listbox-show'));
  });

  it('should set the pseuoVal properly', () => {
    const prevActive = options[2];
    const newActive = options[1];
    // mock up some attrs/classes
    prevActive.setAttribute('aria-selected', 'true');
    Classlist(newActive).add('dqpl-option-active');

    select(combo, list);

    assert.equal(combo.querySelector('.dqpl-pseudo-value').innerText, newActive.innerText);
  });

  it('fires "dqpl:select:change" custom event', (done) => {
    const opt = options[1];
    combo.addEventListener('dqpl:select:change', ({ detail }) => {
      assert.equal(detail.value, opt.innerHTML);
      done();
    });

    Classlist(opt).add('dqpl-option-active');
    select(combo, list);
  });
});
