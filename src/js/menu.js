(function () {
  'use strict';

  /**
   * TODO: Handle submenus (other than menu) of topbar
   */

  var initialState;
  var ACTIVE_CLASS = 'dqpl-active';
  var $topBar = jQuery('.dqpl-top-bar');
  var $trigger = $topBar.find('.dqpl-menu-trigger');
  var $menu = jQuery('.dqpl-main-nav');
  var $scrim = jQuery('#dqpl-side-bar-scrim');
  // top level menuitems
  var $topBarMenuItems = findTopLevels($topBar.find('[role="menubar"]').first(), true);

  /**
   * Listen for resize so we can configure stuff based on the locking of the menu
   */
  jQuery.throttle({
    element: window,
    event: 'resize',
    delay: 100
  }, onResize);

  onResize();


  /**
   * Listen for refresh events
   * (prevents menus from getting in funky states)
   */
  $topBar.on('dqpl:refresh', onRefresh);

  /**
   * Listen for clicks outside the menu (when
   * its opened AND not locked) to close it
   */
  jQuery(document).on('click', function (e) {
    var $target = jQuery(e.target);
    var isWithin = $target.closest('.dqpl-main-nav').length;
    var isHamburger = $target.is('.dqpl-menu-trigger') || !!$target.closest('.dqpl-menu-trigger').length;
    if (isWithin || isHamburger || $menu.attr('data-locked') === 'locked') {
      return;
    }

    if ($menu.attr('aria-expanded') === 'true') {
      onTriggerClick();
    }
  });

  /**
   * Toggle menu on hamburger clicks
   */
  $trigger.on('click', onTriggerClick);

  function onTriggerClick(e, noFocus) {
    toggleSubmenu($trigger, function (_, done) {
      $trigger.toggleClass(ACTIVE_CLASS);
      var wasActive = $menu.hasClass(ACTIVE_CLASS);
      var first = wasActive ? ACTIVE_CLASS : 'dqpl-show';
      var second = first === ACTIVE_CLASS ? 'dqpl-show' : ACTIVE_CLASS;

      $menu.toggleClass(first);
      $scrim.toggleClass('dqpl-scrim-show');
      setTimeout(function () {
        $menu.toggleClass(second);
        $scrim.toggleClass('dqpl-scrim-fade-in');
        setTimeout(function () {
          done(noFocus);
        });
      }, 100);
    });
  }

  /**
   * Toggle submenu on other menu items with submenus
   */
  $topBar.on('click', '[role="menuitem"][aria-controls]', function () {
    var $this = jQuery(this);
    // trigger clicks are handled separately...
    if ($this.is($trigger)) { return; }

    toggleSubmenu($this, function ($dropdown, done) {
      $dropdown.toggleClass('dqpl-dropdown-active');
      done(false, ($dropdown.hasClass('dqpl-dropdown-active') ? $dropdown : $this));
    });

  });

  /**
   * Setup for menu items
   */
  $topBarMenuItems.prop('tabIndex', -1).first().prop('tabIndex', 0);
  $menu.find('[role="menu"]').each(function (_, menu) {
    var $menuItems = jQuery(menu).find('[role="menuitem"]');
    $menuItems.prop('tabIndex', -1).first().prop('tabIndex', 0);
  });

  /**
   * Keyboard logic for top bar
   */
  $topBar
    .on('keydown', '[role="menuitem"]', function (e) {
      var which = e.which;
      var $target = jQuery(e.target);

      switch (which) {
        case 37:
        case 39:
          e.preventDefault(); // don't scroll
          arrowHandler(
            findTopLevels($topBar.find('[role="menubar"]').first(), true),
            $target, which === 39 ? 'next' : 'prev'
          );
          break;
        case 38:
        case 40:
          e.preventDefault();
          if ($target.attr('aria-controls')) {
            $target.click();
          }
          break;
        case 13:
        case 32:
          e.preventDefault();
          $target.click();
          break;
      }
    })
    .on('click', '[role="menuitem"]', function () {
      var $target = jQuery(this);
      var $link = $target.find('a');
      if ($link.length) {
        $link[0].click();
      }
    })
    .on('keydown', '.dqpl-dropdown', function (e) {
      var which = e.which;
      var $target = jQuery(e.target);
      var $dropdown = jQuery(this);

      switch (which) {
        case 27:
        case 38:
          var id = $dropdown.prop('id');
          var $trigger = jQuery('[aria-controls="' + id + '"]');
          $trigger.click();
          break;
      }
    });

  /**
   * Keyboard logic for menu (side bar)
   * - up/down traverse through menu items
   * - right (with submenu) opens submenu / focuses first item
   * - left/escape closes submenu (if within one) OR closes menu (if at top level)
   */
  $menu
    .on('keydown', '[role="menuitem"]', function (e) {
      var which = e.which;
      var $target = jQuery(e.target);

      switch (which) {
        case 27:
        case 37:
          if ($menu.attr('data-locked') === 'true' && $target.parent().is($menu)) {
            return;
          }
          e.preventDefault();
          e.stopPropagation(); // prevent bubbling for sake of submenus
          var $thisMenu = $target.closest('[role="menu"]');
          jQuery('[aria-controls="' + $thisMenu.prop('id') + '"]').click();
          break;
        case 40:
          e.preventDefault();
          arrowSetup($target, 'next');
          break;
        case 38:
          e.preventDefault();
          arrowSetup($target, 'prev');
          break;
        case 32:
        case 13:
          e.preventDefault();
          $target.click();
          if (!$target.attr('aria-controls')) {
            var $link = $target.find('a');
            if ($link.length) {
              $link[0].click();
            }
          }
          break;
        case 39:
          if ($target.attr('aria-controls')) {
            $target.click();
          }
          break;
      }
    })
    /**
     * Mouse logic for expandable submenu triggers
     */
    .on('click', '[role="menuitem"]', function (e) {
      e.stopPropagation();
      var $trigger = jQuery(this);
      if ($trigger.attr('aria-controls')) {
        toggleSubmenu($trigger, function ($submenu, done) {
          // TODO: CSS Transition?
          $submenu.slideToggle();
          $trigger.toggleClass('dqpl-weight-bold');
          setTimeout(done);
        });
      } else {
        var $link = $trigger.find('a');
        if ($link.length) {
          $link[0].click();
        }
      }
    })
    .on('keydown', function (e) {
      var which = e.which;
      if (which !== 9) { return; }
      setTimeout(function () {
        var outsideOfMenu = !$menu.has(document.activeElement).length;
        var isExpanded = $menu.attr('aria-expanded') === 'true';
        if (outsideOfMenu && isExpanded) {
          onTriggerClick(null, true);
        }
      });
    });


  /**
   * The menu is locked into visibility above 1024px viewport...
   * - ensure aria-expanded is removed/readded properly
   * - ensure the topbar menu isn't thrown off (in case the hamburger was the "active" item)
   */
  function onResize() {
    var width = jQuery(window).width();

    if (width >= 1024) {
      $menu.attr('data-prev-expanded', $menu.attr('aria-expanded'));
      $menu.removeAttr('aria-expanded');
      $scrim.removeClass('dqpl-scrim-show').removeClass('dqpl-scrim-fade-in');

      if ($trigger.prop('tabIndex') === 0) {
        // since `$trigger` gets hidden (via css) "activate" something else in the menubar
        $topBarMenuItems = findTopLevels($topBar.find('[role="menubar"]').first(), true);
        $topBarMenuItems.prop('tabIndex', -1).first().prop('tabIndex', 0);
      }
      $menu.attr('data-locked', 'true');
    } else {
      $menu.attr('aria-expanded', $menu.attr('data-prev-expanded') || 'false');
      $topBarMenuItems = findTopLevels($topBar.find('ul').first(), true);
      $menu.attr('data-locked', 'false');
      if ($menu.attr('data-prev-expanded') === 'true') {
        $scrim.addClass('dqpl-scrim-show').addClass('dqpl-scrim-fade-in');
      }
    }
  }

  /**
   * Ensure that there is 1 item with tabindex="0"
   */
  function onRefresh() {
    $topBarMenuItems = findTopLevels($topBar.find('[role="menubar"]').first(), true);
    var $activeOne = $topBarMenuItems.filter('[tabindex="0"]');
    if (!$activeOne.length) {
      $topBarMenuItems.first().prop('tabIndex', 0);
    }
  }

  /**
   * Activates a menuitem and deactivates the previously active
   * by giving the previously active menuitem tabindex="-1" and
   * giving the newly active menuitem tabindex="0"
   */
  function activateMenuitem($prevActive, $newlyActive) {
    $prevActive.prop('tabIndex', -1);
    $newlyActive.prop('tabIndex', 0).focus();
  }

  /**
   * Handles left/right arrow navigation
   */
  function arrowHandler($items, $target, dir) {
    var isNext = dir === 'next';
    var currentIdx = $items.index($target[0]);
    var $adjacent = $items.eq(isNext ? currentIdx + 1 : currentIdx - 1);

    // circularity (first or last)
    if (!$adjacent.length) {
      $adjacent = $items.eq(isNext ? 0 : $items.length - 1);
    }

    activateMenuitem($target, $adjacent);
  }

  /**
   * Setup for arrow handler...finds the top levels and calls `arrowHandler`
   */
  function arrowSetup($target, dir) {
    var $items = findTopLevels($target.closest('[role="menu"]'));
    arrowHandler($items, $target, dir);
  }

  /**
   * toggles a menu or submenu
   * @param  {jQuery} $trig      jQuery wrapped element ref of the trigger of the given menu
   * @param  {function} toggleFn a function that handles the toggling of the given menu
   */
  function toggleSubmenu($trig, toggleFn) {
    var $droplet = jQuery('#' + $trig.attr('aria-controls'));

    if (!$droplet.length) {
      return;
    }

    toggleFn($droplet, function (noFocus, $focus) {
      var prevExpanded = $droplet.attr('aria-expanded');
      var wasCollapsed = !prevExpanded || prevExpanded === 'false';
      $droplet.attr('aria-expanded', wasCollapsed);
      if ($focus) {
        $focus.focus();
      } else if (!noFocus) {
        var $focusMe = wasCollapsed ?
          $droplet.find('[role="menuitem"][tabindex="0"]').filter(':visible').first() :
          $droplet.closest('[aria-controls][role="menuitem"]');

        $focusMe = $focusMe.length ? $focusMe : $trigger;
        $focusMe.focus();
      }
    });
  }

  /**
   * Finds the top level menu items of a menu
   */
  function findTopLevels($ul, visible) {
    var $chiles = $ul.children().filter('[role="menuitem"]');
    return (visible) ? $chiles.filter(':visible') : $chiles;
  }
}());
