'use strict';

const Classlist = require('classlist');
const assert = require('chai').assert;
const snippet = require('../snippet.html');
const Fixture = require('../../../fixture');
const resize = require('../../../../lib/composites/menu/events/resize');
const getTopLevels = require('../../../../lib/composites/menu/utils/get-top-level-items');

describe('composites/menu/events/resize', () => {
  let fixture, elements;

  before(() => {
    fixture = new Fixture();
    fixture.create(snippet);
    const topBar = fixture.element.querySelector('.dqpl-top-bar');
    elements = {
      menu: fixture.element.querySelector('.dqpl-side-bar'),
      topBar: topBar,
      topBarItems: getTopLevels(topBar.querySelector('[role="menubar"]'), true),
      trigger: topBar.querySelector('.dqpl-menu-trigger'),
      scrim: document.getElementById('dqpl-side-bar-scrim'),
      dropdown: topBar.querySelector('.dqpl-dropdown')
    };
    resize(elements, () => {});
  });

  beforeEach(() => {
    // reset everything
    Classlist(elements.trigger).remove('dqpl-active');
    Classlist(elements.menu).remove('dqpl-active').remove('dqpl-show');
    elements.menu.setAttribute('aria-expanded', 'false');
    Classlist(elements.scrim).remove('dqpl-scrim-show').remove('dqpl-scrim-fade-in');
    Classlist(elements.dropdown).remove('dqpl-dropdown-active');
    elements.dropdown.setAttribute('aria-expanded', 'false');
  });

  after(() => fixture.destroy().cleanUp());

  // TODO: figure out a way to resize window in phantomjs on the fly
  it('should configure the menu state properly', () => {
    const isWide = window.innerWidth >= 1024;
    assert.equal(elements.menu.getAttribute('data-locked'), isWide ? 'true' : 'false');
  });
});
