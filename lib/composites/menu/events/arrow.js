'use strict';

const activate = require('../utils/activate');

module.exports = (items, target, dir) => {
  const isNext = dir === 'next';
  const currentIdx = items.indexOf(target);
  let adjacent = items[isNext ? currentIdx + 1 : currentIdx - 1];
  // circularity
  if (!adjacent) {
    adjacent = items[isNext ? 0 : items.length - 1];
  }

  activate(target, adjacent);
};
