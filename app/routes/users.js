'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Crop = traceur.require(__dirname + '/../models/crop.js');

exports.startdepletion = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    res.send({user:user});
  });
};

exports.depletion = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    user.food -= user.consumption;
    user.save(()=>{
      res.render('users/dashboard', {user:user});
    });
  });
};

exports.login = (req, res)=>{
  User.login(req.body.username, user => {
    user.save(()=>{
      res.render('users/dashboard', {user:user});
    });
  });
};

exports.dashboard = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    res.render('users/dashboard', {user:user});
  });
};

exports.inventory = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    res.render('users/inventory', {user:user});
  });
};

exports.buy = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    var crop = new Crop(req.body.type);
    user.buy(crop, req.body.qty, ()=>{
      user.save(()=>{
        res.render('users/inventory', {user:user});
      });
    });
  });
};
