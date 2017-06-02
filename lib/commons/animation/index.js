'use strict';

// TODO: transitionstart + transitionend could be utilized

const Classlist = require('classlist');
const debug = require('debug')('dqpl:commons:animation');
// these should correspond with the css class's animation time (ms)
const defaults = {
  slideDown: 300,
  slideUp: 300,
  fadeIn: 300,
  fadeOut: 300
};

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
exports.animate = (target, config, cb) => {
  config = config || {};
  cb = cb || function(){};

  if (!target) {
    return debug('Cannot call animation.animate without a target element');
  } if (!config.setupClass || !config.animateClass) {
    return debug('Cannot call animation.animate without providing setupClass and animateClass');
  }

  const list = Classlist(target);
  const method = config.method || 'add';
  const duration = config.duration || 400;
  list[method](config.setupClass);
  setTimeout(() => {
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
exports.slideDown = (target, cb, duration) => {
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
exports.slideUp = (target, cb, duration) => {
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
exports.slideToggle = (target, cb, duration) => {
  exports[
    Classlist(target).contains('dqpl-slidedown') ? 'slideUp' : 'slideDown'
  ](target, cb, duration);
};


/**
 * fadeIn
 * @param  {HTMLElement}   target   the target of the fade out
 * @param  {Function} cb       function to be invoked once animation is complete
 * @param  {Number}   duration duration of animation in ms
 */
exports.fadeIn = (target, cb, duration) => {
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
exports.fadeOut = (target, cb, duration) => {
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
exports.fadeToggle = (target, cb, duration) => {
  exports[
    Classlist(target).contains('dqpl-fadein') ? 'fadeOut' : 'fadeIn'
  ](target, cb, duration);
};
