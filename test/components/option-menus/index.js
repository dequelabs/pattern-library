'use strict';

const assert = require('chai').assert;
const simulant = require('simulant');
const queryAll = require('../../../lib/commons/query-all');
const optionMenus = require('../../../lib/components/option-menus');
const Fixture = require('../../fixture');
const snippet = require('./snippet.html');
const getDropdown = (t) => document.getElementById(t.getAttribute('aria-controls'));

describe('components/option-menus', () => {
  let fixture, triggers;

  before(() => {
    fixture = new Fixture();
    optionMenus(); // only attach the delegated events once...
  });

  beforeEach(() => {
    fixture.create(snippet);
    triggers = queryAll('.dqpl-options-menu-trigger', fixture.element);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('outside clicks', () => {
    it('should close all expanded menus when a click outside of the menu occurs', () => {
      const trigger1 = triggers[0];
      const dropdown1 = getDropdown(trigger1);
      const trigger2 = triggers[1];
      const dropdown2 = getDropdown(trigger2);

      simulant.fire(trigger1, 'click');
      assert.equal(dropdown1.getAttribute('aria-expanded'), 'true');
      simulant.fire(trigger2, 'click');
      assert.equal(dropdown2.getAttribute('aria-expanded'), 'true');
      simulant.fire(document.body, 'click'); // fire click outside of both option menus
      assert.equal(dropdown1.getAttribute('aria-expanded'), 'false');
      assert.equal(dropdown2.getAttribute('aria-expanded'), 'false');
    });
  });
  describe('trigger clicks', () => {
    it('should close all other expanded menus when a trigger is clicked', () => {
      const trigger1 = triggers[0];
      const dropdown1 = getDropdown(trigger1);
      const trigger2 = triggers[1];
      const dropdown2 = getDropdown(trigger2);

      simulant.fire(trigger1, 'click');
      assert.equal(dropdown1.getAttribute('aria-expanded'), 'true');
      simulant.fire(trigger2, 'click');
      assert.equal(dropdown2.getAttribute('aria-expanded'), 'true');
      assert.equal(dropdown1.getAttribute('aria-expanded'), 'false');
    });

    it('should toggle aria expanded on the clicked trigger\'s dropdown', () => {
      const trigger = triggers[0];
      const dropdown = getDropdown(trigger);

      assert.equal(dropdown.getAttribute('aria-expanded'), 'false');
      simulant.fire(trigger, 'click');
      assert.equal(dropdown.getAttribute('aria-expanded'), 'true');
    });

    it('should shift focus to the first item when the trigger is clicked', () => {
      const trigger = triggers[0];
      const dropdown = getDropdown(trigger);

      simulant.fire(trigger, 'click');
      assert.equal(document.activeElement, dropdown.querySelector('[role="menuitem"]'));
    });
  });

  describe('trigger keydowns', () => {
    it('should click the trigger when down is pressed', () => {
      let clicked = false;
      const trigger = triggers[0];

      trigger.addEventListener('click', () => clicked = true);
      simulant.fire(trigger, 'keydown', { which: 40 });

      assert.isTrue(clicked);
    });
  });

  describe('menu item keydowns', () => {
    describe('shift + tab', () => {
      it('should close menu if menu is open on shift + tab', () => {
        const trigger = triggers[0];
        const dropdown = getDropdown(trigger);
        const options = queryAll('[role="menuitem"]', dropdown);

        simulant.fire(trigger, 'click');
        const menuOpen = trigger.getAttribute('aria-expanded');
        assert.equal(menuOpen, 'true');

        simulant.fire(options[0], 'keydown', { which: 16});
        simulant.fire(options[0], 'keydown', { which: 9 });
        const afterTab = trigger.getAttribute('aria-expanded');
        assert.equal(afterTab, 'false');
      });
    });

    describe('tab', () => {
      it('should close menu if menu is open on tab', () => {
        const trigger = triggers[0];
        const dropdown = getDropdown(trigger);
        const options = queryAll('[role="menuitem"]', dropdown);

        simulant.fire(trigger, 'click');
        const menuOpen = trigger.getAttribute('aria-expanded');
        assert.equal(menuOpen, 'true');

        simulant.fire(options[0], 'keydown', { which: 9 });
        const afterTab = trigger.getAttribute('aria-expanded');
        assert.equal(afterTab, 'false');
      });
    });

    describe('up', () => {
      it('should focus the previous menu item', () => {
        const trigger = triggers[0];
        const dropdown = getDropdown(trigger);
        const options = queryAll('[role="menuitem"]', dropdown);

        simulant.fire(trigger, 'click'); // open the menu
        simulant.fire(options[4], 'keydown', { which: 38 });
        assert.equal(document.activeElement, options[3]);
      });
    });

    describe('down', () => {
      it('should focus the next menu item', () => {
        const trigger = triggers[1];
        const dropdown = getDropdown(trigger);
        const options = queryAll('[role="menuitem"]', dropdown);

        simulant.fire(trigger, 'click'); // open the menu
        simulant.fire(options[0], 'keydown', { which: 40 });
        assert.equal(document.activeElement, options[1]);
      });
    });

    describe('escape', () => {
      it('should click / focus the trigger', () => {
        let focused = false;
        let clicked = false;
        const trigger = triggers[1];
        const dropdown = getDropdown(trigger);
        const options = queryAll('[role="menuitem"]', dropdown);

        trigger.addEventListener('click', () => clicked = true);
        trigger.addEventListener('focus', () => focused = true);

        simulant.fire(options[1], 'keydown', { which: 27 });

        assert.isTrue(focused);
        assert.isTrue(clicked);
        assert.equal(document.activeElement, trigger);
      });
    });

    describe('enter / space', () => {
      it('should click the menu item', () => {
        let clicked = false;
        const trigger = triggers[0];
        const dropdown = getDropdown(trigger);
        const options = queryAll('[role="menuitem"]', dropdown);

        options[1].addEventListener('click', () => clicked = true);
        simulant.fire(options[1], 'keydown', { which: 13 });
        assert.isTrue(clicked);
      });
    });
  });

  describe('clicks on menu items', () => {
    it('should click links within menu items', () => {
      let clicked = false;
      const trigger = triggers[0];
      const dropdown = getDropdown(trigger);
      const option = dropdown.querySelector('[role="menuitem"]');

      // add a link within the option
      const link = document.createElement('a');
      option.appendChild(link);
      link.addEventListener('click', () => clicked = true);
      simulant.fire(option, 'click');
      assert.isTrue(clicked);
    });
  });
});
