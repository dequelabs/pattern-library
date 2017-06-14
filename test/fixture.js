'use strict';

const cauldronCSS = require('../dist/css/pattern-library.min.css');

module.exports = class Fixture {
  constructor() {
    this.addCauldron();
  }

  /**
   * Adds cauldron assets (css)
   */

  addCauldron() {
    this.style = document.createElement('style');
    this.style.innerHTML = cauldronCSS;
    document.body.appendChild(this.style);
    return this;
  }

  /**
   * Creates a fixture element with provided markup
   * @param  {String} markup A string of html to be added to the fixture
   */

  create(markup) {
    markup = markup || '';
    this.element = document.createElement('div');
    this.element.id = 'fixture';
    this.element.innerHTML = markup;

    document.body.appendChild(this.element);
    return this;
  }

  /**
   * Removes the fixture from the DOM
   */

  destroy() {
    if (this.element) {
      document.body.removeChild(this.element);
    }

    return this;
  }

  /**
   * Removes the assets from the DOM
   */

  cleanUp() {
    document.body.removeChild(this.style);
    return this;
  }
};
