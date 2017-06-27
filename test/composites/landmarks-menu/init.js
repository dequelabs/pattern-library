'use strict';

const assert = require('chai').assert;
const CustomEvent = require('custom-event');
const Classlist = require('classlist');
const Fixture = require('../../fixture');
const snippet = require('./snippet-empty-menu.html');
const init = require('../../../lib/composites/landmarks-menu/init');

describe('composites/landmarks-menu/init', () => {
  let fixture, container;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    container = fixture.element.querySelector('.dqpl-skip-container');
    init();
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('focusin', () => {
    it('should add the proper classes', (done) => {
      Classlist(container)
        .remove('dqpl-skip-container-active')
        .remove('dqpl-skip-fade');
      const e = new CustomEvent('focusin');
      container.dispatchEvent(e);
      setTimeout(() => {
        assert.isTrue(Classlist(container).contains('dqpl-skip-container-active'));
        assert.isTrue(Classlist(container).contains('dqpl-skip-fade'));
        done();
      }, 100);
    });
  });

  describe('focusout', () => {
    it('should remove the proper classes', (done) => {
      Classlist(container)
        .add('dqpl-skip-container-active')
        .add('dqpl-skip-fade');
      const e = new CustomEvent('focusout');
      container.dispatchEvent(e);
      setTimeout(() => {
        assert.isFalse(Classlist(container).contains('dqpl-skip-container-active'));
        assert.isFalse(Classlist(container).contains('dqpl-skip-fade'));
        done();
      }, 100);
    });
  });
});
