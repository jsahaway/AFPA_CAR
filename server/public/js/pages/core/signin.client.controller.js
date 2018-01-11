var signInController = {
  init: function() {
    $('#loginBtn').click(function() {
      var form = {
        email: $('input[name="email"]').val(),
        password: $('input[name="password"]').val()
      };

      $.ajax({
        method: 'POST',
        url: '/api/users/auth',
        data: form
      })
      .done(function() {
        window.location.replace('/home');
      })
      .catch(function(xhr) {
        var data = xhr.responseJSON;
        Kovoit.pushNotification('error', data.errors);
      });
    });
  }
};

window.onload = signInController.init;