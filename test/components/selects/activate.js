'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const proxyquire = require('proxyquire');
const snippet = require('./snippet.html');
const queryAll = require('../../../lib/commons/query-all');
const Fixture = require('../../fixture');

describe('components/selects/activate', () => {
  let fixture, select, list;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    select = fixture.element.querySelector('.dqpl-combobox');
    list = fixture.element.querySelector('.dqpl-listbox');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should activate the option', () => {
    const options = queryAll('[role="option"]', list);
    options[2].id = 'foo';
    select.setAttribute('aria-activedescendant', options[2].id);
    proxyquire('../../../lib/components/selects/activate', {
      '../../commons/is-scrolled-in-view': () => false
    })(select, list, false);
    // ensure the active class is added
    assert.isTrue(Classlist(options[2]).contains('dqpl-option-active'));
  });
});
