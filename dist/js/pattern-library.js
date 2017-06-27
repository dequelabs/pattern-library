(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _documentReady = require('document-ready');

var _documentReady2 = _interopRequireDefault(_documentReady);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Deque Pattern Library entry
 */

var debug = require('debug')('dqpl:entry');

(0, _documentReady2.default)(function () {
  debug('document ready');

  // TODO: think about exposing a global equipped
  // with an emitter so we can do stuff like:
  // window.dqpl.checkboxes.on('select', (box) => console.log('selected: ', box));

  /**
   * Components
   */

  require('./lib/components/tabs')();
  require('./lib/components/checkboxes')();
  require('./lib/components/radio-buttons')();
  require('./lib/components/field-help')();
  require('./lib/components/option-menus')();
  require('./lib/components/selects')();

  /**
   * Composites
   */

  require('./lib/composites/landmarks-menu')();
  require('./lib/composites/modals')();
  require('./lib/composites/menu')();
});

},{"./lib/components/checkboxes":14,"./lib/components/field-help":16,"./lib/components/option-menus":18,"./lib/components/radio-buttons":20,"./lib/components/selects":27,"./lib/components/tabs":35,"./lib/composites/landmarks-menu":41,"./lib/composites/menu":47,"./lib/composites/modals":53,"debug":64,"document-ready":68}],2:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// these should correspond with the css class's animation time (ms)
var defaults = {
  slideDown: 300,
  slideUp: 300,
  fadeIn: 300,
  fadeOut: 300
};
var debug = require('debug')('dqpl:commons:animation');

/**
 * Animate
 * @param  {HTMLElement}   target the target of the animation
 * @param  {Object}   config configuration object containing:
 *                           - method: "add" or "remove" (add or remove the classes)
 *                           - setupClass: the initial class to be added
 *                           - animateClass: the class which contains the animation
 *                           - duration: the duration in ms of the CSS animation
 * @param  {Function} cb     function to be invoked once the animation is complete
 */
exports.animate = function (target, config, cb) {
  config = config || {};
  cb = cb || function () {};

  if (!target) {
    return debug('Cannot call animation.animate without a target element');
  }if (!config.setupClass || !config.animateClass) {
    return debug('Cannot call animate without providing setupClass and animateClass');
  }

  var list = (0, _classlist2.default)(target);
  var method = config.method || 'add';
  var duration = config.duration || 400;
  list[method](config.setupClass);
  setTimeout(function () {
    list[method](config.animateClass);
    setTimeout(cb, method === 'remove' ? 0 : duration);
  }, method === 'remove' ? duration : 50);
};

/**
 * slideDown
 * @param  {HTMLElement}   target the target of the fade in
 * @param  {Function}    cb       function to be invoked once animation is complete
 * @param  {Number}   duration    duration of animation in ms
 */
exports.slideDown = function (target, cb, duration) {
  exports.animate(target, {
    method: 'add',
    setupClass: 'dqpl-slidedown-setup',
    animateClass: 'dqpl-slidedown',
    duration: duration || defaults.slideDown
  }, cb);
};

/**
 * slideUp
 * @param  {HTMLElement}   target   the target of the fade out
 * @param  {Function} cb       function to be invoked once animation is complete
 * @param  {Number}   duration duration of animation in ms
 */
exports.slideUp = function (target, cb, duration) {
  exports.animate(target, {
    method: 'remove',
    animateClass: 'dqpl-slidedown-setup',
    setupClass: 'dqpl-slidedown',
    duration: duration || defaults.slideUp
  }, cb);
};

/**
 * slideToggle
 * @param  {HTMLElement}   target   the target of the fade out
 * @param  {Function} cb       function to be invoked once animation is complete
 * @param  {Number}   duration duration of animation in ms
 */
exports.slideToggle = function (target, cb, duration) {
  exports[(0, _classlist2.default)(target).contains('dqpl-slidedown') ? 'slideUp' : 'slideDown'](target, cb, duration);
};

/**
 * fadeIn
 * @param  {HTMLElement}   target   the target of the fade out
 * @param  {Function} cb       function to be invoked once animation is complete
 * @param  {Number}   duration duration of animation in ms
 */
exports.fadeIn = function (target, cb, duration) {
  exports.animate(target, {
    method: 'add',
    setupClass: 'dqpl-fadein-setup',
    animateClass: 'dqpl-fadein',
    duration: duration || defaults.fadeIn
  }, cb);
};

/**
 * fadeOut
 * @param  {HTMLElement}   target   the target of the fade out
 * @param  {Function} cb       function to be invoked once animation is complete
 * @param  {Number}   duration duration of animation in ms
 */
exports.fadeOut = function (target, cb, duration) {
  exports.animate(target, {
    method: 'remove',
    setupClass: 'dqpl-fadein',
    animateClass: 'dqpl-fadein-setup',
    duration: duration || defaults.fadeOut
  }, cb);
};

/**
 * fadeToggle
 * @param  {HTMLElement}   target   the target of the fade out
 * @param  {Function} cb       function to be invoked once animation is complete
 * @param  {Number}   duration duration of animation in ms
 */
