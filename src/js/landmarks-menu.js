(function () {
  'use strict';

  /**
   * Can be implemented in a few different ways...
   * 1) provide the "Skip to" text via `data-skip-to-text` attribute in
   * which the label (aria-label or aria-labelledby) or role will be appended
   * to in the text of the link.
   * 	Example (using role):
   * 		<div class="dqpl-skip-container" data-skip-to-text="Skip to"></div>
   * 		<div role="navigation">...</div>
   * The target element is a role="navigation" and the data-skip-to-text is
   * "Skip to" so the link's text will be "Skip to navigation"
   *
   * 	Additional example (using label)
   * 		<div class="dqpl-skip-container" data-skip-to-text="Skip to"></div>
   * 		<div role="banner" aria-label="Foo Section"></div>
   * the link's text here would be: "Skip to Foo section"
   *
   * 2) In addition to the above method, you can override the role or label
   * readout ("navigation" in the above example) by adding a `data-skip-to-name`
   * attribute. Example:
   * 		<div class="dqpl-skip-container" data-skip-to-text="Skip to"></div>
   * 		<div role="navigation" data-skip-to-name="Main Navigation">
   * which would result in a skip link's text: "Skip to Main Navigation"
   *
   * 3) The 3rd option is much different than the above... It lets you have
   * complete control of the link's text.  You can create your own skip links
   * within the "dqpl-skip-container" element in which you just have to create
   * links with the class "dqpl-skip-link" and have the href attribute point to
   * the id of the target of the skip link
   * 	example:
   * 	<div class="dqpl-skip-container">
   * 		<ul>
   * 			<li><a class="dqpl-skip-link" href="#main-content">Skip to main content</a></li>
   * 			<li><a class="dqpl-skip-link" href="#side-bar">Jump to side bar</a></li>
   * 			<li><a class="dqpl-skip-link" href="#other-thing">Hop to other thing</a></li>
   * 		</ul>
   * 	</div>
   * 	<div id="main-content" role="main">
   * 		I am the target of the first skip link "Skip to main content"
   * 	</div>
   * 	<div id="side-bar">
   * 		I am the target of the second skip link "Jump to side bar"
   * 	</div>
   * 	<div id="other-thing">
   * 		I am the target of the third skip link "Hop to other thing"
   * 	</div>
   *
   */

  var $skipContainer = jQuery('.dqpl-skip-container');

  if (!$skipContainer.length) {
    return;
  }

  // focus management
  $skipContainer
      .on('focusin', function (e) {
        var $target = jQuery(e.target);

        if ($target.closest('ul').length) {
          $skipContainer.addClass('dqpl-child-focused');
        }
        $skipContainer.addClass('dqpl-skip-container-active');
        setTimeout(function () {
          $skipContainer.addClass('dqpl-skip-fade');
        });
      })
      .on('focusout', function (e) {
        var $target = jQuery(e.target);

        setTimeout(function () {
          var activeEl = document.activeElement;
          if (!jQuery(activeEl).closest('.dqpl-skip-container').length) {
            if ($target.closest('ul').length) {
              $skipContainer.removeClass('dqpl-child-focused');
            }
            $skipContainer.removeClass('dqpl-skip-container-active');
            setTimeout(function () {
              $skipContainer.removeClass('dqpl-skip-fade');
            });
          }
        });
      });

  if ($skipContainer.children().length) {
    return fixExistingLinks();
  } else {
    return createLandmarkMenu();
  }

  function fixExistingLinks() {
    jQuery(document.body).on('click', '.dqpl-skip-link', function (e) {
      e.preventDefault();
      var $link = jQuery(this);
      var href = $link.attr('href');
      var $landing = jQuery(href);

      if (!href || !$landing.length) {
        console.warn('Please provide a valid href for the skip link: ', this);
      }

      // ensure focusability
      $landing.prop('tabIndex', $landing.prop('tabIndex') || '-1');
      // focus it
      $landing.focus();
    });
  }

  function createLandmarkMenu() {
    var SELECTOR = [
      '[role="main"]',
      '[role="banner"]',
      '[role="navigation"]',
      '[data-skip-target="true"]'
    ].join(', ');

    var links = [];

    jQuery(SELECTOR).each(function (_, skipTarget) {
      // ensure its focusable
      skipTarget.tabIndex = skipTarget.tabIndex || -1;

      // calculate link text
      var linkText = calculateText(skipTarget);

      if (!linkText) {
        return console.warn('unable to calculate text for skip link for: ', skipLinkTarget);
      }

      var skipToText = $skipContainer.attr('data-skip-to-text') || '';
      var linkHtml = [
        '<span class="dqpl-skip-one">' + skipToText + '</span>',
        '<span class="dqpl-skip-two">' + linkText + '</span>'
      ].join('');

      // create a skip link
      var $link = jQuery('<a href="#" class="dqpl-skip-link">' + linkHtml + '</a>');
      links.push($link);

      $link.on('click', function (e) {
        e.preventDefault();
        skipTarget.focus();
      });
    });

    var $parent = (links.length > 1) ?
      $skipContainer.append(jQuery('<ul class="dqpl-skip-list"/>')).find('.dqpl-skip-list') :
      $skipContainer;

    jQuery.each(links, function (_, $link) {
      $parent.append($link);
      if (links.length > 1) {
        $link.wrap('<li />');
      }
    });
  }

  /**
   * Calculate text for a skip link based on (in order of precedence)
   * - the element's data-skip-to-name attribute's value
   * - the element's accessible name (calculated through aria-label or aria-labelledby)
   * - fall back to the role (if present)
   * @param  {HTMLElement} element The target of the skip link
   * @return {String}              The calculated text for the skip link
   */
  function calculateText(element) {
    var $el = jQuery(element);
    return $el.attr('data-skip-to-name') || getLabel($el) || $el.attr('role');
  }

  /**
   * Gets an elements aria-label
   * |OR|
   * text from the element referenced to in aria-labelledby
   */
  function getLabel($el) {
    return $el.attr('aria-label') || idrefsText($el.attr('aria-labelledby'));
  }

  function idrefsText(str) {
    if (!str) { return ''; }
    var result = [], index, length;
    var idrefs = str.trim().replace(/\s{2,}/g, ' ').split(' ');
    for (index = 0, length = idrefs.length; index < length; index++) {
      result.push(document.getElementById(idrefs[index]).textContent);
    }
    return result.join(' ');
  }

}());
