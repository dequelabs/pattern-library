'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const fire = require('simulant').fire;
const Fixture = require('../../fixture');
const snippet = require('./snippet-empty-menu.html');
const init = require('../../../lib/composites/landmarks-menu/init');
const createMenu = require('../../../lib/composites/landmarks-menu/create-landmark-menu');

describe('composites/landmarks-menu/init', () => {
  it('should test focusin / focusout but can not be triggered in a phantomjs dom');
});
