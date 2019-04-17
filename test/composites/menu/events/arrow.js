'use strict';

const proxyquire = require('proxyquire');
const assert = require('chai').assert;
const snippet = require('../snippet.html');
const Fixture = require('../../../fixture');
const queryAll = require('../../../../lib/commons/query-all');

describe('composites/menu/events/arrow', () => {
  let fixture;
  before(() => fixture = new Fixture());
  beforeEach(() => fixture.create(snippet));
  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should call activate on the proper element', () => {
    const topBar = fixture.element.querySelector('.dqpl-top-bar');
    const target = topBar.querySelector('[role="menuitem"]');
    const expected = topBar.querySelector('.second-item');

    proxyquire('../../../../lib/composites/menu/events/arrow', {
      '../utils/activate': (t, adjacent) => {
        assert.equal(target, t);
        assert.equal(expected, adjacent);
      }
    })(queryAll('[role="menuitem"]', topBar), target, 'next');
  });

  it('should handle circularity', () => {
    const topBar = fixture.element.querySelector('.dqpl-top-bar');
    const target = topBar.querySelector('[role="menuitem"]');
    const expected = topBar.querySelector('.dd-trig-2');

    proxyquire('../../../../lib/composites/menu/events/arrow', {
      '../utils/activate': (t, adjacent) => {
        assert.equal(target, t);
        assert.equal(expected, adjacent);
      }
    })(
      Array.prototype.slice.call(topBar.querySelector('[role="menubar"]').children),
      target,
      'prev'
    );
  });
});
