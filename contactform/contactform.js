jQuery(document).ready(function($) {
  "use strict";

  // Contact
  $('form.contactForm').submit(function() {
    var f = $(this).find('.form-group'),
      ferror = false,
      phoneExp = /^\d{10}$/; // Regular expression for a 10-digit phone number

    f.children('input').each(function() {
      var i = $(this);
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false;
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'phone':
            if (!phoneExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (!i.prop('checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'Wrong input') : '')).show('blind');
      }
    });

    // Additional validation for phone number field
    var phoneField = $('input[name="phone"]');
    if (!phoneExp.test(phoneField.val())) {
      ferror = true;
      phoneField.next('.validation').html('Invalid phone number').show('blind');
    }

    if (ferror) {
      return false;
    } else {
      var str = $(this).serialize();
      $.ajax({
        type: "POST",
        url: "https://script.google.com/macros/s/AKfycby3zl11uIwU-nPOmX9B7hdO1yGwPGu5tOISoJo8I6jv1sMGoZXRhUvb9Z9k0a6vVI2t/exec",
        data: str,
        success: function(msg) {
          console.log(msg);
          if (msg.result === 'success') {
            $("#sendmessage").addClass("show");
            $("#errormessage").removeClass("show");
            $('.contactForm').find("input, textarea").val("");
          } else {
            $("#sendmessage").removeClass("show");
            $("#errormessage").addClass("show");
            $('#errormessage').html(msg);
          }
        }
      });
      return false;
    }
  });
});
