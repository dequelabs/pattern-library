'use strict';

var markup = [
  '<div class="dqpl-top-bar">',
  '  <ul role="menubar">',
  '    <li class="dqpl-menu-trigger" role="menuitem" aria-label="Menu" aria-controls="dqpl-side-bar" aria-haspopup="true"><div class="fa fa-bars" role="presentation" aria-hidden="true"></div></li>',
  '    <li role="menuitem" tabindex="-1"><a href="#">LOGO</a></li>',
  '    <li role="menuitem" tabindex="-1"><a href="#">Other thing</a></li>',
  '    <li role="menuitem" class="dqpl-right-aligned" aria-controls="notifications">',
  '      dropdown',
  '      <div class="dqpl-dropdown" tabindex="-1" id="notifications" aria-expanded="false"><div>I am a notification</div><div>Lorem ipsum and stuff</div></div>',
  '    </li>',
  '  </ul>',
  '</div>',
  '<ul class="dqpl-side-bar dqpl-main-nav" id="dqpl-side-bar" role="menu" data-locked="false" data-prev-expanded="false" aria-expanded="false">',
  '  <li class="dqpl-branding dqpl-menuitem-selected" role="menuitem" tabindex="0"><a href="/" tabindex="-1" data-page-title="Deque Pattern Library"><div class="dqpl-logo">logo</div><div class="dqpl-name">Styleguide</div></a></li>',
  '  <li class="overview-with-link" role="menuitem" tabindex="-1"><a href="#" tabindex="-1" data-page-title="Overview | Deque Pattern Library">Overview</a></li>',
  '  <li role="menuitem" aria-controls="dqpl-components" aria-haspopup="true" tabindex="-1"><div class="dqpl-item-text">Components</div>',
  '    <ul class="dqpl-submenu" role="menu" id="dqpl-components" aria-expanded="false">',
  '      <li class=" " role="menuitem" tabindex="0"><a href="/components/fields" tabindex="-1" data-page-title="Fields | Components | Deque Pattern Library">Fields</a></li>',
  '      <li class=" " role="menuitem" tabindex="-1"><a href="/components/buttons" tabindex="-1" data-page-title="Buttons | Components | Deque Pattern Library">Buttons</a></li>',
  '      <li class=" " role="menuitem" tabindex="-1"><a href="/components/links" tabindex="-1" data-page-title="Links | Components | Deque Pattern Library">Links</a></li>',
  '    </ul>',
  '  </li>',
  '  <li role="menuitem" aria-controls="dqpl-composites" aria-haspopup="true" tabindex="-1"><div class="dqpl-item-text">Composites</div>',
  '    <ul class="dqpl-submenu" role="menu" id="dqpl-composites" aria-expanded="false">',
  '      <li class=" " role="menuitem" tabindex="0"><a href="/composites/top-bar" tabindex="-1" data-page-title="Top bar | Composites | Deque Pattern Library">Top bar</a></li>',
  '      <li class=" " role="menuitem" tabindex="-1"><a href="/composites/menu-navigation" tabindex="-1" data-page-title="Menu navigation | Composites | Deque Pattern Library">Menu navigation</a></li>',
  '    </ul>',
  '  </li>',
  '</ul>',
  '<div class="dqpl-scrim" id="dqpl-side-bar-scrim"></div>'
].join('');

