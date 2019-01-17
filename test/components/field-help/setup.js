'use strict';

const Classlist = require('classlist');
const assert = require('chai').assert;
const closest = require('closest');
const simulant = require('simulant');
const setup = require('../../../lib/components/field-help/setup');
const queryAll = require('../../../lib/commons/query-all');
const proxyquire = require('proxyquire');
const Fixture = require('../../fixture');
const snippet = require('./snippet.html');

describe('components/field-help/setup', () => {
  let fixture, helps;

  before(() => {
    fixture = new Fixture();
  });

  beforeEach(() => {
    fixture.create(snippet);
    helps = queryAll('.dqpl-help-button, .dqpl-button-definition', fixture.element);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should warn if button is not in a proper wrapper', () => {
    let called = false;
    const funk = () => {
      return function () {
        called = true;
      };
    };
    const set = proxyquire('../../../lib/components/field-help/setup', {
      'debug': funk
    });

    Classlist(fixture.element.querySelector('.dqpl-help-button-wrap'))
      .remove('dqpl-help-button-wrap');

    set();
    assert.isTrue(called);
  });

  it('should create/append the tooltip', () => {
    setup();
    const wrapper = closest(helps[0], '.dqpl-help-button-wrap');
    const tip = wrapper.querySelector('.dqpl-tooltip');
    assert.isTrue(!!tip);
  });

  it('should associate the tip with the button via aria-describedby', () => {
    setup();
    const button = helps[0];
    const wrapper = closest(button, '.dqpl-help-button-wrap');
    const tip = wrapper.querySelector('.dqpl-tooltip');
    assert.equal(button.getAttribute('aria-describedby'), tip.id);
  });

  it('should add the active class on focus', () => {
    setup();
    const button = helps[0];
    const wrapper = closest(button, '.dqpl-help-button-wrap');
    const tip = wrapper.querySelector('.dqpl-tooltip');
    simulant.fire(button, 'focus');
    assert.isTrue(Classlist(tip).contains('dqpl-tip-active'));
  });

  it('should add the active class on mouseover', () => {
    setup();
    const button = helps[0];
    const wrapper = closest(button, '.dqpl-help-button-wrap');
    const tip = wrapper.querySelector('.dqpl-tooltip');
    simulant.fire(button, 'mouseover');
    assert.isTrue(Classlist(tip).contains('dqpl-tip-active'));
  });

  it('should remove the active class on blur', () => {
    setup();
    const button = helps[0];
    const wrapper = closest(button, '.dqpl-help-button-wrap');
    const tip = wrapper.querySelector('.dqpl-tooltip');
    simulant.fire(button, 'focus');
    assert.isTrue(Classlist(tip).contains('dqpl-tip-active'));
    simulant.fire(button, 'blur');
    assert.isFalse(Classlist(tip).contains('dqpl-tip-active'));
  });

  it('should remove the active class on mouseout', () => {
    setup();
    const button = helps[0];
    const wrapper = closest(button, '.dqpl-help-button-wrap');
    const tip = wrapper.querySelector('.dqpl-tooltip');
    simulant.fire(button, 'mouseover');
    assert.isTrue(Classlist(tip).contains('dqpl-tip-active'));
    simulant.fire(button, 'mouseout');
    assert.isFalse(Classlist(tip).contains('dqpl-tip-active'));
  });

  it('should update the text if the data-help-text gets updated', () => {
    setup();
    const button = helps[0];
    const wrapper = closest(button, '.dqpl-help-button-wrap');
    const tip = wrapper.querySelector('.dqpl-tooltip');
    const tipText = tip.textContent;
    assert.equal(tipText, 'Your first name is the name that comes before your middle and last names.');
    button.setAttribute('data-help-text', 'food bar');
    simulant.fire(button, 'mouseover');
    assert.equal(tip.textContent, 'food bar');
  });
});
