'use strict';

describe('modal', function () {
  var markup = [
    '<button type="button" data-modal="foo">Foo</button>',
    '<div class="dqpl-modal" role="dialog" id="foo">',
    '<div class="dqpl-modal-inner">',
    '<div class="dqpl-modal-header">',
    '<h2 tabindex="-1">Text modal</h2>',
    '<button class="dqpl-modal-close dqpl-icon" type="button">',
    '<div class="fa fa-close"></div>',
    '<div class="dqpl-offscreen">Close</div>',
    '</button>',
    '</div>',
    '<div class="dqpl-modal-content" style="max-height: 526px;">',
    '<p>Hey what\'s up? I am some content and stuff.</p>',
    '</div>',
    '<div class="dqpl-modal-footer">',
    '<button class="dqpl-button-secondary dqpl-modal-cancel" type="button">OK</button>',
    '</div>',
    '</div>'
  ].join('');
  var jQuery = window.jQuery;
  var $fixture = jQuery('#fixture');
  var $trigger, $modal;

  beforeEach(function () {
    $fixture.empty().append(jQuery(markup));
    $trigger = $fixture.find('[data-modal="foo"]');
    $modal = jQuery('#foo');
  });

  afterEach(function () {
    $fixture.empty();
  });

  describe('openModal', function () {
    beforeEach(function () {
      // open the modal
      $trigger.trigger('click');
    });

    afterEach(function () {
      // close the modal
      $modal.find('.dqpl-modal-close').trigger('click');
    });

    it('should add the dqpl-modal-show class to the modal', function () {
      assert.isTrue($modal.hasClass('dqpl-modal-show'));
    });

    it('should add the dqpl-modal-open class to the body', function () {
      assert.isTrue(jQuery('body').hasClass('dqpl-modal-open'));
    });

    it('should create a scrim if one does not exist for the modal', function () {
      assert.equal(1, $fixture.find('.dqpl-modal-screen').length);
    });

    it('should add tabindex="-1" to the heading and focus it', function () {
      var $heading = $modal.find('.dqpl-modal-header h2');
      assert.equal(-1, $heading.prop('tabIndex'));
      assert.equal(document.activeElement, $heading[0]);
    });

    it('should apply aria-hidden outside of the modal properly', function () {
      var modal = $modal[0];
      var parent = modal.parentNode;

      while (parent && parent.nodeName !== 'HTML') {
        var $children = jQuery(parent).children();
        $children.each(childHandler);
        parent = parent.parentNode;
      }

      function childHandler(_, child) {
        var $thisChild = jQuery(child);

        if (!$thisChild.is(modal) && !jQuery.contains(child, modal)) {
          assert.equal($thisChild.attr('aria-hidden'), 'true');
        }
      }
    });

    it('should trigger the "dqpl:modal-open" event on the modal', function () {
      var called = false;
      // close the modal...
      $modal.find('.dqpl-modal-close').trigger('click');

      // listen for modal-open event
      $modal.on('dqpl:modal-open', function () {
        called = true;
      });

      // open the modal...
      $trigger.trigger('click');

      assert.isTrue(called);
    });
  });

  describe('closeModal', function () {
    beforeEach(function () {
      // open the modal
      $trigger.trigger('click');
      // then close the modal
      $modal.find('.dqpl-modal-close').trigger('click');
    });

    it('should remove the dqpl-modal-open class from the body', function () {
      assert.isFalse(jQuery(document.body).hasClass('dqpl-modal-open'));
    });

    it('should remove the dqpl-modal-show class from the modal', function () {
      assert.isFalse($modal.hasClass('dqpl-modal-show'));
    });

    it('should properly remove aria-hidden outside of the modal', function () {
      assert.equal(jQuery('[aria-hidden="true"]').length, 0);
    });

    it('should return focus to the trigger', function () {
      assert.equal(document.activeElement, $trigger[0]);
    });

    it('should trigger the "dqpl:modal-close" event on the modal', function () {
      var called = false;
      // open the modal
      $trigger.trigger('click');

      // listen for close event
      $modal.on('dqpl:modal-close', function () {
        called = true;
      });

      // then close the modal
      $modal.find('.dqpl-modal-close').trigger('click');
      assert.isTrue(called);
    });
  });
});
