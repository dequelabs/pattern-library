# Pattern Library

## Installation

### NPM

```bash
$ npm install deque-pattern-library
```

### Bower

```bash
$ bower install deque-pattern-library
```

## Usage

Just drop the css and js into your page:

```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="./node_modules/deque-pattern-library/css/pattern-library.min.css" />
  </head>
  <body>
    ...
    <script src="./node_modules/deque-pattern-library/js/pattern-library.min.js"></script>
  </body>
</html>
```

## What is included?

* css
  * `pattern-library.css`
  * `pattern-library.min.css`
* fonts
  * Roboto
  * FontAwesome
* js
  * `pattern-library.js`
  * `pattern-library.min.js`
* less
  * `variables.less`: All of the pattern library's colors and mixins

## Getting started

Please refer to the [wiki](https://github.com/dequelabs/pattern-library/wiki)

## Development

- `npm install`
- `npm run build` or for development - `npm run dev` which will rebuild when files are changed

__NOTE__: if a new component or composite is added, remember to create a quick [wiki](https://github.com/dequelabs/pattern-library/wiki) entry explaining what is absolutely necessary in using this widget.

### Testing
Testing is done using mochify along with the 'chai' assertion library (`assert.isFalse(!!0)`).  The `test/` directory structure matches the `lib/` directory.  This means that if you're testing `lib/components/foo/index.js`, you would create a test in `test/components/foo/index.js`.  See the `test/` directory for examples.  The tests are browserified and transpiled before running in the phantomjs headless browser so you can `require` stuff and use es6 syntax in the tests.

```bash
$ npm run test
```

or to have a watcher re-run tests every time you add a new test:

```bash
$ npm run test:dev
```

### Debugging
The pattern library uses the [debug](https://www.npmjs.com/package/debug) module. To turn all debugging on, execute: `localStorage.debug = 'dqpl:*'` and refresh the page.  The directory structure of lib is used as the debug naming convention. For example, to specifically debug the "selects" component, execute: `localStorage.debug = 'dqpl:components:selects'`.

### Releases
Orphan branch dist-only releases:

 * https://gist.github.com/schne324/6ca72fac89f35d961a0d
