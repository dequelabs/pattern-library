'use strict';

describe('noClobber', function () {
  var jQuery = window.jQuery;
  var $fixture = jQuery('#fixture');
  var $helper = jQuery('<div>I am help</div>');
  var $label = jQuery('<div id="label">I am a label</div>');
  var $input = jQuery('<input type="text" aria-labelledby="foo" />');

  beforeEach(function () {
    $fixture
      .append($helper)
      .append($label)
      .append($input);
  });

  afterEach(function () {
    $fixture.empty();
  });

  it('should be chainable', function () {
    $input.noClobber(jQuery('body'), 'aria-monkeys').addClass('monkeys');
    assert($input.hasClass('monkeys'));
  });

  it('should default to aria-describedby for the attribute', function () {
    $input.noClobber($helper);
    assert.equal($helper.prop('id'), $input.attr('aria-describedby'));
  });

  it('should give the reference element an id if it doesnt have one', function () {
    $input.noClobber($helper);
    assert.isTrue(!!$helper.prop('id').length);
  });

  it('should add the id of the ref element to the attribute value', function () {
    $input.noClobber($label, 'aria-controls');
    assert.equal($input.attr('aria-controls'), 'label');
  });

  it('should append the id to the end of the token lists (existing value)', function () {
    $input.noClobber($label, 'aria-labelledby');
    assert.equal('foo label', $input.attr('aria-labelledby'));
  });
});
