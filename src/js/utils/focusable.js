(function () {
  /**
   * Get all focusable children (optionally "direct"
   * children) from the list.
   *
   * @param {Boolean} direct
   * @return {jQuery}
   * @api public
   */

  jQuery.fn.focusable = function (direct, naturally) {
    var $children = direct ?
      this.children() :
      this.find('*');
    var $filtered = $children.filter(function(_, el){
      var tabindex = jQuery.attr(el, 'tabindex');
      var is = focusable(el, !isNaN(tabindex));
      return is;
    });
    return (naturally) ?
      $filtered.filter(function () {
        return !jQuery(this).is('[tabindex="-1"]');
      }) :
      $filtered;
  };


  /*!
   *
   * Below code is copyrighted by the jQuery Foundation (MIT).
   *
   * See:
   *
   *  - https://github.com/jquery/jquery-ui/blob/1.11.3/ui/core.js#L87-L114
   *  - https://github.com/jquery/jquery-ui/blob/1.11.3/LICENSE.txt
   *  - https://jquery.org/license/#source-code
   *
   */

  function focusable( element, isTabIndexNotNaN ) {
    var map, mapName, img,
      nodeName = element.nodeName.toLowerCase();
    if ( "area" === nodeName ) {
      map = element.parentNode;
      mapName = map.name;
      if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
        return false;
      }
      img = jQuery( "img[usemap='#" + mapName + "']" )[ 0 ];
      return !!img && visible( img );
    }

    return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
      !element.disabled :
      "a" === nodeName ?
        !!element.href || isTabIndexNotNaN :
        isTabIndexNotNaN) &&
      // the element and all of its ancestors must be visible
      visible( element );
  }

  function visible( element ) {
    if(element.getAttribute('xlink:href')) return true;
    return jQuery.expr.filters.visible( element ) &&
      !jQuery( element ).parents().addBack().filter(function() {
        return jQuery.css( this, "visibility" ) === "hidden";
      }).length;
  }
}());
