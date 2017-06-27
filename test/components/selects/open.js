'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const proxyquire = require('proxyquire');
const snippet = require('./snippet.html');
const queryAll = require('../../../lib/commons/query-all');
const Fixture = require('../../fixture');
const open = require('../../../lib/components/selects/open');

describe('components/selects/open', () => {
  let fixture, selects, lists;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    selects = queryAll('.dqpl-combobox', fixture.element);
    lists = queryAll('.dqpl-listbox', fixture.element);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should default to the first option when no default selection exists', () => {
    const firstOpt = lists[1].querySelector('[role="option"]');
    open(selects[1], lists[1]);
    assert.equal(firstOpt.id, selects[1].getAttribute('aria-activedescendant'));
  });

  it('should open the list and call activate', () => {
    let called = false;
    proxyquire('../../../lib/components/selects/open', {
      './activate': () => called = true
    })(selects[0], lists[0]);

    assert.isTrue(called);
    assert.equal('true', selects[0].getAttribute('aria-expanded'));
    assert.isTrue(Classlist(lists[0]).contains('dqpl-listbox-show'));
  });
});
