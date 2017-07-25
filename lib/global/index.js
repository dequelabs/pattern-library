'use strict';

/**
 * Invoke all globals here
 * (globals are shared pieces of code between multiple components/composites)
 */

module.exports = () => {
  /*
   * Dialog handles click listeners for the modal and alert.
   */
  require('./dialog')();
};
