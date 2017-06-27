'use strict';

import Cl from 'classlist';

module.exports = (el) => {
  return Cl(el).contains('dqpl-selected') || el.getAttribute('aria-checked') === 'true';
};
