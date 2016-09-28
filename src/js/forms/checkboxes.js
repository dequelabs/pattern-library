(function() {
  'use strict';

  checkboxHandler();

  jQuery(document).on('dqpl:ready', checkboxHandler);

  /**
   * Converts [class="dqpl-checkbox"] elements into custom checkboxes.
   *
   * - If default checked state is desired, add the "dqpl-selected" class
   * or simply add aria-checked="true".
   *
   * - To enable or disable a custom checkbox, trigger the "dqpl:checkbox:enable"
   * or "dqpl:checkbox:disable" event on the checkbox element (using jQuery#trigger)
   *
   * - It retrieves the label based on "data-label-id" attribute OR simply a
   * label (with "dqpl-label" or "dqpl-label-inline" class) within the checkbox's
   * wrapper (with "dqpl-field-wrap" or "dqpl-checkbox-wrap" class)
   */
  function checkboxHandler() {
    var $checkboxes = jQuery('.dqpl-checkbox');

    $checkboxes
      .each(function (_, box) {
        var $checkbox = jQuery(box);
        var isSel = isSelected($checkbox);
        var isDis = isDisabled($checkbox);

        if ($checkbox.attr('role') !== 'checkbox') {
          console.warn('role="checkbox" missing from the following element: ', box);
        }

        // add the inner element (that holds the icon)
        var iconClass = isSel ? 'fa-check-square' : 'fa-square-o';
        iconClass = isDis ? 'fa-square' : iconClass;
        $checkbox.append(jQuery('<div class="dqpl-inner-checkbox fa ' + iconClass + '" aria-hidden="true" />'));

        $checkbox
          .prop('tabIndex', 0)
          .attr('aria-checked', isSel);

        /**
         * Label
         * - found via data-label-id OR within container (dqpl-field-wrap or dqpl-checkbox-wrap)
         * - clicks on label will focus/click the checkbox
         */
        var $label = getLabelElement($checkbox);
        if (isDis) { $label.addClass('dqpl-label-disabled'); }
        $label
          .off('click.dqplCheckbox')
          .on('click.dqplCheckbox', function () {
            $checkbox.trigger('click').focus();
          });

        /**
         * Expose event for disabling/enabling checkboxes
         * example:
         * 	$myjQueryCheckboxRef.trigger('dqpl:checkbox:disable')
         * 	$myjQueryCheckboxRef.trigger('dqpl:checkbox:enable')
         */
        $checkbox
          .off('dqpl:checkbox:disable')
          .on('dqpl:checkbox:disable', function () {
            $checkbox.attr('aria-disabled', 'true');
            $checkbox
              .find('.dqpl-inner-checkbox')
                .removeClass('fa-check-square')
                .removeClass('fa-square-o')
                .addClass(isSelected($checkbox) ? 'fa-check-square' : 'fa-square');

            $label.addClass('dqpl-label-disabled');
          })
          .off('dqpl:checkbox:enable')
          .on('dqpl:checkbox:enable', function () {
            $checkbox.removeAttr('aria-disabled');
            $checkbox
              .find('.dqpl-inner-checkbox')
                .removeClass('fa-check-square')
                .removeClass('fa-square-o')
                .removeClass('fa-square')
                .addClass(isSelected($checkbox) ? 'fa-check-square' : 'fa-square-o');

            $label.removeClass('dqpl-label-disabled');
          });
      })
      .off('keydown.dqplCheckbox')
      .on('keydown.dqplCheckbox', function (e) {
        var $box = jQuery(this);
        if (e.which === 32) {
          e.preventDefault();
          e.target.click();
        }
      })
      .off('click.dqplCheckbox')
      .on('click.dqplCheckbox', function () {
        toggleSelected(jQuery(this));
      });
  }

  function toggleSelected($checkbox) {
    if (isDisabled($checkbox)) { return; }
    var wasSelected = $checkbox.attr('aria-checked') === 'true';

    $checkbox
      .attr('aria-checked', !wasSelected)
      .find('.dqpl-inner-checkbox')
        .removeClass('fa-check-square fa-square-o')
        .addClass(wasSelected ? 'fa-square-o' : 'fa-check-square');
  }

  function isDisabled($checkbox) {
    return $checkbox.is('[disabled], [aria-disabled="true"]');
  }

  function isSelected($checkbox) {
    return $checkbox.hasClass('dqpl-selected') || $checkbox.attr('aria-checked') === 'true';
  }

  function getLabelElement($checkbox) {
    var dataLabelId = $checkbox.attr('data-label-id');
    if (dataLabelId) {
      return jQuery(['#', dataLabelId].join(''));
    } else {
      return $checkbox
        .closest('.dqpl-field-wrap, .dqpl-checkbox-wrap')
          .first()
            .find('.dqpl-label, .dqpl-label-inline');
    }
  }
}());
