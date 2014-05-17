/*jshint unused: false*/

function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  'use strict';
  $.ajax({
    url: url,
    type: type,
    dataType: dataType,
    data: data,
    success: success
  });
}

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#dashboard').on('click','#showfarm', farm);
    $('#economy').on('click', '.buy', buyPlot);
  }

  function buyPlot(){
    var userId = $('#user').attr('data-id');
    var plot = $(this).closest('.plot').attr('data-plot');
    ajax('/buyplot/'+userId, 'put', {plot: plot}, html=>{
      $('#economy').empty().append(html);
      dashboard();
    });
  }

  function farm(){
    var userId = $('#user').attr('data-id');
    ajax('/farm/'+userId, 'post', null, html=>{
      $('#economy').empty().append(html);
    });
  }

  function login(){
    var username = $('#username').val();
    ajax('/login', 'post', {username:username}, html=>{
      $('#dashboard').empty().append(html);
    });
  }

  function dashboard(){
    var userId = $('#user').attr('data-id');
    ajax(`/users/dashboard/${userId}`, 'get', null, html=>{
      $('#dashboard').empty().append(html);
    });
  }




})();