exports.fadeToggle = function (target, cb, duration) {
  exports[(0, _classlist2.default)(target).contains('dqpl-fadein') ? 'fadeOut' : 'fadeIn'](target, cb, duration);
};

},{"classlist":61,"debug":64}],3:[function(require,module,exports){
'use strict';

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

var _isVisible = require('../is-visible');

var _isVisible2 = _interopRequireDefault(_isVisible);

var _queryAll = require('../query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isEnabled = function isEnabled(el) {
  return el.getAttribute('aria-disabled') !== 'true';
};

/**
 * Finds adjacent menu item
 * @param  {HTMLElement} target the base item
 * @param  {String} dir         direction of desired adjacent item ("next" or "prev")
 * @return {HTMLElement}        the adjacent item
 */
module.exports = function (target, dir) {
  var isDown = dir === 'down';
  var menu = (0, _closest2.default)(target, '[role="menu"]'); // TODO: Open this up to more than just menus?
  var items = menu && (0, _queryAll2.default)('[role="menuitem"]', menu).filter(_isVisible2.default).filter(isEnabled);

  if (!items || !items.length) {
    return;
  }

  var currentIndex = items.indexOf(target);
  var adjacentIndex = isDown ? currentIndex + 1 : currentIndex - 1;
  var item = items[adjacentIndex];

  if (!item) {
    item = items[isDown ? 0 : items.length - 1];
  }

  return item;
};

},{"../is-visible":8,"../query-all":10,"closest":62}],4:[function(require,module,exports){
'use strict';

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Find form field's label element
 * @param  {HTMLElement} el         the field element
 * @param  {String} parentSelector  the selector for the common parent of the field and label
 * @param  {String} labelSelector   the selector for the label element (qualified within the parent)
 * @return {HTMLElement}            the label element
 */
module.exports = function (el, parentSelector, labelSelector) {
  var dataLabelId = el.getAttribute('data-label-id');
  if (dataLabelId) {
    return document.getElementById(dataLabelId);
  }

  var parent = (0, _closest2.default)(el, parentSelector);
  return parent && parent.querySelector(labelSelector);
};

},{"closest":62}],5:[function(require,module,exports){
'use strict';

/**
 * Selector for naturally focusable elements
 */

module.exports = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'area[href]', 'iframe', 'object', 'embed', '[tabindex="0"]', '[contenteditable]'].join(', ');

},{}],6:[function(require,module,exports){
'use strict';

var _domMatches = require('dom-matches');

var _domMatches2 = _interopRequireDefault(_domMatches);

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if the target is outside of selector
 * @param  {HTMLElement} target   the element in question
 * @param  {String} selector the selector in question
 * @return {Boolean}
 */

// TODO: closest has a third param - checkSelf...that could replace this
module.exports = function (target, selector) {
  return !(0, _domMatches2.default)(target, selector) && !(0, _closest2.default)(target, selector);
};

},{"closest":62,"dom-matches":69}],7:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (el) {
  return (0, _classlist2.default)(el).contains('dqpl-selected') || el.getAttribute('aria-checked') === 'true';
};

},{"classlist":61}],8:[function(require,module,exports){
'use strict';

/**
 * Determine whether an element is visible
 *
 * @param {HTMLElement} el The HTMLElement
 * @param {Boolean} screenReader When provided, will evaluate visibility from the perspective of a screen reader
 * @return {Boolean} The element's visibilty status
 */

module.exports = isVisible;

function isVisible(el, screenReader, recursed) {
  var style = void 0;
  var nodeName = el.nodeName.toUpperCase();
  var parent = el.parentNode;

  // 9 === Node.DOCUMENT
  if (el.nodeType === 9) {
    return true;
  }

  style = window.getComputedStyle(el, null);
  if (style === null) {
    return false;
  }

  var isDisplayNone = style.getPropertyValue('display') === 'none';
  var isInvisibleTag = nodeName.toUpperCase() === 'STYLE' || nodeName.toUpperCase() === 'SCRIPT';
  var srHidden = screenReader && el.getAttribute('aria-hidden') === 'true';
  var isInvisible = !recursed && style.getPropertyValue('visibility') === 'hidden';

  if (isDisplayNone || isInvisibleTag || srHidden || isInvisible) {
    return false;
  }

  if (parent) {
    return isVisible(parent, screenReader, true);
  }

  return false;
}

},{}],9:[function(require,module,exports){
'use strict';

var _rndid = require('../rndid');

var _rndid2 = _interopRequireDefault(_rndid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Handles not clobbering existing values in token list attributes
 * @param  {HTMLElement} target the target element for the attr to be added
 * @param  {HTMLElement} ref    the element that target is being associated with
 * @param  {String} attr        the attr to be added (defaults to 'aria-describedby')
 */
module.exports = function (target, ref, attr) {
  attr = attr || 'aria-describedby';
  ref.id = ref.id || (0, _rndid2.default)(); // ensure it has an id
  var existingVal = target.getAttribute(attr);
  var values = existingVal ? existingVal.split(' ') : [];
  // prevent duplicates
  if (values.indexOf(ref.id) > -1) {
    return;
  }

  values.push(ref.id);
  target.setAttribute(attr, values.join(' ').trim());
};

},{"../rndid":11}],10:[function(require,module,exports){
'use strict';

/**
 * A querySelectorAll that returns a
 * normal array rather than live node list
 * @param  {String} selector
 * @param  {HTMLElement} context
 * @return {Array}
 */

module.exports = function (selector, context) {
  context = context || document;
  return Array.prototype.slice.call(context.querySelectorAll(selector));
};

},{}],11:[function(require,module,exports){
'use strict';

var _rndm = require('rndm');

var _rndm2 = _interopRequireDefault(_rndm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a unique dom element id
 */
function rndid(len) {
  len = len || 8;
  var id = (0, _rndm2.default)(len);

  if (document.getElementById(id)) {
    return rndid(len);
  }

  return id;
}

module.exports = rndid;

},{"rndm":75}],12:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _isSelected = require('../../commons/is-selected');

var _isSelected2 = _interopRequireDefault(_isSelected);

var _getLabel = require('../../commons/get-label');

var _getLabel2 = _interopRequireDefault(_getLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:components:checkboxes');
var cached = [];

/**
 * Sets attributes/classes/disable-enable event hooks for checkboxes
 */
module.exports = function () {
  var checkboxes = (0, _queryAll2.default)('.dqpl-checkbox');

  checkboxes.forEach(function (box) {
    // only update ones we haven't already touched
    if (cached.indexOf(box) > -1) {
      return;
    }
    cached.push(box);

    var isSel = (0, _isSelected2.default)(box);
    var isDis = box.getAttribute('aria-disabled') === 'true';

    if (box.getAttribute('role') !== 'checkbox') {
      debug('role="checkbox" missing from checkbox: ', box);
    }

    var iconClass = isSel ? 'fa-check-square' : 'fa-square-o';
    // create the inner checkbox element for the icon
    var inner = document.createElement('div');
    (0, _classlist2.default)(inner).add('dqpl-inner-checkbox').add('fa').add(isDis ? 'fa-square' : iconClass);
    box.appendChild(inner);

    box.tabIndex = 0;
    box.setAttribute('aria-checked', isSel ? 'true' : 'false');

    var label = (0, _getLabel2.default)(box, '.dqpl-field-wrap, .dqpl-checkbox-wrap', '.dqpl-label, .dqpl-label-inline');

    if (label) {
      if (isDis) {
        (0, _classlist2.default)(label).add('dqpl-label-disabled');
      }
      label.addEventListener('click', function () {
        box.click();
        box.focus();
      });
    }

    /**
     * Enable / disable events
     */

    box.addEventListener('dqpl:checkbox:disable', function () {
      debug('dqpl:checkbox:disable fired - disabling: ', box);
      box.setAttribute('aria-disabled', 'true');

      (0, _classlist2.default)(inner).remove('fa-check-square').remove('fa-square-o').remove('fa-square').add((0, _isSelected2.default)(box) ? 'fa-check-square' : 'fa-square');

      if (label) {
        (0, _classlist2.default)(label).add('dqpl-label-disabled');
      }
    });

    box.addEventListener('dqpl:checkbox:enable', function () {
      debug('dqpl:checkbox:enable fired - enabling: ', box);
      box.removeAttribute('aria-disabled');

      (0, _classlist2.default)(inner).remove('fa-check-square').remove('fa-square-o').remove('fa-square').add((0, _isSelected2.default)(box) ? 'fa-check-square' : 'fa-square-o');

      if (label) {
        (0, _classlist2.default)(label).remove('dqpl-label-disabled');
      }
    });
  });
};

},{"../../commons/get-label":4,"../../commons/is-selected":7,"../../commons/query-all":10,"classlist":61,"debug":64}],13:[function(require,module,exports){
'use strict';

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toggleSelected = function toggleSelected(box) {
  if (box.getAttribute('aria-disabled') === 'true') {
    return;
  }
  var wasSelected = box.getAttribute('aria-checked') === 'true';

  box.setAttribute('aria-checked', wasSelected ? 'false' : 'true');
  var inner = box.querySelector('.dqpl-inner-checkbox');
  (0, _classlist2.default)(inner).remove('fa-check-square').remove('fa-square-o').add(wasSelected ? 'fa-square-o' : 'fa-check-square');
};

/**
 * Keyboard/mouse events for checkboxes
 */
module.exports = function () {
  (0, _delegate2.default)(document.body, '.dqpl-checkbox', 'click', function (e) {
    toggleSelected(e.delegateTarget);
  });

  (0, _delegate2.default)(document.body, '.dqpl-checkbox', 'keydown', function (e) {
    var which = e.which;
    if (which === 32) {
      e.preventDefault();
      toggleSelected(e.target);
    } else if (which === 13) {
      var form = (0, _closest2.default)(e.target, 'form');
      if (form) {
        form.submit();
      }
    }
  });
};

},{"classlist":61,"closest":62,"delegate":67}],14:[function(require,module,exports){
'use strict';

var _attributes = require('./attributes');

var _attributes2 = _interopRequireDefault(_attributes);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:components:checkboxes');

module.exports = function () {
  (0, _attributes2.default)();
  (0, _events2.default)();

  document.addEventListener('dqpl:ready', function () {
    debug('dqpl:ready heard - reassessing checkbox attributes');
    (0, _attributes2.default)();
  });
};

},{"./attributes":12,"./events":13,"debug":64}],15:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates the dqpl tooltip element
 */
module.exports = function (text) {
  var tip = document.createElement('div');

  tip.setAttribute('role', 'tooltip');
  tip.innerHTML = text;
  (0, _classlist2.default)(tip).add('dqpl-tooltip');

  return tip;
};

},{"classlist":61}],16:[function(require,module,exports){
'use strict';

var _setup = require('./setup');

var _setup2 = _interopRequireDefault(_setup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:components:field-help');

module.exports = function () {
  document.addEventListener('dqpl:ready', function () {
    debug('dqpl:ready heard - reassessing field help');
    (0, _setup2.default)();
  });

  (0, _setup2.default)();
};

},{"./setup":17,"debug":64}],17:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _noClobber = require('../../commons/no-clobber');

var _noClobber2 = _interopRequireDefault(_noClobber);

var _createTooltip = require('./create-tooltip');

var _createTooltip2 = _interopRequireDefault(_createTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:components:field-help');
var cached = [];

/**
 * Setup field help (tooltip attrs/classes/events)
 */
module.exports = function () {
  (0, _queryAll2.default)('.dqpl-help-button, .dqpl-button-definition').forEach(function (button) {
    // avoid setting up the same button twice
    if (cached.indexOf(button) > -1) {
      return;
    }
    cached.push(button);
    var tipText = button.getAttribute('data-help-text');
    var tip = (0, _createTooltip2.default)(tipText);
    // find the wrapper
    var wrap = (0, _closest2.default)(button, '.dqpl-help-button-wrap, .dqpl-definition-button-wrap');
    // don't continue if no wrapper found
    if (!wrap) {
      var expected = (0, _classlist2.default)(button).contains('dqpl-help-button') ? '.dqpl-help-button-wrap' : '.dqpl-definition-button-wrap';
      debug('Unable to generate tooltip without a "' + expected + '" wrapper for: ', button);
      return;
    }

    // insert tip into DOM
    wrap.appendChild(tip);
    // associate trigger with tip via aria-describedby
    (0, _noClobber2.default)(button, tip);

    var list = (0, _classlist2.default)(tip);
    var showTip = function showTip() {
      return list.add('dqpl-tip-active');
    };
    var hideTip = function hideTip() {
      return list.remove('dqpl-tip-active');
    };
    // focus/blur / mouseover/mouseout events (to show/hide)
    button.addEventListener('focus', showTip);
    button.addEventListener('mouseover', showTip);
    button.addEventListener('blur', hideTip);
    button.addEventListener('mouseout', hideTip);
  });
};

},{"../../commons/no-clobber":9,"../../commons/query-all":10,"./create-tooltip":15,"classlist":61,"closest":62,"debug":64}],18:[function(require,module,exports){
'use strict';

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _isOutside = require('../../commons/is-outside');

var _isOutside2 = _interopRequireDefault(_isOutside);

var _getAdjacentItem = require('../../commons/get-adjacent-item');

var _getAdjacentItem2 = _interopRequireDefault(_getAdjacentItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:components:option-menus');

module.exports = function () {
  /**
   * Clicks on the document (outside of a dropdown or
   * trigger) should close all expanded options menus
   */

  document.addEventListener('click', function (e) {
    var target = e.target;
    var selector = '.dqpl-options-menu, .dqpl-options-menu-trigger';
    if ((0, _isOutside2.default)(target, selector)) {
      // collapse all menus
      (0, _queryAll2.default)(selector).forEach(function (m) {
        return m.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /**
   * Clicks on triggers
   */

  (0, _delegate2.default)(document.body, '.dqpl-options-menu-trigger', 'click', function (e) {
    var trigger = e.delegateTarget;
    var dropdownID = trigger.getAttribute('aria-controls');
    var wasExpanded = trigger.getAttribute('aria-expanded') === 'true';
    var dropdown = document.getElementById(dropdownID);
    if (!dropdown) {
      return debug('Unable to find option menu for trigger: ', trigger);
    }
    // clean up the others
    (0, _queryAll2.default)('.dqpl-options-menu, .dqpl-options-menu-trigger').filter(function (el) {
      return el !== trigger && el !== dropdown;
    }).forEach(function (el) {
      return el.setAttribute('aria-expanded', 'false');
    });
    // toggle expanded
    trigger.setAttribute('aria-expanded', wasExpanded ? 'false' : 'true');
    dropdown.setAttribute('aria-expanded', wasExpanded ? 'false' : 'true');

    if (!wasExpanded) {
      // focus the first item...
      var firstItem = dropdown.querySelector('[role="menuitem"]');
      if (firstItem) {
        firstItem.focus();
      }
    }
  });

  /**
   * Keydowns on triggers
   */

  (0, _delegate2.default)(document.body, '.dqpl-options-menu-trigger', 'keydown', function (e) {
    if (e.which === 40) {
      // down
      e.preventDefault();
      e.delegateTarget.click();
    }
  });

  /**
   * Keydowns on options menuitems
   */

  (0, _delegate2.default)(document.body, '.dqpl-options-menu [role="menuitem"]', 'keydown', function (e) {
    var which = e.which;
    var target = e.delegateTarget;

    if (which === 38 || which === 40) {
      // up or down
      e.preventDefault();
      var toFocus = (0, _getAdjacentItem2.default)(target, which === 38 ? 'up' : 'down');
      if (toFocus) {
        toFocus.focus();
      }
    } else if (which === 27) {
      // escape
      e.preventDefault();
      var dropdown = (0, _closest2.default)(target, '[role="menu"]');
      var id = dropdown && dropdown.id;
      var trigger = id && document.querySelector('.dqpl-options-menu-trigger[aria-controls="' + id + '"]');
      if (trigger) {
        trigger.click();
        trigger.focus();
      }
    } else if (which === 13 || which === 32) {
      e.preventDefault();
      target.click();
    }
  });

  /**
   * Clicks on options menuitems
   *
   * (If theres a link in it, click it)
   */

  (0, _delegate2.default)(document.body, '.dqpl-options-menu [role="menuitem"]', 'click', function (e) {
    var link = e.delegateTarget.querySelector('a');
    if (link) {
      link.click();
    }
  });

  /**
   * Clicks on links within options menuitems
   *
   * In case its for whatever reason an internal link - prevent inifinite loop
   * (This click would bubble up to the menuitem which would trigger a click
   * on this link which would bubble up and repeat itself infinitely)
   */

  (0, _delegate2.default)(document.body, '.dqpl-options-menu [role="menuitem"] a', function (e) {
    e.stopPropagation();
  });
};

},{"../../commons/get-adjacent-item":3,"../../commons/is-outside":6,"../../commons/query-all":10,"closest":62,"debug":64,"delegate":67}],19:[function(require,module,exports){
'use strict';

var _isSelected = require('../../commons/is-selected');

var _isSelected2 = _interopRequireDefault(_isSelected);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (radios) {
  var enableds = radios.filter(function (r) {
    return r.getAttribute('aria-disabled') !== 'true';
  });
  var selecteds = enableds.filter(_isSelected2.default);
  return radios.indexOf(selecteds.length ? selecteds[0] : enableds[0]);
};

},{"../../commons/is-selected":7}],20:[function(require,module,exports){
'use strict';

var _setup = require('./setup');

var _setup2 = _interopRequireDefault(_setup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  document.addEventListener('dqpl:ready', _setup2.default);
  (0, _setup2.default)();
};

},{"./setup":22}],21:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Cleans up previously selected / configures newly selected radio
 * @param  {Array} radios               Array of radio buttons in group
 * @param  {HTMLElement} newlySelected  Radio button to be selected
 * @param  {Boolean} focus              If the newlySelected radio should be focused
 */
module.exports = function (radios, newlySelected, focus) {
  radios.forEach(function (radio) {
    var isNewlySelected = radio === newlySelected;
    // set attributes / properties / classes
    radio.tabIndex = isNewlySelected ? 0 : -1;
    radio.setAttribute('aria-checked', isNewlySelected ? 'true' : 'false');
    (0, _classlist2.default)(radio).toggle('dqpl-selected');
    if (isNewlySelected && focus) {
      newlySelected.focus();
    }

    // icon state
    var inner = radio.querySelector('.dqpl-inner-radio');
    if (inner) {
      (0, _classlist2.default)(inner).remove(isNewlySelected ? 'fa-circle-o' : 'fa-dot-circle-o').add(isNewlySelected ? 'fa-dot-circle-o' : 'fa-circle-o');
    }
  });
};

},{"classlist":61}],22:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _getLabel = require('../../commons/get-label');

var _getLabel2 = _interopRequireDefault(_getLabel);

var _getSelectedIndex = require('./get-selected-index');

var _getSelectedIndex2 = _interopRequireDefault(_getSelectedIndex);

var _setSelected = require('./set-selected');

var _setSelected2 = _interopRequireDefault(_setSelected);

var _traverse = require('./traverse');

var _traverse2 = _interopRequireDefault(_traverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cachedRadios = [];
var cachedGroups = [];
var debug = require('debug')('dqpl:components:radio-buttons');
var isDisabled = function isDisabled(e) {
  return e.getAttribute('aria-disabled') === 'true';
};

module.exports = function () {
  (0, _queryAll2.default)('.dqpl-radio-group').forEach(function (radioGroup) {
    var radios = (0, _queryAll2.default)('.dqpl-radio', radioGroup);
    var selectedIndex = (0, _getSelectedIndex2.default)(radios);

    /**
     * Attrs / props / markup
     */
    radios.forEach(function (radio, i) {
      if (cachedRadios.indexOf(radio) > -1) {
        return;
      }
      cachedRadios.push(radio);
      var isSelected = i === selectedIndex;

      // attrs / props
      radio.tabIndex = isSelected ? 0 : -1;
      radio.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      radio.setAttribute('aria-setsize', radios.length);
      radio.setAttribute('aria-posinset', i + 1);

      // validate role
      if (radio.getAttribute('role') !== 'radio') {
        debug('role="radio" missing from: ', radio);
      }

      // add the icon (dqpl-inner-radio)
      var inner = radio.querySelector('.dqpl-inner-radio');

      if (!inner) {
        inner = document.createElement('span');
        inner.setAttribute('aria-hidden', 'true');
        radio.appendChild(inner);
      }

      var iconClass = isSelected ? 'fa-dot-circle-o' : 'fa-circle-o';
      iconClass = isDisabled(radio) ? 'fa-circle' : iconClass;

      (0, _classlist2.default)(inner).remove('fa-dot-circle-o').remove('fa-circle-o').remove('fa-circle').add('fa').add(iconClass).add('dqpl-inner-radio');

      /**
       * Label clicks
       */

      var label = (0, _getLabel2.default)(radio, '.dqpl-field-wrap, .dqpl-radio-wrap', '.dqpl-label, .dqpl-label-inline');

      if (!label) {
        debug('Unable to find label for: ', label);
      } else {
        label.addEventListener('click', function () {
          radio.click();
          radio.focus();
        });
      }

      /**
       * Enable / disable events
       */

      radio.addEventListener('dqpl:radio:disable', function () {
        debug('dqpl:radio:disable fired - disabling: ', radio);
        var isChecked = radio.getAttribute('aria-checked') === 'true';
        radio.setAttribute('aria-disabled', 'true');
        (0, _classlist2.default)(inner).remove('fa-dot-circle-o').remove('fa-circle-o').add(isChecked ? 'fa-dot-circle-o' : 'fa-circle');

        if (label) {
          (0, _classlist2.default)(label).add('dqpl-label-disabled');
        }
      });

      radio.addEventListener('dqpl:radio:enable', function () {
        debug('dqpl:radio:enable fired - enabling: ', radio);
        var isChecked = radio.getAttribute('aria-checked') === 'true';
        radio.removeAttribute('aria-disabled');
        (0, _classlist2.default)(inner).remove('fa-circle').remove('fa-dot-circle-o').remove('fa-circle-o').add(isChecked ? 'fa fa-dot-circle-o' : 'fa fa-circle-o');

        if (label) {
          (0, _classlist2.default)(label).remove('dqpl-label-disabled');
        }
      });
    });

    /**
     * Events
     */

    if (cachedGroups.indexOf(radioGroup) > -1) {
      return;
    }
    cachedGroups.push(radioGroup);

    // clicks on radios
    (0, _delegate2.default)(radioGroup, '[role="radio"]', 'click', function (e) {
      var radio = e.delegateTarget;
      if (isDisabled(radio)) {
        return;
      }
      (0, _setSelected2.default)(radios, radio);
    });

    // keydowns on radios
    (0, _delegate2.default)(radioGroup, '[role="radio"]', 'keydown', function (e) {
      var which = e.which;
      var target = e.target;

      if (isDisabled(target)) {
        return;
      }

      switch (which) {
        case 32:
          e.preventDefault();
          target.click();
          break;
        case 37:
        case 38:
          e.preventDefault();
          (0, _traverse2.default)(target, radios, 'prev');
          break;
        case 39:
        case 40:
          e.preventDefault();
          (0, _traverse2.default)(target, radios, 'next');
          break;
      }
    });
  });
};

},{"../../commons/get-label":4,"../../commons/query-all":10,"./get-selected-index":19,"./set-selected":21,"./traverse":23,"classlist":61,"debug":64,"delegate":67}],23:[function(require,module,exports){
'use strict';

var _setSelected = require('./set-selected');

var _setSelected2 = _interopRequireDefault(_setSelected);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enabled = function enabled(r) {
  return r.getAttribute('aria-disabled') !== 'true';
};

/**
 * Traverses to adjacent radio button
 * @param  {HTMLElement} radio  the starting point element
 * @param  {Array} radios       the radio buttons in the group
 * @param  {String} dir         "next" or "prev" - the direction to traverse
 */
module.exports = function (radio, radios, dir) {
  var enableds = radios.filter(enabled);
  if (enableds.length <= 1) {
    return;
  }
  var isNext = dir === 'next';
  var currentIndex = enableds.indexOf(radio);
  var adjacentIndex = isNext ? currentIndex + 1 : currentIndex - 1;
  if (!enableds[adjacentIndex]) {
    adjacentIndex = isNext ? 0 : enableds.length - 1;
  }
  // configure selected/unselected state and focus
  (0, _setSelected2.default)(radios, enableds[adjacentIndex], true);
};

},{"./set-selected":21}],24:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scrollIntoViewIfNeedBe = require('scroll-into-view-if-needed').default;

/**
 * Activates an option
 */
module.exports = function (combobox, listbox, noScroll) {
  // clean
  (0, _queryAll2.default)('[role="option"].dqpl-option-active').forEach(function (o) {
    return (0, _classlist2.default)(o).remove('dqpl-option-active');
  });

  var optionID = combobox.getAttribute('aria-activedescendant');
  var active = optionID && document.getElementById(optionID);

  if (active) {
    (0, _classlist2.default)(active).add('dqpl-option-active');
  }

  if (active && !noScroll) {
    scrollIntoViewIfNeedBe(active, false);
  }
};

},{"../../commons/query-all":10,"classlist":61,"scroll-into-view-if-needed":76}],25:[function(require,module,exports){
'use strict';

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _activate = require('./activate');

var _activate2 = _interopRequireDefault(_activate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Handles arrow keyboard logic
 * @param  {Object} data  Object containing the following properties:
 *     @prop  {Number} key             keydown keycode
 *     @prop  {HTMLElement} combobox   the combobox element
 *     @prop  {HTMLElement} liveRegion the liveRegion instance
 *     @prop  {HTMLElement} listbox    the listbox element
 */
module.exports = function (data) {
  var isNext = data.key === 40;
  var activeID = data.combobox.getAttribute('aria-activedescendant');
  var selectedOption = activeID && document.getElementById(activeID);

  if (!selectedOption) {
    return;
  }

  var options = (0, _queryAll2.default)('[role="option"]', data.listbox).filter(function (o) {
    return o.getAttribute('aria-disabled') !== 'true';
  });
  var index = options.indexOf(selectedOption);
  var adjacentIndex = isNext ? index + 1 : index - 1;

  if (adjacentIndex !== -1 && adjacentIndex !== options.length) {
    var adjacentOption = options[adjacentIndex];
    data.combobox.setAttribute('aria-activedescendant', adjacentOption.id);

    // announce the option politely due to a webkit aria-activedescendant bug:
    // https://bugs.webkit.org/show_bug.cgi?id=167680
    data.liveRegion.announce(adjacentOption.innerText, 1e3);

    // set active class/scroll
    (0, _activate2.default)(data.combobox, data.listbox);
  }
};

},{"../../commons/query-all":10,"./activate":24}],26:[function(require,module,exports){
'use strict';

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _liveRegion = require('live-region');

var _liveRegion2 = _interopRequireDefault(_liveRegion);

var _getLabel = require('../../commons/get-label');

var _getLabel2 = _interopRequireDefault(_getLabel);

var _open = require('./open');

var _open2 = _interopRequireDefault(_open);

var _arrow = require('./arrow');

var _arrow2 = _interopRequireDefault(_arrow);

var _select = require('./select');

var _select2 = _interopRequireDefault(_select);

var _search = require('./search');

var _search2 = _interopRequireDefault(_search);

var _activate = require('./activate');

var _activate2 = _interopRequireDefault(_activate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isLetterOrNum = function isLetterOrNum(key) {
  var isLetter = key >= 65 && key <= 90;
  var isNumber = key >= 48 && key <= 57;
  return isLetter || isNumber;
};

module.exports = function (combobox, listbox) {
  var liveRegion = new _liveRegion2.default({
    ariaLive: 'polite'
  });

  /**
   * attach native label click to focus control behavior
   */

  var label = (0, _getLabel2.default)(combobox, '.dqpl-field-wrap', '.dqpl-label, .dqpl-label-inline');
  if (label) {
    label.addEventListener('click', function () {
      return combobox.focus();
    });
  }

  /**
   * Combobox events
   */

  combobox.addEventListener('click', function () {
    (0, _classlist2.default)(listbox).toggle('dqpl-listbox-show');
    var hasShowClass = (0, _classlist2.default)(listbox).contains('dqpl-listbox-show');
    // set expanded state
    combobox.setAttribute('aria-expanded', hasShowClass ? 'true' : 'false');
    if (hasShowClass) {
      (0, _open2.default)(combobox, listbox);
    }
  });

  combobox.addEventListener('keydown', function (e) {
    var which = e.which;

    switch (which) {
      case 38: // up
      case 40:
        // down
        e.preventDefault();
        if ((0, _classlist2.default)(listbox).contains('dqpl-listbox-show')) {
          (0, _arrow2.default)({
            key: which,
            combobox: combobox,
            listbox: listbox,
            liveRegion: liveRegion
          });
        } else {
          (0, _open2.default)(combobox, listbox);
        }
        break;
      case 13: // enter
      case 32:
        // space
        e.preventDefault();
        if ((0, _classlist2.default)(listbox).contains('dqpl-listbox-show')) {
          (0, _select2.default)(combobox, listbox);
        } else {
          (0, _open2.default)(combobox, listbox);
        }
        break;
      case 27:
        // escape
        if ((0, _classlist2.default)(listbox).contains('dqpl-listbox-show')) {
          // restore previously selected
          var cachedSelected = listbox.getAttribute('data-cached-selected');
          combobox.setAttribute('aria-activedescendant', cachedSelected);
          (0, _classlist2.default)(listbox).remove('dqpl-listbox-show');
          combobox.setAttribute('aria-expanded', 'false');
        }
        break;
      default:
        // TODO: letters / numbers might not cut it...should probably allow any character
        if (isLetterOrNum(which)) {
          (0, _open2.default)(combobox, listbox);
          (0, _search2.default)(which, combobox, listbox);
        }
    }
  });

  combobox.addEventListener('blur', onComboBlur);

  function onComboBlur() {
    var wasVisible = (0, _classlist2.default)(listbox).contains('dqpl-listbox-show');

    (0, _classlist2.default)(listbox).remove('dqpl-listbox-show');
    combobox.setAttribute('aria-expanded', 'false');

    var cached = listbox.getAttribute('data-cached-selected');
    if (cached && wasVisible) {
      combobox.getAttribute('aria-activedescendant', cached);
    }
  }

  /**
   * Listbox events
   */

  (0, _delegate2.default)(listbox, '[role="option"]', 'mousedown', function (e) {
    var option = e.delegateTarget;
    // detach blur events so the list doesn't close
    combobox.removeEventListener('blur', onComboBlur);
    combobox.setAttribute('aria-activedescendant', option.id);

    (0, _activate2.default)(combobox, listbox, true);
    (0, _select2.default)(combobox, listbox, true);

    document.removeEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseUp() {
    combobox.focus();
    (0, _classlist2.default)(listbox).remove('dqpl-listbox-show');
    combobox.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mouseup', onMouseUp);
  }
};

},{"../../commons/get-label":4,"./activate":24,"./arrow":25,"./open":29,"./search":30,"./select":31,"classlist":61,"delegate":67,"live-region":71}],27:[function(require,module,exports){
'use strict';

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  document.addEventListener('dqpl:ready', _init2.default);
  (0, _init2.default)();
};

},{"./init":28}],28:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _noClobber = require('../../commons/no-clobber');

var _noClobber2 = _interopRequireDefault(_noClobber);

var _rndid = require('../../commons/rndid');

var _rndid2 = _interopRequireDefault(_rndid);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boxCache = [];
var debug = require('debug')('dqpl:components:selects');

module.exports = function () {
  (0, _queryAll2.default)('.dqpl-combobox').forEach(function (combobox) {
    if (boxCache.indexOf(combobox) > -1) {
      return;
    }
    boxCache.push(combobox);
    var dropdownId = combobox.getAttribute('aria-owns');
    var listbox = dropdownId && document.getElementById(dropdownId);

    if (!listbox) {
      return debug('Unable to find listbox using aria-owns attribute for: ', combobox);
    }

    combobox.tabIndex = 0;

    // ensure pseudo value element is present
    var pseudoVal = combobox.querySelector('.dqpl-pseudo-value');
    if (!pseudoVal) {
      pseudoVal = document.createElement('div');
      (0, _classlist2.default)(pseudoVal).add('dqpl-pseudo-value');
      combobox.appendChild(pseudoVal);
    }

    // associate pseudoVal with combobox
    (0, _noClobber2.default)(combobox, pseudoVal, 'aria-labelledby');

    // ensure all options have an id
    (0, _queryAll2.default)('[role="option"]', listbox).forEach(function (o) {
      return o.id = o.id || (0, _rndid2.default)();
    });

    // attach native click-label-focus-control behavior
    (0, _validate2.default)(combobox, listbox);
    (0, _events2.default)(combobox, listbox);

    // check if there is a default selected and ensure it has the right attrs/classes
    var activeId = combobox.getAttribute('aria-activedescendant');
    var active = activeId && document.getElementById(activeId);

    if (active) {
      active.setAttribute('aria-selected', 'true');
      (0, _classlist2.default)(active).add('dqpl-option-active');
    }
  });
};

},{"../../commons/no-clobber":9,"../../commons/query-all":10,"../../commons/rndid":11,"./events":26,"./validate":32,"classlist":61,"debug":64}],29:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _activate = require('./activate');

var _activate2 = _interopRequireDefault(_activate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Opens the listbox
 */
module.exports = function (combobox, listbox) {
  var activeDesc = combobox.getAttribute('aria-activedescendant');
  if (!activeDesc) {
    // theres no initially selected => default to the first
    var nonDisableds = (0, _queryAll2.default)('[role="option"]', listbox).filter(function (o) {
      return o.getAttribute('aria-disabled') !== 'true';
    });

    if (nonDisableds.length) {
      combobox.setAttribute('aria-activedescendant', nonDisableds[0].id);
    }
  }

  (0, _classlist2.default)(listbox).add('dqpl-listbox-show');
  combobox.setAttribute('aria-expanded', 'true');
  listbox.setAttribute('data-cached-selected', combobox.getAttribute('aria-activedescendant'));
  (0, _activate2.default)(combobox, listbox);
};

},{"../../commons/query-all":10,"./activate":24,"classlist":61}],30:[function(require,module,exports){
'use strict';

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _activate = require('./activate');

var _activate2 = _interopRequireDefault(_activate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE_TIME = 600;
var timer = void 0;
var keys = [];

/**
 * Handles searching the options / jumping to option based on characters typed
 */
module.exports = function (which, combobox, listbox) {
  var searchSelect = function searchSelect(matches) {
    if (!matches.length) {
      return;
    }
    var current = listbox.querySelector('.dqpl-option-active');
    var currentIndex = matches.indexOf(current);
    var nextIndex = currentIndex + 1;
    var toBeSelected = matches[nextIndex] || matches[0];

    if (toBeSelected === current) {
      return;
    }
    combobox.setAttribute('aria-activedescendant', toBeSelected.id);
    (0, _activate2.default)(combobox, listbox);
  };

  clearTimeout(timer);

  var key = String.fromCharCode(which);
  if (!key || !key.trim().length) {
    return;
  }

  var options = (0, _queryAll2.default)('[role="option"]', listbox).filter(function (o) {
    return o.getAttribute('aria-disabled') !== 'true';
  });

  key = key.toLowerCase();
  keys.push(key);

  // find the FIRST option that most closely matches our keys
  // if that first one is already selected, go to NEXT option
  var stringMatch = keys.join('');
  // attempt an exact match
  var deepMatches = options.filter(function (o) {
    return o.innerText.toLowerCase().indexOf(stringMatch) === 0;
  });

  if (deepMatches.length) {
    searchSelect(deepMatches);
  } else {
    // plan b - first character match
    var firstChar = stringMatch[0];
    searchSelect(options.filter(function (o) {
      return o.innerText.toLowerCase().indexOf(firstChar) === 0;
    }));
  }

  timer = setTimeout(function () {
    // reset
    keys = [];
  }, TYPE_TIME);
};

},{"../../commons/query-all":10,"./activate":24}],31:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Cleans up previously selected / sets new selection
 */
module.exports = function (combobox, listbox, noHide) {
  // clear selected state
  var prevSelected = listbox.querySelector('[aria-selected="true"]');
  if (prevSelected) {
    prevSelected.removeAttribute('aria-selected');
  }

  var active = listbox.querySelector('.dqpl-option-active');
  if (active) {
    active.setAttribute('aria-selected', 'true');
  }

  if (!noHide) {
    // hide the list
    (0, _classlist2.default)(listbox).remove('dqpl-listbox-show');
    combobox.setAttribute('aria-expanded', 'false');
  }

  // set pseudoVal
  var pseudoVal = active && combobox.querySelector('.dqpl-pseudo-value');
  if (pseudoVal) {
    pseudoVal.innerText = active.innerText;
  }
};

},{"classlist":61}],32:[function(require,module,exports){
'use strict';

var debug = require('debug')('dqpl:components:selects');

module.exports = function (combobox, listbox) {
  if (combobox.getAttribute('role') !== 'combobox') {
    debug('Combobox missing role="combobox" attribute: ', combobox);
  }

  if (listbox.getAttribute('role') !== 'listbox') {
    debug('Listbox missing role="listbox" attribute: ', listbox);
  }
};

},{"debug":64}],33:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:components:tabs');

