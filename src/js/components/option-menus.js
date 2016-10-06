(function () {
  'use strict';

  jQuery(document)

    /**
     * Clicks on the document (outside of a dropdown or
     * trigger) should close all expanded options menus
     */

    .on('click', function (e) {
      var $target = jQuery(e.target);
      var selector = '.dqpl-options-menu, .dqpl-options-menu-trigger';
      if (!isOrWithin($target, selector)) {
        // collapse all menus...
        jQuery(selector).attr('aria-expanded', 'false');
      }
    })

    /**
     * Clicks on triggers
     */

    .on('click', '.dqpl-options-menu-trigger', function () {
      var $trigger = jQuery(this);
      var dropdownID = $trigger.attr('aria-controls');
      var $dropdown = jQuery('#' + dropdownID);
      var wasExpanded = $trigger.attr('aria-expanded') === 'true';
      // collapse all other menus...
      cleanUp($trigger, $dropdown);
      // toggle expanded
      $trigger.attr('aria-expanded', !wasExpanded);
      // this is what actually toggle the visibility too (css)
      $dropdown.attr('aria-expanded', !wasExpanded);

      if (!wasExpanded) { // its now open...
        // focus the first item
        $dropdown.find('[role="menuitem"]').first().focus();
      }
    })

    /**
     * Keydowns on triggers
     */

    .on('keydown', '.dqpl-options-menu-trigger', function (e) {
      if (e.which === 40) {
        e.preventDefault();
        jQuery(this).trigger('click');
      }
    })

    /**
     * Keydowns on options menuitems
     */

    .on('keydown', '.dqpl-options-menu [role="menuitem"]', function (e) {
      var which = e.which;
      var $this = jQuery(this);
      if (which === 38 || which === 40) {
        e.preventDefault();
        adjacentItem($this, which === 38 ? 'up' : 'down');
      } else if (which === 27) {
        // find the trigger and click/focus it
        var $thisDropdown = $this.closest('[role="menu"]');
        var id = $thisDropdown.prop('id');
        var $thisTrigger = jQuery('.dqpl-options-menu-trigger[aria-controls="' + id + '"]');
        $thisTrigger.trigger('click').focus();
      } else if (which === 13 || which === 32) {
        e.preventDefault();
        $this.trigger('click');
      }
    })

    /**
     * Clicks on options menuitems
     *
     * (If theres a link in it, click it)
     */

    .on('click', '.dqpl-options-menu [role="menuitem"]', function () {
      var $link = jQuery(this).find('a');
      if ($link.length) {
        $link[0].click();
      }
    })

    /**
     * Clicks on links within options menuitems
     *
     * In case its for whatever reason an internal link - prevent inifinite loop
     * (This click would bubble up to the menuitem which would trigger a click
     * on this link which would bubble up and repeat itself infinitely)
     */

    .on('click', '.dqpl-options-menu [role="menuitem"] a', function (e) {
      e.stopPropagation();
    });

  /**
   * Finds and focuses the adjacent menu item based on `dir`
   * @param  {jQuery} $target The currently focused item
   * @param  {String} dir     The direction ("up" or "down")
   */

  function adjacentItem($target, dir) {
    var isDown = dir === 'down';
    var $dropdown = $target.closest('[role="menu"]');
    var $items = $dropdown.find('[role="menuitem"]').filter(':visible').filter(isEnabled);
    var currentIndex = jQuery.inArray($target[0], $items);
    var adjacentIndex = isDown ? currentIndex + 1 : currentIndex - 1;

    if (isDown && adjacentIndex === $items.length) {
      adjacentIndex = 0;
    } else if (!isDown && adjacentIndex === -1) {
      adjacentIndex = $items.length - 1;
    }

    $items.eq(adjacentIndex).focus();
  }

  /**
   * Used to filter out disabled items
   */

  function isEnabled(_, item) {
    return !jQuery(item).is('[aria-disabled]');
  }

  /**
   * Determines if `$target` is, or is within element(s)
   * @param {jQuery} $target The element in question
   * @param {String} sel     The selector
   */

  function isOrWithin($target, sel) {
    return $target.is(sel) || !!$target.closest(sel).length;
  }

  /**
   * Collapses all menus/triggers other than those passed in
   */

  function cleanUp($trigger, $menu) {
    jQuery('.dqpl-options-menu, .dqpl-options-menu-trigger')
      .filter(function () {
        return this !== $trigger[0] && this !== $menu[0];
      })
      .attr('aria-expanded', 'false');
  }
}());
