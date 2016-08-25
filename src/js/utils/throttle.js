(function () {
  'use strict';

  /**
   * Simple throttle static jQuery function
   * @param  {Object}   opts Options (see below for specifics)
   * @param  {Function} cb   The function to be invoked
   */
  jQuery.throttle = function (opts, cb) {
    if (!opts.element || !opts.event) {
      return console.warn(
        'Insufficient options provided to jQuery.throttle.  Please include element and event in the options object'
      );
    }
    // Options:
    // - element: the target element of the event
    // - event: the event type to be added as a listener on `opts.element`
    // - delay (ms): the delay in ms (defaults to 250)
    var timer;
    var delay = opts.delay || 250;

    jQuery(opts.element).on(opts.event, function (e) {
      var that = this;
      clearTimeout(timer);
      timer = setTimeout(cb.bind(that, e), delay);
    });

    return this;
  };
}());
