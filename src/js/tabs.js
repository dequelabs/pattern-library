(function () {
  'use strict';

  initTabs();

  jQuery(document).on('dqpl:ready', initTabs);

  function initTabs() {
    jQuery('.code-tabs').a11yTabs({
			tabSelector: 'li.tab',
			panelSelector: '.panel',
			activeClass: 'dqpl-tab-active',
			panelShow: function (panel) {
				jQuery(panel).removeClass('dqpl-hidden');
			},
			panelHide: function (panel) {
				jQuery(panel).addClass('dqpl-hidden');
			}
		});
  }
}());
