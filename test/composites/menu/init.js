'use strict';

const CustomEvent = require('custom-event');
const proxyquire = require('proxyquire');
const assert = require('chai').assert;
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');
const queryAll = require('../../../lib/commons/query-all');
const init = require('../../../lib/composites/menu/init');

describe('composites/menu/init', () => {
  let fixture;

  before(() => fixture = new Fixture());
  beforeEach(() => fixture.create(snippet));
  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should call resize and main events', () => {
    let resized = false, mained = false;

    proxyquire('../../../lib/composites/menu/init', {
      './events/resize': () => resized = true,
      './events/main': () => mained = true
    })(fixture.element.querySelector('.dqpl-top-bar'));

    assert.isTrue(resized);
    assert.isTrue(mained);
  });

  it('should attach dqpl:refresh listener and configure tabindex properly when fired', () => {
    const topBar = fixture.element.querySelector('.dqpl-top-bar');
    init(topBar);
    // make all of the topbar items tabindex="-1"
    queryAll('[role="menuitem"]', topBar).forEach((m) => m.tabIndex = -1);
    const e = new CustomEvent('dqpl:refresh');
    topBar.dispatchEvent(e);
    assert.isTrue(!!topBar.querySelector('[tabindex="0"]'));
  });
});