module.exports = function () {
  var tabLists = (0, _queryAll2.default)('.dqpl-tablist');

  tabLists.forEach(function (container) {
    var tabs = (0, _queryAll2.default)('.dqpl-tab', container);
    // find the initially active tab (defaults to first)
    var activeTab = container.querySelector('.dqpl-tab-active') || tabs[0];

    if (!activeTab) {
      return debug('unable to find active tab for tablist', container);
    }

    (0, _classlist2.default)(activeTab).add('dqpl-tab-active');

    // Set initial tabindex / aria-selected
    tabs.forEach(function (t) {
      var isActive = t === activeTab;
      t.tabIndex = isActive ? 0 : -1;
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');

      // validate aria-controls presence
      if (!t.getAttribute('aria-controls')) {
        debug('aria-controls attribute missing on tab', t);
      }
      // validate role
      if (t.getAttribute('role') !== 'tab') {
        debug('role="tab" missing on tab', t);
      }
    });
  });
};

},{"../../commons/query-all":10,"classlist":61,"debug":64}],34:[function(require,module,exports){
'use strict';

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _activateTab = require('./utils/activate-tab');

var _activateTab2 = _interopRequireDefault(_activateTab);

var _getPanel = require('./utils/get-panel');

var _getPanel2 = _interopRequireDefault(_getPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  /**
   * Clicks on tabs
   */

  (0, _delegate2.default)(document.body, '.dqpl-tablist .dqpl-tab', 'click', function (e) {
    (0, _activateTab2.default)(e.delegateTarget);
  });

  /**
   * Keydowns on tabs
   */

  (0, _delegate2.default)(document.body, '.dqpl-tablist .dqpl-tab', 'keydown', function (e) {
    var which = e.which;
    var tab = e.target;

    switch (which) {
      case 37:
      case 38:
        e.preventDefault();
        (0, _activateTab2.default)(tab, 'prev');
        break;
      case 39:
      case 40:
        e.preventDefault();
        (0, _activateTab2.default)(tab, 'next');
        break;
      case 34:
        // page down
        e.preventDefault();
        var panel = (0, _getPanel2.default)(e.target);
        if (panel) {
          panel.tabIndex = -1; // ensure its focusable
          panel.focus();
        }
        break;
    }
  });

  /**
   * Keydowns on panel
   * shortcut for page up to focus panel's tab
   */

  (0, _delegate2.default)(document.body, '.dqpl-panel', 'keydown', function (e) {
    if (e.which !== 33) {
      return;
    }
    var panel = e.target;
    var tab = document.querySelector('[aria-controls="' + panel.id + '"]');
    if (tab) {
      tab.focus();
    }
  });
};

},{"./utils/activate-tab":36,"./utils/get-panel":37,"delegate":67}],35:[function(require,module,exports){
'use strict';

/**
 * DQPL Tabs
 * TODO: This should become a proper component eventually
 */

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _attributes = require('./attributes');

var _attributes2 = _interopRequireDefault(_attributes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:components:tabs');

module.exports = function () {
  (0, _events2.default)();
  (0, _attributes2.default)();

  document.addEventListener('dqpl:ready', function () {
    debug('dqpl:ready heard - reassessing tab attributes');
    (0, _attributes2.default)();
  });
};

},{"./attributes":33,"./events":34,"debug":64}],36:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

var _queryAll = require('../../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _getPanel = require('./get-panel');

var _getPanel2 = _interopRequireDefault(_getPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:components:tabs');

module.exports = function (tab, dir) {
  // configure active state of tabs/panels in tablist
  var tabList = (0, _closest2.default)(tab, '.dqpl-tablist');
  var tabs = tabList ? (0, _queryAll2.default)('.dqpl-tab', tabList) : [];

  if (dir) {
    var idx = tabs.indexOf(tab);
    tab = tabs[dir == 'prev' ? idx - 1 : idx + 1];

    if (!tab) {
      // circularity
      tab = tabs[dir === 'prev' ? tabs.length - 1 : 0];
    }
  }

  debug('activating tab: ', tab);

  tabs.forEach(function (t) {
    var isActive = t === tab;
    var panel = (0, _getPanel2.default)(t);
    if (!panel) {
      return debug('unable to find panel for tab', t);
    }

    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    t.tabIndex = isActive ? 0 : -1;
    (0, _classlist2.default)(t)[isActive ? 'add' : 'remove']('dqpl-tab-active');
    (0, _classlist2.default)(panel)[isActive ? 'remove' : 'add']('dqpl-hidden');
    panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    if (isActive && dir) {
      t.focus();
    }
  });
};

},{"../../../commons/query-all":10,"./get-panel":37,"classlist":61,"closest":62,"debug":64}],37:[function(require,module,exports){
'use strict';

module.exports = function (t) {
  return document.getElementById(t.getAttribute('aria-controls'));
};

},{}],38:[function(require,module,exports){
'use strict';

var idrefsText = function idrefsText(str) {
  if (!str) {
    return '';
  }
  var result = [],
      index,
      length;
  var idrefs = str.trim().replace(/\s{2,}/g, ' ').split(' ');
  for (index = 0, length = idrefs.length; index < length; index++) {
    result.push(document.getElementById(idrefs[index]).textContent);
  }
  return result.join(' ');
};
var getLabel = function getLabel(el) {
  return el.getAttribute('aria-label') || idrefsText(el.getAttribute('aria-labelledby'));
};

/**
 * Retrieves an element's label prioritized in the following order:
 * - it's data-skip-to-name attribute
 * - it's aria-label or the value of the element(s)
 *   pointed to in the aria-labelledby attribute
 * = it's role
 * @param  {HTMLElement} el
 * @return {String}
 */
module.exports = function (el) {
  return el.getAttribute('data-skip-to-name') || getLabel(el) || el.getAttribute('role');
};

},{}],39:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _selector = require('./selector');

var _selector2 = _interopRequireDefault(_selector);

var _calculateText = require('./calculate-text');

var _calculateText2 = _interopRequireDefault(_calculateText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:composites:landmarks-menu');

module.exports = function (shouldRemove, skipContainer) {
  var links = [];
  var main = document.querySelector('.dqpl-main-content');

  (0, _queryAll2.default)(_selector2.default).forEach(function (skipTarget) {
    if (skipTarget.getAttribute('data-no-skip') === 'true') {
      return;
    }

    var linkText = (0, _calculateText2.default)(skipTarget);
    if (!linkText) {
      return debug('Unable to calulate text for skip link for: ', skipTarget);
    }

    var skipToText = skipContainer.getAttribute('data-skip-to-text') || '';
    var linkHTML = ['<span class="dqpl-skip-one">' + skipToText + '</span>', '<span class="dqpl-skip-two">' + linkText + '</span>'].join('');

    // create the skip link
    var link = document.createElement('a');
    link.href = '#';
    link.innerHTML = linkHTML;
    (0, _classlist2.default)(link).add('dqpl-skip-link');
    links.push(link);

    link.addEventListener('click', function (e) {
      e.preventDefault();
      // ensure its focusable
      skipTarget.tabIndex = skipTarget.tabIndex === 0 ? 0 : -1;
      // focus it
      skipTarget.focus();

      if (main && skipTarget === main) {
        main.scrollTop = 0;
      } else {
        skipTarget.scrollIntoView(true);
      }

      if (shouldRemove) {
        skipTarget.removeEventListener('blur', onSkipTargetBlur);
        skipTarget.addEventListener('blur', onSkipTargetBlur);
      }

      function onSkipTargetBlur() {
        skipTarget.removeAttribute('tabindex');
        skipTarget.removeEventListener('blur', onSkipTargetBlur);
      }
    });
  });

  var parent = skipContainer;
  if (links.length > 1) {
    var ul = document.createElement('ul');
    (0, _classlist2.default)(ul).add('dqpl-skip-list');
    skipContainer.appendChild(ul);
    parent = ul;
  }

  links.forEach(function (link) {
    if (links.length > 1) {
      var li = document.createElement('li');
      parent.appendChild(li);
      li.appendChild(link);
    } else {
      parent.appendChild(link);
    }
  });
};

},{"../../commons/query-all":10,"./calculate-text":38,"./selector":43,"classlist":61,"debug":64}],40:[function(require,module,exports){
'use strict';

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:composites:landmarks-menu');

/**
 * Configures an existing skip list by ensuring the target of each link
 * is focusable optionally removing tabindex when the target is blurred
 */
module.exports = function (shouldRemove) {
  (0, _delegate2.default)(document.body, '.dqpl-skip-link', 'click', function (e) {
    e.preventDefault();
    var link = e.delegateTarget;
    var href = link.getAttribute('href');
    var landing = href && document.querySelector(href);

    if (!landing) {
      return debug('Unable to calculate landing for skip link: ', link);
    }

    // ensure focusability
    landing.tabIndex = landing.tabIndex === 0 ? 0 : -1;
    // focus it
    landing.focus();
    // tabindex cleanup
    if (shouldRemove) {
      landing.addEventListener('blur', onLandingBlur);
    }

    function onLandingBlur() {
      landing.removeAttribute('tabindex');
      landing.removeEventListener('blur', onLandingBlur);
    }
  });
};

},{"debug":64,"delegate":67}],41:[function(require,module,exports){
'use strict';

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

module.exports = function () {
  document.addEventListener('dqpl:ready', _init2.default);
  (0, _init2.default)();
};

},{"./init":42}],42:[function(require,module,exports){
'use strict';

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _fixExisting = require('./fix-existing');

var _fixExisting2 = _interopRequireDefault(_fixExisting);

var _createLandmarkMenu = require('./create-landmark-menu');

var _createLandmarkMenu2 = _interopRequireDefault(_createLandmarkMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var skipContainer = document.querySelector('.dqpl-skip-container');
  if (!skipContainer) {
    return;
  }
  var shouldRemove = skipContainer.getAttribute('data-remove-tabindex-on-blur') === 'true';

  // focus management
  skipContainer.addEventListener('focusin', function (e) {
    var target = e.target;
    var list = (0, _classlist2.default)(skipContainer);

    if ((0, _closest2.default)(target, 'ul')) {
      list.add('dqpl-child-focused');
    }

    list.add('dqpl-skip-container-active');
    setTimeout(function () {
      return list.add('dqpl-skip-fade');
    });
  });

  skipContainer.addEventListener('focusout', function (e) {
    var target = e.target;
    var list = (0, _classlist2.default)(skipContainer);

    setTimeout(function () {
      var activeEl = document.activeElement;
      if ((0, _closest2.default)(activeEl, '.dqpl-skip-container')) {
        return;
      }

      if ((0, _closest2.default)(target, 'ul')) {
        list.remove('dqpl-child-focused');
      }

      list.remove('dqpl-skip-container-active');
      setTimeout(function () {
        return list.remove('dqpl-skip-fade');
      });
    });
  });

  if (skipContainer.childElementCount) {
    return (0, _fixExisting2.default)(shouldRemove);
  }

  (0, _createLandmarkMenu2.default)(shouldRemove, skipContainer);
};

},{"./create-landmark-menu":39,"./fix-existing":40,"classlist":61,"closest":62}],43:[function(require,module,exports){
'use strict';

/**
 * Selector for landmark menu targets
 */

module.exports = ['[role="main"]', '[role="banner"]', '[role="navigation"]', '[data-skip-target="true"]'].join(', ');

},{}],44:[function(require,module,exports){
'use strict';

var _activate = require('../utils/activate');

var _activate2 = _interopRequireDefault(_activate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (items, target, dir) {
  var isNext = dir === 'next';
  var currentIdx = items.indexOf(target);
  var adjacent = items[isNext ? currentIdx + 1 : currentIdx - 1];
  // circularity
  if (!adjacent) {
    adjacent = items[isNext ? 0 : items.length - 1];
  }

  (0, _activate2.default)(target, adjacent);
};

},{"../utils/activate":49}],45:[function(require,module,exports){
'use strict';

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

var _arrow = require('./arrow');

var _arrow2 = _interopRequireDefault(_arrow);

var _activate = require('../utils/activate');

var _activate2 = _interopRequireDefault(_activate);

var _queryAll = require('../../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _isVisible = require('../../../commons/is-visible');

var _isVisible2 = _interopRequireDefault(_isVisible);

var _getTopLevelItems = require('../utils/get-top-level-items');

var _getTopLevelItems2 = _interopRequireDefault(_getTopLevelItems);

var _animation = require('../../../commons/animation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTIVE_CLASS = 'dqpl-active';

module.exports = function (elements) {
  /**
   * Listen for clicks outside the menu (when
   * its opened AND not locked) to close it
   */

  document.addEventListener('click', function (e) {
    var target = e.target;
    var isLocked = elements.menu.getAttribute('data-locked') === 'true';
    var isWithin = (0, _closest2.default)(target, '.dqpl-side-bar');
    var isHamburger = (0, _classlist2.default)(target).contains('dqpl-menu-trigger') || !!(0, _closest2.default)(target, '.dqpl-menu-trigger');

    if (isWithin || isHamburger || isLocked) {
      return;
    }

    if (elements.menu.getAttribute('aria-expanded') === 'true') {
      onTriggerClick();
    }
  });

  // hamburger clicks
  elements.trigger.addEventListener('click', onTriggerClick);

  /**
   * Toggle submenu on other topbar menu items with submenus
   */

  (0, _delegate2.default)(elements.topBar, '[role="menuitem"][aria-controls]', 'click', function (e) {
    var target = e.delegateTarget;
    // NOTE: the reason this event is delegated rather than being bound directly
    // to the trigger is to support updating the element ref of the trigger dynamically
    if (target === elements.trigger) {
      return;
    }

    toggleSubmenu(target, function (dropdown, done) {
      (0, _classlist2.default)(dropdown).toggle('dqpl-dropdown-active');
      var isMenu = dropdown.getAttribute('role') === 'menu';
      var focusTarget = isMenu ? dropdown.querySelector('[role="menuitem"]') : dropdown;
      var isOpen = (0, _classlist2.default)(dropdown).contains('dqpl-dropdown-active');
      target.setAttribute('data-dropdown-expanded', isOpen ? 'true' : 'false');
      done(false, isOpen ? focusTarget : target);
    });
  });

  /**
   * Keydowns on dropdowns of the topbar
   */

  (0, _delegate2.default)(elements.topBar, '[role="menuitem"] .dqpl-dropdown [role="menuitem"]', 'keydown', function (e) {
    var target = e.delegateTarget;
    switch (e.which) {
      case 38:
      case 40:
        e.preventDefault();
        var dir = e.which === 38 ? 'up' : 'down';
        (0, _arrow2.default)((0, _getTopLevelItems2.default)((0, _closest2.default)(target, '.dqpl-dropdown')), target, dir);
        break;
      case 27:
      case 37:
        var dropdown = (0, _closest2.default)(target, '.dqpl-dropdown');
        var trigger = dropdown && document.querySelector('[aria-controls="' + dropdown.id + '"]');
        if (trigger) {
          trigger.click();
        }
    }
  });

  /**
   * Menu item setup
   */

  elements.topBarItems.forEach(function (t, i) {
    return t.tabIndex = i === 0 ? 0 : -1;
  });
  (0, _queryAll2.default)('[role="menu"]', elements.menu).forEach(function (m) {
    var mItems = (0, _queryAll2.default)('[role="menuitem"]', m);
    mItems.forEach(function (mi, i) {
      return mi.tabIndex = i === 0 ? 0 : -1;
    });
  });

  /**
   * Keyboard logic for top bar (top-level)
   */

  (0, _delegate2.default)(elements.topBar, '[role="menubar"] > [role="menuitem"]', 'keydown', function (e) {
    var which = e.which;
    var target = e.target;

    switch (which) {
      case 37:
      case 39:
        e.preventDefault();
        (0, _arrow2.default)((0, _getTopLevelItems2.default)(elements.topBar.querySelector('[role="menubar"]'), true), target, which == 39 ? 'next' : 'prev');
        break;
      case 38:
      case 40:
        e.preventDefault();
        if (target.hasAttribute('aria-controls')) {
          target.click();
        }
        break;
      case 13:
      case 32:
        e.preventDefault();
        target.click();
        break;
    }
  });

  /**
   * Click links inside of clicked menuitems
   */

  (0, _delegate2.default)(elements.topBar, '[role="menuitem"]', 'click', function (e) {
    var target = e.delegateTarget;
    var submenu = target.querySelector('[role="menu"]');
    var link = target.querySelector('a');
    // only click links that are not contained in submenus
    if (submenu && submenu.contains(link)) {
      return;
    }
    if (link) {
      link.click();
    }
  });

  /**
   * Handle keydowns within top bar dropdowns
   */

  (0, _delegate2.default)(elements.topBar, '.dqpl-dropdown', 'keydown', function (e) {
    var which = e.which;
    var dropdown = e.delegateTarget;

    if (dropdown.getAttribute('role') === 'menu') {
      return;
    }

    if (which === 27 || which === 38) {
      var trigger = document.querySelector('[aria-controls="' + dropdown.id + '"]');
      if (trigger) {
        trigger.click();
      }
    }
  });

  /**
   * Keyboard logic for menu (side bar)
   * - up/down traverse through menu items
   * - right (with submenu) opens submenu / focuses first item
   * - left/escape closes submenu (if within one) OR closes menu (if at top level)
   */

  (0, _delegate2.default)(elements.menu, '[role="menuitem"]', 'keydown', function (e) {
    var which = e.which;
    var target = e.target;

    switch (which) {
      case 27:
      case 37:
        var isOfMenu = target.parentNode === elements.menu;
        if (elements.menu.getAttribute('data-locked') === 'true' && isOfMenu) {
          return;
        }

        e.preventDefault();
        e.stopPropagation(); // prevent bubbling for sake of submenus

        var thisMenu = (0, _closest2.default)(target, '[role="menu"]');
        var thisTrigger = document.querySelector('[aria-controls="' + thisMenu.id + '"]');

        thisTrigger.click();
        if (!isOfMenu) {
          (0, _activate2.default)(target, thisTrigger);
        }
        break;
      case 40:
        e.preventDefault();
        arrowSetup(target, 'next');
        break;
      case 38:
        e.preventDefault();
        arrowSetup(target, 'prev');
        break;
      case 32:
      case 13:
        e.preventDefault();
        target.click();
        if (!target.getAttribute('aria-controls')) {
          var link = target.querySelector('a');
          if (link) {
            link.click();
          }
        }
        break;
      case 39:
        if (target.hasAttribute('aria-controls')) {
          target.click();
        }
        break;
    }
  });

  /**
   * Mouse logic for expandable submenu triggers
   */

  (0, _delegate2.default)(elements.menu, '[role="menuitem"]', 'click', function (e) {
    e.stopPropagation();
    var trigger = e.delegateTarget;

    if (trigger.hasAttribute('aria-controls')) {
      toggleSubmenu(trigger, function (submenu, done) {
        (0, _animation.slideToggle)(submenu, function () {
          var toFocus = submenu.querySelector('[role="menuitem"][tabindex="0"]');
          toFocus = toFocus || submenu.querySelector('[role="menuitem"]');
          done(false, toFocus);
        }, 300);
      });
    } else {
      var link = trigger.querySelector('a');
      if (link) {
        link.click();
      }
    }
  });

  elements.menu.addEventListener('keydown', function (e) {
    if (e.which !== 9) {
      return;
    }
    setTimeout(function () {
      var outside = !elements.menu.contains(document.activeElement);
      var isExpanded = elements.menu.getAttribute('aria-expanded');

      if (outside && isExpanded) {
        onTriggerClick(null, true);
      }
    });
  });

  function arrowSetup(target, dir) {
    var items = (0, _getTopLevelItems2.default)((0, _closest2.default)(target, '[role="menu"]'));
    (0, _arrow2.default)(items, target, dir);
  }

  /**
   * Handles clicks on trigger
   * - toggles classes
   * - handles animation
   */

  function onTriggerClick(e, noFocus) {
    toggleSubmenu(elements.trigger, function (_, done) {
      (0, _classlist2.default)(elements.trigger).toggle(ACTIVE_CLASS);
      var wasActive = (0, _classlist2.default)(elements.menu).contains(ACTIVE_CLASS);
      var first = wasActive ? ACTIVE_CLASS : 'dqpl-show';
      var second = first === ACTIVE_CLASS ? 'dqpl-show' : ACTIVE_CLASS;

      (0, _classlist2.default)(elements.menu).toggle(first);

      if (elements.scrim) {
        (0, _classlist2.default)(elements.scrim).toggle('dqpl-scrim-show');
      }

      setTimeout(function () {
        (0, _classlist2.default)(elements.menu).toggle(second);
        if (elements.scrim) {
          (0, _classlist2.default)(elements.scrim).toggle('dqpl-scrim-fade-in');
        }
        setTimeout(function () {
          return done(noFocus);
        });
      }, 100);
    });
  }

  /**
   * Toggles a menu or submenu
   */

  function toggleSubmenu(trigger, toggleFn) {
    var droplet = document.getElementById(trigger.getAttribute('aria-controls'));

    if (!droplet) {
      return;
    }

    toggleFn(droplet, function (noFocus, focusTarget) {
      var prevExpanded = droplet.getAttribute('aria-expanded');
      var wasCollapsed = !prevExpanded || prevExpanded === 'false';
      droplet.setAttribute('aria-expanded', wasCollapsed ? 'true' : 'false');

      if (focusTarget) {
        focusTarget.focus();
      } else if (!noFocus) {
        var active = (0, _queryAll2.default)('.dqpl-menuitem-selected', droplet).filter(_isVisible2.default);
        active = active.length ? active : (0, _queryAll2.default)('[role="menuitem"][tabindex="0"]', droplet).filter(_isVisible2.default);
        var focusMe = wasCollapsed ? active[0] : (0, _closest2.default)(droplet, '[aria-controls][role="menuitem"]');
        focusMe = focusMe || elements.trigger;
        if (focusMe) {
          focusMe.focus();
        }
      }
    });
  }
};

},{"../../../commons/animation":2,"../../../commons/is-visible":8,"../../../commons/query-all":10,"../utils/activate":49,"../utils/get-top-level-items":50,"./arrow":44,"classlist":61,"closest":62,"delegate":67}],46:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _getTopLevelItems = require('../utils/get-top-level-items');

var _getTopLevelItems2 = _interopRequireDefault(_getTopLevelItems);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lastSize = void 0;

module.exports = function (elements, update) {
  var menu = elements.menu;
  var trigger = elements.trigger;
  var scrim = elements.scrim;
  var topBar = elements.topBar;

  if (!menu || !trigger) {
    return;
  }

  /**
   * The menu is locked into visibility above 1024px viewport...
   * - ensure aria-expanded is removed/readded properly
   * - ensure the topbar menu isn't thrown off (in case the hamburger was the "active" item)
   */

  function onResize() {
    var width = window.innerWidth;
    if (width >= 1024) {
      if (!lastSize || lastSize === 'narrow') {
        lastSize = 'wide';

        var expandedState = menu.getAttribute('aria-expanded');
        if (expandedState) {
          menu.setAttribute('data-prev-expanded', expandedState);
        }

        menu.removeAttribute('aria-expanded');
        if (scrim) {
          (0, _classlist2.default)(scrim).remove('dqpl-scrim-show').remove('dqpl-scrim-fade-in');
        }

        if (trigger.tabIndex === 0) {
          // since `$trigger` gets hidden (via css hook)
          // "activate" something else in the menubar
          var topBarMenuItems = (0, _getTopLevelItems2.default)(topBar.querySelector('[role="menubar"]'), true);
          update(topBarMenuItems);
          topBarMenuItems.forEach(function (item, i) {
            return item.tabIndex = i === 0 ? 0 : -1;
          });
        }
        menu.setAttribute('data-locked', 'true');
      }
    } else {
      if (!lastSize || lastSize === 'wide') {
        lastSize = 'narrow';
        var wasExpanded = menu.getAttribute('data-prev-expanded') === 'true';
        menu.setAttribute('aria-expanded', wasExpanded ? 'true' : 'false');
        update((0, _getTopLevelItems2.default)(topBar.querySelector('ul'), true));
        menu.setAttribute('data-locked', 'false');

        if (wasExpanded === 'true' && scrim) {
          (0, _classlist2.default)(scrim).add('dqpl-scrim-show').add('dqpl-scrim-fade-in');
        }
      }
    }
  }

  onResize();
  // TODO: Throttle this for better performance
  window.addEventListener('resize', onResize);
};

},{"../utils/get-top-level-items":50,"classlist":61}],47:[function(require,module,exports){
'use strict';

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:composites:menu');

function findTopBar() {
  var topBar = document.querySelector('.dqpl-top-bar');
  if (topBar) {
    // TODO: Don't make top bar required?
    return (0, _init2.default)(topBar);
  }
  // no top bar present...wait for dqpl:ready before trying again
  document.addEventListener('dqpl:ready', onReadyFire);
}

function onReadyFire() {
  debug('dqpl:ready fired - querying DOM for top bar.');
  document.removeEventListener('dqpl:ready', onReadyFire);
  findTopBar(); // try again
}

module.exports = findTopBar;

},{"./init":48,"debug":64}],48:[function(require,module,exports){
'use strict';

var _resize = require('./events/resize');

var _resize2 = _interopRequireDefault(_resize);

var _main = require('./events/main');

var _main2 = _interopRequireDefault(_main);

var _getTopLevelItems = require('./utils/get-top-level-items');

var _getTopLevelItems2 = _interopRequireDefault(_getTopLevelItems);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (topBar) {
  var elements = {
    topBar: topBar,
    trigger: topBar.querySelector('.dqpl-menu-trigger'),
    menu: document.querySelector('.dqpl-side-bar'),
    scrim: document.getElementById('dqpl-side-bar-scrim'),
    topBarItems: (0, _getTopLevelItems2.default)(topBar.querySelector('[role="menubar"]'), true)
  };
  var updateTopBarItems = function updateTopBarItems(items) {
    return elements.topBarItems = items;
  };

  // Configure the menu based on size of window
  (0, _resize2.default)(elements, updateTopBarItems);

  // attach all of the top/side bar click and keydown events
  (0, _main2.default)(elements, updateTopBarItems);

  // update top bar element references on dqpl:refresh
  elements.topBar.addEventListener('dqpl:refresh', function () {
    var topLevels = (0, _getTopLevelItems2.default)(topBar.querySelector('[role="menubar"]'), true);
    updateTopBarItems(topLevels);

    var activeOnes = topLevels.filter(function (t) {
      return t.tabIndex === 0;
    });
    // default to the first item if no active item exists
    if (!activeOnes.length) {
      topLevels[0].tabIndex = 0;
    }
  });
};

},{"./events/main":45,"./events/resize":46,"./utils/get-top-level-items":50}],49:[function(require,module,exports){
'use strict';

/**
 * Configures tabIndex and focus
 */

module.exports = function (prevActive, newlyActive) {
  prevActive.tabIndex = -1;
  newlyActive.tabIndex = 0;
  newlyActive.focus();
};

},{}],50:[function(require,module,exports){
'use strict';

var _isVisible = require('../../../commons/is-visible');

var _isVisible2 = _interopRequireDefault(_isVisible);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (ul, visible) {
  if (!ul) {
    return [];
  }

  return Array.prototype.slice.call(ul.children).filter(function (c) {
    return c.getAttribute('role') === 'menuitem';
  }).filter(function (c) {
    return visible ? (0, _isVisible2.default)(c) : true;
  });
};

},{"../../../commons/is-visible":8}],51:[function(require,module,exports){
'use strict';

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Aria-hides everything except the
 * modal and direct parents of it
 */
exports.hide = function (modal) {
  var parent = modal.parentNode;

  while (parent && parent.nodeName !== 'HTML') {
    Array.prototype.slice.call(parent.children).forEach(childHandler);
    parent = parent.parentNode;
  }

  function childHandler(child) {
    if (child !== modal && !child.contains(modal)) {
      setHidden(child);
    }
  }

  /**
   * Sets aria-hidden="true" and sets data
   * attribute if it was originally hidden
   */
  function setHidden(el) {
    if (el.getAttribute('aria-hidden') === 'true') {
      el.setAttribute('data-already-aria-hidden', 'true');
    }

    el.setAttribute('aria-hidden', 'true');
  }
};

exports.show = function () {
  (0, _queryAll2.default)('[aria-hidden="true"]').forEach(function (el) {
    if (el.getAttribute('data-already-aria-hidden') !== 'true') {
      el.removeAttribute('aria-hidden');
    }
  });
};

},{"../../commons/query-all":10}],52:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _aria = require('./aria');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:composites:modals');

module.exports = function (modal) {
  var trigger = document.querySelector('[data-modal="' + modal.id + '"]');

  (0, _classlist2.default)(modal).remove('dqpl-modal-show');
  (0, _classlist2.default)(document.body).remove('dqpl-modal-open');

  (0, _aria.show)();

  if (trigger) {
    trigger.focus();
  } else {
    debug('Unable to find trigger for modal: ', modal);
  }
};

},{"./aria":51,"classlist":61,"debug":64}],53:[function(require,module,exports){
'use strict';

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _closest = require('closest');

var _closest2 = _interopRequireDefault(_closest);

var _open = require('./open');

var _open2 = _interopRequireDefault(_open);

var _close = require('./close');

var _close2 = _interopRequireDefault(_close);

var _sizer = require('./sizer');

var _sizer2 = _interopRequireDefault(_sizer);

var _queryAll = require('../../commons/query-all');

var _queryAll2 = _interopRequireDefault(_queryAll);

var _selector = require('../../commons/is-focusable/selector');

var _selector2 = _interopRequireDefault(_selector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:composites:modals');

module.exports = function () {
  /**
   * Handle clicks on triggers
   */

  (0, _delegate2.default)(document.body, '[data-modal]', 'click', function (e) {
    var trigger = e.delegateTarget;
    var modalID = trigger.getAttribute('data-modal');
    var modal = document.getElementById(modalID);

    if (!modal) {
      return debug('No modal found with id: ', modalID);
    }

    (0, _open2.default)(trigger, modal);
    window.addEventListener('resize', onWindowResize);
  });

  /**
   * Handle closing / canceling
   */

  (0, _delegate2.default)(document.body, '.dqpl-modal-close, .dqpl-modal-cancel', 'click', function (e) {
    var button = e.delegateTarget;
    var modal = (0, _closest2.default)(button, '.dqpl-modal');
    (0, _close2.default)(modal);
    window.removeEventListener('resize', onWindowResize);
  });

  /**
   * Keydowns on modals
   * - trap focus
   * - escape => close
   */

  (0, _delegate2.default)(document.body, '.dqpl-modal', 'keydown', function (e) {
    var modal = e.delegateTarget;
    var target = e.target;
    var which = e.which;

    if (which === 27) {
      (0, _close2.default)(modal);
    } else if (which === 9) {
      var focusables = (0, _queryAll2.default)(_selector2.default, modal);
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && target === first) {
        e.preventDefault();
        if (last) {
          last.focus();
        }
      } else if (!e.shiftKey && target === last) {
        e.preventDefault();
        if (first) {
          first.focus();
        }
      }
    }
  });

  (0, _delegate2.default)(document.body, '.dqpl-modal-header h2', 'keydown', function (e) {
    if (e.which === 9 && e.shiftKey) {
      e.preventDefault();
      var modal = (0, _closest2.default)(e.delegateTarget, '.dqpl-modal');
      var focusables = (0, _queryAll2.default)(_selector2.default, modal);

      if (focusables.length) {
        focusables[focusables.length - 1].focus();
      }
    }
  });

  function onWindowResize() {
    (0, _sizer2.default)(document.querySelector('.dqpl-modal-show'));
  }
};

},{"../../commons/is-focusable/selector":5,"../../commons/query-all":10,"./close":52,"./open":54,"./sizer":55,"closest":62,"debug":64,"delegate":67}],54:[function(require,module,exports){
'use strict';

var _classlist = require('classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _sizer = require('./sizer');

var _sizer2 = _interopRequireDefault(_sizer);

var _aria = require('./aria');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('dqpl:composites:modals');

module.exports = function (trigger, modal) {
  var heading = modal.querySelector('.dqpl-modal-header h2');

  // show the modal
  (0, _classlist2.default)(modal).add('dqpl-modal-show');
  (0, _classlist2.default)(document.body).add('dqpl-modal-open');

  var scrim = modal.querySelector('.dqpl-modal-screen');

  if (!scrim) {
    scrim = document.createElement('div');
    (0, _classlist2.default)(scrim).add('dqpl-modal-screen');
    modal.appendChild(scrim);
  }

  if (!heading) {
    debug('No heading found for modal: ', modal);
  } else {
    heading.tabIndex = -1;
    heading.focus();
  }

  (0, _aria.hide)(modal);
  (0, _sizer2.default)(modal);
};

},{"./aria":51,"./sizer":55,"classlist":61,"debug":64}],55:[function(require,module,exports){
'use strict';

module.exports = function (modal) {
  var content = modal && modal.querySelector('.dqpl-modal-content');
  if (content) {
    content.style.maxHeight = window.innerHeight - 185 + 'px';
  }
};

},{}],56:[function(require,module,exports){
var BezierEasing = require('bezier-easing')

// Predefined set of animations. Similar to CSS easing functions
var animations = {
  ease:  BezierEasing(0.25, 0.1, 0.25, 1),
  easeIn: BezierEasing(0.42, 0, 1, 1),
  easeOut: BezierEasing(0, 0, 0.58, 1),
  easeInOut: BezierEasing(0.42, 0, 0.58, 1),
  linear: BezierEasing(0, 0, 1, 1)
}


module.exports = animate;

function animate(source, target, options) {
  var start= Object.create(null)
  var diff = Object.create(null)
  options = options || {}
  // We let clients specify their own easing function
  var easing = (typeof options.easing === 'function') ? options.easing : animations[options.easing]

  // if nothing is specified, default to ease (similar to CSS animations)
  if (!easing) {
    if (options.easing) {
      console.warn('Unknown easing function in amator: ' + options.easing);
    }
    easing = animations.ease
  }

  var step = typeof options.step === 'function' ? options.step : noop
  var done = typeof options.done === 'function' ? options.done : noop

  var scheduler = getScheduler(options.scheduler)

  var keys = Object.keys(target)
  keys.forEach(function(key) {
    start[key] = source[key]
    diff[key] = target[key] - source[key]
  })

  var durationInMs = options.duration || 400
  var durationInFrames = Math.max(1, durationInMs * 0.06) // 0.06 because 60 frames pers 1,000 ms
  var previousAnimationId
  var frame = 0

  previousAnimationId = scheduler.next(loop)

  return {
    cancel: cancel
  }

  function cancel() {
    scheduler.cancel(previousAnimationId)
    previousAnimationId = 0
  }

  function loop() {
    var t = easing(frame/durationInFrames)
    frame += 1
    setValues(t)
    if (frame <= durationInFrames) {
      previousAnimationId = scheduler.next(loop)
      step(source)
    } else {
      previousAnimationId = 0
      setTimeout(function() { done(source) }, 0)
    }
  }

  function setValues(t) {
    keys.forEach(function(key) {
      source[key] = diff[key] * t + start[key]
    })
  }
}

function noop() { }

function getScheduler(scheduler) {
  if (!scheduler) {
    var canRaf = typeof window !== 'undefined' && window.requestAnimationFrame
    return canRaf ? rafScheduler() : timeoutScheduler()
  }
  if (typeof scheduler.next !== 'function') throw new Error('Scheduler is supposed to have next(cb) function')
  if (typeof scheduler.cancel !== 'function') throw new Error('Scheduler is supposed to have cancel(handle) function')

  return scheduler
}

function rafScheduler() {
  return {
    next: window.requestAnimationFrame.bind(window),
    cancel: window.cancelAnimationFrame.bind(window)
  }
}

function timeoutScheduler() {
  return {
    next: function(cb) {
      return setTimeout(cb, 1000/60)
    },
    cancel: function (id) {
      return clearTimeout(id)
    }
  }
}

},{"bezier-easing":59}],57:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":80}],58:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],59:[function(require,module,exports){
/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

module.exports = function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  if (mX1 !== mY1 || mX2 !== mY2) {
    for (var i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    if (mX1 === mY1 && mX2 === mY2) {
      return x; // linear
    }
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};

},{}],60:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":58,"ieee754":70}],61:[function(require,module,exports){
'use strict';

