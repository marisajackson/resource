'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

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
