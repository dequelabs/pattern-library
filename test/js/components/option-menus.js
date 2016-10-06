'use strict';

describe('Option Menus', function () {
  var HTML = [
    '<div class="dqpl-options-menu-wrap dqpl-align-left">',
      '<button class="dqpl-options-menu-trigger" type="button" aria-controls="options-menu-1" aria-label="Additional Options" aria-expanded="false">',
        '<div class="fa fa-ellipsis-v" aria-hidden="true"></div>',
      '</button>',
      '<ul class="dqpl-options-menu" id="options-menu-1" role="menu" aria-expanded="false">',
        '<li class="dqpl-options-menuitem" role="menuitem" tabindex="-1">Action 1</li>',
        '<li class="dqpl-options-menuitem" role="menuitem" tabindex="-1">Action 2</li>',
        '<li class="dqpl-options-menuitem" role="menuitem" tabindex="-1">Action 3</li>',
        '<li class="dqpl-options-menuitem" role="menuitem" tabindex="-1">Action 4</li>',
        '<li class="dqpl-options-menuitem" role="menuitem" tabindex="-1"><a href="#">Action 5</a></li>',
      '</ul>',
    '</div>',
    '<div class="dqpl-options-menu-wrap dqpl-align-left">',
      '<button class="dqpl-options-menu-trigger" type="button" aria-controls="options-menu-2" aria-label="Additional Options" aria-expanded="false">',
        '<div class="fa fa-ellipsis-v" aria-hidden="true"></div>',
      '</button>',
      '<ul class="dqpl-options-menu" id="options-menu-2" role="menu" aria-expanded="false">',
        '<li class="dqpl-options-menuitem" role="menuitem" tabindex="-1">Action 1</li>',
        '<li class="dqpl-options-menuitem" role="menuitem" aria-disabled="true" tabindex="-1">Action 2</li>',
        '<li class="dqpl-options-menuitem" role="menuitem" tabindex="-1">Action 3</li>',
        '<li class="dqpl-options-menuitem" role="menuitem" tabindex="-1">Action 4</li>',
        '<li class="dqpl-options-menuitem" role="menuitem" tabindex="-1"><a href="#">Action 5</a></li>',
      '</ul>',
    '</div>'
  ].join('');
  var jQuery = window.jQuery;
  var $fixture = jQuery('#fixture');
  var $triggers, $dropdowns;

  beforeEach(function () {
    $fixture.empty().html(HTML);
    $triggers = $fixture.find('.dqpl-options-menu-trigger');
    $dropdowns = $fixture.find('.dqpl-options-menu');
  });

  afterEach(function () {
    $fixture.empty();
  });

  describe('events', function () {
    describe('clicks on document (not within trigger or dropdown)', function () {
      it('should collapse all option menus', function () {
        $triggers.eq(0).trigger('click');
        assert.equal('true', $triggers.eq(0).attr('aria-expanded'));
        assert.equal('true', $dropdowns.eq(0).attr('aria-expanded'));
        jQuery(document).trigger('click');
        assert.equal('false', $triggers.eq(0).attr('aria-expanded'));
        assert.equal('false', $dropdowns.eq(0).attr('aria-expanded'));
      });
    });

    describe('clicks on triggers', function () {
      it('should toggle aria-expanded on both the trigger and the dropdown', function () {
        var $trig = $triggers.last();
        var $menu = $dropdowns.last();
        $trig.trigger('click');
        assert.equal('true', $trig.attr('aria-expanded'));
        assert.equal('true', $menu.attr('aria-expanded'));
      });

      it('should collapse all other menus', function () {
          // open the first one...
          $triggers.eq(0).trigger('click');
          assert.equal('true', $triggers.eq(0).attr('aria-expanded'));
          assert.equal('true', $dropdowns.eq(0).attr('aria-expanded'));
          // open the second one...
          $triggers.eq(1).trigger('click');

          assert.equal('true', $triggers.eq(1).attr('aria-expanded'));
          assert.equal('true', $dropdowns.eq(1).attr('aria-expanded'));
          assert.equal('false', $triggers.eq(0).attr('aria-expanded'));
          assert.equal('false', $dropdowns.eq(0).attr('aria-expanded'));

      });

      it('should focus the first item in the dropdown when expanded', function () {
        var $trig = $triggers.first();
        var $menu = $dropdowns.first();
        $trig.trigger('click');
        assert.equal(document.activeElement, $menu.find('[role="menuitem"]')[0]);
      });
    });

    describe('down arrow on trigger', function () {
      it('should click the trigger', function () {
        var clicked = false;
        var $trig = $triggers.last();
        var $menu = $dropdowns.last();

        $trig.on('click', function () {
          clicked = true;
        });

        $trig.trigger(createEvent('keydown', 40));
        assert.isTrue(clicked);
      });
    });

    describe('keydowns on menuitems', function () {
      describe('UP ARROW', function () {
        it('should focus the PREVIOUS option', function () {
          var $trig = $triggers.first();
          var $menu = $dropdowns.first();
          var $opts = $menu.find('[role="menuitem"]');
          var $third = $opts.eq(2);
          var $second = $opts.eq(1);
          // open the menu...
          $trig.trigger('click');
          $third
            .focus()
            .trigger(createEvent('keydown', 38));

          assert.equal(document.activeElement, $second[0]);
        });

        it('should skip disabled items', function () {
          var $trig = $triggers.last();
          var $menu = $dropdowns.last();
          var $opts = $menu.find('[role="menuitem"]');
          $trig.trigger('click');
          $opts.eq(2).trigger(createEvent('keydown', 38));
          // the disabled item is at eq 1, so assert that it goes from 2 to 0...
          assert.equal(document.activeElement, $opts.eq(0)[0]);
        });

        it('should be circular', function () {
          var $trig = $triggers.first();
          var $menu = $dropdowns.first();
          var $opts = $menu.find('[role="menuitem"]');

          $trig.trigger('click');
          $opts.first().trigger(createEvent('keydown', 38));
          // up arrow -> go from first to last option
          assert.equal(document.activeElement, $opts.last()[0]);
        });
      });

      describe('DOWN ARROW', function () {
        it('should focus the NEXT option', function () {
          var $trig = $triggers.first();
          var $menu = $dropdowns.first();
          var $opts = $menu.find('[role="menuitem"]');

          $trig.trigger('click');
          $opts.first().trigger(createEvent('keydown', 40));
          assert.equal(document.activeElement, $opts.eq(1)[0]);
        });

        it('should skip disabled items', function () {
          var $trig = $triggers.last();
          var $menu = $dropdowns.last();
          var $opts = $menu.find('[role="menuitem"]');
          $trig.trigger('click');
          $opts.eq(0).trigger(createEvent('keydown', 40));
          // the disabled item is at eq 1, so assert that it goes from 0 to 2...
          assert.equal(document.activeElement, $opts.eq(2)[0]);
        });

        it('should be circular', function () {
          var $trig = $triggers.first();
          var $menu = $dropdowns.first();
          var $opts = $menu.find('[role="menuitem"]');

          $trig.trigger('click');
          $opts.last().trigger(createEvent('keydown', 40));
          // down arrow -> go from last to first option
          assert.equal(document.activeElement, $opts.first()[0]);
        });
      });

      describe('ESCAPE', function () {
        it('should trigger a click on / focus the trigger', function () {
          var clicked = false;
          var $trig = $triggers.first();
          var $menu = $dropdowns.first();

          $trig.trigger('click');

          $trig.on('click', function () {
            clicked = true;
          });

          $menu
            .find('[role="menuitem"]')
              .first()
              .trigger(createEvent('keydown', 27));

          assert.isTrue(clicked);
          assert.equal(document.activeElement, $trig[0]);
        });
      });

      describe('ENTER', function () {
        it('should trigger a click on the menuitem', function () {
          var clicked = false;
          var $trig = $triggers.first();
          var $menu = $dropdowns.first();
          var $item = $menu.find('[role="menuitem"]').last();

          $item.on('click', function () {
            clicked = true;
          });

          $item.trigger(createEvent('keydown', 13));
          assert.isTrue(clicked);
        });
      });

      describe('SPACE', function () {
        it('should trigger a click on the menuitem', function () {
          var clicked = false;
          var $trig = $triggers.first();
          var $menu = $dropdowns.first();
          var $item = $menu.find('[role="menuitem"]').last();

          $item.on('click', function () {
            clicked = true;
          });

          $item.trigger(createEvent('keydown', 32));
          assert.isTrue(clicked);
        });
      });
    });

    describe('mouse clicks on menuitems', function () {
      it('should click an anchor within a menuitem', function () {
        var clicked = false;
        var $trig = $triggers.first();
        var $menu = $dropdowns.first();
        var $item = $menu.find('[role="menuitem"]').last();

        $item.find('a').on('click', function (e) {
          e.preventDefault();
          clicked = true;
        });

        $item.trigger('click');
        assert.isTrue(clicked);
      });
    });
  });

  function createEvent(type, which) {
  	var e = jQuery.Event(type);
  	if (which) { e.which = which; }
  	return e;
  }
});
