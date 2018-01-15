'use strict';

import trapFocus from '../../commons/dialog/trap-focus';
import delegate from 'delegate';
import closest from 'closest';
import queryAll from '../../commons/query-all';
import focusableSelector from '../../commons/is-focusable/selector';

module.exports = () => {
  /**
   * Keydowns on alerts - trap focus
   */
  trapFocus('.dqpl-alert');
};
