'use strict';

import Classlist from 'classlist';
import delegate from 'delegate';

module.exports = () => {
  delegate(document.body, '.dqpl-pointer-wrap', 'keydown', (e) => {
    const which = e.which;
    const wrap = e.delegateTarget;

    if (which === 27) {
      Classlist(wrap).add('dqpl-hidden');
    }
  });

  delegate(document.body, '.dqpl-ftpo-dismiss', 'click', (e) => {
    const closeBtn = e.delegateTarget;
    const pointer = closeBtn.closest('.dqpl-pointer-wrap');

    Classlist(pointer).add('dqpl-hidden');
  });


};
