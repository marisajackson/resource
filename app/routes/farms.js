'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
// var farms = global.nss.db.collection('farms');
var Farm = traceur.require(__dirname + '/../models/farm.js');


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
