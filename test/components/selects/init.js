'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const proxyquire = require('proxyquire');
const queryAll = require('../../../lib/commons/query-all');
const Fixture = require('../../fixture');
const snippet = require('./snippet.html');
const init = require('../../../lib/components/selects/init');

describe('components/selects/init', () => {
  let fixture, selects;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    selects = queryAll('.dqpl-combobox', fixture.element);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should warn if a combobox\'s listbox cannot be found', () => {
    let called = false;
    selects[0].removeAttribute('aria-owns'); // make it so the listbox can't be found
    proxyquire('../../../lib/components/selects/init', {
      'debug': () => {
        return function () { called = true; };
      }
    })();

    assert.isTrue(called);
  });

  it('should set tabIndex=0 on the select', () => {
    init();
    selects.forEach((s) => assert.equal(0, s.tabIndex));
  });

  it('should add the dqpl-pseudo-value element if its not present', () => {
    const theOneWithout = selects[1];
    init();
    assert.isTrue(!!theOneWithout.querySelector('.dqpl-pseudo-value'));
  });

  it('should associate the combobox with the pseudoVal via aria-labelledby', () => {
    const select = selects[0];
    const pseudoVal = select.querySelector('.dqpl-pseudo-value');
    init();

    assert.isTrue(select.getAttribute('aria-labelledby').indexOf(pseudoVal.id) > -1);
  });

  it('should assign an id to each option', () => {
    const select = selects[0];
    const listbox = document.getElementById(select.getAttribute('aria-owns'));
    init();
    queryAll('[role="option"]', listbox)
      .forEach((opt) => assert.isTrue(!!opt.id));
  });

  it('should call validate', () => {
    let called = false;
    proxyquire('../../../lib/components/selects/init', {
      './validate': () => called = true
    })();
    assert.isTrue(called);
  });

  it('should call attachEvents', () => {
    let called = false;
    proxyquire('../../../lib/components/selects/init', {
      './events': () => called = true
    })();
    assert.isTrue(called);
  });

  it('should set aria-selected=true and add the "dqpl-option-active" class to the intially selected option', () => {
    const select = selects[0];
    const defaultSelected = document.getElementById(select.getAttribute('aria-activedescendant'));
    init();

    assert.isTrue(Classlist(defaultSelected).contains('dqpl-option-active'));
    assert.equal(defaultSelected.getAttribute('aria-selected'), 'true');
  });
});
