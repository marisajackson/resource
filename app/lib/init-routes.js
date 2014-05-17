'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  // var home = traceur.require(__dirname + '/../routes/home.js');
  var game = traceur.require(__dirname + '/../routes/game.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var farms = traceur.require(__dirname + '/../routes/farms.js');

  app.get('/', dbg, game.index);

  app.post('/login', dbg, users.login);
  app.get('/users/dashboard/:userId', dbg, users.dashboard);

  app.post('/farm/:userId', dbg, farms.showfarm);
  app.put('/buyplot/:userId', dbg, farms.buyplot);


  console.log('Routes Loaded');
  fn();
}
