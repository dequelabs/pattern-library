'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');

describe('components/selects/arrow', () => {
  let fixture, listbox, called = false;
  const arrow = proxyquire('../../../lib/components/selects/arrow', {
    './activate': () => called = true
  });

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    listbox = fixture.element.querySelector('.dqpl-listbox');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should call activate when there is an option in the provided direction', () => {
    called = false;
    listbox.setAttribute('aria-activedescendant', 'default');
    arrow({
      key: 40,
      listbox
    });

    assert.isTrue(called);
  });

  it('should do nothing if there is no selected option', () => {
    called = false;
    listbox.removeAttribute('aria-activedescendant');
    arrow({
      key: 40,
      listbox
    });

    assert.isFalse(called);
  });

  it('should do nothing if there is NOT an option in the provided direction', () => {
    called = false;
    listbox.setAttribute('aria-activedescendant', 'default');
    arrow({
      key: 38,
      listbox
    });

    assert.isFalse(called);
  });
});