module.exports = ClassList

var indexOf = require('component-indexof'),
    trim = require('trim'),
    arr = Array.prototype

/**
 * ClassList(elem) is kind of like Element#classList.
 *
 * @param {Element} elem
 * @return {ClassList}
 */
function ClassList (elem) {
  if (!(this instanceof ClassList))
    return new ClassList(elem)

  var classes = trim(elem.className).split(/\s+/),
      i

  this._elem = elem

  this.length = 0

  for (i = 0; i < classes.length; i += 1) {
    if (classes[i])
      arr.push.call(this, classes[i])
  }
}

/**
 * add(class1 [, class2 [, ...]]) adds the given class(es) to the
 * element.
 *
 * @param {String} ...
 * @return {Context}
 */
ClassList.prototype.add = function () {
  var name,
      i

  for (i = 0; i < arguments.length; i += 1) {
    name = '' + arguments[i]

    if (indexOf(this, name) >= 0)
      continue

    arr.push.call(this, name)
  }

  this._elem.className = this.toString()

  return this
}

/**
 * remove(class1 [, class2 [, ...]]) removes the given class(es) from
 * the element.
 *
 * @param {String} ...
 * @return {Context}
 */
ClassList.prototype.remove = function () {
  var index,
      name,
      i

  for (i = 0; i < arguments.length; i += 1) {
    name = '' + arguments[i]
    index = indexOf(this, name)

    if (index < 0) continue

    arr.splice.call(this, index, 1)
  }

  this._elem.className = this.toString()

  return this
}

