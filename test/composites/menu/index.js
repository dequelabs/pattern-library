'use strict';

const CustomEvent = require('custom-event');
const proxyquire = require('proxyquire');
const assert = require('chai').assert;
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');

describe('composites/menu', () => {
  let fixture;

  before(() => fixture = new Fixture());
  beforeEach(() => fixture.create(snippet));
  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('given a top-bar that is present', () => {
    it('should call init', () => {
      let called = false;
      proxyquire('../../../lib/composites/menu/', {
        './init': () => called = true
      })();
      assert.isTrue(called);
    });
  });

  describe('given no present top-bar initially', () => {
    it('should attach dqpl:ready event and, when fired call init if top bar is now present', () => {
      let called = false;
      const topBar = fixture.element.querySelector('.dqpl-top-bar');
      // remove the top bar so the dqpl:ready event gets attacahed
      fixture.element.removeChild(topBar);

      proxyquire('../../../lib/composites/menu/', {
        './init': () => called = true
      })();

      // ensure it hasn't been called
      assert.isFalse(called);

      const newTopBar = document.createElement('div');
      newTopBar.className = 'dqpl-top-bar';
      fixture.element.appendChild(newTopBar);

      // fire dqpl:ready on the document
      const e = new CustomEvent('dqpl:ready');
      document.dispatchEvent(e);

      assert.isTrue(called);
    });
  });
});
