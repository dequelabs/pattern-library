# Pattern Library

## Installation

### Bower

```bash
$ bower install deque-pattern-library
```

### NPM

```bash
$ npm install deque-pattern-library
```

### Dependencies

The one and only dependency of the pattern library is jQuery which you will have to include on your own _before_ the inclusion of the pattern library's javascript file.

```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="./bower_components/deque-pattern-library/css/cauldron.min.css" />
  </head>
  <body>
    ...
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="./bower_components/deque-pattern-library/js/cauldron.min.js"></script>
  </body>
</html>
```

## Development
- `npm install`
- `bower install`
- `gulp`: will build stuff into the _dist_ directory (`gulp watch` is also available)

__NOTE__: if a new component or composite is added, remember to create a quick [wiki](https://bitbucket.org/dmusser/pattern-library/wiki/Home) entry explaining what is absolutely necessary in using this widget.

## Testing
Testing is done using mocha-phantomjs along with the 'chai' assertion library (`assert.equal(!!0, false)`).  The `test/` directory structure matches the `src/` directory.  This means that if I'm testing `src/js/foo/index.js`, I should create my test in `test/js/foo/index.js`.  In order for mocha to run your test, you need to add it to the list of scripts at the bottom of `test/runner.html`.  [Read more info about mocha](https://mochajs.org/)

```bash
$ gulp test
```

Or if you like running your tests in the browser

```bash
$ open test/runner.html
```

## Releases
Orphan branch dist-only releases...

 * https://gist.github.com/schne324/6ca72fac89f35d961a0d

## Notes
* All media query stuff should go in `src/less/layout.less`

## Implementation Notes
* If content of app is somehow loaded in after page load, you'll need to fire the "dqpl:ready" event so the javascript can reassess stuff.  Example:
```js
jQuery(document).trigger('dqpl:ready'); // tell the pattern library we're ready to go
```

## TODO
- wrap all js in `jQuery(document).ready()` (to support adding script to head and not having to fire a `jQuery(document).trigger('dqpl:ready')`)
