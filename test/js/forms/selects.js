'use strct';

describe('selects', function () {
  var SELECT_MARKUP = [
    '<div class="dqpl-field-wrap">',
      '<div class="dqpl-label" id="age-label">Age group (with default value selected)</div>',
      '<div class="dqpl-select">',
        '<div class="dqpl-combobox" role="combobox" tabindex="0" aria-readonly="true" aria-autocomplete="none" aria-owns="age-list" aria-expanded="false" aria-labelledby="age-label" aria-required="true" aria-activedescendant="default">',
          '<div class="dqpl-pseudo-value">18 - 25</div>',
        '</div>',
        '<ul class="dqpl-listbox" role="listbox" id="age-list">',
          '<li class="dqpl-option" id="default" role="option">18 - 25</li>',
          '<li class="dqpl-option" role="option">26 - 39</li>',
          '<li class="dqpl-option" role="option">40 - 55</li>',
          '<li class="dqpl-option" role="option">55 - 99</li>',
        '</ul>',
      '</div>',
    '</div>',
    '<div class="dqpl-field-wrap">',
      '<div class="dqpl-label" id="pizza-label">Do you like pizza?</div>',
      '<div class="dqpl-select">',
        '<div class="dqpl-combobox" role="combobox" tabindex="0" aria-readonly="true" aria-autocomplete="none" aria-owns="pizza-list" aria-expanded="false" aria-labelledby="pizza-label"></div>',
        '<ul class="dqpl-listbox" role="listbox" id="pizza-list">',
          '<li class="dqpl-option" role="option">Yes</li>',
          '<li class="dqpl-option" role="option">No</li>',
          '<li class="dqpl-option" role="option">Never</li>',
        '</ul>',
      '</div>',
    '</div>'
  ].join('');
  var $selects;
  var jQuery = window.jQuery;
  var $fixture = jQuery('#fixture');

  before(function () {
    $fixture.empty().append(jQuery(SELECT_MARKUP));
    jQuery(document).trigger('dqpl:ready');
    $selects = $fixture.find('.dqpl-combobox');
  });

  after(function () {
    $fixture.empty();
  });


  describe('pseudo value', function () {
    it('should append a `.dqpl-pseudo-value` element to the combobox if one doesnt exist', function () {
      assert.equal($selects.eq(1).find('.dqpl-pseudo-value').length, 1);
    });

    it('should not append a `.dqpl-pseudo-value` element to the combobox if one already exists', function () {
      assert.equal($selects.eq(0).find('.dqpl-pseudo-value').length, 1);
    });

    it('should append the id of the pseudo value element to the combobox\'s aria-labelledby attribute', function () {
      $selects.each(function (_, select) {
        var $select = jQuery(select);
        var $val = $select.find('.dqpl-pseudo-value');
        assert.isTrue($select.attr('aria-labelledby').indexOf($val.prop('id')) > -1);
      });
    });
  });

  describe('given initially "selected" option', function () {
    it('should properly set aria-selected on the given option', function () {
      var $oneWithInitialVal = $selects.eq(0);
      var optionID = $oneWithInitialVal.attr('aria-activedescendant');
      assert.equal(jQuery('#' + optionID).attr('aria-selected'), 'true');
    });
  });

  describe('events', function () {
    describe('mouse clicks on combobox', function () {
      it('should toggle visibility of the listbox and aria-expanded', function () {
        var $select = $selects.eq(0);
        var $listbox = $fixture.find('.dqpl-listbox').eq(0);
        assert.equal($select.attr('aria-expanded'), 'false');
        assert.isFalse($listbox.hasClass('dqpl-listbox-show'));
        $select.trigger('click');
        assert.equal($select.attr('aria-expanded'), 'true');
        assert.isTrue($listbox.hasClass('dqpl-listbox-show'));
        // close it
        $select.trigger('click');
        assert.equal($select.attr('aria-expanded'), 'false');
        assert.isFalse($listbox.hasClass('dqpl-listbox-show'));
      });
    });

    describe('mousedowns on options', function () {
      it('should select the clicked option', function () {
        var $select = $selects.eq(0);
        var $listbox = $fixture.find('.dqpl-listbox').eq(0);
        // choose a random option...
        var $toBeClicked = $listbox.find('[role="option"]').eq(1);
        // open the listbox...
        $select.trigger('click');
        $toBeClicked.trigger('mousedown');
        assert.equal($select.attr('aria-activedescendant'), $toBeClicked.prop('id'));
        jQuery(document).trigger('mouseup');
        assert.equal(document.activeElement, $select[0]);
        assert.equal($select.attr('aria-expanded'), 'false');
        assert.isFalse($listbox.hasClass('dqpl-listbox-show'));
      });
    });

    describe('keyboard', function () {
      describe('UP or DOWN arrow', function () {
        describe('given a collapsed listbox', function () {
          it('should open the listbox', function () {
            var $select = $selects.eq(1);
            var $listbox = $fixture.find('.dqpl-listbox').eq(1);
            // fire a down arrow
            $select.trigger(createEvent('keydown', 40));
            $select.trigger(createEvent('keydown', 27));
          });
        });

        describe('given an expanded listbox', function () {
          it('should go to the next option with DOWN and the prev option with UP', function () {
            var $select = $selects.eq(1);
            var $listbox = $fixture.find('.dqpl-listbox').eq(1);
            var $opts = $listbox.find('[role="option"]');

            // open the listbox
            $select.trigger(createEvent('keydown', 40));
            assert.equal($opts.first().prop('id'), $select.attr('aria-activedescendant'));
            // fire a DOWN
            $select.trigger(createEvent('keydown', 40));
            assert.equal($opts.eq(1).prop('id'), $select.attr('aria-activedescendant'));
            // fire an UP arrow
            $select.trigger(createEvent('keydown', 38));
            assert.equal($opts.first().prop('id'), $select.attr('aria-activedescendant'));
            // close the listbox...
            $select.trigger(createEvent('keydown', 27));
          });
        });
      });

      describe('ENTER or SPACE', function () {
        describe('given a collapsed listbox', function () {
          it('should open the listbox', function () {
            var $select = $selects.eq(0);
            var $listbox = $fixture.find('.dqpl-listbox').eq(0);

            $select.trigger(createEvent('keydown', 13));
            assert.isTrue($select.is(':visible'));
            // reset / close the listbox
            $select.trigger(createEvent('keydown', 27));
          });
        });

        describe('given an expanded listbox', function () {
          it('should select the active option/collapse the listbox', function () {
            var $select = $selects.eq(0);
            var $listbox = $fixture.find('.dqpl-listbox').eq(0);
            var $opts = $listbox.find('[role="option"]');
            var $second = $opts.eq(1);

            $select.trigger(createEvent('keydown', 13));
            assert.isTrue($select.is(':visible'));

            $select
              // DOWN
              .trigger(createEvent('keydown', 40))
              // SPACE
              .trigger(createEvent('keydown', 32));

            assert.equal($select.attr('aria-activedescendant'), $second.prop('id'));
            assert.isTrue($second.is('[aria-selected="true"]'));
            assert.isFalse($listbox.is(':visible'));
            assert.equal($select.attr('aria-expanded'), 'false');
          });
        });
      });

      describe('ESCAPE', function () {
        describe('given an expanded listbox', function () {
          it('should close the listbox and restore aria-activedescendant (based on cached selected id)', function () {
            var $select = $selects.eq(0);
            var $listbox = $fixture.find('.dqpl-listbox').eq(0);
            var $opts = $listbox.find('[role="option"]');

            var initActive = $select.attr('aria-activedescendant');
            // fire some arrows
            $select
              .trigger(createEvent('keydown', 40))
              .trigger(createEvent('keydown', 40))
              .trigger(createEvent('keydown', 40));

            assert.equal($select.attr('aria-activedescendant'), $opts.last().prop('id'));
            assert.notEqual($select.attr('aria-activedescendant'), initActive);

            $select.trigger(createEvent('keydown', 27));
            assert.equal($select.attr('aria-activedescendant'), initActive);

            assert.isFalse($listbox.is(':visible'));
          });
        });
      });

      describe('alphanumeric keys', function () {
        it('should "activate" the first match to the letter key pressed', function () {
          var $select = $selects.eq(1);
          var $listbox = $fixture.find('.dqpl-listbox').eq(1);
          var $opts = $listbox.find('[role="option"]');

          $select.trigger(createEvent('keydown', 89)); // "y" key
          assert.isTrue($opts.first().hasClass('dqpl-option-active'));
          assert.equal($opts.first().prop('id'), $select.attr('aria-activedescendant'));
          // close / reset
          $select.trigger(createEvent('keydown', 27));
        });

        it('should cycle (non-circular) down the matches of the key pressed', function (done) {
          setTimeout(function () {
            var $select = $selects.eq(1);
            var $listbox = $fixture.find('.dqpl-listbox').eq(1);
            var $opts = $listbox.find('[role="option"]');

            // there are two, options that start with n..."No" and "Never"
            $select.trigger(createEvent('keydown', 78)); // "n"
            assert.equal($opts.eq(1).prop('id'), $select.attr('aria-activedescendant'));
            $select.trigger(createEvent('keydown', 78)); // "n"
            assert.equal($opts.eq(2).prop('id'), $select.attr('aria-activedescendant'));
            done();
          }, 601); // wait for the key from the previous test to be cleared out (see `keySearch`)
        });

        it('should properly work out multi-character matches', function (done) {
          setTimeout(function () {
            var $select = $selects.eq(1);
            var $listbox = $fixture.find('.dqpl-listbox').eq(1);
            var $opts = $listbox.find('[role="option"]');

            $select
              // "n"
              .trigger(createEvent('keydown', 78))
              // "e"
              .trigger(createEvent('keydown', 69));
            // "Never" not "No"
            assert.equal($opts.eq(2).prop('id'), $select.attr('aria-activedescendant'));
            done();
          }, 601);
        });
      });
    });
  });

  function createEvent(type, which) {
  	var e = jQuery.Event(type);
  	if (which) { e.which = which; }
  	return e;
  }
});
