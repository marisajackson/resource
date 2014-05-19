'use strict';

// var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var _ = require('lodash');

class Tree {
  constructor(userId){
    this.userId = userId;
    this.height = 0;
    this.isHealthy = true;
    this.isChopped = false;
  }

  save(fn){
    trees.save(this, ()=>fn());
  }

  chop(user){
    user.wood += this.height/2;
    this.height = 0;
    this.isHealthy = false;
    this.isChopped = true;
  }

  grow(){
    var max = this.isAdult ? this.height*0.10 : 2;
    this.height+= _.random(0, max, true);
    var deathMax = this.isAdult ? (200-(this.height/12)*0.1) : 200;
    if(deathMax < 10){
      deathMax = 10;
    }
    var random = _.random(0, deathMax, true);
    this.isHealthy = random > 1;
  }

  get isBeanStalk(){
    return (this.height / 12) >= 10000;
  }

  get isGrowable(){
    return this.isHealthy && !this.isBeanStalk;
  }

  get isChoppable(){
    return this.isAdult && this.isHealthy && !this.isBeanStalk;
  }

  get isAdult(){
    return this.height >= 48;
  }

  get classes(){
    var classes = [];
    if(this.height === 0){
      classes.push('seed');
    } else if(this.height < 12){
      classes.push('sapling');
    } else if(!this.isAdult){
      classes.push('treenager');
    } else {
      classes.push('adult');
    }

    if(!this.isHealthy){
      classes.push('dead');
    } else {
      classes.push('alive');
    }

    if(this.isChopped){
      classes.push('chopped');
    } else {
      classes.push('growing');
    }

    if(this.isBeanStalk){
      classes.push('beanstalk');
    }

    return classes.join(' ');
  }

  static findByTreeId(treeId, fn){
    treeId = Mongo.ObjectID(treeId);
    trees.findOne({_id:treeId}, (err, tree)=>{
      tree = _.create(Tree.prototype, tree);
      fn(tree);
    });
  }

  static findAllByUserId(userId, fn){
    userId = Mongo.ObjectID(userId);
    trees.find({userId:userId}).toArray((err, objs)=>{
      var forest = objs.map(o=>_.create(Tree.prototype, o));
      fn(forest);
    });
  }

  static plant(userId, fn){
    userId = Mongo.ObjectID(userId);
    var tree = new Tree(userId);
    trees.save(tree, ()=>fn(tree));
  }
}

module.exports = Tree;
