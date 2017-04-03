# Pattern Library

## Usage
This is a private repo only available to deque employees.  To include cauldron in your app you need install it via bower.  This can be done by adding `git@bitbucket.org:dmusser/pattern-library.git#1.0.0` as a dependency.  Example bower.json to include the pattern library:
```json
{
  "name": "my-awesome-app",
  "description": "just an awesome app",
  "main": "fred.js",
  "authors": [
    "Fred"
  ],
  "license": "UNLICENSED",
  "homepage": "",
  "private": true,
  "dependencies": {
    "pattern-library": "git@bitbucket.org:dmusser/pattern-library.git#1.0.0"
  }
}
```
__NOTE__: To include the pattern library up above you will need to have SSH setup for your bitbucket account. [Here's how](https://confluence.atlassian.com/bitbucket/set-up-ssh-for-git-728138079.html)

### Dependencies

The one and only dependency of the pattern library is jQuery which you will have to include on your own _before_ the inclusion of the pattern library's javascript file.

```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="path-to-pattern-library-css/cauldron.min.css" />
  </head>
  <body>
    ...
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="path-to-pattern-library-js/cauldron.min.js"></script>
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
