'use strict';

const init = require('./init');

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
 *
 * NOTE: add `data-remove-tabindex-on-blur="true"` to the skip container
 * if you want tabindex to be removed from a skip target on blur (so when
 * you click inside of a container the focus ring doesn't show up)
 */

module.exports = () => {
  document.addEventListener('dqpl:ready', init);
  init();
};
