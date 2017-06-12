'use strict';

const assert = require('chai').assert;
const Classlist = require('classlist');
const proxyquire = require('proxyquire');
const animation = require('../../../lib/commons/animation/');

describe('commons/animation', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => document.body.removeChild(element));

  describe('animate', () => {
    it('should call debug if the target is null', () => {
      let called = false;
      proxyquire('../../../lib/commons/animation/', {
        'debug': () => {
          return function () { called = true; };
        }
      }).animate(null);
      assert.isTrue(called);
    });

    it('should call debug if no setup and animate classes are provided', () => {
      let called = false;
      proxyquire('../../../lib/commons/animation/', {
        'debug': () => {
          return function () { called = true; };
        }
      }).animate(element, {});
      assert.isTrue(called);
    });

    it('should default to adding the classes', (done) => {
      animation.animate(element, {
        setupClass: 'setup-class',
        animateClass: 'animate-class'
      }, () => {
        const cl = Classlist(element);
        assert.isTrue(cl.contains('setup-class'));
        assert.isTrue(cl.contains('animate-class'));
        done();
      });
    });

    it('should remove the classes if config.method is "remove"', (done) => {
      Classlist(element).add('foo').add('bar');
      animation.animate(element, {
        method: 'remove',
        setupClass: 'foo',
        animateClass: 'bar'
      }, () => {
        const cl = Classlist(element);
        assert.isFalse(cl.contains('foo'));
        assert.isFalse(cl.contains('bar'));
        done();
      });
    });

    it('should use the default timeouts if none are provided', (done) => {
      Classlist(element).add('foo').add('bar');
      animation.animate(element, {
        method: 'remove',
        setupClass: 'foo',
        animateClass: 'bar'
      });
      assert.isTrue(Classlist(element).contains('bar'));

      setTimeout(() => {
        assert.isFalse(Classlist(element).contains('foo'));
        assert.isFalse(Classlist(element).contains('bar'));
        done();
      }, 450);
    });

    it('should use the provided duration for the timeouts', (done) => {
      animation.animate(element, {
        method: 'add',
        setupClass: 'foo',
        animateClass: 'bar',
        duration: 0
      });

      setTimeout(() => {
        assert.isTrue(Classlist(element).contains('foo'));
        assert.isTrue(Classlist(element).contains('bar'));
        done();
      }, 50);
    });
  });

  describe('slideDown', () => {
    it('should add the proper classes', (done) => {
      assert.isFalse(Classlist(element).contains('dqpl-slidedown'));
      assert.isFalse(Classlist(element).contains('dqpl-slidedown-setup'));

      animation.slideDown(element, () => {
        assert.isTrue(Classlist(element).contains('dqpl-slidedown'));
        assert.isTrue(Classlist(element).contains('dqpl-slidedown-setup'));
        done();
      }, 0);
    });
  });

  describe('slideUp', () => {
    it('should remove the proper classes', (done) => {
      Classlist(element).add('dqpl-slidedown').add('dqpl-slidedown-setup');

      animation.slideUp(element, () => {
        assert.isFalse(Classlist(element).contains('dqpl-slidedown'));
        assert.isFalse(Classlist(element).contains('dqpl-slidedown-setup'));
        done();
      }, 0);
    });
  });

  describe('slideToggle', () => {
    describe('given an element that is already visible', () => {
      it('should slideUp', (done) => {
        Classlist(element).add('dqpl-slidedown').add('dqpl-slidedown-setup');

        animation.slideToggle(element, () => {
          assert.isFalse(Classlist(element).contains('dqpl-slidedown'));
          assert.isFalse(Classlist(element).contains('dqpl-slidedown-setup'));
          done();
        }, 0);
      });
    });

    describe('given an element that is not visible', () => {
      it('should slideDown', (done) => {
        assert.isFalse(Classlist(element).contains('dqpl-slidedown'));
        assert.isFalse(Classlist(element).contains('dqpl-slidedown-setup'));

        animation.slideToggle(element, () => {
          assert.isTrue(Classlist(element).contains('dqpl-slidedown'));
          assert.isTrue(Classlist(element).contains('dqpl-slidedown-setup'));
          done();
        }, 0);
      });
    });
  });

  describe('fadeIn', () => {
    it('should add the proper classes', (done) => {
      assert.isFalse(Classlist(element).contains('dqpl-fadein'));
      assert.isFalse(Classlist(element).contains('dqpl-fadein-setup'));

      animation.fadeIn(element, () => {
        assert.isTrue(Classlist(element).contains('dqpl-fadein'));
        assert.isTrue(Classlist(element).contains('dqpl-fadein-setup'));
        done();
      }, 0);
    });
  });

  describe('fadeOut', () => {
    it('shoud remove the proper classes', (done) => {
      Classlist(element).add('dqpl-fadein').add('dqpl-fadein-setup');

      animation.fadeOut(element, () => {
        assert.isFalse(Classlist(element).contains('dqpl-fadein'));
        assert.isFalse(Classlist(element).contains('dqpl-fadein-setup'));
        done();
      }, 0);
    });
  });

  describe('fadeToggle', () => {
    describe('given an already vible element', () => {
      it('should remove the proper classes', (done) => {
        Classlist(element).add('dqpl-fadein').add('dqpl-fadein-setup');

        animation.fadeToggle(element, () => {
          assert.isFalse(Classlist(element).contains('dqpl-fadein'));
          assert.isFalse(Classlist(element).contains('dqpl-fadein-setup'));
          done();
        }, 0);
      });
    });

    describe('given an invisible element', () => {
      it('should add the proper classes', (done) => {
        assert.isFalse(Classlist(element).contains('dqpl-fadein'));
        assert.isFalse(Classlist(element).contains('dqpl-fadein-setup'));

        animation.fadeToggle(element, () => {
          assert.isTrue(Classlist(element).contains('dqpl-fadein'));
          assert.isTrue(Classlist(element).contains('dqpl-fadein-setup'));
          done();
        }, 0);
      });
    });
  });
});
