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

## Usage

Just drop the css and js into your page:

```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="./bower_components/deque-pattern-library/css/cauldron.min.css" />
  </head>
  <body>
    ...
    <script src="./bower_components/deque-pattern-library/js/cauldron.min.js"></script>
  </body>
</html>
```

### Implementation Notes
* If content of app is somehow loaded in after page load, you'll need to fire the "dqpl:ready" event so the javascript can reassess stuff.  Example:
```js
const e = new Event('dqpl:ready');
document.dispatchEvent(e); // tells the pattern library that we're ready
```

## Development
- `npm install`
- `bower install`
- `npm run build` or for development - `npm run dev` which will rebuild when files are changed

__NOTE__: if a new component or composite is added, remember to create a quick [wiki](https://bitbucket.org/dmusser/pattern-library/wiki/Home) entry explaining what is absolutely necessary in using this widget.

### Testing
Testing is done using mochify along with the 'chai' assertion library (`assert.equal(!!0, false)`).  The `test/` directory structure matches the `lib/` directory.  This means that if you're testing `lib/components/foo/index.js`, you would create a test in `test/components/foo/index.js`.  See the `test/` directory for examples.

```bash
$ npm run test
```

### Releases
Orphan branch dist-only releases...

 * https://gist.github.com/schne324/6ca72fac89f35d961a0d
