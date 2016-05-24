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
  var $password = jQuery('#password');

  $mainLoginEmail.find('button[type="submit"]').on('click', function (e) {
    e.preventDefault(); // don't submit just yet...
    var isValid = validate($email, 'email');
    if (isValid) {
      flyIn({
        animate: 'right',
        $hide: $mainLoginEmail,
        $show: $mainLoginPassword,
        fillIn: {
          text: $email.val(),
          $target: jQuery('#user-email-display, #user-email')
        },
        $focus: $password
      });
    }
  });

  $mainLoginPassword.find('button[type="submit"]').on('click', function (e) {
    e.preventDefault(); // don't submit just yet...
    var isValid = validate($password);
    if (isValid) {
      jQuery(this).closest('form').submit();
    }
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
    var isValid = validate(jQuery('#forgot-password-email'), 'email');

    if (isValid) {
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
    }
  });

  $resetPassword.find('button[type="submit"]').on('click', function (e) {
    e.preventDefault();
    var isValid = validate($resetPassword.find('.dqpl-text-input'), 'match');
  });

  $twoFactor.find('button[type="submit"]').on('click', function (e) {
    e.preventDefault();
    validate(jQuery('#authentication-code'));
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

  function validate($field, type) {
    // clean up
    $field.removeClass('dqpl-error');
    jQuery('.error-message').remove();
    var valid = true;
    var val = $field.val();
    if (!val) {
      valid = false;
    } else if (type && type === 'email') {
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      valid = emailRegex.test(val);
    } else if (type && type === 'match') {
      var thisVal;
      $field.each(function (_, field) {
        var $thisField = jQuery(field);
        if (!thisVal) {
          thisVal = $thisField.val();
        } else {
          if (thisVal !== $thisField.val()) {
            valid = false;
          }
        }
      });
    }

    if (!valid) {
      var $error = jQuery('<div class="error-message" />');
      var errMsg = $field.first().attr('data-error-message'); // using this so the messages can be localized
      $error.text(errMsg);
      $error.prop('id', $field.first().prop('id') + '-error');
      $field.addClass('dqpl-error').first().parent().append($error);
      $field.attr('aria-describedby', $error.prop('id')).first().focus();
    }

    return valid;
  }
}());
