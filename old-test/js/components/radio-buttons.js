'use strict';

describe('radio buttons', function () {
  var markup = [
    '<div class="dqpl-radio-group">',
      '<div class="dqpl-radio-wrap dqpl-flexr">',
        '<div class="dqpl-radio" role="radio" aria-labelledby="foo"></div>',
        '<div class="dqpl-label" id="foo">Foo</div>',
      '</div>',
      '<div class="dqpl-radio-wrap dqpl-flexr">',
        '<div class="dqpl-radio" role="radio" aria-checked="true" data-label-id="bar"></div>',
        '<div class="dqpl-label" id="bar">Bar</div>',
      '</div>',
      '<div class="dqpl-radio-wrap dqpl-flexr">',
        '<div class="dqpl-radio" role="radio" data-label-id="baz" aria-disabled="true"></div>',
        '<div class="dqpl-label" id="baz">Baz (disabled)</div>',
      '</div>',
      '<div class="dqpl-radio-wrap dqpl-flexr">',
        '<div class="dqpl-radio" role="radio" data-label-id="qax"></div>',
        '<div class="dqpl-label" id="qax">Qax</div>',
      '</div>',
    '</div>'
  ].join('');
  var $radios;
  var jQuery = window.jQuery;
  var $fixture = jQuery('#fixture');

  beforeEach(function () {
    $fixture.empty().append(jQuery(markup));
    jQuery(document).trigger('dqpl:ready');
    $radios = $fixture.find('.dqpl-radio');
  });

  afterEach(function () {
    $fixture.empty();
  });

  describe('attributes', function () {
    it('should add tabindex=0 to the initially "selected" radio and tabindex=-1 to the rest', function () {
      $radios.each(function (i, radio) {
        assert.equal(radio.tabIndex, i === 1 ? 0 : -1);
      });
    });

    it('should add aria-checked properly', function () {
      $radios.each(function (i, radio) {
        assert.equal(radio.getAttribute('aria-checked'), i === 1 ? 'true' : 'false');
      });
    });

    it('should set aria-setsize and aria-posinset properly', function () {
      $radios.each(function (i) {
        var $radio = jQuery(this);
        assert.equal($radio.attr('aria-setsize'), $radios.length);
        assert.equal($radio.attr('aria-posinset'), i + 1);
      });
    });
  });

  describe('initially selected', function () {
    it('should default to the first one (with no aria-checked)', function () {
      $radios.removeAttr('aria-checked');
      jQuery(document).trigger('dqpl:ready');
      $radios.each(function (i) {
        assert.equal(jQuery(this).attr('aria-checked'), i === 0 ? 'true' : 'false');
      });
    });

    it('should set the radio with aria-checked="true" as the initially selected', function () {
      // the 2nd radio has aria-checked (see above "markup")
      $radios.each(function (i) {
        assert.equal(jQuery(this).attr('aria-checked'), i === 1 ? 'true' : 'false');
      });
    });
  });


  describe('inner-radio element', function () {
    it('should create the element only once (regardless of how many times dqpl:ready is called)', function () {
      jQuery(document).trigger('dqpl:ready').trigger('dqpl:ready');
      $radios.each(function () {
        var $inner = jQuery(this).find('.dqpl-inner-radio');
        assert.equal($inner.length, 1);
      });
    });

    it('should add the right classes', function () {
      var selectedIndex = 1;
      var disabledIndex = 2;
      $radios.each(function (i) {
        var $radio = jQuery(this);
        var $inner = $radio.find('.dqpl-inner-radio');

        assert.isTrue($inner.hasClass(
          i === selectedIndex ?
            'fa fa-dot-circle-o' :
            i === disabledIndex ?
            'fa fa-circle' :
            'fa fa-circle-o'
        ));
      });
    });
  });

  describe('label (clicking label -> focus radio)', function () {
    it('should handle data-label-id', function () {
      var $radio = $radios.eq(2);
      $fixture.find('.dqpl-label').eq(2).trigger('click');
      assert.equal($radio[0], document.activeElement);
    });

    it('should handle a dqpl-label element within a dqpl-radio-wrap container', function () {
      var $radio = $radios.eq(0);
      $fixture.find('.dqpl-label').eq(0).trigger('click');
      assert.equal($radio[0], document.activeElement);
    });
  });

  describe('keydowns', function () {
    describe('arrows', function () {
      describe('LEFT ARROW/UP ARROW', function () {
        it('should focus/activate the previous radio', function () {
          $radios.eq(1).trigger(createEvent('keydown', 37));
          assert.equal(document.activeElement, $radios[0]);
          $radios.each(function (i, radio) {
            var $rad = jQuery(radio);
            assert.equal($rad.prop('tabIndex'), i === 0 ? 0 : -1);
            assert.equal($rad.attr('aria-checked'), i === 0 ? 'true' : 'false');
          });
        });

        it('should be circular (first to last)', function () {
          // activate the "last" radio
          $radios
            .eq(0)
            .trigger('click')
            .focus()
            // fire a left arrow
            .trigger(createEvent('keydown', 37));

          assert.equal(document.activeElement, $radios[3]);

          $radios.each(function (i, radio) {
            var $rad = jQuery(radio);
            assert.equal($rad.prop('tabIndex'), i === 3 ? 0 : -1);
            assert.equal($rad.attr('aria-checked'), i === 3 ? 'true' : 'false');
          });
        });
      });

      describe('RIGHT ARROW/DOWN ARROW', function () {
        it('should focus/activate the next non-disabled radio', function () {
          $radios.eq(1).trigger(createEvent('keydown', 39));
          // the radio at index 2 is disabled...
          assert.equal(document.activeElement, $radios[3]);
          $radios.each(function (i, radio) {
            var $rad = jQuery(radio);
            assert.equal($rad.prop('tabIndex'), i === 3 ? 0 : -1);
            assert.equal($rad.attr('aria-checked'), i === 3 ? 'true' : 'false');
          });
        });

        it('should be circular (last to first)', function () {
          // activate the last
          $radios.eq(3).trigger('click').trigger(createEvent('keydown', 39));
          assert.equal(document.activeElement, $radios[0]);
          $radios.each(function (i, radio) {
            var $rad = jQuery(radio);
            assert.equal($rad.prop('tabIndex'), i === 0 ? 0 : -1);
            assert.equal($rad.attr('aria-checked'), i === 0 ? 'true' : 'false');
          });
        });
      });
    });

    describe('SPACE BAR', function () {
      it('should click the radio', function () {
        var clicked = false;
        $radios
          .eq(0)
          .one('click', function () {
            clicked = true;
          })
          .trigger(createEvent('keydown', 32));

          assert.isTrue(clicked);
      });
    });
  });

  describe('click', function () {
    it('should activate/focus the clicked radio', function () {
      $radios.eq(0).click();
      assert.equal(document.activeElement, $radios[0]);
      $radios.each(function (i, radio) {
        var $rad = jQuery(radio);
        assert.equal($rad.prop('tabIndex'), i === 0 ? 0 : -1);
        assert.equal($rad.attr('aria-checked'), i === 0 ? 'true' : 'false');
      });
    });

    it('should activate/focus the radio of the clicked label', function () {
      $fixture.find('.dqpl-label').first().trigger('click');
      assert.equal(document.activeElement, $radios[0]);
      $radios.each(function (i, radio) {
        var $rad = jQuery(radio);
        assert.equal($rad.prop('tabIndex'), i === 0 ? 0 : -1);
        assert.equal($rad.attr('aria-checked'), i === 0 ? 'true' : 'false');
      });
    });
  });
});
