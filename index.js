/**
 * Deque Pattern Library entry
 */

const ready = require('document-ready');
const debug = require('debug')('dqpl:entry');

ready(() => {
  debug('document ready');

  /**
   * Initialze tabs
   */

  require('./lib/components/tabs')();

  /**
   * Initialize checkboxes
   */

  require('./lib/components/checkboxes')();
});
