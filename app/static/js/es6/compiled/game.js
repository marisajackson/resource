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
  var autoHarvest = false;
  var harvestTimer;
  function init() {
    $('#login').click(login);
    $('#farm').on('click', '.buy', buyPlot);
    $('#farm').on('click', '.plant', plant);
    $('#farm').on('click', '.harvest', harvest);
    $('#market').on('click', '.buyseed', buySeed);
    $('#workers').on('click', '.harvester', hire);
    $('#workers').on('click', '.harvestWorker', workerHarvest);
  }
  function workerHarvest() {
    autoHarvest = !autoHarvest;
    $('#harvester').toggleClass('on');
    if (autoHarvest) {
      start('harvest');
    } else {
      clearInterval(harvestTimer);
    }
  }
  function start(timer) {
    switch (timer) {
      case 'harvest':
        harvestTimer = setInterval(harvesting, 1000);
        break;
    }
  }
  function harvesting() {
    var userId = $('#user').attr('data-id');
    $('.plot > .plot-controls > .harvest').map((function(i, d) {
      return $(d).parent().parent().attr('data-plot');
    })).each((function(i, v) {
      var plot = v;
      ajax(("/harvest/" + userId), 'put', {plot: plot}, (function(html) {
        $('#farm').empty().append(html);
        dashboard();
      }));
    }));
  }
  function hire() {
    var userId = $('#user').attr('data-id');
    var workerType = $(this).attr('class');
    ajax(("/hire/" + userId + "/" + workerType), 'put', null, (function(html) {
      $('#workers').append(html);
      dashboard();
    }));
  }
  function buySeed() {
    var userId = $('#user').attr('data-id');
    var qty = $('#cropqty').val();
    var type = $('#croptype').val();
    ajax(("/buy/" + userId + "/seed"), 'put', {
      qty: qty,
      type: type
    }, (function(html) {
      $('#inventory').empty().append();
      dashboard();
    }));
  }
  function harvest() {
    var userId = $('#user').attr('data-id');
    var plot = $(this).closest('.plot').attr('data-plot');
    ajax(("/harvest/" + userId), 'put', {plot: plot}, (function(html) {
      $('#farm').empty().append(html);
      dashboard();
    }));
  }
  function startTimer(rate, type, fn) {
    var timer;
    var counter = 1;
    timer = setInterval(function() {
      if (type === 'crop') {
        if (counter < rate) {
          counter++;
          console.log('growing...');
          $('#timer').text(counter);
        } else {
          fn();
          clearInterval(timer);
        }
      }
      if (type === 'depletion') {
        if ((counter % rate) !== 0) {
          counter++;
          console.log('depleting...');
          $('#timer').text(counter);
        } else {
          fn();
          counter++;
        }
      }
    }, 1000);
  }
  function plant() {
    var userId = $('#user').attr('data-id');
    var plot = $(this).closest('.plot').attr('data-plot');
    var crop = $(this).siblings('#crop').val().toLowerCase();
    ajax(("/plant/" + userId), 'put', {
      plot: plot,
      crop: crop
    }, (function(html) {
      if (html) {
        $('#farm').empty().append(html);
        inventory();
        ajax(("/grow/" + userId), 'get', {plot: plot}, (function(crop) {
          startTimer(crop.growthRate, 'crop', (function() {
            ajax(("/mature/" + userId), 'put', {plot: plot}, (function(html) {
              $('#farm').empty().append(html);
            }));
          }));
        }), 'json');
      }
    }));
  }
  function buyPlot() {
    var userId = $('#user').attr('data-id');
    var plot = $(this).closest('.plot').attr('data-plot');
    ajax('/buyplot/' + userId, 'put', {plot: plot}, (function(html) {
      $('#farm').empty().append(html);
      dashboard();
    }));
  }
  function farm() {
    var userId = $('#user').attr('data-id');
    ajax('/farm/' + userId, 'post', null, (function(html) {
      $('#farm').empty().append(html);
    }));
  }
  function login() {
    var username = $('#username').val();
    ajax('/login', 'post', {username: username}, (function(html) {
      $('#dashboard').empty().append(html);
      farm();
      market();
      workers();
      inventory();
    }));
  }
  function inventory() {
    var userId = $('#user').attr('data-id');
    ajax(("/users/inventory/" + userId), 'get', null, (function(html) {
      $('#inventory').empty().append(html);
    }));
  }
  function market() {
    ajax('/market', 'get', null, (function(html) {
      $('#market').empty().append(html);
    }));
  }
  function workers() {
    var userId = $('#user').attr('data-id');
    ajax(("/workers/" + userId), 'get', null, (function(html) {
      $('#workers').empty().append(html);
    }));
  }
  function dashboard() {
    var userId = $('#user').attr('data-id');
    ajax(("/users/dashboard/" + userId), 'get', null, (function(html) {
      $('#dashboard').empty().append(html);
      inventory();
      workers();
    }));
  }
})();

//# sourceMappingURL=game.map
