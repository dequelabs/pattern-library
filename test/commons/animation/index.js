'use strict';


describe('commons/animation', () => {
  describe('animate', () => {
    it('should call debug if the target is null');
    it('should call debug if no setup and animate classes are provided');

    it('should default to adding the classes');
    it('should remove the classes if config.method is "remove"');
    it('should use the default timeouts if none are provided');
    it('should use the provided duration for the timeouts');
  });

  describe('slideUp', () => {
    it('should remove the proper classes');
  });

  describe('slideToggle', () => {
    describe('given an element that is already visible', () => {
      it('should slideUp');
    });

    describe('given an element that is not visible', () => {
      it('should slideDown');
    });
  });
});
