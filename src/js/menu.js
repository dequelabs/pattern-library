(function () {
  'use strict';

  var ACTIVE_CLASS = 'dqpl-active';
  var $topBar = jQuery('.dqpl-top-bar');
  var $trigger = $topBar.find('.dqpl-menu-trigger');
  var $menu = jQuery('.dqpl-main-nav');
  // top level menuitems
  var $topBarMenuItems = findTopLevels($topBar.find('ul').first());
  // top level side bar menu items
  var $sideMenuTopLevels = findTopLevels($menu);

  /**
   * Toggle menu on hamburger clicks
   */
  $trigger.on('click', function () {
    toggleSubmenu($trigger, function (_, done) {
      $trigger.toggleClass(ACTIVE_CLASS);

      var first = $menu.hasClass(ACTIVE_CLASS) ? ACTIVE_CLASS : 'dqpl-show';
      var second = first === ACTIVE_CLASS ? 'dqpl-show' : ACTIVE_CLASS;

      $menu.toggleClass(first);
      setTimeout(function () {
        $menu.toggleClass(second);
        setTimeout(done);
      }, 100);
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
          arrowHandler($topBarMenuItems, $target, which === 39 ? 'next' : 'prev');
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
          // var $link = $target.find('a');
          // if ($link.length) {
          //   $link[0].click();
          // }
          break;
      }
    })
    .on('click', '[role="menuitem"]', function () {
      var $target = jQuery(this);
      var $link = $target.find('a');
      if ($link.length) {
        $link[0].click();
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
    .on('click', '[role="menuitem"][aria-controls]', function (e) {
      e.stopPropagation();
      var $trigger = jQuery(this);
      toggleSubmenu($trigger, function ($submenu, done) {
        // TODO: CSS Transition?
        $submenu.slideToggle();
        $trigger.toggleClass('dqpl-weight-bold');
        setTimeout(done);
      });
    });


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

    toggleFn($droplet, function () {
      var prevExpanded = $droplet.attr('aria-expanded');
      var wasCollapsed = !prevExpanded || prevExpanded === 'false';
      $droplet.attr('aria-expanded', wasCollapsed);
      var $focusMe = wasCollapsed ?
        $droplet.find('[role="menuitem"][tabindex="0"]').filter(':visible').first() :
        $droplet.closest('[aria-controls][role="menuitem"]');

      $focusMe = $focusMe.length ? $focusMe : $trigger;
      $focusMe.focus();
    });
  }

  /**
   * Finds the top level menu items of a menu
   */
  function findTopLevels($ul) {
    return $ul.children().filter('[role="menuitem"]');
  }
}());
