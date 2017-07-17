'use strict';

// 1. Resize givin element
// 2. Happens on window resize

module.exports = (modal) => {
  const content = modal && modal.querySelector('.dqpl-modal-content');
  if (content) {
    content.style.maxHeight = `${window.innerHeight - 185}px`;
  }
};
