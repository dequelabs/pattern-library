'use strict';

module.exports = (el) => {
  const content = el && el.querySelector('.dqpl-content');
  if (content) {
    content.style.maxHeight = `${window.innerHeight - 185}px`;
  }
};
