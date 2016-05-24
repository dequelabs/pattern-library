(function () {
  'use strict';

  // sections
  var $mainLoginEmail = jQuery('#login-email-section');
  var $mainLoginPassword = jQuery('#login-password-section');
  var $forgotPassword = jQuery('#forgot-password-section');
  var $forgotPasswordSent = jQuery('#forgot-password-sent-section');
  var $resetPassword = jQuery('#reset-password-section');
  var $twoFactor = jQuery('#two-factor-section');
  var $email = jQuery('#email');

  $mainLoginEmail.find('button[type="submit"]').on('click', function (e) {
    e.preventDefault(); // don't submit just yet...
    flyIn({
      animate: 'right',
      $hide: $mainLoginEmail,
      $show: $mainLoginPassword,
      fillIn: {
        text: $email.val(),
        $target: jQuery('#user-email-display, #user-email')
      },
      $focus: jQuery('#password')
    });
  });

  $mainLoginPassword.find('.forgot-password').on('click', function () {
    var $input = jQuery('#forgot-password-email');
    flyIn({
      animate: 'fade',
      $hide: $mainLoginPassword,
      $show: $forgotPassword,
      fillIn: {
        text: $email.val(),
        $target: $input
      },
      $focus: $input
    });
  });

  $mainLoginPassword.find('.different-email').on('click', function () {
    console.log('yoep~!');
    flyIn({
      animate: 'left',
      $hide: $mainLoginPassword,
      $show: $mainLoginEmail,
      $focus: $email
    });
  });

  $forgotPassword.find('.back-to-sign-in').on('click', function () {
    flyIn({
      animate: 'left',
      $hide: $forgotPassword,
      $show: $mainLoginEmail,
      $focus: $email
    });
  });

  $forgotPassword.find('button[type="submit"]').on('click', function (e) {
    e.preventDefault();
    flyIn({
      animate: 'fade',
      $hide: $forgotPassword,
      $show: $forgotPasswordSent,
      $focus: $forgotPasswordSent,
      fillIn: {
        text: jQuery('#forgot-password-email').val(),
        $target: jQuery('#email-sent-to')
      }
    });
  });

  /**
   * Handles toggling different sections
   * @param  {Object} opts $hide and $show are required. The rest are optional (animate, fillIn and $focus)
   */
  function flyIn(opts) {
    // hide
    opts.$hide.removeClass('active setup left right fade');

    // fill in value(s)
    if (opts.fillIn) {
      opts.fillIn.$target.each(function (_, el) {
        var $el = jQuery(el);
        if ($el.is('input')) {
          $el.val(opts.fillIn.text);
        } else {
          $el.text(opts.fillIn.text);
        }
      });
    }

    // show
    var $show = opts.$show;
    var animation = opts.animate || 'fade';
    $show.addClass('setup ' + animation);
    $show.addClass('active');
    setTimeout(function () {
      $show.removeClass(animation + ' setup');
      // focus
      if (opts.$focus) {
        opts.$focus.focus();
      }
    }, 10);
  }
}());
