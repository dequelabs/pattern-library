'use strict';

const rndm = require('rndm');

module.exports = rndid;

function rndid(len) {
  len = len || 8;
  const id = rndm(len);
  if (document.getElementById(id)) { return rndid(len); }

  return id;
}
