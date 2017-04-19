
/*global jQuery*/
;(function($){
  'use strict';

  var defaults = {
    tabSelector: 'li', // qualified within `this`
    panelSelector: '.panels li', // qualified within document
    activeClass: 'active', // also used for finding the initially active panel
    inactiveClass: null,
    panelShow: function (panel) {
      panel.style.display = 'block';
    },
    panelHide: function (panel) {
      panel.style.display = 'none';
    }
  };

  /**
   * Fixes tabs
   * @param  {Object} userOpts the user's options
   * @return {jQuery} this     (allow it to be chainable)
   */
  $.fn.a11yTabs = function (userOpts) {
    var options = $.extend(options, defaults, userOpts);
    return this.each(function (_, container) {
      a11yTabs($(container), options);
    });
  };
})(jQuery);

function a11yTabs($container, options) {
  if (!options.tabSelector || !options.panelSelector) {
    throw new Error('Missing required options!');
  }

  var $tabs = $container.find(options.tabSelector);
  var $panels = $(options.panelSelector);

  /**
   * Attributes
   */

  $container.attr('role', 'tablist');

  // ensure each panel and each tab has a unique id
  $tabs.add($panels).each(setId);

  $tabs.each(function (i, tab) {
    var isSelected = false;
    var $tab = $(tab);
    var $thisPanel = $panels.eq(i);

    // determine the initially active tab (based on activeClass)
    if (options.activeClass && $tab.hasClass(options.activeClass)) {
      isSelected = true;
    }

    $tab.attr({
      'tabIndex': (isSelected) ? 0 : -1, // leveraging jQuery's propFix
      'role': 'tab',
      'aria-selected': isSelected,
      'aria-owns': $thisPanel.prop('id')
    });
  });


  $panels.each(function (i, panel) {
    var $panel = $(panel);
    var $tab = $tabs.eq(i);
    // associate `panel` with it's tab
    noClobber(panel, $tab, 'aria-labelledby');
    $panel.attr({
      'tabIndex': -1,
      'role': 'tabpanel',
      'aria-hidden': $tab.attr('aria-selected') !== 'true'
    });
  });


  /**
   * Events
   */

  $panels.on('keydown', function (e) {
    var $panel = $(this);
    if (e.which === 33) { // PAGE UP
      e.preventDefault();
      // focus the associated tab
      $('[aria-owns="' + $panel.prop('id') + '"]').focus();
    }
  });

  $tabs.off('keydown.a11yTabs');
  $tabs.on('keydown.a11yTabs', function (e) {
    var $tab = $(this);
    var which = e.which;

    switch (which) {
      case 37:
      case 38:
        e.preventDefault();
        switchTab('prev', this, $tabs, $panels, options);
        break;
      case 39:
      case 40:
        e.preventDefault();
        switchTab('next', this, $tabs, $panels, options);
        break;
      case 34: // page down
        e.preventDefault();
        // focus the panel
        $('#' + $tab.attr('aria-owns')).focus();
    }
  });

  $tabs.off('click.a11yTabs');
  $tabs.on('click.a11yTabs', function () {
    var $tab = $(this);
    activateTab($tab, $tabs, $panels, options);
  });
}

function switchTab(dir, tab, $tabs, $panels, options) {
  var index = $.inArray(tab, $tabs);

  if (index === -1) { return; }

  var newIndex = (dir === 'prev') ? index - 1 : index + 1;

  // circularity
  if (newIndex === -1) {
    newIndex = $tabs.length - 1; // the last tab
  } else if (newIndex === $tabs.length) {
    newIndex = 0;
  }

  activateTab($tabs.eq(newIndex), $tabs, $panels, options);
}

function activateTab($newTab, $tabs, $panels, opts) {
  var tabIdx = $.inArray($newTab[0], $tabs);
  var $newPanel = $panels.eq(tabIdx);

  // clean up:
  $panels.attr('aria-hidden', true);

  $tabs.attr({
    'aria-selected': false,
    'tabIndex': -1
  });

  if (opts.panelHide) {
    $panels.each(function () {
      opts.panelHide(this);
    });
  }

  if (opts.inactiveClass) {
    $tabs.addClass(opts.inactiveClass);
    $newTab.removeClass(opts.inactiveClass);
  }


  // activate new one
  $newTab.attr('aria-selected', true);
  $newPanel.attr('aria-hidden', false);

  if (opts.panelShow) {
    opts.panelShow($newPanel[0]);
  }

  if (opts.activeClass) {
    $tabs.removeClass(opts.activeClass);
    $newTab.addClass(opts.activeClass);
  }

  $newTab.prop('tabIndex', 0).focus();
}

function setId(_, element) {
  if (element.id) { return; } // if it already has an id
  element.id = rndid();
}


function noClobber(target, $describer, attr) {
  var value = target.getAttribute(attr);
  value = (value && value.length) ?
    value + ' ' + $describer.prop('id') :
    $describer.prop('id');

  target.setAttribute(attr, value);
}


/**
 * https://github.com/stephenmathieson/rndid
 */
function rndid(length) {
  length = length || 7;
  var id = str(length);
  if (document.getElementById(id)){
    return rndid(length);
  }
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
  for (var i = 0, s = ''; i < len; i++) s += character();
  return s;
}

