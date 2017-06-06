'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const proxyquire = require('proxyquire');
const snippet = require('./snippet.html');
const queryAll = require('../../../lib/commons/query-all');
const Fixture = require('../../fixture');
const fire = require('simulant').fire;

describe('components/selects/open', () => {
  let fixture, select, list;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    select = fixture.element.querySelector('.dqpl-combobox');
    list = fixture.element.querySelector('.dqpl-listbox');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should default to the first option when no default selection exists');

  it('should open the list and call activate');
});
