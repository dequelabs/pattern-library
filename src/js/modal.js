(function () {
  'use strict';

  var $body = jQuery(document.body);

  jQuery(document)
    .on('click', '[data-modal]', function () {
      var $trigger = jQuery(this);
      var modalId = $trigger.attr('data-modal');
      var $modal = jQuery('#' + modalId);

      if (!$modal.length) {
        console.warn('No modal found with id: ' + modalId);
      } else {
        openModal($trigger, $modal);
      }
    })
    .on('click', '.dqpl-modal-close, .dqpl-modal-cancel', function () {
      var $button = jQuery(this);
      var $modal = $button.closest('.dqpl-modal');
      closeModal($modal);
    })
    .on('keydown', '.dqpl-modal', function (e) {
      var $modal = jQuery(this);
      var target = e.target;
      var $target = jQuery(target);
      var which = e.which;

      switch (which) {
        case 27:
          closeModal($modal);
          break;
        case 9:
          var $focusables = $modal.focusable(false, true);
          var $first = $focusables.first();
          var $last = $focusables.last();
          if (e.shiftKey && $first.is(target)) {
            e.preventDefault();
            $last.focus();
          } else if (!e.shiftKey && $last.is(target)) {
            e.preventDefault();
            $first.focus();
          }
          break;
      }
    })
    .on('keydown', '.dqpl-modal-header h2', function (e) {
      if (e.which === 9 && e.shiftKey) {
        e.preventDefault();
        var $modal = jQuery(this).closest('.dqpl-modal');
        var $focusables = $modal.focusable(false, true);
        $focusables.last().focus();
      }
    });


  function openModal($trigger, $modal) {
    var $heading = $modal.find('.dqpl-modal-header h2');
    // display it
    $modal.addClass('dqpl-modal-show');
    $body.addClass('dqpl-modal-open');
    var $scrim = $modal.find('.dqpl-modal-screen');

    if (!$scrim.length) {
      $scrim = jQuery('<div class="dqpl-modal-screen" />');
      $modal.append($scrim);
    }

    $scrim.show();

    $heading.prop('tabIndex', -1).focus();

    // aria-hidden to everything but the modal...
    ariaHide($modal);

    // trigger open event
    $modal.trigger('dqpl:modal-open');

    sizeHandler($modal);
    jQuery(window).on('resize.dqplModal', function () {
      sizeHandler($modal);
    });
  }

  function closeModal($modal) {
    var id = $modal.prop('id');
    var $trigger = jQuery('[data-modal="' + id + '"]');

    $modal.removeClass('dqpl-modal-show');
    $body.removeClass('dqpl-modal-open');
    ariaShow();
    $trigger.focus();

    // trigger close event
    $modal.trigger('dqpl:modal-close');

    jQuery(window).off('resize.dqplModal');
  }

  function sizeHandler($modal) {
    $modal
      .find('.dqpl-modal-content')
        .css('max-height', jQuery(window).height() - 185);
  }

  /**
   * Apply aria-hidden="true" to everything but modal (and parents of modal),
   * remove aria-hidden when modal is closed (unless the element already had
   * aria-hidden="true" applied to it)
   */

  function ariaHide($modal) {
    var modal = $modal[0];
    if (!modal) { return; }

    var parent = modal.parentNode;
    while (parent && parent.nodeName !== 'HTML') {
      var $children = jQuery(parent).children();
      $children.each(childHandler);
      parent = parent.parentNode;
    }

    function childHandler(_, child) {
      var $thisChild = jQuery(child);

      if (!$thisChild.is(modal) && !jQuery.contains(child, modal)) {
        alreadyHidden($thisChild);
        $thisChild.attr('aria-hidden', 'true');
      }
    }
  }

  function ariaShow() {
    jQuery('[aria-hidden="true"]').each(function (_, el) {
      var $el = jQuery(el);
      if ($el.attr('data-already-aria-hidden') !== 'true') {
        $el.removeAttr('aria-hidden');
      }
    });
  }

  function alreadyHidden($el) {
    if ($el.attr('aria-hidden') === 'true') {
      $el.attr('data-already-aria-hidden', 'true');
    }
  }
}());
