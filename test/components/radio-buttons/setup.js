'use strict';

const assert = require('chai').assert;
const CustomEvent = require('custom-event');
const Classlist = require('classlist');
const proxyquire = require('proxyquire');
const simulant = require('simulant');
const queryAll = require('../../../lib/commons/query-all');
const Fixture = require('../../fixture');
const snippet = require('./snippet.html');
const setup = require('../../../lib/components/radio-buttons/setup');
const disabledIndex = 2;
const selectedIndex = 0;

describe('components/radio-buttons/setup', () => {
  let fixture, radios;

  before(() => {
    fixture = new Fixture();
  });

  beforeEach(() => {
    fixture.create(snippet);
    setup();
    radios = queryAll('.dqpl-radio', fixture.element);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('attrs/props/markup', () => {
    it('should properly set aria-checked, aria-setsize, and aria-posinset', () => {
      radios.forEach((r, i) => {
        const isSelected = i === 0;
        assert.equal(r.getAttribute('aria-checked'), isSelected ? 'true' : 'false');
        assert.equal(r.getAttribute('aria-setsize'), radios.length);
        assert.equal(r.getAttribute('aria-posinset'), i + 1);
      });
    });

    it('should warn if role="radio" is missing', () => {
      fixture.destroy();
      fixture.create(snippet);
      radios = queryAll('.dqpl-radio', fixture.element);

      radios[0].removeAttribute('role');
      let warned = false;
      proxyquire('../../../lib/components/radio-buttons/setup', {
        'debug': () => {
          return function() {
            warned = true;
          };
        }
      })();
      assert.isTrue(warned);
    });

    it('should create the inner radio elements', () => {
      radios.forEach((r, i) => {
        const inner = r.querySelector('.dqpl-inner-radio');
        assert.isTrue(!!inner);
        let c = i === selectedIndex ? 'fa-dot-circle-o' : 'fa-circle-o';
        c = i === disabledIndex ? 'fa-circle' : c;
        assert.isTrue(Classlist(inner).contains(c));
      });
    });
  });

  describe('radio label', () => {
    it('should setup label clicks to match native radio behavior', () => {
      const radioLabel = fixture.element.querySelector('.dqpl-label');
      const radio = radios[0];
      let clicked = false;
      radio.addEventListener('click', () => clicked = true);
      simulant.fire(radioLabel, 'click');
      assert.equal(document.activeElement, radio);
      assert.isTrue(clicked);
    });
  });

  describe('events', () => {
    describe('clicks on radios', () => {
      it('should set the clicked radio as selected (and unselect previously selected)', () => {
        assert.equal(radios[0].getAttribute('aria-checked'), 'true');
        simulant.fire(radios[1], 'click');
        assert.equal(radios[0].getAttribute('aria-checked'), 'false');
        assert.equal(radios[1].getAttribute('aria-checked'), 'true');
      });

      it('should do nothing if the radio is disabled', () => {
        assert.equal(radios[0].getAttribute('aria-checked'), 'true');
        simulant.fire(radios[disabledIndex], 'click');
        assert.equal(radios[0].getAttribute('aria-checked'), 'true');
      });
    });

    describe('keydowns on radios', () => {
      describe('disabled target', () => {
        it('should do nothing', () => {
          assert.equal(radios[0].getAttribute('aria-checked'), 'true');
          simulant.fire(radios[disabledIndex], 'keydown', { which: 32 });
          assert.equal(radios[0].getAttribute('aria-checked'), 'true');
        });
      });

      describe('space', () => {
        it('should click the radio', () => {
          const radio = radios[1];
          assert.equal(radio.getAttribute('aria-checked'), 'false');
          simulant.fire(radio, 'keydown', { which: 32 });
          assert.equal(radio.getAttribute('aria-checked'), 'true');
        });
      });

      describe('left / up', () => {
        it('should select previous radio', () => {
          const radio = radios[1];

          simulant.fire(radio, 'click'); // "check" the 2nd radio
          assert.equal(radio.getAttribute('aria-checked'), 'true');
          simulant.fire(radio, 'keydown', { which: 37 });
          assert.equal(radio.getAttribute('aria-checked'), 'false');
          assert.equal(radios[0].getAttribute('aria-checked'), 'true');
        });
      });

      describe('right / down', () => {
        it('should select next radio', () => {
          const radio = radios[0];
          assert.equal(radio.getAttribute('aria-checked'), 'true');
          simulant.fire(radio, 'keydown', { which: 39 });
          assert.equal(radio.getAttribute('aria-checked'), 'false');
          assert.equal(radios[1].getAttribute('aria-checked'), 'true');
        });

        it('should handle changes to element references', () => {
          let radios = queryAll('.dqpl-radio', fixture.element);
          assert.equal(radios[0].getAttribute('aria-checked'), 'true');
          const radioWraps = queryAll('.dqpl-radio-wrap', fixture.element);
          const radioWrap = radioWraps[1];
          const cloneWrap = radioWrap.cloneNode(true);
          radioWrap.parentElement.replaceChild(cloneWrap, radioWrap);
          const clone = cloneWrap.querySelector('[role="radio"]');
          radios = queryAll('.dqpl-radio', fixture.element);
          simulant.fire(radios[1], 'keydown', { which: 37 });
          assert.equal(radios[0].getAttribute('aria-checked'), 'true', 'prev');
          simulant.fire(radios[0], 'keydown', { which: 39 });
          assert.equal(radios[1].getAttribute('aria-checked'), 'true', 'next');
        })
      });
    });

    describe('dqpl:radio:disable', () => {
      it('should disable the radio and set the proper class', () => {
        const radio = radios[0];
        const inner = radio.querySelector('.dqpl-inner-radio');
        const isChecked = radio.getAttribute('aria-checked') === 'true';
        const e = new CustomEvent('dqpl:radio:disable');
        radio.dispatchEvent(e);
        assert.equal(radio.getAttribute('aria-disabled'), 'true');
        assert.isTrue(Classlist(inner).contains(isChecked ? 'fa-dot-circle-o' : 'fa-circle'));
      });
    });
  });
});