/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				env.element.textContent = env.code;
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i=0, pos = 0; i<strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && p < to; ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/i,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if(Array.prototype.forEach) { // Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

!function(e){e.languages.jade={comment:{pattern:/(^([\t ]*))\/\/.*((?:\r?\n|\r)\2[\t ]+.+)*/m,lookbehind:!0},"multiline-script":{pattern:/(^([\t ]*)script\b.*\.[\t ]*)((?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,lookbehind:!0,inside:{rest:e.languages.javascript}},filter:{pattern:/(^([\t ]*)):.+((?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,lookbehind:!0,inside:{"filter-name":{pattern:/^:[\w-]+/,alias:"variable"}}},"multiline-plain-text":{pattern:/(^([\t ]*)[\w\-#.]+\.[\t ]*)((?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,lookbehind:!0},markup:{pattern:/(^[\t ]*)<.+/m,lookbehind:!0,inside:{rest:e.languages.markup}},doctype:{pattern:/((?:^|\n)[\t ]*)doctype(?: .+)?/,lookbehind:!0},"flow-control":{pattern:/(^[\t ]*)(?:if|unless|else|case|when|default|each|while)\b(?: .+)?/m,lookbehind:!0,inside:{each:{pattern:/^each .+? in\b/,inside:{keyword:/\b(?:each|in)\b/,punctuation:/,/}},branch:{pattern:/^(?:if|unless|else|case|when|default|while)\b/,alias:"keyword"},rest:e.languages.javascript}},keyword:{pattern:/(^[\t ]*)(?:block|extends|include|append|prepend)\b.+/m,lookbehind:!0},mixin:[{pattern:/(^[\t ]*)mixin .+/m,lookbehind:!0,inside:{keyword:/^mixin/,"function":/\w+(?=\s*\(|\s*$)/,punctuation:/[(),.]/}},{pattern:/(^[\t ]*)\+.+/m,lookbehind:!0,inside:{name:{pattern:/^\+\w+/,alias:"function"},rest:e.languages.javascript}}],script:{pattern:/(^[\t ]*script(?:(?:&[^(]+)?\([^)]+\))*[\t ]+).+/m,lookbehind:!0,inside:{rest:e.languages.javascript}},"plain-text":{pattern:/(^[\t ]*(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?[\t ]+).+/m,lookbehind:!0},tag:{pattern:/(^[\t ]*)(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?:?/m,lookbehind:!0,inside:{attributes:[{pattern:/&[^(]+\([^)]+\)/,inside:{rest:e.languages.javascript}},{pattern:/\([^)]+\)/,inside:{"attr-value":{pattern:/(=\s*)(?:\{[^}]*\}|[^,)\r\n]+)/,lookbehind:!0,inside:{rest:e.languages.javascript}},"attr-name":/[\w-]+(?=\s*!?=|\s*[,)])/,punctuation:/[!=(),]+/}}],punctuation:/:/}},code:[{pattern:/(^[\t ]*(?:-|!?=)).+/m,lookbehind:!0,inside:{rest:e.languages.javascript}}],punctuation:/[.\-!=|]+/};for(var t="(^([\\t ]*)):{{filter_name}}((?:\\r?\\n|\\r(?!\\n))(?:\\2[\\t ]+.+|\\s*?(?=\\r?\\n|\\r)))+",n=[{filter:"atpl",language:"twig"},{filter:"coffee",language:"coffeescript"},"ejs","handlebars","hogan","less","livescript","markdown","mustache","plates",{filter:"sass",language:"scss"},"stylus","swig"],a={},i=0,r=n.length;r>i;i++){var s=n[i];s="string"==typeof s?{filter:s,language:s}:s,e.languages[s.language]&&(a["filter-"+s.filter]={pattern:RegExp(t.replace("{{filter_name}}",s.filter),"m"),lookbehind:!0,inside:{"filter-name":{pattern:/^:[\w-]+/,alias:"variable"},rest:e.languages[s.language]}})}e.languages.insertBefore("jade","filter",a)}(Prism);
(function () {
  'use strict';

  jQuery.fn.rndid = function () {
    return this.each(function (_, el) {
      if (!jQuery(el).prop('id')) {
        var uniqueId = rndid();
        jQuery(el).prop('id', uniqueId);
      }
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

(function () {
  'use strict';

  /**
   * Simple throttle static jQuery function
   * @param  {Object}   opts Options (see below for specifics)
   * @param  {Function} cb   The function to be invoked
   */
  jQuery.throttle = function (opts, cb) {
    if (!opts.element || !opts.event) {
      return console.warn(
        'Insufficient options provided to jQuery.throttle.  Please include element and event in the options object'
      );
    }
    // Options:
    // - element: the target element of the event
    // - event: the event type to be added as a listener on `opts.element`
    // - delay (ms): the delay in ms (defaults to 250)
    var timer;
    var delay = opts.delay || 250;

    jQuery(opts.element).on(opts.event, function (e) {
      var that = this;
      clearTimeout(timer);
      timer = setTimeout(cb.bind(that, e), delay);
    });

    return this;
  };
}());

(function() {
  'use strict';

  checkboxHandler();

  jQuery(document).on('dqpl:ready', checkboxHandler);

  /**
   * Converts [class="dqpl-checkbox"] elements into custom checkboxes.
   *
   * - If default checked state is desired, add the "dqpl-selected" class
   * or simply add aria-checked="true".
   *
   * - To enable or disable a custom checkbox, trigger the "dqpl:checkbox:enable"
   * or "dqpl:checkbox:disable" event on the checkbox element (using jQuery#trigger)
   *
   * - It retrieves the label based on "data-label-id" attribute OR simply a
   * label (with "dqpl-label" or "dqpl-label-inline" class) within the checkbox's
   * wrapper (with "dqpl-field-wrap" or "dqpl-checkbox-wrap" class)
   */
  function checkboxHandler() {
    var $checkboxes = jQuery('.dqpl-checkbox');

    $checkboxes
      .each(function (_, box) {
        var $checkbox = jQuery(box);
        var isSel = isSelected($checkbox);
        var isDis = isDisabled($checkbox);

        if ($checkbox.attr('role') !== 'checkbox') {
          console.warn('role="checkbox" missing from the following element: ', box);
        }

        // add the inner element (that holds the icon)
        var iconClass = isSel ? 'fa-check-square' : 'fa-square-o';
        iconClass = isDis ? 'fa-square' : iconClass;
        $checkbox.append(jQuery('<div class="dqpl-inner-checkbox fa ' + iconClass + '" aria-hidden="true" />'));

        $checkbox
          .prop('tabIndex', 0)
          .attr('aria-checked', isSel);

        /**
         * Label
         * - found via data-label-id OR within container (dqpl-field-wrap or dqpl-checkbox-wrap)
         * - clicks on label will focus/click the checkbox
         */
        var $label = getLabelElement($checkbox);
        if (isDis) { $label.addClass('dqpl-label-disabled'); }
        $label
          .off('click.dqplCheckbox')
          .on('click.dqplCheckbox', function () {
            $checkbox.trigger('click').focus();
          });

        /**
         * Expose event for disabling/enabling checkboxes
         * example:
         * 	$myjQueryCheckboxRef.trigger('dqpl:checkbox:disable')
         * 	$myjQueryCheckboxRef.trigger('dqpl:checkbox:enable')
         */
        $checkbox
          .off('dqpl:checkbox:disable')
          .on('dqpl:checkbox:disable', function () {
            $checkbox.attr('aria-disabled', 'true');
            $checkbox
              .find('.dqpl-inner-checkbox')
                .removeClass('fa-check-square')
                .removeClass('fa-square-o')
                .addClass(isSelected($checkbox) ? 'fa-check-square' : 'fa-square');

            $label.addClass('dqpl-label-disabled');
          })
          .off('dqpl:checkbox:enable')
          .on('dqpl:checkbox:enable', function () {
            $checkbox.removeAttr('aria-disabled');
            $checkbox
              .find('.dqpl-inner-checkbox')
                .removeClass('fa-check-square')
                .removeClass('fa-square-o')
                .removeClass('fa-square')
                .addClass(isSelected($checkbox) ? 'fa-check-square' : 'fa-square-o');

            $label.removeClass('dqpl-label-disabled');
          });
      })
      .off('keydown.dqplCheckbox')
      .on('keydown.dqplCheckbox', function (e) {
        var $box = jQuery(this);
        if (e.which === 32) {
          e.preventDefault();
          e.target.click();
        }
      })
      .off('click.dqplCheckbox')
      .on('click.dqplCheckbox', function () {
        toggleSelected(jQuery(this));
      });
  }

  function toggleSelected($checkbox) {
    if (isDisabled($checkbox)) { return; }
    var wasSelected = $checkbox.attr('aria-checked') === 'true';

    $checkbox
      .attr('aria-checked', !wasSelected)
      .find('.dqpl-inner-checkbox')
        .removeClass('fa-check-square fa-square-o')
        .addClass(wasSelected ? 'fa-square-o' : 'fa-check-square');
  }

  function isDisabled($checkbox) {
    return $checkbox.is('[disabled], [aria-disabled="true"]');
  }

  function isSelected($checkbox) {
    return $checkbox.hasClass('dqpl-selected') || $checkbox.attr('aria-checked') === 'true';
  }

  function getLabelElement($checkbox) {
    var dataLabelId = $checkbox.attr('data-label-id');
    if (dataLabelId) {
      return jQuery(['#', dataLabelId].join(''));
    } else {
      return $checkbox
        .closest('.dqpl-field-wrap, .dqpl-checkbox-wrap')
          .first()
            .find('.dqpl-label, .dqpl-label-inline');
    }
  }
}());

(function() {
  'use strict';

  helpHandler();

  jQuery(document).on('dqpl:ready', helpHandler);

  function helpHandler() {
    jQuery('.dqpl-help-button, .dqpl-button-definition').each(helpInit);
  }

  function helpInit(_, helpBtn) {
    var $btn = jQuery(helpBtn);
    var tipText = $btn.attr('data-help-text');

    // generate tooltip
    var $tip = tooltip(tipText);

    // insert it into the DOM
    var $wrap = $btn.closest('.dqpl-help-button-wrap, .dqpl-definition-button-wrap');

    if (!$wrap.length) {
      var wrapper = $btn.is('.dqpl-help-button') ? '.dqpl-help-button-wrap' : '.dqpl-definition-button-wrap';
      console.warn('Unable to generate tooltip without a `' + wrapper + '` wrapper for: ', $btn);
      return;
    }

    $wrap.append($tip);

    // associate trigger with tip
    $btn.noClobber($tip);

    // events
    $btn
      .off('focus.dqpl')
      .off('mouseover.dqpl')
      .off('blur.dqpl')
      .off('mouseout.dqpl')
      .on('focus.dqpl mouseover.dqpl', function () {
        $tip.addClass('dqpl-tip-active');
      })
      .on('blur.dqpl mouseout.dqpl', function () {
        $tip.removeClass('dqpl-tip-active');
      });
  }

  function tooltip(txt) {
    var $tip = jQuery('<div />');
    $tip
      .attr('role', 'tooltip')
      .text(txt)
      .addClass('dqpl-tooltip');

    return $tip;
  }
}());

(function () {
  'use strict';

  jQuery(document)

    /**
     * Clicks on the document (outside of a dropdown or
     * trigger) should close all expanded options menus
     */

    .on('click', function (e) {
      var $target = jQuery(e.target);
      var selector = '.dqpl-options-menu, .dqpl-options-menu-trigger';
      if (!isOrWithin($target, selector)) {
        // collapse all menus...
        jQuery(selector).attr('aria-expanded', 'false');
      }
    })

    /**
     * Clicks on triggers
     */

    .on('click', '.dqpl-options-menu-trigger', function () {
      var $trigger = jQuery(this);
      var dropdownID = $trigger.attr('aria-controls');
      var $dropdown = jQuery('#' + dropdownID);
      var wasExpanded = $trigger.attr('aria-expanded') === 'true';
      // collapse all other menus...
      cleanUp($trigger, $dropdown);
      // toggle expanded
      $trigger.attr('aria-expanded', !wasExpanded);
      // this is what actually toggle the visibility too (css)
      $dropdown.attr('aria-expanded', !wasExpanded);

      if (!wasExpanded) { // its now open...
        // focus the first item
        $dropdown.find('[role="menuitem"]').first().focus();
      }
    })

    /**
     * Keydowns on triggers
     */

    .on('keydown', '.dqpl-options-menu-trigger', function (e) {
      if (e.which === 40) {
        e.preventDefault();
        jQuery(this).trigger('click');
      }
    })

    /**
     * Keydowns on options menuitems
     */

    .on('keydown', '.dqpl-options-menu [role="menuitem"]', function (e) {
      var which = e.which;
      var $this = jQuery(this);
      if (which === 38 || which === 40) {
        e.preventDefault();
        adjacentItem($this, which === 38 ? 'up' : 'down');
      } else if (which === 27) {
        // find the trigger and click/focus it
        var $thisDropdown = $this.closest('[role="menu"]');
        var id = $thisDropdown.prop('id');
        var $thisTrigger = jQuery('.dqpl-options-menu-trigger[aria-controls="' + id + '"]');
        $thisTrigger.trigger('click').focus();
      } else if (which === 13 || which === 32) {
        e.preventDefault();
        $this.trigger('click');
      }
    })

    /**
     * Clicks on options menuitems
     *
     * (If theres a link in it, click it)
     */

    .on('click', '.dqpl-options-menu [role="menuitem"]', function () {
      var $link = jQuery(this).find('a');
      if ($link.length) {
        $link[0].click();
      }
    })

    /**
     * Clicks on links within options menuitems
     *
     * In case its for whatever reason an internal link - prevent inifinite loop
     * (This click would bubble up to the menuitem which would trigger a click
     * on this link which would bubble up and repeat itself infinitely)
     */

    .on('click', '.dqpl-options-menu [role="menuitem"] a', function (e) {
      e.stopPropagation();
    });

  /**
   * Finds and focuses the adjacent menu item based on `dir`
   * @param  {jQuery} $target The currently focused item
   * @param  {String} dir     The direction ("up" or "down")
   */

  function adjacentItem($target, dir) {
    var isDown = dir === 'down';
    var $dropdown = $target.closest('[role="menu"]');
    var $items = $dropdown.find('[role="menuitem"]').filter(':visible').filter(isEnabled);
    var currentIndex = jQuery.inArray($target[0], $items);
    var adjacentIndex = isDown ? currentIndex + 1 : currentIndex - 1;

    if (isDown && adjacentIndex === $items.length) {
      adjacentIndex = 0;
    } else if (!isDown && adjacentIndex === -1) {
      adjacentIndex = $items.length - 1;
    }

    $items.eq(adjacentIndex).focus();
  }

  /**
   * Used to filter out disabled items
   */

  function isEnabled(_, item) {
    return !jQuery(item).is('[aria-disabled]');
  }

  /**
   * Determines if `$target` is, or is within element(s)
   * @param {jQuery} $target The element in question
   * @param {String} sel     The selector
   */

  function isOrWithin($target, sel) {
    return $target.is(sel) || !!$target.closest(sel).length;
  }

  /**
   * Collapses all menus/triggers other than those passed in
   */

  function cleanUp($trigger, $menu) {
    jQuery('.dqpl-options-menu, .dqpl-options-menu-trigger')
      .filter(function () {
        return this !== $trigger[0] && this !== $menu[0];
      })
      .attr('aria-expanded', 'false');
  }
}());

(function() {
  'use strict';

  initRadios();

  jQuery(document).on('dqpl:ready', initRadios);


  /**
   * NOTE: data-label-id should only be used if the element is already proplery labelled
   * (with aria-label, offscreen text, or aria-labelledby)
   */
  function initRadios() {
    // custom radios must be a child of a `dqpl-radio-group` element.
    var $radioGroups = jQuery('.dqpl-radio-group');

    $radioGroups.each(radioGroupHandler);

    function radioGroupHandler(i, group) {
      var $radioGroup = jQuery(group);
      var $radios = $radioGroup.find('.dqpl-radio');
      var $selectedRadio = $radios
        .filter('.dqpl-selected, [aria-checked="true"]')
        .filter(':not([aria-disabled="true"])');
      var $firstNonDisabled = $radios.filter(function () {
        return jQuery(this).attr('aria-disabled') !== 'true';
      }).first();
      var selectedIndex = ($selectedRadio.length) ?
        jQuery.inArray($selectedRadio[0], $radios) :
        jQuery.inArray($firstNonDisabled[0], $radios); // the first non-disabled

      // attributes/props
      $radios.each(function (i, radio) {
        var $radio = jQuery(radio);
        var isSelected = i === selectedIndex;
        $radio.prop('tabIndex', isSelected ? 0 : -1);
        $radio.attr({
          'aria-checked': isSelected ? true : false,
          'aria-setsize': $radios.length,
          'aria-posinset': i + 1
        });

        if ($radio.attr('role') !== 'radio') {
          console.warn('role="radio" missing from the following element: ', radio);
        }

        // add the inner circle (fa)
        var $inner = $radio.find('.dqpl-inner-radio');
        if (!$inner.length) {
          $inner = jQuery('<span aria-hidden="true" />');
          $radio.append($inner);
        }
        var iconClass = isSelected ? 'fa fa-dot-circle-o' : 'fa fa-circle-o';
        iconClass = isDisabled($radio) ? 'fa fa-circle' : iconClass;
        $inner
          .removeClass('fa-dot-circle-o fa-circle-o fa-circle')
          .addClass(iconClass)
          .addClass('dqpl-inner-radio');


        // label clicks
        var $label = getLabelElement($radio);
        if (!$label.length) {
          var how = '(via "data-label-id" attribute or .dqpl-label element within .dqpl-radio-wrap or .dqpl-field-wrap)';
          console.warn('Unable to calculate label ' + how + ' for: ', radio);
        }
        $label
          .off('click.dqplRadio')
          .on('click.dqplRadio', function () {
            $radio.trigger('click').focus();
          });

        $radio
          .off('dqpl:radio:disable')
          .on('dqpl:radio:disable', function () {
            $radio.attr('aria-disabled', 'true');
            $inner
              .removeClass('fa-dot-circle-o')
              .removeClass('fa-circle-o')
              .addClass(
                $radio.attr('aria-checked') === 'true' ? 'fa-dot-circle-o' : 'fa-circle'
              );

            $label.addClass('dqpl-label-disabled');
          })
          .off('dqpl:radio:enable')
          .on('dqpl:radio:enable', function () {
            $radio.removeAttr('aria-disabled');
            $inner
              .removeClass('fa-circle')
              .removeClass('fa-dot-circle-o')
              .removeClass('fa-circle-o')
              .addClass(
                $radio.attr('aria-checked') === 'true' ? 'fa fa-dot-circle-o' : 'fa fa-circle-o'
              );

              $label.removeClass('dqpl-label-disabled');
          });
      });

      // events
      $radioGroup
        .off('click.dqplRadioGroup')
        .on('click.dqplRadioGroup', '[role="radio"]', function () {
          var $radio = jQuery(this);
          if ($radio.attr('aria-disabled') === 'true') { return; }
          selectHandler($radios, $radio.focus());
        })
        .off('keydown.dqplRadio')
        .on('keydown.dqplRadio', '[role="radio"]', function (e) {
          var which = e.which;
          var $target = jQuery(e.target);

          if (isDisabled($target)) { return; }

          switch (which) {
            case 32:
              e.preventDefault();
              $target.click();
              break;
            case 37:
            case 38:
              e.preventDefault();
              arrowHandler($target, $radios, 'prev');
              break;
            case 39:
            case 40:
              e.preventDefault();
              arrowHandler($target, $radios, 'next');
              break;
          }
        });
    }
  }

  function selectHandler($radios, $newlySelected) {
    $radios
      .each(function (_, radio) {
        var $radio = jQuery(radio);
        var isNewlySelected = radio === $newlySelected[0];
        $radio
          .prop('tabIndex', isNewlySelected ? 0 : -1)
          .attr('aria-checked', isNewlySelected)
          .toggleClass('dqpl-selected')
          .find('.dqpl-inner-radio')
            .removeClass('fa-dot-circle-o')
            .addClass('fa-circle-o');
      });
    $newlySelected.find('.dqpl-inner-radio').addClass('fa-dot-circle-o');
  }


  function arrowHandler($target, $radios, direction) {
    if ($radios.filter(nonDisabled).length <= 1) { return; }

    var isNext = direction === 'next';
    var currentIndex = jQuery.inArray($target[0], $radios);
    var adjacentIndex = getAdjacentIndex(isNext, currentIndex, $radios);
    var $adjacentRadio = $radios.eq(adjacentIndex);

    while ($adjacentRadio.length && $adjacentRadio.attr('aria-disabled') === 'true') {
      adjacentIndex = getAdjacentIndex(isNext, adjacentIndex, $radios);
      $adjacentRadio = $radios.eq(adjacentIndex);
    }

    selectHandler($radios, $adjacentRadio.focus());
  }

  function getAdjacentIndex(isNext, currentIndex, $radios) {
    var adjacentIndex = isNext ? currentIndex + 1 : currentIndex - 1;
    // first or last (circularity)
    adjacentIndex = (adjacentIndex < 0 && !isNext) ? $radios.length - 1 : adjacentIndex;
    adjacentIndex = (adjacentIndex === $radios.length && isNext ) ? 0 : adjacentIndex;
    return adjacentIndex;
  }

  function getLabelElement($radio) {
    var dataLabelId = $radio.attr('data-label-id');
    if (dataLabelId) {
      return jQuery(['#', dataLabelId].join(''));
    } else {
      return $radio
        .closest('.dqpl-field-wrap, .dqpl-radio-wrap')
          .first()
            .find('.dqpl-label, .dqpl-label-inline');
    }
  }

  function isDisabled($radio) {
    return $radio.is('[disabled], [aria-disabled="true"]');
  }

  function nonDisabled(_, radio) {
    return jQuery(radio).attr('aria-disabled') !== 'true';
  }

}());

(function () {
  'use strict';
  var TYPE_TIME = 600;

  initSelects();

  jQuery(document).on('dqpl:ready', initSelects);

  function initSelects() {
    jQuery('.dqpl-combobox').each(function (_, select) {
      var $combobox = jQuery(select).prop('tabIndex', 0);
      var dropdownId = $combobox.attr('aria-owns');
      var $listbox = jQuery(['#', dropdownId].join(''));

      if (!dropdownId || !$listbox.length) {
        console.warn('Unable to find listbox using the comboboxes "aria-owns" attribute for: ', select);
        return;
      }

      // create an element to place the value in
      var $pseudoVal = $combobox.find('.dqpl-pseudo-value');
      if (!$pseudoVal.length) {
        $pseudoVal = jQuery('<div class="dqpl-pseudo-value" />');
      }

      $combobox.append($pseudoVal);
      $combobox.noClobber($pseudoVal, 'aria-labelledby');

      // give each option a unique id (if it doesn't already have one)
      $listbox.find('[role="option"]').rndid();
      checkForMissingAttrs($combobox, $listbox);
      attachEvents($combobox, $listbox);

      // attach native click-on-label-to-focus-control behavior
      labelHandler($combobox);

      // check if there is a default selected and ensure it has the right attrs/classes
      var initiallyActive = $combobox.attr('aria-activedescendant');
      if (initiallyActive) {
        jQuery('#' + initiallyActive)
          .attr('aria-selected', 'true')
          .addClass('dqpl-option-active');
      }
    });
  }

  function attachEvents($combobox, $listbox) {
    $combobox
      .off('click', onComboClick)
      .on('click', onComboClick)
      .off('blur', onComboBlur)
      .on('blur', onComboBlur)
      .off('keydown', onComboKeydown)
      .on('keydown', onComboKeydown);

    $listbox
      .off('mousedown.dqplSelect', '[role="option"]')
      .on('mousedown.dqplSelect', '[role="option"]', function () {
        // detach blur events so the list doesn't close
        $combobox.off('blur', onComboBlur);
        var $option = jQuery(this);
        $combobox.attr('aria-activedescendant', $option.prop('id'));
        activateOption($combobox, $listbox, true);
        selectOption($combobox, $listbox, true);
        jQuery(document)
          .off('mouseup.dqplBlurry')
          .one('mouseup.dqplBlurry', function () {
            $combobox.focus();
            $listbox.removeClass('dqpl-listbox-show');
            $combobox.attr('aria-expanded', 'false');
            $combobox.on('blur', onComboBlur);
          });
      });


    function onComboClick() {
      $listbox.toggleClass('dqpl-listbox-show');
      var hasShowClass = $listbox.hasClass('dqpl-listbox-show');
      $combobox.attr('aria-expanded', hasShowClass);

      if (hasShowClass) {
        openSetup($combobox, $listbox);
      }
    }

    function onComboBlur() {
      var wasVisible = $listbox.is(':visible');
      $listbox.removeClass('dqpl-listbox-show');
      $combobox.attr('aria-expanded', 'false');
      var cached = $listbox.attr('data-cached-selected');
      if (cached && wasVisible) {
        $combobox.attr('aria-activedescendant', cached);
      }
    }

    function onComboKeydown(e) {
      var which = e.which;

      if (which === 38 || which === 40) { // UP or DOWN
        e.preventDefault();

        if ($listbox.is(':visible')) {
          arrowHandler(which, $combobox, $listbox);
        } else { // open it and ensure aria-activedescendant is set
          openSetup($combobox, $listbox);
        }
      } else if (which === 13 || which === 32) { // ENTER or SPACE
        e.preventDefault();
        if ($listbox.is(':visible')) {
          selectOption($combobox, $listbox);
        } else if (which === 32) {
          openSetup($combobox, $listbox);
        }
      } else if (which === 27) { // ESCAPE
        if ($listbox.is(':visible')) {
          // restore previously selected
          var cachedSelected = $listbox.attr('data-cached-selected');
          $combobox.attr('aria-activedescendant', cachedSelected);
          // close the listbox
          $listbox.removeClass('dqpl-listbox-show');
          $combobox.attr('aria-expanded', 'false');
        }
      } else if (isLetterOrNum(which)) {
        openSetup($combobox, $listbox);
        keySearch(which, $combobox, $listbox);
      }
    }
  }

  function arrowHandler(key, $combobox, $listbox) {
    var isNext = key === 40;
    var $selectedOption = jQuery('#' + $combobox.attr('aria-activedescendant'));

    if (!$selectedOption.length) { return; }

    var $options = $listbox.find('[role="option"]').filter(nonDisabled);
    var index = jQuery.inArray($selectedOption[0], $options);
    var adjacentIndex = isNext ? index + 1 : index - 1;

    if (adjacentIndex !== -1 && adjacentIndex !== $options.length) { // No circularity (like native <select />)
      var $adjacentOption = $options.eq(adjacentIndex);
      $combobox.attr('aria-activedescendant', $adjacentOption.prop('id'));
      activateOption($combobox, $listbox);
    }
  }

  function activateOption($combobox, $listbox, noScroll) {
    $listbox
      .find('[role="option"].dqpl-option-active')
        .removeClass('dqpl-option-active');

    var optionID = $combobox.attr('aria-activedescendant');
    var $active = jQuery('#' + optionID).addClass('dqpl-option-active');

    if ($active.length && !noScroll && !isInView($listbox, $active)) {
      // scroll the option into view by scrolling the listbox
      var topPos = $active[0].offsetTop;
      $listbox[0].scrollTop = topPos;
    }
  }

  function selectOption($combobox, $listbox, noHide) {
    $listbox.find('[aria-selected="true"]').removeAttr('aria-selected');
    var $active = $listbox.find('.dqpl-option-active');
    $active.attr('aria-selected', 'true');
    if (!noHide) {
      $listbox.removeClass('dqpl-listbox-show');
      $combobox.attr('aria-expanded', 'false');
    }
    $combobox.find('.dqpl-pseudo-value').text($active.text());
  }

  function openSetup($combobox, $listbox) {
    if (!$combobox.attr('aria-activedescendant')) {
      // if theres no selection (initially), then default to the first one
      var $firstNonDisabled = $listbox.find('[role="option"]').filter(nonDisabled).first();
      $combobox.attr('aria-activedescendant', $firstNonDisabled.prop('id'));
    }

    $listbox.addClass('dqpl-listbox-show'); // open the listbox
    $combobox.attr('aria-expanded', 'true');
    $listbox.attr('data-cached-selected', $combobox.attr('aria-activedescendant'));
    activateOption($combobox, $listbox);
  }

  function labelHandler($combobox) {
    var dataLabelID = $combobox.attr('data-label-id');
    var $label = dataLabelID ?
      jQuery('#' + dataLabelID) :
      $combobox.closest('.dqpl-field-wrap').find('.dqpl-label, .dqpl-label-inline');

    $label.off('click.dqplSelect').on('click.dqplSelect', function () {
      $combobox.focus();
    });

  }

  function nonDisabled(_, el) {
    return jQuery(el).attr('aria-disabled') !== 'true';
  }

  /**
   * Functionality for typing letters to jump to matching options
   */
  var keys = [];
  var timer;
  function keySearch(which, $combobox, $listbox) {
    clearTimeout(timer);

    var key = String.fromCharCode(which);
    if (!key || !key.trim().length) { return; }

    var $options = $listbox.find('[role="option"]').filter(nonDisabled);
    key = key.toLowerCase();
    keys.push(key);
    // find the FIRST option that most closely matches our keys
    // if that first one is already selected, go to NEXT option
    var stringMatch = keys.join('');
    // attempt an exact match
    var $deepMatches = $options.filter(function () {
      return jQuery(this).text().toLowerCase().indexOf(stringMatch) === 0;
    });

    if ($deepMatches.length) {
      searchSelect($deepMatches, $combobox, $listbox);
    } else {
      // just go by first letter
      var firstChar = stringMatch[0];
      var $shallowMatches = $options.filter(function () {
        return jQuery(this).text().toLowerCase().indexOf(firstChar) === 0;
      });
      searchSelect($shallowMatches, $combobox, $listbox);
    }

    timer = setTimeout(function () {
      keys = [];
    }, TYPE_TIME);
  }

  function searchSelect($matches, $combobox, $listbox) {
    if (!$matches.length) { return; }
    var $current = $listbox.find('.dqpl-option-active').first();
    var currentIndex = jQuery.inArray($current[0], $matches);
    var nextIndex = currentIndex + 1;
    var $toBeSelected = $matches.eq(nextIndex);
    // circularity
    if (!$toBeSelected.length) { $toBeSelected = $matches.first(); }
    if ($toBeSelected[0] === $current[0]) { return; }
    $combobox.attr('aria-activedescendant', $toBeSelected.prop('id'));
    activateOption($combobox, $listbox);
  }

  /**
   * Warn if proper roles aren't there...
   */
  function checkForMissingAttrs($combobox, $listbox) {
    if ($combobox.attr('role') !== 'combobox') {
      console.warn('Combobox missing role="combobox" attribute', $combobox);
    }

    if ($listbox.attr('role') !== 'listbox') {
      console.warn('Listbox missing role="listbox" attribute', $listbox);
    }
  }

  function isLetterOrNum(key) {
    var isLetter = key >= 65 && key <= 90;
    var isNumber = key >= 48 && key <= 57;
    return isLetter || isNumber;
  }


  function isInView($container, $el) {
    var contHeight = $container.height();
    var contTop = $container.scrollTop();
    var contBottom = contTop + contHeight;

    var elTop = $el.offset().top - $container.offset().top;
    var elemBottom = elTop + $el.height();

    return (elTop >= 0 && elemBottom <= contHeight);
  }
}());

(function () {
  'use strict';

  /**
   * Can be implemented in a few different ways...
   * 1) provide the "Skip to" text via `data-skip-to-text` attribute in
   * which the label (aria-label or aria-labelledby) or role will be appended
   * to in the text of the link.
   * 	Example (using role):
   * 		<div class="dqpl-skip-container" data-skip-to-text="Skip to"></div>
   * 		<div role="navigation">...</div>
   * The target element is a role="navigation" and the data-skip-to-text is
   * "Skip to" so the link's text will be "Skip to navigation"
   *
   * 	Additional example (using label)
   * 		<div class="dqpl-skip-container" data-skip-to-text="Skip to"></div>
   * 		<div role="banner" aria-label="Foo Section"></div>
   * the link's text here would be: "Skip to Foo section"
   *
   * 2) In addition to the above method, you can override the role or label
   * readout ("navigation" in the above example) by adding a `data-skip-to-name`
   * attribute. Example:
   * 		<div class="dqpl-skip-container" data-skip-to-text="Skip to"></div>
   * 		<div role="navigation" data-skip-to-name="Main Navigation">
   * which would result in a skip link's text: "Skip to Main Navigation"
   *
   * 3) The 3rd option is much different than the above... It lets you have
   * complete control of the link's text.  You can create your own skip links
   * within the "dqpl-skip-container" element in which you just have to create
   * links with the class "dqpl-skip-link" and have the href attribute point to
   * the id of the target of the skip link
   * 	example:
   * 	<div class="dqpl-skip-container">
   * 		<ul>
   * 			<li><a class="dqpl-skip-link" href="#main-content">Skip to main content</a></li>
   * 			<li><a class="dqpl-skip-link" href="#side-bar">Jump to side bar</a></li>
   * 			<li><a class="dqpl-skip-link" href="#other-thing">Hop to other thing</a></li>
   * 		</ul>
   * 	</div>
   * 	<div id="main-content" role="main">
   * 		I am the target of the first skip link "Skip to main content"
   * 	</div>
   * 	<div id="side-bar">
   * 		I am the target of the second skip link "Jump to side bar"
   * 	</div>
   * 	<div id="other-thing">
   * 		I am the target of the third skip link "Hop to other thing"
   * 	</div>
   *
   *
   * NOTE: add `data-remove-tabindex-on-blur="true"` to the skip container
   * if you want tabindex to be removed from a skip target on blur (so when
   * you click inside of a container the focus ring doesn't show up)
   */

  var $skipContainer = jQuery('.dqpl-skip-container');

  if ($skipContainer.length) {
    landmarksMenu();
  }

  jQuery(document).on('dqpl:ready', function () {
    $skipContainer = jQuery('.dqpl-skip-container');
    landmarksMenu();
  });

  function landmarksMenu() {
    var shouldRemove = $skipContainer.is('[data-remove-tabindex-on-blur]');

    // focus management
    $skipContainer
        .on('focusin', function (e) {
          var $target = jQuery(e.target);

          if ($target.closest('ul').length) {
            $skipContainer.addClass('dqpl-child-focused');
          }
          $skipContainer.addClass('dqpl-skip-container-active');
          setTimeout(function () {
            $skipContainer.addClass('dqpl-skip-fade');
          });
        })
        .on('focusout', function (e) {
          var $target = jQuery(e.target);

          setTimeout(function () {
            var activeEl = document.activeElement;
            if (!jQuery(activeEl).closest('.dqpl-skip-container').length) {
              if ($target.closest('ul').length) {
                $skipContainer.removeClass('dqpl-child-focused');
              }
              $skipContainer.removeClass('dqpl-skip-container-active');
              setTimeout(function () {
                $skipContainer.removeClass('dqpl-skip-fade');
              });
            }
          });
        });

    if ($skipContainer.children().length) {
      return fixExistingLinks(shouldRemove);
    } else {
      return createLandmarkMenu(shouldRemove);
    }
  }

  function fixExistingLinks(shouldRemove) {
    jQuery(document.body).on('click', '.dqpl-skip-link', function (e) {
      e.preventDefault();
      var $link = jQuery(this);
      var href = $link.attr('href');
      var $landing = jQuery(href);

      if (!href || !$landing.length) {
        return console.warn('Please provide a valid href for the skip link: ', this);
      }

      // ensure focusability
      $landing.prop('tabIndex', $landing.prop('tabIndex') || '-1');
      // focus it
      $landing.focus();
      if (shouldRemove) {
        $landing.off('blur.dqpl').one('blur.dqpl', function () {
          $landing.removeAttr('tabIndex');
        });
      }
    });
  }

  function createLandmarkMenu(shouldRemove) {
    var SELECTOR = [
      '[role="main"]',
      '[role="banner"]',
      '[role="navigation"]',
      '[data-skip-target="true"]'
    ].join(', ');

    var links = [];

    jQuery(SELECTOR).each(function (_, skipTarget) {
      var $skipTarget = jQuery(skipTarget);
      if ($skipTarget.is('[data-no-skip="true"]')) {
        return;
      }
      // calculate link text
      var linkText = calculateText(skipTarget);

      if (!linkText) {
        return console.warn('Unable to calculate text for skip link for: ', skipTarget);
      }

      var skipToText = $skipContainer.attr('data-skip-to-text') || '';
      var linkHtml = [
        '<span class="dqpl-skip-one">' + skipToText + '</span>',
        '<span class="dqpl-skip-two">' + linkText + '</span>'
      ].join('');

      // create a skip link
      var $link = jQuery('<a href="#" class="dqpl-skip-link">' + linkHtml + '</a>');
      links.push($link);

      $link.on('click', function (e) {
        e.preventDefault();
        // ensure its focusable
        skipTarget.tabIndex = skipTarget.tabIndex || -1;
        // focus it
        skipTarget.focus();
        // account for the 80px of top bar height
        window.scrollTo(0, $skipTarget.offset().top - 80);

        if (shouldRemove) {
          $skipTarget.off('blur.dqpl').one('blur.dqpl', function () {
            $skipTarget.removeAttr('tabIndex');
          });
        }
      });
    });

    var $parent = (links.length > 1) ?
      $skipContainer.append(jQuery('<ul class="dqpl-skip-list"/>')).find('.dqpl-skip-list') :
      $skipContainer;

    jQuery.each(links, function (_, $link) {
      $parent.append($link);
      if (links.length > 1) {
        $link.wrap('<li />');
      }
    });
  }

  /**
   * Calculate text for a skip link based on (in order of precedence)
   * - the element's data-skip-to-name attribute's value
   * - the element's accessible name (calculated through aria-label or aria-labelledby)
   * - fall back to the role (if present)
   * @param  {HTMLElement} element The target of the skip link
   * @return {String}              The calculated text for the skip link
   */
  function calculateText(element) {
    var $el = jQuery(element);
    return $el.attr('data-skip-to-name') || getLabel($el) || $el.attr('role');
  }

  /**
   * Gets an elements aria-label
   * |OR|
   * text from the element referenced to in aria-labelledby
   */
  function getLabel($el) {
    return $el.attr('aria-label') || idrefsText($el.attr('aria-labelledby'));
  }

  function idrefsText(str) {
    if (!str) { return ''; }
    var result = [], index, length;
    var idrefs = str.trim().replace(/\s{2,}/g, ' ').split(' ');
    for (index = 0, length = idrefs.length; index < length; index++) {
      result.push(document.getElementById(idrefs[index]).textContent);
    }
    return result.join(' ');
  }

}());

(function () {
  'use strict';

  var initialState;
  var ACTIVE_CLASS = 'dqpl-active';
  var $topBar = jQuery('.dqpl-top-bar');
  var $trigger = $topBar.find('.dqpl-menu-trigger');
  var $menu = jQuery('.dqpl-side-bar');
  var $scrim = jQuery('#dqpl-side-bar-scrim');
  // top level menuitems
  var $topBarMenuItems = findTopLevels($topBar.find('[role="menubar"]').first(), true);

  if (!$topBar.length) {
    return listenForReady();
  } else {
    ready();
  }

  function listenForReady() {
    jQuery(document).one('dqpl:ready', function () {
      $topBar = jQuery('.dqpl-top-bar');
      $trigger = $topBar.find('.dqpl-menu-trigger');
      $menu = jQuery('.dqpl-side-bar');
      $scrim = jQuery('#dqpl-side-bar-scrim');
      // top level menuitems
      $topBarMenuItems = findTopLevels($topBar.find('[role="menubar"]').first(), true);
      ready();
    });
  }

  function ready() {
    /**
     * Listen for resize so we can configure stuff based on the locking of the menu
     */
    jQuery.throttle({
      element: window,
      event: 'resize',
      delay: 100
    }, onResize);

    onResize();

    /**
     * Listen for refresh events
     * (prevents menus from getting in funky states)
     */
    $topBar.on('dqpl:refresh', onRefresh);

    /**
     * Listen for clicks outside the menu (when
     * its opened AND not locked) to close it
     */
    jQuery(document).on('click', function (e) {
      var $target = jQuery(e.target);
      var isWithin = $target.closest('.dqpl-side-bar').length;
      var isHamburger = $target.is('.dqpl-menu-trigger') || !!$target.closest('.dqpl-menu-trigger').length;
      if (isWithin || isHamburger || $menu.attr('data-locked') === 'locked') {
        return;
      }

      if ($menu.attr('aria-expanded') === 'true') {
        onTriggerClick();
      }
    });

    /**
     * Toggle menu on hamburger clicks
     */
    $trigger.on('click', onTriggerClick);

    function onTriggerClick(e, noFocus) {
      toggleSubmenu($trigger, function (_, done) {
        $trigger.toggleClass(ACTIVE_CLASS);
        var wasActive = $menu.hasClass(ACTIVE_CLASS);
        var first = wasActive ? ACTIVE_CLASS : 'dqpl-show';
        var second = first === ACTIVE_CLASS ? 'dqpl-show' : ACTIVE_CLASS;

        $menu.toggleClass(first);
        $scrim.toggleClass('dqpl-scrim-show');
        setTimeout(function () {
          $menu.toggleClass(second);
          $scrim.toggleClass('dqpl-scrim-fade-in');
          setTimeout(function () {
            done(noFocus);
          });
        }, 100);
      });
    }

    /**
     * Toggle submenu on other menu items with submenus
     */
    $topBar.on('click', '[role="menuitem"][aria-controls]', function () {
      var $this = jQuery(this);
      // trigger clicks are handled separately...
      if ($this.is($trigger)) { return; }

      toggleSubmenu($this, function ($dropdown, done) {
        $dropdown.toggleClass('dqpl-dropdown-active');
        done(false, ($dropdown.hasClass('dqpl-dropdown-active') ? $dropdown : $this));
      });
    });

    /**
     * Setup for menu items
     */
    $topBarMenuItems.prop('tabIndex', -1).first().prop('tabIndex', 0);
    $menu.find('[role="menu"]').each(function (_, menu) {
      var $menuItems = jQuery(menu).find('[role="menuitem"]');
      $menuItems.prop('tabIndex', -1).first().prop('tabIndex', 0);
    });

    /**
     * Keyboard logic for top bar
     */
    $topBar
      .on('keydown', '[role="menuitem"]', function (e) {
        var which = e.which;
        var $target = jQuery(e.target);

        switch (which) {
          case 37:
          case 39:
            e.preventDefault(); // don't scroll
            arrowHandler(
              findTopLevels($topBar.find('[role="menubar"]').first(), true),
              $target, which === 39 ? 'next' : 'prev'
            );
            break;
          case 38:
          case 40:
            e.preventDefault();
            if ($target.attr('aria-controls')) {
              $target.click();
            }
            break;
          case 13:
          case 32:
            e.preventDefault();
            $target.click();
            break;
        }
      })
      .on('click', '[role="menuitem"]', function () {
        var $target = jQuery(this);
        var $link = $target.find('a');
        if ($link.length) {
          $link[0].click();
        }
      })
      .on('keydown', '.dqpl-dropdown', function (e) {
        var which = e.which;
        var $target = jQuery(e.target);
        var $dropdown = jQuery(this);

        switch (which) {
          case 27:
          case 38:
            var id = $dropdown.prop('id');
            var $trigger = jQuery('[aria-controls="' + id + '"]');
            $trigger.click();
            break;
        }
      });

    /**
     * Keyboard logic for menu (side bar)
     * - up/down traverse through menu items
     * - right (with submenu) opens submenu / focuses first item
     * - left/escape closes submenu (if within one) OR closes menu (if at top level)
     */
    $menu
      .on('keydown', '[role="menuitem"]', function (e) {
        var which = e.which;
        var $target = jQuery(e.target);

        switch (which) {
          case 27:
          case 37:
            var isOfMenu = $target.parent().is($menu);
            if ($menu.attr('data-locked') === 'true' && isOfMenu) {
              return;
            }
            e.preventDefault();
            e.stopPropagation(); // prevent bubbling for sake of submenus

            var $thisMenu = $target.closest('[role="menu"]');
            var $thisTrigger = jQuery('[aria-controls="' + $thisMenu.prop('id') + '"]');

            $thisTrigger.click();

            if (!isOfMenu) { activateMenuitem($target, $thisTrigger); }
            break;
          case 40:
            e.preventDefault();
            arrowSetup($target, 'next');
            break;
          case 38:
            e.preventDefault();
            arrowSetup($target, 'prev');
            break;
          case 32:
          case 13:
            e.preventDefault();
            $target.trigger('click');
            if (!$target.attr('aria-controls')) {
              var $link = $target.find('a');
              if ($link.length) {
                $link[0].click();
              }
            }
            break;
          case 39:
            if ($target.attr('aria-controls')) {
              $target.click();
            }
            break;
        }
      })
      /**
       * Mouse logic for expandable submenu triggers
       */
      .on('click', '[role="menuitem"]', function (e) {
        e.stopPropagation();
        var $trigger = jQuery(this);
        if ($trigger.attr('aria-controls')) {
          toggleSubmenu($trigger, function ($submenu, done) {
            $submenu.slideToggle(400, function () {
              $trigger.toggleClass('dqpl-weight-bold');
              var $toFocus = $submenu.find('[role="menuitem"][tabindex="0"]');
              $toFocus = $toFocus.length ? $toFocus : $submenu.find('[role="menuitem"]').first();
              done(false, $toFocus);
            });
          });
        } else {
          var $link = $trigger.find('a');
          if ($link.length) {
            $link[0].click();
          }
        }
      })
      .on('keydown', function (e) {
        var which = e.which;
        if (which !== 9) { return; }
        setTimeout(function () {
          var outsideOfMenu = !$menu.has(document.activeElement).length;
          var isExpanded = $menu.attr('aria-expanded') === 'true';
          if (outsideOfMenu && isExpanded) {
            onTriggerClick(null, true);
          }
        });
      });


    /**
     * The menu is locked into visibility above 1024px viewport...
     * - ensure aria-expanded is removed/readded properly
     * - ensure the topbar menu isn't thrown off (in case the hamburger was the "active" item)
     */
    var lastSize;
    function onResize() {
      var width = jQuery(window).width();

      if (width >= 1024) {
        if (!lastSize || lastSize === 'narrow') {
          lastSize = 'wide';
          var expanded = $menu.attr('aria-expanded');
          if (expanded) {
            $menu.attr('data-prev-expanded', expanded);
          }

          $menu.removeAttr('aria-expanded');
          $scrim.removeClass('dqpl-scrim-show').removeClass('dqpl-scrim-fade-in');

          if ($trigger.prop('tabIndex') === 0) {
            // since `$trigger` gets hidden (via css) "activate" something else in the menubar
            $topBarMenuItems = findTopLevels($topBar.find('[role="menubar"]').first(), true);
            $topBarMenuItems.prop('tabIndex', -1).first().prop('tabIndex', 0);
          }
          $menu.attr('data-locked', 'true');
        }
      } else {
        if (!lastSize || lastSize === 'wide') {
          lastSize = 'narrow';
          var expandedVal = $menu.attr('data-prev-expanded') === 'true' ? 'true' : 'false';
          $menu.attr('aria-expanded', expandedVal);
          $topBarMenuItems = findTopLevels($topBar.find('ul').first(), true);
          $menu.attr('data-locked', 'false');
          if (expandedVal === 'true') {
            $scrim.addClass('dqpl-scrim-show').addClass('dqpl-scrim-fade-in');
          }
        }
      }
    }

    /**
     * Ensure that there is 1 item with tabindex="0"
     */
    function onRefresh() {
      $topBarMenuItems = findTopLevels($topBar.find('[role="menubar"]').first(), true);
      var $activeOne = $topBarMenuItems.filter('[tabindex="0"]');
      if (!$activeOne.length) {
        $topBarMenuItems.first().prop('tabIndex', 0);
      }
    }

    /**
     * Activates a menuitem and deactivates the previously active
     * by giving the previously active menuitem tabindex="-1" and
     * giving the newly active menuitem tabindex="0"
     */
    function activateMenuitem($prevActive, $newlyActive) {
      $prevActive.prop('tabIndex', -1);
      $newlyActive.prop('tabIndex', 0).focus();
    }

    /**
     * Handles left/right arrow navigation
     */
    function arrowHandler($items, $target, dir) {
      var isNext = dir === 'next';
      var currentIdx = $items.index($target[0]);
      var $adjacent = $items.eq(isNext ? currentIdx + 1 : currentIdx - 1);

      // circularity (first or last)
      if (!$adjacent.length) {
        $adjacent = $items.eq(isNext ? 0 : $items.length - 1);
      }

      activateMenuitem($target, $adjacent);
    }

    /**
     * Setup for arrow handler...finds the top levels and calls `arrowHandler`
     */
    function arrowSetup($target, dir) {
      var $items = findTopLevels($target.closest('[role="menu"]'));
      arrowHandler($items, $target, dir);
    }

    /**
     * toggles a menu or submenu
     * @param  {jQuery} $trig      jQuery wrapped element ref of the trigger of the given menu
     * @param  {function} toggleFn a function that handles the toggling of the given menu
     */
    function toggleSubmenu($trig, toggleFn) {
      var $droplet = jQuery('#' + $trig.attr('aria-controls'));

      if (!$droplet.length) {
        return;
      }

      toggleFn($droplet, function (noFocus, $focus) {
        var prevExpanded = $droplet.attr('aria-expanded');
        var wasCollapsed = !prevExpanded || prevExpanded === 'false';
        $droplet.attr('aria-expanded', wasCollapsed);
        if ($focus) {
          $focus.focus();
        } else if (!noFocus) {
          var $active = $droplet.find('.dqpl-menuitem-selected').filter(':visible');
          $active = $active.length ?
            $active :
            $droplet.find('[role="menuitem"][tabindex="0"]').filter(':visible').first();
          var $focusMe = wasCollapsed ?
            $active :
            $droplet.closest('[aria-controls][role="menuitem"]');

          $focusMe = $focusMe.length ? $focusMe : $trigger;
          $focusMe.focus();
        }
      });
    }
  }

  /**
   * Finds the top level menu items of a menu
   */
  function findTopLevels($ul, visible) {
    var $chiles = $ul.children().filter('[role="menuitem"]');
    return (visible) ? $chiles.filter(':visible') : $chiles;
  }
}());

(function () {
  'use strict';

  var $body = jQuery(document.body);

  jQuery(document)
    .on('click', '[data-modal]', function () {
      var $trigger = jQuery(this);
      var modalId = $trigger.attr('data-modal');
      var $modal = jQuery('#' + modalId);

      if (!$modal.length) {
        console.warn('No modal found with id: ' + modalId);
      } else {
        openModal($trigger, $modal);
      }
    })
    .on('click', '.dqpl-modal-close, .dqpl-modal-cancel', function () {
      var $button = jQuery(this);
      var $modal = $button.closest('.dqpl-modal');
      closeModal($modal);
    })
    .on('keydown', '.dqpl-modal', function (e) {
      var $modal = jQuery(this);
      var target = e.target;
      var $target = jQuery(target);
      var which = e.which;

      switch (which) {
        case 27:
          closeModal($modal);
          break;
        case 9:
          var $focusables = $modal.focusable(false, true);
          var $first = $focusables.first();
          var $last = $focusables.last();
          if (e.shiftKey && $first.is(target)) {
            e.preventDefault();
            $last.focus();
          } else if (!e.shiftKey && $last.is(target)) {
            e.preventDefault();
            $first.focus();
          }
          break;
      }
    })
    .on('keydown', '.dqpl-modal-header h2', function (e) {
      if (e.which === 9 && e.shiftKey) {
        e.preventDefault();
        var $modal = jQuery(this).closest('.dqpl-modal');
        var $focusables = $modal.focusable(false, true);
        $focusables.last().focus();
      }
    });


  function openModal($trigger, $modal) {
    var $heading = $modal.find('.dqpl-modal-header h2');
    // display it
    $modal.addClass('dqpl-modal-show');
    $body.addClass('dqpl-modal-open');
    var $scrim = $modal.find('.dqpl-modal-screen');

    if (!$scrim.length) {
      $scrim = jQuery('<div class="dqpl-modal-screen" />');
      $modal.append($scrim);
    }

    $scrim.show();

    $heading.prop('tabIndex', -1).focus();

    // aria-hidden to everything but the modal...
    ariaHide($modal);

    // trigger open event
    $modal.trigger('dqpl:modal-open');

    sizeHandler($modal);
    jQuery(window).on('resize.dqplModal', function () {
      sizeHandler($modal);
    });
  }

  function closeModal($modal) {
    var id = $modal.prop('id');
    var $trigger = jQuery('[data-modal="' + id + '"]');

    $modal.removeClass('dqpl-modal-show');
    $body.removeClass('dqpl-modal-open');
    ariaShow();
    $trigger.focus();

    // trigger close event
    $modal.trigger('dqpl:modal-close');

    jQuery(window).off('resize.dqplModal');
  }

  function sizeHandler($modal) {
    $modal
      .find('.dqpl-modal-content')
        .css('max-height', jQuery(window).height() - 185);
  }

  /**
   * Apply aria-hidden="true" to everything but modal (and parents of modal),
   * remove aria-hidden when modal is closed (unless the element already had
   * aria-hidden="true" applied to it)
   */

  function ariaHide($modal) {
    var modal = $modal[0];
    if (!modal) { return; }

    var parent = modal.parentNode;
    while (parent && parent.nodeName !== 'HTML') {
      var $children = jQuery(parent).children();
      $children.each(childHandler);
      parent = parent.parentNode;
    }

    function childHandler(_, child) {
      var $thisChild = jQuery(child);

      if (!$thisChild.is(modal) && !jQuery.contains(child, modal)) {
        alreadyHidden($thisChild);
        $thisChild.attr('aria-hidden', 'true');
      }
    }
  }

  function ariaShow() {
    jQuery('[aria-hidden="true"]').each(function (_, el) {
      var $el = jQuery(el);
      if ($el.attr('data-already-aria-hidden') !== 'true') {
        $el.removeAttr('aria-hidden');
      }
    });
  }

  function alreadyHidden($el) {
    if ($el.attr('aria-hidden') === 'true') {
      $el.attr('data-already-aria-hidden', 'true');
    }
  }
}());

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
