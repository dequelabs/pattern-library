'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const proxyquire = require('proxyquire');
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');
const fire = require('simulant').fire;
const attachEvents = require('../../../lib/components/selects/events');

describe('components/selects/events', () => {
  let fixture, select, list;

  before(() => fixture = new Fixture());

  beforeEach(() => {
    fixture.create(snippet);
    select = fixture.element.querySelector('.dqpl-combobox');
    list = fixture.element.querySelector('.dqpl-listbox');
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('select labels', () => {
    it('should focus the select when the label is clicked', () => {
      const firstLabel = fixture.element.querySelector('.dqpl-label');
      attachEvents(select, list);
      fire(firstLabel, 'click');
      assert.equal(document.activeElement, select);
    });
  });

  describe('combobox clicks', () => {
    it('should toggle the dqpl-listbox-show class on the list', () => {
      attachEvents(select, list);
      assert.isFalse(Classlist(list).contains('dqpl-listbox-show'));
      fire(select, 'click');
      assert.isTrue(Classlist(list).contains('dqpl-listbox-show'));
    });

    it('should toggle aria-expanded on the combobox', () => {
      attachEvents(select, list);
      assert.equal(select.getAttribute('aria-expanded'), 'false');
      fire(select, 'click');
      assert.equal(select.getAttribute('aria-expanded'), 'true');
    });
  });

  describe('combobox keydowns', () => {
    describe('up / down', () => {
      describe('given a visible listbox', () => {
        it('should call arrow', () => {
          let called = false;
          proxyquire('../../../lib/components/selects/events', {
            './arrow': () => called = true
          })(select, list);

          fire(select, 'click'); // show the listbox

          fire(select, 'keydown', { which: 40 });
          assert.isTrue(called);
        });
      });

      describe('given a hidden listbox', () => {
        it('should call open', () => {
          let called = false;
          proxyquire('../../../lib/components/selects/events', {
            './open': () => called = true
          })(select, list);
          fire(select, 'keydown', { which: 40 });
          assert.isTrue(called);
        });
      });
    });

    describe('enter / space', () => {
      describe('given a visible listbox', () => {
        it('should call select', () => {
          let called = false;
          proxyquire('../../../lib/components/selects/events', {
            './select': () => called = true
          })(select, list);

          fire(select, 'click'); // show the listbox

          fire(select, 'keydown', { which: 13 });
          assert.isTrue(called);
        });
      });

      describe('given a hidden listbox', () => {
        it('should call open', () => {
          let called = false;
          proxyquire('../../../lib/components/selects/events', {
            './open': () => called = true
          })(select, list);

          fire(select, 'keydown', { which: 32 });
          assert.isTrue(called);
        });
      });
    });

    describe('escape', () => {
      describe('given an open listbox', () => {
        it('should close the list', () => {
          attachEvents(select, list);
          fire(select, 'click'); // open the list
          assert.isTrue(Classlist(list).contains('dqpl-listbox-show'));
          assert.equal(select.getAttribute('aria-expanded'), 'true');
          fire(select, 'keydown', { which: 27 });
          assert.isFalse(Classlist(list).contains('dqpl-listbox-show'));
          assert.equal(select.getAttribute('aria-expanded'), 'false');
        });
      });
    });

    describe('input characters', () => {
      let opened = false;
      let searched = false;
      it('should call open and search', () => {
        proxyquire('../../../lib/components/selects/events', {
          './open': () => opened = true,
          './search': () => searched = true
        })(select, list);

        fire(select, 'keydown', { which: 72 });

        assert.isTrue(opened);
        assert.isTrue(searched);
      });
    });
  });

  describe('combobox blur', () => {
    it('should close the list', () => {
      attachEvents(select, list);
      fire(select, 'click'); // open the list
      assert.isTrue(Classlist(list).contains('dqpl-listbox-show'));
      assert.equal(select.getAttribute('aria-expanded'), 'true');
      fire(select, 'blur');
      assert.isFalse(Classlist(list).contains('dqpl-listbox-show'));
      assert.equal(select.getAttribute('aria-expanded'), 'false');
    });
  });

  describe('listbox mousedowns', () => {
    it('should set aria-activedescendant and call select / activate', () => {
      let activated = false;
      let selected = false;
      const opt = list.querySelector('[role="option"]');
      proxyquire('../../../lib/components/selects/events', {
        './activate': () => activated = true,
        './select': () => selected = true
      })(select, list);

      fire(opt, 'mousedown');
      assert.equal(opt.id, select.getAttribute('aria-activedescendant'));
      assert.isTrue(activated);
      assert.isTrue(selected);
    });
  });
});
