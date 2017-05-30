'use strict';

module.exports = (modal) => {
  const content = modal && modal.querySelector('.dqpl-modal-content');
  if (content) {
    console.log('setting max height on: ', content);
    // TODO: Where is 185 coming from?
    content.style.maxHeight = `${window.innerHeight - 185}px`;
  }
};
