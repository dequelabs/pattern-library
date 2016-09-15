'use strict';

describe('field-help', function () {
  var $tooltip;
  var jQuery = window.jQuery;
  var $fixture = jQuery('#fixture');
  var $outer = jQuery('<div class="dqpl-field-help" />');
  var $wrapper = jQuery('<div class="dqpl-help-button-wrap" />');
  var $button1 = jQuery('<button class="dqpl-help-button" data-help-text="Monkeys and stuff">Blah</button>');
  $outer.append($wrapper);
  $wrapper.append($button1);
  var $button2 = jQuery('<button class="dqpl-help-button" />');

  before(function () {
    $fixture.empty().append($outer);
    $fixture.append($button2);
    jQuery(document).trigger('dqpl:ready');
    $tooltip = $button1.parent().find('.dqpl-tooltip');
  });

  after(function () {
    $fixture.empty();
  });

  it('should generate a tooltip per instance of ".dqpl-help-button"', function () {
    assert.equal($wrapper.find('.dqpl-tooltip').length, 1);
  });

  it('should append the tooltip to the wrapper', function () {
    assert.equal($wrapper.find('.dqpl-tooltip').length, 1);
  });

  it('should not generate a tooltip for a help button without a wrapper', function () {
    assert.equal($fixture.find('.dqpl-tooltip').length, 1);
  });

  it('should associate the button with the tooltip', function () {
    var descByVal = $button1.attr('aria-describedby');
    assert.equal($tooltip.prop('id'), descByVal);
  });

  it('should display the tooltip on focus', function () {
    assert.isFalse($tooltip.is(':visible'));
    $button1.trigger('focus');
    assert.isTrue($tooltip.is(':visible'));
    $button1.trigger('blur');
  });

  it('should hide the tooltip on blur', function () {
    $button1.trigger('focus');
    assert.isTrue($tooltip.is(':visible'));
    $button1.trigger('blur');
    assert.isFalse($tooltip.is(':visible'));
  });

  it('should display the tooltip on mouseover', function () {
    assert.isFalse($tooltip.is(':visible'));
    $button1.trigger('mouseover');
    assert.isTrue($tooltip.is(':visible'));
    $button1.trigger('mouseout');
  });

  it('should hide the tooltip on mouseout', function () {
    $button1.trigger('mouseover');
    assert.isTrue($tooltip.is(':visible'));
    $button1.trigger('mouseout');
    assert.isFalse($tooltip.is(':visible'));
  });

  it('should add role="tooltip" to the tooltip element', function () {
    assert.equal($tooltip.attr('role'), 'tooltip');
  });

  it('should set the proper text for the tooltip', function () {
    assert.equal($tooltip.text(), 'Monkeys and stuff');
  });
});
