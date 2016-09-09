(function () {
  'use strict';

  jQuery.fn.rndid = function () {
    return this.each(function (_, el) {
      var uniqueId = rndid();
      jQuery(el).prop('id', uniqueId);
    });
  };

  /**
	 * https://github.com/stephenmathieson/rndid
	 * Return a guaranteed unique id of the provided
	 * `length`, optionally prefixed with `prefix`.
	 *
	 * If no length is provided, will use
	 * `rndid.defaultLength`.
	 *
	 * @api private
	 * @param {String} [prefix]
	 * @param {Number} [length]
	 * @return {String}
	 */

	function rndid() {
		var id = str(7);
		if (document.getElementById(id)) { return rndid(); }
		return id;
	}

	/**
	 * Generate a random alpha-char.
	 *
	 * @api private
	 * @return {String}
	 */

	function character() {
		return String.fromCharCode(Math.floor(Math.random() * 25) + 97);
	}

	/**
	 * Generate a random alpha-string of `len` characters.
	 *
	 * @api private
	 * @param {Number} len
	 * @return {String}
	 */

	function str(len) {
		for (var i = 0, s = ''; i < len; i++) { s += character(); }
		return s;
	}
}());
