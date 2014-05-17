function ajax(url, type) {
  'use strict';
  var data = arguments[2] !== (void 0) ? arguments[2] : {};
  var success = arguments[3] !== (void 0) ? arguments[3] : (function(r) {
    return console.log(r);
  });
  var dataType = arguments[4] !== (void 0) ? arguments[4] : 'html';
  $.ajax({
    url: url,
    type: type,
    dataType: dataType,
    data: data,
    success: success
  });
}
(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#dashboard').on('click', '#showfarm', farm);
    $('#economy').on('click', '.buy', buyPlot);
  }
  function buyPlot() {
    var userId = $('#user').attr('data-id');
    var plot = $(this).closest('.plot').attr('data-plot');
    ajax('/buyplot/' + userId, 'put', {plot: plot}, (function(html) {
      $('#economy').empty().append(html);
      dashboard();
    }));
  }
  function farm() {
    var userId = $('#user').attr('data-id');
    ajax('/farm/' + userId, 'post', null, (function(html) {
      $('#economy').empty().append(html);
    }));
  }
  function login() {
    var username = $('#username').val();
    ajax('/login', 'post', {username: username}, (function(html) {
      $('#dashboard').empty().append(html);
    }));
  }
  function dashboard() {
    var userId = $('#user').attr('data-id');
    ajax(("/users/dashboard/" + userId), 'get', null, (function(html) {
      $('#dashboard').empty().append(html);
    }));
  }
})();

//# sourceMappingURL=game.map
