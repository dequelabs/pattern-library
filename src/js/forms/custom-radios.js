(function() {
  'use strict';
  // custom radios must be a child of a `dqpl-radiogroup` element.
  var $radioGroups = jQuery('.dqpl-radio-group');

  $radioGroups.each(radioGroupHandler);

  function radioGroupHandler(i, group) {
    var $radioGroup = jQuery(group);
    var $radios = $radioGroup.find('.dqpl-custom-radio');
    var $selectedRadio = $radios.filter('.dqpl-selected');
    var selectedIndex = ($selectedRadio.length) ? jQuery.inArray($selectedRadio[0], $radios) : 0;

    // attributes/props
    $radios.each(function (i, radio) {
      var $radio = jQuery(radio);
      var isSelected = i === selectedIndex;
      $radio.prop('tabIndex', isSelected ? 0 : -1);
      // TODO: should we add role here, or make it a requirement in the markup (which is better)??
      $radio.attr({
        'aria-checked': isSelected ? true : false,
        'aria-setsize': $radios.length,
        'aria-posinset': i + 1
      }); // TODO: Do we want to allow all to be unchecked initially??

      // add the inner circle (fa)
      var $inner = jQuery('<span aria-hidden="true" />');
      $inner.addClass(isSelected ? 'fa fa-dot-circle-o' : 'fa fa-circle-o').addClass('dqpl-inner-radio');
      $radio.append($inner);

      $radio
        .closest('.dqpl-field-wrap')
        .find('.dqpl-label')
          .on('click', function () {
            $radio.trigger('click').focus();
          });
    });

    // events
    $radioGroup
      .on('click', '[role="radio"]', function () {
        var $radio = jQuery(this);
        selectHandler($radios, $radio);
      })
      .on('keydown', '[role="radio"]', function (e) {
        var which = e.which;
        var $target = jQuery(e.target);

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
    var isNext = direction === 'next';
    var currentIndex = jQuery.inArray($target[0], $radios);
    var adjacentIndex = isNext ? currentIndex + 1 : currentIndex - 1;
    var adjacentRadio = $radios[adjacentIndex];

    // first or last (circularity)
    if (!adjacentRadio) {
      adjacentRadio = isNext ? $radios[0] : $radios[$radios.length - 1];
    }
    selectHandler($radios, jQuery(adjacentRadio).focus());
  }

}());
