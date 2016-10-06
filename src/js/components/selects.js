(function () {
  'use strict';
  var TYPE_TIME = 600;

  initSelects();

  jQuery(document).on('dqpl:ready', initSelects);

  function initSelects() {
    jQuery('.dqpl-combobox').each(function (_, select) {
      var $combobox = jQuery(select).prop('tabIndex', 0);
      var dropdownId = $combobox.attr('aria-owns');
      var $listbox = jQuery(['#', dropdownId].join(''));

      if (!dropdownId || !$listbox.length) {
        console.warn('Unable to find listbox using the comboboxes "aria-owns" attribute for: ', select);
        return;
      }

      // create an element to place the value in
      var $pseudoVal = $combobox.find('.dqpl-pseudo-value');
      if (!$pseudoVal.length) {
        $pseudoVal = jQuery('<div class="dqpl-pseudo-value" />');
      }

      $combobox.append($pseudoVal);
      $combobox.noClobber($pseudoVal, 'aria-labelledby');

      // give each option a unique id (if it doesn't already have one)
      $listbox.find('[role="option"]').rndid();
      checkForMissingAttrs($combobox, $listbox);
      attachEvents($combobox, $listbox);

      // check if there is a default selected and ensure it has the right attrs/classes
      var initiallyActive = $combobox.attr('aria-activedescendant');
      if (initiallyActive) {
        jQuery('#' + initiallyActive)
          .attr('aria-selected', 'true')
          .addClass('dqpl-option-active');
      }
    });
  }

  function attachEvents($combobox, $listbox) {
    $combobox
      .off('click', onComboClick)
      .on('click', onComboClick)
      .off('blur', onComboBlur)
      .on('blur', onComboBlur)
      .off('keydown', onComboKeydown)
      .on('keydown', onComboKeydown);

    $listbox
      .off('mousedown.dqplSelect', '[role="option"]')
      .on('mousedown.dqplSelect', '[role="option"]', function () {
        // detach blur events so the list doesn't close
        $combobox.off('blur', onComboBlur);
        var $option = jQuery(this);
        $combobox.attr('aria-activedescendant', $option.prop('id'));
        activateOption($combobox, $listbox, true);
        selectOption($combobox, $listbox, true);
        jQuery(document)
          .off('mouseup.dqplBlurry')
          .one('mouseup.dqplBlurry', function () {
            $combobox.focus();
            $listbox.removeClass('dqpl-listbox-show');
            $combobox.attr('aria-expanded', 'false');
            $combobox.on('blur', onComboBlur);
          });
      });


    function onComboClick() {
      $listbox.toggleClass('dqpl-listbox-show');
      var hasShowClass = $listbox.hasClass('dqpl-listbox-show');
      $combobox.attr('aria-expanded', hasShowClass);

      if (hasShowClass) {
        openSetup($combobox, $listbox);
      }
    }

    function onComboBlur() {
      var wasVisible = $listbox.is(':visible');
      $listbox.removeClass('dqpl-listbox-show');
      $combobox.attr('aria-expanded', 'false');
      var cached = $listbox.attr('data-cached-selected');
      if (cached && wasVisible) {
        $combobox.attr('aria-activedescendant', cached);
      }
    }

    function onComboKeydown(e) {
      var which = e.which;

      if (which === 38 || which === 40) { // UP or DOWN
        e.preventDefault();

        if ($listbox.is(':visible')) {
          arrowHandler(which, $combobox, $listbox);
        } else { // open it and ensure aria-activedescendant is set
          openSetup($combobox, $listbox);
        }
      } else if (which === 13 || which === 32) { // ENTER or SPACE
        e.preventDefault();
        if ($listbox.is(':visible')) {
          selectOption($combobox, $listbox);
        } else if (which === 32) {
          openSetup($combobox, $listbox);
        }
      } else if (which === 27) { // ESCAPE
        if ($listbox.is(':visible')) {
          // restore previously selected
          var cachedSelected = $listbox.attr('data-cached-selected');
          $combobox.attr('aria-activedescendant', cachedSelected);
          // close the listbox
          $listbox.removeClass('dqpl-listbox-show');
          $combobox.attr('aria-expanded', 'false');
        }
      } else if (isLetterOrNum(which)) {
        openSetup($combobox, $listbox);
        keySearch(which, $combobox, $listbox);
      }
    }
  }

  function arrowHandler(key, $combobox, $listbox) {
    var isNext = key === 40;
    var $selectedOption = jQuery('#' + $combobox.attr('aria-activedescendant'));

    if (!$selectedOption.length) { return; }

    var $options = $listbox.find('[role="option"]').filter(nonDisabled);
    var index = jQuery.inArray($selectedOption[0], $options);
    var adjacentIndex = isNext ? index + 1 : index - 1;

    if (adjacentIndex !== -1 && adjacentIndex !== $options.length) { // No circularity (like native <select />)
      var $adjacentOption = $options.eq(adjacentIndex);
      $combobox.attr('aria-activedescendant', $adjacentOption.prop('id'));
      activateOption($combobox, $listbox);
    }
  }

  function activateOption($combobox, $listbox, noScroll) {
    $listbox
      .find('[role="option"].dqpl-option-active')
        .removeClass('dqpl-option-active');

    var optionID = $combobox.attr('aria-activedescendant');
    var $active = jQuery('#' + optionID).addClass('dqpl-option-active');

    if ($active.length && !noScroll && !isInView($listbox, $active)) {
      // scroll the option into view by scrolling the listbox
      var topPos = $active[0].offsetTop;
      $listbox[0].scrollTop = topPos;
    }
  }

  function selectOption($combobox, $listbox, noHide) {
    $listbox.find('[aria-selected="true"]').removeAttr('aria-selected');
    var $active = $listbox.find('.dqpl-option-active');
    $active.attr('aria-selected', 'true');
    if (!noHide) {
      $listbox.removeClass('dqpl-listbox-show');
      $combobox.attr('aria-expanded', 'false');
    }
    $combobox.find('.dqpl-pseudo-value').text($active.text());
  }

  function openSetup($combobox, $listbox) {
    if (!$combobox.attr('aria-activedescendant')) {
      // if theres no selection (initially), then default to the first one
      var $firstNonDisabled = $listbox.find('[role="option"]').filter(nonDisabled).first();
      $combobox.attr('aria-activedescendant', $firstNonDisabled.prop('id'));
    }

    $listbox.addClass('dqpl-listbox-show'); // open the listbox
    $combobox.attr('aria-expanded', 'true');
    $listbox.attr('data-cached-selected', $combobox.attr('aria-activedescendant'));
    activateOption($combobox, $listbox);
  }

  function nonDisabled(_, el) {
    return jQuery(el).attr('aria-disabled') !== 'true';
  }

  /**
   * Functionality for typing letters to jump to matching options
   */
  var keys = [];
  var timer;
  function keySearch(which, $combobox, $listbox) {
    clearTimeout(timer);

    var key = String.fromCharCode(which);
    if (!key || !key.trim().length) { return; }

    var $options = $listbox.find('[role="option"]').filter(nonDisabled);
    key = key.toLowerCase();
    keys.push(key);
    // find the FIRST option that most closely matches our keys
    // if that first one is already selected, go to NEXT option
    var stringMatch = keys.join('');
    // attempt an exact match
    var $deepMatches = $options.filter(function () {
      return jQuery(this).text().toLowerCase().indexOf(stringMatch) === 0;
    });

    if ($deepMatches.length) {
      searchSelect($deepMatches, $combobox, $listbox);
    } else {
      // just go by first letter
      var firstChar = stringMatch[0];
      var $shallowMatches = $options.filter(function () {
        return jQuery(this).text().toLowerCase().indexOf(firstChar) === 0;
      });
      searchSelect($shallowMatches, $combobox, $listbox);
    }

    timer = setTimeout(function () {
      keys = [];
    }, TYPE_TIME);
  }

  function searchSelect($matches, $combobox, $listbox) {
    if (!$matches.length) { return; }
    var $current = $listbox.find('.dqpl-option-active').first();
    var currentIndex = jQuery.inArray($current[0], $matches);
    var nextIndex = currentIndex + 1;
    var $toBeSelected = $matches.eq(nextIndex);
    // circularity
    if (!$toBeSelected.length) { $toBeSelected = $matches.first(); }
    if ($toBeSelected[0] === $current[0]) { return; }
    $combobox.attr('aria-activedescendant', $toBeSelected.prop('id'));
    activateOption($combobox, $listbox);
  }

  /**
   * Warn if proper roles aren't there...
   */
  function checkForMissingAttrs($combobox, $listbox) {
    if ($combobox.attr('role') !== 'combobox') {
      console.warn('Combobox missing role="combobox" attribute', $combobox);
    }

    if ($listbox.attr('role') !== 'listbox') {
      console.warn('Listbox missing role="listbox" attribute', $listbox);
    }
  }

  function isLetterOrNum(key) {
    var isLetter = key >= 65 && key <= 90;
    var isNumber = key >= 48 && key <= 57;
    return isLetter || isNumber;
  }


  function isInView($container, $el) {
    var contHeight = $container.height();
    var contTop = $container.scrollTop();
    var contBottom = contTop + contHeight;

    var elTop = $el.offset().top - $container.offset().top;
    var elemBottom = elTop + $el.height();

    return (elTop >= 0 && elemBottom <= contHeight);
  }
}());
