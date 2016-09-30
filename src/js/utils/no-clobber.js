(function () {
  'use strict';

  jQuery.fn.noClobber = function ($refElement, attr) {
    attr = attr || 'aria-describedby'; // default to aria-describedby
    return this.each(function (_, target) {
      noClobber(jQuery(target), $refElement.rndid(), attr);
    });
  };

  function noClobber($target, $ref, attr) {
    var existingVal = $target.attr(attr) || '';
    // prevent duplicates
    if (existingVal.indexOf($ref.prop('id')) === -1) {
      $target.attr(attr, [existingVal, $ref.prop('id')].join(' ').trim());
    }
  }
}());
