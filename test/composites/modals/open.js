'use strict';

'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const Classlist = require('classlist');
const snippet = require('./fixture.html');
const Fixture = require('../../fixture');
const open = require('../../../lib/composites/modals/open');

describe('composites/modals/open', () => {
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

  it('should add the "dqpl-modal-show" class to the modal', () => {
    open(trigger, modal);
    assert.isTrue(Classlist(modal).contains('dqpl-modal-show'));
  });

  it('should add the "dqpl-modal-open" class to the body', () => {
    open(trigger, modal);
    assert.isTrue(Classlist(document.body).contains('dqpl-modal-open'));
  });

  it('should create a modal scrim if one doesn\'t exist', () => {
    open(trigger, modal);
    assert.isTrue(!!modal.querySelector('.dqpl-modal-screen'));
  });

  it('should set tabindex="-1" and focus the heading', () => {
    open(trigger, modal);
    const heading = modal.querySelector('h2');
    assert.equal(heading.tabIndex, -1);
    assert.equal(document.activeElement, heading);
  });

  it('should call ariaHide and sizer', () => {
    let ariaHideCalled = false, sizerCalled = false;
    proxyquire('../../../lib/composites/modals/open', {
      './aria': {
        hide: () => ariaHideCalled = true
      },
      './sizer': () => sizerCalled = true
    })(trigger, modal);

    assert.isTrue(ariaHideCalled);
    assert.isTrue(sizerCalled);
  });
});
