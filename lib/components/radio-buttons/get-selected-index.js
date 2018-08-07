'use strict';

import isSelected from '../../commons/is-selected';

module.exports = (radios) => {
  const enableds = radios.filter((r) => r.getAttribute('aria-disabled') !== 'true');
  const selecteds = radios.filter(isSelected);
  // attempt to use the selected radio (regardless of enabled state)
  // defaulting to the first enabled radio (if none in the group are selected)
  return radios.indexOf(selecteds.length ? selecteds[0] : enableds[0]);
};
