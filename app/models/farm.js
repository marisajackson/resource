'use strict';

var farms = global.nss.db.collection('farms');
// var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class Farm {
  constructor(userId){
    this.userId = userId;
    this.plots = [];
    this.initPlots();
  }

  initPlots(){
    for(var i = 0; i < 9; i++){
      var plot = {};
      plot.isAvailable = i === 0 ? true : false;
      plot.crop = {};
      plot.cost = Math.pow(10, i);
      this.plots.push(plot);
    }
  }

  save(fn){
    farms.save(this, ()=>fn());
  }

  static make(userId, fn){
    userId = Mongo.ObjectID(userId);
    farms.findOne({userId:userId}, (err, farm)=>{
      if(farm){
        farm = _.create(Farm.prototype, farm);
        fn(farm);
      } else {
        farm = new Farm(userId);
        fn(farm);
      }
    });
  }

  static findByUserId(userId, fn){
    userId = Mongo.ObjectID(userId);
    farms.findOne({userId:userId}, (err, farm)=>{
      farm = _.create(Farm.prototype, farm);
      fn(farm);
    });
  }
}


module.exports = Farm;
