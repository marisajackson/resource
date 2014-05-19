'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
// var farms = global.nss.db.collection('farms');
var Farm = traceur.require(__dirname + '/../models/farm.js');
var Crop = traceur.require(__dirname + '/../models/crop.js');


exports.harvest = (req, res)=>{
  Farm.findByUserId(req.params.userId, farm=>{
    User.findByUserId(req.params.userId, user=>{
      user.cash += farm.plots[req.body.plot].crop.cashValue;
      user.food += farm.plots[req.body.plot].crop.foodValue;
      farm.plots[req.body.plot].crop = {};
      farm.plots[req.body.plot].isAvailable = true;
      user.save(()=>{
        farm.save(()=>{
          res.render('farm/farm', {farm:farm});
        });
      });
    });
  });
};

exports.mature = (req, res)=>{
  Farm.findByUserId(req.params.userId, farm=>{
    farm.plots[req.body.plot].crop.isMature = true;
    farm.plots[req.body.plot].isGrowing = false;
    farm.save(()=>{
      res.render('farm/farm', {farm:farm});
    });
  });
};

exports.grow = (req, res)=>{
  Farm.findByUserId(req.params.userId, farm=>{
    var crop = farm.plots[req.query.plot].crop;
    res.send(crop);
  });
};

exports.plant = (req, res)=>{
  Farm.findByUserId(req.params.userId, farm=>{
    User.findByUserId(req.params.userId,user=>{
      if(user.seeds[req.body.crop] > 0){
          user.seeds[req.body.crop] -= 1;
          farm.plots[req.body.plot].crop = new Crop(req.body.crop);
          farm.plots[req.body.plot].isGrowing = true;
          farm.plots[req.body.plot].isAvailable = false;
          user.save(()=>{
            farm.save(()=>{
              console.log(farm.plots[req.body.plot].crop);
              res.render('farm/farm', {farm:farm});
            });
          });
      } else {
        res.send(null);
      }
    });
  });
};

exports.showfarm = (req, res)=>{
  Farm.make(req.params.userId, farm=>{
    User.findByUserId(req.params.userId, user=>{
      farm.save(()=>{
        user.farmId = farm._id;
        user.save(()=>{
          res.render('farm/farm', {farm:farm});
        });
      });
    });
  });
};

exports.buyplot = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    Farm.findByUserId(req.params.userId, farm=>{
      if(user.cash >= farm.plots[req.body.plot].cost){
        farm.plots[req.body.plot].isAvailable = true;
        user.cash -= farm.plots[req.body.plot].cost;
        user.save(()=>{
          farm.save(()=>{
            res.render('farm/farm', {farm:farm});
          });
        });
      } else {
        res.render('farm/farm', {farm:farm});
      }
    });
  });
};
