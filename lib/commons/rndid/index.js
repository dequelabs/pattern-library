'use strict';

const rndm = require('rndm');

/**
 * Returns a unique dom element id
 */
function rndid(len) {
  len = len || 8;
  const id = rndm(len);

  if (document.getElementById(id)) {
    return rndid(len);
  }

  return id;
}

module.exports = rndid;
