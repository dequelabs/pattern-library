'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const proxyquire = require('proxyquire');
const snippet = require('./snippet.html');
const queryAll = require('../../../lib/commons/query-all');
const Fixture = require('../../fixture');

describe('components/selects/activate', () => {
  let fixture, list;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    list = fixture.element.querySelector('.dqpl-listbox');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should activate the option', () => {
    const options = queryAll('[role="option"]', list);
    options[2].id = 'foo';
    list.setAttribute('aria-activedescendant', options[2].id);
    proxyquire('../../../lib/components/selects/activate', {
      '../../commons/is-scrolled-in-view': () => false
    })(list, false);
    // ensure the active class is added
    assert.isTrue(Classlist(options[2]).contains('dqpl-option-active'));
    assert.equal(queryAll('.dqpl-option-active', list).length, 1);
    assert.equal(queryAll('[aria-selected="true"]', list).length, 1);
  });
});
