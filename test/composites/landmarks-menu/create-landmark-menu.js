'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const fire = require('simulant').fire;
const Fixture = require('../../fixture');
const snippet = require('./snippet-empty-menu.html');
const create = require('../../../lib/composites/landmarks-menu/create-landmark-menu')

describe('composites/landmarks-menu/create-landmark-menu', () => {
  let fixture, container, main, nav, banner, target;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    container = fixture.element.querySelector('.dqpl-skip-container');
    main = fixture.element.querySelector('[role="main"]');
    nav = fixture.element.querySelector('[role="navigation"]');
    banner = fixture.element.querySelector('[role="banner"]');
    target = fixture.element.querySelector('[data-skip-target="true"]');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should debug if a skip target\'s text can not be calculated', () => {
    let called = false;
    proxyquire('../../../lib/composites/landmarks-menu/create-landmark-menu', {
      'debug': () => {
        return function () { called = true; }
      }
    })(null, container);

    assert.isTrue(called);
  });

  it('should create/append 1 link per valid skip target', () => {
    create(null, container);
    assert.equal(container.querySelectorAll('.dqpl-skip-link').length, 3);
  });

  it('should create a ul if there are more than 1 valid skip targets', () => {
    create(null, container);
    assert.isTrue(!!container.querySelector('ul'));
  });

  it('should not create the ul if there is just 1 valid skip target', () => {
    nav.parentNode.removeChild(nav);
    banner.parentNode.removeChild(banner);
    target.parentNode.removeChild(target);
    create(null, container);
    assert.isFalse(!!container.querySelector('ul'));
  });

  it('should focus the skip target when a skip link is clicked', () => {
    nav.parentNode.removeChild(nav);
    banner.parentNode.removeChild(banner);
    target.parentNode.removeChild(target);
    create(null, container);
    const skipLink = container.querySelector('.dqpl-skip-link');
    fire(skipLink, 'click');
    assert.equal(document.activeElement, main);
  });

  it('should remove tabindex on blur if param is provided', () => {
    main.tabIndex = 0;
    nav.parentNode.removeChild(nav);
    banner.parentNode.removeChild(banner);
    target.parentNode.removeChild(target);
    create(true, container);
    const skipLink = container.querySelector('.dqpl-skip-link');
    fire(skipLink, 'click');
    fire(main, 'blur');
    assert.isNull(main.getAttribute('tabIndex'));
  });
});
