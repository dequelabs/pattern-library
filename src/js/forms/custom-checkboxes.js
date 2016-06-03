(function() {
  'use strict';

  var $checkboxGroups = jQuery('.dqpl-checkbox-group');
  $checkboxGroups.each(checkboxGroupHandler);

  function checkboxGroupHandler(_, group) {
    var $group = jQuery(group);
    var $checkboxes = $group.find('.dqpl-custom-checkbox');

    $checkboxes
      .each(function (_, box) {
        var $checkbox = jQuery(box);
        var isSelected = $checkbox.hasClass('dqpl-selected');

        // add the inner element (that holds the icon)
        var iconClass = isSelected ? 'fa-check-square' : 'fa-square-o';
        $checkbox.append(jQuery('<div class="dqpl-inner-checkbox fa ' + iconClass + '" aria-hidden="true" />'));

        $checkbox
          .prop('tabIndex', 0)
          .attr('aria-checked', isSelected);

        // clicks on the label
        $checkbox
          .closest('.dqpl-field-wrap')
          .find('.dqpl-label')
            .on('click', function () {
              $checkbox.trigger('click').focus();
            });
      })
      .on('keydown', function (e) {
        var $box = jQuery(this);
        if (e.which === 32) {
          e.target.click();
        }
      })
      .on('click', function () {
        toggleSelected(jQuery(this));
      });
  }

  function toggleSelected($checkbox) {
    var wasSelected = $checkbox.attr('aria-checked') === 'true';

    $checkbox
      .attr('aria-checked', !wasSelected)
      .find('.dqpl-inner-checkbox')
        .removeClass('fa-check-square fa-square-o')
        .addClass(wasSelected ? 'fa-square-o' : 'fa-check-square');
  }
}());
