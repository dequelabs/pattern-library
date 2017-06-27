'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const queryAll = require('../../../lib/commons/query-all');
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');

describe('components/radio-buttons/traverse', () => {
  let fixture, radios;
  before(() => {
    fixture = new Fixture();
    fixture.create(snippet);
    radios = queryAll('.dqpl-radio', fixture.element);
  });
  after(() => {
    fixture.destroy().cleanUp();
  });

  describe('given a dir of "next"', () => {
    it('should call setSelected with the proper params', () => {
      const t = proxyquire('../../../lib/components/radio-buttons/traverse', {
        './set-selected': (radioButtons, enabled) => {
          assert.equal(enabled, radioButtons[1]);
        }
      });

      t(radios[0], radios, 'next');
    });
  });

  describe('given a dir of "prev"', () => {
    it('should call setSelected with the proper params', () => {
      const t = proxyquire('../../../lib/components/radio-buttons/traverse', {
        './set-selected': (radioButtons, enabled) => {
          assert.equal(enabled, radioButtons[0]);
        }
      });

      t(radios[1], radios, 'prev');
    });
  });
});
