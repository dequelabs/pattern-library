(function() {
  'use strict';

  helpHandler();

  jQuery(document).on('dqpl:ready', helpHandler);

  function helpHandler() {
    jQuery('.dqpl-help-button, .dqpl-button-definition').each(helpInit);
  }

  function helpInit(_, helpBtn) {
    var $btn = jQuery(helpBtn);
    var tipText = $btn.attr('data-help-text');

    // generate tooltip
    var $tip = tooltip(tipText);

    // insert it into the DOM
    var $wrap = $btn.closest('.dqpl-help-button-wrap, .dqpl-definition-button-wrap');

    if (!$wrap.length) {
      var wrapper = $btn.is('.dqpl-help-button') ? '.dqpl-help-button-wrap' : '.dqpl-definition-button-wrap';
      console.warn('Unable to generate tooltip without a `' + wrapper + '` wrapper for: ', $btn);
      return;
    }

    $wrap.append($tip);

    // associate trigger with tip
    $btn.noClobber($tip);

    // events
    $btn
      .off('focus.dqpl')
      .off('mouseover.dqpl')
      .off('blur.dqpl')
      .off('mouseout.dqpl')
      .on('focus.dqpl mouseover.dqpl', function () {
        $tip.addClass('dqpl-tip-active');
      })
      .on('blur.dqpl mouseout.dqpl', function () {
        $tip.removeClass('dqpl-tip-active');
      });
  }

  function tooltip(txt) {
    var $tip = jQuery('<div />');
    $tip
      .attr('role', 'tooltip')
      .text(txt)
      .addClass('dqpl-tooltip');

    return $tip;
  }
}());
