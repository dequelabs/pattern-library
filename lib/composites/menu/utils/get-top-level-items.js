'use strict';

const isVisible = require('../../../commons/is-visible');

module.exports = (ul, visible) => {
  if (!ul) { return []; }

  return Array.prototype.slice.call(ul.children)
    .filter((c) => c.getAttribute('role') === 'menuitem')
    .filter((c) => visible ? isVisible(c) : true);
};
