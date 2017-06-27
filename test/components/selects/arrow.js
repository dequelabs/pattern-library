'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');

describe('components/selects/arrow', () => {
  let fixture, select, list;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    select = fixture.element.querySelector('.dqpl-combobox');
    list = fixture.element.querySelector('.dqpl-listbox');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should call activate when there is an option in the provided direction', () => {
    let called = false;
    select.setAttribute('aria-activedescendant', 'default');
    proxyquire('../../../lib/components/selects/arrow', {
      './activate': () => called = true
    })({
      key: 40,
      combobox: select,
      listbox: list,
      liveRegion: {
        announce: () => {}
      }
    });

    assert.isTrue(called);
  });

  it('should do nothing if there is no selected option', () => {
    let called = false;
    select.removeAttribute('aria-activedescendant');
    proxyquire('../../../lib/components/selects/arrow', {
      './activate': () => called = true
    })({
      key: 40,
      combobox: select,
      listbox: list,
      liveRegion: {
        announce: () => {}
      }
    });

    assert.isFalse(called);
  });

  it('should do nothing if there is NOT an option in the provided direction', () => {
    let called = false;
    select.setAttribute('aria-activedescendant', 'default');
    proxyquire('../../../lib/components/selects/arrow', {
      './activate': () => called = true
    })({
      key: 38,
      combobox: select,
      listbox: list,
      liveRegion: {
        announce: () => {}
      }
    });

    assert.isFalse(called);
  });
});
