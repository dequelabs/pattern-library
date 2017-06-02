'use strict';

const assert = require('chai').assert;
const simulant = require('simulant');
const attrs = require('../../../lib/components/checkboxes/attributes');
const events = require('../../../lib/components/checkboxes/events');
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');
const queryAll = require('../../../lib/commons/query-all');

describe('components/checkboxes/events', () => {
  let fixture, checkboxes;

  before(() => {
    fixture = new Fixture();
    events(); // only invoke the delegated events once...
  });

  beforeEach(() => {
    fixture.create(snippet);
    checkboxes = queryAll('.dqpl-checkbox', fixture.element);
    attrs();
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should be a function', () => {
    assert.equal(typeof events, 'function');
  });

  it('should toggle the selected state of a checkbox when clicked', () => {
    const box = checkboxes[0]; // the first checkbox is initially selected (see snippet.html)
    assert.equal(box.getAttribute('aria-checked'), 'true');
    simulant.fire(box, 'click');
    assert.equal(box.getAttribute('aria-checked'), 'false');
  });

  it('should toggle the selected state of a checkbox when space is pressed', () => {
    const box = checkboxes[0]; // the first checkbox is initially selected (see snippet.html)
    assert.equal(box.getAttribute('aria-checked'), 'true');
    simulant.fire(box, 'keydown', { which: 32 });
    assert.equal(box.getAttribute('aria-checked'), 'false');
  });
});
