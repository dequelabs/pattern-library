/**
 * Deque Pattern Library entry
 */

const ready = require('document-ready');
const debug = require('debug')('dqpl:entry');

ready(() => {
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
});
