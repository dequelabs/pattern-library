'use strict';

/**
 * Configures tabIndex and focus
 */

module.exports = (prevActive, newlyActive) => {
  prevActive.tabIndex = -1;
  newlyActive.tabIndex = 0;
  newlyActive.focus();
};
