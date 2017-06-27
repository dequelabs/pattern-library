'use strict';

import isSelected from '../../commons/is-selected';

module.exports = (radios) => {
  const enableds = radios.filter((r) => r.getAttribute('aria-disabled') !== 'true');
  const selecteds = enableds.filter(isSelected);
  return radios.indexOf(selecteds.length ? selecteds[0] : enableds[0]);
};
