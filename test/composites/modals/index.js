'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const Classlist = require('classlist');
const snippet = require('./fixture.html');
const Fixture = require('../../fixture');
const modal = require('../../../lib/composites/modals');

describe('composites/modals', () => {
  let fixture, modal, trigger;
  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    modal = el.querySelector('.dqpl-modal');
    trigger = el.querySelector('.dqpl-button-secondary');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('clicking a trigger', () => {
    it('should call debug if the modal cannot be found');
    it('should call open');
  });

  describe('clicking a close/cancel button', () => {
    it('should call close');
  });

  describe('keydowns on modals', () => {
    describe('escape', () => {
      it('should call close');
    });
  });

  describe('shift + tab on the first focusable element within modal', () => {
    it('should focus the last focusable element in the modal');
  });

  describe('tab on the last focusable element within the modal', () => {
    it('should focus the first element');
  });

  describe('shift+tab on the modal\'s h2', () => {
    it('should focus the last focusable element within the modal');
  });
});
