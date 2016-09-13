(function () {
  'use strict';

  jQuery.fn.noClobber = function ($refElement, attr) {
    attr = attr || 'aria-describedby';
    return this.each(function (_, target) {
      noClobber(jQuery(target), $refElement, attr);
    });
  };

  function noClobber($target, $ref, attr) {
    var existingVal = $target.attr(attr);
    // ensure it has an id
    if (!$ref.prop('id')) {
      $ref.rndid();
    }
    var attrVal = existingVal ?
      [existingVal, $ref.prop('id')].join(' ') :
      $ref.prop('id');
    $target.attr(attr, attrVal);
  }
}());