/**
 * contains(name) determines if the element has a given class.
 *
 * @param {String} name
 * @return {Boolean}
 */
ClassList.prototype.contains = function (name) {
  name += ''
  return indexOf(this, name) >= 0
}

/**
 * toggle(name [, force]) toggles a class. If force is a boolean,
 * this method is basically just an alias for add/remove.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {Context}
 */
ClassList.prototype.toggle = function (name, force) {
  name += ''

  if (force === true) return this.add(name)
  if (force === false) return this.remove(name)

  return this[this.contains(name) ? 'remove' : 'add'](name)
}

/**
 * toString() returns the className of the element.
 *
 * @return {String}
 */
ClassList.prototype.toString = function () {
  return arr.join.call(this, ' ')
}

},{"component-indexof":63,"trim":77}],62:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":72}],63:[function(require,module,exports){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],64:[function(require,module,exports){
(function (process){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require('_process'))
},{"./debug":65,"_process":74}],65:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":73}],66:[function(require,module,exports){
var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;

},{}],67:[function(require,module,exports){
var closest = require('./closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"./closest":66}],68:[function(require,module,exports){
'use strict'

var assert = require('assert')

module.exports = ready

function ready (callback) {
  assert.notEqual(typeof document, 'undefined', 'document-ready only runs in the browser')
  var state = document.readyState
  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0)
  }

  document.addEventListener('DOMContentLoaded', function onLoad () {
    callback()
  })
}

},{"assert":57}],69:[function(require,module,exports){
'use strict';

/**
 * Determine if a DOM element matches a CSS selector
 *
 * @param {Element} elem
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function matches(elem, selector) {
  // Vendor-specific implementations of `Element.prototype.matches()`.
  var proto = window.Element.prototype;
  var nativeMatches = proto.matches ||
      proto.mozMatchesSelector ||
      proto.msMatchesSelector ||
      proto.oMatchesSelector ||
      proto.webkitMatchesSelector;

  if (!elem || elem.nodeType !== 1) {
    return false;
  }

  var parentElem = elem.parentNode;

  // use native 'matches'
  if (nativeMatches) {
    return nativeMatches.call(elem, selector);
  }

  // native support for `matches` is missing and a fallback is required
  var nodes = parentElem.querySelectorAll(selector);
  var len = nodes.length;

  for (var i = 0; i < len; i++) {
    if (nodes[i] === elem) {
      return true;
    }
  }

  return false;
}

/**
 * Expose `matches`
 */

module.exports = matches;

},{}],70:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],71:[function(require,module,exports){
'use strict';

/**
 * Creates the region
 * @param {Object} options The following configuration options:
 * @option {String} `ariaLive`: "polite" or "assertive" (defaults to "polite")
 * @option {String} `role`: "status", "alert", or "log" (defaults to "log")
 * @option {String} `ariaRelevant`: "additions", "removals", "text", "all",
 *         or "additions text" (defaults to "additions")
 * @option {String} `ariaAtomic`: "true" or "false" (defaults to "false")
 */

function LiveRegion(options) {
  this.region = document.createElement('div');
  this.options = options || {};
  // set attrs / styles
  this.configure();
  // append it
  document.body.appendChild(this.region);
}

/**
 * configure
 * Sets attributes and offscreens the region
 */

LiveRegion.prototype.configure = function () {
  var opts = this.options;
  var region = this.region;
  // set attributes
  region.setAttribute('aria-live', opts.ariaLive || 'polite');
  region.setAttribute('role', opts.role || 'log');
  region.setAttribute('aria-relevant', opts.ariaRelevant || 'additions');
  region.setAttribute('aria-atomic', opts.ariaAtomic || 'false');

  // offscreen it
  this.region.style.position = 'absolute';
  this.region.style.width = '1px';
  this.region.style.height = '1px';
  this.region.style.marginTop = '-1px';
  this.region.style.clip = 'rect(1px, 1px, 1px, 1px)';
  this.region.style.overflow = 'hidden';
};

/**
 * announce
 * Creates a live region announcement
 * @param {String} msg The message to announce
 * @param {Number} `expire`: The number of ms before removing the announcement
 * node from the live region. This prevents the region from getting full useless
 * nodes (defaults to 7000)
 */

LiveRegion.prototype.announce = function (msg, expire) {
  var announcement = document.createElement('div');
  announcement.innerHTML = msg;
  // add it to the offscreen region
  this.region.appendChild(announcement);

  if (expire || typeof expire === 'undefined') {
    setTimeout(function () {
      this.region.removeChild(announcement);
    }.bind(this), expire || 7e3); // defaults to 7 seconds
  }
};

/**
 * Expose LiveRegion
 */

if (typeof module !== 'undefined') {
  module.exports = LiveRegion;
}

},{}],72:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],73:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],74:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],75:[function(require,module,exports){
(function (Buffer){

var assert = require('assert')

var base62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
var base36 = 'abcdefghijklmnopqrstuvwxyz0123456789'
var base10 = '0123456789'

exports = module.exports = create(base62)
exports.base62 = exports
exports.base36 = create(base36)
exports.base10 = create(base10)

exports.create = create

function create(chars) {
  assert(typeof chars === 'string', 'the list of characters must be a string!')
  var length = Buffer.byteLength(chars)
  return function rndm(len) {
    len = len || 10
    assert(typeof len === 'number' && len >= 0, 'the length of the random string must be a number!')
    var salt = ''
    for (var i = 0; i < len; i++) salt += chars[Math.floor(length * Math.random())]
    return salt
  }
}

}).call(this,require("buffer").Buffer)
},{"assert":57,"buffer":60}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (elem, centerIfNeeded, options, finalElement) {

    if (!elem) throw new Error('Element is required in scrollIntoViewIfNeeded');

    function withinBounds(value, min, max, extent) {
        if (false === centerIfNeeded || max <= value + extent && value <= min + extent) {
            return Math.min(max, Math.max(min, value));
        } else {
            return (min + max) / 2;
        }
    }

    function makeArea(left, top, width, height) {
        return { "left": left, "top": top, "width": width, "height": height,
            "right": left + width, "bottom": top + height,
            "translate": function translate(x, y) {
                return makeArea(x + left, y + top, width, height);
            },
            "relativeFromTo": function relativeFromTo(lhs, rhs) {
                var newLeft = left,
                    newTop = top;
                lhs = lhs.offsetParent;
                rhs = rhs.offsetParent;
                if (lhs === rhs) {
                    return area;
                }
                for (; lhs; lhs = lhs.offsetParent) {
                    newLeft += lhs.offsetLeft + lhs.clientLeft;
                    newTop += lhs.offsetTop + lhs.clientTop;
                }
                for (; rhs; rhs = rhs.offsetParent) {
                    newLeft -= rhs.offsetLeft + rhs.clientLeft;
                    newTop -= rhs.offsetTop + rhs.clientTop;
                }
                return makeArea(newLeft, newTop, width, height);
            }
        };
    }

    var parent,
        area = makeArea(elem.offsetLeft, elem.offsetTop, elem.offsetWidth, elem.offsetHeight);
    while ((parent = elem.parentNode) instanceof HTMLElement && elem !== finalElement) {
        var clientLeft = parent.offsetLeft + parent.clientLeft;
        var clientTop = parent.offsetTop + parent.clientTop;

        // Make area relative to parent's client area.
        area = area.relativeFromTo(elem, parent).translate(-clientLeft, -clientTop);

        var scrollLeft = withinBounds(parent.scrollLeft, area.right - parent.clientWidth, area.left, parent.clientWidth);
        var scrollTop = withinBounds(parent.scrollTop, area.bottom - parent.clientHeight, area.top, parent.clientHeight);
        if (options) {
            (0, _amator2.default)(parent, {
                scrollLeft: scrollLeft,
                scrollTop: scrollTop
            }, options);
        } else {
            parent.scrollLeft = scrollLeft;
            parent.scrollTop = scrollTop;
        }

        // Determine actual scroll amount by reading back scroll properties.
        area = area.translate(clientLeft - parent.scrollLeft, clientTop - parent.scrollTop);
        elem = parent;
    }
};

var _amator = require('amator');

var _amator2 = _interopRequireDefault(_amator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"amator":56}],77:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],78:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],79:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],80:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":79,"_process":74,"inherits":78}]},{},[1]);


