'use strict';

const Classlist = require('classlist');
const fire = require('simulant').fire;
const assert = require('chai').assert;
const snippet = require('../snippet.html');
const Fixture = require('../../../fixture');
const main = require('../../../../lib/composites/menu/events/main');
const queryAll = require('../../../../lib/commons/query-all');
const getTopLevels = require('../../../../lib/composites/menu/utils/get-top-level-items');

describe('composites/menu/events/main', () => {
  let fixture, elements;

  before(() => {
    fixture = new Fixture();
    fixture.create(snippet);
    const topBar = fixture.element.querySelector('.dqpl-top-bar');
    elements = {
      menu: fixture.element.querySelector('.dqpl-side-bar'),
      topBar: topBar,
      topBarItems: getTopLevels(topBar.querySelector('[role="menubar"]'), true),
      trigger: topBar.querySelector('.dqpl-menu-trigger'),
      scrim: document.getElementById('dqpl-side-bar-scrim'),
      dropdown: topBar.querySelector('.dqpl-dropdown')
    };

    main(elements); // attach the main events only once as they are delegated
  });

  beforeEach(() => {
    // reset everything
    Classlist(elements.trigger).remove('dqpl-active');
    Classlist(elements.menu).remove('dqpl-active').remove('dqpl-show');
    elements.menu.setAttribute('aria-expanded', 'false');
    Classlist(elements.scrim).remove('dqpl-scrim-show').remove('dqpl-scrim-fade-in');
    Classlist(elements.dropdown).remove('dqpl-dropdown-active');
    elements.dropdown.setAttribute('aria-expanded', 'false');
    elements.topBar.querySelector('.dd-trig').setAttribute('data-dropdown-expanded', 'false');
  });

  after(() => fixture.destroy().cleanUp());

  describe('clicks outside the open menu (data-locked=false)', () => {
    it('should close the menu', () => {
      elements.menu.setAttribute('aria-expanded', 'true');
      assert.isFalse(Classlist(elements.menu).contains('dqpl-show'));
      fire(fixture.element, 'click');
      assert.isTrue(Classlist(elements.menu).contains('dqpl-show'));
    });
  });

  describe('menu trigger clicks', () => {
    it('should open the menu', () => {
      elements.menu.setAttribute('aria-expanded', 'true');
      assert.isFalse(Classlist(elements.menu).contains('dqpl-show'));
      fire(elements.trigger, 'click');
      assert.isTrue(Classlist(elements.menu).contains('dqpl-show'));
    });
  });

  describe('top bar clicks', () => {
    it('should do nothing if the target is the menu trigger', () => {
      const dropdown = elements.dropdown;
      assert.equal(dropdown.getAttribute('aria-expanded'), 'false');
      fire(elements.trigger, 'click');
      assert.equal(dropdown.getAttribute('aria-expanded'), 'false');
    });

    it('should toggle the menu if the target is a trigger of a top-bar dropdown', (done) => {
      const dropdown = elements.dropdown;
      assert.equal(dropdown.getAttribute('aria-expanded'), 'false');
      fire(elements.topBar.querySelector('.dd-trig'), 'click');
      setTimeout(() => {
        assert.equal(dropdown.getAttribute('aria-expanded'), 'true');
        done();
      }, 400); // give animation/other timeouts a change to do stuff
    });
  });

  describe('top bar dropdown keydowns', () => {
    describe('up', () => {
      it('should focus the previous dropdown item', () => {
        const dropdown = elements.dropdown;
        const items = queryAll('[role="menuitem"]', dropdown);
        fire(elements.topBar.querySelector('.dd-trig'), 'click'); // open the dropdown
        fire(items[1], 'keydown', { which: 38 });
        assert.equal(items[0], document.activeElement);
      });
    });

    describe('down', () => {
      it('should focus the next dropdown item', () => {
        const items = queryAll('[role="menuitem"]', elements.dropdown);
        fire(elements.topBar.querySelector('.dd-trig'), 'click'); // open the dropdown
        fire(items[0], 'keydown', { which: 40 });
        assert.equal(items[1], document.activeElement);
      });
    });

    describe('escape/left', () => {
      it('should click the trigger', () => {
        const trig = elements.topBar.querySelector('.dd-trig');
        const items = queryAll('[role="menuitem"]', elements.dropdown);
        let clicked = false;
        trig.addEventListener('click', () => clicked = true);
        fire(items[0], 'keydown', { which: 27 });
        assert.isTrue(clicked);
      });
    });
  });

  describe('menu item setup', () => {
    it('should set tabindex properly', () => {
      // top bar items
      elements.topBarItems.forEach((item, i) => {
        assert.equal(item.tabIndex, i === 0 ? 0 : -1);
      });

      // menu (sidebar) items
      queryAll('[role="menu"]', elements.menu)
        .forEach((m) => {
          const mItems = queryAll('[role="menuitem"]', m);
          mItems.forEach((mi, i) => {
            assert.equal(mi.tabIndex, i === 0 ? 0 : -1);
          });
        });
    });
  });

  describe('top bar top-level menu item keydowns', () => {
    describe('left', () => {
      it('should focus the previous menu item', () => {
        fire(elements.topBarItems[2], 'keydown', { which: 37 });
        assert.equal(elements.topBarItems[1], document.activeElement);
      });
    });

    describe('right', () => {
      it('should focus the next menu item', () => {
        fire(elements.topBarItems[0], 'keydown', { which: 39 });
        assert.equal(elements.topBarItems[1], document.activeElement);
      });
    });

    describe('up/down on item with aria-controls', () => {
      it('should click the target', () => {
        let clicked = false;
        const trig = elements.topBar.querySelector('.dd-trig');
        trig.addEventListener('click', () => clicked = true);

        fire(trig, 'keydown', { which: 40 });
        assert.isTrue(clicked);
      });
    });
  });

  describe('enter or space', () => {
    it('should click the target', () => {
      let clicked = false;
      const trig = elements.topBar.querySelector('.dd-trig');
      trig.addEventListener('click', () => clicked = true);

      fire(trig, 'keydown', { which: 32 });
      assert.isTrue(clicked);
    });
  });

  describe('clicks on top bar menu items', () => {
    it('should click the inner link', () => {
      const withLink = elements.topBarItems[1];
      const link = withLink.querySelector('a');
      let clicked = false;

      link.addEventListener('click', () => clicked = true);

      fire(withLink, 'click');

      assert.isTrue(clicked);
    });
  });

  describe('top bar dropdown keydowns', () => {
    describe('escape/left on non-menu dropdown', () => {
      it('should click the dropdown\'s trigger', () => {
        const trig = elements.topBar.querySelector('.dd-trig');
        // temporarily remove role=menu
        elements.dropdown.removeAttribute('role');
        let clicked = false;
        trig.addEventListener('click', () => clicked = true);
        fire(elements.dropdown, 'keydown', { which: 27 });
        elements.dropdown.setAttribute('role', 'menu'); // restoration
        assert.isTrue(clicked);
      });
    });
  });

  describe('side bar menuitem keydowns', () => {
    describe('escape/left', () => {
      it('should click the menu\'s trigger', () => {
        fire(elements.trigger, 'click'); // open the menu
        elements.menu.removeAttribute('data-locked');

        const submenu = elements.menu.querySelector('.dqpl-submenu');
        const submenuTrigger = elements.menu.querySelector('[aria-controls]');

        let clicked = false;
        submenuTrigger.addEventListener('click', () => clicked = true);

        fire(submenu.querySelector('[role="menuitem"]'), 'keydown', { which: 27 });

        assert.isTrue(clicked);
      });
    });

    describe('down', () => {
      it('should focus next item', () => {
        fire(elements.trigger, 'click'); // open the menu
        const submenu = elements.menu.querySelector('.dqpl-submenu');
        const items = queryAll('[role="menuitem"]', submenu);
        fire(items[0], 'keydown', { which: 40 });

        assert.equal(items[1], document.activeElement);
      });
    });

    describe('up', () => {
      it('should focus prev item', () => {
        fire(elements.trigger, 'click'); // open the menu
        const submenu = elements.menu.querySelector('.dqpl-submenu');
        const items = queryAll('[role="menuitem"]', submenu);
        fire(items[1], 'keydown', { which: 38 });

        assert.equal(items[0], document.activeElement);
      });
    });

    describe('enter/space', () => {
      it('should click the target and the link inside of the target', () => {
        let targetClicked = false, linkClicked = false;
        const submenu = elements.menu.querySelector('.dqpl-submenu');
        const item = submenu.querySelector('[role="menuitem"]');
        const link = item.querySelector('a');

        item.addEventListener('click', () => targetClicked = true);
        link.addEventListener('click', () => linkClicked = true);

        fire(item, 'keydown', { which: 32 });

        assert.isTrue(targetClicked);
        assert.isTrue(linkClicked);
      });
    });

    describe('right', () => {
      it('should click the target if it has aria-controls', () => {
        const target = elements.menu.querySelector('[aria-controls]');
        let clicked = false;

        target.addEventListener('click', () => clicked = true);

        fire(target, 'keydown', { which: 39 });
        assert.isTrue(clicked);
      });
    });
  });

  describe('side bar menu item clicks', () => {
    describe('given a trigger of a submenu', () => {
      it('should toggle the submenu', (done) => {
        const target = elements.menu.querySelector('[aria-controls]');
        const dropdown = document.getElementById(target.getAttribute('aria-controls'));
        dropdown.setAttribute('aria-expanded', 'false');
        Classlist(dropdown).remove('dqpl-slidedown');

        fire(target, 'click');
        setTimeout(() => {
          assert.equal('true', dropdown.getAttribute('aria-expanded'));
          done();
        }, 420);
      });
    });

    describe('given an item with a child link', () => {
      it('should click the link', () => {
        const target = elements.menu.querySelector('.yo');
        const link = target.querySelector('a');
        let clicked = false;

        link.addEventListener('click', () => clicked = true);
        fire(target, 'click');

        assert.isTrue(clicked);
      });
    });
  });

  describe('tabs on the menu', () => {
    it('should close the menu if focus is no longer in the menu', (done) => {
      elements.menu.setAttribute('aria-expanded', 'true');
      fire(elements.menu, 'keydown', { which: 9 });
      setTimeout(() => {
        assert.equal(elements.menu.getAttribute('aria-expanded'), 'false');
        done();
      }, 420);
    });
  });
});
