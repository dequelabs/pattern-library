'use strict';

import trapFocus from '../../commons/dialog/trap-focus';

module.exports = () => {
  /**
   * Keydowns on alerts - trap focus
   */
  trapFocus('.dqpl-alert');
};
