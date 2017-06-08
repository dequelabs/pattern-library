'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const fire = require('simulant').fire;
const Fixture = require('../../fixture');
const snippet = require('./snippet-existing-menu.html');
const fix = require('../../../lib/composites/landmarks-menu/fix-existing');

describe('composites/landmarks-menu/fix-existing', () => {
  describe('when a skip link is clicked', () => {
    let fixture, link, landing;

    before(() => {
      fixture = new Fixture();
      fix(true);
    });

    beforeEach(() => {
      fixture.create(snippet);
      link = fixture.element.querySelector('.dqpl-skip-link');
      landing = fixture.element.querySelector('#main');
      fire(link, 'click');
    });

    afterEach(() => fixture.destroy());
    after(() => fixture.cleanUp());

    it('should add tabindex to ensure the target is focusable', () => {
      assert.equal(-1, landing.tabIndex);
    });

    it('should focus the target', () => {
      assert.equal(document.activeElement, landing);
    });

    it('should remove tabindex on blur if "shouldRemove" param is truthy', () => {
      assert.equal(landing.getAttribute('tabindex'), '-1');
      fire(landing, 'blur');
      assert.isFalse(!!landing.getAttribute('tabindex'));
    });
  });
});