describe('menu (top bar and side bar)', function () {
  var jQuery = window.jQuery;
  jQuery('#fixture').html(jQuery(markup));
  var $topbar = jQuery('.dqpl-top-bar');
  var $sidebar = jQuery('.dqpl-main-nav');
  $topbar.show();
  $sidebar.show();

  jQuery(document).trigger('dqpl:ready');

  after(function () {
    // don't show stuff once tests are done
    $topbar.hide();
    $sidebar.hide();
    jQuery('#fixture').empty();
  });

  describe('top bar', function () {
    var $topbarItems = $topbar.find('> ul > li[role="menuitem"]').filter(':visible');

    describe('tabindex', function () {
      it('should set tabindex to 0 on the FIRST menuitem', function () {
        assert.isTrue(active($topbarItems, 0));
      });

      it('should set tabindex to -1 on all menuitems aside from the first one', function () {
        $topbarItems.each(function (i, item) {
          if (0 !== i) {
            assert.equal(item.tabIndex, -1);
          }
        });
      });
    });

    describe('keyboard', function () {
      describe('LEFT ARROW', function () {
        it('should focus the PREV menuitem', function () {
          // fire a right arrow to "activate" the 2nd item
          var right = createEvent('keydown', 39);
          $topbarItems.first().focus().trigger(right);
          assert.equal(document.activeElement, $topbarItems[1]);
          assert.isTrue(active($topbarItems, 1));
        });

        // circularity test
        it('should focus the LAST menuitem if focus is on the FIRST menuitem', function () {
          var $first = $topbarItems.first();
          // "activate" the FIRST menuitem
          $topbarItems.prop('tabIndex', -1);
          $first.prop('tabIndex', 0).focus();

          var e = createEvent('keydown', 37);
          $first.trigger(e);
          assert.equal(document.activeElement, $topbarItems.last()[0]);
          assert.isTrue(active($topbarItems, $topbarItems.length - 1));
        });
      });

      describe('RIGHT ARROW', function () {
        it('should focus the NEXT menuitem', function () {
          var $first = $topbarItems.first();
          // "activate" the FIRST menuitem
          $topbarItems.prop('tabIndex', -1);
          $first.prop('tabIndex', 0).focus();

          var e = createEvent('keydown', 39);
          $first.trigger(e);

          assert.equal(document.activeElement, $topbarItems[1]);
          assert.isTrue(active($topbarItems, 1));
        });

        // circularity test
        it('should focus the FIRST menuitem if focus is on the LAST menuitem', function () {
          var $last = $topbarItems.last();
          // "activate" the LAST menuitem
          $topbarItems.prop('tabIndex', -1);
          $last.prop('tabIndex', 0).focus();

          // fire a right arrow
          var e = createEvent('keydown', 39);
          $last.trigger(e);

          assert.equal(document.activeElement, $topbarItems[0]);
          assert.isTrue(active($topbarItems, 0));
        });
      });

      describe('UP ARROW / DOWN ARROW on menuitem with aria-controls (submenu)', function () {
        it('should fire a click on the menuitem', function () {
          var clicked = false;
          var $itemWithSubmenu = $topbarItems.filter('[aria-controls]').last();

          if (!$itemWithSubmenu.length) {
            console.warn('No menuitem in topbar with a submenu (aria-controls)');
            assert(false);
            return;
          }

          $itemWithSubmenu.on('click', function () {
            clicked = true;
          });

          var $submenu = jQuery('#' + $itemWithSubmenu.attr('aria-controls'));
          // "activate" the item with the submenu
          $topbarItems.prop('tabIndex', -1);
          $itemWithSubmenu.prop('tabIndex', 0).focus();

          var e = createEvent('keydown', 40); // down arrow
          $itemWithSubmenu.trigger(e);
          assert.isTrue(clicked);
        });
      });

      describe('ENTER / SPACE BAR', function () {
        it('should fire a click on the menuitem', function () {
          var clicked = false;
          var $itemWithSubmenu = $topbarItems.filter('[aria-controls]').last();

          if (!$itemWithSubmenu.length) {
            console.warn('No menuitem in topbar with a submenu (aria-controls)');
            assert(false);
            return;
          }

          $itemWithSubmenu.on('click', function () {
            clicked = true;
          });

          var $submenu = jQuery('#' + $itemWithSubmenu.attr('aria-controls'));

          // "activate" the item with the submenu
          $topbarItems.prop('tabIndex', -1);
          $itemWithSubmenu.prop('tabIndex', 0).focus();

          var e = createEvent('keydown', 32); // space
          $itemWithSubmenu.trigger(e);
          assert.isTrue(clicked);
        });
      });

      describe('submenu', function () {
        it('should open the submenu when the triggering item is clicked', function () {
          var $itemWithSubmenu = $topbarItems.filter('[aria-controls]').last();

          if (!$itemWithSubmenu.length) {
            console.warn('No menuitem in topbar with a submenu (aria-controls)');
            assert(false);
            return;
          }

          var $submenu = jQuery('#' + $itemWithSubmenu.attr('aria-controls'));

          // "activate" the item with the submenu
          $topbarItems.prop('tabIndex', -1);
          $itemWithSubmenu.prop('tabIndex', 0).focus();
          // click the trigger
          $itemWithSubmenu.trigger('click');
          assert.equal('true', $submenu.attr('aria-expanded'));
          assert.isTrue($submenu.is(':visible'));
          // close it up
          $submenu.trigger(createEvent('keydown', 27));
        });

        it('should close the submenu with ESCAPE', function () {
          var $itemWithSubmenu = $topbarItems.filter('[aria-controls]').last();

          if (!$itemWithSubmenu.length) {
            console.warn('No menuitem in topbar with a submenu (aria-controls)');
            assert(false);
            return;
          }

          var $submenu = jQuery('#' + $itemWithSubmenu.attr('aria-controls'));

          // "activate" the item with the submenu
          $topbarItems.prop('tabIndex', -1);
          $itemWithSubmenu.prop('tabIndex', 0).focus();
          // click the trigger
          $itemWithSubmenu.trigger('click');

          // close it up
          $submenu.trigger(createEvent('keydown', 27));

          assert.equal('false', $submenu.attr('aria-expanded'));
          assert.isFalse($submenu.is(':visible'));
        });

        it('should close the submenu with UP ARROW', function () {
          var $itemWithSubmenu = $topbarItems.filter('[aria-controls]').last();

          if (!$itemWithSubmenu.length) {
            console.warn('No menuitem in topbar with a submenu (aria-controls)');
            assert(false);
            return;
          }

          var $submenu = jQuery('#' + $itemWithSubmenu.attr('aria-controls'));

          // "activate" the item with the submenu
          $topbarItems.prop('tabIndex', -1);
          $itemWithSubmenu.prop('tabIndex', 0).focus();
          // click the trigger
          $itemWithSubmenu.trigger('click');

          // close it up
          $submenu.trigger(createEvent('keydown', 38));

          assert.equal('false', $submenu.attr('aria-expanded'));
          assert.isFalse($submenu.is(':visible'));
        });
      });
    });

    describe('mouse click on menuitem with child link', function () {
      it('should click the link inside', function () {
        var clicked = false;
        var $itemWithLink = $topbarItems.filter(function () {
          return jQuery(this).find('a').length > 0;
        }).first();

        $itemWithLink.find('a').on('click', function () {
          clicked = true;
        });

        $itemWithLink.trigger('click');
        assert.isTrue(clicked);
      });
    });
  });

  describe('side bar (main navigation)', function () {
    var $topLevels = $sidebar.find('> li[role="menuitem"]');
    before(function (done) {
      // ensure its visible
      if (!$sidebar.is(':visible')) {
        jQuery('.dqpl-menu-trigger').trigger('click');
        setTimeout(function () { // allow animation to take place
          done();
        }, 100);
      } else {
        done();
      }
    });

    describe('attributes', function () {
      it('should add tabindex="0" to the FIRST menuitem within sidebar', function () {
        assert.equal($topLevels.prop('tabIndex'), 0);
      });
    });

    describe('keyboard', function () {
      describe('DOWN ARROW', function () {
        it('should focus the NEXT item', function () {
          $topLevels.first().trigger(createEvent('keydown', 40));
          assert.equal(document.activeElement, $topLevels[1]);
          assert.isTrue(active($topLevels, 1));
        });

        it('should focus the FIRST item if fired on the LAST item', function () {
          var $last = $topLevels.last();
          // activate the LAST item...
          $topLevels.prop('tabIndex', -1);
          $last.prop('tabIndex', 0).focus();

          $last.trigger(createEvent('keydown', 40));
          assert.equal(document.activeElement, $topLevels[0]);
          assert.isTrue(active($topLevels, 0));
        });
      });

      describe('UP ARROW', function () {
        it('should focus the PREV item', function () {
          var $last = $topLevels.last();
          // activate the LAST item...
          $topLevels.prop('tabIndex', -1);
          $last.prop('tabIndex', 0).focus();

          $last.trigger(createEvent('keydown', 38));

          assert.equal(document.activeElement, $topLevels[$topLevels.length - 2]);
          assert.isTrue(active($topLevels, $topLevels.length - 2));
        });

        it('should focus the LAST item if fired on the FIRST item', function () {
          var $first = $topLevels.first();
          var $last = $topLevels.last();
          // activate the FIRST item...
          $topLevels.prop('tabIndex', -1);
          $first.prop('tabIndex', 0).focus();

          $first.trigger(createEvent('keydown', 38));

          assert.equal(document.activeElement, $last[0]);
          assert.isTrue(active($topLevels, $topLevels.length - 1));
        });
      });

      describe('ENTER/SPACE', function () {
        it('should fire a click on the item', function () {
          var clicked = false;
          var $activeOne = $topLevels.filter('[tabindex="0"]');

          $activeOne.on('click', function () {
            clicked = true;
          });

          $activeOne.trigger(createEvent('keydown', 32));
          assert.isTrue(clicked);
        });

        it('should fire a click on a child anchor', function () {
          var clicked = false;
          var $overviewItem = $topLevels.filter('.overview-with-link');
          var $overviewLink = $overviewItem.find('a').first();

          $overviewLink.on('click', function (e) {
            e.preventDefault();
            clicked = true;
          });

          $overviewItem.trigger(createEvent('keydown', 13));
        });
      });

      describe('RIGHT ARROW', function () {
        it('should fire a click on the item if it has aria-controls', function (done) {
          var clicked = false;
          var $withControls = $topLevels.filter('[aria-controls]').first();
          $topLevels.prop('tabIndex', -1);
          $withControls.prop('tabIndex', 0).focus();

          $withControls
            .on('click', function () {
              clicked = true;
            })
            .trigger(createEvent('keydown', 39));

          assert.isTrue(clicked);
          setTimeout(function () {
            done();
          }, 400);
        });
      });
    });

    describe('mouse clicks', function () {
      describe('with submenu', function () {
        it('should open the submenu', function (done) {
          // get everything in a collapsed state...
          $topLevels.prop('tabIndex', -1);
          $topLevels.removeClass('dqpl-weight-bold');
          $sidebar.find('.dqpl-submenu').attr('aria-expanded', 'false').hide();
          var $withSubmenu = $topLevels.filter('[aria-controls]').first();
          var $submenu = jQuery('#' + $withSubmenu.attr('aria-controls'));
          $withSubmenu.prop('tabIndex', 0).trigger('click');
          setTimeout(function () {
            assert.equal($submenu.attr('aria-expanded'), 'true');
            done();
          }, 500);
        });
      });

      describe('with no submenu AND an anchor', function () {
        it('should click the link inside', function () {
          var clicked = false;
          var $overviewItem = $topLevels.filter('.overview-with-link');
          var $overviewLink = $overviewItem.find('a').first();

          $overviewLink.on('click', function () {
            clicked = true;
          });

          $overviewItem.trigger('click');
        });
      });
    });
  });

  /**
   * Checks if all items in `$list` have tabindex="-1" EXCEPT the
   * item at`zeroIndex` index, in which it checks for tabindex="0"
   */
  function active($list, zeroIndex) {
    var allGoods = 0;

    $list.each(function (i, item) {
      var expected = i === zeroIndex ? 0 : -1;
      if (jQuery(item).prop('tabIndex') === expected) {
        allGoods++;
      }
    });

    return allGoods === $list.length;
  }

  function createEvent(type, which) {
  	var e = jQuery.Event(type);
  	if (which) { e.which = which; }
  	return e;
  }
});
