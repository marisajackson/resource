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
  var market = traceur.require(__dirname + '/../routes/market.js');
  var workers = traceur.require(__dirname + '/../routes/workers.js');
  // var trees = traceur.require(__dirname + '/../routes/trees.js');

  app.get('/', dbg, game.index);

  app.post('/login', dbg, users.login);
  app.get('/users/dashboard/:userId', dbg, users.dashboard);
  app.put('/buy/:userId/:item', dbg, users.buy);
  app.get('/users/inventory/:userId', dbg, users.inventory);
  app.get('/start/:userId', dbg, users.startdepletion);
  app.put('/deplete/:userId', dbg, users.depletion);

  app.get('/workers/:userId', dbg, workers.index);
  app.put('/hire/:userId/:type', dbg, workers.hire);

  app.post('/farm/:userId', dbg, farms.showfarm);
  app.put('/buyplot/:userId', dbg, farms.buyplot);
  app.put('/plant/:userId', dbg, farms.plant);
  app.get('/grow/:userId', dbg, farms.grow);
  app.put('/mature/:userId', dbg, farms.mature);
  app.put('/harvest/:userId', dbg, farms.harvest);

  // app.post('/trees/plant', dbg, trees.plant);
  // app.get('/trees', dbg, trees.forest);
  // app.put('/trees/:treeId/grow', dbg, trees.grow);
  // app.put('/trees/:treeId/chop/:userId', dbg, trees.chop);
  // app.put('/users/sell/:userId', dbg, users.sell);
  // app.put('/users/:userId/purchase/:item', dbg, users.purchase);

  app.get('/market', dbg, market.index);


  console.log('Routes Loaded');
  fn();
}
