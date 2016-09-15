# Pattern Library

## Usage
This is a private repo only available to deque employees.  To include alchemy in your app you need install it via bower.  This can be done by adding `git@bitbucket.org:dmusser/pattern-library.git#0.0.5` as a dependency.  Example bower.json to include the pattern library:
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
    "pattern-library": "git@bitbucket.org:dmusser/pattern-library.git#0.0.5"
  }
}
```

## Development
- `npm install`
- `bower install`
- `gulp`: will build stuff into the _dist_ directory (`gulp watch` is also available)

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
