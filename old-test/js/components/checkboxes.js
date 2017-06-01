'use strict';

describe('checkboxes', function () {
  var markup = [
    '<div class="dqpl-checkbox-wrap dqpl-flexr">',
      '<div class="dqpl-checkbox" role="checkbox" tabindex="0" aria-labelledby="foo"></div>',
      '<div class="dqpl-label" id="foo">Foo</div>',
    '</div>',
    '<div class="dqpl-checkbox-wrap dqpl-flexr">',
      '<div class="dqpl-checkbox" role="checkbox" tabindex="0" aria-checked="true" data-label-id="bar"></div>',
      '<div class="dqpl-label" id="bar">Bar</div>',
    '</div>',
    '<div class="dqpl-checkbox-wrap dqpl-flexr">',
      '<div class="dqpl-checkbox" role="checkbox" tabindex="0" data-label-id="baz" aria-disabled="true"></div>',
      '<div class="dqpl-label" id="baz">Baz (disabled)</div>',
    '</div>'
  ].join('');
  var $checkboxes;
  var jQuery = window.jQuery;
  var $fixture = jQuery('#fixture');

  beforeEach(function () {
    $fixture.empty().append(jQuery(markup));
    jQuery(document).trigger('dqpl:ready');
    $checkboxes = $fixture.find('.dqpl-checkbox');
  });

  afterEach(function () {
    $fixture.empty();
  });

  describe('attributes/roles', function () {
    it('should add tabindex="0" to each checkbox', function () {
      var $nonZeros = $checkboxes.filter(function () {
        return jQuery(this).prop('tabIndex') === 0;
      });

      assert.equal($nonZeros.length, $checkboxes.length);
    });

    it('should add the unchecked icon class (given a default unchecked checkbox)', function () {
      var $defaultUnchecked = $fixture.find('[aria-labelledby="foo"]');
      assert.isTrue($defaultUnchecked.find('.dqpl-inner-checkbox').hasClass('fa-square-o'));
    });

    it('should add the checked icon class (given a [aria-checked="true"] checkbox)', function () {
      var $defaultChecked = $fixture.find('[data-label-id="bar"]');
      assert.isTrue($defaultChecked.find('.dqpl-inner-checkbox').hasClass('fa-check-square'));
    });

    it('should add the disabled icon class (given a [aria-disabled="true"] checkbox)', function () {
      var $defaultDisabled = $fixture.find('[data-label-id="baz"]');
      assert.isTrue($defaultDisabled.find('.dqpl-inner-checkbox').hasClass('fa-square'));
    });

    it('should set aria-checked properly', function () {
      $checkboxes.each(function (i, box) {
        var $checkbox = jQuery(box);
        assert.equal($checkbox.attr('aria-checked'), i == 1 ? 'true' : 'false');
      });
    });
  });

  describe('events', function () {
    it('should click with SPACEBAR', function () {
      var clicked = false;
      $checkboxes
        .first()
        .one('click', function () {
          clicked = true;
        })
        .trigger(createEvent('keydown', 32));

      assert.isTrue(clicked);
    });

    it('should toggle aria-checked on click', function () {
      var $first = $checkboxes.first();
      assert.equal($first.attr('aria-checked'), 'false');
      $first.trigger('click');
      assert.equal($first.attr('aria-checked'), 'true');
    });

    it('should NOT toggle aria-checked on a disabled input', function () {
      var $disabled = $checkboxes.eq(2);
      assert.equal($disabled.attr('aria-checked'), 'false');
      $disabled.trigger('click');
      assert.equal($disabled.attr('aria-checked'), 'false');
    });

    it('should toggle the checked/unchecked class on an enabled input', function () {
      var $first = $checkboxes.first().find('.dqpl-inner-checkbox');
      assert.isTrue($first.hasClass('fa-square-o'));
      $first.trigger('click');
      assert.isTrue($first.hasClass('fa-check-square'));
      assert.isFalse($first.hasClass('fa-square-o'));
    });

    it('should handle the dqpl:checkbox:enable event properly', function () {
      var $defaultDisabled = $checkboxes.eq(2);
      var DISABLED_CLASS = 'fa-square';
      assert.isTrue($defaultDisabled.find('.dqpl-inner-checkbox').hasClass(DISABLED_CLASS));
      $defaultDisabled.trigger('dqpl:checkbox:enable');
      assert.isFalse($defaultDisabled.find('.dqpl-inner-checkbox').hasClass(DISABLED_CLASS));
    });

    it('should handle the dqpl:checkbox:disable event properly', function () {
      var $defaultEnabled = $checkboxes.first();
      var $inner = $defaultEnabled.find('.dqpl-inner-checkbox');
      var DISABLED_CLASS = 'fa-square';
      assert.isFalse($inner.hasClass(DISABLED_CLASS));
      $defaultEnabled.trigger('dqpl:checkbox:disable');
      assert.isTrue($inner.hasClass(DISABLED_CLASS));
    });

    it('should properly find the label and attach click functionality', function () {
      var clicked = false;
      var $label = $checkboxes.first().next('.dqpl-label');
      $checkboxes.first().one('click', function () {
        clicked = true;
      });
      $label.trigger('click');
      assert.isTrue(clicked);
      assert.equal(document.activeElement, $checkboxes.first()[0]);
    });
  });
});
