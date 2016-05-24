(function () {
  'use strict';

  jQuery('.step-1 button[type="submit"]').on('click', function (e) {
    e.preventDefault(); // don't submit just yet...
    // TODO: validation
    step2();
  });

  jQuery('#forgot-password button[type="submit"]').on('click', function (e) {
    e.preventDefault(); // don't submit just yet...
    slideIn(jQuery('#forgot-password'), jQuery('#forgot-password-sent'), jQuery('#forgot-password-sent'));
    var email = jQuery('#forgot-password-email').val();
    jQuery('#email-sent-to').text(email);
  });

  jQuery('.different-email, .back-to-sign-in').on('click', step1);

  jQuery('.forgot-password').on('click', function () {
    slideIn(jQuery('.step-1, .step-2'), jQuery('#forgot-password'), jQuery('#forgot-password-email'));
    jQuery('#forgot-password-email').val(jQuery('#email').val());
  });

  function step2() {
    var emailVal = jQuery('#email').val();
    jQuery('#user-email-display').text(emailVal);
    jQuery('#user-email').val(emailVal);
    slideIn(jQuery('.step-1, #forgot-password'), jQuery('.step-2'), jQuery('#password'));
  }

  function step1() {
    slideIn(
      jQuery('#forgot-password, .step-2, #two-factor, #reset-password-wrap'),
      jQuery('.step-1'),
      jQuery('#email')
    );
  }

  function slideIn($hiders, $animater, $focus) {
    $hiders.hide();
    $hiders.removeClass('tile-show animate');
    
    $animater.show().addClass('tile-show');
    setTimeout(function () {
      $animater.addClass('animate');
      if ($focus) {
        $focus.focus();
      }
    });
  }
}());
