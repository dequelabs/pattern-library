'use strict';

var skipContainer = '<div class="dqpl-skip-container"></div>';

describe('landmarks menu', function () {
  var jQuery = window.jQuery;
  var $fixture = jQuery('#fixture');

  describe('given an empty skip container', function () {
    var $skipDiv;
    beforeEach(function () {
      $fixture.html(skipContainer + '<div role="main"></div>');
      jQuery(document).trigger('dqpl:ready');
      $skipDiv = $fixture.find('.dqpl-skip-container');
    });

    afterEach(function () {
      $fixture.empty();
    });

    describe('given a single valid skip target', function () {
      it('should create a single skip link for the main content', function () {
        assert.equal($skipDiv.find('a.dqpl-skip-link').length, 1);
      });
    });

    describe('given multiple valid skip targets', function () {
      it('should create a ul with an li for each skip target', function () {
        // in addition to the role=main added in beforeEach, let's add another target
        $fixture.append(jQuery('<div aria-label="foo" data-skip-target="true" />'));
        // reset skip container
        $fixture.find('.dqpl-skip-container').empty();
        // tell dqpl that we're ready to reassess stuff
        jQuery(document).trigger('dqpl:ready');
        assert.equal($skipDiv.find('ul').length, 1);
        assert.equal($skipDiv.find('li').length, 2);
        assert.equal($skipDiv.find('a.dqpl-skip-link').length, 2);
      });
    });

    describe('given a valid skip target with [data-no-skip]', function () {
      it('should NOT add a skip link for the target', function () {
        var $main = $fixture.find('[role="main"]');
        $main.attr('data-no-skip', 'true');
        $fixture.find('.dqpl-skip-container').empty();
        jQuery(document).trigger('dqpl:ready');
        assert.equal($skipDiv.children().length, 0);
        $main.removeAttr('data-no-skip');
      });
    });

    describe('given a valid skip target with no calculatable text', function () {
      it('should NOT generate a skip link for the target with no calculcatable text', function () {
        // in addition to the role=main added in beforeEach, let's add another target
        $fixture.append(jQuery('<div data-skip-target="true" />'));
        // reset skip container
        $fixture.find('.dqpl-skip-container').empty();
        // tell dqpl that we're ready to reassess stuff
        jQuery(document).trigger('dqpl:ready');

        assert.equal($skipDiv.find('ul').length, 0);
        assert.equal($skipDiv.find('li').length, 0);
        assert.equal($skipDiv.find('a.dqpl-skip-link').length, 1);
      });
    });

    describe('given skip target with calculatable text', function () {
      it('should properly use [data-skip-to-name]', function () {
        $fixture.find('[role="main"]').attr('data-skip-to-name', 'Monkeys');
        // reset skip container
        $fixture.find('.dqpl-skip-container').empty();
        // tell dqpl that we're ready to reassess stuff
        jQuery(document).trigger('dqpl:ready');

        assert.equal($skipDiv.find('a.dqpl-skip-link').text(), 'Monkeys');
      });

      it('should use aria-label if no [data-skip-to-name]', function () {
        $fixture.find('[role="main"]').attr('aria-label', 'Monkeys');
        // reset skip container
        $fixture.find('.dqpl-skip-container').empty();
        // tell dqpl that we're ready to reassess stuff
        jQuery(document).trigger('dqpl:ready');

        assert.equal($skipDiv.find('a.dqpl-skip-link').text(), 'Monkeys');
      });

      it('should use aria-labelledby if no [data-skip-to-name]', function () {
        // insert a div to be referenced by the role=main
        $fixture.append(jQuery('<div id="monkeys">Monkeys and stuff</div>'));
        $fixture.find('[role="main"]').attr('aria-labelledby', 'monkeys');
        // reset skip container
        $fixture.find('.dqpl-skip-container').empty();
        // tell dqpl that we're ready to reassess stuff
        jQuery(document).trigger('dqpl:ready');

        assert.equal($skipDiv.find('a.dqpl-skip-link').text(), 'Monkeys and stuff');
      });

      it('should fallback to the target\'s role', function () {
        assert.equal($skipDiv.find('a.dqpl-skip-link').text(), 'main');
      });

      it('should use data-skip-to-text with the calculatable text', function () {
        $skipDiv.attr('data-skip-to-text', 'Swing to');
        // reset skip container
        $fixture.find('.dqpl-skip-container').empty();
        // tell dqpl that we're ready to reassess stuff
        jQuery(document).trigger('dqpl:ready');
        var partOne = $skipDiv.find('a.dqpl-skip-link').find('.dqpl-skip-one').text();
        var partTwo = $skipDiv.find('a.dqpl-skip-link').find('.dqpl-skip-two').text();
        assert.equal(partOne, 'Swing to');
        assert.equal(partTwo, 'main');
      });
    });
  });

  describe('given a skip container with content', function () {
    var $skipDiv;
    beforeEach(function () {
      var $emptyContainer = jQuery(skipContainer);
      $emptyContainer.append('<a class="dqpl-skip-link" href="#foo">Skip to foo</a>');
      $fixture.append($emptyContainer);
      $fixture.append('<div id="foo"></div>');
      jQuery(document).trigger('dqpl:ready');
      $skipDiv = $fixture.find('.dqpl-skip-container');
    });

    afterEach(function () {
      $fixture.empty();
    });

    describe('given a link with a valid href', function () {
      it('should make the skip target focusable when skip link is clicked', function () {
        var $foo = jQuery('#foo');
        $skipDiv.find('a[href="#foo"]').trigger('click');
        assert.equal($foo.prop('tabIndex'), -1);
      });

      it('should focus the skip target when link is clicked', function () {
        $skipDiv.find('a[href="#foo"]').trigger('click');
        assert.equal(document.activeElement, document.getElementById('foo'));
      });
    });
  });
});
