(function() {
  'use strict';

  initRadios();

  jQuery(document).on('dqpl:ready', initRadios);


  /**
   * NOTE: data-label-id should only be used if the element is already proplery labelled
   * (with aria-label, offscreen text, or aria-labelledby)
   */
  function initRadios() {
    // custom radios must be a child of a `dqpl-radio-group` element.
    var $radioGroups = jQuery('.dqpl-radio-group');

    $radioGroups.each(radioGroupHandler);

    function radioGroupHandler(i, group) {
      var $radioGroup = jQuery(group);
      var $radios = $radioGroup.find('.dqpl-radio');
      var $selectedRadio = $radios
        .filter('.dqpl-selected, [aria-checked="true"]')
        .filter(':not([aria-disabled="true"])');
      var $firstNonDisabled = $radios.filter(function () {
        return jQuery(this).attr('aria-disabled') !== 'true';
      }).first();
      var selectedIndex = ($selectedRadio.length) ?
        jQuery.inArray($selectedRadio[0], $radios) :
        jQuery.inArray($firstNonDisabled[0], $radios); // the first non-disabled

      // attributes/props
      $radios.each(function (i, radio) {
        var $radio = jQuery(radio);
        var isSelected = i === selectedIndex;
        $radio.prop('tabIndex', isSelected ? 0 : -1);
        $radio.attr({
          'aria-checked': isSelected ? true : false,
          'aria-setsize': $radios.length,
          'aria-posinset': i + 1
        });

        if ($radio.attr('role') !== 'radio') {
          console.warn('role="radio" missing from the following element: ', radio);
        }

        // add the inner circle (fa)
        var $inner = $radio.find('.dqpl-inner-radio');
        if (!$inner.length) {
          $inner = jQuery('<span aria-hidden="true" />');
          $radio.append($inner);
        }
        var iconClass = isSelected ? 'fa fa-dot-circle-o' : 'fa fa-circle-o';
        iconClass = isDisabled($radio) ? 'fa fa-circle' : iconClass;
        $inner
          .removeClass('fa-dot-circle-o fa-circle-o fa-circle')
          .addClass(iconClass)
          .addClass('dqpl-inner-radio');


        // label clicks
        var $label = getLabelElement($radio);
        if (!$label.length) {
          var how = '(via "data-label-id" attribute or .dqpl-label element within .dqpl-radio-wrap or .dqpl-field-wrap)';
          console.warn('Unable to calculate label ' + how + ' for: ', radio);
        }
        $label
          .off('click.dqplRadio')
          .on('click.dqplRadio', function () {
            $radio.trigger('click').focus();
          });

        $radio
          .off('dqpl:radio:disable')
          .on('dqpl:radio:disable', function () {
            $radio.attr('aria-disabled', 'true');
            $inner
              .removeClass('fa-dot-circle-o')
              .removeClass('fa-circle-o')
              .addClass(
                $radio.attr('aria-checked') === 'true' ? 'fa-dot-circle-o' : 'fa-circle'
              );

            $label.addClass('dqpl-label-disabled');
          })
          .off('dqpl:radio:enable')
          .on('dqpl:radio:enable', function () {
            $radio.removeAttr('aria-disabled');
            $inner
              .removeClass('fa-circle')
              .removeClass('fa-dot-circle-o')
              .removeClass('fa-circle-o')
              .addClass(
                $radio.attr('aria-checked') === 'true' ? 'fa fa-dot-circle-o' : 'fa fa-circle-o'
              );

              $label.removeClass('dqpl-label-disabled');
          });
      });

      // events
      $radioGroup
        .off('click.dqplRadioGroup')
        .on('click.dqplRadioGroup', '[role="radio"]', function () {
          var $radio = jQuery(this);
          if ($radio.attr('aria-disabled') === 'true') { return; }
          selectHandler($radios, $radio.focus());
        })
        .off('keydown.dqplRadio')
        .on('keydown.dqplRadio', '[role="radio"]', function (e) {
          var which = e.which;
          var $target = jQuery(e.target);

          if (isDisabled($target)) { return; }

          switch (which) {
            case 32:
              e.preventDefault();
              $target.click();
              break;
            case 37:
            case 38:
              e.preventDefault();
              arrowHandler($target, $radios, 'prev');
              break;
            case 39:
            case 40:
              e.preventDefault();
              arrowHandler($target, $radios, 'next');
              break;
          }
        });
    }
  }

  function selectHandler($radios, $newlySelected) {
    $radios
      .each(function (_, radio) {
        var $radio = jQuery(radio);
        var isNewlySelected = radio === $newlySelected[0];
        $radio
          .prop('tabIndex', isNewlySelected ? 0 : -1)
          .attr('aria-checked', isNewlySelected)
          .toggleClass('dqpl-selected')
          .find('.dqpl-inner-radio')
            .removeClass('fa-dot-circle-o')
            .addClass('fa-circle-o');
      });
    $newlySelected.find('.dqpl-inner-radio').addClass('fa-dot-circle-o');
  }


  function arrowHandler($target, $radios, direction) {
    if ($radios.filter(nonDisabled).length <= 1) { return; }

    var isNext = direction === 'next';
    var currentIndex = jQuery.inArray($target[0], $radios);
    var adjacentIndex = getAdjacentIndex(isNext, currentIndex, $radios);
    var $adjacentRadio = $radios.eq(adjacentIndex);

    while ($adjacentRadio.length && $adjacentRadio.attr('aria-disabled') === 'true') {
      adjacentIndex = getAdjacentIndex(isNext, adjacentIndex, $radios);
      $adjacentRadio = $radios.eq(adjacentIndex);
    }

    selectHandler($radios, $adjacentRadio.focus());
  }

  function getAdjacentIndex(isNext, currentIndex, $radios) {
    var adjacentIndex = isNext ? currentIndex + 1 : currentIndex - 1;
    // first or last (circularity)
    adjacentIndex = (adjacentIndex < 0 && !isNext) ? $radios.length - 1 : adjacentIndex;
    adjacentIndex = (adjacentIndex === $radios.length && isNext ) ? 0 : adjacentIndex;
    return adjacentIndex;
  }

  function getLabelElement($radio) {
    var dataLabelId = $radio.attr('data-label-id');
    if (dataLabelId) {
      return jQuery(['#', dataLabelId].join(''));
    } else {
      return $radio
        .closest('.dqpl-field-wrap, .dqpl-radio-wrap')
          .first()
            .find('.dqpl-label, .dqpl-label-inline');
    }
  }

  function isDisabled($radio) {
    return $radio.is('[disabled], [aria-disabled="true"]');
  }

  function nonDisabled(_, radio) {
    return jQuery(radio).attr('aria-disabled') !== 'true';
  }

}());
