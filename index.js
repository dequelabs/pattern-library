/**
 * Deque Pattern Library entry
 */

const ready = require('document-ready');
const Tabs = require('./lib/components/tabs');
const debug = require('debug')('dqpl:entry');

ready(() => {
  debug('document ready');
  
  /**
   * Initialze tabs
   */
  new Tabs();
});
