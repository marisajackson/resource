'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.index = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    res.render('workers/index', {user:user});
  });
};

exports.hire = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    user.hire(req.params.type, ()=>{
      user.save(()=>{
        res.render('workers/index', {user:user});
      });
    });

  });
};