/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				env.element.textContent = env.code;
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i=0, pos = 0; i<strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && p < to; ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/i,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if(Array.prototype.forEach) { // Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

!function(e){e.languages.jade={comment:{pattern:/(^([\t ]*))\/\/.*((?:\r?\n|\r)\2[\t ]+.+)*/m,lookbehind:!0},"multiline-script":{pattern:/(^([\t ]*)script\b.*\.[\t ]*)((?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,lookbehind:!0,inside:{rest:e.languages.javascript}},filter:{pattern:/(^([\t ]*)):.+((?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,lookbehind:!0,inside:{"filter-name":{pattern:/^:[\w-]+/,alias:"variable"}}},"multiline-plain-text":{pattern:/(^([\t ]*)[\w\-#.]+\.[\t ]*)((?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,lookbehind:!0},markup:{pattern:/(^[\t ]*)<.+/m,lookbehind:!0,inside:{rest:e.languages.markup}},doctype:{pattern:/((?:^|\n)[\t ]*)doctype(?: .+)?/,lookbehind:!0},"flow-control":{pattern:/(^[\t ]*)(?:if|unless|else|case|when|default|each|while)\b(?: .+)?/m,lookbehind:!0,inside:{each:{pattern:/^each .+? in\b/,inside:{keyword:/\b(?:each|in)\b/,punctuation:/,/}},branch:{pattern:/^(?:if|unless|else|case|when|default|while)\b/,alias:"keyword"},rest:e.languages.javascript}},keyword:{pattern:/(^[\t ]*)(?:block|extends|include|append|prepend)\b.+/m,lookbehind:!0},mixin:[{pattern:/(^[\t ]*)mixin .+/m,lookbehind:!0,inside:{keyword:/^mixin/,"function":/\w+(?=\s*\(|\s*$)/,punctuation:/[(),.]/}},{pattern:/(^[\t ]*)\+.+/m,lookbehind:!0,inside:{name:{pattern:/^\+\w+/,alias:"function"},rest:e.languages.javascript}}],script:{pattern:/(^[\t ]*script(?:(?:&[^(]+)?\([^)]+\))*[\t ]+).+/m,lookbehind:!0,inside:{rest:e.languages.javascript}},"plain-text":{pattern:/(^[\t ]*(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?[\t ]+).+/m,lookbehind:!0},tag:{pattern:/(^[\t ]*)(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?:?/m,lookbehind:!0,inside:{attributes:[{pattern:/&[^(]+\([^)]+\)/,inside:{rest:e.languages.javascript}},{pattern:/\([^)]+\)/,inside:{"attr-value":{pattern:/(=\s*)(?:\{[^}]*\}|[^,)\r\n]+)/,lookbehind:!0,inside:{rest:e.languages.javascript}},"attr-name":/[\w-]+(?=\s*!?=|\s*[,)])/,punctuation:/[!=(),]+/}}],punctuation:/:/}},code:[{pattern:/(^[\t ]*(?:-|!?=)).+/m,lookbehind:!0,inside:{rest:e.languages.javascript}}],punctuation:/[.\-!=|]+/};for(var t="(^([\\t ]*)):{{filter_name}}((?:\\r?\\n|\\r(?!\\n))(?:\\2[\\t ]+.+|\\s*?(?=\\r?\\n|\\r)))+",n=[{filter:"atpl",language:"twig"},{filter:"coffee",language:"coffeescript"},"ejs","handlebars","hogan","less","livescript","markdown","mustache","plates",{filter:"sass",language:"scss"},"stylus","swig"],a={},i=0,r=n.length;r>i;i++){var s=n[i];s="string"==typeof s?{filter:s,language:s}:s,e.languages[s.language]&&(a["filter-"+s.filter]={pattern:RegExp(t.replace("{{filter_name}}",s.filter),"m"),lookbehind:!0,inside:{"filter-name":{pattern:/^:[\w-]+/,alias:"variable"},rest:e.languages[s.language]}})}e.languages.insertBefore("jade","filter",a)}(Prism);