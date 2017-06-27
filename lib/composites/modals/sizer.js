'use strict';

module.exports = (modal) => {
  const content = modal && modal.querySelector('.dqpl-modal-content');
  if (content) {
    content.style.maxHeight = `${window.innerHeight - 185}px`;
  }
};
