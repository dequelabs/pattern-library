'use strict';

const assert = require('chai').assert;
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');
const queryAll = require('../../../lib/commons/query-all');
const getAdjacentItem = require('../../../lib/commons/get-adjacent-item/');

describe('commons/get-adjacent-item', () => {
  let fixture, menu, items;

  before(() => fixture = new Fixture());
  beforeEach(() => {
    fixture.create(snippet);
    menu = fixture.element.querySelector('[role="menu"]');
    items = queryAll('[role="menuitem"]', menu);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  it('should return undefined if it cant find items', () => {
    // passing in the menu (rather than a menuitem)
    // so it wont be able to find any menu items
    const adjacentItem = getAdjacentItem(menu);
    assert.isUndefined(adjacentItem);
  });

  it('should handle a direction of "down" properly', () => {
    const adjacentItem = getAdjacentItem(items[0], 'down');
    assert.equal(adjacentItem, items[1]);
  });

  it('should handle a direction of "up" properly', () => {
    const adjacentItem = getAdjacentItem(items[1], 'up');
    assert.equal(adjacentItem, items[0]);
  });

  it('should be circular', () => {
    const adjacentItem = getAdjacentItem(items[0], 'up');
    assert.equal(adjacentItem, items[items.length -1]);
  });
});
